"use client";

import { useRef } from "react";
import { useFinance } from "@/context/FinanceContext";
import { useLocale } from "@/context/LocaleContext";
import { translations } from "@/lib/translations";
import { convertAmount } from "@/lib/currencies";
import { Download, Upload } from "lucide-react";
import type { Transaction } from "@/lib/types";

function toCsv(transactions: Transaction[]) {
  const header = [
    "id",
    "date",
    "type",
    "description",
    "category",
    "amount",
    "currency",
    "account",
    "tags",
    "notes",
  ];
  const rows = transactions.map((transaction) =>
    [
      transaction.id,
      transaction.date,
      transaction.type,
      transaction.description,
      transaction.category,
      transaction.amount,
      transaction.currency,
      transaction.account,
      transaction.tags.join("|"),
      transaction.notes ?? "",
    ].join(","),
  );
  return [header.join(","), ...rows].join("\n");
}

export function QuickActions() {
  const { state, dispatch } = useFinance();
  const { locale } = useLocale();
  const dictionary = translations[locale];
  const inputRef = useRef<HTMLInputElement | null>(null);

  function handleExport() {
    const blob = new Blob([toCsv(state.transactions)], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "flowwise-transactions.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  async function handleImport(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    const [, ...lines] = text.split("\n").filter(Boolean);
    const transactions: Transaction[] = lines.map((line) => {
      const [
        id,
        date,
        type,
        description,
        category,
        amount,
        currency,
        account,
        tags,
        notes,
      ] = line.split(",");
      return {
        id: id || crypto.randomUUID(),
        date: new Date(date ?? Date.now()).toISOString(),
        type: (type ?? "expense") as Transaction["type"],
        description: description ?? "",
        category: category ?? "General",
        amount: Number(amount ?? 0),
        currency: currency ?? state.preferences.primaryCurrency,
        account: account ?? "Imported",
        tags: tags ? tags.split("|").filter(Boolean) : [],
        notes,
      };
    });

    dispatch({ type: "bulk-import", payload: transactions });
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  const totalConverted = state.transactions.reduce(
    (acc, txn) =>
      acc +
      convertAmount(txn.amount, txn.currency, state.preferences.primaryCurrency),
    0,
  );

  return (
    <div className="rounded-3xl border border-zinc-200 bg-white/70 p-6 shadow-lg backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/60">
      <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
        {dictionary.importCsv} & {dictionary.exportCsv}
      </h3>
      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
        You have recorded {state.transactions.length} entries totaling{" "}
        {Intl.NumberFormat(locale, { style: "currency", currency: state.preferences.primaryCurrency }).format(totalConverted)}.
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handleExport}
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 px-4 py-2 text-sm font-semibold text-white shadow hover:from-indigo-400 hover:to-purple-400"
        >
          <Download className="h-4 w-4" />
          {dictionary.exportCsv}
        </button>
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-dashed border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-600 transition hover:border-indigo-200 hover:text-indigo-500 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-indigo-500/40 dark:hover:text-indigo-200">
          <Upload className="h-4 w-4" />
          {dictionary.importCsv}
          <input
            ref={inputRef}
            type="file"
            accept=".csv"
            onChange={handleImport}
            className="sr-only"
          />
        </label>
      </div>
    </div>
  );
}
