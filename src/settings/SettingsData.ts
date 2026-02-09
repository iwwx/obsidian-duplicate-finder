import { DuplicateFinderSettings } from '../types';
import { DEFAULT_SETTINGS } from '../constants';

/**
 * 合并用户设置与默认设置
 */
export function mergeSettings(
  userSettings: Partial<DuplicateFinderSettings>
): DuplicateFinderSettings {
  return {
    ...DEFAULT_SETTINGS,
    ...userSettings,
  };
}

/**
 * 验证设置值
 */
export function validateSettings(
  settings: DuplicateFinderSettings
): DuplicateFinderSettings {
  return {
    similarityThreshold: Math.max(0, Math.min(100, settings.similarityThreshold)),
    excludedFolders: settings.excludedFolders.filter((f) => f.trim().length > 0),
    minContentLength: Math.max(0, settings.minContentLength),
  };
}
