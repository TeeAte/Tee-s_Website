import { serveHomepage } from './frontend.js';
import { serveAdminPanel } from './admin.js';
import { isAuthenticated, setCookie } from './utils.js';
import { handlePetRequest } from './pet_backend.js';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const pathname = url.pathname;
    
    // Log visit asynchronously
    if (!pathname.startsWith('/api/') && pathname !== '/admin') {
      const ip = request.headers.get('cf-connecting-ip') || 'unknown';
      const userAgent = request.headers.get('user-agent') || 'unknown';
      const referer = request.headers.get('referer') || '';
      
      ctx.waitUntil(
        env.DB.prepare(
          'INSERT INTO visits (path, ip, user_agent, referer) VALUES (?, ?, ?, ?)'
        ).bind(pathname, ip, userAgent, referer).run().catch(e => console.error("Log error", e))
      );
    }

    if (pathname.startsWith('/api/')) {
      try {
        return await handleApi(request, env, pathname);
      } catch (error) {
        ctx.waitUntil(
          env.DB.prepare(
            'INSERT INTO logs (level, message, source) VALUES (?, ?, ?)'
          ).bind('error', String(error.stack || error.message).substring(0, 500), 'api').run().catch(() => {})
        );
        return new Response(JSON.stringify({ success: false, error: 'Internal Server Error' }), { status: 500 });
      }
    }

    if (pathname === '/admin') {
      return await serveAdminPanel(request, env);
    }

    if (pathname === '/') {
      return await serveHomepage(request, env);
    }

    return new Response('Not Found', { status: 404 });
  }
};

async function handleApi(request, env, pathname) {
  const method = request.method;

  // Pet API
  if (pathname.startsWith('/api/pet')) {
    return handlePetRequest(new URL(request.url), request, env);
  }

  // GET /api/guestbook
  if (pathname === '/api/guestbook' && method === 'GET') {
    if (!isAuthenticated(request)) return new Response('Unauthorized', { status: 401 });
    const result = await env.DB.prepare('SELECT * FROM guestbook ORDER BY created_at DESC').all();
    return new Response(JSON.stringify(result.results || []), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // POST /api/guestbook
  if (pathname === '/api/guestbook' && method === 'POST') {
    const { author, message, x, y, color } = await request.json();
    if (!author || !message) return new Response(JSON.stringify({ success: false, message: '昵称和留言不能为空' }), { status: 400 });
    const posX = x !== undefined ? parseInt(x) : -1;
    const posY = y !== undefined ? parseInt(y) : -1;
    const clr = color || 'yellow';
    await env.DB.prepare('INSERT INTO guestbook (author, message, x, y, color) VALUES (?, ?, ?, ?, ?)').bind(author, message, posX, posY, clr).run();
    return new Response(JSON.stringify({ success: true }));
  }

  // PATCH /api/guestbook/:id/position
  if (pathname.match(/^\/api\/guestbook\/\d+\/position$/) && method === 'PATCH') {
    const id = pathname.split('/')[3];
    const { x, y } = await request.json();
    await env.DB.prepare('UPDATE guestbook SET x = ?, y = ? WHERE id = ?').bind(parseInt(x), parseInt(y), id).run();
    return new Response(JSON.stringify({ success: true }));
  }

  // DELETE /api/guestbook/:id
  if (pathname.startsWith('/api/guestbook/') && method === 'DELETE') {
    if (!isAuthenticated(request)) return new Response('Unauthorized', { status: 401 });
    const id = pathname.split('/').pop();
    await env.DB.prepare('DELETE FROM guestbook WHERE id = ?').bind(id).run();
    return new Response(JSON.stringify({ success: true }));
  }

  // PUT /api/guestbook/:id
  if (pathname.startsWith('/api/guestbook/') && method === 'PUT') {
    if (!isAuthenticated(request)) return new Response('Unauthorized', { status: 401 });
    const id = pathname.split('/').pop();
    const { message } = await request.json();
    await env.DB.prepare('UPDATE guestbook SET message = ? WHERE id = ?').bind(message, id).run();
    return new Response(JSON.stringify({ success: true }));
  }

  // POST /api/login
  if (pathname === '/api/login' && method === 'POST') {
    const { password } = await request.json();
    const settingsResult = await env.DB.prepare("SELECT value FROM settings WHERE key = 'admin_password'").first();
    const validPassword = (settingsResult && settingsResult.value) ? settingsResult.value : 'admin123';
    if (password === validPassword) {
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
    const image = await env.IMAGE_KV.get(imageName, { type: 'arrayBuffer' });
    
    if (!image) {
      return new Response('Image not found', { status: 404 });
    }
    
    const ext = imageName.split('.').pop().toLowerCase();
    const contentTypes = {
      'png': 'image/png',
      'gif': 'image/gif',
      'webp': 'image/webp',
      'svg': 'image/svg+xml',
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg'
    };
    
    return new Response(image, {
      headers: {
        'Content-Type': contentTypes[ext] || 'image/jpeg',
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
    const uniqueIPs = await env.DB.prepare('SELECT COUNT(DISTINCT ip) as count FROM visits').first();
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
      uniqueIPs: uniqueIPs.count || 0,
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

  // GET /api/images - 列表 KV 图片
  if (pathname === '/api/images' && method === 'GET') {
    const kvList = await env.IMAGE_KV.list();
    const postsWithImages = await env.DB.prepare('SELECT image_url FROM posts WHERE image_url IS NOT NULL').all();
    const aboutImageSetting = await env.DB.prepare('SELECT value FROM settings WHERE key = ?').bind('about_image_url').first();
    const usedUrls = new Set(postsWithImages.results.map(r => r.image_url));
    if (aboutImageSetting && aboutImageSetting.value) {
      usedUrls.add(aboutImageSetting.value);
    }

    const images = kvList.keys.map(k => {
      const url = `/api/images/${k.name}`;
      return {
        name: k.name,
        url: url,
        used: usedUrls.has(url)
      };
    });

    return new Response(JSON.stringify(images), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // DELETE /api/images/:name - 删除图片
  if (pathname.startsWith('/api/images/') && method === 'DELETE') {
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
