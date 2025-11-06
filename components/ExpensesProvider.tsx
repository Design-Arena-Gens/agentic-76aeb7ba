"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Expense, ExpenseInput, Filters, defaultFilters } from "@/lib/types";
import { endOfMonth, isSameMonth, parseISO, startOfMonth } from "date-fns";

const STORAGE_KEY = "expenses_v1";

function readFromStorage(): Expense[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: Expense[] = JSON.parse(raw);
    return parsed.map((e) => ({ ...e, date: e.date }));
  } catch {
    return [];
  }
}

function writeToStorage(expenses: Expense[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
}

export type ExpensesContextValue = {
  expenses: Expense[];
  addExpense: (input: ExpenseInput) => void;
  deleteExpense: (id: string) => void;
  importExpenses: (data: Expense[]) => void;
  exportExpenses: () => string;
  filters: Filters;
  setFilters: (f: Filters) => void;
  filtered: Expense[];
};

const ExpensesContext = createContext<ExpensesContextValue | null>(null);

export function ExpensesProvider({ children }: { children: React.ReactNode }) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [filters, setFilters] = useState<Filters>(defaultFilters);

  useEffect(() => {
    setExpenses(readFromStorage());
  }, []);

  useEffect(() => {
    writeToStorage(expenses);
  }, [expenses]);

  const addExpense = (input: ExpenseInput) => {
    const id = crypto.randomUUID();
    setExpenses((prev) => [{ id, ...input }, ...prev]);
  };

  const deleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  const importExpenses = (data: Expense[]) => {
    // Simple import: replace all
    setExpenses(data);
  };

  const exportExpenses = () => JSON.stringify(expenses, null, 2);

  const filtered = useMemo(() => {
    const monthStart = startOfMonth(filters.month);
    const monthEnd = endOfMonth(filters.month);
    return expenses.filter((e) => {
      const d = parseISO(e.date);
      if (d < monthStart || d > monthEnd) return false;
      if (filters.category && filters.category !== "All" && e.category !== filters.category) return false;
      if (filters.search && !(`${e.note}`.toLowerCase().includes(filters.search.toLowerCase()))) return false;
      return true;
    });
  }, [expenses, filters]);

  const value = useMemo<ExpensesContextValue>(() => ({
    expenses,
    addExpense,
    deleteExpense,
    importExpenses,
    exportExpenses,
    filters,
    setFilters,
    filtered,
  }), [expenses, filters, filtered]);

  return <ExpensesContext.Provider value={value}>{children}</ExpensesContext.Provider>;
}

export function useExpenses() {
  const ctx = useContext(ExpensesContext);
  if (!ctx) throw new Error("useExpenses must be used within ExpensesProvider");
  return ctx;
}
