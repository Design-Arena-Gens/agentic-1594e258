"use client";

import { useFinance } from "@/context/FinanceContext";
import { useLocale } from "@/context/LocaleContext";
import { supportedCurrencies } from "@/lib/currencies";
import { translations } from "@/lib/translations";
import { Globe2, IndianRupee, Languages, SunDim, MoonStar } from "lucide-react";
import { useEffect } from "react";

export function LanguageCurrencyBar() {
  const { state, dispatch } = useFinance();
  const { locale, setLocale, locales } = useLocale();
  const dictionary = translations[locale];
  const isDark = state.preferences.darkMode;

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-zinc-200 bg-white/80 p-4 shadow-sm backdrop-blur dark:border-zinc-700 dark:bg-zinc-900/80">
      <div className="flex items-center gap-2 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
        <Globe2 className="h-5 w-5 text-indigo-500" />
        <span>{dictionary.appName}</span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-800">
          <Languages className="h-4 w-4 text-indigo-500" />
          <select
            className="bg-transparent text-sm outline-none dark:text-zinc-100"
            value={locale}
            onChange={(event) => {
              const nextLocale = event.target.value as typeof locale;
              setLocale(nextLocale);
              dispatch({
                type: "update-preferences",
                payload: { locale: nextLocale },
              });
            }}
          >
            {locales.map((entry) => (
              <option key={entry.code} value={entry.code}>
                {entry.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-800">
          <IndianRupee className="h-4 w-4 text-indigo-500" />
          <select
            className="bg-transparent text-sm outline-none dark:text-zinc-100"
            value={state.preferences.primaryCurrency}
            onChange={(event) =>
              dispatch({
                type: "update-preferences",
                payload: { primaryCurrency: event.target.value },
              })
            }
          >
            {supportedCurrencies.map((currency) => (
              <option key={currency.code} value={currency.code}>
                {currency.symbol} {currency.code}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          onClick={() =>
            dispatch({
              type: "update-preferences",
              payload: { darkMode: !isDark },
            })
          }
          className="flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-sm font-medium text-zinc-800 transition hover:border-indigo-100 hover:text-indigo-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:border-indigo-500/40 dark:hover:text-indigo-300"
        >
          {isDark ? <SunDim className="h-4 w-4" /> : <MoonStar className="h-4 w-4" />}
          <span>{isDark ? "Light" : "Dark"}</span>
        </button>
      </div>
    </div>
  );
}
