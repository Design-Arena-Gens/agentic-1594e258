"use client";

import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useFinance } from "@/context/FinanceContext";
import { useLocale } from "@/context/LocaleContext";
import { formatCurrency } from "@/lib/format";
import { translations } from "@/lib/translations";

const COLORS = [
  "#6366f1",
  "#f97316",
  "#10b981",
  "#ec4899",
  "#22d3ee",
  "#a855f7",
  "#facc15",
  "#2dd4bf",
];

export function AnalyticsPanel() {
  const { monthlyTrend, categoryBreakdown, state } = useFinance();
  const { locale } = useLocale();
  const dictionary = translations[locale];
  const currency = state.preferences.primaryCurrency;

  const pieData = Object.entries(categoryBreakdown).map(([name, value]) => ({
    name,
    value: Number(value.toFixed(2)),
  }));

  return (
    <div className="rounded-3xl border border-zinc-200 bg-white/85 p-6 shadow-xl backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/70">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            {dictionary.analytics}
          </h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Visualize inflows, outflows, and spending concentration.
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="h-64 rounded-2xl border border-zinc-100 bg-gradient-to-br from-indigo-50 to-white p-4 dark:border-zinc-800 dark:from-indigo-500/10 dark:to-zinc-900">
          <h4 className="text-sm font-semibold text-zinc-600 dark:text-zinc-300">
            6 Month Cash Flow
          </h4>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyTrend}>
              <XAxis dataKey="month" stroke="#a1a1aa" />
              <YAxis stroke="#a1a1aa" />
              <Tooltip
                formatter={(value: number) =>
                  formatCurrency(value, currency, locale)
                }
                contentStyle={{
                  borderRadius: 16,
                  border: "1px solid rgba(99, 102, 241, 0.15)",
                }}
              />
              <Line
                type="monotone"
                dataKey="income"
                stroke="#22c55e"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="expenses"
                stroke="#ef4444"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="h-64 rounded-2xl border border-zinc-100 bg-gradient-to-br from-fuchsia-50 to-white p-4 dark:border-zinc-800 dark:from-fuchsia-500/10 dark:to-zinc-900">
          <h4 className="text-sm font-semibold text-zinc-600 dark:text-zinc-300">
            Expense Distribution
          </h4>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                outerRadius={90}
                innerRadius={40}
                paddingAngle={5}
              >
                {pieData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) =>
                  formatCurrency(value, currency, locale)
                }
                contentStyle={{
                  borderRadius: 16,
                  border: "1px solid rgba(244, 63, 94, 0.15)",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
