import React from 'react'
import ReactECharts from 'echarts-for-react'
import { getChartData } from '../utils/calculatePlans'

export default function EChartsSection({ debts, planType, monthlyBudget }) {
  const { pieData, lineData, stackedData } = getChartData(debts, planType, monthlyBudget)

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <ChartCard title="🔍 สัดส่วนหนี้ตามประเภท">
        <ReactECharts option={pieData} style={{ height: 300 }} />
      </ChartCard>

      <ChartCard title="📉 แนวโน้มหนี้รวมรายเดือน">
        <ReactECharts option={lineData} style={{ height: 300 }} />
      </ChartCard>

      <ChartCard title="💥 เงินต้น VS ดอกเบี้ย (ต่อเดือน)" className="md:col-span-2">
        <ReactECharts option={stackedData} style={{ height: 400 }} />
      </ChartCard>
    </div>
  )
}

function ChartCard({ title, children, className }) {
  return (
    <div className={`bg-white shadow-md rounded-xl p-4 ${className || ''}`}>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      {children}
    </div>
  )
}
