/*
  # Fix Tickets and Profiles Relationship

  1. Changes
    - Add foreign key relationship between tickets and profiles
    - Update tickets table to reference profiles instead of auth.users
    - Add policies for admin ticket management
  
  2. Security
    - Maintain existing RLS policies
    - Add admin policies for ticket management
*/

-- Update tickets table to reference profiles
ALTER TABLE tickets
  DROP CONSTRAINT IF EXISTS tickets_user_id_fkey,
  ADD CONSTRAINT tickets_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES profiles(id)
  ON DELETE SET NULL;

-- Add admin policies for ticket management
CREATE POLICY "Admins can view all tickets"
  ON tickets
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update tickets"
  ON tickets
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );