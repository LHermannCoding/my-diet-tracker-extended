# MyDietTracker

A personal fitness and nutrition tracker built with Next.js, TypeScript, and Tailwind CSS.

## Project Overview

Track daily calories, protein intake, and workouts. Features an accumulator-style input for nutrition (add values that auto-sum, with undo and manual override), simple text-based workout logging, and weekly stats.

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 (dark theme)
- **State**: React Context + useReducer (client-side, in-memory)
- **Testing**: Playwright (e2e)
- **Deployment**: Vercel

## Pages / Routes

| Route | File | Description |
|---|---|---|
| `/` | `src/app/page.tsx` | Dashboard — today's summary, quick-add calories/protein, week strip |
| `/day/[date]` | `src/app/day/[date]/page.tsx` | Day detail — full nutrition tracker with add/undo/override, workout entry |
| `/history` | `src/app/history/page.tsx` | Browse all logged days with summaries |
| `/stats` | `src/app/stats/page.tsx` | Weekly averages, streak counter, bar charts |
| `/settings` | `src/app/settings/page.tsx` | Set daily calorie and protein goals |

## Data Model

```typescript
NutritionEntry { id, value, timestamp }
DayData { date, calorieEntries[], proteinEntries[], calorieOverride, proteinOverride, workout }
Goals { dailyCalories, dailyProtein }
TrackerState { days: Record<string, DayData>, goals: Goals }
```

## Key Patterns

- **Accumulator**: Each calorie/protein addition creates an entry. Total = sum of entries (or override if set).
- **Undo**: Pops last entry, or clears override if one is active.
- **Override**: Sets total manually; cleared when a new entry is added.
- **Context**: `TrackerProvider` wraps the app in `layout.tsx`. Use `useTracker()` hook in any client component.

## Commands

```bash
npm run dev          # Start dev server
npm run build        # Production build
npx playwright test  # Run e2e tests
```
