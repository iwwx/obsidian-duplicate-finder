import {
  ItemView,
  WorkspaceLeaf,
  Notice,
  setIcon,
} from 'obsidian';
import { DuplicateGroup, FileInfo, ScanProgress } from '../types';
import { VIEW_TYPE_DUPLICATE } from '../constants';
import { DuplicateDetector } from '../core/DuplicateDetector';
import { CompareModal } from './CompareModal';
import type DuplicateFinderPlugin from '../main';
import type { TranslationKey } from '../i18n';

interface DeleteAction {
  file: FileInfo;
  content: string;
  group: DuplicateGroup;
}

/**
 * 侧边栏视图 - 显示重复列表
 */
export class DuplicateView extends ItemView {
  private plugin: DuplicateFinderPlugin;
  private detector: DuplicateDetector;
  private groups: DuplicateGroup[] = [];
  private isScanning = false;
  private contentContainer: HTMLElement | null = null;
  private deleteHistory: DeleteAction[] = [];
  private redoStack: DeleteAction[] = [];

  constructor(leaf: WorkspaceLeaf, plugin: DuplicateFinderPlugin) {
    super(leaf);
    this.plugin = plugin;
    this.detector = new DuplicateDetector(this.app, plugin.settings);
  }

  getViewType(): string {
    return VIEW_TYPE_DUPLICATE;
  }

  getDisplayText(): string {
    return this.plugin.i18n.t('common.duplicate');
  }

  getIcon(): string {
    return 'copy';
  }

  onOpen(): void {
    const container = this.containerEl.children[1];
    container.empty();
    container.addClass('duplicate-finder-view');

    // 头部
    const header = container.createDiv({ cls: 'duplicate-header' });

    // 左侧:标题
    header.createEl('h4', { text: this.plugin.i18n.t('view.title') });

    // 右侧：按钮组
    const headerActions = header.createDiv({ cls: 'duplicate-header-actions' });

    // 撤销按钮
    const undoBtn = headerActions.createEl('button', {
      cls: 'duplicate-undo-btn',
      attr: { 'aria-label': this.plugin.i18n.t('action.undo') },
    });
    setIcon(undoBtn, 'undo');
    undoBtn.addEventListener('click', () => void this.undo());

    // 重做按钮
    const redoBtn = headerActions.createEl('button', {
      cls: 'duplicate-redo-btn',
      attr: { 'aria-label': this.plugin.i18n.t('action.redo') },
    });
    setIcon(redoBtn, 'redo');
    redoBtn.addEventListener('click', () => void this.redo());

    // 扫描按钮
    const scanBtn = headerActions.createEl('button', {
      cls: 'duplicate-scan-btn',
    });
    setIcon(scanBtn, 'search');
    scanBtn.createSpan({ text: this.plugin.i18n.t('common.scan') });
    scanBtn.addEventListener('click', () => void this.startScan());

    // 关闭按钮
    const closeBtn = headerActions.createEl('button', {
      cls: 'duplicate-close-btn',
      attr: { 'aria-label': this.plugin.i18n.t('action.close') },
    });
    setIcon(closeBtn, 'x');
    closeBtn.addEventListener('click', () => this.leaf.detach());

    // 进度条
    const progressContainer = container.createDiv({
      cls: 'duplicate-progress is-hidden',
    });
    const progressBar = progressContainer.createDiv({
      cls: 'duplicate-progress-bar',
    });
    progressBar.createDiv({ cls: 'duplicate-progress-fill' });
    progressContainer.createDiv({ cls: 'duplicate-progress-text' });

    // 内容区域
    this.contentContainer = container.createDiv({
      cls: 'duplicate-content',
    });

    this.renderEmptyState();
    this.updateUndoRedoButtons();
  }

  /**
   * 更新设置
   */
  updateSettings(): void {
    this.detector.updateSettings(this.plugin.settings);
  }

  /**
   * 更新撤销/重做按钮状态
   */
  private updateUndoRedoButtons(): void {
    const container = this.containerEl.children[1];
    const undoBtn = container.querySelector('.duplicate-undo-btn') as HTMLButtonElement;
    const redoBtn = container.querySelector('.duplicate-redo-btn') as HTMLButtonElement;

    if (undoBtn) {
      undoBtn.disabled = this.deleteHistory.length === 0;
      undoBtn.classList.toggle('is-disabled', this.deleteHistory.length === 0);
    }

    if (redoBtn) {
      redoBtn.disabled = this.redoStack.length === 0;
      redoBtn.classList.toggle('is-disabled', this.redoStack.length === 0);
    }
  }

