import { DuplicateFinderSettings } from './types';

/**
 * 视图类型标识
 */
export const VIEW_TYPE_DUPLICATE = 'duplicate-finder-view';

/**
 * 默认设置
 */
export const DEFAULT_SETTINGS: DuplicateFinderSettings = {
  language: 'en-us', // 将在插件加载时自动检测
  similarityThreshold: 80,
  excludedFolders: ['.trash', 'templates'],
  minContentLength: 50,
};

