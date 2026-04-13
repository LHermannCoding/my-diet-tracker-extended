"use client";

import Link from "next/link";
import { useTracker } from "@/context/TrackerContext";
import { getWeekDates, today } from "@/lib/dates";

export default function WeekStrip() {
  const tracker = useTracker();
  const todayKey = today();
  const weekDates = getWeekDates(todayKey);
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {weekDates.map((dateKey) => {
        const [, , d] = dateKey.split("-");
        const dayOfWeek = new Date(
          +dateKey.slice(0, 4),
          +dateKey.slice(5, 7) - 1,
          +dateKey.slice(8, 10)
        ).getDay();
        const isToday = dateKey === todayKey;
        const cal = tracker.getCalorieTotal(dateKey);
        const pro = tracker.getProteinTotal(dateKey);
        const hasData = cal > 0 || pro > 0;

        return (
          <Link
            key={dateKey}
            href={`/day/${dateKey}`}
            className={`flex min-w-[4.5rem] flex-col items-center rounded-xl border p-2.5 transition-colors ${
              isToday
                ? "border-cyan-400/50 bg-cyan-400/5"
                : "border-gray-800 bg-gray-900 hover:border-gray-700"
            }`}
          >
            <span className="text-xs text-gray-500">{dayNames[dayOfWeek]}</span>
            <span
              className={`text-lg font-semibold ${
                isToday ? "text-cyan-400" : "text-white"
              }`}
            >
              {parseInt(d)}
            </span>
            {hasData && (
              <div className="mt-1 h-1.5 w-1.5 rounded-full bg-cyan-400" />
            )}
          </Link>
        );
      })}
    </div>
  );
}
