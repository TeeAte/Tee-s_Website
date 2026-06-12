import worker from './worker.js';

const mockEnv = {
  DB: {
    prepare: (query) => {
      return {
        bind: (...args) => {
          return {
            run: async () => ({ meta: { last_row_id: 42 } })
          };
        },
        run: async () => ({}),
        first: async () => ({ count: 0 }),
        all: async () => ({ results: [] })
      };
    }
  }
};

const mockRequest = new Request('http://localhost/api/posts', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'cookie': 'admin_token=secret-admin-token'
  },
  body: JSON.stringify({ title: 'Test Title', content: 'Test Content' })
});

async function run() {
  try {
    const res = await worker.fetch(mockRequest, mockEnv, {});
    console.log('Status:', res.status);
    const text = await res.text();
    console.log('Body:', text);
  } catch (err) {
    console.error('Error:', err);
  }
}

run();
