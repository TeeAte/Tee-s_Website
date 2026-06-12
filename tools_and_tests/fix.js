const fs = require('fs');
let content = fs.readFileSync('worker.js.bak', 'utf8');
content = content.replace(/\\\`/g, '`');
content = content.replace(/\\\$\{/g, '${');
fs.writeFileSync('worker.js', content);
