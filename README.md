# 🎮 五子棋 - 智能对战版

一个具有 AI 对战、双人对战、难度选择、全屏动效和 GitHub 自动提交功能的五子棋游戏。

## ✨ 功能特性

- 🎯 **对战模式**：人机对战 (PVE) / 双人对战 (PVP) 自由切换
- 🎯 **三种难度**：简单、中等、困难（仅 PVE 模式）
- 🎉 **全屏庆祝动效**：获胜/失败时有精美的粒子效果
- 📤 **GitHub 自动提交**：游戏结果自动提交到 GitHub
- 📊 **战绩统计**：记录胜负平数据（PVE 模式）
- 🎨 **精美 UI**：渐变背景、流畅动画
- 📱 **响应式设计**：适配不同屏幕尺寸
- ⌨️ **快捷键支持**：M-切换模式，C-GitHub 配置

## 🚀 快速开始

### 方法一：直接打开
直接在浏览器中打开 `index.html` 即可开始游戏。

### 方法二：本地服务器
```bash
cd /home/admin/gomoku
python3 -m http.server 8080
# 访问 http://localhost:8080
```

## ⚙️ GitHub 自动提交配置

### 1. 创建 GitHub Personal Access Token
1. 访问 https://github.com/settings/tokens
2. 点击 "Generate new token (classic)"
3. 勾选 `repo` 权限
4. 生成并复制 token

### 2. 配置 token
在浏览器控制台运行：
```javascript
localStorage.setItem('github_token', 'your_token_here');
localStorage.setItem('github_repo', 'your_username/your_repo');
```

### 3. 测试连接
在游戏界面按 F12 打开控制台，查看是否有连接成功的日志。

## 📁 项目结构

```
/home/admin/gomoku/
├── index.html          # 主游戏文件
├── README.md           # 项目说明
├── config.js           # 配置与 GitHub API
├── js/                 # 模块化代码（可选）
│   ├── board.js        # 棋盘模块
│   ├── ai.js           # AI 模块
│   ├── game.js         # 游戏逻辑
│   └── main.js         # 入口文件
└── .github/            # GitHub Actions 配置
```

## 🎮 游戏说明

### 操作方式
- 点击棋盘空位落子
- 黑棋先行
- 先连成 5 子者获胜

### 对战模式
| 模式 | 说明 | 难度选择 |
|------|------|----------|
| **人机对战 (PVE)** 🤖 | 玩家 vs AI | ✅ 可选 |
| **双人对战 (PVP)** 👥 | 玩家 vs 玩家（同屏） | ❌ 不适用 |

### 难度说明（PVE 模式）
| 难度 | AI 强度 | 适合人群 |
|------|--------|----------|
| 简单 🌟 | 随机性高 | 新手入门 |
| 中等 🌟🌟 | 攻守平衡 | 普通玩家 |
| 困难 🌟🌟🌟 | 智能评估 | 高手挑战 |

### 快捷键
| 按键 | 功能 |
|------|------|
| **M** | 切换对战模式 (PVE ↔ PVP) |
| **C** | 打开 GitHub 配置面板 |
| **R** | 重新开始游戏 |

## 🛠️ 技术栈

- 纯 HTML/CSS/JavaScript
- 无外部依赖
- AI 使用启发式评估算法

## 📊 战绩统计

游戏会自动记录：
- 胜利次数
- 失败次数
- 平局次数
- 胜率

数据保存在浏览器本地存储中。

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License
