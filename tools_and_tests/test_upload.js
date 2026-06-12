const fs = require('fs');
const code = fs.readFileSync('worker.js', 'utf8');
const moduleCode = code.replace('export default {', 'const worker = {');
eval(moduleCode + `
async function run() {
  const env = {
    IMAGE_KV: {
      get: async (key, options) => {
        console.log('KV GET:', key, options);
        if (options && options.type === 'arrayBuffer') return new ArrayBuffer(10);
        if (options === 'arrayBuffer') return new ArrayBuffer(20);
        return null;
      }
    }
  };
  const req2 = new Request('http://localhost/api/images/uploads/123.gif');
  const res2 = await handleApi(req2, env, '/api/images/uploads/123.gif');
  console.log('GET RES:', res2.status, [...res2.headers.entries()]);
}
run();
`);
