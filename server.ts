 import app from './src/app'
 Bun.serve({
  port: 3000,
  fetch: app.fetch,
});