/*
  # Add Admin Policies for Events Management

  1. Changes
    - Add policies for administrators to manage events
    - Allow admins to insert, update, and delete events
  
  2. Security
    - Only users with 'admin' role can modify events
    - Maintains existing public read access
*/

-- Add policies for admin event management
CREATE POLICY "Admins can insert events"
  ON events
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update events"
  ON events
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can delete events"
  ON events
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );