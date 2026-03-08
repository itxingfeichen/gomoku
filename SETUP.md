# 🚀 五子棋游戏 - 快速配置指南

## 1️⃣ 创建 GitHub 仓库

### 在 GitHub 上创建新仓库
1. 访问 https://github.com/new
2. 仓库名：`gomoku-stats`（或你喜欢的名字）
3. 设为 **Public** 或 **Private**（推荐 Public）
4. **不要** 勾选 "Add a README file"
5. 点击 "Create repository"

## 2️⃣ 获取 GitHub Token

### 创建 Personal Access Token
1. 访问 https://github.com/settings/tokens
2. 点击 **"Generate new token (classic)"**
3. 填写备注：`Gomoku Game`
4. 勾选权限：
   - ✅ **repo** (Full control of private repositories)
5. 点击 "Generate token"
6. **复制并保存 token**（只显示一次！）

## 3️⃣ 配置游戏

### 方法一：在游戏界面配置
1. 打开浏览器，访问 `/home/admin/gomoku/index.html`
2. 按 **C** 键打开配置面板
3. 填写：
   - **Token**: 刚才复制的 GitHub token
   - **仓库**: `你的用户名/gomoku-stats`
   - **分支**: `main`（或 `master`）
4. 点击 "测试连接" 验证
5. 点击 "保存"

### 方法二：在浏览器控制台配置
1. 打开游戏后按 **F12** 打开控制台
2. 粘贴并运行：
```javascript
localStorage.setItem('github_token', 'ghp_你的 token');
localStorage.setItem('github_repo', '你的用户名/gomoku-stats');
localStorage.setItem('github_branch', 'main');
console.log('✅ 配置完成！');
```

## 4️⃣ 推送到 GitHub

### 在终端执行
```bash
cd /home/admin/gomoku

# 替换为你的 GitHub 用户名和仓库
git remote add origin https://github.com/你的用户名/gomoku-stats.git

# 推送代码
git branch -M main
git push -u origin main
```

## 5️⃣ 开始游戏

### 打开游戏
```bash
# 方法 1: 直接打开
firefox /home/admin/gomoku/index.html

# 方法 2: 本地服务器
cd /home/admin/gomoku
python3 -m http.server 8080
# 访问 http://localhost:8080
```

### 游戏操作
- **点击棋盘**：落子
- **对战模式**：选择人机对战 (PVE) 或双人对战 (PVP)
- **难度选择**：切换 AI 难度（仅 PVE 模式）
- **自动提交**：开启后游戏结果自动提交到 GitHub
- **快捷键**：
  - **M** - 切换对战模式
  - **C** - 打开配置面板
  - **R** - 重新开始

## 6️⃣ 查看游戏数据

### 在 GitHub 仓库查看
- `stats.json` - 你的总战绩统计
- `game-results/` - 每局游戏的详细记录

### 示例 stats.json
```json
{
  "wins": 15,
  "losses": 8,
  "draws": 2,
  "totalGames": 25,
  "winStreak": 3,
  "bestWinStreak": 7
}
```

## ⚠️ 常见问题

### Q: Token 安全吗？
A: Token 只保存在你的浏览器本地存储中，不会发送给第三方。

### Q: 提交失败怎么办？
A: 检查：
1. Token 是否正确
2. 仓库名是否正确（用户名/仓库名）
3. 分支名是否正确（main 或 master）
4. 网络是否正常

### Q: 可以关闭自动提交吗？
A: 可以，在游戏界面将 "自动提交 GitHub" 设为 "关闭" 即可。

### Q: 如何重置战绩？
A: 点击 "重置统计" 按钮，或在控制台运行：
```javascript
gameStats.reset();
location.reload();
```

## 🎮 祝你游戏愉快！

有问题欢迎提 Issue~
