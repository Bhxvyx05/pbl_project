/*
  # Create food platform tables

  1. New Tables
    - `food_categories`: For storing food category information
    - `food_items`: For storing detailed food item information
  
  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users
*/

-- Create food categories table
DO $$ BEGIN
  CREATE TABLE IF NOT EXISTS food_categories (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    description text,
    image_url text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
  );
EXCEPTION
  WHEN duplicate_table THEN NULL;
END $$;

-- Create food items table
DO $$ BEGIN
  CREATE TABLE IF NOT EXISTS food_items (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id uuid REFERENCES food_categories(id),
    name text NOT NULL,
    description text NOT NULL,
    price numeric NOT NULL,
    image_url text,
    calories integer,
    preparation_time text,
    is_vegetarian boolean DEFAULT false,
    is_vegan boolean DEFAULT false,
    is_gluten_free boolean DEFAULT false,
    spice_level text,
    ingredients text[],
    nutritional_info jsonb,
    chef_id uuid REFERENCES auth.users(id),
    rating numeric DEFAULT 0,
    available boolean DEFAULT true,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
  );
EXCEPTION
  WHEN duplicate_table THEN NULL;
END $$;

-- Enable RLS
DO $$ BEGIN
  ALTER TABLE food_categories ENABLE ROW LEVEL SECURITY;
EXCEPTION
  WHEN undefined_table THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE food_items ENABLE ROW LEVEL SECURITY;
EXCEPTION
  WHEN undefined_table THEN NULL;
END $$;

-- Create policies
DO $$ BEGIN
  DROP POLICY IF EXISTS "Anyone can view food categories" ON food_categories;
  CREATE POLICY "Anyone can view food categories"
    ON food_categories
    FOR SELECT
    TO authenticated
    USING (true);
EXCEPTION
  WHEN undefined_table THEN NULL;
END $$;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Anyone can view available food items" ON food_items;
  CREATE POLICY "Anyone can view available food items"
    ON food_items
    FOR SELECT
    TO authenticated
    USING (available = true);
EXCEPTION
  WHEN undefined_table THEN NULL;
END $$;

-- Insert sample data
DO $$ 
DECLARE
  north_indian_id uuid;
  south_indian_id uuid;
  healthy_bowls_id uuid;
  thalis_id uuid;
BEGIN
  -- Insert categories
  INSERT INTO food_categories (name, description, image_url)
  VALUES 
    ('North Indian', 'Traditional dishes from North India', 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&q=80')
  RETURNING id INTO north_indian_id;

  INSERT INTO food_categories (name, description, image_url)
  VALUES
    ('South Indian', 'Authentic South Indian cuisine', 'https://images.unsplash.com/photo-1630383249896-424e482df921?auto=format&fit=crop&q=80')
  RETURNING id INTO south_indian_id;

  INSERT INTO food_categories (name, description, image_url)
  VALUES
    ('Healthy Bowls', 'Nutritious and balanced meals', 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80')
  RETURNING id INTO healthy_bowls_id;

  INSERT INTO food_categories (name, description, image_url)
  VALUES
    ('Thalis', 'Complete balanced meals', 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&q=80')
  RETURNING id INTO thalis_id;

  -- Insert food items
  INSERT INTO food_items (
    category_id,
    name,
    description,
    price,
    image_url,
    calories,
    preparation_time,
    is_vegetarian,
    spice_level,
    ingredients,
    nutritional_info
  ) VALUES (
    north_indian_id,
    'Quinoa Butter Chicken',
    'Healthy version of butter chicken served with quinoa',
    15.99,
    'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&q=80',
    450,
    '25-30 mins',
    false,
    'Medium',
    ARRAY['Chicken breast', 'Quinoa', 'Tomatoes', 'Greek yogurt', 'Spices'],
    '{"protein": 32, "carbs": 45, "fat": 15}'::jsonb
  );

  INSERT INTO food_items (
    category_id,
    name,
    description,
    price,
    image_url,
    calories,
    preparation_time,
    is_vegetarian,
    spice_level,
    ingredients,
    nutritional_info
  ) VALUES (
    south_indian_id,
    'Millet Dosa',
    'Traditional dosa made with healthy millet',
    12.99,
    'https://images.unsplash.com/photo-1630383249896-424e482df921?auto=format&fit=crop&q=80',
    300,
    '20-25 mins',
    true,
    'Mild',
    ARRAY['Millet', 'Urad dal', 'Fenugreek seeds'],
    '{"protein": 12, "carbs": 45, "fat": 8}'::jsonb
  );
END $$;