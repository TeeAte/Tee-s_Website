const fs = require('fs');

const file = 'worker.js';
let content = fs.readFileSync(file, 'utf8');

// 1. Add guestbook table
if (!content.includes('CREATE TABLE IF NOT EXISTS guestbook')) {
  content = content.replace(
    /CREATE TABLE IF NOT EXISTS logs[\s\S]*?\)\n\s*`\)\.run\(\);/,
    `$&

    await env.DB.prepare(\`
      CREATE TABLE IF NOT EXISTS guestbook (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        author TEXT NOT NULL,
        message TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    \`).run();`
  );
}

// 2. Add API endpoints
if (!content.includes('POST /api/guestbook')) {
  content = content.replace(
    /\/\/ ============================================================\n\/\/ API 路由处理\n\/\/ ============================================================\nasync function handleApi\(request, env, pathname\) {\n  const method = request.method;/,
    `$&

  // POST /api/guestbook
  if (pathname === '/api/guestbook' && method === 'POST') {
    const { author, message } = await request.json();
    if (!author || !message) return new Response(JSON.stringify({ success: false, message: '昵称和留言不能为空' }), { status: 400 });
    await env.DB.prepare('INSERT INTO guestbook (author, message) VALUES (?, ?)').bind(author, message).run();
    return new Response(JSON.stringify({ success: true }));
  }

  // DELETE /api/guestbook/:id
  if (pathname.startsWith('/api/guestbook/') && method === 'DELETE') {
    if (!isAuthenticated(request)) return new Response('Unauthorized', { status: 401 });
    const id = pathname.split('/').pop();
    await env.DB.prepare('DELETE FROM guestbook WHERE id = ?').bind(id).run();
    return new Response(JSON.stringify({ success: true }));
  }`
  );
}

fs.writeFileSync(file, content);
console.log("Updated DB and APIs");
