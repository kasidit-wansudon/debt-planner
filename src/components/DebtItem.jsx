import React from "react"
import { useDrag, useDrop } from "react-dnd"
import { X, Edit2 } from "lucide-react"

const DebtItem = ({ debt, index, moveDebt, onEdit, onDelete }) => {
  const ref = React.useRef()

  const [, drop] = useDrop({
    accept: "DEBT_CARD",
    hover(item) {
      if (item.index === index) return
      moveDebt(item.index, index)
      item.index = index
    },
  })

  const [{ isDragging }, drag] = useDrag({
    type: "DEBT_CARD",
    item: { id: debt.id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  drag(drop(ref))

  return (
    <div
      ref={ref}
      className={`p-4 rounded-xl shadow-md bg-white transition-opacity ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold">{debt.name}</h3>
        <div className="flex gap-2">
          <button onClick={() => onEdit(debt)}>
            <Edit2 size={18} />
          </button>
          <button onClick={() => onDelete(debt.id)}>
            <X size={18} />
          </button>
        </div>
      </div>
      <div className="text-sm text-gray-600 space-y-1">
        <p>💳 ประเภท: {debt.type}</p>
        <p>💰 ยอดหนี้: {debt.amount.toLocaleString()} บาท</p>
        <p>📈 ดอกเบี้ย: {debt.interestRate}% ต่อปี</p>
        <p>📆 จ่ายขั้นต่ำ: {debt.minPayment.toLocaleString()} บาท/เดือน</p>
      </div>
    </div>
  )
}

export default DebtItem
