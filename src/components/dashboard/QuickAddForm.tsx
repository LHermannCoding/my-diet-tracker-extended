"use client";

import { useState } from "react";
import { useTracker } from "@/context/TrackerContext";

interface Props {
  date: string;
  type: "calories" | "protein";
}

export default function QuickAddForm({ date, type }: Props) {
  const tracker = useTracker();
  const [value, setValue] = useState("");

  const isCalories = type === "calories";
  const unit = isCalories ? "cal" : "g";
  const label = isCalories ? "Calories" : "Protein";
  const total = isCalories
    ? tracker.getCalorieTotal(date)
    : tracker.getProteinTotal(date);
  const goal = isCalories
    ? tracker.state.goals.dailyCalories
    : tracker.state.goals.dailyProtein;
  const pct = goal > 0 ? Math.min((total / goal) * 100, 100) : 0;

  function handleAdd() {
    const num = parseFloat(value);
    if (isNaN(num) || num <= 0) return;
    if (isCalories) tracker.addCalories(date, num);
    else tracker.addProtein(date, num);
    setValue("");
  }

  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900 p-4">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-medium text-gray-400">{label}</span>
        <span className="text-sm text-gray-500">
          {total} / {goal} {unit}
        </span>
      </div>

      {/* Progress bar */}
      <div className="mb-3 h-2 overflow-hidden rounded-full bg-gray-800">
        <div
          className="h-full rounded-full bg-cyan-500 transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>

      <div
        className="mb-1 text-center"
        data-testid={`quick-${type}-total`}
      >
        <span className="text-2xl font-bold text-white">{total}</span>
        <span className="ml-1 text-sm text-gray-500">{unit}</span>
      </div>

      <div className="flex gap-2">
        <input
          type="number"
          placeholder={`Add ${unit}...`}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          className="flex-1 rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-cyan-400 focus:outline-none"
          data-testid={`quick-${type}-input`}
        />
        <button
          onClick={handleAdd}
          className="rounded-lg bg-cyan-500 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-cyan-400"
          data-testid={`quick-${type}-add-btn`}
        >
          Add
        </button>
      </div>
    </div>
  );
}
