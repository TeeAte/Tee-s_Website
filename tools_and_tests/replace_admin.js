const fs = require('fs');

const workerFile = '/Users/teeate/Desktop/CloudFare/worker.js';
const newAdminFile = '/Users/teeate/Desktop/CloudFare/new_admin.txt';

const content = fs.readFileSync(workerFile, 'utf-8');
const newAdminContent = fs.readFileSync(newAdminFile, 'utf-8');

// Use a regex that matches from `async function serveAdminPanel` to the end of the file.
// Since `serveAdminPanel` is the last function in the file, this is safe.
const regex = /async function serveAdminPanel\(request, env\) \{[\s\S]*\}\s*$/;

if (regex.test(content)) {
    const replaced = content.replace(regex, newAdminContent + '\n');
    fs.writeFileSync(workerFile, replaced);
    console.log("Successfully replaced serveAdminPanel!");
} else {
    console.log("Could not find serveAdminPanel block.");
}
