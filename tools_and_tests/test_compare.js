const fs = require('fs');
const code = fs.readFileSync('worker.js', 'utf8');

const adminCode = code.substring(code.indexOf('async function serveAdminPanel'), code.indexOf('async function handleApi'));
const homeCode = code.substring(code.indexOf('async function serveHomepage'), code.indexOf('async function serveAdminPanel'));

// write to files to inspect
fs.writeFileSync('admin.js', adminCode);
fs.writeFileSync('home.js', homeCode);
