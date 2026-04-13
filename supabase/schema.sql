-- MyDietTracker Extended — Supabase schema
-- Run this in the Supabase SQL editor to create tables with RLS

-- saved_foods: user's favorite foods from USDA API
CREATE TABLE IF NOT EXISTS saved_foods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  fdc_id integer NOT NULL,
  name text NOT NULL,
  brand text,
  calories real DEFAULT 0,
  protein real DEFAULT 0,
  serving_size real DEFAULT 100,
  serving_unit text DEFAULT 'g',
  created_at timestamptz DEFAULT now()
);

-- food_log: daily nutrition entries
CREATE TABLE IF NOT EXISTS food_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  date date NOT NULL,
  name text NOT NULL,
  calories real DEFAULT 0,
  protein real DEFAULT 0,
  servings real DEFAULT 1,
  created_at timestamptz DEFAULT now()
);

-- user_goals: per-user daily targets
CREATE TABLE IF NOT EXISTS user_goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL UNIQUE,
  daily_calories integer DEFAULT 2000,
  daily_protein integer DEFAULT 150,
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE saved_foods ENABLE ROW LEVEL SECURITY;
ALTER TABLE food_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_goals ENABLE ROW LEVEL SECURITY;

-- RLS policies: users can only access their own data
-- The JWT 'sub' claim contains the Clerk user ID

CREATE POLICY "Users can read own saved foods"
  ON saved_foods FOR SELECT
  USING (auth.jwt()->>'sub' = user_id);

CREATE POLICY "Users can insert own saved foods"
  ON saved_foods FOR INSERT
  WITH CHECK (auth.jwt()->>'sub' = user_id);

CREATE POLICY "Users can delete own saved foods"
  ON saved_foods FOR DELETE
  USING (auth.jwt()->>'sub' = user_id);

CREATE POLICY "Users can read own food log"
  ON food_log FOR SELECT
  USING (auth.jwt()->>'sub' = user_id);

CREATE POLICY "Users can insert own food log"
  ON food_log FOR INSERT
  WITH CHECK (auth.jwt()->>'sub' = user_id);

CREATE POLICY "Users can delete own food log"
  ON food_log FOR DELETE
  USING (auth.jwt()->>'sub' = user_id);

CREATE POLICY "Users can read own goals"
  ON user_goals FOR SELECT
  USING (auth.jwt()->>'sub' = user_id);

CREATE POLICY "Users can insert own goals"
  ON user_goals FOR INSERT
  WITH CHECK (auth.jwt()->>'sub' = user_id);

CREATE POLICY "Users can update own goals"
  ON user_goals FOR UPDATE
  USING (auth.jwt()->>'sub' = user_id);
