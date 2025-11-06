"use client";

import { useLocale } from "@/context/LocaleContext";
import { translations } from "@/lib/translations";
import { CalendarDays, Sparkle } from "lucide-react";

export function WelcomeBanner() {
  const { locale } = useLocale();
  const dictionary = translations[locale];

  return (
    <div className="relative overflow-hidden rounded-3xl border border-indigo-100 bg-gradient-to-r from-indigo-600 via-purple-600 to-sky-500 p-8 text-white shadow-2xl">
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider">
            <Sparkle className="h-4 w-4" />
            Flowwise AI Insights
          </span>
          <h1 className="mt-4 text-3xl font-bold md:text-4xl">
            {dictionary.appName}
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-white/90 md:text-base">
            {dictionary.tagline}
          </p>
        </div>
        <div className="flex flex-col gap-2 rounded-2xl bg-white/15 p-4 text-sm backdrop-blur">
          <p className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-white/80" />
            <span>
              {new Intl.DateTimeFormat(locale, {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
              }).format(new Date())}
            </span>
          </p>
          <p className="text-white/80">
            Stay consistent with smart nudges and personal insights every week.
          </p>
        </div>
      </div>
    </div>
  );
}
