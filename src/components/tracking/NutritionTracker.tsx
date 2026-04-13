"use client";

import { useState } from "react";
import { useTracker } from "@/context/TrackerContext";

interface Props {
  date: string;
  type: "calories" | "protein";
}

export default function NutritionTracker({ date, type }: Props) {
  const tracker = useTracker();
  const [addValue, setAddValue] = useState("");
  const [overrideValue, setOverrideValue] = useState("");
  const [showOverride, setShowOverride] = useState(false);

  const isCalories = type === "calories";
  const total = isCalories
    ? tracker.getCalorieTotal(date)
    : tracker.getProteinTotal(date);
  const day = tracker.getDay(date);
  const entries = isCalories ? day.calorieEntries : day.proteinEntries;
  const override = isCalories ? day.calorieOverride : day.proteinOverride;
  const unit = isCalories ? "cal" : "g";
  const label = isCalories ? "Calories" : "Protein";

  const canUndo = entries.length > 0 || override !== null;

  function handleAdd() {
    const num = parseFloat(addValue);
    if (isNaN(num) || num <= 0) return;
    if (isCalories) tracker.addCalories(date, num);
    else tracker.addProtein(date, num);
    setAddValue("");
  }

  function handleUndo() {
    if (isCalories) tracker.undoCalories(date);
    else tracker.undoProtein(date);
  }

  function handleOverride() {
    const num = parseFloat(overrideValue);
    if (isNaN(num) || num < 0) return;
    if (isCalories) tracker.overrideCalories(date, num);
    else tracker.overrideProtein(date, num);
    setOverrideValue("");
    setShowOverride(false);
  }

  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900 p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-200">{label}</h3>
        {override !== null && (
          <span className="rounded-full bg-amber-400/10 px-2.5 py-0.5 text-xs font-medium text-amber-400">
            Override
          </span>
        )}
      </div>

      <div
        className="mb-5 text-center"
        data-testid={`${type}-total`}
      >
        <span className="text-4xl font-bold text-white">{total}</span>
        <span className="ml-1.5 text-lg text-gray-500">{unit}</span>
      </div>

      {/* Add row */}
      <div className="mb-3 flex gap-2">
        <input
          type="number"
          placeholder={`Add ${unit}...`}
          value={addValue}
          onChange={(e) => setAddValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          className="flex-1 rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-white placeholder-gray-500 focus:border-cyan-400 focus:outline-none"
          data-testid={`${type}-input`}
        />
        <button
          onClick={handleAdd}
          className="rounded-lg bg-cyan-500 px-4 py-2 font-medium text-white transition-colors hover:bg-cyan-400"
          data-testid={`${type}-add-btn`}
        >
          Add
        </button>
        <button
          onClick={handleUndo}
          disabled={!canUndo}
          className="rounded-lg border border-red-500/30 px-3 py-2 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-30"
          data-testid={`${type}-undo-btn`}
        >
          Undo
        </button>
      </div>

      {/* Override toggle */}
      <div className="mb-4">
        <button
          onClick={() => setShowOverride(!showOverride)}
          className="text-sm text-gray-500 hover:text-gray-300"
        >
          {showOverride ? "Cancel" : "Set total manually"}
        </button>
        {showOverride && (
          <div className="mt-2 flex gap-2">
            <input
              type="number"
              placeholder={`Set total ${unit}...`}
              value={overrideValue}
              onChange={(e) => setOverrideValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleOverride()}
              className="flex-1 rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-white placeholder-gray-500 focus:border-amber-400 focus:outline-none"
            />
            <button
              onClick={handleOverride}
              className="rounded-lg bg-amber-500 px-4 py-2 font-medium text-white transition-colors hover:bg-amber-400"
            >
              Set
            </button>
          </div>
        )}
      </div>

      {/* Entry history */}
      {entries.length > 0 && (
        <div className={override !== null ? "opacity-40" : ""}>
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-gray-500">
            Entries
          </p>
          <div className="flex flex-wrap gap-1.5">
            {[...entries].reverse().map((entry) => (
              <span
                key={entry.id}
                className="rounded-md bg-gray-800 px-2 py-1 text-sm text-gray-300"
              >
                +{entry.value}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
