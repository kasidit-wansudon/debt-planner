import React from 'react'
import { getMonthlySchedule } from '../utils/calculatePlans'

export default function TimelineTable({ debts, planType, monthlyBudget }) {
  const schedule = getMonthlySchedule(debts, planType, monthlyBudget)

  if (!schedule.length) {
    return (
      <div className="bg-yellow-100 text-yellow-700 p-4 rounded-xl mt-4">
        ไม่มีข้อมูลการชำระหนี้ กรุณากรอกหนี้และยอดชำระรายเดือน
      </div>
    )
  }

  const hasWarning = schedule.some(item => item.totalPayment < item.interest)

  return (
    <div className="overflow-x-auto mt-6">
      <table className="min-w-full border text-sm bg-white rounded-xl shadow">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="py-2 px-4">เดือนที่</th>
            <th className="py-2 px-4">ยอดชำระรวม</th>
            <th className="py-2 px-4">ดอกเบี้ย</th>
            <th className="py-2 px-4">เงินต้น</th>
            <th className="py-2 px-4">ยอดหนี้คงเหลือ</th>
          </tr>
        </thead>
        <tbody>
          {schedule.map((item, idx) => (
            <tr key={idx} className="border-t">
              <td className="py-2 px-4">{idx + 1}</td>
              <td className="py-2 px-4">{item.totalPayment.toLocaleString()} บาท</td>
              <td className="py-2 px-4 text-red-500">{item.interest.toLocaleString()} บาท</td>
              <td className="py-2 px-4">{item.principal.toLocaleString()} บาท</td>
              <td className="py-2 px-4">{item.remaining.toLocaleString()} บาท</td>
            </tr>
          ))}
        </tbody>
      </table>

      {hasWarning && (
        <div className="text-red-600 mt-3 text-sm font-medium">
          ⚠️ ยอดชำระปัจจุบันไม่เพียงพอในการชำระดอกเบี้ย หนี้จะไม่หมด!
        </div>
      )}
    </div>
  )
}
