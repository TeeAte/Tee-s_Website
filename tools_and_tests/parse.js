const fs = require('fs');
const acorn = require('acorn');
try {
  acorn.parse(fs.readFileSync('worker.js', 'utf8'), {ecmaVersion: 2022, sourceType: 'module'});
  console.log("No syntax error found.");
} catch (e) {
  console.error("Syntax Error:", e);
}
