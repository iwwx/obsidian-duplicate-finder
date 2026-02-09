export const enUS = {
  // Common
  'common.duplicate': 'Duplicate notes',
  'common.scan': 'Scan',
  'common.open': 'Open',
  'common.delete': 'Delete',
  'common.undo': 'Undo',
  'common.redo': 'Redo',
  'common.close': 'Close',
  'common.compare': 'Compare',
  'common.properties': 'Properties',

  // View
  'view.title': 'Duplicate note detection',
  'view.emptyPrompt': 'Click "scan" to detect duplicate notes',
  'view.noDuplicates': 'No duplicate notes found 🎉',
  'view.foundGroups': 'Found {count} duplicate groups',

  // Scan
  'scan.scanning': 'Scanning...',
  'scan.comparing': 'Comparing: {percent}%',
  'scan.complete': 'Scan complete, found {count} duplicate groups',
  'scan.failed': 'Scan failed, please check console',

  // Duplicate types
  'type.exactcontent': 'Exact content',
  'type.exacttitle': 'Exact title',
  'type.similarcontent': 'Similar content',

  // Compare preview
  'compare.title': 'Compare notes ({count} files)',
  'compare.properties': 'Properties',
  'compare.stats': 'Words: {words} | Characters: {chars}',

  // Actions
  'action.undo': 'Undo delete',
  'action.redo': 'Redo delete',
  'action.close': 'Close',
  'action.open': 'Open',
  'action.delete': 'Delete',
  'action.compare': 'Compare preview ({count} files)',

  // Messages
  'message.deleted': 'Deleted: {file}',
  'message.deleteFailed': 'Delete failed',
  'message.restored': 'Restored: {file}',
  'message.undoFailed': 'Undo failed: file may already exist',
  'message.redoFailed': 'Redo failed',
  'message.scanComplete': 'Scan complete, found {count} duplicate groups',
  'message.scanFailed': 'Scan failed, please check console',

  // Settings
  'settings.title': 'Duplicate note detection settings',
  'settings.language': 'Language',
  'settings.languageDesc': 'Select plugin display language',
  'settings.similarityThreshold': 'Similarity threshold',
  'settings.similarityThresholdDesc': 'Content similarity percentage to be considered duplicate (0-100)',
  'settings.minContentLength': 'Minimum content length',
  'settings.minContentLengthDesc': 'Notes with fewer characters than this will be ignored',
  'settings.excludedFolders': 'Excluded folders',
  'settings.excludedFoldersDesc': 'List of folders to exclude from scanning, one per line',

  // Commands
  'command.openFinder': 'Open duplicate note detection',
  'command.scanDuplicates': 'Scan for duplicate notes',

  // Ribbon
  'ribbon.tooltip': 'Duplicate note detection',
};
