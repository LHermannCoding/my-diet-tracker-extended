"use client";

import { useTracker } from "@/context/TrackerContext";

interface Props {
  date: string;
}

export default function WorkoutEntry({ date }: Props) {
  const { getDay, setWorkout } = useTracker();
  const day = getDay(date);

  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900 p-5">
      <h3 className="mb-3 text-lg font-semibold text-gray-200">Workout</h3>
      <textarea
        placeholder="What did you do today? e.g., Chest day - bench press, incline press..."
        value={day.workout}
        onChange={(e) => setWorkout(date, e.target.value)}
        rows={3}
        className="w-full resize-none rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-white placeholder-gray-500 focus:border-cyan-400 focus:outline-none"
        data-testid="workout-input"
      />
    </div>
  );
}
