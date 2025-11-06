"use client";

import { useState } from "react";
import { useFinance } from "@/context/FinanceContext";
import { useLocale } from "@/context/LocaleContext";
import { translations } from "@/lib/translations";
import { categories } from "@/lib/categories";
import { supportedCurrencies } from "@/lib/currencies";
import type { TransactionType } from "@/lib/types";
import { PlusCircle } from "lucide-react";

const defaultForm = {
  type: "expense" as TransactionType,
  description: "",
  amount: "",
  category: categories.expense[0],
  date: new Date().toISOString().slice(0, 10),
  account: "",
  tags: "",
  notes: "",
};

export function TransactionForm() {
  const { dispatch, state } = useFinance();
  const { locale } = useLocale();
  const dictionary = translations[locale];
  const [form, setForm] = useState(defaultForm);
  const [currencyOverride, setCurrencyOverride] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);

  const formCategories = categories[form.type];
  const currency = currencyOverride ?? state.preferences.primaryCurrency;

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const id = crypto.randomUUID();
    dispatch({
      type: "add-transaction",
      payload: {
        id,
        type: form.type,
        description: form.description,
        amount: Number(form.amount),
        category: form.category,
        date: new Date(form.date).toISOString(),
        currency,
        account: form.account || "Primary",
        tags: form.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
        notes: form.notes,
      },
    });
    setForm(defaultForm);
    setCurrencyOverride(null);
  }

  return (
    <div className="rounded-3xl border border-zinc-200 bg-white/90 p-6 shadow-xl shadow-indigo-100/20 backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/80 dark:shadow-indigo-900/30">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          {dictionary.addTransaction}
        </h2>
        <button
          type="button"
          className="rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600 transition hover:bg-indigo-100 dark:border-indigo-500/40 dark:bg-indigo-500/20 dark:text-indigo-200"
          onClick={() => setExpanded((prev) => !prev)}
        >
          {expanded ? "Less" : "More"}
        </button>
      </div>

      <form
        className="mt-4 grid gap-4 md:grid-cols-2"
        onSubmit={handleSubmit}
      >
        <label className="flex flex-col gap-2 text-sm text-zinc-700 dark:text-zinc-300">
          {dictionary.type}
          <select
            className="rounded-2xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-indigo-400 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
            value={form.type}
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                type: event.target.value as TransactionType,
                category: categories[event.target.value as TransactionType][0],
              }))
            }
          >
            <option value="income">{dictionary.income}</option>
            <option value="expense">{dictionary.expenses}</option>
            <option value="transfer">Transfer</option>
          </select>
        </label>

        <label className="flex flex-col gap-2 text-sm text-zinc-700 dark:text-zinc-300">
          {dictionary.amount}
          <input
            required
            type="number"
            min="0"
            step="0.01"
            value={form.amount}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, amount: event.target.value }))
            }
            className="rounded-2xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-indigo-400 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
          />
        </label>

        <label className="flex flex-col gap-2 text-sm text-zinc-700 dark:text-zinc-300">
          {dictionary.category}
          <select
            value={form.category}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, category: event.target.value }))
            }
            className="rounded-2xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-indigo-400 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
          >
            {formCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-2 text-sm text-zinc-700 dark:text-zinc-300">
          {dictionary.date}
          <input
            type="date"
            value={form.date}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, date: event.target.value }))
            }
            className="rounded-2xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-indigo-400 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
          />
        </label>

        <label className="flex flex-col gap-2 text-sm text-zinc-700 dark:text-zinc-300">
          {dictionary.currency}
          <select
            value={currency}
            onChange={(event) => setCurrencyOverride(event.target.value)}
            className="rounded-2xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-indigo-400 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
          >
            {supportedCurrencies.map((entry) => (
              <option key={entry.code} value={entry.code}>
                {entry.symbol} {entry.code}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-2 text-sm text-zinc-700 dark:text-zinc-300">
          Account
          <input
            type="text"
            value={form.account}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, account: event.target.value }))
            }
            placeholder="UPI, Credit Card, Cash..."
            className="rounded-2xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-indigo-400 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
          />
        </label>

        {expanded && (
          <>
            <label className="flex flex-col gap-2 text-sm text-zinc-700 dark:text-zinc-300 md:col-span-2">
              {dictionary.tags}
              <input
                type="text"
                value={form.tags}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, tags: event.target.value }))
                }
                placeholder="family, commute, reimbursable"
                className="rounded-2xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-indigo-400 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
              />
            </label>

            <label className="flex flex-col gap-2 text-sm text-zinc-700 dark:text-zinc-300 md:col-span-2">
              {dictionary.notes}
              <textarea
                value={form.notes}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, notes: event.target.value }))
                }
                rows={3}
                className="rounded-2xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-indigo-400 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
              />
            </label>
          </>
        )}

        <div className="md:col-span-2">
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/40 transition hover:bg-indigo-500"
          >
            <PlusCircle className="h-4 w-4" />
            {dictionary.save}
          </button>
        </div>
      </form>
    </div>
  );
}
