"use client";

import Link from "next/link";
import { useTracker } from "@/context/TrackerContext";
import { formatDisplayDate } from "@/lib/dates";

export default function HistoryPage() {
  const { state, getCalorieTotal, getProteinTotal } = useTracker();

  const sortedDates = Object.keys(state.days)
    .filter(
      (d) =>
        getCalorieTotal(d) > 0 ||
        getProteinTotal(d) > 0 ||
        state.days[d].workout
    )
    .sort((a, b) => b.localeCompare(a));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">History</h1>

      {sortedDates.length === 0 ? (
        <div className="rounded-xl border border-gray-800 bg-gray-900 p-8 text-center">
          <p className="text-gray-500">No data logged yet.</p>
          <Link
            href="/"
            className="mt-2 inline-block text-sm text-cyan-400 hover:text-cyan-300"
          >
            Start tracking on the dashboard
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedDates.map((date) => {
            const cal = getCalorieTotal(date);
            const pro = getProteinTotal(date);
            const workout = state.days[date].workout;

            return (
              <Link
                key={date}
                href={`/day/${date}`}
                className="block rounded-xl border border-gray-800 bg-gray-900 p-4 transition-colors hover:border-gray-700"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-white">
                    {formatDisplayDate(date)}
                  </span>
                  <span className="text-xs text-gray-500">{date}</span>
                </div>
                <div className="mt-2 flex gap-4 text-sm">
                  <span className="text-gray-400">
                    <span className="text-cyan-400">{cal}</span> cal
                  </span>
                  <span className="text-gray-400">
                    <span className="text-cyan-400">{pro}</span>g protein
                  </span>
                  {workout && (
                    <span className="truncate text-gray-500">
                      {workout}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
