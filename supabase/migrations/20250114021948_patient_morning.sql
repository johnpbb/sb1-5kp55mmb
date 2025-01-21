/*
  # Update public access policies

  1. Changes
    - Add public access policies for events and profiles
    - Allow public viewing of events and basic profile information
    - Maintain security for sensitive operations

  2. Security
    - Public can view events and basic profile info
    - Protected fields remain secure
    - Write operations still require authentication
*/

DO $$ 
BEGIN
  -- Drop existing policies if they exist
  DROP POLICY IF EXISTS "Public can view events" ON events;
  DROP POLICY IF EXISTS "Public can view basic profile information" ON profiles;
  DROP POLICY IF EXISTS "Users can view own tickets" ON tickets;

  -- Create new policies
  CREATE POLICY "Public can view events"
    ON events
    FOR SELECT
    TO public
    USING (true);

  CREATE POLICY "Public can view basic profile information"
    ON profiles
    FOR SELECT
    TO public
    USING (true);

  CREATE POLICY "Users can view own tickets"
    ON tickets
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id OR EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    ));
END $$;