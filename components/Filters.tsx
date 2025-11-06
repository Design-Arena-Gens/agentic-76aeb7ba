"use client";

import { format } from "date-fns";
import { useExpenses } from "./ExpensesProvider";
import { categories } from "@/lib/types";

export default function Filters() {
  const { filters, setFilters } = useExpenses();

  return (
    <div className="card grid grid-cols-1 sm:grid-cols-4 gap-3">
      <input
        type="month"
        value={format(filters.month, "yyyy-MM")}
        onChange={(e) => {
          const [y, m] = e.target.value.split("-").map((x) => parseInt(x, 10));
          setFilters({ ...filters, month: new Date(y, m - 1, 1) });
        }}
        aria-label="Month"
      />
      <select
        value={filters.category}
        onChange={(e) => setFilters({ ...filters, category: e.target.value })}
        aria-label="Category"
      >
        {["All", ...categories].map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>
      <input
        placeholder="Search note"
        value={filters.search}
        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        aria-label="Search"
      />
      <ImportExport />
    </div>
  );
}

function ImportExport() {
  const { exportExpenses, importExpenses } = useExpenses();

  const onExport = () => {
    const blob = new Blob([exportExpenses()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `expenses.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const onImport: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      if (Array.isArray(data)) importExpenses(data);
    } catch {}
    e.currentTarget.value = "";
  };

  return (
    <div className="flex items-center gap-2">
      <button type="button" onClick={onExport} className="px-3 py-2 rounded-md">Export</button>
      <label className="px-3 py-2 rounded-md bg-gray-100 text-gray-800 cursor-pointer hover:bg-gray-200">
        Import
        <input type="file" accept="application/json" onChange={onImport} className="hidden" />
      </label>
    </div>
  );
}
