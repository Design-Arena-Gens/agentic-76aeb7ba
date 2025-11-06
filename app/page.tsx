"use client";

import ExpenseForm from "@/components/ExpenseForm";
import ExpenseTable from "@/components/ExpenseTable";
import Filters from "@/components/Filters";
import Summary from "@/components/Summary";
import { ExpensesProvider } from "@/components/ExpensesProvider";

export default function Page() {
  return (
    <ExpensesProvider>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">Expense Dashboard</h1>
      </div>
      <div className="grid grid-cols-1 gap-4">
        <ExpenseForm />
        <Summary />
        <Filters />
        <ExpenseTable />
      </div>
    </ExpensesProvider>
  );
}
