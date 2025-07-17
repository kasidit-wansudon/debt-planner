import db from '../db.js'

export default async function userDataHandler(req) {
  const url = new URL(req.url)

  // 👉 POST: Save or update user data
  if (req.method === 'POST' && url.pathname === '/api/user-data') {
    try {
      const { user_id, debts, monthly_budget } = await req.json()

      const exists = db.query('SELECT id FROM user_data WHERE user_id = ?').get(user_id)

      if (exists) {
        db.prepare(`
          UPDATE user_data
          SET debts = ?, monthly_budget = ?, updated_at = CURRENT_TIMESTAMP
          WHERE user_id = ?
        `).run(JSON.stringify(debts), monthly_budget, user_id)
      } else {
        db.prepare(`
          INSERT INTO user_data (user_id, debts, monthly_budget)
          VALUES (?, ?, ?)
        `).run(user_id, JSON.stringify(debts), monthly_budget)
      }

      return Response.json({ message: '✅ Saved user data successfully!' })
    } catch (e) {
      console.error('❌ Save error:', e)
      return Response.json({ error: 'Failed to save user data' }, { status: 500 })
    }
  }

  // 👉 GET: Load user data
  if (req.method === 'GET' && url.pathname.startsWith('/api/user-data')) {
    const user_id = url.searchParams.get('user_id')
    const data = db
      .query('SELECT debts, monthly_budget FROM user_data WHERE user_id = ?')
      .get(user_id)

    if (!data) {
      return Response.json({ error: 'Not found' }, { status: 404 })
    }

    return Response.json({
      ...data,
      debts: JSON.parse(data.debts || '[]'),
    })
  }

  return new Response('Not found', { status: 404 })
}
