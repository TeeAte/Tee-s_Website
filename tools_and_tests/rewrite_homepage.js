const fs = require('fs');

const file = '/Users/teeate/Desktop/CloudFare/worker.js';
let content = fs.readFileSync(file, 'utf8');

// Find the serveHomepage function
const regex = /async function serveHomepage\(request, env\) \{([\s\S]*?)\n\}\n\n\/\/ ============================================================/g;
let match = regex.exec(content);

if (!match) {
  console.log("Could not find serveHomepage");
  process.exit(1);
}

const serveHomepageContent = `async function serveHomepage(request, env) {
  const url = new URL(request.url);
  const section = url.searchParams.get('section') || 'home';

  // 获取文章
  const postsResult = await env.DB.prepare(
    'SELECT * FROM posts ORDER BY created_at DESC'
  ).all();
  const posts = postsResult.results || [];

  // 获取 About 等内容
  const settingsResult = await env.DB.prepare('SELECT key, value FROM settings').all();
  const settingsMap = {};
  if (settingsResult.results) {
    settingsResult.results.forEach(r => settingsMap[r.key] = r.value);
  }
  let aboutContent = settingsMap['about_content'] || \`<p>欢迎来到我的个人网站！这里是属于我的一方小天地。</p>
<p>在这里我会分享我的生活点滴、作品和想法。</p>
<p>如果你有什么想对我说的，欢迎随时联系我~</p>\`;
  let siteTitle = settingsMap['site_title'] || "TeeAte's Website";
  let siteSubtitle = settingsMap['site_subtitle'] || "很Niubi 的 Website";

  const html = \`<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>\${siteTitle}</title>
  <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='20' fill='%23111111'/><text x='50' y='50' dy='.35em' font-family='Courier New' font-weight='900' font-size='70' text-anchor='middle' fill='%23E0E0E0'>T</text></svg>">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body { height: 100%; overflow: hidden; }
    :root {
      --bg: #1A1A1A; --bg2: #2C2C2C; --bg3: #111111; --bg4: #000000;
      --border: #000000; --border2: #444444;
      --text: #E0E0E0; --text2: #00ffd5; --text3: #AAAAAA;
    }
    body {
      font-family: "Chicago", "Geneva", "Monaco", "Courier New", monospace;
      background: var(--bg);
      color: var(--text);
      height: 100vh;
      overflow: hidden;
      font-size: 15px;
    }

    /* Mac Menu Bar Dark */
    .menu-bar { height: 28px; background: #222222; border-bottom: 2px solid #000000; display: flex; align-items: center; padding: 0 12px; font-size: 14px; font-weight: 700; gap: 20px; }
    .menu-bar .apple { font-size: 18px; margin-right: 8px; color: #FFF; }
    .menu-item { padding: 2px 8px; cursor: pointer; color: #E0E0E0; text-decoration: none; }
    .menu-item:hover { background: #E0E0E0; color: #000000; }
    .menu-item.active { background: #444444; color: #FFFFFF; }

    .app { display: flex; flex-direction: column; height: calc(100vh - 28px); border: 1px solid #000000; margin: 10px; background: var(--bg2); box-shadow: 2px 2px 0px rgba(0,0,0,0.8); }
    @media(max-width:800px) { .app { margin: 0; height: calc(100vh - 28px); border-radius: 0; } }

    /* Title Bar with Dark Pinstripes */
    .topbar { display: flex; align-items: center; padding: 0 8px; height: 36px; background: repeating-linear-gradient(to bottom, #111 0px, #111 1px, #333 1px, #333 2px); border-bottom: 1px solid #000000; position: relative; flex-shrink: 0; }
    .close-box { width: 16px; height: 16px; background: #444; border: 1px solid #000000; flex-shrink: 0; position: relative; cursor: pointer; }
    .close-box::after { content: ""; position: absolute; top: 3px; left: 3px; right: 3px; bottom: 3px; border: 1px solid #000000; }
    .close-box:active { background: #111; }
    .topbar h1 { font-size: 15px; font-weight: 700; letter-spacing: 0; display: flex; align-items: center; gap: 6px; background: #222; color: #FFF; padding: 2px 16px; border: 1px solid #000000; position: absolute; left: 50%; transform: translateX(-50%); z-index: 1; }
    .shade-box { width: 16px; height: 16px; background: #444; border: 1px solid #000000; flex-shrink: 0; position: relative; margin-left: auto; }
    .shade-box::after { content: ""; position: absolute; top: 7px; left: 3px; right: 3px; border-bottom: 1px solid #000000; }
    .zoom-box { width: 16px; height: 16px; background: #444; border: 1px solid #000000; flex-shrink: 0; position: relative; margin-left: 4px; }
    .zoom-box::after { content: ""; position: absolute; top: 3px; left: 3px; right: 3px; bottom: 3px; border: 1px solid #000000; }

    .main-area { display: flex; flex: 1; overflow: hidden; }

    /* Sidebar / Tabs */
    .sidebar { width: 200px; background: var(--bg2); border-right: 1px solid #000000; display: flex; flex-direction: column; border-top: 1px solid #444; flex-shrink: 0; }
    .panel-tab { padding: 12px 16px; font-size: 14px; font-weight: 700; color: var(--text); text-decoration: none; display: block; border-bottom: 1px solid #000000; border-top: 1px solid #444; }
    .panel-tab.active { background: #000000; color: #FFFFFF; }
    .panel-tab:hover:not(.active) { background: #444444; }

    /* Content Area */
    .content-area { flex: 1; background: var(--bg3); overflow-y: auto; padding: 20px; box-shadow: inset 1px 1px 0 #000000, inset -1px -1px 0 #333333; position: relative; }
    
    /* Typography & Specifics */
    .site-header { margin-bottom: 20px; text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; }
    .site-title { font-size: 2rem; font-weight: 900; color: var(--text); letter-spacing: 2px; }
    .site-subtitle { font-size: 1.2rem; color: var(--text3); margin-top: 5px; }

    .music-box { width: 100%; border-radius: 0; border: 1px solid #000; box-shadow: 2px 2px 0 #000; margin-bottom: 20px; }
    
    .post-card { background: #1A1A1A; border: 1px solid #444; padding: 20px; margin-bottom: 20px; box-shadow: inset 1px 1px 0 #333, inset -1px -1px 0 #000; }
    .post-title { font-size: 1.5rem; color: var(--text2); margin-bottom: 10px; font-weight: bold; }
    .post-date { font-size: 0.9rem; color: var(--text3); margin-bottom: 15px; }
    .post-content { line-height: 1.6; white-space: pre-wrap; font-family: "Courier New", monospace; }
    .post-image { max-width: 100%; border: 1px solid #000; margin-top: 15px; display: block; }
    
    .gallery-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 15px; }
    .gallery-item { border: 1px solid #444; background: #000; padding: 5px; cursor: pointer; transition: transform 0.2s; }
    .gallery-item:hover { transform: scale(1.02); border-color: var(--text2); }
    .gallery-item img { width: 100%; height: 200px; object-fit: cover; display: block; }

    .about-section { line-height: 1.8; color: var(--text); font-family: "Courier New", monospace; }
    .about-section h2 { color: var(--text2); margin-bottom: 20px; border-bottom: 1px dashed #444; padding-bottom: 10px; }
    
    /* Scrollbar */
    ::-webkit-scrollbar { width: 16px; background: url('data:image/svg+xml;utf8,<svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><rect width="16" height="16" fill="%23222"/><line x1="0" y1="0" x2="16" y2="16" stroke="%23000"/><line x1="16" y1="0" x2="0" y2="16" stroke="%23000"/></svg>'); border-left: 1px solid #000; }
    ::-webkit-scrollbar-thumb { background: #444; border: 1px solid #000; box-shadow: inset 1px 1px 0 #666, inset -1px -1px 0 #111; }
    ::-webkit-scrollbar-button:single-button { background: #444; border: 1px solid #000; height: 16px; box-shadow: inset 1px 1px 0 #666, inset -1px -1px 0 #111; display: block; }
  </style>
</head>
<body>
  <div class="menu-bar">
    <span class="apple"></span>
    <span class="menu-item" onclick="window.location.href='/'">File</span>
    <span class="menu-item" onclick="window.location.href='/admin'">Admin</span>
  </div>

  <div class="app">
    <div class="topbar">
      <div class="close-box"></div>
      <h1>\${siteTitle}</h1>
      <div class="shade-box"></div>
      <div class="zoom-box"></div>
    </div>
    <div class="main-area">
      <div class="sidebar">
        <a href="/" class="panel-tab \${section === 'home' ? 'active' : ''}">首页 (Home)</a>
        <a href="/?section=posts" class="panel-tab \${section === 'posts' ? 'active' : ''}">动态 (Posts)</a>
        <a href="/?section=gallery" class="panel-tab \${section === 'gallery' ? 'active' : ''}">相册 (Gallery)</a>
        <a href="/?section=about" class="panel-tab \${section === 'about' ? 'active' : ''}">关于 (About)</a>
      </div>
      
      <div class="content-area">
        <div class="site-header">
          <div class="site-title">\${siteTitle}</div>
          <div class="site-subtitle">\${siteSubtitle}</div>
        </div>

        \${section === 'home' ? \`
          <iframe class="music-box" src="https://i.y.qq.com/n2/m/outchain/player/index.html?songid=526191277&songtype=0" height="65" frameBorder="0" allowfullscreen="" loading="lazy"></iframe>
          <div class="posts-section">
            \${posts.slice(0, 3).map(post => \`
              <div class="post-card">
                <div class="post-title">\${escapeHtml(post.title)}</div>
                <div class="post-date">\${new Date(post.created_at).toLocaleString('zh-CN')}</div>
                <div class="post-content">\${escapeHtml(post.content).substring(0, 200)}\${post.content.length > 200 ? '...' : ''}</div>
                \${post.image_url ? \`<img src="\${post.image_url}" class="post-image" alt="\${escapeHtml(post.title)}">\` : ''}
              </div>
            \`).join('')}
          </div>
        \` : ''}

        \${section === 'posts' ? \`
          <div class="posts-section">
            \${posts.map(post => \`
              <div class="post-card">
                <div class="post-title">\${escapeHtml(post.title)}</div>
                <div class="post-date">\${new Date(post.created_at).toLocaleString('zh-CN')}</div>
                <div class="post-content">\${escapeHtml(post.content)}</div>
                \${post.image_url ? \`<img src="\${post.image_url}" class="post-image" alt="\${escapeHtml(post.title)}">\` : ''}
              </div>
            \`).join('')}
          </div>
        \` : ''}

        \${section === 'gallery' ? \`
          <div class="gallery-grid">
            \${posts.filter(p => p.image_url).map(post => \`
              <div class="gallery-item" onclick="window.open('\${post.image_url}', '_blank')">
                <img src="\${post.image_url}" alt="\${escapeHtml(post.title)}">
              </div>
            \`).join('')}
          </div>
        \` : ''}

        \${section === 'about' ? \`
          <div class="about-section">
            <h2>About Me</h2>
            \${aboutContent}
          </div>
        \` : ''}
      </div>
    </div>
  </div>

  <script>
    function escapeHtml(text) {
      if (!text) return '';
      return String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    }
  </script>
</body>
</html>\`;

  return new Response(html, {
    headers: { 'Content-Type': 'text/html;charset=UTF-8', 'Cache-Control': 'no-cache, no-store, must-revalidate' },
  });
}
`;

content = content.replace(regex, serveHomepageContent + '\n\n// ============================================================');
fs.writeFileSync(file, content);
console.log("Successfully rewrote serveHomepage.");
