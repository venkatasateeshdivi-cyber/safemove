/*
  # Create leads table for Packers & Movers

  1. New Tables
    - `leads`
      - `id` (uuid, primary key)
      - `name` (text) - customer full name
      - `phone` (text) - contact number
      - `email` (text) - customer email
      - `from_location` (text) - moving from city/address
      - `to_location` (text) - moving to city/address
      - `move_date` (date) - planned moving date
      - `move_type` (text) - type of move (household, office, vehicle, etc.)
      - `property_size` (text) - size of property
      - `message` (text) - additional notes
      - `created_at` (timestamptz) - submission timestamp

  2. Security
    - Enable RLS on `leads` table
    - Add policy for anonymous insert (public form submission)
    - No select policy for anonymous users (data is private)
*/

CREATE TABLE IF NOT EXISTS leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  from_location text NOT NULL DEFAULT '',
  to_location text NOT NULL DEFAULT '',
  move_date date,
  move_type text NOT NULL DEFAULT '',
  property_size text NOT NULL DEFAULT '',
  message text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a lead"
  ON leads
  FOR INSERT
  TO anon
  WITH CHECK (true);
