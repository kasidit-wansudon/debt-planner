// App.jsx
import React, { useState, useEffect } from "react";
import DebtList from "./components/DebtList";
import DebtFormModal from "./components/DebtFormModal";
import PlanSwitcher from "./components/PlanSwitcher";
import SummaryCards from "./components/SummaryCards";
import EChartsSection from "./components/EChartsSection";
import TimelineTable from "./components/TimelineTable";
import TipsSection from "./components/TipsSection";
import Login from "./pages/Login";
import "./index.css";

function App() {
  const [user, setUser] = useState(null);
  const [debts, setDebts] = useState([]);
  const [planType, setPlanType] = useState("minimum");
  const [monthlyBudget, setMonthlyBudget] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [editDebt, setEditDebt] = useState(null);
  const [modalDeleteId, setModalDeleteId] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  useEffect(() => {
    if (!user) return;
    fetch(`/api/user-data?user_id=${user.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.debts) setDebts(data.debts);
        if (data.monthly_budget !== undefined)
          setMonthlyBudget(data.monthly_budget);
      })
      .catch((err) => console.error("❌ Load user data error", err));
  }, [user]);

  // 🟢 Save to backend
  const syncData = (updatedDebts, budget = monthlyBudget) => {
    if (!user) return;
    fetch("/api/user-data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: user.id,
        debts: updatedDebts,
        monthly_budget: budget,
      }),
    }).catch((err) => console.error("❌ Save error", err));
  };

  const handleAddOrUpdateDebt = (debt) => {
    const updatedDebts = editDebt
      ? debts.map((d) => (d.id === debt.id ? debt : d))
      : [...debts, { ...debt, id: Date.now() }];
    setDebts(updatedDebts);
    syncData(updatedDebts);
  };

  const handleDeleteDebt = (id) => {
    const updatedDebts = debts.filter((d) => d.id !== id);
    setDebts(updatedDebts);
    syncData(updatedDebts);
  };

  const handleBudgetChange = (newBudget) => {
    setMonthlyBudget(newBudget);
    syncData(debts, newBudget);
  };

  const handleLogin = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setDebts([]);
    setMonthlyBudget(0);
  };

  const totalMinPayment = debts.reduce(
    (sum, d) => sum + Number(d.minPayment || 0),
    0
  );

  if (!user) return <Login onLogin={handleLogin} />;

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 px-4 py-6 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* ✅ Navbar */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">📊 วางแผนปลดหนี้อัจฉริยะ</h1>
          <div className="text-sm text-gray-600 flex items-center gap-4">
            👤 {user.email}
            <button
              onClick={handleLogout}
              className="text-red-600 hover:underline"
            >
              ออกจากระบบ
            </button>
          </div>
        </div>

        <PlanSwitcher
          planType={planType}
          setPlanType={setPlanType}
          monthlyBudget={monthlyBudget}
          setMonthlyBudget={setMonthlyBudget}
          minMonthlyBudget={totalMinPayment}
          debts={debts}
        />

        <div className="mt-6">
          <SummaryCards
            debts={debts}
            planType={planType}
            monthlyBudget={monthlyBudget}
          />
        </div>

        <div className="mt-8">
          <DebtList
            debts={debts}
            setDebts={setDebts}
            onEdit={(debt) => {
              setEditDebt(debt);
              setModalOpen(true);
            }}
            onDeleteConfirm={(id) => setModalDeleteId(id)}
          />
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
          <EChartsSection
            debts={debts}
            planType={planType}
            monthlyBudget={monthlyBudget}
          />
        </div>

        <div className="mt-10">
          <TimelineTable
            debts={debts}
            planType={planType}
            monthlyBudget={monthlyBudget}
          />
        </div>

        <div className="mt-10">
          <TipsSection />
        </div>
      </div>

      {/* ✅ Modal: Debt Form */}
      {modalOpen && (
        <DebtFormModal
          closeModal={() => {
            setModalOpen(false);
            setEditDebt(null);
          }}
          saveDebt={(debt) => {
            handleAddOrUpdateDebt(debt);
            setModalOpen(false);
            setEditDebt(null);
          }}
          editDebt={editDebt}
        />
      )}

      {/* ✅ Modal: Delete Confirm */}
      {modalDeleteId !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-xl">
            <h2 className="text-lg font-semibold text-red-600 mb-4">
              ⚠️ ยืนยันการลบ
            </h2>
            <p className="text-sm text-gray-700 mb-6">
              คุณแน่ใจหรือไม่ว่าต้องการลบหนี้รายการนี้?
            </p>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300"
                onClick={() => setModalDeleteId(null)}
              >
                ยกเลิก
              </button>
              <button
                className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
                onClick={() => {
                  handleDeleteDebt(modalDeleteId);
                  setModalDeleteId(null);
                }}
              >
                ลบเลย
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
