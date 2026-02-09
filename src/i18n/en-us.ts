export const enUS = {
  // Common
  'common.duplicate': 'Duplicate Notes',
  'common.scan': 'Scan',
  'common.open': 'Open',
  'common.delete': 'Delete',
  'common.undo': 'Undo',
  'common.redo': 'Redo',
  'common.close': 'Close',
  'common.compare': 'Compare',
  'common.properties': 'Properties',

  // View
  'view.title': 'Duplicate Note Detection',
  'view.emptyPrompt': 'Click "Scan" to detect duplicate notes',
  'view.noDuplicates': 'No duplicate notes found 🎉',
  'view.foundGroups': 'Found {count} duplicate groups',

  // Scan
  'scan.scanning': 'Scanning...',
  'scan.comparing': 'Comparing: {percent}%',
  'scan.complete': 'Scan complete, found {count} duplicate groups',
  'scan.failed': 'Scan failed, please check console',

  // Duplicate types
  'type.exactcontent': 'Exact Content',
  'type.exacttitle': 'Exact Title',
  'type.similarcontent': 'Similar Content',

  // Compare preview
  'compare.title': 'Compare Notes ({count} files)',
  'compare.properties': 'Properties',
  'compare.stats': 'Words: {words} | Characters: {chars}',

  // Actions
  'action.undo': 'Undo Delete',
  'action.redo': 'Redo Delete',
  'action.close': 'Close',
  'action.open': 'Open',
  'action.delete': 'Delete',
  'action.compare': 'Compare Preview ({count} files)',

  // Messages
  'message.deleted': 'Deleted: {file}',
  'message.deleteFailed': 'Delete failed',
  'message.restored': 'Restored: {file}',
  'message.undoFailed': 'Undo failed: file may already exist',
  'message.redoFailed': 'Redo failed',
  'message.scanComplete': 'Scan complete, found {count} duplicate groups',
  'message.scanFailed': 'Scan failed, please check console',

  // Settings
  'settings.title': 'Duplicate Note Detection Settings',
  'settings.language': 'Language',
  'settings.languageDesc': 'Select plugin display language',
  'settings.similarityThreshold': 'Similarity Threshold',
  'settings.similarityThresholdDesc': 'Content similarity percentage to be considered duplicate (0-100)',
  'settings.minContentLength': 'Minimum Content Length',
  'settings.minContentLengthDesc': 'Notes with fewer characters than this will be ignored',
  'settings.excludedFolders': 'Excluded Folders',
  'settings.excludedFoldersDesc': 'List of folders to exclude from scanning, one per line',

  // Commands
  'command.openFinder': 'Open Duplicate Note Detection',
  'command.scanDuplicates': 'Scan for Duplicate Notes',

  // Ribbon
  'ribbon.tooltip': 'Duplicate Note Detection',
};
