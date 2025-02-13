/*
  # Add Progress Tracking Tables

  1. New Tables
    - `weight_progress`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references users)
      - `date` (date)
      - `weight` (numeric)
      - `created_at` (timestamptz)

    - `calorie_progress`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references users)
      - `date` (date)
      - `calories` (integer)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Weight Progress Table
CREATE TABLE IF NOT EXISTS weight_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  date date NOT NULL,
  weight numeric NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, date)
);

-- Calorie Progress Table
CREATE TABLE IF NOT EXISTS calorie_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  date date NOT NULL,
  calories integer NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, date)
);

-- Enable Row Level Security
ALTER TABLE weight_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE calorie_progress ENABLE ROW LEVEL SECURITY;

-- Weight Progress Policies
CREATE POLICY "Users can view their own weight progress"
  ON weight_progress
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own weight progress"
  ON weight_progress
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own weight progress"
  ON weight_progress
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Calorie Progress Policies
CREATE POLICY "Users can view their own calorie progress"
  ON calorie_progress
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own calorie progress"
  ON calorie_progress
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own calorie progress"
  ON calorie_progress
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS weight_progress_user_date_idx ON weight_progress(user_id, date);
CREATE INDEX IF NOT EXISTS calorie_progress_user_date_idx ON calorie_progress(user_id, date);