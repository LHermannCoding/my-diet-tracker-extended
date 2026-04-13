# MyDietTracker Extended

A full-stack diet and nutrition tracker with user authentication, persistent storage, and real food data from the USDA FoodData Central API.

## Project Overview

Users sign up, search for real foods using the USDA API, save favorites, and log daily nutrition. All data is persisted in Supabase and scoped to the authenticated user via Clerk.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 (dark theme)
- **Auth**: Clerk (sign up, sign in, sign out)
- **Database**: Supabase (PostgreSQL + Row Level Security)
- **External API**: USDA FoodData Central (https://fdc.nal.usda.gov/api-guide/fdc-api)
- **Deployment**: Vercel

## Environment Variables (.env.local)

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_JWT_SECRET=...
USDA_API_KEY=...
```

## Supabase Tables

### saved_foods
| Column | Type | Notes |
|---|---|---|
| id | uuid | PK, default gen_random_uuid() |
| user_id | text | Clerk user ID, NOT NULL |
| fdc_id | integer | USDA FoodData Central ID |
| name | text | Food name |
| brand | text | Brand owner (nullable) |
| calories | real | kcal per serving |
| protein | real | grams per serving |
| serving_size | real | serving amount |
| serving_unit | text | serving unit (g, ml, etc.) |
| created_at | timestamptz | default now() |

RLS: `user_id = auth.jwt()->>'sub'`

### food_log
| Column | Type | Notes |
|---|---|---|
| id | uuid | PK, default gen_random_uuid() |
| user_id | text | Clerk user ID, NOT NULL |
| date | date | Which day this entry belongs to |
| name | text | Food name |
| calories | real | kcal logged |
| protein | real | grams logged |
| servings | real | number of servings (default 1) |
| created_at | timestamptz | default now() |

RLS: `user_id = auth.jwt()->>'sub'`

### user_goals
| Column | Type | Notes |
|---|---|---|
| id | uuid | PK, default gen_random_uuid() |
| user_id | text | Clerk user ID, UNIQUE |
| daily_calories | integer | default 2000 |
| daily_protein | integer | default 150 |
| updated_at | timestamptz | default now() |

RLS: `user_id = auth.jwt()->>'sub'`

## Pages / Routes

| Route | Description |
|---|---|
| `/` | Dashboard — today's summary, quick-add, week strip |
| `/search` | Search USDA foods, view nutrition, save favorites |
| `/saved` | View and manage saved foods, quick-add to log |
| `/day/[date]` | Day detail — nutrition tracker, workout entry |
| `/history` | Browse all logged days |
| `/stats` | Weekly averages, streak, charts |
| `/settings` | Daily goals configuration |
| `/sign-in` | Clerk sign-in page |
| `/sign-up` | Clerk sign-up page |

## Key Patterns

- **Clerk middleware** protects all routes except sign-in/sign-up and public assets
- **Supabase client** uses Clerk JWT for RLS — user can only read/write their own data
- **USDA API** called via Next.js API route to keep the API key server-side
- **TrackerContext** manages client-side state and syncs with Supabase for persistence

## Commands

```bash
npm run dev          # Start dev server on localhost:3000
npm run build        # Production build
npm run lint         # ESLint
```
