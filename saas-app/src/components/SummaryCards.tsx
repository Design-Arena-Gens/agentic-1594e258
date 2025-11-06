"use client";

import { useFinance } from "@/context/FinanceContext";
import { useLocale } from "@/context/LocaleContext";
import { formatCurrency } from "@/lib/format";
import { translations } from "@/lib/translations";
import { ArrowDownCircle, ArrowUpCircle, Wallet, RefreshCcw } from "lucide-react";

const cardStyles = [
  "from-emerald-500/90 to-emerald-600/60",
  "from-sky-500/90 to-sky-600/60",
  "from-violet-500/90 to-violet-600/60",
  "from-amber-500/90 to-amber-600/60",
];

export function SummaryCards() {
  const { totals, state } = useFinance();
  const { locale } = useLocale();
  const dictionary = translations[locale];
  const currency = state.preferences.primaryCurrency;

  const cards = [
    {
      icon: Wallet,
      label: dictionary.balance,
      value: formatCurrency(totals.balance, currency, locale),
    },
    {
      icon: ArrowDownCircle,
      label: dictionary.income,
      value: formatCurrency(totals.income, currency, locale),
    },
    {
      icon: ArrowUpCircle,
      label: dictionary.expenses,
      value: formatCurrency(totals.expenses, currency, locale),
    },
    {
      icon: RefreshCcw,
      label: dictionary.recurring,
      value: `${totals.recurringCount}`,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card, index) => (
        <div
          key={card.label}
          className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${cardStyles[index]} p-5 text-white shadow-lg transition hover:scale-[1.01]`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-wide text-white/80">
                {card.label}
              </p>
              <p className="mt-2 text-2xl font-semibold">{card.value}</p>
            </div>
            <card.icon className="h-10 w-10 text-white/60" />
          </div>
        </div>
      ))}
    </div>
  );
}
