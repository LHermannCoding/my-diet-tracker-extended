"use client";

import { use } from "react";
import { formatDisplayDate } from "@/lib/dates";
import NutritionTracker from "@/components/tracking/NutritionTracker";
import WorkoutEntry from "@/components/tracking/WorkoutEntry";
import Link from "next/link";

export default function DayDetailPage({
  params,
}: {
  params: Promise<{ date: string }>;
}) {
  const { date } = use(params);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white" data-testid="day-heading">
            {formatDisplayDate(date)}
          </h1>
          <p className="text-sm text-gray-500">{date}</p>
        </div>
        <Link
          href="/"
          className="rounded-lg border border-gray-700 px-3 py-1.5 text-sm text-gray-400 transition-colors hover:border-gray-600 hover:text-gray-200"
        >
          Back
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <NutritionTracker date={date} type="calories" />
        <NutritionTracker date={date} type="protein" />
      </div>

      <WorkoutEntry date={date} />
    </div>
  );
}
