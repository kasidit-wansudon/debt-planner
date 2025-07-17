import React, { useState, useEffect } from "react";
import Toast from "./Toast"; // ✅ import toast

export default function PlanSwitcher({
  planType,
  setPlanType,
  monthlyBudget,
  setMonthlyBudget,
  minMonthlyBudget = 0,
  debts,
}) {
  const [inputBudget, setInputBudget] = useState(String(monthlyBudget));
  const [toast, setToast] = useState(null);
  const [toastSuccess, setToastSuccess] = useState(null);

  useEffect(() => {
    setInputBudget(String(monthlyBudget));
  }, [monthlyBudget]);

  const handlePlanChange = (type) => {
    setPlanType(type);
  };

  const handleBudgetChange = (e) => {
    const value = e.target.value;
    const formatted = formatNumberInput(value);
    setInputBudget(formatted);
  };

  const formatNumberInput = (value) => {
    const clean = value.replace(/[^0-9.]/g, "");
    const [intPart, decimalPart] = clean.split(".");
    const withCommas = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return decimalPart !== undefined
      ? `${withCommas}.${decimalPart}`
      : withCommas;
  };

  const handleConfirmBudget = async () => {
    const numeric = parseFloat(String(inputBudget).replace(/,/g, ""));

    if (isNaN(numeric)) return;

    if (numeric < minMonthlyBudget) {
      setToast(
        `กรุณากรอกยอดที่ต้องการจ่ายมากกว่าหรือเท่ากับ ${minMonthlyBudget.toLocaleString()} บาท`
      );
      return;
    }

    // 💾 set state
    setMonthlyBudget(numeric);

    // ✅ save ไป backend
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return;

    try {
      await fetch("https://debt-planner.onrender.com/api/user-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id,
          debts,
          monthly_budget: numeric,
        }),
      });
      setToastSuccess("💾 บันทึก budget สำเร็จ");
    } catch (err) {
      console.error("❌ บันทึก budget ล้มเหลว:", err);
    }
  };
  
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleConfirmBudget();
    }
  };

  return (
    <div className="bg-white shadow-md rounded-xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div className="flex gap-2">
        <button
          onClick={() => handlePlanChange("minimum")}
          className={`px-4 py-2 rounded-md border ${
            planType === "minimum"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          💳 แผนชำระขั้นต่ำ
        </button>
        <button
          onClick={() => handlePlanChange("accelerated")}
          className={`px-4 py-2 rounded-md border ${
            planType === "accelerated"
              ? "bg-green-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          ⚡ แผนเร่งรัด
        </button>
      </div>

      {planType === "accelerated" && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
          <label className="text-sm font-medium">
            💸 ยอดที่ต้องการจ่ายต่อเดือน:
          </label>

          <input
            type="text"
            inputMode="decimal"
            value={inputBudget}
            onChange={handleBudgetChange}
            className="w-40 h-10 rounded-md border-gray-300 focus:ring-2 focus:ring-green-500 focus:outline-none shadow-sm px-3"
            placeholder="บาท"
            min={minMonthlyBudget}
            onKeyDown={handleKeyDown}
          />

          <button
            onClick={handleConfirmBudget}
            className="h-10 inline-flex items-center gap-2 px-4 bg-green-600 text-white rounded-md shadow-md hover:bg-green-700 transition"
          >
            ✅ <span className="font-medium">ยืนยัน</span>
          </button>
        </div>
      )}
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
      {toastSuccess && <Toast message={toastSuccess} onClose={() => setToastSuccess(null)} type="success"/>}
    </div>
  );
}
