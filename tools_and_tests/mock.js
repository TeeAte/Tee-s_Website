const fs = require('fs');
const code = fs.readFileSync('worker.js', 'utf8');
const moduleCode = code.replace('export default {', 'const worker = {');
eval(moduleCode + `
async function test() {
  const env = {
    DB: {
      prepare: (sql) => ({
        all: async () => ({ results: [] }),
        first: async () => 0,
        run: async () => {}
      })
    }
  };
  const req = new Request('http://localhost/admin');
  try {
    const res = await serveAdminPanel(req, env);
    console.log(res.status);
  } catch(e) {
    console.error(e);
  }
}
test();
`);
