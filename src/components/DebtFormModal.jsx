import React, { useState, useEffect } from "react";

const typeOptions = [
  "บัตรเครดิต",
  "สินเชื่อส่วนบุคคล",
  "สินเชื่อบ้าน",
  "สินเชื่อรถยนต์",
  "สินเชื่อเพื่อการศึกษา",
  "หนี้นอกระบบ",
  "อื่นๆ",
];

export default function DebtFormModal({ closeModal, saveDebt, editDebt }) {
  const [form, setForm] = useState({
    name: "",
    amount: "",
    interestRate: "",
    minPayment: "",
    type: "บัตรเครดิต",
  });

  useEffect(() => {
    if (editDebt) setForm(editDebt);
  }, [editDebt]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (["amount", "interestRate", "minPayment"].includes(name)) {
      setForm({ ...form, [name]: formatNumberInput(value) });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const parseNumber = (str) => parseFloat(String(str).replace(/,/g, "")) || 0;

    const validated = {
      ...form,
      amount: parseNumber(form.amount),
      interestRate: parseNumber(form.interestRate),
      minPayment: parseNumber(form.minPayment),
    };

    saveDebt(validated);
  };
  const formatNumberInput = (value) => {
    // ลบทุกตัวอักษรที่ไม่ใช่ 0-9 หรือ .
    const cleanValue = value.replace(/[^0-9.]/g, "");

    // แยก integer กับ decimal
    const [intPart, decimalPart] = cleanValue.split(".");

    const withCommas = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    return decimalPart !== undefined
      ? `${withCommas}.${decimalPart}`
      : withCommas;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 p-4 sm:p-0">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl ring-1 ring-gray-200">
        <h2 className="text-2xl font-semibold text-center text-blue-700 mb-6">
          {editDebt ? "✏️ แก้ไขหนี้" : "➕ เพิ่มหนี้ใหม่"}
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {[
            {
              label: "ชื่อหนี้",
              name: "name",
              type: "text",
              inputMode: "text",
            },
            {
              label: "ยอดหนี้ (บาท)",
              name: "amount",
              type: "text",
              inputMode: "decimal",
            }, // 👈 แก้จาก number เป็น text
            {
              label: "อัตราดอกเบี้ยต่อปี (%)",
              name: "interestRate",
              type: "text",
              inputMode: "decimal",
            },
            {
              label: "ยอดชำระขั้นต่ำต่อเดือน",
              name: "minPayment",
              type: "text",
              inputMode: "decimal",
            },
          ].map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {field.label}
              </label>
              <input
                type={field.type}
                name={field.name}
                required
                value={form[field.name]}
                onChange={handleChange}
                inputMode={field.inputMode} // 👈 บอก browser ว่ารับเลข
                className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm px-3 py-2"
                placeholder={field.label}
              />
            </div>
          ))}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ประเภทหนี้
            </label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm px-3 py-2"
            >
              {typeOptions.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800"
              onClick={closeModal}
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold"
            >
              {editDebt ? "บันทึก" : "เพิ่ม"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
