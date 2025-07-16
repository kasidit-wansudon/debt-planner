import React, { useState, useEffect } from 'react'

const typeOptions = [
  'บัตรเครดิต',
  'สินเชื่อส่วนบุคคล',
  'สินเชื่อบ้าน',
  'สินเชื่อรถยนต์',
  'สินเชื่อเพื่อการศึกษา',
  'หนี้นอกระบบ',
  'อื่นๆ',
]

export default function DebtFormModal({ closeModal, saveDebt, editDebt }) {
  const [form, setForm] = useState({
    name: '',
    amount: '',
    interestRate: '',
    minPayment: '',
    type: 'บัตรเครดิต',
  })

  useEffect(() => {
    if (editDebt) setForm(editDebt)
  }, [editDebt])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const validated = {
      ...form,
      amount: parseFloat(form.amount),
      interestRate: parseFloat(form.interestRate),
      minPayment: parseFloat(form.minPayment),
    }
    saveDebt(validated)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-lg">
        <h2 className="text-xl font-bold mb-4">
          {editDebt ? '✏️ แก้ไขหนี้' : '➕ เพิ่มหนี้ใหม่'}
        </h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium">ชื่อหนี้</label>
            <input
              type="text"
              name="name"
              className="mt-1 w-full rounded-md border-gray-300 shadow-sm"
              required
              value={form.name}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium">ยอดหนี้ (บาท)</label>
            <input
              type="number"
              name="amount"
              min="0"
              className="mt-1 w-full rounded-md border-gray-300 shadow-sm"
              required
              value={form.amount}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium">อัตราดอกเบี้ยต่อปี (%)</label>
            <input
              type="number"
              name="interestRate"
              min="0"
              step="0.01"
              className="mt-1 w-full rounded-md border-gray-300 shadow-sm"
              required
              value={form.interestRate}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium">ยอดชำระขั้นต่ำต่อเดือน</label>
            <input
              type="number"
              name="minPayment"
              min="0"
              className="mt-1 w-full rounded-md border-gray-300 shadow-sm"
              required
              value={form.minPayment}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium">ประเภทหนี้</label>
            <select
              name="type"
              className="mt-1 w-full rounded-md border-gray-300 shadow-sm"
              value={form.type}
              onChange={handleChange}
            >
              {typeOptions.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              className="px-4 py-2 bg-gray-300 rounded-md"
              onClick={closeModal}
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md"
            >
              {editDebt ? 'บันทึก' : 'เพิ่ม'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
