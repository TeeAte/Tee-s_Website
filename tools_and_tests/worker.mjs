// ============================================================
// Cloudflare Worker - 综合性个人网站
// 功能：前台展示 + 后台管理 + 流量监控 + 图片上传
// ============================================================

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const pathname = url.pathname;

    // 初始化数据库表
    await env.DB.prepare(`
      CREATE TABLE IF NOT EXISTS posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        image_url TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `).run();

    await env.DB.prepare(`
      CREATE TABLE IF NOT EXISTS visits (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        path TEXT NOT NULL,
        ip TEXT,
        user_agent TEXT,
        referrer TEXT,
        visit_time DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `).run();

    await env.DB.prepare(`
      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT
      )
    `).run();

    await env.DB.prepare(`
      CREATE TABLE IF NOT EXISTS logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        level TEXT NOT NULL,
        message TEXT NOT NULL,
        stack TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `).run();

    // 记录访问
    await recordVisit(env, pathname, request);

    // 路由分发
    if (pathname === '/' || pathname === '') {
      return serveHomepage(request, env);
    }
    if (pathname === '/admin') {
      return serveAdminPanel(request, env);
    }
    if (pathname === '/login' && request.method === 'GET') {
      return Response.redirect(new URL('/admin', request.url).toString(), 302);
    }
    if (pathname === '/logout') {
      return logout();
    }

    // API 路由
    if (pathname.startsWith('/api/')) {
      try {
        return await handleApi(request, env, pathname);
      } catch (error) {
        try {
          await env.DB.prepare(
            'INSERT INTO logs (level, message, stack) VALUES (?, ?, ?)'
          ).bind('ERROR', error.message, error.stack).run();
        } catch (logErr) {
          console.error('Failed to write log', logErr);
        }
        return new Response(JSON.stringify({ error: 'Internal Server Error: ' + error.message }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    return new Response('Not Found', { status: 404 });
  },
};

// ============================================================
// 访问记录
// ============================================================
async function recordVisit(env, path, request) {
  const ip = request.headers.get('cf-connecting-ip') || 'unknown';
  const userAgent = request.headers.get('user-agent') || '';
  const referrer = request.headers.get('referer') || '';
  
  await env.DB.prepare(
    'INSERT INTO visits (path, ip, user_agent, referrer) VALUES (?, ?, ?, ?)'
  ).bind(path, ip, userAgent, referrer).run();
}

// ============================================================
// Cookie 工具函数
// ============================================================
function setCookie(response, name, value, days = 7) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  response.headers.append('Set-Cookie', `${name}=${value}; Expires=${expires}; Path=/; HttpOnly; SameSite=Lax`);
}

function getCookie(request, name) {
  const cookies = request.headers.get('cookie') || '';
  const match = cookies.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? decodeURIComponent(match[2]) : null;
}

function isAuthenticated(request) {
  const token = getCookie(request, 'admin_token');
  return token === 'secret-admin-token';
}

// ============================================================
// 登出
// ============================================================
function logout() {
  const response = new Response(JSON.stringify({ success: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
  response.headers.append('Set-Cookie', 'admin_token=; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Path=/; HttpOnly');
  return response;
}

// ============================================================
// API 路由处理
// ============================================================
async function handleApi(request, env, pathname) {
  const method = request.method;

  // POST /api/login
  if (pathname === '/api/login' && method === 'POST') {
    const { password } = await request.json();
    if (password === 'admin123') {
      const response = new Response(JSON.stringify({ success: true }), {
        headers: { 'Content-Type': 'application/json' },
      });
      setCookie(response, 'admin_token', 'secret-admin-token', 7);
      return response;
    }
    return new Response(JSON.stringify({ success: false, message: '密码错误' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // GET /api/images/:name - 获取图片
  if (pathname.startsWith('/api/images/') && method === 'GET') {
    const imageName = pathname.split('/api/images/')[1];
    const image = await env.IMAGE_KV.get(imageName, 'arrayBuffer');
    
    if (!image) {
      return new Response('Image not found', { status: 404 });
    }
    
    return new Response(image, {
      headers: {
        'Content-Type': 'image/jpeg',
        'Cache-Control': 'public, max-age=31536000',
      },
    });
  }

  // 需要认证的接口
  if (!isAuthenticated(request)) {
    return new Response(JSON.stringify({ error: '未授权' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // GET /api/posts - 获取所有文章
  if (pathname === '/api/posts' && method === 'GET') {
    const result = await env.DB.prepare('SELECT * FROM posts ORDER BY created_at DESC').all();
    return new Response(JSON.stringify(result.results), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // POST /api/posts - 创建文章
  if (pathname === '/api/posts' && method === 'POST') {
    const { title, content, imageUrl } = await request.json();
    const result = await env.DB.prepare(
      'INSERT INTO posts (title, content, image_url) VALUES (?, ?, ?)'
    ).bind(title, content, imageUrl || null).run();
    
    return new Response(JSON.stringify({
      success: true,
      id: result.meta?.last_row_id || result.lastRowId || null,
    }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // PUT /api/posts/:id - 更新文章
  if (pathname.startsWith('/api/posts/') && method === 'PUT') {
    const id = pathname.split('/')[3];
    const { title, content, imageUrl } = await request.json();
    await env.DB.prepare(
      'UPDATE posts SET title = ?, content = ?, image_url = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
    ).bind(title, content, imageUrl || null, id).run();
    
    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // DELETE /api/posts/:id - 删除文章
  if (pathname.startsWith('/api/posts/') && method === 'DELETE') {
    const id = pathname.split('/')[3];
    await env.DB.prepare('DELETE FROM posts WHERE id = ?').bind(id).run();
    
    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // GET /api/logs - 获取系统日志
  if (pathname === '/api/logs' && method === 'GET') {
    const logs = await env.DB.prepare('SELECT * FROM logs ORDER BY created_at DESC LIMIT 50').all();
    return new Response(JSON.stringify(logs.results || []), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // DELETE /api/logs - 清空系统日志
  if (pathname === '/api/logs' && method === 'DELETE') {
    await env.DB.prepare('DELETE FROM logs').run();
    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // GET /api/stats - 获取统计数据
  if (pathname === '/api/stats' && method === 'GET') {
    const totalPosts = await env.DB.prepare('SELECT COUNT(*) as count FROM posts').first();
    const totalVisits = await env.DB.prepare('SELECT COUNT(*) as count FROM visits').first();
    const recentVisits = await env.DB.prepare(
      'SELECT COUNT(*) as count FROM visits WHERE visit_time >= datetime("now", "-1 day")'
    ).first();
    const topPages = await env.DB.prepare(
      'SELECT path, COUNT(*) as count FROM visits GROUP BY path ORDER BY count DESC LIMIT 10'
    ).all();
    const todayVisits = await env.DB.prepare(
      'SELECT DATE(visit_time) as day, COUNT(*) as count FROM visits GROUP BY DATE(visit_time) ORDER BY day DESC LIMIT 7'
    ).all();

    return new Response(JSON.stringify({
      totalPosts: totalPosts.count || 0,
      totalVisits: totalVisits.count || 0,
      todayVisits: recentVisits.count || 0,
      topPages: topPages.results || [],
      weeklyVisits: todayVisits.results || [],
    }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // GET /api/visits - 获取访问记录
  if (pathname === '/api/visits' && method === 'GET') {
    const visits = await env.DB.prepare(
      'SELECT * FROM visits ORDER BY visit_time DESC LIMIT 100'
    ).all();
    return new Response(JSON.stringify(visits.results || []), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // POST /api/upload - 上传图片
  if (pathname === '/api/upload' && method === 'POST') {
    const formData = await request.formData();
    const file = formData.get('image');
    
    if (!file) {
      return new Response(JSON.stringify({ error: 'No image provided' }), { status: 400 });
    }
    
    const buffer = await file.arrayBuffer();
    const filename = formData.get('filename') || file.name;
    
    // 生成唯一文件名
    const ext = filename?.split('.').pop() || 'jpg';
    const uniqueName = `uploads/${Date.now()}-${Math.random().toString(36).substring(2)}.${ext}`;
    
    // 保存到 KV（小图片可以用 KV，大文件建议用 R2）
    await env.IMAGE_KV.put(uniqueName, buffer, {
      expirationTtl: 365 * 24 * 60 * 60, // 1 year
    });
    
    const publicUrl = `/api/images/${uniqueName}`;
    
    return new Response(JSON.stringify({
      success: true,
      url: publicUrl,
      filename: uniqueName,
    }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // DELETE /api/images/:name - 删除图片
  if (pathname.startsWith('/api/images/')) {
    const imageName = pathname.split('/api/images/')[1];
    await env.IMAGE_KV.delete(imageName);
    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // GET /api/settings - 获取设置
  if (pathname === '/api/settings' && method === 'GET') {
    const settings = await env.DB.prepare('SELECT * FROM settings').all();
    const result = {};
    if (settings.results) {
      settings.results.forEach(row => {
        result[row.key] = row.value;
      });
    }
    return new Response(JSON.stringify(result), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // POST /api/settings - 更新设置
  if (pathname === '/api/settings' && method === 'POST') {
    const data = await request.json();
    for (const [key, value] of Object.entries(data)) {
      await env.DB.prepare(
        'INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value'
      ).bind(key, String(value)).run();
    }
    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response('API endpoint not found', { status: 404 });
}

// ============================================================
// 前台主页
// ============================================================
async function serveHomepage(request, env) {
  const url = new URL(request.url);
  const section = url.searchParams.get('section') || 'home';

  // 获取文章
  const postsResult = await env.DB.prepare(
    'SELECT * FROM posts ORDER BY created_at DESC'
  ).all();
  const posts = postsResult.results || [];

  // 获取 About 内容
  const settingsResult = await env.DB.prepare('SELECT key, value FROM settings').all();
  const settingsMap = {};
  if (settingsResult.results) {
    settingsResult.results.forEach(r => settingsMap[r.key] = r.value);
  }
  let aboutContent = settingsMap['about_content'] || `<p>欢迎来到我的个人网站！这里是属于我的一方小天地。</p>
<p>在这里我会分享我的生活点滴、作品和想法。</p>
<p>如果你有什么想对我说的，欢迎随时联系我~</p>`;
  let siteTitle = settingsMap['site_title'] || "TeeAte's Website";
  let siteSubtitle = settingsMap['site_subtitle'] || "很Niubi 的 Website";

  const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${siteTitle}</title>
  <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='20' fill='%23000000'/><text x='50' y='50' dy='.35em' font-family='Georgia' font-weight='900' font-size='70' text-anchor='middle' fill='%2300ffd5'>T</text></svg>">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      margin: 0;
      background-color: #050505;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      font-family: 'Arial Black', sans-serif;
      box-sizing: border-box;
      color: #fff;
    }
    .container {
      position: relative;
      text-align: center;
      max-width: 800px;
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 30px;
      padding: 20px;
      margin: auto;
    }
    .flashy-text {
      font-family: Georgia;
      font-size: 9rem;
      font-weight: 900;
      letter-spacing: 10px;
      color: transparent;
      text-transform: uppercase;
      background: linear-gradient(45deg, #ff0000, #ff7300, #fffb00, #48ff00, #00ffd5, #002bff, #7a00ff, #ff00c8, #ff0000);
      background-size: 400%;
      -webkit-background-clip: text;
      background-clip: text;
      animation: glowing 20s linear infinite;
      position: relative;
      z-index: 1;
      text-align: center;
    }
    .flashy-text::after {
      content: 'TeeAte';
      position: absolute;
      left: 0; top: 0;
      width: 100%; height: 100%;
      background: inherit;
      z-index: -1;
      filter: blur(25px);
      opacity: 0.8;
    }
    .subtitle {
      font-family: Georgia, serif;
      color: #fff;
      font-size: 1.3rem;
      opacity: 0.5;
      letter-spacing: 2px;
      animation: blink 2s infinite;
    }
    .nav-menu {
      display: flex;
      gap: 20px;
      justify-content: center;
      flex-wrap: wrap;
    }
    .nav-menu a {
      color: #00ffd5;
      text-decoration: none;
      padding: 10px 20px;
      border: 1px solid #00ffd5;
      border-radius: 5px;
      transition: all 0.3s;
    }
    .nav-menu a:hover, .nav-menu a.active {
      background: #00ffd5;
      color: #000;
    }
    .music-box {
      margin: 20px 0;
      box-shadow: 0 10px 30px rgba(0,0,0,0.5);
      width: 100%;
    }
    .posts-section {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 25px;
    }
    .post-card {
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 10px;
      padding: 25px;
      text-align: left;
      transition: transform 0.3s;
    }
    .post-card:hover {
      transform: translateY(-5px);
      border-color: #00ffd5;
    }
    .post-title {
      font-size: 1.5rem;
      color: #00ffd5;
      margin-bottom: 10px;
    }
    .post-date {
      font-size: 0.8rem;
      opacity: 0.5;
      margin-bottom: 15px;
    }
    .post-content {
      font-family: Georgia, serif;
      line-height: 1.8;
      white-space: pre-wrap;
    }
    .post-image {
      width: 100%;
      border-radius: 8px;
      margin-top: 15px;
    }
    .gallery-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 15px;
      width: 100%;
    }
    .gallery-item {
      aspect-ratio: 1;
      border-radius: 8px;
      overflow: hidden;
      cursor: pointer;
      transition: transform 0.3s;
    }
    .gallery-item:hover {
      transform: scale(1.05);
    }
    .gallery-item img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .about-section {
      font-family: Georgia, serif;
      line-height: 1.8;
      text-align: left;
    }
    .about-section h2 {
      color: #00ffd5;
      margin-bottom: 20px;
    }
    .about-section p {
      margin-bottom: 15px;
    }
    @keyframes glowing {
      0% { background-position: 0 0; }
      50% { background-position: 400% 0; }
      100% { background-position: 0 0; }
    }
    @keyframes blink {
      0%, 100% { opacity: 0.3; }
      50% { opacity: 0.8; }
    }
    @media (max-width: 600px) {
      .flashy-text { font-size: 4rem; }
      .container { padding: 40px 20px; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="flashy-text">${siteTitle.replace("'s Website", "")}</div>
    <div class="subtitle">${siteSubtitle}</div>
    
    <div class="nav-menu">
      <a href="/" class="${section === 'home' ? 'active' : ''}">首页</a>
      <a href="/?section=posts" class="${section === 'posts' ? 'active' : ''}">动态</a>
      <a href="/?section=gallery" class="${section === 'gallery' ? 'active' : ''}">相册</a>
      <a href="/?section=about" class="${section === 'about' ? 'active' : ''}">关于</a>
    </div>

    ${section === 'home' ? `
      <iframe class="music-box" style="border-radius:12px" src="https://i.y.qq.com/n2/m/outchain/player/index.html?songid=526191277&songtype=0" height="65" frameBorder="0" allowfullscreen="" loading="lazy"></iframe>
      
      <div class="posts-section">
        ${posts.slice(0, 3).map(post => `
          <div class="post-card">
            <div class="post-title">${escapeHtml(post.title)}</div>
            <div class="post-date">${new Date(post.created_at).toLocaleString('zh-CN')}</div>
            <div class="post-content">${escapeHtml(post.content).substring(0, 200)}${post.content.length > 200 ? '...' : ''}</div>
            ${post.image_url ? `<img src="${post.image_url}" class="post-image" alt="${escapeHtml(post.title)}">` : ''}
          </div>
        `).join('')}
      </div>
    ` : ''}

    ${section === 'posts' ? `
      <div class="posts-section">
        ${posts.map(post => `
          <div class="post-card">
            <div class="post-title">${escapeHtml(post.title)}</div>
            <div class="post-date">${new Date(post.created_at).toLocaleString('zh-CN')}</div>
            <div class="post-content">${escapeHtml(post.content)}</div>
            ${post.image_url ? `<img src="${post.image_url}" class="post-image" alt="${escapeHtml(post.title)}">` : ''}
          </div>
        `).join('')}
      </div>
    ` : ''}

    ${section === 'gallery' ? `
      <div class="gallery-grid">
        ${posts.filter(p => p.image_url).map(post => `
          <div class="gallery-item">
            <img src="${post.image_url}" alt="${escapeHtml(post.title)}" onclick="window.open('${post.image_url}', '_blank')">
          </div>
        `).join('')}
      </div>
    ` : ''}

    ${section === 'about' ? `
      <div class="about-section">
        <h2>About Me</h2>
        <div style="text-align: left; line-height: 1.6; margin-top: 20px;">
          ${aboutContent}
        </div>
      </div>
    ` : ''}
  </div>
</body>
</html>`;

  return new Response(html, {
    headers: { 'Content-Type': 'text/html;charset=UTF-8', 'Cache-Control': 'no-cache, no-store, must-revalidate' },
  });
}

function escapeHtml(text) {
  if (!text) return '';
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// ============================================================
// 后台管理界面
// ============================================================
async function serveAdminPanel(request, env) {
  const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Macintosh Admin Panel</title>
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
    .visit-table th { background: #CCCCCC; font-weight: 700; }

    /* Misc */
    .section-title { font-size: 16px; font-weight: 700; border-bottom: 2px solid #000000; padding-bottom: 4px; margin: 20px 0 15px; }

    /* Classic Mac Scrollbar */
    ::-webkit-scrollbar { width: 16px; height: 16px; }
    ::-webkit-scrollbar-track { background: #BBBBBB; border-left: 1px solid #000000; }
    ::-webkit-scrollbar-thumb { background: #BBBBBB; border: 1px solid #000000; box-shadow: inset 1px 1px 0 #FFFFFF, inset -1px -1px 0 #888888; }
    ::-webkit-scrollbar-button { display: block; height: 16px; width: 16px; background: #BBBBBB; border: 1px solid #000000; box-shadow: inset 1px 1px 0 #FFFFFF, inset -1px -1px 0 #888888; }
  </style>
</head>
<body>
  <div class="menu-bar">
    <span class="apple">🍎</span>
    <span class="menu-item" onclick="window.open('/', '_blank')">TeeAte 站点</span>
    <span class="menu-item">文件</span>
    <span class="menu-item">编辑</span>
    <span class="menu-item">视图</span>
  </div>

  <div id="loginView">
    <div class="login-box">
      <div class="login-box-inner">
        <h2>System Login</h2>
        <div id="loginMessage" class="message"></div>
        <div class="form-group" style="text-align:left;">
          <label>Password:</label>
          <input type="password" id="passwordInput" placeholder="Enter password">
        </div>
        <button class="btn" style="width: 100%" onclick="login()">OK</button>
      </div>
    </div>
  </div>

  <div class="app" id="dashboardView" style="display: none;">
    <header class="topbar">
      <div class="close-box" onclick="logout()"></div>
      <h1>TeeAte Admin Panel</h1>
      <div class="shade-box"></div>
      <div class="zoom-box"></div>
    </header>

    <div class="main-area">
      <aside class="sidebar">
        <div class="panel-tab active" onclick="switchTab('posts')">文章管理</div>
        <div class="panel-tab" onclick="switchTab('stats')">流量统计</div>
        <div class="panel-tab" onclick="switchTab('visits')">访问记录</div>
        <div class="panel-tab" onclick="switchTab('logs')">系统日志</div>
        <div class="panel-tab" onclick="switchTab('settings')">系统设置</div>
      </aside>

      <section class="content-area">
        
        <div id="postsTab" class="tab-content active">
          <div id="postMessage" class="message"></div>
          <div class="section-title">发布新动态</div>
          <div class="form-group">
            <label>标题</label>
            <input type="text" id="postTitle" placeholder="输入标题">
          </div>
          <div class="form-group">
            <label>内容</label>
            <textarea id="postContent" placeholder="输入内容"></textarea>
          </div>
          <div class="form-group">
            <label>图片附件</label>
            <div class="upload-area" onclick="document.getElementById('imageInput').click()">
              <p id="uploadText">点击此处选择图片</p>
              <img id="imagePreview" class="preview-image" style="display: none;">
              <div id="uploadProgress" style="display: none;">
                <div class="progress-bar"><div class="progress-fill" id="uploadProgressBar" style="width: 0%;"></div></div>
              </div>
            </div>
            <input type="file" id="imageInput" accept="image/*" style="display: none;" onchange="handleImageUpload(event)">
          </div>
          <button id="publishBtn" class="btn" onclick="savePost()">发布</button>
          
          <div class="section-title">已发布动态</div>
          <div id="postList"></div>
        </div>

        <div id="statsTab" class="tab-content">
          <div class="section-title">站点概览</div>
          <div class="stats-grid">
            <div class="stat-card"><div class="number" id="totalPosts">0</div><div class="label">文章总数</div></div>
            <div class="stat-card"><div class="number" id="totalVisits">0</div><div class="label">总访问量</div></div>
            <div class="stat-card"><div class="number" id="todayVisits">0</div><div class="label">今日访问</div></div>
            <div class="stat-card"><div class="number" id="totalImages">0</div><div class="label">附件总数</div></div>
          </div>
          <div class="section-title">热门页面</div>
          <div id="topPages"></div>
        </div>

        <div id="logsTab" class="tab-content">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
            <div class="section-title" style="margin: 0; border: none;">系统异常日志</div>
            <button class="btn btn-small" onclick="clearLogs()">清空日志</button>
          </div>
          <div id="logList" style="border: 1px solid #000; padding: 10px; background: #fff; font-family: 'Monaco', 'Courier New', monospace; font-size: 12px; max-height: 400px; overflow-y: auto;">
          </div>
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

        <div id="settingsTab" class="tab-content">
          <div id="settingsMessage" class="message"></div>
          <div class="section-title">网站信息设置</div>
          <div class="form-group">
            <label>站点标题</label>
            <input type="text" id="siteTitleInput" placeholder="TeeAte's Website">
          </div>
          <div class="form-group">
            <label>副标题</label>
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
    let editingPostId = null;
    let currentImageUrl = '';

    // 检查登录状态
    fetch('/api/stats')
      .then((res) => {
        if (res.ok) {
          document.getElementById('loginView').style.display = 'none';
          document.getElementById('dashboardView').style.display = 'flex';
          loadStats();
          loadPosts();
          loadSettingsData();
        } else {
          document.getElementById('loginView').style.display = 'flex';
        }
      })
      .catch(() => {
        document.getElementById('loginView').style.display = 'flex';
      });

    async function login() {
      const password = document.getElementById('passwordInput').value;
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await response.json();
      
      if (data.success) {
        document.getElementById('loginView').style.display = 'none';
        document.getElementById('dashboardView').style.display = 'flex';
        loadStats();
        loadPosts();
        loadSettingsData();
      } else {
        showMessage('loginMessage', data.message || '登录失败', 'error');
      }
    }

    async function logout() {
      await fetch('/logout');
      document.getElementById('loginView').style.display = 'flex';
      document.getElementById('dashboardView').style.display = 'none';
      document.getElementById('passwordInput').value = '';
    }

    function switchTab(tabName) {
      document.querySelectorAll('.panel-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
      event.target.classList.add('active');
      document.getElementById(tabName + 'Tab').classList.add('active');
      
      if (tabName === 'stats') loadStats();
      if (tabName === 'visits') loadVisits();
      if (tabName === 'logs') loadLogs();
      if (tabName === 'settings') loadSettingsData();
    }

    async function loadStats() {
      const response = await fetch('/api/stats');
      const stats = await response.json();
      
      document.getElementById('totalPosts').textContent = stats.totalPosts;
      document.getElementById('totalVisits').textContent = stats.totalVisits;
      document.getElementById('todayVisits').textContent = stats.todayVisits;
      document.getElementById('totalImages').textContent = stats.totalPosts;
      
      const pagesDiv = document.getElementById('topPages');
      pagesDiv.innerHTML = stats.topPages.map(page => \`
        <div style="display:flex; justify-content:space-between; border-bottom:1px solid #ccc; padding:5px 0;">
          <span>\${escapeHtml(page.path)}</span>
          <span style="font-weight:bold;">\${escapeHtml(String(page.count))} 次</span>
        </div>
      \`).join('');
    }

    async function loadLogs() {
      const response = await fetch('/api/logs');
      const logs = await response.json();
      const logList = document.getElementById('logList');
      
      if (logs.length === 0) {
        logList.innerHTML = '<div style="color:#666;">暂无异常日志</div>';
        return;
      }
      
      logList.innerHTML = logs.map(log => \`
        <div style="border-bottom: 1px solid #ccc; margin-bottom: 10px; padding-bottom: 10px;">
          <strong style="color: #000;">[\${escapeHtml(log.level)}] \${new Date(log.created_at).toLocaleString()}</strong><br>
          <span style="color: #d00;">\${escapeHtml(log.message)}</span>
          \${log.stack ? \`<br><pre style="white-space: pre-wrap; color: #666; margin-top: 5px;">\${escapeHtml(log.stack)}</pre>\` : ''}
        </div>
      \`).join('');
    }

    async function clearLogs() {
      if (!confirm('确定要清空所有异常日志吗？')) return;
      await fetch('/api/logs', { method: 'DELETE' });
      loadLogs();
    }

    async function loadPosts() {
      const response = await fetch('/api/posts');
      const posts = await response.json();
      const listDiv = document.getElementById('postList');
      
      if (posts.length === 0) {
        listDiv.innerHTML = '<p style="color: #666; text-align: center; padding: 20px;">暂无动态</p>';
        return;
      }
      
      listDiv.innerHTML = posts.map(post => \`
        <div class="post-item">
          <div class="post-item-info">
            <h3>\${escapeHtml(post.title)}</h3>
            <p>\${new Date(post.created_at).toLocaleString('zh-CN')}</p>
          </div>
          <div style="display:flex; gap:10px;">
            <button class="btn btn-small" onclick="editPost('\${post.id}')">编辑</button>
            <button class="btn btn-small" onclick="deletePost('\${post.id}')">删除</button>
          </div>
        </div>
      \`).join('');
    }

    async function savePost() {
      const title = document.getElementById('postTitle').value.trim();
      const content = document.getElementById('postContent').value.trim();
      
      if (!title || !content) {
        showMessage('postMessage', '请填写标题和内容', 'error');
        return;
      }
      
      const data = { title, content };
      if (currentImageUrl) data.imageUrl = currentImageUrl;
      
      const url = editingPostId ? \`/api/posts/\${editingPostId}\` : '/api/posts';
      const method = editingPostId ? 'PUT' : 'POST';
      
      try {
        const response = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        
        if (!response.ok) {
          throw new Error('服务器错误: ' + response.status);
        }
        
        const result = await response.json();
        if (result.success) {
          showMessage('postMessage', editingPostId ? '更新成功' : '发布成功', 'success');
          document.getElementById('postTitle').value = '';
          document.getElementById('postContent').value = '';
          document.getElementById('imagePreview').style.display = 'none';
          document.getElementById('uploadText').style.display = 'block';
          currentImageUrl = '';
          editingPostId = null;
          document.getElementById('publishBtn').textContent = '发布';
          loadPosts();
          loadStats();
        } else {
          showMessage('postMessage', result.error || '保存失败', 'error');
        }
      } catch (err) {
        showMessage('postMessage', '发帖失败: ' + err.message, 'error');
      }
    }

    async function editPost(id) {
      const response = await fetch('/api/posts');
      const posts = await response.json();
      const post = posts.find(p => p.id == id);
      
      if (post) {
        document.getElementById('postTitle').value = post.title;
        document.getElementById('postContent').value = post.content;
        if (post.image_url) {
          document.getElementById('imagePreview').src = post.image_url;
          document.getElementById('imagePreview').style.display = 'block';
          document.getElementById('uploadText').style.display = 'none';
          currentImageUrl = post.image_url;
        } else {
          document.getElementById('imagePreview').style.display = 'none';
          document.getElementById('uploadText').style.display = 'block';
          currentImageUrl = '';
        }
        editingPostId = id;
        document.getElementById('publishBtn').textContent = '更新发布';
        document.querySelector('.content-area').scrollTo(0, 0);
      }
    }

    async function deletePost(id) {
      if (!confirm('确定要删除这篇动态吗？')) return;
      await fetch(\`/api/posts/\${id}\`, { method: 'DELETE' });
      loadPosts();
      loadStats();
    }

    function handleImageUpload(event) {
      const file = event.target.files[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = function(e) {
        document.getElementById('imagePreview').src = e.target.result;
        document.getElementById('imagePreview').style.display = 'block';
        uploadImage(file);
      };
      reader.readAsDataURL(file);
    }

    async function uploadImage(file) {
      const publishBtn = document.getElementById('publishBtn');
      const uploadText = document.getElementById('uploadText');
      const progressContainer = document.getElementById('uploadProgress');
      const progressBar = document.getElementById('uploadProgressBar');
      
      publishBtn.disabled = true;
      publishBtn.textContent = '图片上传中...';
      uploadText.style.display = 'none';
      progressContainer.style.display = 'block';
      progressBar.style.width = '0%';

      try {
        const formData = new FormData();
        formData.append('image', file);
        formData.append('filename', file.name);

        const result = await new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.open('POST', '/api/upload');
          xhr.upload.onprogress = (e) => {
            if (e.lengthComputable) {
              const percent = (e.loaded / e.total) * 100;
              progressBar.style.width = percent + '%';
            }
          };
          xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              try { resolve(JSON.parse(xhr.responseText)); } catch(e) { reject(e); }
            } else {
              reject(new Error('上传失败: ' + xhr.status));
            }
          };
          xhr.onerror = () => reject(new Error('网络错误'));
          xhr.send(formData);
        });

        if (result.success) {
          currentImageUrl = result.url;
          showMessage('postMessage', '图片上传成功！', 'success');
        } else {
          showMessage('postMessage', '图片上传失败: ' + (result.error || '未知错误'), 'error');
        }
      } catch (err) {
        showMessage('postMessage', '图片上传出错: ' + err.message, 'error');
      } finally {
        publishBtn.disabled = false;
        publishBtn.textContent = editingPostId ? '更新发布' : '发布';
        setTimeout(() => { progressContainer.style.display = 'none'; }, 1000);
      }
    }

    async function loadVisits() {
      const response = await fetch('/api/visits');
      const visits = await response.json();
      const tbody = document.getElementById('visitTableBody');
      
      tbody.innerHTML = visits.map(visit => \`
        <tr>
          <td>\${new Date(visit.visit_time).toLocaleString('zh-CN')}</td>
          <td>\${escapeHtml(visit.path)}</td>
          <td>\${escapeHtml(visit.ip || '')}</td>
          <td title="\${escapeHtml(visit.user_agent || '')}">\${escapeHtml((visit.user_agent || '').substring(0, 30))}...</td>
        </tr>
      \`).join('');
    }

    async function loadSettingsData() {
      const response = await fetch('/api/settings');
      const settings = await response.json();
      if (settings.about_content !== undefined) {
        document.getElementById('aboutContentInput').value = settings.about_content;
      }
      if (settings.site_title !== undefined) {
        document.getElementById('siteTitleInput').value = settings.site_title;
      }
      if (settings.site_subtitle !== undefined) {
        document.getElementById('siteSubtitleInput').value = settings.site_subtitle;
      }
    }

    async function saveSettings() {
      const aboutContent = document.getElementById('aboutContentInput').value;
      const siteTitle = document.getElementById('siteTitleInput').value;
      const siteSubtitle = document.getElementById('siteSubtitleInput').value;
      const data = { 
        about_content: aboutContent,
        site_title: siteTitle,
        site_subtitle: siteSubtitle
      };
      
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      if (response.ok) {
        showMessage('settingsMessage', '设置保存成功！', 'success');
      } else {
        showMessage('settingsMessage', '保存失败，请重试。', 'error');
      }
    }

    function showMessage(elementId, message, type) {
      const el = document.getElementById(elementId);
      el.textContent = message;
      el.className = 'message ' + type;
      setTimeout(() => { el.className = 'message'; }, 3000);
    }

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
</html>`;

  return new Response(html, {
    headers: { 'Content-Type': 'text/html;charset=UTF-8', 'Cache-Control': 'no-cache, no-store, must-revalidate' },
  });
}

