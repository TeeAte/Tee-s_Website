const fs = require('fs');
const file = 'worker.js';
let content = fs.readFileSync(file, 'utf8');

const regex = /async function serveAdminPanel\(request, env\) \{([\s\S]*?)\n\}\n\n/g;
let match = regex.exec(content);

if (!match) {
  console.log("Could not find serveAdminPanel");
  process.exit(1);
}

const serveAdminPanelContent = `async function serveAdminPanel(request, env) {
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

  // 获取数据统计
  const postsResult = await env.DB.prepare('SELECT id, title, created_at FROM posts ORDER BY created_at DESC').all();
  const posts = postsResult.results || [];
  
  const visitsResult = await env.DB.prepare('SELECT * FROM visits ORDER BY visit_time DESC LIMIT 100').all();
  const visits = visitsResult.results || [];

  const logsResult = await env.DB.prepare('SELECT * FROM logs ORDER BY timestamp DESC LIMIT 50').all();
  const logs = logsResult.results || [];

  const gbResult = await env.DB.prepare('SELECT * FROM guestbook ORDER BY created_at DESC').all();
  const guestbook = gbResult.results || [];

  // 聚合统计
  const totalVisits = await env.DB.prepare('SELECT COUNT(*) as count FROM visits').first('count');
  const uniqueIPs = await env.DB.prepare('SELECT COUNT(DISTINCT ip) as count FROM visits').first('count');
  
  const topPagesResult = await env.DB.prepare('SELECT path, COUNT(*) as count FROM visits GROUP BY path ORDER BY count DESC LIMIT 5').all();
  const topPages = topPagesResult.results || [];

  const html = \`<!DOCTYPE html>
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
    .close-box::after { content: ""; position: absolute; top: 3px; left: 3px; right: 3px; bottom: 3px; border: 1px solid #000000; }
    .close-box:active { background: #000; }
    .topbar h1 { font-size: 15px; font-weight: 700; letter-spacing: 0; display: flex; align-items: center; gap: 6px; background: #FFFFFF; padding: 2px 16px; border: 1px solid #000000; position: absolute; left: 50%; transform: translateX(-50%); z-index: 1; }
    .shade-box { width: 16px; height: 16px; background: #BBBBBB; border: 1px solid #000000; flex-shrink: 0; position: relative; margin-left: auto; }
    .shade-box::after { content: ""; position: absolute; top: 7px; left: 3px; right: 3px; border-bottom: 1px solid #000000; }
    .zoom-box { width: 16px; height: 16px; background: #BBBBBB; border: 1px solid #000000; flex-shrink: 0; position: relative; margin-left: 4px; }
    .zoom-box::after { content: ""; position: absolute; top: 3px; left: 3px; right: 3px; bottom: 3px; border: 1px solid #000000; }

    .main-area { display: flex; flex: 1; overflow: hidden; }

    /* Sidebar / Tabs */
    .sidebar { width: 200px; background: #BBBBBB; border-right: 1px solid #000000; display: flex; flex-direction: column; border-top: 1px solid #FFFFFF; flex-shrink: 0; }
    .panel-tab { padding: 12px 16px; font-size: 14px; font-weight: 700; color: #333333; cursor: pointer; border-bottom: 1px solid #000000; border-top: 1px solid #FFFFFF; }
    .panel-tab.active { background: #000000; color: #FFFFFF; }
    .panel-tab:hover:not(.active) { background: #AAAAAA; }

    /* Content Area */
    .content-area { flex: 1; background: #FFFFFF; overflow-y: auto; padding: 20px; box-shadow: inset 1px 1px 0 #000000, inset -1px -1px 0 #FFFFFF; position: relative; }
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
    .visit-table { width: 100%; border-collapse: collapse; border: 1px solid #000000; font-size: 13px; }
    .visit-table th, .visit-table td { padding: 6px 8px; border: 1px solid #000000; text-align: left; }
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
    <span class="apple">🍎</span>
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
          <div class="section-title">最近访问记录</div>
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
            <label>前台“关于”页面内容 (支持 HTML)</label>
            <textarea id="aboutContentInput" placeholder="输入关于你的介绍..."></textarea>
          </div>
          <button class="btn" onclick="saveSettings()">保存设置</button>
        </div>

      </section>
    </div>
  </div>

  <script>
    // 注入初始数据
    const stats = {
      totalVisits: \${totalVisits},
      uniqueIPs: \${uniqueIPs},
      totalPosts: \${posts.length},
      topPages: \${JSON.stringify(topPages)}
    };
    const postsData = \${JSON.stringify(posts)};
    const visitsData = \${JSON.stringify(visits)};
    const logsData = \${JSON.stringify(logs)};
    const guestbookData = \${JSON.stringify(guestbook)};
    const currentSettings = {
      site_title: \`\${siteTitle.replace(/\`/g, "\\\`")}\`,
      site_subtitle: \`\${siteSubtitle.replace(/\`/g, "\\\`")}\`,
      window_title: \`\${windowTitle.replace(/\`/g, "\\\`")}\`,
      about_content: \`\${aboutContent.replace(/\`/g, "\\\`")}\`
    };

    let uploadedImageUrl = '';

    window.onload = () => {
      if (document.cookie.includes('admin_token=secret-admin-token')) {
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

    function switchTab(tabId) {
      document.querySelectorAll('.panel-tab').forEach(el => el.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
      event.target.classList.add('active');
      document.getElementById(tabId).classList.add('active');
    }

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
          <button class="btn btn-small" onclick="deletePost(\${post.id})">删除</button>
        </div>
      \`).join('');

      // Visits
      const visitBody = document.getElementById('visitTableBody');
      visitBody.innerHTML = visitsData.map(v => \`
        <tr>
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
          <td><button class="btn btn-small" onclick="deleteGuestbook(\${g.id})">删除</button></td>
        </tr>
      \`).join('');

      // Logs
      const logBody = document.getElementById('logTableBody');
      logBody.innerHTML = logsData.map(l => \`
        <tr>
          <td>\${new Date(l.timestamp).toLocaleString('zh-CN')}</td>
          <td>\${escapeHtml(l.level)}</td>
          <td title="\${escapeHtml(l.message)}">\${escapeHtml(l.message).substring(0,50)}...</td>
        </tr>
      \`).join('');

      // Settings
      document.getElementById('siteTitleInput').value = currentSettings.site_title;
      document.getElementById('siteSubtitleInput').value = currentSettings.site_subtitle;
      document.getElementById('windowTitleInput').value = currentSettings.window_title;
      document.getElementById('aboutContentInput').value = currentSettings.about_content;
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
        // 请求上传 URL
        const uploadUrlRes = await fetch('/api/upload_url');
        const uploadData = await uploadUrlRes.json();
        
        if (!uploadData.success) throw new Error(uploadData.message);
        progressFill.style.width = '60%';

        // 直接上传到 Cloudflare Images
        const formData = new FormData();
        formData.append('file', file);
        
        const cfRes = await fetch(uploadData.uploadURL, {
          method: 'POST',
          body: formData
        });
        
        const cfData = await cfRes.json();
        if (cfData.success) {
          uploadedImageUrl = cfData.result.variants[0]; // 获取图片外链
          previewImg.src = uploadedImageUrl;
          previewImg.style.display = 'inline-block';
          progressFill.style.width = '100%';
          showMessage('postMessage', '图片上传成功！', 'success');
        } else {
          throw new Error('Cloudflare 图片上传失败');
        }
      } catch (err) {
        showMessage('postMessage', '图片上传出错: ' + err.message, 'error');
        promptDiv.style.display = 'block';
      } finally {
        setTimeout(() => { progressBar.style.display = 'none'; }, 1000);
      }
    }

    async function publishPost() {
      const title = document.getElementById('postTitle').value;
      const content = document.getElementById('postContent').value;
      
      if (!title || !content) {
        showMessage('postMessage', '标题和内容不能为空', 'error');
        return;
      }

      try {
        const res = await fetch('/api/posts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, content, image_url: uploadedImageUrl })
        });
        const data = await res.json();
        if (data.success) {
          showMessage('postMessage', '发布成功！', 'success');
          setTimeout(() => location.reload(), 1000);
        } else {
          showMessage('postMessage', '发布失败', 'error');
        }
      } catch (e) {
        showMessage('postMessage', '发布请求失败', 'error');
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

    async function saveSettings() {
      const settings = {
        site_title: document.getElementById('siteTitleInput').value,
        site_subtitle: document.getElementById('siteSubtitleInput').value,
        window_title: document.getElementById('windowTitleInput').value,
        about_content: document.getElementById('aboutContentInput').value
      };
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
  </script>
</body>
</html>\`;

  return new Response(html, {
    headers: { 'Content-Type': 'text/html;charset=UTF-8', 'Cache-Control': 'no-cache, no-store, must-revalidate' },
  });
}
`;

content = content.replace(regex, serveAdminPanelContent + '\n\n');
fs.writeFileSync(file, content);
console.log("Successfully rewrote serveAdminPanel.");
