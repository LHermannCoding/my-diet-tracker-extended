"use client";

import { useState } from "react";
import { useTracker } from "@/context/TrackerContext";

export default function SettingsPage() {
  const { state, setGoals } = useTracker();
  const [calGoal, setCalGoal] = useState(String(state.goals.dailyCalories));
  const [proGoal, setProGoal] = useState(String(state.goals.dailyProtein));
  const [saved, setSaved] = useState(false);

  function handleSave() {
    const cal = parseInt(calGoal);
    const pro = parseInt(proGoal);
    if (!isNaN(cal) && cal > 0) setGoals({ dailyCalories: cal });
    if (!isNaN(pro) && pro > 0) setGoals({ dailyProtein: pro });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Settings</h1>

      <div className="rounded-xl border border-gray-800 bg-gray-900 p-5">
        <h2 className="mb-4 text-lg font-semibold text-gray-200">
          Daily Goals
        </h2>

        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm text-gray-400">
              Daily Calorie Target
            </label>
            <input
              type="number"
              value={calGoal}
              onChange={(e) => setCalGoal(e.target.value)}
              className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-white focus:border-cyan-400 focus:outline-none"
              data-testid="calorie-goal-input"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-gray-400">
              Daily Protein Target (g)
            </label>
            <input
              type="number"
              value={proGoal}
              onChange={(e) => setProGoal(e.target.value)}
              className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-white focus:border-cyan-400 focus:outline-none"
              data-testid="protein-goal-input"
            />
          </div>

          <button
            onClick={handleSave}
            className="rounded-lg bg-cyan-500 px-6 py-2 font-medium text-white transition-colors hover:bg-cyan-400"
            data-testid="save-goals-btn"
          >
            Save Goals
          </button>

          {saved && (
            <p className="text-sm text-green-400">Goals saved!</p>
          )}
        </div>
      </div>
    </div>
  );
}
