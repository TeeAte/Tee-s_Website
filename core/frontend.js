import { escapeHtml } from "./utils.js";
import { marked } from "marked";
import { getPetHTML, getPetCSS, getPetJS } from "./pet_frontend.js";

export 
async function serveHomepage(request, env) {
  const url = new URL(request.url);
  const section = url.searchParams.get('section') || 'home';

  let posts = [];
  if (['home', 'posts', 'gallery'].includes(section)) {
    const postsResult = await env.DB.prepare('SELECT * FROM posts ORDER BY created_at DESC').all();
    posts = postsResult.results || [];
  }

  // 获取留言
  let guestbook = [];
  if (section === 'guestbook') {
    const guestbookResult = await env.DB.prepare('SELECT * FROM guestbook ORDER BY created_at DESC').all();
    guestbook = guestbookResult.results || [];
  }

  // 获取设置
  const settingsResult = await env.DB.prepare('SELECT key, value FROM settings').all();
  const settingsMap = {};
  if (settingsResult.results) {
    settingsResult.results.forEach(r => settingsMap[r.key] = r.value);
  }
  let musicPlayerCode = settingsMap['music_player_code'] || '<iframe class="music-box" src="https://i.y.qq.com/n2/m/outchain/player/index.html?songid=526191277&songtype=0" height="65" frameBorder="0" allowfullscreen="" loading="lazy"></iframe>';
  let aboutTitle = settingsMap['about_title'] || '关于我 (About)';
  let aboutContent = settingsMap['about_content'] || `<p>欢迎来到我的个人网站！这里是属于我的一方小天地。</p>
<p>在这里我会分享我的生活点滴、作品和想法。</p>
<p>如果你有什么想对我说的，欢迎随时联系我~</p>`;
  let siteTitle = settingsMap['site_title'] || "TeeAte's Website";
  let siteSubtitle = settingsMap['site_subtitle'] || "很Niubi 的 Website";
  let windowTitle = settingsMap['window_title'] || siteTitle;
  let aboutImageUrl = settingsMap['about_image_url'] || '';

  function renderPostImages(imageUrlStr) {
    if (!imageUrlStr) return '';
    let urls = [];
    if (imageUrlStr.startsWith('[')) {
      try { urls = JSON.parse(imageUrlStr); } catch(e) { urls = [imageUrlStr]; }
    } else {
      urls = [imageUrlStr];
    }
    if (urls.length === 0) return '';
    if (urls.length === 1) {
      return `<img src="${urls[0]}" class="post-image" onclick="openLightbox('${urls[0]}')">`;
    }
    return `<div class="post-images-grid">
      ${urls.map(u => `<img src="${u}" class="post-image grid-img" onclick="openLightbox('${u}')">`).join('')}
    </div>`;
  }

  let galleryItems = [];
  posts.forEach(p => {
    if (!p.image_url) return;
    if (p.image_url.startsWith('[')) {
      try { JSON.parse(p.image_url).forEach(u => galleryItems.push({url: u, title: p.title})); } catch(e) { galleryItems.push({url: p.image_url, title: p.title}); }
    } else {
      galleryItems.push({url: p.image_url, title: p.title});
    }
  });

  const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(windowTitle)}</title>
  <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect x='2' y='2' width='28' height='22' rx='2' ry='2' fill='%23DDDDDD' stroke='%23000' stroke-width='2'/><rect x='4' y='4' width='24' height='15' fill='%23FFFFFF' stroke='%23000' stroke-width='2'/><rect x='8' y='7' width='3' height='3' fill='%23000'/><rect x='21' y='7' width='3' height='3' fill='%23000'/><path d='M 10 13 Q 16 17 22 13' fill='none' stroke='%23000' stroke-width='2'/><rect x='8' y='21' width='6' height='1' fill='%23000'/><rect x='10' y='24' width='12' height='6' fill='%23DDDDDD' stroke='%23000' stroke-width='2'/></svg>">
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
      font-family: "Chicago", "Geneva", "Monaco", "Courier New", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
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
    .music-box { width: 100%; max-width: 100%; height: 67px; border-radius: 0; border: 1px solid #000; box-shadow: 2px 2px 0 #000; margin-bottom: 20px; display: block; overflow: hidden; background: #fff; }
    
    .post-card { background: var(--bg); border: 1px solid var(--border2); padding: 20px; margin-bottom: 20px; box-shadow: inset 1px 1px 0 var(--border2), inset -1px -1px 0 #000; }
    .post-title { font-size: 1.5rem; color: var(--text2); margin-bottom: 10px; font-weight: bold; }
    .post-date { font-size: 0.9rem; color: var(--text3); margin-bottom: 15px; }
    .post-content { line-height: 1.6; white-space: normal; font-family: "Courier New", monospace; }
    .post-image { max-width: 100%; max-height: 400px; object-fit: contain; border: 1px solid #000; margin-top: 15px; display: block; box-shadow: 2px 2px 0 #000; }

    /* Markdown Styles */
    .markdown-body { font-family: "Courier New", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", monospace; line-height: 1.6; }
    .markdown-body p { margin-bottom: 10px; }
    .markdown-body h1, .markdown-body h2, .markdown-body h3 { color: var(--text2); margin-top: 15px; margin-bottom: 10px; border-bottom: 1px dashed var(--border2); padding-bottom: 5px;}
    .markdown-body a { color: var(--text2); text-decoration: underline; cursor: pointer; }
    .markdown-body pre { background: var(--bg3); border: 1px solid var(--border); padding: 10px; overflow-x: auto; margin-bottom: 15px; box-shadow: inset 1px 1px 0 var(--border2); }
    .markdown-body code { background: var(--bg2); padding: 2px 4px; font-family: monospace; border: 1px solid var(--border2); }
    .markdown-body pre code { background: transparent; padding: 0; border: none; }
    .markdown-body blockquote { border-left: 4px solid var(--text2); padding-left: 10px; margin-left: 0; color: var(--text3); font-style: italic; background: var(--bg2); padding: 5px 10px; }
    .markdown-body ul, .markdown-body ol { padding-left: 25px; margin-bottom: 15px; }
    .markdown-body img { max-width: 100%; border: 1px solid #000; box-shadow: 2px 2px 0 #000; display: block; margin: 10px 0; }

    /* Guestbook Sticky Notes Wall */
    .guestbook-wall { position: relative; width: 100%; height: 600px; background: var(--bg3); border: 2px inset var(--border2); overflow: auto; margin-top: 15px; background-image: radial-gradient(var(--border) 1px, transparent 1px); background-size: 20px 20px; touch-action: pan-x pan-y; }
    .sticky-note { position: absolute; width: 160px; padding: 15px; box-shadow: 3px 3px 5px rgba(0,0,0,0.3); cursor: grab; user-select: none; font-family: 'Comic Sans MS', 'Chalkboard SE', 'Kaiti SC', 'KaiTi', 'STKaiti', cursive, sans-serif; font-size: 15px; transform-origin: top center; transition: box-shadow 0.2s; word-wrap: break-word; touch-action: none; }
    .sticky-note:active { cursor: grabbing; box-shadow: 6px 6px 10px rgba(0,0,0,0.4); z-index: 1000 !important; }
    .sticky-note::before { content: ''; position: absolute; top: -10px; left: 50%; transform: translateX(-50%); width: 60px; height: 20px; background: rgba(255, 255, 255, 0.4); box-shadow: 0 1px 2px rgba(0,0,0,0.2); border-radius: 2px; }
    .note-yellow { background-color: #fdfd96; color: #333; }
    .note-pink { background-color: #ffb7b2; color: #333; }
    .note-blue { background-color: #a2cffe; color: #333; }
    .note-green { background-color: #b5ead7; color: #333; }
    .note-author { font-weight: bold; margin-bottom: 8px; border-bottom: 1px dashed rgba(0,0,0,0.2); padding-bottom: 3px; font-size: 15px; }
    .note-date { font-size: 11px; color: rgba(0,0,0,0.5); text-align: right; margin-top: 10px; }
    
    @media(max-width:800px) {
      .guestbook-wall { display: flex; flex-direction: column; align-items: center; gap: 20px; padding: 20px 0; height: auto; max-height: 80vh; }
      .sticky-note { position: static !important; transform: none !important; margin: 0 auto; cursor: default; touch-action: auto; width: 80%; max-width: 300px; }
      .sticky-note:active { cursor: default; box-shadow: 3px 3px 5px rgba(0,0,0,0.3) !important; z-index: auto !important; }
    }

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
    .input-field { padding: 4px 8px; border: 1px solid var(--border); background: var(--bg3); color: var(--text); font-family: inherit; font-size: 14px; box-shadow: inset 1px 1px 2px rgba(0,0,0,0.4); outline: none; transition: background 0.2s; }
    .input-field:focus { background: var(--bg); border-color: var(--text2); }
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
    ${getPetCSS()}
    .post-images-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-top: 15px; }
    .grid-img { width: 100%; aspect-ratio: 1/1; object-fit: cover; cursor: pointer; margin-top: 0 !important; }
    @media(max-width:800px) {
      .post-images-grid { grid-template-columns: 1fr; gap: 10px; }
      .grid-img { aspect-ratio: auto; }
    }
    .post-image { cursor: pointer; margin-top: 15px; max-width: 100%; height: auto; border: 1px solid #000; display: block; box-shadow: 2px 2px 0 #000; }
    
    /* Lightbox Modal */
    .lightbox-modal { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 9999; justify-content: center; align-items: center; padding: 20px; }
    .lightbox-content { max-width: 90%; max-height: 90%; border: 2px solid #fff; box-shadow: 4px 4px 0 #000; object-fit: contain; }
    .lightbox-close { position: absolute; top: 20px; right: 20px; color: #fff; font-size: 30px; cursor: pointer; font-weight: bold; background: none; border: none; text-shadow: 2px 2px 0 #000; }

  </style>
</head>
<body>
  <div class="menu-bar">
    <span class="apple"></span>
    <span class="menu-item" onclick="window.location.href='/'">File</span>
    <span class="menu-item" onclick="window.location.href='/admin'">Admin</span>
    <div class="menu-right">
      <span class="menu-item" id="themeToggle">🌗 黑白切换</span>
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
        <a href="/" class="panel-tab ${section === 'home' ? 'active' : ''}">首页</a>
        <a href="/?section=posts" class="panel-tab ${section === 'posts' ? 'active' : ''}">动态</a>
        <a href="/?section=gallery" class="panel-tab ${section === 'gallery' ? 'active' : ''}">相册</a>
        <a href="/?section=guestbook" class="panel-tab ${section === 'guestbook' ? 'active' : ''}">留言</a>
        <a href="/?section=about" class="panel-tab ${section === 'about' ? 'active' : ''}">关于</a>
      </div>
      
      <div class="content-area">
        ${section === 'home' ? `
          <div class="site-header">
            <div class="site-title">${escapeHtml(siteTitle)}</div>
            <div class="site-subtitle">${escapeHtml(siteSubtitle)}</div>
          </div>
          ${musicPlayerCode}
          ${getPetHTML()}
          <div class="posts-section">
            ${posts.slice(0, 3).map(post => `
              <div class="post-card">
                <div class="post-title">${escapeHtml(post.title)}</div>
                <div class="post-date">${new Date(post.created_at).toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}</div>
                <div class="post-content markdown-body">${marked.parse(post.content)}</div>
                ${renderPostImages(post.image_url)}
              </div>
            `).join('')}
            ${posts.length > 3 ? `
            <div style="text-align: center; margin-top: 15px; margin-bottom: 20px;">
              <a href="/?section=posts" class="btn" style="text-decoration: none; padding: 6px 15px;">查看更多...</a>
            </div>
            ` : ''}
          </div>
        ` : ''}

        ${section === 'posts' ? `
          <div class="posts-section">
            ${posts.map(post => `
              <div class="post-card">
                <div class="post-title">${escapeHtml(post.title)}</div>
                <div class="post-date">${new Date(post.created_at).toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}</div>
                <div class="post-content markdown-body">${marked.parse(post.content)}</div>
                ${renderPostImages(post.image_url)}
              </div>
            `).join('')}
          </div>
        ` : ''}

        ${section === 'gallery' ? `
          <div class="gallery-grid">
            ${galleryItems.map(item => `
              <div class="gallery-item" onclick="openLightbox('${item.url}')">
                <img src="${item.url}" alt="${escapeHtml(item.title)}">
              </div>
            `).join('')}
          </div>
        ` : ''}

        ${section === 'guestbook' ? `
          <div class="guestbook-section">
            <h2>互动留言墙</h2>
            <div style="background: var(--bg2); padding: 10px; border: 1px solid var(--border); margin-bottom: 10px; box-shadow: inset 1px 1px 0 var(--btn-hi), inset -1px -1px 0 var(--btn-lo);">
              <form id="guestbookForm" onsubmit="submitGuestbook(event)" style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap;">
                <label style="font-weight: bold; white-space: nowrap;">写便利贴:</label>
                <input type="text" id="gbAuthor" placeholder="你的昵称" required class="input-field" style="width: 120px; height: 30px;">
                <input type="text" id="gbMessage" placeholder="想说点什么？" required class="input-field" style="flex: 1; min-width: 200px; height: 30px;">
                <button type="submit" class="btn" style="height: 30px; line-height: 28px; padding: 0 15px;">贴上墙</button>
              </form>
            </div>
            <div class="guestbook-wall">
              ${guestbook.map(g => {
                const colorCls = 'note-' + (g.color || 'yellow');
                const x = g.x >= 0 ? g.x : Math.floor(Math.random() * 300);
                const y = g.y >= 0 ? g.y : Math.floor(Math.random() * 400);
                const rot = Math.floor(Math.random() * 10) - 5;
                const z = Math.floor(Math.random() * 10) + 1;
                return `
                <div class="sticky-note ${colorCls}" data-id="${g.id}" style="left: ${x}px; top: ${y}px; transform: rotate(${rot}deg); z-index: ${z};">
                  <div class="note-author">${escapeHtml(g.author)}</div>
                  <div class="note-message">${escapeHtml(g.message)}</div>
                  <div class="note-date">${new Date(g.created_at).toLocaleDateString('zh-CN', { timeZone: 'Asia/Shanghai' })}</div>
                </div>
              `}).join('')}
            </div>
          </div>
        ` : ''}

        ${section === 'about' ? `
          <div class="about-section">
            <h2>${escapeHtml(aboutTitle)}</h2>
            ${aboutImageUrl ? `<div style="text-align: center; margin-bottom: 20px;"><img src="${escapeHtml(aboutImageUrl)}" style="max-width: 100%; border: 1px solid #000; box-shadow: 2px 2px 0 #000;" alt="About Image"></div>` : ''}
            <div class="markdown-body" style="font-size: 16px;">${marked.parse(aboutContent)}</div>
          </div>
        ` : ''}
      </div>
    </div>
  </div>

  <script>
    // Theme toggle
    const themeToggle = document.getElementById('themeToggle');
    const savedTheme = localStorage.getItem('macTheme');
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

    async function submitGuestbook(e) {
        e.preventDefault();
        const btn = e.target.querySelector('button');
        btn.disabled = true;
        btn.textContent = '提交中...';
        
        const colors = ['yellow', 'pink', 'blue', 'green'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        const wall = document.querySelector('.guestbook-wall');
        const x = wall ? wall.clientWidth / 2 - 80 + (Math.random() * 40 - 20) : 100;
        const y = wall ? wall.clientHeight / 2 - 80 + (Math.random() * 40 - 20) : 100;

        const res = await fetch('/api/guestbook', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            author: document.getElementById('gbAuthor').value,
            message: document.getElementById('gbMessage').value,
            x: Math.floor(x),
            y: Math.floor(y),
            color: randomColor
          })
        });
        if (res.ok) {
          window.location.reload();
        } else {
          alert('提交失败');
          btn.disabled = false;
          btn.textContent = '贴上墙';
        }
      }

      // Drag and Drop Logic (Mouse + Touch)
      let activeNote = null;
      let offsetX = 0;
      let offsetY = 0;

      function dragStart(e) {
        if (window.innerWidth <= 800) return; // Disable drag on mobile
        const target = e.target.closest('.sticky-note');
        if (target) {
          activeNote = target;
          activeNote.style.zIndex = 1000;
          activeNote.style.transform = activeNote.style.transform.replace(/rotate\\([^\\)]+\\)/, 'rotate(0deg) scale(1.05)');
          
          const clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
          const clientY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;
          
          offsetX = clientX - activeNote.offsetLeft;
          offsetY = clientY - activeNote.offsetTop;
        }
      }

      function dragMove(e) {
        if (!activeNote) return;
        if (e.type.includes('touch')) e.preventDefault(); // Prevent scrolling while dragging note
        
        const clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
        const clientY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;
        
        let x = clientX - offsetX;
        let y = clientY - offsetY;
        const wall = document.querySelector('.guestbook-wall');
        
        if (wall) {
          x = Math.max(0, Math.min(x, wall.scrollWidth - activeNote.offsetWidth));
          y = Math.max(0, Math.min(y, wall.scrollHeight - activeNote.offsetHeight));
        }

        activeNote.style.left = x + 'px';
        activeNote.style.top = y + 'px';
      }

      async function dragEnd(e) {
        if (activeNote) {
          const rot = Math.floor(Math.random() * 10) - 5;
          activeNote.style.transform = \`rotate(\${rot}deg)\`;
          activeNote.style.zIndex = Math.floor(Math.random() * 10) + 1;
          
          const id = activeNote.dataset.id;
          const x = parseInt(activeNote.style.left);
          const y = parseInt(activeNote.style.top);
          
          const noteToSave = activeNote;
          activeNote = null; 
          
          try {
            await fetch(\`/api/guestbook/\${id}/position\`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ x, y })
            });
          } catch (err) { console.error('Failed to save position'); }
        }
      }

      document.addEventListener('mousedown', dragStart);
      document.addEventListener('mousemove', dragMove);
      document.addEventListener('mouseup', dragEnd);

      document.addEventListener('touchstart', dragStart, {passive: false});
      document.addEventListener('touchmove', dragMove, {passive: false});
      document.addEventListener('touchend', dragEnd);
    ${getPetJS()}
  </script>


  <div id="lightboxModal" style="display:none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 9999; justify-content: center; align-items: center; padding: 16px;" onclick="closeLightbox()">
    <div class="window" style="width: fit-content; max-width: 90vw; min-width: 300px; max-height: 90vh; display: flex; flex-direction: column;" onclick="event.stopPropagation()">
      <div class="topbar">
        <div class="close-box" onclick="closeLightbox()"></div>
        <h1>查看图片</h1>
        <div class="shade-box"></div>
        <div class="zoom-box"></div>
      </div>
      <div style="flex: 1; overflow-y: auto; background: var(--bg2); padding: 15px; border-top: 1px solid var(--bg3); display: flex; flex-direction: column;">
        <div style="background: var(--bg3); border: 1px solid #000000; box-shadow: inset 1px 1px 2px rgba(0,0,0,0.2); padding: 0; font-size: 14px; line-height: 1.6; max-height: 70vh; display: flex; justify-content: center; align-items: center; overflow: hidden; align-self: center;">
          <img id="lightboxImg" src="" style="max-width: 100%; max-height: 70vh; object-fit: contain; display: block;">
        </div>
        <div style="text-align: right; margin-top: 15px;">
          <button class="btn" onclick="closeLightbox()">确定</button>
        </div>
      </div>
    </div>
  </div>
  <script>
    function openLightbox(url) {
      document.getElementById('lightboxImg').src = url;
      document.getElementById('lightboxModal').style.display = 'flex';
    }
    function closeLightbox() {
      document.getElementById('lightboxModal').style.display = 'none';
    }
  </script>
</body>
</html>`;

  return new Response(html, {
    headers: { 'Content-Type': 'text/html;charset=UTF-8', 'Cache-Control': 'no-cache, no-store, must-revalidate' },
  });
}



// ============================================================
// 后台管理界面
// ============================================================
