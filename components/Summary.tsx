"use client";

import { useMemo } from "react";
import { useExpenses } from "./ExpensesProvider";
import { eachDayOfInterval, endOfMonth, format, isSameDay, startOfMonth } from "date-fns";

export default function Summary() {
  const { filtered, filters } = useExpenses();

  const total = useMemo(() => filtered.reduce((s, e) => s + e.amount, 0), [filtered]);
  const days = useMemo(
    () => eachDayOfInterval({ start: startOfMonth(filters.month), end: endOfMonth(filters.month) }),
    [filters.month]
  );
  const perDay = useMemo(() =>
    days.map((d) => filtered.filter((e) => isSameDay(new Date(e.date), d)).reduce((s, e) => s + e.amount, 0)),
  [days, filtered]);

  const avg = useMemo(() => (days.length ? total / days.length : 0), [total, days.length]);

  const max = Math.max(1, ...perDay);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <div className="card">
        <div className="text-sm text-gray-500">Month Total</div>
        <div className="mt-1 text-2xl font-semibold">${total.toFixed(2)}</div>
      </div>
      <div className="card">
        <div className="text-sm text-gray-500">Daily Average</div>
        <div className="mt-1 text-2xl font-semibold">${avg.toFixed(2)}</div>
      </div>
      <div className="card">
        <div className="text-sm text-gray-500">Days Tracked</div>
        <div className="mt-1 text-2xl font-semibold">{filtered.length > 0 ? new Set(filtered.map(e=>e.date)).size : 0}</div>
      </div>

      <div className="card sm:col-span-3">
        <div className="flex items-center justify-between mb-3">
          <div className="font-medium">This Month</div>
          <div className="text-sm text-gray-500">{format(filters.month, "MMMM yyyy")}</div>
        </div>
        <div className="h-28 flex items-end gap-1">
          {perDay.map((v, i) => (
            <div key={i} className="flex-1 bg-gray-200 rounded" style={{height: `${(v / max) * 100}%`}} />
          ))}
        </div>
        <div className="mt-2 text-xs text-gray-500">Daily spend bar chart</div>
      </div>
    </div>
  );
}
