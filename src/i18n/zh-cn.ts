export const zhCN = {
  // 通用
  'common.duplicate': '重复笔记',
  'common.scan': '扫描',
  'common.open': '打开',
  'common.delete': '删除',
  'common.undo': '撤销',
  'common.redo': '重做',
  'common.close': '关闭',
  'common.compare': '对比',
  'common.properties': '属性',

  // 视图
  'view.title': '重复笔记检测',
  'view.emptyPrompt': '点击"扫描"检测重复笔记',
  'view.noDuplicates': '未发现重复笔记 🎉',
  'view.foundGroups': '共发现 {count} 组重复',

  // 扫描
  'scan.scanning': '正在扫描...',
  'scan.comparing': '正在比较: {percent}%',
  'scan.complete': '扫描完成，发现 {count} 组重复',
  'scan.failed': '扫描失败，请查看控制台',

  // 重复类型
  'type.exactcontent': '内容相同',
  'type.exacttitle': '标题相同',
  'type.similarcontent': '内容相似',

  // 对比预览
  'compare.title': '笔记对比 ({count} 篇)',
  'compare.properties': '属性',
  'compare.stats': '字数: {words} | 字符: {chars}',

  // 操作
  'action.undo': '撤销删除',
  'action.redo': '重做删除',
  'action.close': '关闭',
  'action.open': '打开',
  'action.delete': '删除',
  'action.compare': '对比预览 ({count} 篇)',

  // 消息
  'message.deleted': '已删除: {file}',
  'message.deleteFailed': '删除失败',
  'message.restored': '已恢复: {file}',
  'message.undoFailed': '撤销失败：文件可能已存在',
  'message.redoFailed': '重做失败',
  'message.scanComplete': '扫描完成，发现 {count} 组重复',
  'message.scanFailed': '扫描失败，请查看控制台',

  // 设置
  'settings.title': '重复笔记检测设置',
  'settings.language': '语言',
  'settings.languageDesc': '选择插件显示语言',
  'settings.similarityThreshold': '相似度阈值',
  'settings.similarityThresholdDesc': '内容相似度达到此百分比时视为重复（0-100）',
  'settings.minContentLength': '最小内容长度',
  'settings.minContentLengthDesc': '内容字符数少于此值的笔记将被忽略',
  'settings.excludedFolders': '排除文件夹',
  'settings.excludedFoldersDesc': '不扫描的文件夹列表，每行一个',

  // 命令
  'command.openFinder': '打开重复笔记检测',
  'command.scanDuplicates': '扫描重复笔记',

  // Ribbon
  'ribbon.tooltip': '重复笔记检测',
};
