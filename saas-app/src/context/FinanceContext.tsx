"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import { loadState, persistState } from "@/lib/storage";
import { convertAmount } from "@/lib/currencies";
import { seedState } from "@/lib/seed";
import type { FinanceAction, FinanceState, Transaction } from "@/lib/types";

type FinanceContextValue = {
  state: FinanceState;
  dispatch: React.Dispatch<FinanceAction>;
  totals: {
    income: number;
    expenses: number;
    balance: number;
    recurringCount: number;
  };
  categoryBreakdown: Record<string, number>;
  monthlyTrend: { month: string; income: number; expenses: number }[];
};

const FinanceContext = createContext<FinanceContextValue | null>(null);

function financeReducer(state: FinanceState, action: FinanceAction): FinanceState {
  switch (action.type) {
    case "add-transaction":
      return { ...state, transactions: [action.payload, ...state.transactions] };
    case "update-transaction":
      return {
        ...state,
        transactions: state.transactions.map((txn) =>
          txn.id === action.payload.id ? action.payload : txn,
        ),
      };
    case "delete-transaction":
      return {
        ...state,
        transactions: state.transactions.filter((txn) => txn.id !== action.payload.id),
      };
    case "bulk-import":
      return { ...state, transactions: [...action.payload, ...state.transactions] };
    case "add-budget":
      return { ...state, budgets: [action.payload, ...state.budgets] };
    case "update-budget":
      return {
        ...state,
        budgets: state.budgets.map((budget) =>
          budget.id === action.payload.id ? action.payload : budget,
        ),
      };
    case "delete-budget":
      return {
        ...state,
        budgets: state.budgets.filter((budget) => budget.id !== action.payload.id),
      };
    case "add-goal":
      return { ...state, goals: [action.payload, ...state.goals] };
    case "update-goal":
      return {
        ...state,
        goals: state.goals.map((goal) =>
          goal.id === action.payload.id ? action.payload : goal,
        ),
      };
    case "delete-goal":
      return {
        ...state,
        goals: state.goals.filter((goal) => goal.id !== action.payload.id),
      };
    case "add-reminder":
      return { ...state, reminders: [action.payload, ...state.reminders] };
    case "update-reminder":
      return {
        ...state,
        reminders: state.reminders.map((reminder) =>
          reminder.id === action.payload.id ? action.payload : reminder,
        ),
      };
    case "delete-reminder":
      return {
        ...state,
        reminders: state.reminders.filter(
          (reminder) => reminder.id !== action.payload.id,
        ),
      };
    case "update-preferences":
      return {
        ...state,
        preferences: { ...state.preferences, ...action.payload },
      };
    default:
      return state;
  }
}

function calculateTotals(transactions: Transaction[], targetCurrency: string) {
  const totals = transactions.reduce(
    (acc, txn) => {
      const normalized = convertAmount(txn.amount, txn.currency, targetCurrency);
      if (txn.type === "income") acc.income += normalized;
      if (txn.type === "expense") acc.expenses += normalized;
      if (txn.recurring) acc.recurringCount += 1;
      return acc;
    },
    { income: 0, expenses: 0, recurringCount: 0 },
  );
  return { ...totals, balance: totals.income - totals.expenses };
}

function buildCategoryBreakdown(transactions: Transaction[], targetCurrency: string) {
  return transactions.reduce<Record<string, number>>((acc, txn) => {
    if (txn.type !== "expense") return acc;
    const normalized = convertAmount(txn.amount, txn.currency, targetCurrency);
    acc[txn.category] = (acc[txn.category] ?? 0) + normalized;
    return acc;
  }, {});
}

function buildMonthlyTrend(transactions: Transaction[], targetCurrency: string) {
  const grouped = transactions.reduce<Record<string, { income: number; expenses: number }>>(
    (acc, txn) => {
      const date = new Date(txn.date);
      const key = `${date.getFullYear()}-${date.getMonth() + 1}`;
      acc[key] = acc[key] ?? { income: 0, expenses: 0 };
      const normalized = convertAmount(txn.amount, txn.currency, targetCurrency);
      if (txn.type === "income") {
        acc[key].income += normalized;
      } else if (txn.type === "expense") {
        acc[key].expenses += normalized;
      }
      return acc;
    },
    {},
  );

  const sorted = Object.entries(grouped)
    .map(([key, value]) => {
      const [year, month] = key.split("-").map(Number);
      const date = new Date(year, (month ?? 1) - 1);
      return {
        month: date.toLocaleDateString(undefined, {
          month: "short",
          year: "numeric",
        }),
        income: value.income,
        expenses: value.expenses,
        date,
      };
    })
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  return sorted.slice(-6).map((entry) => ({
    month: entry.month,
    income: entry.income,
    expenses: entry.expenses,
  }));
}

export function FinanceProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(financeReducer, seedState, (initial) => {
    if (typeof window === "undefined") return initial;
    return loadState() ?? initial;
  });

  useEffect(() => {
    persistState(state);
  }, [state]);

  const derived = useMemo(() => {
    const totals = calculateTotals(state.transactions, state.preferences.primaryCurrency);
    const categoryBreakdown = buildCategoryBreakdown(
      state.transactions,
      state.preferences.primaryCurrency,
    );
    const monthlyTrend = buildMonthlyTrend(
      state.transactions,
      state.preferences.primaryCurrency,
    );
    return {
      totals,
      categoryBreakdown,
      monthlyTrend,
    };
  }, [state.transactions, state.preferences.primaryCurrency]);

  const value = useMemo<FinanceContextValue>(
    () => ({
      state,
      dispatch,
      totals: derived.totals,
      categoryBreakdown: derived.categoryBreakdown,
      monthlyTrend: derived.monthlyTrend,
    }),
    [state, derived],
  );

  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>;
}

export function useFinance() {
  const ctx = useContext(FinanceContext);
  if (!ctx) {
    throw new Error("useFinance must be used within FinanceProvider");
  }
  return ctx;
}
