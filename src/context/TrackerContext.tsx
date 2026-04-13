"use client";

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type { DayData, Goals, NutritionEntry, TrackerState } from "@/types";
import { generateId } from "@/lib/ids";
import { useAuth } from "@clerk/nextjs";

const DEFAULT_GOALS: Goals = { dailyCalories: 2000, dailyProtein: 150 };

function emptyDay(date: string): DayData {
  return {
    date,
    calorieEntries: [],
    proteinEntries: [],
    calorieOverride: null,
    proteinOverride: null,
    workout: "",
  };
}

type Action =
  | { type: "ADD_CALORIES"; date: string; value: number }
  | { type: "UNDO_CALORIES"; date: string }
  | { type: "OVERRIDE_CALORIES"; date: string; value: number }
  | { type: "ADD_PROTEIN"; date: string; value: number }
  | { type: "UNDO_PROTEIN"; date: string }
  | { type: "OVERRIDE_PROTEIN"; date: string; value: number }
  | { type: "SET_WORKOUT"; date: string; text: string }
  | { type: "SET_GOALS"; goals: Partial<Goals> }
  | { type: "LOAD_DAY"; date: string; calories: number; protein: number }
  | { type: "LOAD_GOALS"; goals: Goals };

function getDay(state: TrackerState, date: string): DayData {
  return state.days[date] ?? emptyDay(date);
}

function reducer(state: TrackerState, action: Action): TrackerState {
  switch (action.type) {
    case "ADD_CALORIES": {
      const day = getDay(state, action.date);
      const entry: NutritionEntry = {
        id: generateId(),
        value: action.value,
        timestamp: Date.now(),
      };
      return {
        ...state,
        days: {
          ...state.days,
          [action.date]: {
            ...day,
            calorieEntries: [...day.calorieEntries, entry],
            calorieOverride: null,
          },
        },
      };
    }
    case "UNDO_CALORIES": {
      const day = getDay(state, action.date);
      if (day.calorieOverride !== null) {
        return {
          ...state,
          days: {
            ...state.days,
            [action.date]: { ...day, calorieOverride: null },
          },
        };
      }
      return {
        ...state,
        days: {
          ...state.days,
          [action.date]: {
            ...day,
            calorieEntries: day.calorieEntries.slice(0, -1),
          },
        },
      };
    }
    case "OVERRIDE_CALORIES": {
      const day = getDay(state, action.date);
      return {
        ...state,
        days: {
          ...state.days,
          [action.date]: { ...day, calorieOverride: action.value },
        },
      };
    }
    case "ADD_PROTEIN": {
      const day = getDay(state, action.date);
      const entry: NutritionEntry = {
        id: generateId(),
        value: action.value,
        timestamp: Date.now(),
      };
      return {
        ...state,
        days: {
          ...state.days,
          [action.date]: {
            ...day,
            proteinEntries: [...day.proteinEntries, entry],
            proteinOverride: null,
          },
        },
      };
    }
    case "UNDO_PROTEIN": {
      const day = getDay(state, action.date);
      if (day.proteinOverride !== null) {
        return {
          ...state,
          days: {
            ...state.days,
            [action.date]: { ...day, proteinOverride: null },
          },
        };
      }
      return {
        ...state,
        days: {
          ...state.days,
          [action.date]: {
            ...day,
            proteinEntries: day.proteinEntries.slice(0, -1),
          },
        },
      };
    }
    case "OVERRIDE_PROTEIN": {
      const day = getDay(state, action.date);
      return {
        ...state,
        days: {
          ...state.days,
          [action.date]: { ...day, proteinOverride: action.value },
        },
      };
    }
    case "SET_WORKOUT": {
      const day = getDay(state, action.date);
      return {
        ...state,
        days: {
          ...state.days,
          [action.date]: { ...day, workout: action.text },
        },
      };
    }
    case "SET_GOALS": {
      return {
        ...state,
        goals: { ...state.goals, ...action.goals },
      };
    }
    case "LOAD_DAY": {
      const day = getDay(state, action.date);
      return {
        ...state,
        days: {
          ...state.days,
          [action.date]: {
            ...day,
            calorieOverride: action.calories,
            proteinOverride: action.protein,
          },
        },
      };
    }
    case "LOAD_GOALS": {
      return { ...state, goals: action.goals };
    }
    default:
      return state;
  }
}

