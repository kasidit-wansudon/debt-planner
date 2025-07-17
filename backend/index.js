import { serve } from 'bun'
import authHandler from './api/auth.js'
import userDataHandler from './api/user-data.js'

console.log('🚀 Starting server...')

function withCORS(response) {
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type");
  return response;
}

serve({
  async fetch(req) {
    const url = new URL(req.url)
    console.log(`[${req.method}] ${url.pathname}`)

    if (req.method === "OPTIONS") {
      return withCORS(new Response(null, { status: 204 }));
    }

    if (url.pathname.startsWith('/api/auth')) {
      const res = await authHandler(req);
      return withCORS(res);
    }

    if (url.pathname.startsWith('/api/user-data')) {
      const res = await userDataHandler(req);
      return withCORS(res);
    }

    console.warn('❌ Route not found:', url.pathname)
    return new Response('Not found', { status: 404 })
  },
  port: 3000,
})

console.log('✅ Server is running at: http://localhost:3000')
