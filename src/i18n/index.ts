import { zhCN } from './zh-cn';
import { enUS } from './en-us';

export type Language = 'zh-cn' | 'en-us';
export type TranslationKey = keyof typeof zhCN;

const translations: Record<Language, Record<string, string>> = {
  'zh-cn': zhCN,
  'en-us': enUS,
};

export class I18n {
  private currentLang: Language;

  constructor(lang: Language = 'en-us') {
    this.currentLang = lang;
  }

  setLanguage(lang: Language): void {
    this.currentLang = lang;
  }

  getLanguage(): Language {
    return this.currentLang;
  }

  t(key: TranslationKey, params?: Record<string, string | number>): string {
    let text = translations[this.currentLang][key] || translations['en-us'][key] || key;

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        text = text.replace(new RegExp(`\\{${key}\\}`, 'g'), String(value));
      });
    }

    return text;
  }
}

// 支持的语言列表
export const SUPPORTED_LANGUAGES: Record<Language, string> = {
  'zh-cn': '简体中文',
  'en-us': 'English',
};

// 从 Obsidian 语言代码映射到插件语言
export function getLanguageFromObsidian(obsidianLang: string): Language {
  const langMap: Record<string, Language> = {
    'zh-cn': 'zh-cn',
    'zh': 'zh-cn',
    'zh-tw': 'zh-cn',
    'en': 'en-us',
    'en-us': 'en-us',
    'en-gb': 'en-us',
  };

  return langMap[obsidianLang.toLowerCase()] || 'en-us';
}
