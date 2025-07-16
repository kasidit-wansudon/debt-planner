import React from "react"
import { useDrop } from "react-dnd"
import DebtItem from "./DebtItem"

const DebtList = ({ debts, moveDebt, onEdit, onDelete }) => {
  const [, drop] = useDrop({ accept: "DEBT_CARD" })

  return (
    <div ref={drop} className="grid gap-4">
      {debts.map((debt, index) => (
        <DebtItem
          key={debt.id}
          index={index}
          id={debt.id}
          debt={debt}
          moveDebt={moveDebt}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}

export default DebtList
