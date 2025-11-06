"use client";

import { LanguageCurrencyBar } from "@/components/LanguageCurrencyBar";
import { WelcomeBanner } from "@/components/WelcomeBanner";
import { SummaryCards } from "@/components/SummaryCards";
import { TransactionForm } from "@/components/TransactionForm";
import { TransactionTable } from "@/components/TransactionTable";
import { BudgetsPanel } from "@/components/BudgetsPanel";
import { GoalsPanel } from "@/components/GoalsPanel";
import { RemindersPanel } from "@/components/RemindersPanel";
import { AnalyticsPanel } from "@/components/AnalyticsPanel";
import { QuickActions } from "@/components/QuickActions";

export default function Home() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#dfe9ff,_#fdf2ff_45%,_#ffffff)] px-4 py-8 dark:bg-[radial-gradient(circle_at_top,_#0f172a,_#111827_55%,_#030712)]">
      <div className="mx-auto max-w-6xl space-y-6">
        <LanguageCurrencyBar />
        <WelcomeBanner />
        <SummaryCards />

        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <TransactionForm />
          <QuickActions />
        </div>

        <div className="grid gap-6 lg:grid-cols-[3fr_1fr]">
          <TransactionTable />
          <div className="space-y-6">
            <BudgetsPanel />
            <GoalsPanel />
            <RemindersPanel />
          </div>
        </div>

        <AnalyticsPanel />
      </div>
    </main>
  );
}
