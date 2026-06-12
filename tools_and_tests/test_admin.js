const fs = require('fs');
let code = fs.readFileSync('worker.js', 'utf8');

code = code.replace(
  "return serveAdminPanel(request, env);",
  `try { return await serveAdminPanel(request, env); } catch (e) { return new Response(e.stack || e.message, { status: 500 }); }`
);

fs.writeFileSync('worker.js', code);
