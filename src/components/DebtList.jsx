// DebtList.jsx
import React from 'react'
import DebtItem from './DebtItem'
export default function DebtList({ debts, onEdit, onDeleteConfirm }) {
  return (
    <div className="space-y-4">
      {debts.map((debt, index) => (
        <DebtItem
          key={debt.id}
          debt={debt}
          index={index}
          onEdit={() => onEdit(debt)}
          onDelete={() => onDeleteConfirm(debt.id)}
        />
      ))}
    </div>
  )
}
