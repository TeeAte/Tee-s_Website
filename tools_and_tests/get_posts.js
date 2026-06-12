const fs = require('fs');
const code = fs.readFileSync('worker.js', 'utf8');
const moduleCode = code.replace('export default {', 'const worker = {');
eval(moduleCode + `
  console.log(worker.fetch.toString());
`);
