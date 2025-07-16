import React from 'react'

export default function PlanSwitcher({ planType, setPlanType, monthlyBudget, setMonthlyBudget }) {
  const handlePlanChange = (type) => {
    setPlanType(type)
  }

  const handleBudgetChange = (e) => {
    const value = parseFloat(e.target.value)
    if (!isNaN(value)) setMonthlyBudget(value)
  }

  return (
    <div className="bg-white shadow-md rounded-xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div className="flex gap-2">
        <button
          onClick={() => handlePlanChange('minimum')}
          className={`px-4 py-2 rounded-md border ${
            planType === 'minimum'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          💳 แผนชำระขั้นต่ำ
        </button>
        <button
          onClick={() => handlePlanChange('accelerated')}
          className={`px-4 py-2 rounded-md border ${
            planType === 'accelerated'
              ? 'bg-green-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          ⚡ แผนเร่งรัด
        </button>
      </div>

      {planType === 'accelerated' && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
          <label className="text-sm font-medium">💸 ยอดที่ต้องการจ่ายต่อเดือน:</label>
          <input
            type="number"
            min="0"
            value={monthlyBudget}
            onChange={handleBudgetChange}
            className="w-40 rounded-md border-gray-300 shadow-sm px-3 py-1"
            placeholder="บาท"
          />
        </div>
      )}
    </div>
  )
}