  /**
   * 撤销删除
   */
  private async undo(): Promise<void> {
    if (this.deleteHistory.length === 0) return;

    const action = this.deleteHistory.pop()!;

    try {
      // 恢复文件
      const newFile = await this.app.vault.create(
        action.file.path,
        action.content
      );

      // 更新文件引用
      const restoredFile: FileInfo = {
        ...action.file,
        file: newFile,
      };

      // 找到对应的组并添加回去
      let group = this.groups.find((g) => g.id === action.group.id);
      if (group) {
        group.files.push(restoredFile);
      } else {
        // 组已被移除，重新创建
        action.group.files = [restoredFile];
        this.groups.push(action.group);
      }

      // 添加到重做栈
      this.redoStack.push({
        file: restoredFile,
        content: action.content,
        group: action.group,
      });

      new Notice(this.plugin.i18n.t('message.restored', { file: action.file.basename }));

      this.renderResults();
      this.updateUndoRedoButtons();
    } catch (error) {
      console.error('Undo failed:', error);
      new Notice(this.plugin.i18n.t('message.undoFailed'));
      this.deleteHistory.push(action);
    }
  }

  /**
   * 重做删除
   */
  private async redo(): Promise<void> {
    if (this.redoStack.length === 0) return;

    const action = this.redoStack.pop()!;

    try {
      const group = this.groups.find((g) => g.id === action.group.id);
      const file = group?.files.find((f) => f.path === action.file.path);

      if (file && group) {
        await this.app.fileManager.trashFile(file.file);

        this.deleteHistory.push({
          file,
          content: action.content,
          group,
        });

        group.files = group.files.filter((f) => f.path !== file.path);

        if (group.files.length <= 1) {
          this.groups = this.groups.filter((g) => g.id !== group.id);
        }

        new Notice(this.plugin.i18n.t('message.deleted', { file: file.basename }));

        this.renderResults();
        this.updateUndoRedoButtons();
      }
    } catch (error) {
      console.error('Redo failed:', error);
      new Notice(this.plugin.i18n.t('message.redoFailed'));
      this.redoStack.push(action);
    }
  }

  /**
   * 开始扫描
   */
  private async startScan(): Promise<void> {
    if (this.isScanning) {
      return;
    }

    this.isScanning = true;
    // 清空历史记录
    this.deleteHistory = [];
    this.redoStack = [];

    const container = this.containerEl.children[1];
    const progressContainer = container.querySelector(
      '.duplicate-progress'
    ) as HTMLElement;
    const progressFill = container.querySelector(
      '.duplicate-progress-fill'
    ) as HTMLElement;
    const progressText = container.querySelector(
      '.duplicate-progress-text'
    ) as HTMLElement;
    const scanBtn = container.querySelector(
      '.duplicate-scan-btn'
    ) as HTMLButtonElement;

    progressContainer.classList.remove('is-hidden');
    scanBtn.disabled = true;

    try {
      this.groups = await this.detector.detectDuplicates(
        (progress: ScanProgress) => {
          const percent =
            progress.total > 0
              ? Math.round((progress.current / progress.total) * 100)
              : 0;
          progressFill.style.width = `${percent}%`;
          progressText.textContent = progress.message;
        }
      );

      this.renderResults();
      this.updateUndoRedoButtons();
      new Notice(this.plugin.i18n.t('message.scanComplete', { count: this.groups.length }));
    } catch (error) {
      console.error('Scan failed:', error);
      new Notice(this.plugin.i18n.t('message.scanFailed'));
    } finally {
      this.isScanning = false;
      progressContainer.classList.add('is-hidden');
      scanBtn.disabled = false;
    }
  }

  /**
   * 渲染空状态
   */
  private renderEmptyState(): void {
    if (!this.contentContainer) return;
    this.contentContainer.empty();

    const emptyState = this.contentContainer.createDiv({
      cls: 'duplicate-empty',
    });
    emptyState.createEl('p', {
      text: this.plugin.i18n.t('view.emptyPrompt'),
    });
  }

  /**
   * 渲染结果
   */
  private renderResults(): void {
    if (!this.contentContainer) return;
    this.contentContainer.empty();

    if (this.groups.length === 0) {
      const emptyState = this.contentContainer.createDiv({
        cls: 'duplicate-empty',
      });
      emptyState.createEl('p', { text: this.plugin.i18n.t('view.noDuplicates') });
      return;
    }

    // 统计信息
    const stats = this.contentContainer.createDiv({
      cls: 'duplicate-stats',
    });
    stats.createEl('span', {
      text: this.plugin.i18n.t('view.foundGroups', { count: this.groups.length }),
    });

    // 重复列表
    const list = this.contentContainer.createDiv({
      cls: 'duplicate-list',
    });

    for (const group of this.groups) {
      this.renderGroup(list, group);
    }
  }

