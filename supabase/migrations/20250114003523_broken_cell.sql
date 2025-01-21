/*
  # Add role column to profiles table

  1. Changes
    - Add `role` column to `profiles` table with type `text`
    - Set default role to 'user'
    - Add check constraint to ensure role is either 'user' or 'admin'

  2. Security
    - Maintain existing RLS policies
*/

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'role'
  ) THEN
    ALTER TABLE profiles 
    ADD COLUMN role text NOT NULL DEFAULT 'user'
    CHECK (role IN ('user', 'admin'));
  END IF;
END $$;