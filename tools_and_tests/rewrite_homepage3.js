const fs = require('fs');
const file = 'worker.js';
let content = fs.readFileSync(file, 'utf8');

const regex = /async function serveHomepage\(request, env\) \{([\s\S]*?)\n\}\n\n/g;
let match = regex.exec(content);

if (!match) {
  console.log("Could not find serveHomepage");
  process.exit(1);
}

const serveHomepageContent = `async function serveHomepage(request, env) {
  const url = new URL(request.url);
  const section = url.searchParams.get('section') || 'home';

  // 获取文章
  const postsResult = await env.DB.prepare('SELECT * FROM posts ORDER BY created_at DESC').all();
  const posts = postsResult.results || [];

  // 获取留言
  const guestbookResult = await env.DB.prepare('SELECT * FROM guestbook ORDER BY created_at DESC').all();
  const guestbook = guestbookResult.results || [];

  // 获取设置
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
  let windowTitle = settingsMap['window_title'] || siteTitle;

  const html = \`<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>\${escapeHtml(windowTitle)}</title>
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
    }
    
    body.dark-mode {
      --bg: #1A1A1A; --bg2: #2C2C2C; --bg3: #111111; --bg4: #000000;
      --border: #000000; --border2: #444444;
      --text: #E0E0E0; --text2: #00ffd5; --text3: #AAAAAA;
      --topbar-grad: repeating-linear-gradient(to bottom, #111 0px, #111 1px, #333 1px, #333 2px);
      --btn-bg: #444;
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
    .close-box::after { content: ""; position: absolute; top: 3px; left: 3px; right: 3px; bottom: 3px; border: 1px solid #000000; }
    .close-box:active { background: var(--text); }
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
    .panel-tab { padding: 12px 16px; font-size: 14px; font-weight: 700; color: var(--text); text-decoration: none; display: block; border-bottom: 1px solid #000000; border-top: 1px solid var(--border2); }
    @media(max-width:800px) {
      .panel-tab { padding: 8px 12px; flex: 1; text-align: center; border-bottom: none; border-right: 1px solid #000000; }
      .panel-tab:last-child { border-right: none; }
    }
    .panel-tab.active { background: #000000; color: #FFFFFF; }
    body.dark-mode .panel-tab.active { background: #000000; color: #FFFFFF; }
    .panel-tab:hover:not(.active) { background: var(--border2); color: var(--text); }

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

    /* Guestbook */
    .guestbook-form { border: 2px solid var(--text); padding: 15px; margin-bottom: 20px; background: var(--bg2); }
    .gb-input, .gb-textarea { width: 100%; padding: 8px; border: 1px solid #000; background: var(--bg3); color: var(--text); font-family: inherit; margin-bottom: 10px; }
    .gb-btn { padding: 8px 15px; border: 1px solid #000; background: var(--bg); color: var(--text); cursor: pointer; font-weight: bold; font-family: inherit; box-shadow: inset 1px 1px 0 var(--border2), inset -1px -1px 0 #000; }
    .gb-btn:active { box-shadow: inset 1px 1px 0 #000, inset -1px -1px 0 var(--border2); padding-top: 9px; padding-left: 1px; }
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
      <h1>\${escapeHtml(windowTitle)}</h1>
      <div class="shade-box"></div>
      <div class="zoom-box"></div>
    </div>
    <div class="main-area">
      <div class="sidebar">
        <a href="/" class="panel-tab \${section === 'home' ? 'active' : ''}">首页</a>
        <a href="/?section=posts" class="panel-tab \${section === 'posts' ? 'active' : ''}">动态</a>
        <a href="/?section=gallery" class="panel-tab \${section === 'gallery' ? 'active' : ''}">相册</a>
        <a href="/?section=guestbook" class="panel-tab \${section === 'guestbook' ? 'active' : ''}">留言</a>
        <a href="/?section=about" class="panel-tab \${section === 'about' ? 'active' : ''}">关于</a>
      </div>
      
      <div class="content-area">
        \${section === 'home' ? \`
          <div class="site-header">
            <div class="site-title">\${escapeHtml(siteTitle)}</div>
            <div class="site-subtitle">\${escapeHtml(siteSubtitle)}</div>
          </div>
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

        \${section === 'guestbook' ? \`
          <div class="guestbook-form">
            <h3 style="margin-bottom:10px">留个言吧 (Leave a message)</h3>
            <input type="text" id="gbAuthor" class="gb-input" placeholder="你的昵称 (Your name)" maxlength="30">
            <textarea id="gbMessage" class="gb-textarea" placeholder="想说点什么？ (What's on your mind?)" rows="3" maxlength="300"></textarea>
            <button class="gb-btn" onclick="submitGuestbook()">提交留言 (Submit)</button>
          </div>
          <div class="guestbook-list">
            \${guestbook.map(gb => \`
              <div class="gb-entry">
                <span class="gb-author">\${escapeHtml(gb.author)}</span>
                <span class="gb-date">\${new Date(gb.created_at).toLocaleString('zh-CN')}</span>
                <div class="gb-msg">\${escapeHtml(gb.message)}</div>
              </div>
            \`).join('')}
            \${guestbook.length === 0 ? '<p>暂无留言。(No messages yet)</p>' : ''}
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
        alert('昵称和留言不能为空！');
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
          alert('提交失败');
        }
      } catch (err) {
        console.error(err);
        alert('提交失败');
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

content = content.replace(regex, serveHomepageContent + '\n\n');
fs.writeFileSync(file, content);
console.log("Successfully rewrote serveHomepage for light mode, mobile layout, and separate titles.");
