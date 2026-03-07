# 📤 五子棋游戏 - 部署指南

## ✅ 已完成

- [x] 项目文件创建完成
- [x] 本地 Git 仓库初始化
- [x] 代码提交完成

## 📋 项目文件清单

```
/home/admin/gomoku/
├── index.html          # 主页面 (1.6 KB)
├── README.md           # 项目文档 (2.7 KB)
├── deploy.sh           # 部署脚本 (1.2 KB)
├── DEPLOYMENT.md       # 本文件
├── css/
│   └── style.css       # 样式文件 (3.2 KB)
└── js/
    ├── main.js         # 主逻辑入口 (1.4 KB)
    ├── board.js        # 棋盘绘制模块 (6.1 KB)
    ├── game.js         # 游戏逻辑模块 (5.9 KB)
    └── ai.js           # AI 算法模块 (7.9 KB)
```

**总代码量**: ~28 KB

## 🚀 部署到 GitHub

### 方法一：使用部署脚本（推荐）

```bash
cd /home/admin/gomoku

# 1. 在 GitHub 创建新仓库 'gomoku'（公开）
#    访问：https://github.com/new

# 2. 运行部署脚本
./deploy.sh <your-github-username>

# 3. 推送代码
git push -u origin main
```

### 方法二：手动部署

```bash
cd /home/admin/gomoku

# 1. 在 GitHub 创建仓库后，添加远程仓库
git remote add origin https://github.com/<your-username>/gomoku.git

# 2. 推送代码
git push -u origin main
```

### 方法三：使用 GitHub CLI

```bash
# 安装 GitHub CLI (如果未安装)
# macOS: brew install gh
# Linux: sudo apt install gh

# 登录 GitHub
gh auth login

# 创建仓库并推送
cd /home/admin/gomoku
gh repo create gomoku --public --source=. --push
```

## 🌐 本地运行

### 直接打开

```bash
# macOS
open /home/admin/gomoku/index.html

# Windows
start /home/admin/gomoku/index.html

# Linux
xdg-open /home/admin/gomoku/index.html
```

### 使用本地服务器

```bash
cd /home/admin/gomoku

# Python 3
python3 -m http.server 8080

# 或 Python 2
python -m SimpleHTTPServer 8080

# 访问 http://localhost:8080
```

### 使用 Node.js

```bash
cd /home/admin/gomoku
npx serve .
# 或
npx http-server .
```

## 📊 Git 提交记录

```
Commit: 610ade6
Author: OpenClaw Agent <agent@openclaw.local>
Date: 2026-03-07
Message: feat: 初始提交 - 五子棋游戏完整实现

- 添加 HTML 主页面和响应式 CSS 样式
- 实现棋盘绘制模块 (board.js)
- 实现游戏逻辑模块 (game.js)
- 实现 AI 算法模块 (ai.js) - 评分制 + 贪心算法
- 添加主逻辑入口 (main.js)
- 支持双人对战和人机对战模式
- 支持键盘快捷键 (R-重新开始，U-悔棋，M-切换模式)
- 适配移动端响应式布局
```

## 🔗 GitHub Pages 部署

推送代码后，启用 GitHub Pages：

1. 访问仓库设置：`https://github.com/<username>/gomoku/settings/pages`
2. Source 选择 `main` 分支，文件夹选择 `/ (root)`
3. 保存后等待部署完成
4. 访问：`https://<username>.github.io/gomoku`

## 📱 移动端测试

游戏已适配移动端，可在手机浏览器中直接访问：
- 棋盘自动缩放适配屏幕宽度
- 触摸点击落子
- 控制按钮响应式布局

## 🎮 游戏功能

| 功能 | 状态 |
|------|------|
| 15×15 标准棋盘 | ✅ |
| 双人对战模式 | ✅ |
| 人机对战模式 | ✅ |
| AI 算法（简单难度） | ✅ |
| 胜负判断 | ✅ |
| 重新开始 | ✅ |
| 悔棋功能 | ✅ |
| 键盘快捷键 | ✅ |
| 响应式布局 | ✅ |
| 移动端适配 | ✅ |

## 🛠️ 技术栈

- HTML5 + CSS3 + JavaScript (ES6+)
- Canvas 绘图
- 零依赖，纯静态
- 面向对象编程

## 📝 后续优化建议

1. **AI 难度升级**: 添加 minimax 算法实现中等/困难难度
2. **音效**: 添加落子、获胜音效
3. **游戏历史**: 记录并回放棋局
4. **在线对战**: 使用 WebSocket 实现多人在线
5. **禁手规则**: 支持专业五子棋规则

---

**本地部署路径**: `/home/admin/gomoku/`

**创建时间**: 2026-03-07 UTC

**版本**: v1.0.0