  /**
   * 获取重复类型的本地化标签
   */
  private getDuplicateTypeLabel(type: string): string {
    const typeKey = `type.${type.replace(/_/g, '')}` as TranslationKey;
    return this.plugin.i18n.t(typeKey);
  }

  /**
   * 渲染单个重复组
   */
  private renderGroup(container: HTMLElement, group: DuplicateGroup): void {
    const groupEl = container.createDiv({ cls: 'duplicate-group' });

    // 组头部
    const groupHeader = groupEl.createDiv({ cls: 'duplicate-group-header' });

    groupHeader.createEl('span', {
      cls: `duplicate-type duplicate-type-${group.type}`,
      text: this.getDuplicateTypeLabel(group.type),
    });

    if (group.type === 'similar_content') {
      groupHeader.createEl('span', {
        cls: 'duplicate-similarity',
        text: `${group.similarity}%`,
      });
    }

    // 文件列表
    const fileList = groupEl.createDiv({ cls: 'duplicate-files' });

    for (const file of group.files) {
      this.renderFileItem(fileList, file, group);
    }

    // 对比按钮（支持多文件对比）
    if (group.files.length >= 2) {
      const compareBtn = groupEl.createEl('button', {
        cls: 'duplicate-compare-btn',
        text: this.plugin.i18n.t('action.compare', { count: group.files.length }),
      });
      compareBtn.addEventListener('click', () => {
        const modal = new CompareModal(
          this.app,
          this.plugin,
          group.files,
          (file) => this.handleFileDeletedFromModal(file, group)
        );
        modal.open();
      });
    }
  }

  /**
   * 处理从模态框删除文件的回调
   */
  private handleFileDeletedFromModal(file: FileInfo, group: DuplicateGroup): void {
    // 保存到历史记录
    this.deleteHistory.push({
      file,
      content: file.content,
      group,
    });
    this.redoStack = [];

    // 从组中移除
    group.files = group.files.filter((f) => f.path !== file.path);

    // 如果组中只剩一个文件，移除整个组
    if (group.files.length <= 1) {
      this.groups = this.groups.filter((g) => g.id !== group.id);
    }

    this.renderResults();
    this.updateUndoRedoButtons();
  }

  /**
   * 渲染文件项
   */
  private renderFileItem(
    container: HTMLElement,
    file: FileInfo,
    group: DuplicateGroup
  ): void {
    const fileEl = container.createDiv({ cls: 'duplicate-file' });

    // 文件信息
    const fileInfo = fileEl.createDiv({ cls: 'duplicate-file-info' });
    const fileName = fileInfo.createEl('span', {
      cls: 'duplicate-file-name',
      text: file.basename,
    });
    fileName.addEventListener('click', () => {
      void this.app.workspace.openLinkText(file.path, '', false);
    });

    fileInfo.createEl('span', {
      cls: 'duplicate-file-path',
      text: file.path,
    });

    // 操作按钮
    const actions = fileEl.createDiv({ cls: 'duplicate-file-actions' });

    const openBtn = actions.createEl('button', {
      cls: 'duplicate-action-btn',
      attr: { 'aria-label': this.plugin.i18n.t('action.open') },
    });
    setIcon(openBtn, 'file-text');
    openBtn.addEventListener('click', () => {
      void this.app.workspace.openLinkText(file.path, '', false);
    });

    const deleteBtn = actions.createEl('button', {
      cls: 'duplicate-action-btn duplicate-action-delete',
      attr: { 'aria-label': this.plugin.i18n.t('action.delete') },
    });
    setIcon(deleteBtn, 'trash');
    deleteBtn.addEventListener('click', () => void this.deleteFile(file, group));
  }

  /**
   * 删除文件（无确认）
   */
  private async deleteFile(
    file: FileInfo,
    group: DuplicateGroup
  ): Promise<void> {
    try {
      // 保存到历史记录
      this.deleteHistory.push({
        file,
        content: file.content,
        group,
      });
      this.redoStack = [];

      await this.app.fileManager.trashFile(file.file);
      new Notice(this.plugin.i18n.t('message.deleted', { file: file.basename }));

      // 从组中移除
      group.files = group.files.filter((f) => f.path !== file.path);

      // 如果组中只剩一个文件，移除整个组
      if (group.files.length <= 1) {
        this.groups = this.groups.filter((g) => g.id !== group.id);
      }

      this.renderResults();
      this.updateUndoRedoButtons();
    } catch (error) {
      console.error('Delete failed:', error);
      new Notice(this.plugin.i18n.t('message.deleteFailed'));
    }
  }

  async onClose(): Promise<void> {
    // 清理
  }
}
