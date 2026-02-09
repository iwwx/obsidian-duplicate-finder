# Obsidian 社区插件发布指南

## 📋 发布步骤总览

### 第一步：准备 GitHub 仓库

1. **创建 GitHub 仓库**
   - 仓库名建议：`obsidian-duplicate-finder`
   - 设置为公开仓库（Public）
   - 不要勾选 "Add a README file"（我们已经有了）

2. **初始化本地 Git 仓库并推送**

```bash
cd "C:\Users\zach\Downloads\Obsidian Plugin - Remove Duplicate Files"

# 初始化 Git 仓库
git init

# 添加所有文件（.gitignore 会自动排除不需要的文件）
git add .

# 创建第一次提交
git commit -m "Initial release: v1.0.0"

# 添加远程仓库
git remote add origin https://github.com/iwwx/obsidian-duplicate-finder.git

# 推送到 GitHub
git branch -M main
git push -u origin main
```

### 第二步：创建 Release

1. **在 GitHub 仓库页面**
   - 点击右侧的 "Releases" → "Create a new release"

2. **填写 Release 信息**
   - **Tag version**: `1.0.0`（必须以数字开头，不要加 v）
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
  - Automatically ignores image links when calculating similarity
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
  - Manual language switching in settings

---

## 功能特性

- **多种检测方式**：标题相同、内容相同、内容相似
- **智能对比**：可配置相似度阈值，自动忽略图片链接
- **并排预览**：多篇笔记并排对比，Markdown 渲染模式
- **撤销重做**：安全删除，支持撤销恢复
- **多语言**：中英文双语支持，自动检测
```

3. **上传必需的文件**
   - 点击 "Attach binaries by dropping them here"
   - 上传以下 3 个文件：
     - `main.js`（位于项目根目录，构建后生成）
     - `manifest.json`
     - `styles.css`

4. **发布 Release**
   - 点击 "Publish release"

### 第三步：提交到 Obsidian 社区插件

1. **Fork obsidian-releases 仓库**
   - 访问：https://github.com/obsidianmd/obsidian-releases
   - 点击右上角 "Fork"

2. **添加你的插件信息**
   - 在你 Fork 的仓库中，编辑 `community-plugins.json`
   - 在文件末尾添加你的插件信息：

```json
{
  "id": "duplicate-finder",
  "name": "Duplicate Note Finder",
  "author": "Buyan",
  "description": "Detect duplicate notes in your vault by title, exact content, or similarity. Features side-by-side comparison, undo/redo, and multi-language support.",
  "repo": "iwwx/obsidian-duplicate-finder"
}
```

   注意：
   - 在最后一个插件的 `}` 后面添加逗号 `,`
   - 然后粘贴上面的内容
   - 替换 `yourusername` 为你的 GitHub 用户名

3. **提交 Pull Request**

```bash
# 在你 Fork 的 obsidian-releases 仓库中
git add community-plugins.json
git commit -m "Add Duplicate Note Finder plugin"
git push
```

   - 回到 GitHub 网页，点击 "Pull Request" → "New Pull Request"
   - 标题：`Add plugin: Duplicate Note Finder`
   - 描述中包含：
     - 插件的简短介绍
     - 主要功能列表
     - 插件仓库链接

4. **等待审核**
   - Obsidian 团队通常会在 1-2 周内审核
   - 可能会要求修改，及时响应即可

---

## ✅ 提交前检查清单

确保以下文件存在且内容正确：

- [x] **manifest.json** - 插件元数据
- [x] **versions.json** - 版本兼容性
- [x] **README.md** - 双语文档
- [x] **LICENSE** - MIT 许可证
- [x] **styles.css** - 样式文件
- [x] **main.js** - 构建产物（运行 `npm run build` 生成）
- [x] **.gitignore** - Git 忽略配置

确保以下内容准备好：

- [ ] GitHub 账号
- [ ] 插件已在本地 Obsidian 测试通过
- [ ] README 包含清晰的使用说明和截图（可选但推荐）
- [ ] manifest.json 中的描述是英文（必须）
- [ ] authorUrl 已更新为你的 GitHub 主页或项目页面

---

## 📝 注意事项

1. **插件 ID 唯一性**
   - `duplicate-finder` 这个 ID 可能已被占用
   - 如果提交时提示重复，需要修改为 `duplicate-note-finder` 或其他唯一 ID
   - 修改需同步更新：
     - `manifest.json` 中的 `id`
     - `constants.ts` 中的 `VIEW_TYPE_DUPLICATE`（如果有用到）
     - 重新构建

2. **版本号规范**
   - 必须使用语义化版本：`major.minor.patch`
   - 首次发布建议用 `1.0.0`
   - GitHub Release 的 tag 不要加 `v` 前缀

3. **文件大小**
   - `main.js` 应该小于 2MB
   - 如果过大，检查是否打包了不必要的依赖

4. **描述规范**
   - `manifest.json` 的 `description` 必须是英文
   - 不超过 250 字符
   - 清晰描述插件功能

5. **兼容性**
   - `minAppVersion` 设置为你测试通过的最低 Obsidian 版本
   - 当前设置为 `0.15.0`，较为保守

---

## 🎯 快速命令参考

```bash
# 1. 构建插件
npm run build

# 2. 初始化 Git 并推送到 GitHub
git init
git add .
git commit -m "Initial release: v1.0.0"
git remote add origin https://github.com/iwwx/obsidian-duplicate-finder.git
git branch -M main
git push -u origin main

# 3. 创建 Release（在 GitHub 网页操作，或使用 GitHub CLI）
gh release create 1.0.0 main.js manifest.json styles.css --title "1.0.0 - Initial Release" --notes "See README for details"
```

---

## 🔗 相关链接

- **Obsidian 插件开发文档**: https://docs.obsidian.md/Plugins/Getting+started/Build+a+plugin
- **obsidian-releases 仓库**: https://github.com/obsidianmd/obsidian-releases
- **插件发布指南**: https://docs.obsidian.md/Plugins/Releasing/Submit+your+plugin
- **示例插件**: https://github.com/obsidianmd/obsidian-sample-plugin

---

## 📞 需要帮助？

如果在发布过程中遇到问题：

1. 检查 [Obsidian Discord](https://discord.gg/obsidianmd) 的 #plugin-dev 频道
2. 查看 obsidian-releases 仓库的 [已关闭的 PR](https://github.com/obsidianmd/obsidian-releases/pulls?q=is%3Apr+is%3Aclosed) 作为参考
3. 仔细阅读审核人员的反馈意见

祝发布顺利！🚀
