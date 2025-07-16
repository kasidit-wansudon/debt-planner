import React from 'react'
import { calculatePlanSummary } from '../utils/calculatePlans'

export default function SummaryCards({ debts, planType, monthlyBudget }) {
  const {
    totalDebt,
    totalMinPayment,
    totalInterest,
    monthsToPayOff,
    savedInterest,
    fasterMonths,
    highestInterestDebt,
    largestDebt,
    averageInterest,
    debtCount,
  } = calculatePlanSummary(debts, planType, monthlyBudget)

  const years = Math.floor(monthsToPayOff / 12)
  const months = monthsToPayOff % 12

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card label="💸 ยอดหนี้รวม" value={`${totalDebt.toLocaleString()} บาท`} />
      <Card label="📋 จำนวนหนี้ทั้งหมด" value={`${debtCount} รายการ`} />
      <Card label="📆 ชำระขั้นต่ำรวม/เดือน" value={`${totalMinPayment.toLocaleString()} บาท`} />
      <Card label="⏱️ เวลาปลดหนี้" value={`${years} ปี ${months} เดือน`} />
      <Card label="💰 ดอกเบี้ยรวม" value={`${totalInterest.toLocaleString()} บาท`} />
      {planType === 'accelerated' && (
        <>
          <Card
            label="🎯 ประหยัดดอกเบี้ยได้"
            value={`${savedInterest.toLocaleString()} บาท`}
          />
          <Card
            label="🚀 ปลดหนี้เร็วขึ้น"
            value={`${Math.floor(fasterMonths / 12)} ปี ${fasterMonths % 12} เดือน`}
          />
        </>
      )}
      <Card
        label="📊 อัตราดอกเบี้ยเฉลี่ย"
        value={`${averageInterest.toFixed(2)}%`}
      />
      <Card
        label="🔥 หนี้ดอกเบี้ยสูงสุด"
        value={`${highestInterestDebt?.name ?? '-'} (${highestInterestDebt?.interestRate ?? 0}%)`}
      />
      <Card
        label="🏦 หนี้ก้อนใหญ่ที่สุด"
        value={`${largestDebt?.name ?? '-'} (${largestDebt?.amount?.toLocaleString() ?? 0} บาท)`}
      />
    </div>
  )
}

function Card({ label, value }) {
  return (
    <div className="bg-white shadow rounded-xl p-4">
      <div className="text-sm text-gray-500">{label}</div>
      <div className="text-lg font-bold mt-1">{value}</div>
    </div>
  )
}
