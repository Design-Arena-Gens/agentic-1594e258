"use client";

import { useFinance } from "@/context/FinanceContext";
import { useLocale } from "@/context/LocaleContext";
import { formatCurrency } from "@/lib/format";
import { translations } from "@/lib/translations";
import { Sparkles } from "lucide-react";

export function GoalsPanel() {
  const { state } = useFinance();
  const { locale } = useLocale();
  const dictionary = translations[locale];

  return (
    <div className="rounded-3xl border border-zinc-200 bg-white/80 p-6 shadow-xl backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/70">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            {dictionary.savingsGoals}
          </h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Track life goals with clarity and motivation.
          </p>
        </div>
        <Sparkles className="h-6 w-6 text-amber-500" />
      </div>

      <div className="mt-5 space-y-4">
        {state.goals.map((goal) => {
          const progress = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
          return (
            <div
              key={goal.id}
              className="rounded-2xl border border-transparent bg-gradient-to-br from-amber-50/80 to-white p-4 dark:from-amber-500/10 dark:to-zinc-900"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">
                    {goal.name}
                  </h4>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Target {formatCurrency(goal.targetAmount, goal.currency, locale)} by{" "}
                    {new Date(goal.targetDate).toLocaleDateString(locale)}
                  </p>
                </div>
                <span className="rounded-full bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-600 dark:text-amber-300">
                  {progress}%
                </span>
              </div>
              <div className="mt-3 h-2 rounded-full bg-amber-100 dark:bg-amber-900/40">
                <div
                  className="h-2 rounded-full bg-amber-500 transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="mt-2 flex justify-between text-xs text-zinc-500 dark:text-zinc-400">
                <span>
                  {formatCurrency(goal.currentAmount, goal.currency, locale)} saved
                </span>
                <span>
                  {formatCurrency(goal.targetAmount - goal.currentAmount, goal.currency, locale)} to
                  go
                </span>
              </div>
            </div>
          );
        })}
        {state.goals.length === 0 && (
          <div className="rounded-2xl border border-dashed border-zinc-200 p-6 text-center text-sm text-zinc-400 dark:border-zinc-700">
            Set your first savings target to visualize your progress.
          </div>
        )}
      </div>
    </div>
  );
}
