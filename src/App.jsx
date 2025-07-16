// App.jsx
import React, { useState, useEffect } from 'react'
import DebtList from './components/DebtList'
import DebtFormModal from './components/DebtFormModal'
import PlanSwitcher from './components/PlanSwitcher'
import SummaryCards from './components/SummaryCards'
import EChartsSection from './components/EChartsSection'
import TimelineTable from './components/TimelineTable'
import TipsSection from './components/TipsSection'
import './index.css'

function App() {
  const [debts, setDebts] = useState([])
  const [planType, setPlanType] = useState('minimum')
  const [monthlyBudget, setMonthlyBudget] = useState(0)
  const [modalOpen, setModalOpen] = useState(false)
  const [editDebt, setEditDebt] = useState(null)

  useEffect(() => {
    const savedDebts = JSON.parse(localStorage.getItem('debts')) || []
    const savedBudget = JSON.parse(localStorage.getItem('monthlyBudget')) || 0
    setDebts(savedDebts)
    setMonthlyBudget(savedBudget)
  }, [])

  useEffect(() => {
    localStorage.setItem('debts', JSON.stringify(debts))
    localStorage.setItem('monthlyBudget', JSON.stringify(monthlyBudget))
  }, [debts, monthlyBudget])

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 px-4 py-6 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">📊 วางแผนปลดหนี้อัจฉริยะ</h1>

        <PlanSwitcher
          planType={planType}
          setPlanType={setPlanType}
          monthlyBudget={monthlyBudget}
          setMonthlyBudget={setMonthlyBudget}
        />

        <div className="mt-6">
          <SummaryCards debts={debts} planType={planType} monthlyBudget={monthlyBudget} />
        </div>

        <div className="mt-8">
          <DebtList debts={debts} setDebts={setDebts} onEdit={setEditDebt} />
          <div className="mt-4 text-right">
            <button
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-xl shadow"
              onClick={() => setModalOpen(true)}
            >
              ➕ เพิ่มหนี้ใหม่
            </button>
          </div>
        </div>

        <div className="mt-10">
          <EChartsSection debts={debts} planType={planType} monthlyBudget={monthlyBudget} />
        </div>

        <div className="mt-10">
          <TimelineTable debts={debts} planType={planType} monthlyBudget={monthlyBudget} />
        </div>

        <div className="mt-10">
          <TipsSection />
        </div>
      </div>

      {modalOpen && (
        <DebtFormModal
          closeModal={() => {
            setModalOpen(false)
            setEditDebt(null)
          }}
          saveDebt={(debt) => {
            setDebts((prev) => {
              const newList = editDebt
                ? prev.map((d) => (d.id === debt.id ? debt : d))
                : [...prev, { ...debt, id: Date.now() }]
              return newList
            })
            setModalOpen(false)
            setEditDebt(null)
          }}
          editDebt={editDebt}
        />
      )}
    </div>
  )
}

export default App
