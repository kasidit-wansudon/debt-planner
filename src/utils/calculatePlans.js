// ฟังก์ชันรวมเพื่อคำนวณแผนการชำระหนี้ทั้งหมด

export function calculatePlanSummary(debts, planType, monthlyBudget) {
  const debtCount = debts.length
  const totalDebt = debts.reduce((sum, d) => sum + d.amount, 0)
  const totalMinPayment = debts.reduce((sum, d) => sum + d.minPayment, 0)

  const { totalInterest, monthsToPayOff } = simulateSchedule(debts, planType, monthlyBudget)

  const { totalInterest: minInterest, monthsToPayOff: minMonths } =
    simulateSchedule(debts, 'minimum', monthlyBudget)

  const savedInterest = Math.max(minInterest - totalInterest, 0)
  const fasterMonths = Math.max(minMonths - monthsToPayOff, 0)

  const highestInterestDebt = debts.reduce((max, d) => (d.interestRate > (max?.interestRate || 0) ? d : max), null)
  const largestDebt = debts.reduce((max, d) => (d.amount > (max?.amount || 0) ? d : max), null)
  const averageInterest = debts.length
    ? debts.reduce((sum, d) => sum + d.interestRate, 0) / debts.length
    : 0

  return {
    debtCount,
    totalDebt,
    totalMinPayment,
    totalInterest,
    monthsToPayOff,
    savedInterest,
    fasterMonths,
    highestInterestDebt,
    largestDebt,
    averageInterest,
  }
}

export function getMonthlySchedule(debts, planType, monthlyBudget) {
  const { schedule } = simulateSchedule(debts, planType, monthlyBudget)
  return schedule
}

export function getChartData(debts, planType, monthlyBudget) {
  const schedule = getMonthlySchedule(debts, planType, monthlyBudget)

  // 1. Pie Chart by Type
  const typeMap = {}
  debts.forEach((d) => {
    typeMap[d.type] = (typeMap[d.type] || 0) + d.amount
  })
  const pieData = {
    tooltip: { trigger: 'item' },
    series: [
      {
        type: 'pie',
        radius: '60%',
        data: Object.entries(typeMap).map(([type, value]) => ({
          name: type,
          value,
        })),
      },
    ],
  }

  // 2. Line Chart: total debt
  const lineData = {
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: schedule.map((_, i) => `เดือน ${i + 1}`) },
    yAxis: { type: 'value' },
    series: [
      {
        name: 'ยอดหนี้รวม',
        type: 'line',
        data: schedule.map((s) => s.remaining),
        smooth: true,
      },
    ],
  }

  // 3. Stacked Area Chart
  const stackedData = {
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: schedule.map((_, i) => `เดือน ${i + 1}`) },
    yAxis: { type: 'value' },
    series: [
      {
        name: 'ดอกเบี้ย',
        type: 'line',
        stack: 'Total',
        areaStyle: {},
        data: schedule.map((s) => s.interest),
      },
      {
        name: 'เงินต้น',
        type: 'line',
        stack: 'Total',
        areaStyle: {},
        data: schedule.map((s) => s.principal),
      },
    ],
  }

  return { pieData, lineData, stackedData }
}

// Core: จำลองตารางจ่ายหนี้ตามแผน
function simulateSchedule(debts, planType, monthlyBudget) {
  const cloneDebts = debts.map((d) => ({ ...d }))
  const schedule = []

  const totalMinPayment = cloneDebts.reduce((sum, d) => sum + d.minPayment, 0)
  const monthlyPay = planType === 'accelerated'
    ? Math.max(monthlyBudget, totalMinPayment)
    : totalMinPayment

  let totalInterest = 0
  let month = 0

  while (cloneDebts.some((d) => d.amount > 0) && month < 600) {
    month++
    let monthInterest = 0
    let monthPrincipal = 0

    // คำนวณดอกเบี้ยของแต่ละหนี้
    cloneDebts.forEach((d) => {
      if (d.amount <= 0) return
      d.monthlyInterest = d.amount * (d.interestRate / 100 / 12)
    })

    // เรียงลำดับตาม snowball/avalanche (ตามที่ผู้ใช้เรียงไว้แล้ว)
    const sortedDebts = cloneDebts.slice().sort((a, b) => debts.findIndex(d => d.id === a.id) - debts.findIndex(d => d.id === b.id))

    let remainingBudget = monthlyPay

    // จ่ายขั้นต่ำก่อน
    sortedDebts.forEach((d) => {
      if (d.amount <= 0) return
      const pay = Math.min(d.minPayment, d.amount + d.monthlyInterest)
      d.paymentThisRound = pay
      remainingBudget -= pay
    })

    // โปะหนี้ก้อนบนสุด (ตามลำดับ)
    for (let d of sortedDebts) {
      if (remainingBudget <= 0 || d.amount <= 0) continue
      const extra = Math.min(remainingBudget, d.amount)
      d.paymentThisRound += extra
      remainingBudget -= extra
    }

    // จ่ายหนี้และเก็บข้อมูล
    let totalRemaining = 0
    sortedDebts.forEach((d) => {
      if (d.amount <= 0) return
      const interest = d.monthlyInterest
      const principal = Math.max(d.paymentThisRound - interest, 0)
      d.amount = Math.max(d.amount - principal, 0)

      monthInterest += interest
      monthPrincipal += principal
      totalRemaining += d.amount
    })

    schedule.push({
      totalPayment: monthlyPay,
      interest: Math.round(monthInterest),
      principal: Math.round(monthPrincipal),
      remaining: Math.round(totalRemaining),
    })

    totalInterest += monthInterest
  }

  return {
    schedule,
    totalInterest: Math.round(totalInterest),
    monthsToPayOff: month,
  }
}
