"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { supportedLocales, t, type LocaleKey } from "@/lib/translations";

type LocaleContextValue = {
  locale: LocaleKey;
  setLocale: (next: LocaleKey) => void;
  translate: typeof t;
  locales: typeof supportedLocales;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<LocaleKey>(() => {
    if (typeof window === "undefined") return "en-IN";
    const stored = window.localStorage.getItem("flowwise-locale") as LocaleKey | null;
    return stored && supportedLocales.some((entry) => entry.code === stored) ? stored : "en-IN";
  });

  const setLocale = useCallback((next: LocaleKey) => {
    setLocaleState(next);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("flowwise-locale", next);
    }
  }, []);

  const value = useMemo<LocaleContextValue>(() => {
    return {
      locale,
      setLocale,
      translate: t,
      locales: supportedLocales,
    };
  }, [locale, setLocale]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error("useLocale must be used within LocaleProvider");
  }
  return ctx;
}
