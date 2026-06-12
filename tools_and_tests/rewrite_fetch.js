const fs = require('fs');
let code = fs.readFileSync('worker.js', 'utf8');

const target = `    // 路由分发
    if (pathname === '/fa3096d3eb868b79b5b609c444b7eb87.txt') {
      return new Response('3ab27992c00617154b3dd5261493be1cdc41a962', { headers: { 'Content-Type': 'text/plain' } });
    }
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

    return new Response('Not Found', { status: 404 });`;

const replacement = `    // 全局路由拦截与错误处理
    try {
      if (pathname === '/fa3096d3eb868b79b5b609c444b7eb87.txt') {
        return new Response('3ab27992c00617154b3dd5261493be1cdc41a962', { headers: { 'Content-Type': 'text/plain' } });
      }
      if (pathname === '/' || pathname === '') {
        return await serveHomepage(request, env);
      }
      if (pathname === '/admin') {
        return await serveAdminPanel(request, env);
      }
      if (pathname === '/login' && request.method === 'GET') {
        return Response.redirect(new URL('/admin', request.url).toString(), 302);
      }
      if (pathname === '/logout') {
        return logout();
      }

      // API 路由
      if (pathname.startsWith('/api/')) {
        return await handleApi(request, env, pathname);
      }

      return new Response('Not Found', { status: 404 });
    } catch (error) {
      try {
        await env.DB.prepare(
          'INSERT INTO logs (level, message, stack) VALUES (?, ?, ?)'
        ).bind('ERROR', error.message || 'Unknown Error', error.stack || '').run();
      } catch (logErr) {
        console.error('Failed to write log', logErr);
      }
      return new Response(
        'Server Error: ' + (error.message || 'Unknown Error') + '\\n' + (error.stack || ''), 
        { status: 500, headers: { 'Content-Type': 'text/plain' } }
      );
    }`;

code = code.replace(target, replacement);
fs.writeFileSync('worker.js', code);
