import { Plugin, WorkspaceLeaf, addIcon, moment } from 'obsidian';
import { DuplicateFinderSettings } from './types';
import { VIEW_TYPE_DUPLICATE, DEFAULT_SETTINGS } from './constants';
import { DuplicateView } from './ui/DuplicateView';
import { DuplicateFinderSettingTab } from './settings/SettingsTab';
import { I18n, getLanguageFromObsidian } from './i18n';

// 自定义图标 SVG - 复制图标右下角带大垃圾桶
const DUPLICATE_TRASH_ICON = `
<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <!-- 第一张纸（后面，左上） -->
  <rect x="10" y="5" width="50" height="60" rx="4" fill="none" stroke="currentColor" stroke-width="5"/>
  <line x1="18" y1="17" x2="52" y2="17" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
  <line x1="18" y1="27" x2="45" y2="27" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>

  <!-- 第二张纸（前面，中间） -->
  <rect x="20" y="15" width="50" height="60" rx="4" fill="var(--background-primary)" stroke="currentColor" stroke-width="5"/>
  <line x1="28" y1="27" x2="62" y2="27" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
  <line x1="28" y1="37" x2="55" y2="37" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>

  <!-- 垃圾桶（右下角，超大） -->
  <g transform="translate(35, 35)">
    <!-- 垃圾桶背景圆 -->
    <circle cx="30" cy="30" r="32" fill="var(--background-primary)" stroke="currentColor" stroke-width="4"/>
    <!-- 垃圾桶盖 -->
    <rect x="12" y="18" width="36" height="4" rx="2" fill="currentColor"/>
    <!-- 垃圾桶手柄 -->
    <path d="M 20 13 L 20 18 L 40 18 L 40 13 Z" fill="currentColor" stroke="currentColor" stroke-width="1"/>
    <!-- 垃圾桶身 -->
    <path d="M 14 23 L 17 46 C 17 48 18 50 20 50 L 40 50 C 42 50 43 48 43 46 L 46 23 Z" fill="currentColor"/>
    <!-- 垃圾桶竖线（分隔线） -->
    <line x1="24" y1="27" x2="24" y2="44" stroke="var(--background-primary)" stroke-width="3" stroke-linecap="round"/>
    <line x1="30" y1="27" x2="30" y2="44" stroke="var(--background-primary)" stroke-width="3" stroke-linecap="round"/>
    <line x1="36" y1="27" x2="36" y2="44" stroke="var(--background-primary)" stroke-width="3" stroke-linecap="round"/>
  </g>
</svg>
`;

export default class DuplicateFinderPlugin extends Plugin {
  settings: DuplicateFinderSettings = DEFAULT_SETTINGS;
  i18n: I18n;

  async onload(): Promise<void> {
    await this.loadSettings();

    // 初始化 i18n
    this.i18n = new I18n(this.settings.language);

    // 注册自定义图标
    addIcon('duplicate-trash', DUPLICATE_TRASH_ICON);

    // 注册视图
    this.registerView(VIEW_TYPE_DUPLICATE, (leaf) => new DuplicateView(leaf, this));

    // 添加 Ribbon 图标
    this.addRibbonIcon('duplicate-trash', this.i18n.t('ribbon.tooltip'), () => {
      void this.activateView();
    });

    // 添加命令
    this.addCommand({
      id: 'open-finder',
      name: this.i18n.t('command.openFinder'),
      callback: () => {
        void this.activateView();
      },
    });

    this.addCommand({
      id: 'scan',
      name: this.i18n.t('command.scanDuplicates'),
      callback: async () => {
        await this.activateView();
        const view = this.getView();
        if (view) {
          // 触发扫描
          const scanBtn = view.containerEl.querySelector(
            '.duplicate-scan-btn'
          ) as HTMLButtonElement;
          scanBtn?.click();
        }
      },
    });

    // 添加设置面板
    this.addSettingTab(new DuplicateFinderSettingTab(this.app, this));
  }

  onunload(): void {
    // 插件卸载时的清理工作
  }

  async loadSettings(): Promise<void> {
    const data = await this.loadData();
    this.settings = Object.assign({}, DEFAULT_SETTINGS, data);

    // 自动将配置目录添加到排除列表(如果不存在)
    const configDir = this.app.vault.configDir;
    if (!this.settings.excludedFolders.includes(configDir)) {
      this.settings.excludedFolders.unshift(configDir);
    }

    // 如果没有设置语言，自动检测
    if (!this.settings.language) {
      const obsidianLang = moment.locale();
      this.settings.language = getLanguageFromObsidian(obsidianLang);
    }
  }

  async saveSettings(): Promise<void> {
    await this.saveData(this.settings);

    // 更新 i18n
    this.i18n.setLanguage(this.settings.language);

    // 更新视图
    const view = this.getView();
    if (view) {
      view.updateSettings();
      void view.onOpen(); // 重新渲染以应用新语言
    }
  }

  /**
   * 激活视图
   */
  async activateView(): Promise<void> {
    const { workspace } = this.app;

    let leaf: WorkspaceLeaf | null = null;
    const leaves = workspace.getLeavesOfType(VIEW_TYPE_DUPLICATE);

    if (leaves.length > 0) {
      leaf = leaves[0];
    } else {
      leaf = workspace.getRightLeaf(false);
      if (leaf) {
        await leaf.setViewState({
          type: VIEW_TYPE_DUPLICATE,
          active: true,
        });
      }
    }

    if (leaf) {
      void workspace.revealLeaf(leaf);
    }
  }

  /**
   * 获取视图实例
   */
  private getView(): DuplicateView | null {
    const leaves = this.app.workspace.getLeavesOfType(VIEW_TYPE_DUPLICATE);
    if (leaves.length > 0) {
      return leaves[0].view as DuplicateView;
    }
    return null;
  }
}
