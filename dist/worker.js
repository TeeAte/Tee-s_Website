// utils.js
function escapeHtml(text) {
  if (!text) return "";
  return String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
function getCookie(request, name) {
  const cookieString = request.headers.get("Cookie");
  if (!cookieString) return null;
  const cookies = cookieString.split(";");
  for (let cookie of cookies) {
    const [key, value] = cookie.trim().split("=");
    if (key === name) {
      return value;
    }
  }
  return null;
}
function isAuthenticated(request) {
  const token = getCookie(request, "admin_token");
  return token === "secret-admin-token";
}

// frontend.js
async function serveHomepage(request, env) {
  const url = new URL(request.url);
  const section = url.searchParams.get("section") || "home";
  const postsResult = await env.DB.prepare("SELECT * FROM posts ORDER BY created_at DESC").all();
  const posts = postsResult.results || [];
  const guestbookResult = await env.DB.prepare("SELECT * FROM guestbook ORDER BY created_at DESC").all();
  const guestbook = guestbookResult.results || [];
  const settingsResult = await env.DB.prepare("SELECT key, value FROM settings").all();
  const settingsMap = {};
  if (settingsResult.results) {
    settingsResult.results.forEach((r) => settingsMap[r.key] = r.value);
  }
  let musicPlayerCode = settingsMap["music_player_code"] || '<iframe class="music-box" src="https://i.y.qq.com/n2/m/outchain/player/index.html?songid=526191277&songtype=0" height="65" frameBorder="0" allowfullscreen="" loading="lazy"></iframe>';
  let aboutTitle = settingsMap["about_title"] || "\u5173\u4E8E\u6211 (About)";
  let aboutContent = settingsMap["about_content"] || `<p>\u6B22\u8FCE\u6765\u5230\u6211\u7684\u4E2A\u4EBA\u7F51\u7AD9\uFF01\u8FD9\u91CC\u662F\u5C5E\u4E8E\u6211\u7684\u4E00\u65B9\u5C0F\u5929\u5730\u3002</p>
<p>\u5728\u8FD9\u91CC\u6211\u4F1A\u5206\u4EAB\u6211\u7684\u751F\u6D3B\u70B9\u6EF4\u3001\u4F5C\u54C1\u548C\u60F3\u6CD5\u3002</p>
<p>\u5982\u679C\u4F60\u6709\u4EC0\u4E48\u60F3\u5BF9\u6211\u8BF4\u7684\uFF0C\u6B22\u8FCE\u968F\u65F6\u8054\u7CFB\u6211~</p>`;
  let siteTitle = settingsMap["site_title"] || "TeeAte's Website";
  let siteSubtitle = settingsMap["site_subtitle"] || "\u5F88Niubi \u7684 Website";
  let windowTitle = settingsMap["window_title"] || siteTitle;
  let aboutImageUrl = settingsMap["about_image_url"] || "";
  const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(windowTitle)}</title>
  <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='20' fill='%23111111'/><text x='50' y='50' dy='.35em' font-family='Courier New' font-weight='900' font-size='70' text-anchor='middle' fill='%23E0E0E0'>T</text></svg>">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body { height: 100%; overflow: hidden; }
    
    /* Default is Light Mode */
    :root {
      --bg: #FFFFFF; --bg2: #BBBBBB; --bg3: #FFFFFF; --bg4: #999999;
      --border: #000000; --border2: #888888;
      --text: #000000; --text2: #0000FF; --text3: #666666;
      --topbar-grad: repeating-linear-gradient(to bottom, #000000 0px, #000000 1px, #FFFFFF 1px, #FFFFFF 2px);
      --btn-bg: #BBBBBB;
      --btn-hi: #FFFFFF;
      --btn-hi2: #DDDDDD;
      --btn-lo: #888888;
      --btn-lo2: #000000;
    }
    
    body.dark-mode {
      --bg: #1A1A1A; --bg2: #2C2C2C; --bg3: #111111; --bg4: #000000;
      --border: #000000; --border2: #444444;
      --text: #E0E0E0; --text2: #00ffd5; --text3: #AAAAAA;
      --topbar-grad: repeating-linear-gradient(to bottom, #111 0px, #111 1px, #333 1px, #333 2px);
      --btn-bg: #444444;
      --btn-hi: #666666;
      --btn-hi2: #555555;
      --btn-lo: #222222;
      --btn-lo2: #000000;
    }

    body {
      font-family: "Chicago", "Geneva", "Monaco", "Courier New", monospace;
      background: var(--bg);
      color: var(--text);
      height: 100vh;
      overflow: hidden;
      font-size: 15px;
      transition: background 0.3s, color 0.3s;
    }

    /* Mac Menu Bar */
    .menu-bar { height: 28px; background: var(--bg3); border-bottom: 2px solid #000000; display: flex; align-items: center; padding: 0 12px; font-size: 14px; font-weight: 700; gap: 20px; transition: background 0.3s; }
    .menu-bar .apple { font-size: 18px; margin-right: 8px; color: var(--text); }
    .menu-item { padding: 2px 8px; cursor: pointer; color: var(--text); text-decoration: none; }
    .menu-item:hover { background: var(--text); color: var(--bg3); }
    .menu-item.active { background: var(--border2); color: var(--bg); }
    .menu-right { margin-left: auto; display: flex; gap: 15px; align-items: center; }

    .app { display: flex; flex-direction: column; height: calc(100vh - 28px); border: 1px solid #000000; margin: 10px; background: var(--bg2); box-shadow: 2px 2px 0px rgba(0,0,0,0.8); transition: background 0.3s; }
    @media(max-width:800px) { .app { margin: 0; height: calc(100vh - 28px); border-radius: 0; box-shadow: none; } }

    /* Title Bar */
    .topbar { display: flex; align-items: center; padding: 0 8px; height: 36px; background: var(--topbar-grad); border-bottom: 1px solid #000000; position: relative; flex-shrink: 0; }
    .close-box { width: 16px; height: 16px; background: var(--btn-bg); border: 1px solid #000000; flex-shrink: 0; position: relative; cursor: pointer; }
    .close-box::before, .close-box::after { content: ""; position: absolute; top: 3px; left: 7px; width: 1px; height: 9px; background: #000000; border: none; }
    .close-box::before { transform: rotate(45deg); }
    .close-box::after { transform: rotate(-45deg); }
    .close-box:active { background: var(--text); }
    .close-box:active::before, .close-box:active::after { background: var(--bg); }
    .topbar h1 { font-size: 15px; font-weight: 700; letter-spacing: 0; display: flex; align-items: center; gap: 6px; background: var(--bg3); color: var(--text); padding: 2px 16px; border: 1px solid #000000; position: absolute; left: 50%; transform: translateX(-50%); z-index: 1; white-space: nowrap; max-width: 60%; overflow: hidden; text-overflow: ellipsis; }
    .shade-box { width: 16px; height: 16px; background: var(--btn-bg); border: 1px solid #000000; flex-shrink: 0; position: relative; margin-left: auto; }
    .shade-box::after { content: ""; position: absolute; top: 7px; left: 3px; right: 3px; border-bottom: 1px solid #000000; }
    .zoom-box { width: 16px; height: 16px; background: var(--btn-bg); border: 1px solid #000000; flex-shrink: 0; position: relative; margin-left: 4px; }
    .zoom-box::after { content: ""; position: absolute; top: 3px; left: 3px; right: 3px; bottom: 3px; border: 1px solid #000000; }

    .main-area { display: flex; flex: 1; overflow: hidden; }
    
    /* Mobile Layout for main area */
    @media(max-width:800px) {
      .main-area { flex-direction: column; }
    }

    /* Sidebar / Tabs */
    .sidebar { width: 200px; background: var(--bg2); border-right: 1px solid #000000; display: flex; flex-direction: column; border-top: 1px solid var(--border2); flex-shrink: 0; transition: background 0.3s; }
    @media(max-width:800px) {
      .sidebar { width: 100%; flex-direction: row; flex-wrap: wrap; border-right: none; border-bottom: 1px solid #000000; }
    }
    .panel-tab { padding: 12px 16px; font-size: 14px; font-weight: 700; color: var(--text); text-decoration: none; display: block; background: var(--btn-bg); border: 1px solid var(--border); box-shadow: inset 1px 1px 0 var(--btn-hi), inset 2px 2px 0 var(--btn-hi2), inset -1px -1px 0 var(--btn-lo), inset -2px -2px 0 var(--btn-lo2); transition: none; margin-bottom: -1px; }
    .panel-tab:active { box-shadow: inset 1px 1px 0 var(--btn-lo), inset 2px 2px 0 var(--btn-lo2), inset -1px -1px 0 var(--btn-hi), inset -2px -2px 0 var(--btn-hi2); padding-top: 13px; padding-left: 17px; }
    @media(max-width:800px) {
      .panel-tab { padding: 8px 12px; flex: 1; text-align: center; margin-bottom: 0; margin-right: -1px; }
      .panel-tab:active { padding-top: 9px; padding-left: 13px; }
    }
    .panel-tab.active { background: var(--text); color: var(--bg); box-shadow: inset 2px 2px 0 var(--bg2); }
    body.dark-mode .panel-tab.active { background: var(--text); color: var(--bg); }
    .panel-tab:hover:not(.active) { background: var(--bg2); color: var(--text); }

    /* Buttons */
    .btn { height: 36px; padding: 0 20px; border: 1px solid #000000; box-shadow: inset 1px 1px 0 var(--btn-hi), inset 2px 2px 0 var(--btn-hi2), inset -1px -1px 0 var(--btn-lo), inset -2px -2px 0 var(--btn-lo2); background: var(--btn-bg); color: var(--text); font-size: 14px; font-weight: 700; cursor: pointer; white-space: nowrap; font-family: inherit; border-radius: 0; display: inline-flex; align-items: center; justify-content: center; text-decoration: none; }
    .btn:active { box-shadow: inset 1px 1px 0 var(--btn-lo), inset 2px 2px 0 var(--btn-lo2), inset -1px -1px 0 var(--btn-hi), inset -2px -2px 0 var(--btn-hi2); padding-top: 1px; padding-left: 1px; }

    /* Content Area */
    .content-area { flex: 1; background: var(--bg3); overflow-y: auto; padding: 20px; box-shadow: inset 1px 1px 0 #000000, inset -1px -1px 0 var(--border2); position: relative; transition: background 0.3s; }
    @media(max-width:800px) {
      .content-area { padding: 10px; }
    }
    
    /* Typography & Specifics */
    .site-header { margin-bottom: 20px; text-align: center; border-bottom: 2px solid var(--border2); padding-bottom: 20px; }
    .site-title { font-size: 2rem; font-weight: 900; color: var(--text); letter-spacing: 2px; }
    .site-subtitle { font-size: 1.2rem; color: var(--text3); margin-top: 5px; }

    .music-box { width: 100%; border-radius: 0; border: 1px solid #000; box-shadow: 2px 2px 0 #000; margin-bottom: 20px; }
    
    .post-card { background: var(--bg); border: 1px solid var(--border2); padding: 20px; margin-bottom: 20px; box-shadow: inset 1px 1px 0 var(--border2), inset -1px -1px 0 #000; }
    .post-title { font-size: 1.5rem; color: var(--text2); margin-bottom: 10px; font-weight: bold; }
    .post-date { font-size: 0.9rem; color: var(--text3); margin-bottom: 15px; }
    .post-content { line-height: 1.6; white-space: pre-wrap; font-family: "Courier New", monospace; }
    .post-image { max-width: 100%; max-height: 400px; object-fit: contain; border: 1px solid #000; border-radius: 8px; margin-top: 15px; display: block; }
    
    .gallery-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 15px; }
    .gallery-item { border: 1px solid var(--border2); background: var(--bg4); padding: 5px; cursor: pointer; transition: transform 0.2s; }
    .gallery-item:hover { transform: scale(1.02); border-color: var(--text2); }
    .gallery-item img { width: 100%; height: 200px; object-fit: cover; display: block; }

    .about-section { line-height: 1.8; color: var(--text); font-family: "Courier New", monospace; }
    .about-section h2 { color: var(--text2); margin-bottom: 20px; border-bottom: 1px dashed var(--border2); padding-bottom: 10px; }

    .sidebar-btn { width: 100%; text-align: left; padding: 8px 15px; border: 1px solid var(--border); background: var(--btn-bg); color: var(--text); font-weight: bold; font-family: inherit; cursor: pointer; box-shadow: inset 1px 1px 0 var(--btn-hi), inset 2px 2px 0 var(--btn-hi2), inset -1px -1px 0 var(--btn-lo), inset -2px -2px 0 var(--btn-lo2); display: flex; align-items: center; gap: 8px; font-size: 14px; transition: none; }
    .sidebar-btn:active { box-shadow: inset 1px 1px 0 var(--btn-lo), inset 2px 2px 0 var(--btn-lo2), inset -1px -1px 0 var(--btn-hi), inset -2px -2px 0 var(--btn-hi2); padding-top: 9px; padding-left: 1px; }
    .sidebar-btn.active { background: var(--text); color: var(--bg); box-shadow: inset 2px 2px 0 var(--bg2); }

    /* Guestbook */
    .guestbook-form { border: 2px solid var(--text); padding: 15px; margin-bottom: 20px; background: var(--bg2); }
    .gb-input, .gb-textarea { width: 100%; padding: 8px; border: 1px solid #000; background: var(--bg3); color: var(--text); font-family: inherit; margin-bottom: 10px; }
    .gb-btn { padding: 8px 15px; border: 1px solid var(--border); background: var(--btn-bg); color: var(--text); cursor: pointer; font-weight: bold; font-family: inherit; box-shadow: inset 1px 1px 0 var(--btn-hi), inset 2px 2px 0 var(--btn-hi2), inset -1px -1px 0 var(--btn-lo), inset -2px -2px 0 var(--btn-lo2); }
    .gb-btn:active { box-shadow: inset 1px 1px 0 var(--btn-lo), inset 2px 2px 0 var(--btn-lo2), inset -1px -1px 0 var(--btn-hi), inset -2px -2px 0 var(--btn-hi2); padding-top: 9px; padding-left: 1px; }
    .gb-entry { border: 1px solid var(--border2); padding: 15px; margin-bottom: 10px; background: var(--bg); }
    .gb-author { font-weight: bold; color: var(--text2); font-size: 1.1rem; }
    .gb-date { font-size: 0.8rem; color: var(--text3); float: right; }
    .gb-msg { margin-top: 10px; white-space: pre-wrap; font-family: "Courier New", monospace; word-break: break-all; }
    
    /* Scrollbar */
    ::-webkit-scrollbar { width: 16px; background: var(--bg2); border-left: 1px solid #000; }
    ::-webkit-scrollbar-thumb { background: var(--border2); border: 1px solid #000; }
  </style>
</head>
<body>
  <div class="menu-bar">
    <span class="apple">\uF8FF</span>
    <span class="menu-item" onclick="window.location.href='/'">File</span>
    <span class="menu-item" onclick="window.location.href='/admin'">Admin</span>
    <div class="menu-right">
      <span class="menu-item" id="themeToggle">\u{1F317} \u9ED1\u767D\u5207\u6362</span>
    </div>
  </div>

  <div class="app">
    <div class="topbar">
      <div class="close-box"></div>
      <h1>${escapeHtml(windowTitle)}</h1>
      <div class="shade-box"></div>
      <div class="zoom-box"></div>
    </div>
    <div class="main-area">
      <div class="sidebar">
        <a href="/" class="panel-tab ${section === "home" ? "active" : ""}">\u9996\u9875</a>
        <a href="/?section=posts" class="panel-tab ${section === "posts" ? "active" : ""}">\u52A8\u6001</a>
        <a href="/?section=gallery" class="panel-tab ${section === "gallery" ? "active" : ""}">\u76F8\u518C</a>
        <a href="/?section=guestbook" class="panel-tab ${section === "guestbook" ? "active" : ""}">\u7559\u8A00</a>
        <a href="/?section=about" class="panel-tab ${section === "about" ? "active" : ""}">\u5173\u4E8E</a>
      </div>
      
      <div class="content-area">
        ${section === "home" ? `
          <div class="site-header">
            <div class="site-title">${escapeHtml(siteTitle)}</div>
            <div class="site-subtitle">${escapeHtml(siteSubtitle)}</div>
          </div>
          ${musicPlayerCode}
          <div class="posts-section">
            ${posts.slice(0, 3).map((post) => `
              <div class="post-card">
                <div class="post-title">${escapeHtml(post.title)}</div>
                <div class="post-date">${new Date(post.created_at).toLocaleString("zh-CN")}</div>
                <div class="post-content">${escapeHtml(post.content).substring(0, 200)}${post.content.length > 200 ? "..." : ""}</div>
                ${post.image_url ? `<img src="${post.image_url}" class="post-image" alt="${escapeHtml(post.title)}">` : ""}
              </div>
            `).join("")}
            ${posts.length > 3 ? `
            <div style="text-align: center; margin-top: 15px; margin-bottom: 20px;">
              <a href="/?section=posts" class="btn" style="text-decoration: none; padding: 6px 15px;">\u67E5\u770B\u66F4\u591A...</a>
            </div>
            ` : ""}
          </div>
        ` : ""}

        ${section === "posts" ? `
          <div class="posts-section">
            ${posts.map((post) => `
              <div class="post-card">
                <div class="post-title">${escapeHtml(post.title)}</div>
                <div class="post-date">${new Date(post.created_at).toLocaleString("zh-CN")}</div>
                <div class="post-content">${escapeHtml(post.content)}</div>
                ${post.image_url ? `<img src="${post.image_url}" class="post-image" alt="${escapeHtml(post.title)}">` : ""}
              </div>
            `).join("")}
          </div>
        ` : ""}

        ${section === "gallery" ? `
          <div class="gallery-grid">
            ${posts.filter((p) => p.image_url).map((post) => `
              <div class="gallery-item" onclick="window.open('${post.image_url}', '_blank')">
                <img src="${post.image_url}" alt="${escapeHtml(post.title)}">
              </div>
            `).join("")}
          </div>
        ` : ""}

        ${section === "guestbook" ? `
          <div class="guestbook-form">
            <h3 style="margin-bottom:10px">\u7559\u4E2A\u8A00\u5427 (Leave a message)</h3>
            <input type="text" id="gbAuthor" class="gb-input" placeholder="\u4F60\u7684\u6635\u79F0 (Your name)" maxlength="30">
            <textarea id="gbMessage" class="gb-textarea" placeholder="\u60F3\u8BF4\u70B9\u4EC0\u4E48\uFF1F (What's on your mind?)" rows="3" maxlength="300"></textarea>
            <button class="gb-btn" onclick="submitGuestbook()">\u63D0\u4EA4\u7559\u8A00 (Submit)</button>
          </div>
          <div class="guestbook-list">
            ${guestbook.map((gb) => `
              <div class="gb-entry">
                <span class="gb-author">${escapeHtml(gb.author)}</span>
                <span class="gb-date">${new Date(gb.created_at).toLocaleString("zh-CN")}</span>
                <div class="gb-msg">${escapeHtml(gb.message)}</div>
              </div>
            `).join("")}
            ${guestbook.length === 0 ? "<p>\u6682\u65E0\u7559\u8A00\u3002(No messages yet)</p>" : ""}
          </div>
        ` : ""}

        ${section === "about" ? `
          <div class="about-section">
            <h2>${escapeHtml(aboutTitle)}</h2>
            ${aboutImageUrl ? `<div style="text-align: center; margin-bottom: 20px;"><img src="${escapeHtml(aboutImageUrl)}" style="max-width: 100%; border: 1px solid #000; box-shadow: 2px 2px 0 #000;" alt="About Image"></div>` : ""}
            <div style="font-size: 16px; line-height: 1.6; white-space: pre-wrap;">${aboutContent}</div>
          </div>
        ` : ""}
      </div>
    </div>
  </div>

  <script>
    // Theme toggle
    const themeToggle = document.getElementById('themeToggle');
    const savedTheme = localStorage.getItem('macTheme');
    // Default is light, only add dark-mode if saved as dark
    if (savedTheme === 'dark') {
      document.body.classList.add('dark-mode');
    }
    themeToggle.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
      if (document.body.classList.contains('dark-mode')) {
        localStorage.setItem('macTheme', 'dark');
      } else {
        localStorage.setItem('macTheme', 'light');
      }
    });


    async function submitGuestbook() {
      const author = document.getElementById('gbAuthor').value.trim();
      const message = document.getElementById('gbMessage').value.trim();
      if (!author || !message) {
        alert('\u6635\u79F0\u548C\u7559\u8A00\u4E0D\u80FD\u4E3A\u7A7A\uFF01');
        return;
      }
      try {
        const res = await fetch('/api/guestbook', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ author, message })
        });
        if (res.ok) {
          window.location.reload();
        } else {
          alert('\u63D0\u4EA4\u5931\u8D25');
        }
      } catch (err) {
        console.error(err);
        alert('\u63D0\u4EA4\u5931\u8D25');
      }
    }
  <\/script>

</body>
</html>`;
  return new Response(html, {
    headers: { "Content-Type": "text/html;charset=UTF-8", "Cache-Control": "no-cache, no-store, must-revalidate" }
  });
}

// admin.js
async function serveAdminPanel(request, env) {
  const isAuth = isAuthenticated(request);
  const url = new URL(request.url);
  const settingsResult = await env.DB.prepare("SELECT key, value FROM settings").all();
  const settingsMap = {};
  if (settingsResult.results) {
    settingsResult.results.forEach((r) => settingsMap[r.key] = r.value);
  }
  let siteTitle = settingsMap["site_title"] || "TeeAte's Website";
  let siteSubtitle = settingsMap["site_subtitle"] || "\u5F88Niubi \u7684 Website";
  let windowTitle = settingsMap["window_title"] || siteTitle;
  let aboutContent = settingsMap["about_content"] || "";
  let aboutTitle = settingsMap["about_title"] || "\u5173\u4E8E\u6211 (About)";
  let aboutImageUrl = settingsMap["about_image_url"] || "";
  let musicPlayerCode = settingsMap["music_player_code"] || "";
  const postsResult = await env.DB.prepare("SELECT * FROM posts ORDER BY created_at DESC").all();
  const posts = postsResult.results || [];
  const visitsResult = await env.DB.prepare("SELECT * FROM visits ORDER BY visit_time DESC LIMIT 100").all();
  const visits = visitsResult.results || [];
  const logsResult = await env.DB.prepare("SELECT * FROM logs ORDER BY created_at DESC LIMIT 50").all();
  const logs = logsResult.results || [];
  const gbResult = await env.DB.prepare("SELECT * FROM guestbook ORDER BY created_at DESC").all();
  const guestbook = gbResult.results || [];
  const totalVisits = await env.DB.prepare("SELECT COUNT(*) as count FROM visits").first("count");
  const uniqueIPs = await env.DB.prepare("SELECT COUNT(DISTINCT ip) as count FROM visits").first("count");
  const topPagesResult = await env.DB.prepare("SELECT path, COUNT(*) as count FROM visits GROUP BY path ORDER BY count DESC LIMIT 5").all();
  const topPages = topPagesResult.results || [];
  const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>\u63A7\u5236\u9762\u677F</title>
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
        <h2>\u767B\u5F55\u63A7\u5236\u9762\u677F</h2>
        <div id="loginMessage" class="message error"></div>
        <div class="form-group">
          <input type="password" id="passwordInput" placeholder="\u8F93\u5165\u7BA1\u7406\u5458\u5BC6\u7801..." onkeypress="if(event.key === 'Enter') login()">
        </div>
        <button class="btn" onclick="login()">\u767B\u5F55</button>
      </div>
    </div>
  </div>

  <div class="menu-bar" style="display: none;" id="menuBar">
    <span class="apple">\uF8FF</span>
    <span class="menu-item" onclick="window.open('/', '_blank')">\u8FDB\u5165\u7AD9\u70B9</span>
    <span class="menu-item">\u6587\u4EF6</span>
    <span class="menu-item">\u7F16\u8F91</span>
    <span class="menu-item">\u89C6\u56FE</span>
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
        <div class="panel-tab active" onclick="switchTab('postsTab')">\u6587\u7AE0\u7BA1\u7406</div>
        <div class="panel-tab" onclick="switchTab('statsTab')">\u6D41\u91CF\u7EDF\u8BA1</div>
        <div class="panel-tab" onclick="switchTab('visitsTab')">\u8BBF\u95EE\u8BB0\u5F55</div>
        <div class="panel-tab" onclick="switchTab('guestbookTab')">\u7559\u8A00\u7BA1\u7406</div>
        <div class="panel-tab" onclick="switchTab('logsTab')">\u7CFB\u7EDF\u65E5\u5FD7</div>
        <div class="panel-tab" onclick="switchTab('settingsTab')">\u7CFB\u7EDF\u8BBE\u7F6E</div>
        <div class="panel-tab" onclick="switchTab('imagesTab')">\u56FE\u5E8A\u7BA1\u7406</div>
      </aside>
      
      <section class="content-area">
        <div id="postsTab" class="tab-content active">
          <div id="postMessage" class="message"></div>
          
          <div class="section-title" style="display:flex; justify-content:space-between; align-items:center;">
            \u5199\u65B0\u52A8\u6001
            <button class="btn btn-small" onclick="publishPost()">\u53D1\u5E03</button>
          </div>
          <div class="form-group">
            <input type="text" id="postTitle" placeholder="\u6807\u9898...">
          </div>
          <div class="form-group">
            <textarea id="postContent" placeholder="\u5199\u70B9\u4EC0\u4E48\u5427..."></textarea>
          </div>
          
          <div class="form-group">
            <label>\u914D\u56FE (\u70B9\u51FB\u4E0A\u4F20)</label>
            <div class="upload-area" onclick="document.getElementById('imageInput').click()">
              <div id="uploadPrompt">\u9009\u62E9\u56FE\u7247\u6216\u62D6\u62FD\u5230\u6B64\u5904</div>
              <img id="imagePreview" class="preview-image" style="display:none;">
            </div>
            <input type="file" id="imageInput" style="display:none" accept="image/*" onchange="handleImageSelect(event)">
            <div class="progress-bar" id="uploadProgress" style="display:none">
              <div class="progress-fill" id="uploadFill" style="width: 0%"></div>
            </div>
          </div>

          <div class="section-title" style="margin-top:30px;">\u5386\u53F2\u52A8\u6001</div>
          <div id="postList"></div>
        </div>

        <div id="statsTab" class="tab-content">
          <div class="section-title">\u6838\u5FC3\u6570\u636E</div>
          <div class="stats-grid">
            <div class="stat-card">
              <div class="number" id="statTotalVisits">0</div>
              <div class="label">\u603B\u8BBF\u95EE\u91CF</div>
            </div>
            <div class="stat-card">
              <div class="number" id="statUniqueIPs">0</div>
              <div class="label">\u72EC\u7ACB\u8BBF\u5BA2 (IP)</div>
            </div>
            <div class="stat-card">
              <div class="number" id="statTotalPosts">0</div>
              <div class="label">\u5DF2\u53D1\u5E03\u52A8\u6001</div>
            </div>
          </div>
          
          <div class="section-title">\u6700\u53D7\u6B22\u8FCE\u9875\u9762 (Top 5)</div>
          <div id="topPagesList" style="background:#EEEEEE; border:1px solid #000; padding:10px;"></div>
        </div>

        <div id="visitsTab" class="tab-content">
          <div class="section-title">\u6700\u8FD1\u8BBF\u95EE\u8BB0\u5F55 <button id="refreshVisitsBtn" class="btn btn-small" onclick="refreshVisits()" style="float: right; margin-top: -5px;">\u5237\u65B0</button></div>
          <table class="visit-table">
            <thead>
              <tr><th>\u65F6\u95F4</th><th>\u8DEF\u5F84</th><th>IP</th><th>\u8BBE\u5907</th></tr>
            </thead>
            <tbody id="visitTableBody"></tbody>
          </table>
        </div>

        <div id="guestbookTab" class="tab-content">
          <div id="gbMessage" class="message"></div>
          <div class="section-title">\u7559\u8A00\u7BA1\u7406</div>
          <table class="visit-table">
            <thead>
              <tr><th>\u65F6\u95F4</th><th>\u6635\u79F0</th><th>\u5185\u5BB9</th><th>\u64CD\u4F5C</th></tr>
            </thead>
            <tbody id="guestbookTableBody"></tbody>
          </table>
        </div>

        <div id="logsTab" class="tab-content">
          <div class="section-title">\u7CFB\u7EDF\u65E5\u5FD7 (\u6700\u8FD150\u6761)</div>
          <table class="visit-table">
            <thead>
              <tr><th>\u65F6\u95F4</th><th>\u7EA7\u522B</th><th>\u4FE1\u606F</th></tr>
            </thead>
            <tbody id="logTableBody"></tbody>
          </table>
        </div>

        <div id="settingsTab" class="tab-content">
          <div id="settingsMessage" class="message"></div>
          <div class="section-title">\u7F51\u7AD9\u4FE1\u606F\u8BBE\u7F6E</div>
          <div class="form-group">
            <label>\u7F51\u9875\u6807\u9898\u680F (Mac \u4F2A\u6807\u9898\u680F)</label>
            <input type="text" id="windowTitleInput" placeholder="\u663E\u793A\u5728\u6D4F\u89C8\u5668\u6807\u7B7E\u9875\u548C Mac \u6807\u9898\u680F\u4E0A\u7684\u6587\u5B57">
          </div>
          <div class="form-group">
            <label>\u9996\u9875\u5927\u6807\u9898 (\u6253\u5B57\u6548\u679C)</label>
            <input type="text" id="siteTitleInput" placeholder="TeeAte's Website">
          </div>
          <div class="form-group">
            <label>\u9996\u9875\u526F\u6807\u9898</label>
            <input type="text" id="siteSubtitleInput" placeholder="\u5F88Niubi \u7684 Website">
          </div>

          <div class="form-group">
            <label>\u524D\u53F0\u201C\u5173\u4E8E\u201D\u9875\u9762\u6807\u9898</label>
            <input type="text" id="aboutTitleInput" placeholder="\u5173\u4E8E\u6211 (About)">
          </div>
          <div class="form-group">
            <label>\u524D\u53F0\u201C\u5173\u4E8E\u201D\u9875\u9762\u5185\u5BB9 (\u652F\u6301 HTML)</label>
            <textarea id="aboutContentInput" placeholder="\u8F93\u5165\u5173\u4E8E\u4F60\u7684\u4ECB\u7ECD..."></textarea>
          </div>

          <div class="form-group">
            <label>\u524D\u53F0\u201C\u5173\u4E8E\u201D\u9875\u9762\u914D\u56FE</label>
            <div style="display: flex; gap: 10px; align-items: flex-start;">
              <div style="flex: 1;">
                <input type="text" id="aboutImageInput" placeholder="\u56FE\u7247\u94FE\u63A5 (\u4E5F\u53EF\u76F4\u63A5\u4E0A\u4F20)">
                <input type="file" id="aboutImageUpload" accept="image/*,image/gif" style="display:none" onchange="uploadAboutImage(event)">
                <div style="margin-top: 10px; display: flex; gap: 10px;">
                  <button class="btn btn-small" onclick="document.getElementById('aboutImageUpload').click()">\u4E0A\u4F20\u65B0\u56FE\u7247</button>
                  <button class="btn btn-small" onclick="clearAboutImage()">\u6E05\u9664\u56FE\u7247</button>
                </div>
              </div>
              <img id="aboutImagePreview" src="" style="display:none; max-width: 150px; max-height: 100px; border: 1px solid #000;">
            </div>
          </div>
          <div class="form-group">
            <label>\u5D4C\u5165\u5F0F\u97F3\u4E50\u64AD\u653E\u5668\u4EE3\u7801 (\u652F\u6301 iframe/HTML)</label>
            <textarea id="musicPlayerCodeInput" placeholder="\u8F93\u5165\u4F60\u60F3\u5D4C\u5165\u7684\u97F3\u4E50\u64AD\u653E\u5668\u4EE3\u7801..."></textarea>
          </div>
          <div class="form-group">
            <label>\u4FEE\u6539\u7BA1\u7406\u540E\u53F0\u5BC6\u7801</label>
            <input type="password" id="adminPasswordInput" placeholder="\u7559\u7A7A\u5219\u4E0D\u4FEE\u6539...">
          </div>
          <button class="btn" onclick="saveSettings()">\u4FDD\u5B58\u8BBE\u7F6E</button>
        </div>

        <div id="imagesTab" class="tab-content">
          <div id="imagesMessage" class="message"></div>
          <div class="section-title">\u56FE\u5E8A\u7BA1\u7406 (KV)</div>
          <div style="margin-bottom: 15px; display: flex; gap: 10px;">
            <button class="btn btn-small" onclick="loadImages()">\u5237\u65B0\u56FE\u5E8A</button>
            <button class="btn btn-small" style="background: #aa0000; border-color: #880000;" onclick="cleanUnusedImages()">\u4E00\u952E\u6E05\u7406\u672A\u4F7F\u7528</button>
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
        <h1>\u8BBF\u95EE\u8BE6\u60C5</h1>
        <div class="shade-box"></div>
        <div class="zoom-box"></div>
      </div>
      <div style="flex: 1; overflow-y: auto; background: #BBBBBB; padding: 15px; border-top: 1px solid #FFFFFF;">
        <div id="visitDetailsContent" style="background: #FFFFFF; border: 1px solid #000000; box-shadow: inset 1px 1px 2px rgba(0,0,0,0.2); padding: 12px; font-size: 14px; line-height: 1.6; max-height: 60vh; overflow-y: auto;"></div>
        <div style="text-align: right; margin-top: 15px;">
          <button class="btn" onclick="closeVisitDetails()">\u786E\u5B9A</button>
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
    // \u6CE8\u5165\u521D\u59CB\u6570\u636E
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
        showMessage('loginMessage', '\u767B\u5F55\u8BF7\u6C42\u5931\u8D25', 'error');
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
            <span style="font-weight:bold;">\${escapeHtml(String(page.count))} \u6B21</span>
          </div>
        \`).join('');
      } else {
        pagesDiv.innerHTML = '<p>\u6682\u65E0\u6570\u636E</p>';
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
            <button class="btn btn-small" onclick="editPost(\${post.id})">\u7F16\u8F91</button>
            <button class="btn btn-small" onclick="deletePost(\${post.id})">\u5220\u9664</button>
          </div>
        </div>
      \`).join('');

      // Visits
      const visitBody = document.getElementById('visitTableBody');
      visitBody.innerHTML = visitsData.map(v => \`
        <tr onclick="showVisitDetails('\${v.id}')" style="cursor: pointer;" title="\u70B9\u51FB\u67E5\u770B\u8BE6\u60C5">
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
            <button class="btn btn-small" onclick="editGuestbook(\${g.id})">\u7F16\u8F91</button>
            <button class="btn btn-small" onclick="deleteGuestbook(\${g.id})">\u5220\u9664</button>
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
          uploadedImageUrl = data.url; // \u83B7\u53D6\u56FE\u7247\u5916\u94FE
          previewImg.src = uploadedImageUrl;
          previewImg.style.display = 'inline-block';
          progressFill.style.width = '100%';
          showMessage('postMessage', '\u56FE\u7247\u4E0A\u4F20\u6210\u529F\uFF01', 'success');
        } else {
          throw new Error(data.error || '\u56FE\u7247\u4E0A\u4F20\u5931\u8D25');
        }
      } catch (err) {
        showMessage('postMessage', '\u56FE\u7247\u4E0A\u4F20\u51FA\u9519: ' + err.message, 'error');
        promptDiv.style.display = 'block';
      } finally {
        setTimeout(() => { progressBar.style.display = 'none'; }, 1000);
      }
    }



    async function refreshStats() {
      const btn = document.getElementById('refreshStatsBtn');
      if (btn) btn.textContent = '\u5237\u65B0\u4E2D...';
      try {
        const res = await fetch('/api/stats');
        const data = await res.json();
        document.getElementById('statTotalVisits').textContent = data.totalVisits;
        document.getElementById('statUniqueIPs').textContent = data.uniqueIPs;
        document.getElementById('statTotalPosts').textContent = data.totalPosts;
        
        const topPagesHtml = data.topPages.map((p, i) => \`
          <div style="display:flex; justify-content:space-between; margin-bottom:5px; padding:5px; background:#fff; border:1px solid #ccc;">
            <span>\${i+1}. \${escapeHtml(p.path)}</span>
            <span style="font-weight:bold;">\${p.count} \u6B21</span>
          </div>
        \`).join('');
        document.getElementById('topPagesList').innerHTML = topPagesHtml || '<p>\u6682\u65E0\u6570\u636E</p>';
      } catch(e) {
        console.error('Refresh stats failed', e);
      }
      if (btn) btn.textContent = '\u5237\u65B0';
    }

    async function refreshVisits() {
      const btn = document.getElementById('refreshVisitsBtn');
      if (btn) btn.textContent = '\u5237\u65B0\u4E2D...';
      try {
        const res = await fetch('/api/visits');
        const data = await res.json();
        // Update visitsData global so details modal works
        visitsData.length = 0;
        visitsData.push(...data);
        
        const visitBody = document.getElementById('visitTableBody');
        visitBody.innerHTML = visitsData.map(v => \`
          <tr onclick="showVisitDetails('\${v.id}')" style="cursor: pointer;" title="\u70B9\u51FB\u67E5\u770B\u8BE6\u60C5">
            <td>\${new Date(v.visit_time).toLocaleString('zh-CN')}</td>
            <td>\${escapeHtml(v.path)}</td>
            <td>\${escapeHtml(v.ip)}</td>
            <td>\${escapeHtml(v.user_agent).substring(0,30)}...</td>
          </tr>
        \`).join('');
      } catch(e) {
        console.error('Refresh visits failed', e);
      }
      if (btn) btn.textContent = '\u5237\u65B0';
    }

    function showVisitDetails(id) {
      const v = visitsData.find(x => x.id == id);
      if (!v) return;
      const details = \`
        <p><strong>\u8BBF\u95EE\u65F6\u95F4\uFF1A</strong> \${new Date(v.visit_time).toLocaleString('zh-CN')}</p>
        <p><strong>\u8DEF\u5F84\uFF1A</strong> \${escapeHtml(v.path)}</p>
        <p><strong>IP\uFF1A</strong> \${escapeHtml(v.ip)}</p>
        <p><strong>\u8BBE\u5907 (User-Agent)\uFF1A</strong></p>
        <div style="background: #eee; padding: 10px; border-radius: 4px; word-break: break-all; margin-bottom: 10px;">\${escapeHtml(v.user_agent)}</div>
        <p><strong>\u6765\u6E90 (Referrer)\uFF1A</strong></p>
        <div style="background: #eee; padding: 10px; border-radius: 4px; word-break: break-all;">\${escapeHtml(v.referrer || '\u65E0')}</div>
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
      showMessage('postMessage', '\u6B63\u5728\u7F16\u8F91\u6587\u7AE0\uFF1A' + post.title, 'success');
      window.scrollTo(0, 0);
    }

    async function publishPost() {
      const title = document.getElementById('postTitle').value;
      const content = document.getElementById('postContent').value;
      
      if (!title || !content) {
        showMessage('postMessage', '\u6807\u9898\u548C\u5185\u5BB9\u4E0D\u80FD\u4E3A\u7A7A', 'error');
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
          showMessage('postMessage', editingPostId ? '\u66F4\u65B0\u6210\u529F\uFF01' : '\u53D1\u5E03\u6210\u529F\uFF01', 'success');
          setTimeout(() => location.reload(), 1000);
        } else {
          showMessage('postMessage', editingPostId ? '\u66F4\u65B0\u5931\u8D25' : '\u53D1\u5E03\u5931\u8D25', 'error');
        }
      } catch (e) {
        showMessage('postMessage', '\u8BF7\u6C42\u5931\u8D25: ' + e.message, 'error');
      }
    }

    async function deletePost(id) {
      if (!confirm('\u786E\u5B9A\u8981\u5220\u9664\u8FD9\u6761\u52A8\u6001\u5417\uFF1F')) return;
      try {
        const res = await fetch('/api/posts/' + id, { method: 'DELETE' });
        if ((await res.json()).success) {
          showMessage('postMessage', '\u5220\u9664\u6210\u529F', 'success');
          setTimeout(() => location.reload(), 1000);
        }
      } catch (e) {
        showMessage('postMessage', '\u5220\u9664\u5931\u8D25', 'error');
      }
    }

    async function editGuestbook(id) {
      const gb = guestbookData.find(g => g.id === id);
      if (!gb) return;
      const newMessage = prompt('\u4FEE\u6539\u7559\u8A00\u5185\u5BB9:', gb.message);
      if (newMessage === null || newMessage.trim() === gb.message.trim()) return;
      
      try {
        const res = await fetch('/api/guestbook/' + id, { 
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: newMessage })
        });
        if ((await res.json()).success) {
          showMessage('gbMessage', '\u4FEE\u6539\u6210\u529F', 'success');
          setTimeout(() => location.reload(), 1000);
        } else {
          showMessage('gbMessage', '\u4FEE\u6539\u5931\u8D25', 'error');
        }
      } catch (e) {
        showMessage('gbMessage', '\u7F51\u7EDC\u9519\u8BEF', 'error');
      }
    }

    async function deleteGuestbook(id) {
      if (!confirm('\u786E\u5B9A\u8981\u5220\u9664\u8FD9\u6761\u7559\u8A00\u5417\uFF1F')) return;
      try {
        const res = await fetch('/api/guestbook/' + id, { method: 'DELETE' });
        if ((await res.json()).success) {
          showMessage('gbMessage', '\u5220\u9664\u6210\u529F', 'success');
          setTimeout(() => location.reload(), 1000);
        }
      } catch (e) {
        showMessage('gbMessage', '\u5220\u9664\u5931\u8D25', 'error');
      }
    }


    async function uploadAboutImage(e) {
      const file = e.target.files[0];
      if (!file) return;
      const formData = new FormData();
      formData.append('image', file);
      try {
        showMessage('settingsMessage', '\u56FE\u7247\u4E0A\u4F20\u4E2D...', 'success');
        const res = await fetch('/api/upload', { method: 'POST', body: formData });
        const data = await res.json();
        if (data.success) {
          document.getElementById('aboutImageInput').value = data.url;
          document.getElementById('aboutImagePreview').src = data.url;
          document.getElementById('aboutImagePreview').style.display = 'block';
          showMessage('settingsMessage', '\u914D\u56FE\u4E0A\u4F20\u6210\u529F\uFF0C\u8BF7\u70B9\u51FB\u4FDD\u5B58\u8BBE\u7F6E', 'success');
        } else {
          throw new Error(data.error);
        }
      } catch (err) {
        showMessage('settingsMessage', '\u914D\u56FE\u4E0A\u4F20\u5931\u8D25: ' + err.message, 'error');
      }
    }
    function clearAboutImage() {
      document.getElementById('aboutImageInput').value = '';
      document.getElementById('aboutImagePreview').src = '';
      document.getElementById('aboutImagePreview').style.display = 'none';
      showMessage('settingsMessage', '\u5DF2\u6E05\u9664\u914D\u56FE\uFF0C\u8BF7\u70B9\u51FB\u4FDD\u5B58\u8BBE\u7F6E', 'success');
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
          showMessage('settingsMessage', '\u8BBE\u7F6E\u4FDD\u5B58\u6210\u529F', 'success');
        }
      } catch (e) {
        showMessage('settingsMessage', '\u4FDD\u5B58\u5931\u8D25', 'error');
      }
    }


    async function loadImages() {
      const container = document.getElementById('imagesList');
      container.innerHTML = '<p>\u52A0\u8F7D\u4E2D...</p>';
      try {
        const res = await fetch('/api/images');
        let images = await res.json();
        images = images.filter(img => !recentlyDeletedImages.has(img.name));
        if (images.length === 0) {
          container.innerHTML = '<p>\u56FE\u5E8A\u4E3A\u7A7A</p>';
          return;
        }
        container.innerHTML = images.map(img => \`
          <div style="border: 1px solid #000; padding: 5px; width: 150px; background: #fff; text-align: center;">
            <div style="height: 100px; display: flex; align-items: center; justify-content: center; background: #eee; margin-bottom: 5px; overflow: hidden;">
              <img src="\${img.url}" style="max-width: 100%; max-height: 100%; object-fit: contain;">
            </div>
            <div style="font-size: 11px; word-break: break-all; margin-bottom: 5px; height: 30px; overflow: hidden;">\${escapeHtml(img.name)}</div>
            <div style="margin-bottom: 5px; font-weight: bold; color: \${img.used ? '#00aa00' : '#aa0000'};">
              \${img.used ? '\u2705 \u5DF2\u4F7F\u7528' : '\u26A0\uFE0F \u672A\u4F7F\u7528'}
            </div>
            <button class="btn btn-small" style="width: 100%" onclick="deleteImage('\${img.name}')">\u5220\u9664</button>
          </div>
        \`).join('');
      } catch (err) {
        showMessage('imagesMessage', '\u52A0\u8F7D\u56FE\u5E8A\u5931\u8D25: ' + err.message, 'error');
        container.innerHTML = '<p>\u52A0\u8F7D\u5931\u8D25</p>';
      }
    }

    async function deleteImage(name) {
      if (!confirm('\u786E\u5B9A\u8981\u5220\u9664\u56FE\u7247 ' + name + ' \u5417\uFF1F\u5220\u9664\u540E\u5C06\u65E0\u6CD5\u6062\u590D\uFF01')) return;
      try {
        const res = await fetch('/api/images/' + name, { method: 'DELETE' });
        if ((await res.json()).success) {
          recentlyDeletedImages.add(name);
          showMessage('imagesMessage', '\u5220\u9664\u6210\u529F\uFF01', 'success');
          loadImages();
        } else {
          showMessage('imagesMessage', '\u5220\u9664\u5931\u8D25\uFF01', 'error');
        }
      } catch (err) {
        showMessage('imagesMessage', '\u8BF7\u6C42\u5931\u8D25', 'error');
      }
    }

    async function cleanUnusedImages() {
      try {
        showMessage('imagesMessage', '\u6B63\u5728\u626B\u63CF\u672A\u4F7F\u7528\u7684\u56FE\u7247...', 'success');
        const res = await fetch('/api/images');
        const images = await res.json();
        const unused = images.filter(img => !img.used);
        
        if (unused.length === 0) {
          showMessage('imagesMessage', '\u6CA1\u6709\u53D1\u73B0\u672A\u4F7F\u7528\u7684\u56FE\u7247\uFF01', 'success');
          return;
        }
        
        if (!confirm(\`\u53D1\u73B0 \${unused.length} \u5F20\u672A\u4F7F\u7528\u7684\u56FE\u7247\uFF0C\u786E\u5B9A\u8981\u4E00\u952E\u6E05\u7406\u5417\uFF1F\u6E05\u7406\u540E\u5C06\u65E0\u6CD5\u6062\u590D\uFF01\`)) return;
        
        showMessage('imagesMessage', \`\u6B63\u5728\u6E05\u7406 \${unused.length} \u5F20\u56FE\u7247\uFF0C\u8BF7\u7A0D\u5019...\`, 'success');
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
        showMessage('imagesMessage', \`\u6E05\u7406\u5B8C\u6210\uFF01\u6210\u529F\u5220\u9664\u4E86 \${successCount} \u5F20\u56FE\u7247\u3002\`, 'success');
        loadImages();
      } catch (err) {
        showMessage('imagesMessage', '\u6E05\u7406\u8FC7\u7A0B\u53D1\u751F\u9519\u8BEF: ' + err.message, 'error');
      }
    }
  <\/script>
</body>
</html>`;
  return new Response(html, {
    headers: { "Content-Type": "text/html;charset=UTF-8", "Cache-Control": "no-cache, no-store, must-revalidate" }
  });
}

// worker.js
var worker_default = {
  async fetch(request, env) {
    const url = new URL(request.url);
    const pathname = url.pathname;
    if (!pathname.startsWith("/api/") && pathname !== "/admin") {
      const ip = request.headers.get("cf-connecting-ip") || "unknown";
      const userAgent = request.headers.get("user-agent") || "unknown";
      const referer = request.headers.get("referer") || "";
      env.DB.prepare(
        "INSERT INTO visits (path, ip, user_agent, referer) VALUES (?, ?, ?, ?)"
      ).bind(pathname, ip, userAgent, referer).run().catch((e) => console.error("Log error", e));
    }
    if (pathname.startsWith("/api/")) {
      try {
        return await handleApi(request, env, pathname);
      } catch (error) {
        await env.DB.prepare(
          "INSERT INTO logs (level, message, source) VALUES (?, ?, ?)"
        ).bind("error", error.stack || error.message, "api").run().catch(() => {
        });
        return new Response(JSON.stringify({ success: false, error: "Internal Server Error" }), { status: 500 });
      }
    }
    if (pathname === "/admin") {
      return await serveAdminPanel(request, env);
    }
    if (pathname === "/") {
      return await serveHomepage(request, env);
    }
    return new Response("Not Found", { status: 404 });
  }
};
async function handleApi(request, env, pathname) {
  const method = request.method;
  if (pathname === "/api/guestbook" && method === "POST") {
    const { author, message } = await request.json();
    if (!author || !message) return new Response(JSON.stringify({ success: false, message: "\u6635\u79F0\u548C\u7559\u8A00\u4E0D\u80FD\u4E3A\u7A7A" }), { status: 400 });
    await env.DB.prepare("INSERT INTO guestbook (author, message) VALUES (?, ?)").bind(author, message).run();
    return new Response(JSON.stringify({ success: true }));
  }
  if (pathname.startsWith("/api/guestbook/") && method === "DELETE") {
    if (!isAuthenticated(request)) return new Response("Unauthorized", { status: 401 });
    const id = pathname.split("/").pop();
    await env.DB.prepare("DELETE FROM guestbook WHERE id = ?").bind(id).run();
    return new Response(JSON.stringify({ success: true }));
  }
  if (pathname.startsWith("/api/guestbook/") && method === "PUT") {
    if (!isAuthenticated(request)) return new Response("Unauthorized", { status: 401 });
    const id = pathname.split("/").pop();
    const { message } = await request.json();
    await env.DB.prepare("UPDATE guestbook SET message = ? WHERE id = ?").bind(message, id).run();
    return new Response(JSON.stringify({ success: true }));
  }
  if (pathname === "/api/login" && method === "POST") {
    const { password } = await request.json();
    const settingsResult = await env.DB.prepare("SELECT value FROM settings WHERE key = 'admin_password'").first();
    const validPassword = settingsResult && settingsResult.value ? settingsResult.value : "admin123";
    if (password === validPassword) {
      const response = new Response(JSON.stringify({ success: true }), {
        headers: { "Content-Type": "application/json" }
      });
      setCookie(response, "admin_token", "secret-admin-token", 7);
      return response;
    }
    return new Response(JSON.stringify({ success: false, message: "\u5BC6\u7801\u9519\u8BEF" }), {
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
  }
  if (pathname.startsWith("/api/images/") && method === "GET") {
    const imageName = pathname.split("/api/images/")[1];
    const image = await env.IMAGE_KV.get(imageName, { type: "arrayBuffer" });
    if (!image) {
      return new Response("Image not found", { status: 404 });
    }
    const ext = imageName.split(".").pop().toLowerCase();
    const contentTypes = {
      "png": "image/png",
      "gif": "image/gif",
      "webp": "image/webp",
      "svg": "image/svg+xml",
      "jpg": "image/jpeg",
      "jpeg": "image/jpeg"
    };
    return new Response(image, {
      headers: {
        "Content-Type": contentTypes[ext] || "image/jpeg",
        "Cache-Control": "public, max-age=31536000"
      }
    });
  }
  if (!isAuthenticated(request)) {
    return new Response(JSON.stringify({ error: "\u672A\u6388\u6743" }), {
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
  }
  if (pathname === "/api/posts" && method === "GET") {
    const result = await env.DB.prepare("SELECT * FROM posts ORDER BY created_at DESC").all();
    return new Response(JSON.stringify(result.results), {
      headers: { "Content-Type": "application/json" }
    });
  }
  if (pathname === "/api/posts" && method === "POST") {
    const { title, content, imageUrl } = await request.json();
    const result = await env.DB.prepare(
      "INSERT INTO posts (title, content, image_url) VALUES (?, ?, ?)"
    ).bind(title, content, imageUrl || null).run();
    return new Response(JSON.stringify({
      success: true,
      id: result.meta?.last_row_id || result.lastRowId || null
    }), {
      headers: { "Content-Type": "application/json" }
    });
  }
  if (pathname.startsWith("/api/posts/") && method === "PUT") {
    const id = pathname.split("/")[3];
    const { title, content, imageUrl } = await request.json();
    await env.DB.prepare(
      "UPDATE posts SET title = ?, content = ?, image_url = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?"
    ).bind(title, content, imageUrl || null, id).run();
    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" }
    });
  }
  if (pathname.startsWith("/api/posts/") && method === "DELETE") {
    const id = pathname.split("/")[3];
    await env.DB.prepare("DELETE FROM posts WHERE id = ?").bind(id).run();
    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" }
    });
  }
  if (pathname === "/api/logs" && method === "GET") {
    const logs = await env.DB.prepare("SELECT * FROM logs ORDER BY created_at DESC LIMIT 50").all();
    return new Response(JSON.stringify(logs.results || []), {
      headers: { "Content-Type": "application/json" }
    });
  }
  if (pathname === "/api/logs" && method === "DELETE") {
    await env.DB.prepare("DELETE FROM logs").run();
    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" }
    });
  }
  if (pathname === "/api/stats" && method === "GET") {
    const totalPosts = await env.DB.prepare("SELECT COUNT(*) as count FROM posts").first();
    const totalVisits = await env.DB.prepare("SELECT COUNT(*) as count FROM visits").first();
    const uniqueIPs = await env.DB.prepare("SELECT COUNT(DISTINCT ip) as count FROM visits").first();
    const recentVisits = await env.DB.prepare(
      'SELECT COUNT(*) as count FROM visits WHERE visit_time >= datetime("now", "-1 day")'
    ).first();
    const topPages = await env.DB.prepare(
      "SELECT path, COUNT(*) as count FROM visits GROUP BY path ORDER BY count DESC LIMIT 10"
    ).all();
    const todayVisits = await env.DB.prepare(
      "SELECT DATE(visit_time) as day, COUNT(*) as count FROM visits GROUP BY DATE(visit_time) ORDER BY day DESC LIMIT 7"
    ).all();
    return new Response(JSON.stringify({
      totalPosts: totalPosts.count || 0,
      totalVisits: totalVisits.count || 0,
      uniqueIPs: uniqueIPs.count || 0,
      todayVisits: recentVisits.count || 0,
      topPages: topPages.results || [],
      weeklyVisits: todayVisits.results || []
    }), {
      headers: { "Content-Type": "application/json" }
    });
  }
  if (pathname === "/api/visits" && method === "GET") {
    const visits = await env.DB.prepare(
      "SELECT * FROM visits ORDER BY visit_time DESC LIMIT 100"
    ).all();
    return new Response(JSON.stringify(visits.results || []), {
      headers: { "Content-Type": "application/json" }
    });
  }
  if (pathname === "/api/upload" && method === "POST") {
    const formData = await request.formData();
    const file = formData.get("image");
    if (!file) {
      return new Response(JSON.stringify({ error: "No image provided" }), { status: 400 });
    }
    const buffer = await file.arrayBuffer();
    const filename = formData.get("filename") || file.name;
    const ext = filename?.split(".").pop() || "jpg";
    const uniqueName = `uploads/${Date.now()}-${Math.random().toString(36).substring(2)}.${ext}`;
    await env.IMAGE_KV.put(uniqueName, buffer, {
      expirationTtl: 365 * 24 * 60 * 60
      // 1 year
    });
    const publicUrl = `/api/images/${uniqueName}`;
    return new Response(JSON.stringify({
      success: true,
      url: publicUrl,
      filename: uniqueName
    }), {
      headers: { "Content-Type": "application/json" }
    });
  }
  if (pathname === "/api/images" && method === "GET") {
    const kvList = await env.IMAGE_KV.list();
    const postsWithImages = await env.DB.prepare("SELECT image_url FROM posts WHERE image_url IS NOT NULL").all();
    const aboutImageSetting = await env.DB.prepare("SELECT value FROM settings WHERE key = ?").bind("about_image_url").first();
    const usedUrls = new Set(postsWithImages.results.map((r) => r.image_url));
    if (aboutImageSetting && aboutImageSetting.value) {
      usedUrls.add(aboutImageSetting.value);
    }
    const images = kvList.keys.map((k) => {
      const url = `/api/images/${k.name}`;
      return {
        name: k.name,
        url,
        used: usedUrls.has(url)
      };
    });
    return new Response(JSON.stringify(images), {
      headers: { "Content-Type": "application/json" }
    });
  }
  if (pathname.startsWith("/api/images/") && method === "DELETE") {
    const imageName = pathname.split("/api/images/")[1];
    await env.IMAGE_KV.delete(imageName);
    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" }
    });
  }
  if (pathname === "/api/settings" && method === "GET") {
    const settings = await env.DB.prepare("SELECT * FROM settings").all();
    const result = {};
    if (settings.results) {
      settings.results.forEach((row) => {
        result[row.key] = row.value;
      });
    }
    return new Response(JSON.stringify(result), {
      headers: { "Content-Type": "application/json" }
    });
  }
  if (pathname === "/api/settings" && method === "POST") {
    const data = await request.json();
    for (const [key, value] of Object.entries(data)) {
      await env.DB.prepare(
        "INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value"
      ).bind(key, String(value)).run();
    }
    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" }
    });
  }
  return new Response("API endpoint not found", { status: 404 });
}
export {
  worker_default as default
};
