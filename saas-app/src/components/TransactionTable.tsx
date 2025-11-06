"use client";

import { useMemo, useState } from "react";
import { useFinance } from "@/context/FinanceContext";
import { useLocale } from "@/context/LocaleContext";
import { formatCurrency, formatDate } from "@/lib/format";
import { translations } from "@/lib/translations";
import { Filter, Search, Trash2 } from "lucide-react";

type TransactionFilter = "all" | "income" | "expense" | "transfer" | "recurring";

export function TransactionTable() {
  const { state, dispatch } = useFinance();
  const { locale } = useLocale();
  const dictionary = translations[locale];
  const [filter, setFilter] = useState<TransactionFilter>("all");
  const [search, setSearch] = useState("");

  const filteredTransactions = useMemo(() => {
    return state.transactions.filter((transaction) => {
      if (filter !== "all") {
        if (filter === "recurring") {
          if (!transaction.recurring) return false;
        } else if (transaction.type !== filter) {
          return false;
        }
      }
      if (!search) return true;
      const term = search.toLowerCase();
      return (
        transaction.description.toLowerCase().includes(term) ||
        transaction.category.toLowerCase().includes(term) ||
        transaction.tags.some((tag) => tag.toLowerCase().includes(term)) ||
        transaction.notes?.toLowerCase().includes(term)
      );
    });
  }, [state.transactions, filter, search]);

  return (
    <div className="rounded-3xl border border-transparent bg-white/80 p-6 shadow-2xl shadow-indigo-500/10 backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/70 dark:shadow-indigo-900/20">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            {dictionary.insights}
          </h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {dictionary.searchPlaceholder}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              className="rounded-full border border-zinc-200 bg-white pl-9 pr-3 py-2 text-sm outline-none focus:border-indigo-400 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
              placeholder={dictionary.filter}
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-2 py-1 text-xs dark:border-zinc-700 dark:bg-zinc-800">
            <Filter className="h-4 w-4 text-indigo-500" />
            {(["all", "income", "expense", "transfer", "recurring"] as TransactionFilter[]).map(
              (option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setFilter(option)}
                  className={`rounded-full px-3 py-1 font-medium transition ${
                    filter === option
                      ? "bg-indigo-600 text-white shadow"
                      : "text-zinc-600 hover:bg-white dark:text-zinc-300 dark:hover:bg-zinc-700"
                  }`}
                >
                  {option === "all"
                    ? "All"
                    : option === "recurring"
                      ? dictionary.recurring
                      : option === "income"
                        ? dictionary.income
                        : option === "expense"
                          ? dictionary.expenses
                          : "Transfer"}
                </button>
              ),
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 max-h-[420px] overflow-y-auto pr-2">
        <table className="w-full table-fixed text-left text-sm text-zinc-600 dark:text-zinc-300">
          <thead className="sticky top-0 bg-white/95 text-xs uppercase tracking-wide text-zinc-400 backdrop-blur dark:bg-zinc-900/90">
            <tr>
              <th className="w-32 py-2 font-semibold">{dictionary.date}</th>
              <th className="w-40 py-2 font-semibold">{dictionary.description}</th>
              <th className="w-28 py-2 font-semibold">{dictionary.category}</th>
              <th className="w-24 py-2 font-semibold">{dictionary.type}</th>
              <th className="w-24 py-2 font-semibold">{dictionary.amount}</th>
              <th className="w-36 py-2 font-semibold">Tags</th>
              <th className="w-20 py-2 text-right font-semibold">{dictionary.delete}</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((transaction) => (
              <tr
                key={transaction.id}
                className="border-b border-zinc-100 align-top transition hover:bg-indigo-50/40 dark:border-zinc-800 dark:hover:bg-indigo-500/10"
              >
                <td className="py-3 text-xs text-zinc-500 dark:text-zinc-400">
                  {formatDate(transaction.date, locale)}
                  {transaction.recurring && (
                    <span className="mt-1 block rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase text-emerald-500">
                      {transaction.recurring.cadence}
                    </span>
                  )}
                </td>
                <td className="py-3 font-medium text-zinc-800 dark:text-zinc-100">
                  {transaction.description}
                  <p className="text-xs text-zinc-400">{transaction.account}</p>
                </td>
                <td className="py-3">{transaction.category}</td>
                <td className="py-3 capitalize">{transaction.type}</td>
                <td className="py-3 font-semibold text-zinc-900 dark:text-zinc-100">
                  {formatCurrency(
                    transaction.amount,
                    transaction.currency,
                    locale,
                  )}
                </td>
                <td className="py-3">
                  <div className="flex flex-wrap gap-1">
                    {transaction.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-indigo-500/10 px-2 py-0.5 text-[10px] uppercase tracking-wide text-indigo-500"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="py-3 text-right">
                  <button
                    type="button"
                    onClick={() =>
                      dispatch({
                        type: "delete-transaction",
                        payload: { id: transaction.id },
                      })
                    }
                    className="inline-flex items-center justify-center rounded-full border border-transparent p-2 text-zinc-400 transition hover:border-red-200 hover:text-red-500 dark:hover:border-red-500/40 dark:hover:text-red-400"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
            {filteredTransactions.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="py-10 text-center text-sm text-zinc-400"
                >
                  No transactions matching the filters yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
