"use client";

import { useMemo } from "react";
import { useFinance } from "@/context/FinanceContext";
import { useLocale } from "@/context/LocaleContext";
import { formatCurrency } from "@/lib/format";
import { translations } from "@/lib/translations";
import { convertAmount } from "@/lib/currencies";
import { Gauge } from "lucide-react";

export function BudgetsPanel() {
  const { state } = useFinance();
  const { locale } = useLocale();
  const dictionary = translations[locale];

  const budgets = useMemo(() => {
    return state.budgets.map((budget) => {
      const spent = state.transactions
        .filter(
          (transaction) =>
            transaction.type === "expense" && budget.categories.includes(transaction.category),
        )
        .reduce(
          (acc, transaction) =>
            acc +
            convertAmount(transaction.amount, transaction.currency, budget.currency),
          0,
        );

      const progress = Math.min(100, Math.round((spent / budget.amount) * 100));

      return {
        ...budget,
        spent,
        remaining: Math.max(0, budget.amount - spent),
        progress,
      };
    });
  }, [state.budgets, state.transactions]);

  return (
    <div className="rounded-3xl border border-zinc-200 bg-white/85 p-6 shadow-xl backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/70">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            {dictionary.monthlyBudgets}
          </h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Keep daily spends aligned with your monthly plans.
          </p>
        </div>
        <Gauge className="h-6 w-6 text-indigo-500" />
      </div>

      <div className="mt-6 space-y-4">
        {budgets.map((budget) => (
          <div
            key={budget.id}
            className="rounded-2xl border border-transparent bg-gradient-to-br from-indigo-50/80 to-white p-4 dark:from-indigo-500/10 dark:to-zinc-900"
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">
                  {budget.name}
                </h4>
                <p className="text-xs uppercase tracking-wide text-indigo-500">
                  {budget.categories.join(", ")}
                </p>
              </div>
              <span className="text-sm font-medium text-indigo-600 dark:text-indigo-300">
                {formatCurrency(budget.amount, budget.currency, locale)}
              </span>
            </div>
            <div className="mt-3 h-2 rounded-full bg-indigo-100 dark:bg-indigo-900/40">
              <div
                className="h-2 rounded-full bg-indigo-500 transition-all"
                style={{ width: `${budget.progress}%` }}
              />
            </div>
            <div className="mt-2 flex justify-between text-xs text-zinc-500 dark:text-zinc-400">
              <span>
                {formatCurrency(budget.spent, budget.currency, locale)} spent
              </span>
              <span>
                {formatCurrency(budget.remaining, budget.currency, locale)} left
              </span>
            </div>
          </div>
        ))}
        {budgets.length === 0 && (
          <div className="rounded-2xl border border-dashed border-zinc-200 p-6 text-center text-sm text-zinc-400 dark:border-zinc-700">
            Create your first budget to see daily progress here.
          </div>
        )}
      </div>
    </div>
  );
}
