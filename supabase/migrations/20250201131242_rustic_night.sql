/*
  # Initial Schema Setup

  1. New Tables
    - users
      - Custom user data and preferences
    - diet_plans
      - Stores generated diet plans
    - food_donations
      - Tracks food donation listings
    - donation_centers
      - Information about donation centers
    - sustainability_initiatives
      - Tracks sustainability projects and impact

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Users table for extended profile information
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  full_name text,
  dietary_preferences text[],
  health_goals text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Diet plans table
CREATE TABLE IF NOT EXISTS diet_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id),
  plan_data jsonb NOT NULL,
  goal text NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Food donations table
CREATE TABLE IF NOT EXISTS food_donations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  donor_id uuid REFERENCES users(id),
  food_type text NOT NULL,
  quantity text NOT NULL,
  expiry_date timestamptz NOT NULL,
  pickup_address text NOT NULL,
  status text DEFAULT 'available',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Donation centers table
CREATE TABLE IF NOT EXISTS donation_centers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  address text NOT NULL,
  contact_number text,
  operating_hours jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Sustainability initiatives table
CREATE TABLE IF NOT EXISTS sustainability_initiatives (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  impact_metrics jsonb,
  start_date date NOT NULL,
  end_date date,
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE diet_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE food_donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE donation_centers ENABLE ROW LEVEL SECURITY;
ALTER TABLE sustainability_initiatives ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Users can read their own data
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Users can update their own data
CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Diet plans policies
CREATE POLICY "Users can read own diet plans"
  ON diet_plans
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create diet plans"
  ON diet_plans
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Food donations policies
CREATE POLICY "Anyone can view available donations"
  ON food_donations
  FOR SELECT
  TO authenticated
  USING (status = 'available');

CREATE POLICY "Users can create donations"
  ON food_donations
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = donor_id);

-- Donation centers policies
CREATE POLICY "Anyone can view donation centers"
  ON donation_centers
  FOR SELECT
  TO authenticated
  USING (true);

-- Sustainability initiatives policies
CREATE POLICY "Anyone can view initiatives"
  ON sustainability_initiatives
  FOR SELECT
  TO authenticated
  USING (true);