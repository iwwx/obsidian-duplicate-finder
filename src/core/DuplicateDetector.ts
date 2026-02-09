import { App } from 'obsidian';
import {
  FileInfo,
  DuplicateGroup,
  DuplicateFinderSettings,
  ScanProgressCallback,
} from '../types';
import { FileScanner } from './FileScanner';
import { SimilarityCalculator } from './SimilarityCalculator';

/**
 * 重复检测协调器 - 协调扫描和相似度计算，生成重复报告
 */
export class DuplicateDetector {
  private app: App;
  private settings: DuplicateFinderSettings;
  private fileScanner: FileScanner;
  private similarityCalculator: SimilarityCalculator;

  constructor(app: App, settings: DuplicateFinderSettings) {
    this.app = app;
    this.settings = settings;
    this.fileScanner = new FileScanner(app, settings);
    this.similarityCalculator = new SimilarityCalculator();
  }

  /**
   * 更新设置
   */
  updateSettings(settings: DuplicateFinderSettings): void {
    this.settings = settings;
    this.fileScanner.updateSettings(settings);
  }

  /**
   * 执行重复检测
   */
  async detectDuplicates(
    onProgress?: ScanProgressCallback
  ): Promise<DuplicateGroup[]> {
    // 扫描文件
    const files = await this.fileScanner.scanFiles(onProgress);

    if (files.length === 0) {
      return [];
    }

    onProgress?.({
      current: 0,
      total: files.length,
      phase: 'comparing',
      message: '正在比较文件...',
    });

    const groups: DuplicateGroup[] = [];
    const processedPairs = new Set<string>();

    // 1. 检测标题重复
    const titleGroups = this.detectTitleDuplicates(files);
    groups.push(...titleGroups);

    // 2. 检测内容完全相同
    const contentGroups = this.detectExactContentDuplicates(files);
    groups.push(...contentGroups);

    // 标记已处理的文件对
    for (const group of groups) {
      for (let i = 0; i < group.files.length; i++) {
        for (let j = i + 1; j < group.files.length; j++) {
          const pairKey = this.getPairKey(group.files[i].path, group.files[j].path);
          processedPairs.add(pairKey);
        }
      }
    }

    // 3. 检测内容相似
    const similarGroups = await this.detectSimilarContent(
      files,
      processedPairs,
      onProgress
    );
    groups.push(...similarGroups);

    // 排序：按类型优先级，再按相似度降序
    return this.sortGroups(groups);
  }

  /**
   * 检测标题重复
   */
  private detectTitleDuplicates(files: FileInfo[]): DuplicateGroup[] {
    const titleMap = new Map<string, FileInfo[]>();

    for (const file of files) {
      const normalizedTitle = file.basename.toLowerCase().trim();
      const existing = titleMap.get(normalizedTitle) || [];
      existing.push(file);
      titleMap.set(normalizedTitle, existing);
    }

    const groups: DuplicateGroup[] = [];

    for (const [, fileList] of titleMap) {
      if (fileList.length > 1) {
        groups.push({
          id: `title-${fileList[0].basename}`,
          type: 'exact_title',
          similarity: 100,
          files: fileList,
          primaryFile: fileList[0],
        });
      }
    }

    return groups;
  }

  /**
   * 检测内容完全相同
   */
  private detectExactContentDuplicates(files: FileInfo[]): DuplicateGroup[] {
    const hashMap = new Map<string, FileInfo[]>();

    for (const file of files) {
      const existing = hashMap.get(file.contentHash) || [];
      existing.push(file);
      hashMap.set(file.contentHash, existing);
    }

    const groups: DuplicateGroup[] = [];

    for (const [hash, fileList] of hashMap) {
      if (fileList.length > 1) {
        groups.push({
          id: `content-${hash}`,
          type: 'exact_content',
          similarity: 100,
          files: fileList,
          primaryFile: fileList[0],
        });
      }
    }

    return groups;
  }

  /**
   * 检测内容相似
   */
  private async detectSimilarContent(
    files: FileInfo[],
    processedPairs: Set<string>,
    onProgress?: ScanProgressCallback
  ): Promise<DuplicateGroup[]> {
    const groups: DuplicateGroup[] = [];
    const threshold = this.settings.similarityThreshold;
    const totalComparisons = (files.length * (files.length - 1)) / 2;
    let currentComparison = 0;

    // 按内容长度排序，优化比较
    const sortedFiles = [...files].sort((a, b) => a.content.length - b.content.length);

    for (let i = 0; i < sortedFiles.length; i++) {
      for (let j = i + 1; j < sortedFiles.length; j++) {
        currentComparison++;

        const file1 = sortedFiles[i];
        const file2 = sortedFiles[j];

        // 跳过已处理的对
        const pairKey = this.getPairKey(file1.path, file2.path);
        if (processedPairs.has(pairKey)) {
          continue;
        }

        // 长度预筛选
        const lengthRatio = file1.content.length / file2.content.length;
        if (lengthRatio < 0.3) {
          continue;
        }

        const similarity = this.similarityCalculator.calculateSimilarity(
          file1.content,
          file2.content
        );

        if (similarity >= threshold) {
          groups.push({
            id: `similar-${file1.path}-${file2.path}`,
            type: 'similar_content',
            similarity,
            files: [file1, file2],
            primaryFile: file1,
          });
          processedPairs.add(pairKey);
        }

        // 更新进度
        if (currentComparison % 100 === 0) {
          onProgress?.({
            current: currentComparison,
            total: totalComparisons,
            phase: 'comparing',
            message: `正在比较: ${Math.round((currentComparison / totalComparisons) * 100)}%`,
          });
          await this.yieldToMain();
        }
      }
    }

    return groups;
  }

  /**
   * 生成文件对的唯一键
   */
  private getPairKey(path1: string, path2: string): string {
    return [path1, path2].sort().join('|');
  }

  /**
   * 排序重复组
   */
  private sortGroups(groups: DuplicateGroup[]): DuplicateGroup[] {
    const typePriority: Record<string, number> = {
      exact_content: 1,
      exact_title: 2,
      similar_content: 3,
    };

    return groups.sort((a, b) => {
      // 先按类型排序
      const priorityDiff = typePriority[a.type] - typePriority[b.type];
      if (priorityDiff !== 0) {
        return priorityDiff;
      }
      // 再按相似度降序
      return b.similarity - a.similarity;
    });
  }

  /**
   * 让出主线程
   */
  private yieldToMain(): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, 0));
  }
}
