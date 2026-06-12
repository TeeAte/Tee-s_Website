# TeeAte's Retro World

这是一个基于 [Cloudflare Workers](https://workers.cloudflare.com/) 构建的全栈极客博客/个人主页系统。
项目采用了极具复古风格的 Mac OS 经典视窗 UI 设计，兼顾了前台展示与强大的后台管理能力。

## 🌟 核心特性

- **复古 Mac OS 风格界面**：沉浸式的经典窗口、可拖拽面板、复古阴影与边框，带给用户最独特的浏览体验。
- **纯边缘计算架构**：完全依托于 Cloudflare 全球网络，无需传统服务器，极致的响应速度。
- **动静分离的解耦设计** (基于 `core/` 架构)：
  - `core/worker.js`：核心路由拦截与 API 处理分发。
  - `core/frontend.js`：前台游客展示页面（首页动态、关于页面、留言板、画廊）。
  - `core/admin.js`：功能强大的管理后台面板（数据看板、动态管理、留言管理、图床管理、系统设置）。
  - `core/pet_backend.js` & `core/pet_frontend.js`：趣味的“云养像素猫”系统。
  - `core/utils.js`：全局公用工具库（权限校验、统一封装的 API JSON 响应、XSS 防护等）。
- **动态配置化**：背景图片、网易云音乐挂件代码、关于页面的文字与配图均可在后台“系统设置”中实时修改，无需改动代码。
- **全自动极速部署**：内置 `deploy.command` 和 `esbuild` 工具链，支持 macOS 本地一键打包合并并发布至 Cloudflare。

## 💡 功能亮点

- **多图动态发布**：支持发布包含多张图片（最多 4 张）的动态（朋友圈），支持图片上传预览及管理。
- **可交互的留言便利贴墙**：前台留言板采用便利贴墙的形式，用户不仅可以留言，还可以随意拖动便利贴的位置。
- **云养像素猫系统**：前台内置一只互动的像素小猫，访客可以通过点击喂食、玩耍来增加经验值并升级小猫。
- **个人图床与画廊**：自带简单的 KV 图片直传与托管功能，图片可选择直接在 Gallery 画廊中展示，摆脱对第三方图床的依赖。
- **流量统计（记录仪）**：后台内置了访问来源、IP 和 路径监控，方便了解网站的人气动向。

## 🛠️ 技术栈与依赖

- **Runtime (运行环境)**: Cloudflare Workers
- **Database (数据库)**: Cloudflare D1 (SQLite) -> 存储动态(Moments)、留言(Guestbook)、宠物状态(Pet) 和 系统设置(Settings)
- **Storage (对象存储)**: Cloudflare KV -> 存储图床上传的图片以及访问配置
- **Frontend (前端)**: 原生 HTML + CSS (Vanilla JS) + Retro UI 设计
- **Bundler (打包工具)**: esbuild

## 🚀 部署指南 (本地部署)

如果你希望在本地快速打包并覆盖更新到线上，请按照以下步骤操作：

1. **环境准备**：
   请确保你的电脑上安装了 [Node.js](https://nodejs.org/)。

2. **安装依赖包**：
   在终端进入项目根目录，运行一次命令安装依赖（只需执行一次）：
   ```bash
   npm install
   ```

3. **一键上传部署**：
   - 如果你是 macOS 用户：直接双击运行项目根目录下的 `deploy.command` 文件。
   - 如果你是 Windows/Linux 用户：在终端执行：
     ```bash
     npm run build
     npx wrangler deploy
     ```

工具会自动使用 `esbuild` 将 `core/` 目录下的核心模块打包合并为 `dist/worker.js`，然后通过 `wrangler` 部署到你的 Cloudflare 账户（配置文件见 `wrangler.toml`）。

## 📝 目录结构

```text
├── core/                 # 核心代码文件夹
│   ├── admin.js          # 后台管理页面逻辑与 UI
│   ├── frontend.js       # 前台网页逻辑与 UI
│   ├── pet_backend.js    # 像素猫后端接口逻辑
│   ├── pet_frontend.js   # 像素猫前台渲染与交互逻辑
│   ├── utils.js          # 全局通用方法与封装库
│   └── worker.js         # 主路由入口与 API 控制器
├── build.command         # 单独用来打包的脚本指令
├── deploy.command        # macOS 专属的一键打包+上传部署脚本
├── package.json          # 记录依赖 (esbuild) 及打包指令 (npm run build)
├── README.md             # 本文档
└── wrangler.toml         # Cloudflare Wrangler 发布配置文件
```

## 🔐 访问说明

- **前台访问**：直接访问你绑定的根域名（如 `https://teeate.dpdns.org`）
- **后台管理**：在域名后加上 `/admin` 访问，需要通过后台密码进行验证拦截。
