"use client";

import { FinanceProvider } from "@/context/FinanceContext";
import { LocaleProvider } from "@/context/LocaleContext";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <LocaleProvider>
      <FinanceProvider>{children}</FinanceProvider>
    </LocaleProvider>
  );
}
