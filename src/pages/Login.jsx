import React, { useState } from 'react'

export default function Login({onLogin}) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isRegister, setIsRegister] = useState(false)
  const [message, setMessage] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage(null)

    const endpoint = 'https://debt-planner.onrender.com/api'+(isRegister ? '/auth/register' : '/auth/login')

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.error || 'เกิดข้อผิดพลาด')

      setMessage(data.message)

      if (!isRegister) {
        // ถ้า login สำเร็จ → redirect หรือบันทึก token ได้
        console.log('✅ Logged in user:', data.user)
        onLogin(data.user);
      }
    } catch (err) {
      setMessage('❌ ' + err.message)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md space-y-6">
        <h2 className="text-2xl font-bold text-center text-blue-600">
          {isRegister ? '📝 สมัครสมาชิก' : '🔐 เข้าสู่ระบบ'}
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="อีเมล"
            className="w-full px-4 py-2 rounded-md border border-gray-300"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="รหัสผ่าน"
            className="w-full px-4 py-2 rounded-md border border-gray-300"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700"
          >
            {isRegister ? 'สมัครสมาชิก' : 'เข้าสู่ระบบ'}
          </button>
        </form>

        {message && (
          <div className="text-center text-sm text-red-600">{message}</div>
        )}

        <div className="text-center text-sm text-gray-600">
          {isRegister ? 'มีบัญชีอยู่แล้ว? ' : 'ยังไม่มีบัญชี? '}
          <button
            className="text-blue-600 hover:underline"
            onClick={() => setIsRegister(!isRegister)}
          >
            {isRegister ? 'เข้าสู่ระบบ' : 'สมัครสมาชิก'}
          </button>
        </div>
      </div>
    </div>
  )
}
