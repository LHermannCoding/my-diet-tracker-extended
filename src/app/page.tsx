"use client";

import { today, formatDisplayDate } from "@/lib/dates";
import { useTracker } from "@/context/TrackerContext";
import QuickAddForm from "@/components/dashboard/QuickAddForm";
import WeekStrip from "@/components/dashboard/WeekStrip";
import Link from "next/link";

export default function DashboardPage() {
  const todayKey = today();
  const tracker = useTracker();
  const day = tracker.getDay(todayKey);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-sm text-gray-500">{formatDisplayDate(todayKey)}</p>
        </div>
        <Link
          href={`/day/${todayKey}`}
          className="rounded-lg bg-cyan-500/10 px-4 py-2 text-sm font-medium text-cyan-400 transition-colors hover:bg-cyan-500/20"
        >
          Full Day View
        </Link>
      </div>

      <WeekStrip />

      <div className="grid gap-4 sm:grid-cols-2">
        <QuickAddForm date={todayKey} type="calories" />
        <QuickAddForm date={todayKey} type="protein" />
      </div>

      {/* Today's workout summary */}
      <div className="rounded-xl border border-gray-800 bg-gray-900 p-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-medium text-gray-400">
            Today&apos;s Workout
          </span>
          <Link
            href={`/day/${todayKey}`}
            className="text-xs text-cyan-400 hover:text-cyan-300"
          >
            Edit
          </Link>
        </div>
        <p className="text-gray-300">
          {day.workout || (
            <span className="text-gray-600">No workout logged yet</span>
          )}
        </p>
      </div>
    </div>
  );
}
