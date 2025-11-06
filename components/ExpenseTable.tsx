"use client";

import { useMemo } from "react";
import { useExpenses } from "./ExpensesProvider";
import { format, parseISO } from "date-fns";

export default function ExpenseTable() {
  const { filtered, deleteExpense } = useExpenses();

  const rows = useMemo(() => filtered.sort((a, b) => (a.date < b.date ? 1 : -1)), [filtered]);

  const total = useMemo(() => rows.reduce((sum, e) => sum + e.amount, 0), [rows]);

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold">Expenses</h3>
        <div className="text-sm text-gray-600">Total: ${total.toFixed(2)}</div>
      </div>
      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th style={{width: 120}}>Date</th>
              <th style={{width: 140}}>Category</th>
              <th>Note</th>
              <th style={{width: 120}}>Amount</th>
              <th style={{width: 60}}></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((e) => (
              <tr key={e.id}>
                <td className="text-gray-600">{format(parseISO(e.date), "MMM d")}</td>
                <td><span className="badge">{e.category}</span></td>
                <td className="text-gray-800">{e.note || "?"}</td>
                <td className="font-medium">${e.amount.toFixed(2)}</td>
                <td>
                  <button
                    onClick={() => deleteExpense(e.id)}
                    className="bg-transparent text-gray-500 hover:text-black p-1"
                    aria-label="Delete"
                    title="Delete"
                  >
                    ?
                  </button>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center text-gray-500 py-8">No expenses yet</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
