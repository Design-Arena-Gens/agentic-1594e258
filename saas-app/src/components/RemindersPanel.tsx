"use client";

import { useFinance } from "@/context/FinanceContext";
import { useLocale } from "@/context/LocaleContext";
import { translations } from "@/lib/translations";
import { CheckCircle2, Clock8, Plus } from "lucide-react";
import { useState } from "react";

export function RemindersPanel() {
  const { state, dispatch } = useFinance();
  const { locale } = useLocale();
  const dictionary = translations[locale];
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const now = new Date();

  function addReminder(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!title.trim()) return;
    dispatch({
      type: "add-reminder",
      payload: {
        id: crypto.randomUUID(),
        title,
        dueDate: new Date(date).toISOString(),
        completed: false,
      },
    });
    setTitle("");
  }

  return (
    <div className="rounded-3xl border border-zinc-200 bg-white/75 p-6 shadow-lg backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/70">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            {dictionary.quickReminders}
          </h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Gentle nudges for bills, renewals, and habits.
          </p>
        </div>
        <Clock8 className="h-6 w-6 text-sky-500" />
      </div>

      <form onSubmit={addReminder} className="mt-4 flex gap-2">
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Pay rent, recharge FASTag..."
          className="flex-1 rounded-2xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-sky-400 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
        />
        <input
          type="date"
          value={date}
          onChange={(event) => setDate(event.target.value)}
          className="rounded-2xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-sky-400 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
        />
        <button
          type="submit"
          className="flex items-center gap-2 rounded-2xl bg-sky-500 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-sky-400"
        >
          <Plus className="h-4 w-4" /> Add
        </button>
      </form>

      <ul className="mt-5 space-y-3">
        {state.reminders.map((reminder) => {
          const dueIn =
            Math.round(
              (new Date(reminder.dueDate).getTime() - now.getTime()) /
                (1000 * 60 * 60 * 24),
            ) || 0;
          return (
            <li
              key={reminder.id}
              className="flex items-center justify-between rounded-2xl border border-transparent bg-sky-500/10 px-4 py-3 text-sm text-sky-700 dark:bg-sky-500/5 dark:text-sky-200"
            >
              <div>
                <p className="font-medium">{reminder.title}</p>
                <p className="text-xs">
                  {new Date(reminder.dueDate).toLocaleDateString(locale)} ·{" "}
                  {dueIn >= 0 ? `${dueIn} days left` : `Overdue by ${Math.abs(dueIn)} days`}
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  dispatch({
                    type: "update-reminder",
                    payload: { ...reminder, completed: !reminder.completed },
                  })
                }
                className="rounded-full border border-sky-300 p-2 text-sky-500 transition hover:bg-white dark:border-sky-500/50 dark:hover:bg-sky-500/20"
              >
                <CheckCircle2
                  className={`h-5 w-5 ${
                    reminder.completed ? "fill-sky-500 text-white dark:text-sky-100" : ""
                  }`}
                />
              </button>
            </li>
          );
        })}
        {state.reminders.length === 0 && (
          <li className="rounded-2xl border border-dashed border-zinc-200 p-6 text-center text-sm text-zinc-400 dark:border-zinc-700">
            Stay on top of bills and renewals by adding a quick reminder.
          </li>
        )}
      </ul>
    </div>
  );
}
