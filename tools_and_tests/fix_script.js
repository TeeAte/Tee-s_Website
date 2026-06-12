const fs = require('fs');

const workerFile = '/Users/teeate/Desktop/CloudFare/worker.js';
let content = fs.readFileSync(workerFile, 'utf-8');

// Add Cache-Control to serveHomepage
content = content.replace(
  /headers: \{ 'Content-Type': 'text\/html;charset=UTF-8' \}/g,
  "headers: { 'Content-Type': 'text/html;charset=UTF-8', 'Cache-Control': 'no-cache, no-store, must-revalidate' }"
);

fs.writeFileSync(workerFile, content);
console.log("Updated Cache-Control headers");
