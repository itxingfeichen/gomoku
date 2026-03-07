#!/bin/bash
# 五子棋游戏 - GitHub 部署脚本

echo "🚀 五子棋游戏 GitHub 部署脚本"
echo "================================"

# 检查是否提供了仓库 URL
if [ -z "$1" ]; then
    echo ""
    echo "使用方法:"
    echo "  ./deploy.sh <github-username>"
    echo ""
    echo "示例:"
    echo "  ./deploy.sh your-username"
    echo ""
    echo "这将创建仓库并推送到: https://github.com/your-username/gomoku"
    echo ""
    echo "或者手动执行以下命令:"
    echo "  1. 在 GitHub 创建新仓库 'gomoku'"
    echo "  2. 运行：git remote add origin https://github.com/<username>/gomoku.git"
    echo "  3. 运行：git push -u origin main"
    exit 1
fi

USERNAME=$1
REPO_URL="https://github.com/${USERNAME}/gomoku.git"

echo "📦 准备推送到：${REPO_URL}"
echo ""

# 检查 git 是否配置
if ! git config user.email > /dev/null 2>&1; then
    echo "⚠️  请配置 git 用户信息:"
    echo "   git config --global user.email \"your@email.com\""
    echo "   git config --global user.name \"Your Name\""
    exit 1
fi

# 添加远程仓库（如果已存在则先删除）
git remote remove origin 2>/dev/null
git remote add origin $REPO_URL

echo "✅ 远程仓库已添加"
echo ""
echo "📤 现在请执行以下命令推送代码:"
echo "   git push -u origin main"
echo ""
echo "💡 提示：如果是私有仓库或使用 SSH，请使用:"
echo "   git remote set-url origin git@github.com:${USERNAME}/gomoku.git"
echo ""
