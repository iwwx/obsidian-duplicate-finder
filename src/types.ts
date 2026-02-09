import { TFile } from 'obsidian';
import { Language } from './i18n';

/**
 * 文件信息
 */
export interface FileInfo {
  path: string;
  basename: string;
  content: string;
  contentHash: string;
  wordCount: number;
  file: TFile;
}

/**
 * 重复类型
 */
export type DuplicateType = 'exact_title' | 'exact_content' | 'similar_content';

/**
 * 重复组
 */
export interface DuplicateGroup {
  id: string;
  type: DuplicateType;
  similarity: number;
  files: FileInfo[];
  primaryFile: FileInfo;
}

/**
 * 插件设置
 */
export interface DuplicateFinderSettings {
  language: Language;
  similarityThreshold: number;
  excludedFolders: string[];
  minContentLength: number;
}

/**
 * 扫描进度回调
 */
export interface ScanProgress {
  current: number;
  total: number;
  phase: 'scanning' | 'comparing' | 'done';
  message: string;
}

export type ScanProgressCallback = (progress: ScanProgress) => void;
