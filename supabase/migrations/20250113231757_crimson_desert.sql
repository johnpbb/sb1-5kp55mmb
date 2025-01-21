/*
  # Events and Tickets Schema

  1. New Tables
    - `events`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `date` (timestamptz)
      - `location` (text)
      - `image_url` (text)
      - `price` (decimal)
      - `total_tickets` (integer)
      - `available_tickets` (integer)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `tickets`
      - `id` (uuid, primary key)
      - `event_id` (uuid, references events)
      - `user_id` (uuid, references auth.users, nullable)
      - `quantity` (integer)
      - `total_price` (decimal)
      - `status` (text)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Public can view events
    - Only authenticated users can purchase tickets
    - Users can view their own tickets
*/

-- Events table
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  date timestamptz NOT NULL,
  location text NOT NULL,
  image_url text,
  price decimal NOT NULL,
  total_tickets integer NOT NULL,
  available_tickets integer NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tickets table
CREATE TABLE IF NOT EXISTS tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES events ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users ON DELETE SET NULL,
  quantity integer NOT NULL,
  total_price decimal NOT NULL,
  status text NOT NULL CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;

-- Events policies
CREATE POLICY "Anyone can view events"
  ON events
  FOR SELECT
  TO public
  USING (true);

-- Tickets policies
CREATE POLICY "Users can view own tickets"
  ON tickets
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert tickets"
  ON tickets
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Insert sample events
INSERT INTO events (title, description, date, location, image_url, price, total_tickets, available_tickets)
VALUES
  (
    'Summer Music Festival 2024',
    'Experience the ultimate summer music festival featuring top artists from around the world.',
    '2024-07-15 14:00:00+00',
    'Auckland Domain',
    'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80',
    149.99,
    1000,
    1000
  ),
  (
    'Tech Conference 2024',
    'Join industry leaders and innovators for a day of cutting-edge technology discussions.',
    '2024-08-20 09:00:00+00',
    'Sky City Convention Centre',
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80',
    299.99,
    500,
    500
  ),
  (
    'Food & Wine Festival',
    'Savor the finest local cuisines and wines in this premier gastronomic event.',
    '2024-09-10 11:00:00+00',
    'Wellington Waterfront',
    'https://images.unsplash.com/photo-1510924199351-4e9d94df18a6?auto=format&fit=crop&q=80',
    89.99,
    750,
    750
  );