interface TrackerContextValue {
  state: TrackerState;
  getDay: (date: string) => DayData;
  getCalorieTotal: (date: string) => number;
  getProteinTotal: (date: string) => number;
  addCalories: (date: string, value: number) => void;
  undoCalories: (date: string) => void;
  overrideCalories: (date: string, value: number) => void;
  addProtein: (date: string, value: number) => void;
  undoProtein: (date: string) => void;
  overrideProtein: (date: string, value: number) => void;
  setWorkout: (date: string, text: string) => void;
  setGoals: (goals: Partial<Goals>) => void;
  loadDayFromDb: (date: string) => Promise<void>;
}

const TrackerContext = createContext<TrackerContextValue | null>(null);

export function TrackerProvider({ children }: { children: ReactNode }) {
  const { isSignedIn } = useAuth();
  const [state, dispatch] = useReducer(reducer, {
    days: {},
    goals: DEFAULT_GOALS,
  });

  // Load goals from Supabase on mount
  useEffect(() => {
    if (!isSignedIn) return;
    fetch("/api/goals")
      .then((res) => res.json())
      .then((data) => {
        if (data.goals) {
          dispatch({
            type: "LOAD_GOALS",
            goals: {
              dailyCalories: data.goals.daily_calories ?? 2000,
              dailyProtein: data.goals.daily_protein ?? 150,
            },
          });
        }
      })
      .catch(() => {});
  }, [isSignedIn]);

  const loadDayFromDb = useCallback(
    async (date: string) => {
      if (!isSignedIn) return;
      try {
        const res = await fetch(`/api/food-log?date=${date}`);
        const data = await res.json();
        const entries = data.entries || [];
        const totalCal = entries.reduce(
          (sum: number, e: { calories: number; servings: number }) =>
            sum + e.calories * e.servings,
          0
        );
        const totalPro = entries.reduce(
          (sum: number, e: { protein: number; servings: number }) =>
            sum + e.protein * e.servings,
          0
        );
        dispatch({
          type: "LOAD_DAY",
          date,
          calories: Math.round(totalCal),
          protein: Math.round(totalPro * 10) / 10,
        });
      } catch {
        // Silently fail — local state still works
      }
    },
    [isSignedIn]
  );

  const addCaloriesWithSync = useCallback(
    (date: string, value: number) => {
      dispatch({ type: "ADD_CALORIES", date, value });
      if (isSignedIn) {
        fetch("/api/food-log", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            date,
            name: "Quick add",
            calories: value,
            protein: 0,
            servings: 1,
          }),
        }).catch(() => {});
      }
    },
    [isSignedIn]
  );

  const addProteinWithSync = useCallback(
    (date: string, value: number) => {
      dispatch({ type: "ADD_PROTEIN", date, value });
      if (isSignedIn) {
        fetch("/api/food-log", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            date,
            name: "Quick add",
            calories: 0,
            protein: value,
            servings: 1,
          }),
        }).catch(() => {});
      }
    },
    [isSignedIn]
  );

  const setGoalsWithSync = useCallback(
    (goals: Partial<Goals>) => {
      dispatch({ type: "SET_GOALS", goals });
      if (isSignedIn) {
        const merged = { ...state.goals, ...goals };
        fetch("/api/goals", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            dailyCalories: merged.dailyCalories,
            dailyProtein: merged.dailyProtein,
          }),
        }).catch(() => {});
      }
    },
    [isSignedIn, state.goals]
  );

  const value: TrackerContextValue = {
    state,
    getDay: (date) => getDay(state, date),
    getCalorieTotal: (date) => {
      const day = getDay(state, date);
      if (day.calorieOverride !== null) return day.calorieOverride;
      return day.calorieEntries.reduce((sum, e) => sum + e.value, 0);
    },
    getProteinTotal: (date) => {
      const day = getDay(state, date);
      if (day.proteinOverride !== null) return day.proteinOverride;
      return day.proteinEntries.reduce((sum, e) => sum + e.value, 0);
    },
    addCalories: addCaloriesWithSync,
    undoCalories: (date) => dispatch({ type: "UNDO_CALORIES", date }),
    overrideCalories: (date, value) =>
      dispatch({ type: "OVERRIDE_CALORIES", date, value }),
    addProtein: addProteinWithSync,
    undoProtein: (date) => dispatch({ type: "UNDO_PROTEIN", date }),
    overrideProtein: (date, value) =>
      dispatch({ type: "OVERRIDE_PROTEIN", date, value }),
    setWorkout: (date, text) => dispatch({ type: "SET_WORKOUT", date, text }),
    setGoals: setGoalsWithSync,
    loadDayFromDb,
  };

  return (
    <TrackerContext.Provider value={value}>{children}</TrackerContext.Provider>
  );
}

export function useTracker() {
  const ctx = useContext(TrackerContext);
  if (!ctx) throw new Error("useTracker must be used within TrackerProvider");
  return ctx;
}
