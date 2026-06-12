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
# 因为我们配置了 main = "worker.js"，所以直接执行 deploy 即可
npx wrangler deploy
if [ $? -ne 0 ]; then
    echo "❌ 部署失败！请检查网络或配置。"
    read -p "按回车键退出..."
    exit 1
fi

echo "----------------------------------------"
echo "✅ 部署成功！"
echo ""
read -p "按回车键退出..."
