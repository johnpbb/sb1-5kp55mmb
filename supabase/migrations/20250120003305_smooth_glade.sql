/*
  # Add Seating System

  1. New Tables
    - `sections` - Venue sections (e.g., Main Floor, Balcony)
    - `seats` - Individual seats
    - `seat_bookings` - Seat reservation records

  2. Security
    - Enable RLS on all new tables
    - Add policies for public seat viewing
    - Add policies for authenticated seat booking
    - Add policies for admin management
*/

-- Create sections table
CREATE TABLE IF NOT EXISTS sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  event_id uuid REFERENCES events ON DELETE CASCADE,
  rows integer NOT NULL,
  seats_per_row integer NOT NULL,
  price decimal NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create seats table
CREATE TABLE IF NOT EXISTS seats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id uuid REFERENCES sections ON DELETE CASCADE,
  row text NOT NULL,
  number integer NOT NULL,
  status text NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'selected', 'booked')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(section_id, row, number)
);

-- Create seat_bookings table
CREATE TABLE IF NOT EXISTS seat_bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id uuid REFERENCES tickets ON DELETE CASCADE,
  seat_id uuid REFERENCES seats ON DELETE RESTRICT,
  created_at timestamptz DEFAULT now(),
  UNIQUE(seat_id)
);

-- Enable RLS
ALTER TABLE sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE seats ENABLE ROW LEVEL SECURITY;
ALTER TABLE seat_bookings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DO $$ 
BEGIN
    -- Sections policies
    DROP POLICY IF EXISTS "Anyone can view sections" ON sections;
    DROP POLICY IF EXISTS "Admins can manage sections" ON sections;
    
    -- Seats policies
    DROP POLICY IF EXISTS "Anyone can view seats" ON seats;
    DROP POLICY IF EXISTS "Admins can manage seats" ON seats;
    
    -- Seat bookings policies
    DROP POLICY IF EXISTS "Users can view own bookings" ON seat_bookings;
    DROP POLICY IF EXISTS "Users can create bookings" ON seat_bookings;
END $$;

-- Create new policies
-- Sections policies
CREATE POLICY "Anyone can view sections"
  ON sections FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admins can manage sections"
  ON sections FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Seats policies
CREATE POLICY "Anyone can view seats"
  ON seats FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admins can manage seats"
  ON seats FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Seat bookings policies
CREATE POLICY "Users can view own bookings"
  ON seat_bookings FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM tickets
      WHERE tickets.id = seat_bookings.ticket_id
      AND tickets.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create bookings"
  ON seat_bookings FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM tickets
      WHERE tickets.id = seat_bookings.ticket_id
      AND tickets.user_id = auth.uid()
    )
  );

-- Function to update seat status
CREATE OR REPLACE FUNCTION update_seat_status()
RETURNS trigger AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE seats SET status = 'booked' WHERE id = NEW.seat_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE seats SET status = 'available' WHERE id = OLD.seat_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_seat_booking_change ON seat_bookings;

-- Create trigger for seat status updates
CREATE TRIGGER on_seat_booking_change
  AFTER INSERT OR DELETE ON seat_bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_seat_status();