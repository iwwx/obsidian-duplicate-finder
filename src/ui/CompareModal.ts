import { App, Modal, Notice, MarkdownRenderer, Component } from 'obsidian';
import { FileInfo } from '../types';
import type DuplicateFinderPlugin from '../main';

/**
 * 对比模态框 - 支持多篇笔记并排预览（渲染模式）
 */
export class CompareModal extends Modal {
  private plugin: DuplicateFinderPlugin;
  private files: FileInfo[];
  private onFileDeleted: (file: FileInfo) => void;
  private panelsContainer: HTMLElement | null = null;
  private component: Component;

  constructor(
    app: App,
    plugin: DuplicateFinderPlugin,
    files: FileInfo[],
    onFileDeleted: (file: FileInfo) => void
  ) {
    super(app);
    this.plugin = plugin;
    this.files = [...files];
    this.onFileDeleted = onFileDeleted;
    this.component = new Component();
  }

  onOpen(): void {
    const { contentEl, modalEl } = this;
    contentEl.empty();
    contentEl.addClass('duplicate-finder-compare-modal');
    modalEl.addClass('duplicate-finder-fullscreen-modal');

    this.component.load();

    // 标题栏
    const titleBar = contentEl.createDiv({ cls: 'compare-title-bar' });
    titleBar.createEl('h2', { text: this.plugin.i18n.t('compare.title', { count: this.files.length }) });

    // 对比容器
    this.panelsContainer = contentEl.createDiv({
      cls: 'compare-container',
    });

    this.renderPanels();
  }

  /**
   * 渲染所有面板
   */
  private renderPanels(): void {
    if (!this.panelsContainer) return;
    this.panelsContainer.empty();

    // 根据文件数量设置面板宽度
    const panelCount = this.files.length;
    this.panelsContainer.style.setProperty('--panel-count', String(panelCount));

    for (const file of this.files) {
      this.createFilePanel(this.panelsContainer, file);
    }

    // 更新标题
    const title = this.contentEl.querySelector('.compare-title-bar h2');
    if (title) {
      title.textContent = this.plugin.i18n.t('compare.title', { count: this.files.length });
    }
  }

  /**
   * 渲染 frontmatter 属性表格
   */
  private renderFrontmatter(container: HTMLElement, frontmatter: Record<string, unknown>): void {
    const propsContainer = container.createDiv({ cls: 'compare-properties' });
    propsContainer.createEl('div', { cls: 'compare-properties-title', text: this.plugin.i18n.t('compare.properties') });

    const table = propsContainer.createEl('table', { cls: 'compare-properties-table' });

    for (const [key, value] of Object.entries(frontmatter)) {
      const row = table.createEl('tr');
      row.createEl('td', { cls: 'compare-prop-key', text: key });

      const valueCell = row.createEl('td', { cls: 'compare-prop-value' });

      if (Array.isArray(value)) {
        const tagsContainer = valueCell.createDiv({ cls: 'compare-prop-tags' });
        for (const item of value) {
          const tag = tagsContainer.createEl('span', { cls: 'compare-prop-tag' });
          tag.textContent = typeof item === 'object' ? JSON.stringify(item) : String(item);
        }
      } else if (value != null) {
        valueCell.textContent = typeof value === 'object' ? JSON.stringify(value) : String(value);
      }
    }
  }

  /**
   * 移除 frontmatter 获取正文
   */
  private removeFrontmatter(content: string): string {
    const frontmatterRegex = /^---\r?\n[\s\S]*?\r?\n---\r?\n?/;
    return content.replace(frontmatterRegex, '');
  }

  private createFilePanel(
    container: HTMLElement,
    file: FileInfo
  ): void {
    const panel = container.createDiv({ cls: 'compare-panel' });

    // 文件信息头
    const header = panel.createDiv({ cls: 'compare-header' });
    header.createEl('h3', { text: file.basename });
    header.createEl('div', {
      cls: 'compare-path',
      text: file.path,
    });
    header.createEl('div', {
      cls: 'compare-stats',
      text: this.plugin.i18n.t('compare.stats', {
        words: file.wordCount,
        chars: file.content.length
      }),
    });

    // 操作按钮
    const actions = panel.createDiv({ cls: 'compare-actions' });

    const openBtn = actions.createEl('button', {
      text: this.plugin.i18n.t('action.open'),
      cls: 'mod-cta',
    });
    openBtn.addEventListener('click', () => {
      void this.app.workspace.openLinkText(file.path, '', false);
      this.close();
    });

    const deleteBtn = actions.createEl('button', {
      text: this.plugin.i18n.t('action.delete'),
      cls: 'mod-warning',
    });
    deleteBtn.addEventListener('click', () => void this.deleteFile(file));

    // 内容预览
    const content = panel.createDiv({ cls: 'compare-content markdown-rendered' });

    // 获取文件的元数据
    const metadata = this.app.metadataCache.getFileCache(file.file);

    // 渲染 frontmatter 属性
    if (metadata?.frontmatter) {
      // 过滤掉内部属性(以 position 结尾的)
      const displayProps: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(metadata.frontmatter)) {
        if (!key.endsWith('position')) {
          displayProps[key] = value;
        }
      }

      if (Object.keys(displayProps).length > 0) {
        this.renderFrontmatter(content, displayProps);
      }
    }

    // 移除 frontmatter 后渲染 Markdown 内容
    const body = this.removeFrontmatter(file.content);

    // 渲染 Markdown 内容
    void MarkdownRenderer.render(
      this.app,
      body,
      content,
      file.path,
      this.component
    );
  }

  /**
   * 删除文件(无确认)
   */
  private async deleteFile(file: FileInfo): Promise<void> {
    try {
      // 移动到回收站
      await this.app.fileManager.trashFile(file.file);

      // 从列表中移除
      this.files = this.files.filter((f) => f.path !== file.path);

      // 通知父组件
      this.onFileDeleted(file);

      new Notice(this.plugin.i18n.t('message.deleted', { file: file.basename }));

      // 如果没有文件了,关闭模态框
      if (this.files.length === 0) {
        this.close();
        return;
      }

      // 重新渲染
      this.renderPanels();
    } catch (error) {
      console.error('Delete failed:', error);
      new Notice(this.plugin.i18n.t('message.deleteFailed'));
    }
  }

  onClose(): void {
    this.component.unload();
    const { contentEl } = this;
    contentEl.empty();
  }
}
