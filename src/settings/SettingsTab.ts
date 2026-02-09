import { App, PluginSettingTab, Setting } from 'obsidian';
import type DuplicateFinderPlugin from '../main';
import { SUPPORTED_LANGUAGES, type Language } from '../i18n';

export class DuplicateFinderSettingTab extends PluginSettingTab {
  plugin: DuplicateFinderPlugin;

  constructor(app: App, plugin: DuplicateFinderPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;
    const { i18n } = this.plugin;

    containerEl.empty();

    // 标题
    new Setting(containerEl)
      .setName(i18n.t('settings.title'))
      .setHeading();

    // 语言设置
    new Setting(containerEl)
      .setName(i18n.t('settings.language'))
      .setDesc(i18n.t('settings.languageDesc'))
      .addDropdown((dropdown) =>
        dropdown
          .addOptions(SUPPORTED_LANGUAGES)
          .setValue(this.plugin.settings.language)
          .onChange(async (value) => {
            this.plugin.settings.language = value as Language;
            await this.plugin.saveSettings();
            this.display(); // 重新渲染设置页面以应用新语言
          })
      );

    // 相似度阈值
    new Setting(containerEl)
      .setName(i18n.t('settings.similarityThreshold'))
      .setDesc(i18n.t('settings.similarityThresholdDesc'))
      .addSlider((slider) =>
        slider
          .setLimits(0, 100, 5)
          .setValue(this.plugin.settings.similarityThreshold)
          .setDynamicTooltip()
          .onChange(async (value) => {
            this.plugin.settings.similarityThreshold = value;
            await this.plugin.saveSettings();
          })
      );

    // 最小内容长度
    new Setting(containerEl)
      .setName(i18n.t('settings.minContentLength'))
      .setDesc(i18n.t('settings.minContentLengthDesc'))
      .addText((text) =>
        text
          .setPlaceholder('50')
          .setValue(String(this.plugin.settings.minContentLength))
          .onChange(async (value) => {
            const num = parseInt(value, 10);
            if (!isNaN(num) && num >= 0) {
              this.plugin.settings.minContentLength = num;
              await this.plugin.saveSettings();
            }
          })
      );

    // 排除文件夹
    new Setting(containerEl)
      .setName(i18n.t('settings.excludedFolders'))
      .setDesc(i18n.t('settings.excludedFoldersDesc'))
      .addTextArea((text) =>
        text
          .setPlaceholder(`${this.app.vault.configDir}\n.trash\ntemplates`)
          .setValue(this.plugin.settings.excludedFolders.join('\n'))
          .onChange(async (value) => {
            this.plugin.settings.excludedFolders = value
              .split('\n')
              .map((f) => f.trim())
              .filter((f) => f.length > 0);
            await this.plugin.saveSettings();
          })
      );
  }
}
