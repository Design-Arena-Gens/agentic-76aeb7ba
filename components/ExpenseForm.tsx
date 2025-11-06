"use client";

import { useState } from "react";
import { useExpenses } from "./ExpensesProvider";
import { categories } from "@/lib/types";
import { format } from "date-fns";

export default function ExpenseForm() {
  const { addExpense } = useExpenses();
  const [amount, setAmount] = useState<string>("");
  const [category, setCategory] = useState<string>(categories[0]);
  const [note, setNote] = useState<string>("");
  const [date, setDate] = useState<string>(format(new Date(), "yyyy-MM-dd"));

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(amount);
    if (!isFinite(parsed) || parsed <= 0) return;
    addExpense({ amount: parsed, category, note, date });
    setAmount("");
    setNote("");
  };

  return (
    <form onSubmit={onSubmit} className="card flex flex-col gap-3 sm:gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-6 gap-3">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="sm:col-span-2"
          aria-label="Date"
          required
        />
        <input
          type="number"
          min="0"
          step="0.01"
          inputMode="decimal"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="sm:col-span-2"
          aria-label="Amount"
          required
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="sm:col-span-2"
          aria-label="Category"
        >
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          placeholder="Note (optional)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="flex-1"
          aria-label="Note"
        />
        <button type="submit" className="px-4 py-2 rounded-md">Add</button>
      </div>
    </form>
  );
}
