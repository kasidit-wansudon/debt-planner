import db from '../db.js'

export default async function authHandler(req) {
  const url = new URL(req.url)

  // 🟢 REGISTER
  if (req.method === 'POST' && url.pathname === '/api/auth/register') {
    try {
      const body = await req.json()
      const { email, password } = body

      if (!email || !password) {
        return Response.json({ error: 'Missing email or password' }, { status: 400 })
      }

      // ❗ เช็คซ้ำ
      const exists = db
        .query('SELECT * FROM users WHERE email = ?')
        .get(email)

      if (exists) {
        return Response.json({ error: 'Email already registered' }, { status: 400 })
      }

      db.prepare('INSERT INTO users (email, password) VALUES (?, ?)').run(email, password)

      return Response.json({ message: '✅ Register success!' })
    } catch (e) {
      console.error('❌ Register error:', e)
      return Response.json({ error: 'Register failed' }, { status: 500 })
    }
  }

  // 🟡 LOGIN
  if (req.method === 'POST' && url.pathname === '/api/auth/login') {
    try {
      const body = await req.json()
      const { email, password } = body

      const user = db
        .query('SELECT * FROM users WHERE email = ? AND password = ?')
        .get(email, password)

      if (!user) {
        return Response.json({ error: 'Invalid credentials' }, { status: 401 })
      }

      return Response.json({ message: '✅ Login success!', user })
    } catch (e) {
      return Response.json({ error: 'Login failed' }, { status: 500 })
    }
  }

  return new Response('Not found', { status: 404 })
}
