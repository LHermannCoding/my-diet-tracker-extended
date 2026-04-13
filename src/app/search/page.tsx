"use client";

import { useState } from "react";

interface FoodResult {
  fdcId: number;
  name: string;
  brand: string | null;
  calories: number;
  protein: number;
  servingSize: number;
  servingUnit: string;
}

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<FoodResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [savedIds, setSavedIds] = useState<Set<number>>(new Set());
  const [savingId, setSavingId] = useState<number | null>(null);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const res = await fetch(
        `/api/food-search?q=${encodeURIComponent(query.trim())}`
      );
      const data = await res.json();
      setResults(data.foods || []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(food: FoodResult) {
    setSavingId(food.fdcId);
    try {
      const res = await fetch("/api/saved-foods", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(food),
      });
      if (res.ok) {
        setSavedIds((prev) => new Set(prev).add(food.fdcId));
      }
    } finally {
      setSavingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Search Foods</h1>
      <p className="text-sm text-gray-500">
        Search the USDA food database for nutrition info and save your favorites.
      </p>

      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          placeholder="Search for a food (e.g. chicken breast, banana, oatmeal)..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 rounded-lg border border-gray-700 bg-gray-800 px-4 py-2.5 text-white placeholder-gray-500 focus:border-cyan-400 focus:outline-none"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-cyan-500 px-6 py-2.5 font-medium text-white transition-colors hover:bg-cyan-400 disabled:opacity-50"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {results.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm text-gray-500">
            {results.length} results found
          </p>
          {results.map((food) => (
            <div
              key={food.fdcId}
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
                      per {food.servingSize}
                      {food.servingUnit}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleSave(food)}
                  disabled={
                    savedIds.has(food.fdcId) || savingId === food.fdcId
                  }
                  className={`shrink-0 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                    savedIds.has(food.fdcId)
                      ? "bg-green-500/10 text-green-400"
                      : "bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20"
                  } disabled:cursor-not-allowed`}
                >
                  {savedIds.has(food.fdcId)
                    ? "Saved"
                    : savingId === food.fdcId
                      ? "Saving..."
                      : "Save"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && results.length === 0 && query && (
        <div className="rounded-xl border border-gray-800 bg-gray-900 p-8 text-center">
          <p className="text-gray-500">
            No results found. Try a different search term.
          </p>
        </div>
      )}
    </div>
  );
}
