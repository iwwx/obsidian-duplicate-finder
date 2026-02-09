import { App, TFile, Vault } from 'obsidian';
import { FileInfo, DuplicateFinderSettings, ScanProgressCallback } from '../types';

/**
 * 文件扫描器 - 负责遍历 Vault、过滤排除目录、读取内容
 */
export class FileScanner {
  private app: App;
  private settings: DuplicateFinderSettings;

  constructor(app: App, settings: DuplicateFinderSettings) {
    this.app = app;
    this.settings = settings;
  }

  /**
   * 更新设置
   */
  updateSettings(settings: DuplicateFinderSettings): void {
    this.settings = settings;
  }

  /**
   * 扫描所有 Markdown 文件
   */
  async scanFiles(onProgress?: ScanProgressCallback): Promise<FileInfo[]> {
    const vault = this.app.vault;
    const files = vault.getMarkdownFiles();
    const filteredFiles = this.filterFiles(files);
    const fileInfos: FileInfo[] = [];

    const total = filteredFiles.length;

    for (let i = 0; i < filteredFiles.length; i++) {
      const file = filteredFiles[i];

      onProgress?.({
        current: i + 1,
        total,
        phase: 'scanning',
        message: `正在扫描: ${file.path}`,
      });

      const fileInfo = await this.processFile(file);
      if (fileInfo) {
        fileInfos.push(fileInfo);
      }

      // 每处理 50 个文件让出主线程
      if (i % 50 === 0) {
        await this.yieldToMain();
      }
    }

    return fileInfos;
  }

  /**
   * 过滤排除的文件夹
   */
  private filterFiles(files: TFile[]): TFile[] {
    return files.filter((file) => {
      const path = file.path.toLowerCase();
      return !this.settings.excludedFolders.some((folder) => {
        const normalizedFolder = folder.toLowerCase();
        return (
          path.startsWith(normalizedFolder + '/') ||
          path === normalizedFolder
        );
      });
    });
  }

  /**
   * 处理单个文件
   */
  private async processFile(file: TFile): Promise<FileInfo | null> {
    try {
      const content = await this.app.vault.cachedRead(file);

      // 过滤内容过短的文件
      if (content.length < this.settings.minContentLength) {
        return null;
      }

      const contentHash = this.hashContent(content);
      const wordCount = this.countWords(content);

      return {
        path: file.path,
        basename: file.basename,
        content,
        contentHash,
        wordCount,
        file,
      };
    } catch (error) {
      console.error(`Failed to read file: ${file.path}`, error);
      return null;
    }
  }

  /**
   * 简单哈希函数
   */
  private hashContent(content: string): string {
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
      const char = content.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash.toString(16);
  }

  /**
   * 统计字数
   */
  private countWords(content: string): number {
    // 移除 Markdown 语法
    const plainText = content
      .replace(/```[\s\S]*?```/g, '') // 代码块
      .replace(/`[^`]*`/g, '') // 行内代码
      .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // 链接
      .replace(/[#*_~`]/g, '') // Markdown 符号
      .trim();

    // 中英文混合计数
    const chineseChars = (plainText.match(/[\u4e00-\u9fa5]/g) || []).length;
    const englishWords = plainText
      .replace(/[\u4e00-\u9fa5]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length > 0).length;

    return chineseChars + englishWords;
  }

  /**
   * 让出主线程
   */
  private yieldToMain(): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, 0));
  }
}
