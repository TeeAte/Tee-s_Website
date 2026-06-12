const fs = require('fs');
let code = fs.readFileSync('worker.js', 'utf8');
let scriptStart = code.indexOf('<script>');
let scriptEnd = code.indexOf('</script>', scriptStart);
let scriptCode = code.substring(scriptStart + 8, scriptEnd);
// Replace literal \` with ` and \${ with ${ to simulate what the browser sees
scriptCode = scriptCode.replace(/\\\`/g, '`').replace(/\\\$\{/g, '${');
fs.writeFileSync('frontend.js', scriptCode);
