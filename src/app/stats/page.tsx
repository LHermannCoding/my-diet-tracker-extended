"use client";

import { useTracker } from "@/context/TrackerContext";
import { today, toDateKey, formatDisplayDate } from "@/lib/dates";

export default function StatsPage() {
  const tracker = useTracker();
  const todayKey = today();

  // Get last 7 days
  const last7: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    last7.push(toDateKey(d));
  }

  const calTotals = last7.map((d) => tracker.getCalorieTotal(d));
  const proTotals = last7.map((d) => tracker.getProteinTotal(d));

  const avgCal = Math.round(
    calTotals.reduce((a, b) => a + b, 0) / 7
  );
  const avgPro = Math.round(
    proTotals.reduce((a, b) => a + b, 0) / 7
  );
  const maxCal = Math.max(...calTotals, 1);
  const maxPro = Math.max(...proTotals, 1);

  // Streak: consecutive days with any data
  let streak = 0;
  for (let i = 0; ; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = toDateKey(d);
    const cal = tracker.getCalorieTotal(key);
    const pro = tracker.getProteinTotal(key);
    const day = tracker.getDay(key);
    if (cal > 0 || pro > 0 || day.workout) streak++;
    else break;
  }

  const { goals } = tracker.state;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Stats</h1>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-gray-800 bg-gray-900 p-4 text-center">
          <p className="text-xs uppercase tracking-wider text-gray-500">
            Avg Calories
          </p>
          <p className="mt-1 text-2xl font-bold text-white">{avgCal}</p>
          <p className="text-xs text-gray-500">/ {goals.dailyCalories}</p>
        </div>
        <div className="rounded-xl border border-gray-800 bg-gray-900 p-4 text-center">
          <p className="text-xs uppercase tracking-wider text-gray-500">
            Avg Protein
          </p>
          <p className="mt-1 text-2xl font-bold text-white">{avgPro}</p>
          <p className="text-xs text-gray-500">/ {goals.dailyProtein}g</p>
        </div>
        <div className="rounded-xl border border-gray-800 bg-gray-900 p-4 text-center">
          <p className="text-xs uppercase tracking-wider text-gray-500">
            Streak
          </p>
          <p className="mt-1 text-2xl font-bold text-cyan-400">{streak}</p>
          <p className="text-xs text-gray-500">days</p>
        </div>
      </div>

      {/* Calorie chart */}
      <div className="rounded-xl border border-gray-800 bg-gray-900 p-4">
        <h2 className="mb-3 text-sm font-medium text-gray-400">
          Calories — Last 7 Days
        </h2>
        <div className="space-y-2">
          {last7.map((d, i) => {
            const pct = (calTotals[i] / maxCal) * 100;
            const isToday = d === todayKey;
            return (
              <div key={d} className="flex items-center gap-3">
                <span
                  className={`w-16 text-right text-xs ${
                    isToday ? "font-semibold text-cyan-400" : "text-gray-500"
                  }`}
                >
                  {formatDisplayDate(d).split(",")[0]}
                </span>
                <div className="flex-1">
                  <div className="h-5 overflow-hidden rounded bg-gray-800">
                    <div
                      className={`h-full rounded transition-all ${
                        isToday ? "bg-cyan-500" : "bg-cyan-500/50"
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
                <span className="w-12 text-right text-xs text-gray-400">
                  {calTotals[i]}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Protein chart */}
      <div className="rounded-xl border border-gray-800 bg-gray-900 p-4">
        <h2 className="mb-3 text-sm font-medium text-gray-400">
          Protein — Last 7 Days
        </h2>
        <div className="space-y-2">
          {last7.map((d, i) => {
            const pct = (proTotals[i] / maxPro) * 100;
            const isToday = d === todayKey;
            return (
              <div key={d} className="flex items-center gap-3">
                <span
                  className={`w-16 text-right text-xs ${
                    isToday ? "font-semibold text-cyan-400" : "text-gray-500"
                  }`}
                >
                  {formatDisplayDate(d).split(",")[0]}
                </span>
                <div className="flex-1">
                  <div className="h-5 overflow-hidden rounded bg-gray-800">
                    <div
                      className={`h-full rounded transition-all ${
                        isToday ? "bg-green-500" : "bg-green-500/50"
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
                <span className="w-12 text-right text-xs text-gray-400">
                  {proTotals[i]}g
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
