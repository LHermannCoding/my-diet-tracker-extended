"use client";

import { useEffect, useState } from "react";
import { today } from "@/lib/dates";

interface SavedFood {
  id: string;
  fdc_id: number;
  name: string;
  brand: string | null;
  calories: number;
  protein: number;
  serving_size: number;
  serving_unit: string;
  created_at: string;
}

export default function SavedFoodsPage() {
  const [foods, setFoods] = useState<SavedFood[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingId, setAddingId] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchSavedFoods();
  }, []);

  async function fetchSavedFoods() {
    try {
      const res = await fetch("/api/saved-foods");
      const data = await res.json();
      setFoods(data.foods || []);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddToLog(food: SavedFood) {
    setAddingId(food.id);
    try {
      const res = await fetch("/api/food-log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: today(),
          name: food.name,
          calories: food.calories,
          protein: food.protein,
          servings: 1,
        }),
      });
      if (res.ok) {
        setMessage(`Added ${food.name} to today's log`);
        setTimeout(() => setMessage(null), 2000);
      }
    } finally {
      setAddingId(null);
    }
  }

  async function handleRemove(id: string) {
    setRemovingId(id);
    try {
      const res = await fetch(`/api/saved-foods?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setFoods((prev) => prev.filter((f) => f.id !== id));
      }
    } finally {
      setRemovingId(null);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <p className="text-gray-500">Loading saved foods...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Saved Foods</h1>
      <p className="text-sm text-gray-500">
        Your favorite foods. Quick-add them to today&apos;s log.
      </p>

      {message && (
        <div className="rounded-lg bg-green-500/10 px-4 py-2 text-sm text-green-400">
          {message}
        </div>
      )}

      {foods.length === 0 ? (
        <div className="rounded-xl border border-gray-800 bg-gray-900 p-8 text-center">
          <p className="text-gray-500">No saved foods yet.</p>
          <a
            href="/search"
            className="mt-2 inline-block text-sm text-cyan-400 hover:text-cyan-300"
          >
            Search and save some foods
          </a>
        </div>
      ) : (
        <div className="space-y-3">
          {foods.map((food) => (
            <div
              key={food.id}
              className="rounded-xl border border-gray-800 bg-gray-900 p-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <h3 className="font-medium text-white">{food.name}</h3>
                  {food.brand && (
                    <p className="text-sm text-gray-500">{food.brand}</p>
                  )}
                  <div className="mt-2 flex gap-4 text-sm">
                    <span className="text-gray-400">
                      <span className="font-medium text-cyan-400">
                        {food.calories}
                      </span>{" "}
                      cal
                    </span>
                    <span className="text-gray-400">
                      <span className="font-medium text-green-400">
                        {food.protein}g
                      </span>{" "}
                      protein
                    </span>
                    <span className="text-gray-500">
                      per {food.serving_size}
                      {food.serving_unit}
                    </span>
                  </div>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button
                    onClick={() => handleAddToLog(food)}
                    disabled={addingId === food.id}
                    className="rounded-lg bg-cyan-500/10 px-3 py-2 text-sm font-medium text-cyan-400 transition-colors hover:bg-cyan-500/20 disabled:opacity-50"
                  >
                    {addingId === food.id ? "Adding..." : "+ Log Today"}
                  </button>
                  <button
                    onClick={() => handleRemove(food.id)}
                    disabled={removingId === food.id}
                    className="rounded-lg bg-red-500/10 px-3 py-2 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/20 disabled:opacity-50"
                  >
                    {removingId === food.id ? "..." : "Remove"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
