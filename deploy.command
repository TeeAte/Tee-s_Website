#!/bin/bash
cd "$(dirname "$0")"
echo "正在一键打包并部署项目到 Cloudflare..."
echo "----------------------------------------"

# 1. 先进行本地打包
echo "[1/2] 正在打包..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ 打包失败！请检查代码是否有语法错误。"
    read -p "按回车键退出..."
    exit 1
fi

# 2. 调用 Wrangler 进行部署
echo "[2/2] 正在上传部署..."
# 这里需要用 dist/worker.js，或者用入口 worker.js 让 wrangler 自己解析
# 我们在 wrangler.toml 中已经配置了 main = "dist/worker.js"
# 加入 WRANGLER_SEND_METRICS=false 防止因为偶尔弹出统计确认窗口导致卡死
WRANGLER_SEND_METRICS=false npx wrangler deploy
if [ $? -ne 0 ]; then
    echo "❌ 部署失败！请检查网络或配置。"
    read -p "按回车键退出..."
    exit 1
fi

echo "----------------------------------------"
echo "✅ 部署成功！将在 5 秒后自动关闭终端窗口，按回车键立即退出..."
echo ""
read -t 5
osascript -e 'tell application "Terminal" to close front window' &> /dev/null || exit 0
