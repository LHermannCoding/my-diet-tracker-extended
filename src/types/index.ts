export interface NutritionEntry {
  id: string;
  value: number;
  timestamp: number;
}

export interface DayData {
  date: string;
  calorieEntries: NutritionEntry[];
  proteinEntries: NutritionEntry[];
  calorieOverride: number | null;
  proteinOverride: number | null;
  workout: string;
}

export interface Goals {
  dailyCalories: number;
  dailyProtein: number;
}

export interface TrackerState {
  days: Record<string, DayData>;
  goals: Goals;
}
