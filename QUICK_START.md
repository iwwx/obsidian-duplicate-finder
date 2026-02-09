# 🚀 快速发布指南

## ✅ 准备工作完成状态

- ✅ **GitHub 用户名**: iwwx
- ✅ **插件 ID**: `duplicate-finder`（已确认可用）
- ✅ **所有文件已准备就绪**
- ✅ **所有链接已更新**

---

## 📝 发布步骤（复制粘贴执行）

### 步骤 1：创建 GitHub 仓库

1. 访问：https://github.com/new
2. 填写：
   - **Repository name**: `obsidian-duplicate-finder`
   - **Description**: `Obsidian plugin to detect duplicate notes by title, content, or similarity`
   - **Public** ✓
   - **不要** 勾选任何初始化选项（README、.gitignore、LICENSE）
3. 点击 "Create repository"

### 步骤 2：推送代码到 GitHub

在项目目录打开终端，执行以下命令：

```bash
cd "C:\Users\zach\Downloads\Obsidian Plugin - Remove Duplicate Files"

git init
git add .
git commit -m "Initial release: v1.0.0"
git remote add origin https://github.com/iwwx/obsidian-duplicate-finder.git
git branch -M main
git push -u origin main
```

### 步骤 3：创建 GitHub Release

1. 访问：https://github.com/iwwx/obsidian-duplicate-finder/releases/new

2. 填写 Release 信息：
   - **Tag**: `1.0.0`（不要加 v）
   - **Release title**: `1.0.0 - Initial Release`
   - **Description**: 复制以下内容

```markdown
## ✨ Features

- **Multiple Detection Methods**
  - Exact title match (case-insensitive)
  - Exact content match (via MD5 hash)
  - Similar content detection (Jaccard similarity algorithm)

- **Smart Content Comparison**
  - Configurable similarity threshold (0-100%)
  - Automatically ignores image links
  - Chinese text support (bigram tokenization)
  - English text support (word tokenization)

- **Rich UI Features**
  - Side-by-side comparison view for multiple notes
  - Rendered Markdown preview
  - Display frontmatter properties
  - Real-time statistics (word count, character count)

- **Easy File Management**
  - One-click deletion
  - Undo/Redo support
  - Files moved to system trash (recoverable)

- **Multi-language Support**
  - English / 简体中文
  - Auto-detection of Obsidian language
  - Manual language switching

---

## 🌏 功能特性

- **多种检测方式**：标题相同、内容相同、内容相似（Jaccard 算法）
- **智能对比**：可配置相似度阈值，自动忽略图片链接
- **并排预览**：多篇笔记并排对比，Markdown 渲染模式
- **撤销重做**：安全删除，支持撤销恢复
- **多语言**：中英文双语，自动检测语言
```

3. 上传文件：
   - 拖拽或点击上传以下 3 个文件：
     - `main.js`
     - `manifest.json`
     - `styles.css`

4. 点击 **"Publish release"**

### 步骤 4：提交到 Obsidian 社区

#### 4.1 Fork obsidian-releases 仓库

1. 访问：https://github.com/obsidianmd/obsidian-releases
2. 点击右上角 **"Fork"**

#### 4.2 编辑 community-plugins.json

1. 在你 Fork 的仓库中，打开 `community-plugins.json`
2. 点击编辑按钮（铅笔图标）
3. 滚动到文件**最底部**
4. 在最后一个插件的 `}` 后面添加**逗号** `,`
5. 粘贴以下内容：

```json
{
  "id": "duplicate-finder",
  "name": "Duplicate Note Finder",
  "author": "Zach",
  "description": "Detect duplicate notes in your vault by title, exact content, or similarity. Features side-by-side comparison, undo/redo, and multi-language support.",
  "repo": "iwwx/obsidian-duplicate-finder"
}
```

6. 点击 **"Commit changes"**
   - Commit message: `Add Duplicate Note Finder plugin`
   - 选择 "Commit directly to the main branch"
   - 点击 "Commit changes"

#### 4.3 创建 Pull Request

1. 回到你 Fork 的仓库首页
2. 会看到提示 "This branch is 1 commit ahead"
3. 点击 **"Contribute"** → **"Open pull request"**
4. 填写 PR 信息：

**Title**:
```
Add plugin: Duplicate Note Finder
```

**Description**:
```markdown
## Plugin Information

- **Name**: Duplicate Note Finder
- **ID**: duplicate-finder
- **Author**: Zach (@iwwx)
- **Repository**: https://github.com/iwwx/obsidian-duplicate-finder

## Description

An Obsidian plugin that automatically detects duplicate notes in your vault. It supports detection by exact title match, exact content match, and content similarity.

## Key Features

- Multiple detection methods (exact title, exact content, similar content)
- Side-by-side comparison view with rendered Markdown
- Undo/Redo support for safe deletion
- Multi-language support (English/中文)
- Automatically ignores image links when calculating similarity

## Testing

✓ Plugin has been tested in Obsidian Desktop
✓ All features working as expected
✓ Multi-language support verified

## Release Information

- Initial version: 1.0.0
- Release URL: https://github.com/iwwx/obsidian-duplicate-finder/releases/tag/1.0.0

Thank you for reviewing!
```

5. 点击 **"Create pull request"**

---

## ✅ 完成！

现在你只需要：
1. ⏳ 等待 Obsidian 团队审核（通常 1-2 周）
2. 📧 及时回应审核人员的反馈（如果有）
3. ✅ 审核通过后，插件会自动出现在社区插件列表

---

## 📊 审核期间可以做什么

- 在 README 中添加插件截图和演示 GIF
- 准备宣传文案（Reddit、Discord、Twitter）
- 继续改进插件功能
- 关注 PR 页面的评论和反馈

---

## ⚠️ 注意事项

1. **不要删除或修改 Release**
   - 审核人员会检查 Release 中的文件
   - 如果需要更新，请创建新版本（如 1.0.1）

2. **及时响应反馈**
   - 审核人员可能会要求修改
   - 快速响应可以加快审核进度

3. **保持耐心**
   - 社区插件审核是人工的
   - 通常需要 1-2 周时间

---

## 🔗 相关链接

- **你的仓库**: https://github.com/iwwx/obsidian-duplicate-finder
- **Releases**: https://github.com/iwwx/obsidian-duplicate-finder/releases
- **PR 提交地址**: https://github.com/obsidianmd/obsidian-releases/pulls
- **插件开发文档**: https://docs.obsidian.md/Plugins/Releasing/Submit+your+plugin

祝发布顺利！🎉
