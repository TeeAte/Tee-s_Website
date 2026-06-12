import { escapeHtml, isAuthenticated } from "./utils.js";

export 
async function serveAdminPanel(request, env) {
  const isAuth = isAuthenticated(request);
  const url = new URL(request.url);

  // 获取设置
  const settingsResult = await env.DB.prepare('SELECT key, value FROM settings').all();
  const settingsMap = {};
  if (settingsResult.results) {
    settingsResult.results.forEach(r => settingsMap[r.key] = r.value);
  }
  let siteTitle = settingsMap['site_title'] || "TeeAte's Website";
  let siteSubtitle = settingsMap['site_subtitle'] || "很Niubi 的 Website";
  let windowTitle = settingsMap['window_title'] || siteTitle;
  let aboutContent = settingsMap['about_content'] || '';
  let aboutTitle = settingsMap['about_title'] || '关于我 (About)';
  let aboutImageUrl = settingsMap['about_image_url'] || '';
  let musicPlayerCode = settingsMap['music_player_code'] || '';

  // 获取数据统计
  const postsResult = await env.DB.prepare('SELECT * FROM posts ORDER BY created_at DESC').all();
  const posts = postsResult.results || [];
  
  const visitsResult = await env.DB.prepare('SELECT * FROM visits ORDER BY visit_time DESC LIMIT 100').all();
  const visits = visitsResult.results || [];

  const logsResult = await env.DB.prepare('SELECT * FROM logs ORDER BY created_at DESC LIMIT 50').all();
  const logs = logsResult.results || [];

  const gbResult = await env.DB.prepare('SELECT * FROM guestbook ORDER BY created_at DESC').all();
  const guestbook = gbResult.results || [];

  // 聚合统计
  const totalVisits = await env.DB.prepare('SELECT COUNT(*) as count FROM visits').first('count');
  const uniqueIPs = await env.DB.prepare('SELECT COUNT(DISTINCT ip) as count FROM visits').first('count');
  
  const topPagesResult = await env.DB.prepare('SELECT path, COUNT(*) as count FROM visits GROUP BY path ORDER BY count DESC LIMIT 5').all();
  const topPages = topPagesResult.results || [];

  const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>控制面板</title>
  <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect x='10' y='10' width='80' height='80' rx='10' fill='%23333' stroke='%23000' stroke-width='5'/><circle cx='30' cy='30' r='10' fill='%23fff'/><circle cx='70' cy='30' r='10' fill='%23fff'/><rect x='25' y='60' width='10' height='20' fill='%23fff'/><rect x='65' y='50' width='10' height='30' fill='%23fff'/></svg>">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body { height: 100%; overflow: hidden; }
    :root {
      --bg: #FFFFFF; --bg2: #BBBBBB; --bg3: #AAAAAA; --bg4: #999999;
      --border: #000000; --border2: #888888;
      --text: #000000; --text2: #333333; --text3: #666666;
    }
    body {
      font-family: "Chicago", "Geneva", "Monaco", "Courier New", monospace;
      background: #999999;
      color: var(--text);
      height: 100vh;
      overflow: hidden;
      font-size: 15px;
    }

    /* Mac Menu Bar */
    .menu-bar { height: 28px; background: #FFFFFF; border-bottom: 2px solid #000000; display: flex; align-items: center; padding: 0 12px; font-size: 14px; font-weight: 700; gap: 20px; }
    .menu-bar .apple { font-size: 18px; margin-right: 8px; }
    .menu-item { padding: 2px 8px; cursor: default; }
    .menu-item:hover { background: #000000; color: #FFFFFF; }

    .app { display: flex; flex-direction: column; height: calc(100vh - 28px); border: 1px solid #000000; margin: 10px; background: #BBBBBB; box-shadow: 2px 2px 0px rgba(0,0,0,0.5); }
    @media(max-width:800px) { .app { margin: 0; height: calc(100vh - 28px); border-radius: 0; } }

    /* Title Bar with Pinstripes */
    .topbar { display: flex; align-items: center; padding: 0 8px; height: 36px; background: repeating-linear-gradient(to bottom, #000000 0px, #000000 1px, #FFFFFF 1px, #FFFFFF 2px); border-bottom: 1px solid #000000; position: relative; flex-shrink: 0; }
    .close-box { width: 16px; height: 16px; background: #BBBBBB; border: 1px solid #000000; flex-shrink: 0; position: relative; cursor: pointer; }
    .close-box::before, .close-box::after { content: ""; position: absolute; top: 3px; left: 7px; width: 1px; height: 9px; background: #000000; border: none; }
    .close-box::before { transform: rotate(45deg); }
    .close-box::after { transform: rotate(-45deg); }
    .close-box:active { background: #000; }
    .close-box:active::before, .close-box:active::after { background: #FFFFFF; }
    .topbar h1 { font-size: 15px; font-weight: 700; letter-spacing: 0; display: flex; align-items: center; gap: 6px; background: #FFFFFF; padding: 2px 16px; border: 1px solid #000000; position: absolute; left: 50%; transform: translateX(-50%); z-index: 1; }
    .shade-box { width: 16px; height: 16px; background: #BBBBBB; border: 1px solid #000000; flex-shrink: 0; position: relative; margin-left: auto; }
    .shade-box::after { content: ""; position: absolute; top: 7px; left: 3px; right: 3px; border-bottom: 1px solid #000000; }
    .zoom-box { width: 16px; height: 16px; background: #BBBBBB; border: 1px solid #000000; flex-shrink: 0; position: relative; margin-left: 4px; }
    .zoom-box::after { content: ""; position: absolute; top: 3px; left: 3px; right: 3px; bottom: 3px; border: 1px solid #000000; }

    .main-area { display: flex; flex: 1; overflow: hidden; }
    @media(max-width:800px) { .main-area { flex-direction: column; } }

    /* Sidebar / Tabs */
    .sidebar { width: 200px; background: #BBBBBB; border-right: 1px solid #000000; display: flex; flex-direction: column; border-top: 1px solid #FFFFFF; flex-shrink: 0; }
    @media(max-width:800px) {
      .sidebar { width: 100%; flex-direction: row; flex-wrap: wrap; border-right: none; border-bottom: 1px solid #000000; }
    }
    .panel-tab { padding: 12px 16px; font-size: 14px; font-weight: 700; color: #333333; cursor: pointer; border-bottom: 1px solid #000000; border-top: 1px solid #FFFFFF; }
    @media(max-width:800px) {
      .panel-tab { padding: 8px 12px; flex: 1; text-align: center; margin-bottom: 0; border-right: 1px solid #000000; }
      .panel-tab:last-child { border-right: none; }
    }
    .panel-tab.active { background: #000000; color: #FFFFFF; }
    .panel-tab:hover:not(.active) { background: #AAAAAA; }

    /* Content Area */
    .content-area { flex: 1; background: #FFFFFF; overflow-y: auto; padding: 20px; box-shadow: inset 1px 1px 0 #000000, inset -1px -1px 0 #FFFFFF; position: relative; }
    @media(max-width:800px) { .content-area { padding: 10px; overflow-x: auto; } }
    .tab-content { display: none; }
    .tab-content.active { display: block; }

    /* Forms & Inputs */
    .form-group { margin-bottom: 16px; }
    .form-group label { display: block; font-size: 14px; color: #000000; margin-bottom: 5px; font-weight: 700; }
    .form-group input[type="text"], .form-group input[type="password"] { width: 100%; height: 36px; padding: 0 8px; border: 1px solid #000000; box-shadow: inset 1px 1px 0 #000000, inset -1px -1px 0 #FFFFFF; background: #FFFFFF; color: #000000; font-size: 14px; outline: none; font-family: "Chicago", "Geneva", "Monaco", "Courier New", monospace; border-radius: 0; }
    .form-group textarea { width: 100%; padding: 8px; border: 1px solid #000000; box-shadow: inset 1px 1px 0 #000000, inset -1px -1px 0 #FFFFFF; background: #FFFFFF; color: #000000; font-size: 14px; outline: none; font-family: "Chicago", "Geneva", "Monaco", "Courier New", monospace; border-radius: 0; min-height: 150px; resize: vertical; }
    .form-group input:focus, .form-group textarea:focus { background: #FFFFEE; }

    /* Buttons */
    .btn { height: 36px; padding: 0 20px; border: 1px solid #000000; box-shadow: inset 1px 1px 0 #FFFFFF, inset 2px 2px 0 #DDDDDD, inset -1px -1px 0 #888888, inset -2px -2px 0 #000000; background: #BBBBBB; color: #000000; font-size: 14px; font-weight: 700; cursor: pointer; white-space: nowrap; font-family: "Chicago", "Geneva", "Monaco", "Courier New", monospace; border-radius: 0; display: inline-flex; align-items: center; justify-content: center; }
    .btn:active { box-shadow: inset 1px 1px 0 #888888, inset 2px 2px 0 #000000, inset -1px -1px 0 #FFFFFF, inset -2px -2px 0 #DDDDDD; padding-top: 1px; padding-left: 1px; }
    .btn:disabled { color: #999999; cursor: not-allowed; }
    .btn-small { height: 28px; padding: 0 12px; font-size: 12px; }

    /* Login View */
    #loginView { position: absolute; inset: 0; background: #999999; display: flex; align-items: center; justify-content: center; z-index: 100; }
    .login-box { background: #BBBBBB; border: 1px solid #000000; padding: 2px; width: 300px; box-shadow: 2px 2px 0 #000000; }
    .login-box-inner { border: 2px solid #000000; padding: 20px; background: #FFFFFF; text-align: center; }
    .login-box h2 { margin-bottom: 20px; font-size: 16px; font-weight: 700; border-bottom: 2px solid #000000; padding-bottom: 5px; }

    /* Messages */
    .message { padding: 8px 12px; border: 1px solid #000000; margin-bottom: 15px; font-weight: bold; display: none; font-size: 13px; }
    .message.success { background: #FFFFFF; border: 2px solid #000000; display: block; box-shadow: 2px 2px 0px #000; }
    .message.error { background: #000000; color: #FFFFFF; display: block; box-shadow: 2px 2px 0px #FFF; }

    /* Stats & Cards */
    .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 10px; margin-bottom: 20px; }
    .stat-card { background: #FFFFFF; border: 1px solid #000000; padding: 15px; text-align: center; box-shadow: inset 1px 1px 0 #000000, inset -1px -1px 0 #FFFFFF; }
    .stat-card .number { font-size: 24px; font-weight: 700; margin-bottom: 5px; }
    .stat-card .label { font-size: 12px; color: #333333; }

    /* Post List */
    .post-item { border: 1px solid #000000; padding: 10px; margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center; background: #EEEEEE; }
    .post-item:hover { background: #DDDDDD; }
    .post-item-info h3 { font-size: 15px; margin-bottom: 4px; }
    .post-item-info p { font-size: 12px; color: #666666; font-family: "Monaco", "Courier New", monospace; }

    /* Upload Area */
    .upload-area { border: 1px dashed #000000; background: #EEEEEE; padding: 20px; text-align: center; cursor: pointer; }
    .upload-area:active { background: #DDDDDD; }
    .preview-image { max-width: 200px; max-height: 200px; border: 1px solid #000000; margin-top: 10px; }
    .progress-bar { height: 14px; border: 1px solid #000000; background: #FFFFFF; margin-top: 10px; box-shadow: inset 1px 1px 0 #000, inset -1px -1px 0 #FFF; }
    .progress-fill { height: 100%; background: repeating-linear-gradient(45deg, #000 0, #000 10px, #FFF 10px, #FFF 20px); transition: width 0.3s; }

    /* Tables */
    .visit-table { width: 100%; border-collapse: collapse; border: 1px solid #000000; font-size: 12px; table-layout: fixed; }
    .visit-table th, .visit-table td { padding: 4px 6px; border: 1px solid #000000; text-align: left; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .visit-table th { background: #BBBBBB; font-weight: 700; }
    .visit-table tr:nth-child(even) { background: #EEEEEE; }
    .visit-table tr:hover { background: #DDDDDD; }

    .section-title { font-size: 16px; font-weight: 700; border-bottom: 2px solid #000000; margin-bottom: 15px; padding-bottom: 5px; }
  </style>
</head>
<body>
  <div id="loginView">
    <div class="login-box">
      <div class="login-box-inner">
        <h2>登录控制面板</h2>
        <div id="loginMessage" class="message error"></div>
        <div class="form-group">
          <input type="password" id="passwordInput" placeholder="输入管理员密码..." onkeypress="if(event.key === 'Enter') login()">
        </div>
        <button class="btn" onclick="login()">登录</button>
      </div>
    </div>
  </div>

  <div class="menu-bar" style="display: none;" id="menuBar">
    <span class="apple"></span>
    <span class="menu-item" onclick="window.open('/', '_blank')">进入站点</span>
    <span class="menu-item">文件</span>
    <span class="menu-item">编辑</span>
    <span class="menu-item">视图</span>
  </div>

  <div class="app" id="dashboardView" style="display: none;">
    <header class="topbar">
      <div class="close-box" onclick="logout()"></div>
      <h1>Control Panel</h1>
      <div class="shade-box"></div>
      <div class="zoom-box"></div>
    </header>
    
    <div class="main-area">
      <aside class="sidebar">
        <div class="panel-tab active" onclick="switchTab('postsTab')">文章管理</div>
        <div class="panel-tab" onclick="switchTab('statsTab')">流量统计</div>
        <div class="panel-tab" onclick="switchTab('visitsTab')">访问记录</div>
        <div class="panel-tab" onclick="switchTab('guestbookTab')">留言管理</div>
        <div class="panel-tab" onclick="switchTab('logsTab')">系统日志</div>
        <div class="panel-tab" onclick="switchTab('settingsTab')">系统设置</div>
        <div class="panel-tab" onclick="switchTab('imagesTab')">图床管理</div>
      </aside>
      
      <section class="content-area">
        <div id="postsTab" class="tab-content active">
          <div id="postMessage" class="message"></div>
          
          <div class="section-title" style="display:flex; justify-content:space-between; align-items:center;">
            写新动态
            <button class="btn btn-small" onclick="publishPost()">发布</button>
          </div>
          <div class="form-group">
            <input type="text" id="postTitle" placeholder="标题...">
          </div>
          <div class="form-group">
            <textarea id="postContent" placeholder="写点什么吧..."></textarea>
          </div>
          
          <div class="form-group">
            <label>配图 (点击上传)</label>
            <div class="upload-area" onclick="document.getElementById('imageInput').click()">
              <div id="uploadPrompt">选择图片或拖拽到此处</div>
              <img id="imagePreview" class="preview-image" style="display:none;">
            </div>
            <input type="file" id="imageInput" style="display:none" accept="image/*" onchange="handleImageSelect(event)">
            <div class="progress-bar" id="uploadProgress" style="display:none">
              <div class="progress-fill" id="uploadFill" style="width: 0%"></div>
            </div>
          </div>

          <div class="section-title" style="margin-top:30px;">历史动态</div>
          <div id="postList"></div>
        </div>

        <div id="statsTab" class="tab-content">
          <div class="section-title">核心数据</div>
          <div class="stats-grid">
            <div class="stat-card">
              <div class="number" id="statTotalVisits">0</div>
              <div class="label">总访问量</div>
            </div>
            <div class="stat-card">
              <div class="number" id="statUniqueIPs">0</div>
              <div class="label">独立访客 (IP)</div>
            </div>
            <div class="stat-card">
              <div class="number" id="statTotalPosts">0</div>
              <div class="label">已发布动态</div>
            </div>
          </div>
          
          <div class="section-title">最受欢迎页面 (Top 5)</div>
          <div id="topPagesList" style="background:#EEEEEE; border:1px solid #000; padding:10px;"></div>
        </div>

        <div id="visitsTab" class="tab-content">
          <div class="section-title">最近访问记录 <button id="refreshVisitsBtn" class="btn btn-small" onclick="refreshVisits()" style="float: right; margin-top: -5px;">刷新</button></div>
          <table class="visit-table">
            <thead>
              <tr><th>时间</th><th>路径</th><th>IP</th><th>设备</th></tr>
            </thead>
            <tbody id="visitTableBody"></tbody>
          </table>
        </div>

        <div id="guestbookTab" class="tab-content">
          <div id="gbMessage" class="message"></div>
          <div class="section-title">留言管理</div>
          <table class="visit-table">
            <thead>
              <tr><th>时间</th><th>昵称</th><th>内容</th><th>操作</th></tr>
            </thead>
            <tbody id="guestbookTableBody"></tbody>
          </table>
        </div>

        <div id="logsTab" class="tab-content">
          <div class="section-title">系统日志 (最近50条)</div>
          <table class="visit-table">
            <thead>
              <tr><th>时间</th><th>级别</th><th>信息</th></tr>
            </thead>
            <tbody id="logTableBody"></tbody>
          </table>
        </div>

        <div id="settingsTab" class="tab-content">
          <div id="settingsMessage" class="message"></div>
          <div class="section-title">网站信息设置</div>
          <div class="form-group">
            <label>网页标题栏 (Mac 伪标题栏)</label>
            <input type="text" id="windowTitleInput" placeholder="显示在浏览器标签页和 Mac 标题栏上的文字">
          </div>
          <div class="form-group">
            <label>首页大标题 (打字效果)</label>
            <input type="text" id="siteTitleInput" placeholder="TeeAte's Website">
          </div>
          <div class="form-group">
            <label>首页副标题</label>
            <input type="text" id="siteSubtitleInput" placeholder="很Niubi 的 Website">
          </div>

          <div class="form-group">
            <label>前台“关于”页面标题</label>
            <input type="text" id="aboutTitleInput" placeholder="关于我 (About)">
          </div>
          <div class="form-group">
            <label>前台“关于”页面内容 (支持 HTML)</label>
            <textarea id="aboutContentInput" placeholder="输入关于你的介绍..."></textarea>
          </div>

          <div class="form-group">
            <label>前台“关于”页面配图</label>
            <div style="display: flex; gap: 10px; align-items: flex-start;">
              <div style="flex: 1;">
                <input type="text" id="aboutImageInput" placeholder="图片链接 (也可直接上传)">
                <input type="file" id="aboutImageUpload" accept="image/*,image/gif" style="display:none" onchange="uploadAboutImage(event)">
                <div style="margin-top: 10px; display: flex; gap: 10px;">
                  <button class="btn btn-small" onclick="document.getElementById('aboutImageUpload').click()">上传新图片</button>
                  <button class="btn btn-small" onclick="clearAboutImage()">清除图片</button>
                </div>
              </div>
              <img id="aboutImagePreview" src="" style="display:none; max-width: 150px; max-height: 100px; border: 1px solid #000;">
            </div>
          </div>
          <div class="form-group">
            <label>嵌入式音乐播放器代码 (支持 iframe/HTML)</label>
            <textarea id="musicPlayerCodeInput" placeholder="输入你想嵌入的音乐播放器代码..."></textarea>
          </div>
          <div class="form-group">
            <label>修改管理后台密码</label>
            <input type="password" id="adminPasswordInput" placeholder="留空则不修改...">
          </div>
          <button class="btn" onclick="saveSettings()">保存设置</button>
        </div>

        <div id="imagesTab" class="tab-content">
          <div id="imagesMessage" class="message"></div>
          <div class="section-title">图床管理 (KV)</div>
          <div style="margin-bottom: 15px; display: flex; gap: 10px;">
            <button class="btn btn-small" onclick="loadImages()">刷新图床</button>
            <button class="btn btn-small" style="background: #aa0000; border-color: #880000;" onclick="cleanUnusedImages()">一键清理未使用</button>
          </div>
          <div id="imagesList" style="display: flex; flex-wrap: wrap; gap: 10px;">
            <!-- Images go here -->
          </div>
        </div>

      </section>
    </div>
  </div>

  <div id="visitDetailsModal" class="modal-overlay" style="display:none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 1000; justify-content: center; align-items: center; padding: 16px;">
    <div class="window" style="width: 100%; max-width: 500px; max-height: 90vh; display: flex; flex-direction: column;">
      <div class="topbar">
        <div class="close-box" onclick="closeVisitDetails()"></div>
        <h1>访问详情</h1>
        <div class="shade-box"></div>
        <div class="zoom-box"></div>
      </div>
      <div style="flex: 1; overflow-y: auto; background: #BBBBBB; padding: 15px; border-top: 1px solid #FFFFFF;">
        <div id="visitDetailsContent" style="background: #FFFFFF; border: 1px solid #000000; box-shadow: inset 1px 1px 2px rgba(0,0,0,0.2); padding: 12px; font-size: 14px; line-height: 1.6; max-height: 60vh; overflow-y: auto;"></div>
        <div style="text-align: right; margin-top: 15px;">
          <button class="btn" onclick="closeVisitDetails()">确定</button>
        </div>
      </div>
    </div>
  </div>

  <script>
    let recentlyDeletedImages = new Set();
    function escapeHtml(text) {
      if (!text) return '';
      return String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    }
    // 注入初始数据
    const stats = {
      totalVisits: ${totalVisits},
      uniqueIPs: ${uniqueIPs},
      totalPosts: ${posts.length},
      topPages: ${JSON.stringify(topPages)}
    };
    const postsData = ${JSON.stringify(posts)};
    const visitsData = ${JSON.stringify(visits)};
    const logsData = ${JSON.stringify(logs)};
    const guestbookData = ${JSON.stringify(guestbook)};
    const currentSettings = {
      site_title: \`${siteTitle.replace(/`/g, "\\`")}\`,
      site_subtitle: \`${siteSubtitle.replace(/`/g, "\\`")}\`,
      window_title: \`${windowTitle.replace(/`/g, "\\`")}\`,
      about_title: \`${aboutTitle.replace(/`/g, "\\`")}\`,
      about_image_url: \`${aboutImageUrl.replace(/`/g, "\\`")}\`,
      about_content: \`${aboutContent.replace(/`/g, "\\`")}\`,
      music_player_code: \`${musicPlayerCode.replace(/`/g, "\\`")}\`
    };

    let uploadedImageUrl = '';

    window.onload = () => {
      const isAuth = ${isAuth};
      if (isAuth || document.cookie.includes('admin_token=secret-admin-token')) {
        showDashboard();
      }
    };

    function showDashboard() {
      document.getElementById('loginView').style.display = 'none';
      document.getElementById('menuBar').style.display = 'flex';
      document.getElementById('dashboardView').style.display = 'flex';
      renderData();
    }

    async function login() {
      const pwd = document.getElementById('passwordInput').value;
      try {
        const res = await fetch('/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password: pwd })
        });
        const data = await res.json();
        if (data.success) {
          showDashboard();
        } else {
          showMessage('loginMessage', data.message, 'error');
        }
      } catch (e) {
        showMessage('loginMessage', '登录请求失败', 'error');
      }
    }

    async function logout() {
      await fetch('/logout');
      location.reload();
    }

    let switchTab = function(tabId) {
      document.querySelectorAll('.panel-tab').forEach(el => el.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
      if (event && event.target) {
        event.target.classList.add('active');
      }
      document.getElementById(tabId).classList.add('active');
      if (tabId === 'imagesTab') {
        loadImages();
      }
    };

    function showMessage(elementId, message, type = 'success') {
      const el = document.getElementById(elementId);
      el.textContent = message;
      el.className = 'message ' + type;
      setTimeout(() => { el.className = 'message'; }, 3000);
    }

    function renderData() {
      // Stats
      document.getElementById('statTotalVisits').textContent = stats.totalVisits;
      document.getElementById('statUniqueIPs').textContent = stats.uniqueIPs;
      document.getElementById('statTotalPosts').textContent = stats.totalPosts;
      
      const pagesDiv = document.getElementById('topPagesList');
      if (stats.topPages.length > 0) {
        pagesDiv.innerHTML = stats.topPages.map(page => \`
          <div style="display:flex; justify-content:space-between; border-bottom:1px solid #ccc; padding:5px 0;">
            <span>\${escapeHtml(page.path)}</span>
            <span style="font-weight:bold;">\${escapeHtml(String(page.count))} 次</span>
          </div>
        \`).join('');
      } else {
        pagesDiv.innerHTML = '<p>暂无数据</p>';
      }

      // Posts
      const postList = document.getElementById('postList');
      postList.innerHTML = postsData.map(post => \`
        <div class="post-item">
          <div class="post-item-info">
            <h3>\${escapeHtml(post.title)}</h3>
            <p>\${new Date(post.created_at).toLocaleString('zh-CN')}</p>
          </div>
          <div>
            <button class="btn btn-small" onclick="editPost(\${post.id})">编辑</button>
            <button class="btn btn-small" onclick="deletePost(\${post.id})">删除</button>
          </div>
        </div>
      \`).join('');

      // Visits
      const visitBody = document.getElementById('visitTableBody');
      visitBody.innerHTML = visitsData.map(v => \`
        <tr onclick="showVisitDetails('\${v.id}')" style="cursor: pointer;" title="点击查看详情">
          <td>\${new Date(v.visit_time).toLocaleString('zh-CN')}</td>
          <td>\${escapeHtml(v.path)}</td>
          <td>\${escapeHtml(v.ip)}</td>
          <td title="\${escapeHtml(v.user_agent)}">\${escapeHtml(v.user_agent).substring(0,30)}...</td>
        </tr>
      \`).join('');

      // Guestbook
      const gbBody = document.getElementById('guestbookTableBody');
      gbBody.innerHTML = guestbookData.map(g => \`
        <tr>
          <td>\${new Date(g.created_at).toLocaleString('zh-CN')}</td>
          <td>\${escapeHtml(g.author)}</td>
          <td>\${escapeHtml(g.message).substring(0,30)}\${g.message.length>30?'...':''}</td>
          <td>
            <button class="btn btn-small" onclick="editGuestbook(\${g.id})">编辑</button>
            <button class="btn btn-small" onclick="deleteGuestbook(\${g.id})">删除</button>
          </td>
        </tr>
      \`).join('');

      // Logs
      const logBody = document.getElementById('logTableBody');
      logBody.innerHTML = logsData.map(l => \`
        <tr>
          <td>\${new Date(l.created_at).toLocaleString('zh-CN')}</td>
          <td>\${escapeHtml(l.level)}</td>
          <td title="\${escapeHtml(l.message)}">\${escapeHtml(l.message).substring(0,50)}...</td>
        </tr>
      \`).join('');

      // Settings
      document.getElementById('siteTitleInput').value = currentSettings.site_title;
      document.getElementById('siteSubtitleInput').value = currentSettings.site_subtitle;
      document.getElementById('windowTitleInput').value = currentSettings.window_title;
      document.getElementById('aboutTitleInput').value = currentSettings.about_title;
      document.getElementById('aboutContentInput').value = currentSettings.about_content;
      document.getElementById('aboutImageInput').value = currentSettings.about_image_url || '';
      if (currentSettings.about_image_url) { document.getElementById('aboutImagePreview').src = currentSettings.about_image_url; document.getElementById('aboutImagePreview').style.display = 'block'; }
      document.getElementById('musicPlayerCodeInput').value = currentSettings.music_player_code || '';
    }

    async function handleImageSelect(event) {
      const file = event.target.files[0];
      if (!file) return;

      const promptDiv = document.getElementById('uploadPrompt');
      const previewImg = document.getElementById('imagePreview');
      const progressBar = document.getElementById('uploadProgress');
      const progressFill = document.getElementById('uploadFill');

      promptDiv.style.display = 'none';
      progressBar.style.display = 'block';
      progressFill.style.width = '30%';

      try {
        const formData = new FormData();
        formData.append('image', file);
        formData.append('filename', file.name);

        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        });
        
        const data = await res.json();
        if (data.success) {
          uploadedImageUrl = data.url; // 获取图片外链
          previewImg.src = uploadedImageUrl;
          previewImg.style.display = 'inline-block';
          progressFill.style.width = '100%';
          showMessage('postMessage', '图片上传成功！', 'success');
        } else {
          throw new Error(data.error || '图片上传失败');
        }
      } catch (err) {
        showMessage('postMessage', '图片上传出错: ' + err.message, 'error');
        promptDiv.style.display = 'block';
      } finally {
        setTimeout(() => { progressBar.style.display = 'none'; }, 1000);
      }
    }



    async function refreshStats() {
      const btn = document.getElementById('refreshStatsBtn');
      if (btn) btn.textContent = '刷新中...';
      try {
        const res = await fetch('/api/stats');
        const data = await res.json();
        document.getElementById('statTotalVisits').textContent = data.totalVisits;
        document.getElementById('statUniqueIPs').textContent = data.uniqueIPs;
        document.getElementById('statTotalPosts').textContent = data.totalPosts;
        
        const topPagesHtml = data.topPages.map((p, i) => \`
          <div style="display:flex; justify-content:space-between; margin-bottom:5px; padding:5px; background:#fff; border:1px solid #ccc;">
            <span>\${i+1}. \${escapeHtml(p.path)}</span>
            <span style="font-weight:bold;">\${p.count} 次</span>
          </div>
        \`).join('');
        document.getElementById('topPagesList').innerHTML = topPagesHtml || '<p>暂无数据</p>';
      } catch(e) {
        console.error('Refresh stats failed', e);
      }
      if (btn) btn.textContent = '刷新';
    }

    async function refreshVisits() {
      const btn = document.getElementById('refreshVisitsBtn');
      if (btn) btn.textContent = '刷新中...';
      try {
        const res = await fetch('/api/visits');
        const data = await res.json();
        // Update visitsData global so details modal works
        visitsData.length = 0;
        visitsData.push(...data);
        
        const visitBody = document.getElementById('visitTableBody');
        visitBody.innerHTML = visitsData.map(v => \`
          <tr onclick="showVisitDetails('\${v.id}')" style="cursor: pointer;" title="点击查看详情">
            <td>\${new Date(v.visit_time).toLocaleString('zh-CN')}</td>
            <td>\${escapeHtml(v.path)}</td>
            <td>\${escapeHtml(v.ip)}</td>
            <td>\${escapeHtml(v.user_agent).substring(0,30)}...</td>
          </tr>
        \`).join('');
      } catch(e) {
        console.error('Refresh visits failed', e);
      }
      if (btn) btn.textContent = '刷新';
    }

    function showVisitDetails(id) {
      const v = visitsData.find(x => x.id == id);
      if (!v) return;
      const details = \`
        <p><strong>访问时间：</strong> \${new Date(v.visit_time).toLocaleString('zh-CN')}</p>
        <p><strong>路径：</strong> \${escapeHtml(v.path)}</p>
        <p><strong>IP：</strong> \${escapeHtml(v.ip)}</p>
        <p><strong>设备 (User-Agent)：</strong></p>
        <div style="background: #eee; padding: 10px; border-radius: 4px; word-break: break-all; margin-bottom: 10px;">\${escapeHtml(v.user_agent)}</div>
        <p><strong>来源 (Referrer)：</strong></p>
        <div style="background: #eee; padding: 10px; border-radius: 4px; word-break: break-all;">\${escapeHtml(v.referrer || '无')}</div>
      \`;
      document.getElementById('visitDetailsContent').innerHTML = details;
      document.getElementById('visitDetailsModal').style.display = 'flex';
    }

    function closeVisitDetails() {
      document.getElementById('visitDetailsModal').style.display = 'none';
    }

    let editingPostId = null;

    function editPost(id) {
      const post = postsData.find(p => p.id === id);
      if (!post) return;
      document.getElementById('postTitle').value = post.title;
      document.getElementById('postContent').value = post.content;
      uploadedImageUrl = post.image_url || '';
      
      const previewImg = document.getElementById('imagePreview');
      if (uploadedImageUrl) {
        previewImg.src = uploadedImageUrl;
        previewImg.style.display = 'inline-block';
      } else {
        previewImg.style.display = 'none';
      }
      
      editingPostId = id;
      const uploadText = document.getElementById('uploadPrompt');
      uploadText.style.display = uploadedImageUrl ? 'none' : 'block';
      
      switchTab('postsTab');
      showMessage('postMessage', '正在编辑文章：' + post.title, 'success');
      window.scrollTo(0, 0);
    }

    async function publishPost() {
      const title = document.getElementById('postTitle').value;
      const content = document.getElementById('postContent').value;
      
      if (!title || !content) {
        showMessage('postMessage', '标题和内容不能为空', 'error');
        return;
      }

      const method = editingPostId ? "PUT" : "POST";
      const url = editingPostId ? \`/api/posts/\${editingPostId}\` : "/api/posts";

      try {
        const res = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, content, imageUrl: uploadedImageUrl })
        });
        const data = await res.json();
        if (data.success) {
          showMessage('postMessage', editingPostId ? '更新成功！' : '发布成功！', 'success');
          setTimeout(() => location.reload(), 1000);
        } else {
          showMessage('postMessage', editingPostId ? '更新失败' : '发布失败', 'error');
        }
      } catch (e) {
        showMessage('postMessage', '请求失败: ' + e.message, 'error');
      }
    }

    async function deletePost(id) {
      if (!confirm('确定要删除这条动态吗？')) return;
      try {
        const res = await fetch('/api/posts/' + id, { method: 'DELETE' });
        if ((await res.json()).success) {
          showMessage('postMessage', '删除成功', 'success');
          setTimeout(() => location.reload(), 1000);
        }
      } catch (e) {
        showMessage('postMessage', '删除失败', 'error');
      }
    }

    async function editGuestbook(id) {
      const gb = guestbookData.find(g => g.id === id);
      if (!gb) return;
      const newMessage = prompt('修改留言内容:', gb.message);
      if (newMessage === null || newMessage.trim() === gb.message.trim()) return;
      
      try {
        const res = await fetch('/api/guestbook/' + id, { 
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: newMessage })
        });
        if ((await res.json()).success) {
          showMessage('gbMessage', '修改成功', 'success');
          setTimeout(() => location.reload(), 1000);
        } else {
          showMessage('gbMessage', '修改失败', 'error');
        }
      } catch (e) {
        showMessage('gbMessage', '网络错误', 'error');
      }
    }

    async function deleteGuestbook(id) {
      if (!confirm('确定要删除这条留言吗？')) return;
      try {
        const res = await fetch('/api/guestbook/' + id, { method: 'DELETE' });
        if ((await res.json()).success) {
          showMessage('gbMessage', '删除成功', 'success');
          setTimeout(() => location.reload(), 1000);
        }
      } catch (e) {
        showMessage('gbMessage', '删除失败', 'error');
      }
    }


    async function uploadAboutImage(e) {
      const file = e.target.files[0];
      if (!file) return;
      const formData = new FormData();
      formData.append('image', file);
      try {
        showMessage('settingsMessage', '图片上传中...', 'success');
        const res = await fetch('/api/upload', { method: 'POST', body: formData });
        const data = await res.json();
        if (data.success) {
          document.getElementById('aboutImageInput').value = data.url;
          document.getElementById('aboutImagePreview').src = data.url;
          document.getElementById('aboutImagePreview').style.display = 'block';
          showMessage('settingsMessage', '配图上传成功，请点击保存设置', 'success');
        } else {
          throw new Error(data.error);
        }
      } catch (err) {
        showMessage('settingsMessage', '配图上传失败: ' + err.message, 'error');
      }
    }
    function clearAboutImage() {
      document.getElementById('aboutImageInput').value = '';
      document.getElementById('aboutImagePreview').src = '';
      document.getElementById('aboutImagePreview').style.display = 'none';
      showMessage('settingsMessage', '已清除配图，请点击保存设置', 'success');
    }

    async function saveSettings() {
      const settings = {
        site_title: document.getElementById('siteTitleInput').value,
        site_subtitle: document.getElementById('siteSubtitleInput').value,
        window_title: document.getElementById('windowTitleInput').value,
        about_title: document.getElementById('aboutTitleInput').value,
        about_content: document.getElementById('aboutContentInput').value,
        about_image_url: document.getElementById('aboutImageInput').value,
        music_player_code: document.getElementById('musicPlayerCodeInput').value
      };
      const pwd = document.getElementById('adminPasswordInput').value;
      if (pwd) {
        settings.admin_password = pwd;
      }
      try {
        const res = await fetch('/api/settings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(settings)
        });
        if ((await res.json()).success) {
          showMessage('settingsMessage', '设置保存成功', 'success');
        }
      } catch (e) {
        showMessage('settingsMessage', '保存失败', 'error');
      }
    }


    async function loadImages() {
      const container = document.getElementById('imagesList');
      container.innerHTML = '<p>加载中...</p>';
      try {
        const res = await fetch('/api/images');
        let images = await res.json();
        images = images.filter(img => !recentlyDeletedImages.has(img.name));
        if (images.length === 0) {
          container.innerHTML = '<p>图床为空</p>';
          return;
        }
        container.innerHTML = images.map(img => \`
          <div style="border: 1px solid #000; padding: 5px; width: 150px; background: #fff; text-align: center;">
            <div style="height: 100px; display: flex; align-items: center; justify-content: center; background: #eee; margin-bottom: 5px; overflow: hidden;">
              <img src="\${img.url}" style="max-width: 100%; max-height: 100%; object-fit: contain;">
            </div>
            <div style="font-size: 11px; word-break: break-all; margin-bottom: 5px; height: 30px; overflow: hidden;">\${escapeHtml(img.name)}</div>
            <div style="margin-bottom: 5px; font-weight: bold; color: \${img.used ? '#00aa00' : '#aa0000'};">
              \${img.used ? '✅ 已使用' : '⚠️ 未使用'}
            </div>
            <button class="btn btn-small" style="width: 100%" onclick="deleteImage('\${img.name}')">删除</button>
          </div>
        \`).join('');
      } catch (err) {
        showMessage('imagesMessage', '加载图床失败: ' + err.message, 'error');
        container.innerHTML = '<p>加载失败</p>';
      }
    }

    async function deleteImage(name) {
      if (!confirm('确定要删除图片 ' + name + ' 吗？删除后将无法恢复！')) return;
      try {
        const res = await fetch('/api/images/' + name, { method: 'DELETE' });
        if ((await res.json()).success) {
          recentlyDeletedImages.add(name);
          showMessage('imagesMessage', '删除成功！', 'success');
          loadImages();
        } else {
          showMessage('imagesMessage', '删除失败！', 'error');
        }
      } catch (err) {
        showMessage('imagesMessage', '请求失败', 'error');
      }
    }

    async function cleanUnusedImages() {
      try {
        showMessage('imagesMessage', '正在扫描未使用的图片...', 'success');
        const res = await fetch('/api/images');
        const images = await res.json();
        const unused = images.filter(img => !img.used);
        
        if (unused.length === 0) {
          showMessage('imagesMessage', '没有发现未使用的图片！', 'success');
          return;
        }
        
        if (!confirm(\`发现 \${unused.length} 张未使用的图片，确定要一键清理吗？清理后将无法恢复！\`)) return;
        
        showMessage('imagesMessage', \`正在清理 \${unused.length} 张图片，请稍候...\`, 'success');
        let successCount = 0;
        for (const img of unused) {
          try {
            const dRes = await fetch('/api/images/' + img.name, { method: 'DELETE' });
            if ((await dRes.json()).success) {
              successCount++;
              recentlyDeletedImages.add(img.name);
            }
          } catch (e) {
            console.error('Failed to delete', img.name);
          }
        }
        showMessage('imagesMessage', \`清理完成！成功删除了 \${successCount} 张图片。\`, 'success');
        loadImages();
      } catch (err) {
        showMessage('imagesMessage', '清理过程发生错误: ' + err.message, 'error');
      }
    }
  </script>
</body>
</html>`;

  return new Response(html, {
    headers: { 'Content-Type': 'text/html;charset=UTF-8', 'Cache-Control': 'no-cache, no-store, must-revalidate' },
  });
}



