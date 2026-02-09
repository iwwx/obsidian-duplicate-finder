# Duplicate Note Finder

[English](#english) | [中文](#中文)

---

## English

### 📝 Description

An Obsidian plugin that automatically detects duplicate notes in your vault. It supports detection by exact title match, exact content match, and content similarity, with a convenient side-by-side comparison view and easy deletion functionality.

### ✨ Features

- **Multiple Detection Methods**
  - Exact title match (case-insensitive)
  - Exact content match (via MD5 hash)
  - Similar content detection (Jaccard similarity algorithm)

- **Smart Content Comparison**
  - Configurable similarity threshold (0-100%)
  - Automatically ignores image links when calculating similarity
  - Chinese text support (bigram tokenization)
  - English text support (word tokenization)

- **Rich UI Features**
  - Side-by-side comparison view for multiple notes
  - Rendered Markdown preview (not source code)
  - Display frontmatter properties
  - Real-time statistics (word count, character count)

- **Easy File Management**
  - One-click deletion
  - Undo/Redo support
  - Files moved to system trash (recoverable)

- **Multi-language Support**
  - English
  - 简体中文 (Simplified Chinese)
  - Auto-detection of Obsidian language
  - Manual language switching in settings

### 🚀 Usage

1. Click the duplicate detection icon in the ribbon (left sidebar)
2. Click the "Scan" button to start detection
3. View duplicate groups sorted by type and similarity
4. Click "Compare Preview" to see notes side-by-side
5. Click "Delete" button to remove unwanted duplicates
6. Use "Undo" to restore accidentally deleted files

### ⚙️ Settings

- **Language**: Choose plugin display language
- **Similarity Threshold**: Set the percentage threshold for content similarity (default: 80%)
- **Excluded Folders**: Folders to skip during scanning (default: .obsidian, .trash, templates)
- **Minimum Content Length**: Ignore notes shorter than this (default: 50 characters)

### 📦 Installation

#### From Obsidian Community Plugins

1. Open Settings → Community Plugins
2. Disable Safe Mode
3. Click "Browse" and search for "Duplicate Note Finder"
4. Click "Install"
5. Enable the plugin in "Installed Plugins"

#### Manual Installation

1. Download `main.js`, `manifest.json`, and `styles.css` from the latest release
2. Create a folder named `duplicate-finder` in your vault's `.obsidian/plugins/` directory
3. Copy the downloaded files to the folder
4. Restart Obsidian
5. Enable the plugin in Settings → Community Plugins

### 🛠️ Development

```bash
# Clone the repository
git clone https://github.com/iwwx/obsidian-duplicate-finder.git

# Install dependencies
npm install

# Build the plugin
npm run build

# Development mode (auto-rebuild on changes)
npm run dev
```

### 📄 License

MIT License

### 🙏 Acknowledgments

Built with the [Obsidian API](https://github.com/obsidianmd/obsidian-api)

---

## 中文

### 📝 简介

一个 Obsidian 插件，自动检测 Vault 中的重复笔记。支持按标题重复、内容完全相同、内容相似度进行检测，提供并排对比视图和便捷的删除功能。

### ✨ 功能特性

- **多种检测方式**
  - 标题完全相同（忽略大小写）
  - 内容完全相同（通过 MD5 哈希）
  - 内容相似检测（Jaccard 相似度算法）

- **智能内容对比**
  - 可配置相似度阈值（0-100%）
  - 自动忽略图片链接，不影响相似度计算
  - 支持中文文本（二元词组分词）
  - 支持英文文本（单词分词）

- **丰富的界面功能**
  - 多篇笔记并排对比预览
  - Markdown 渲染模式（非源码模式）
  - 显示 frontmatter 属性
  - 实时统计（字数、字符数）

- **便捷的文件管理**
  - 一键删除
  - 撤销/重做支持
  - 文件移至系统回收站（可恢复）

- **多语言支持**
  - English（英文）
  - 简体中文
  - 自动检测 Obsidian 语言
  - 设置中手动切换语言

### 🚀 使用方法

1. 点击侧边栏的重复检测图标
2. 点击"扫描"按钮开始检测
3. 查看按类型和相似度排序的重复组
4. 点击"对比预览"查看笔记并排对比
5. 点击"删除"按钮移除不需要的重复笔记
6. 使用"撤销"功能恢复误删的文件

### ⚙️ 设置选项

- **语言**：选择插件显示语言
- **相似度阈值**：设置内容相似度百分比阈值（默认：80%）
- **排除文件夹**：扫描时跳过的文件夹（默认：.obsidian, .trash, templates）
- **最小内容长度**：忽略短于此长度的笔记（默认：50 字符）

### 📦 安装

#### 从 Obsidian 社区插件安装

1. 打开 设置 → 第三方插件
2. 关闭安全模式
3. 点击"浏览"并搜索"Duplicate Note Finder"
4. 点击"安装"
5. 在"已安装插件"中启用插件

#### 手动安装

1. 从最新 Release 下载 `main.js`、`manifest.json` 和 `styles.css`
2. 在 Vault 的 `.obsidian/plugins/` 目录下创建名为 `duplicate-finder` 的文件夹
3. 将下载的文件复制到该文件夹
4. 重启 Obsidian
5. 在 设置 → 第三方插件 中启用插件

### 🛠️ 开发

```bash
# 克隆仓库
git clone https://github.com/yourusername/obsidian-duplicate-finder.git

# 安装依赖
npm install

# 构建插件
npm run build

# 开发模式（自动重新构建）
npm run dev
```

### 📄 许可证

MIT License

### 🙏 致谢

基于 [Obsidian API](https://github.com/obsidianmd/obsidian-api) 构建
