import { serve } from 'bun'
import authHandler from './api/auth.js'
import userDataHandler from './api/user-data.js'

console.log('🚀 Starting server...')

serve({
  fetch(req) {
    const url = new URL(req.url)
    console.log(`[${req.method}] ${url.pathname}`)

    if (url.pathname.startsWith('/api/auth')) {
      console.log('➡️ Routing to authHandler')
      return authHandler(req)
    }

    if (url.pathname.startsWith('/api/user-data')) {
      return userDataHandler(req)
    }

    console.warn('❌ Route not found:', url.pathname)
    return new Response('Not found', { status: 404 })
  },
  port: 3000,
})

console.log('✅ Server is running at: http://localhost:3000')
