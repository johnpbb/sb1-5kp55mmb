/*
  # Add guest_info column to tickets table

  1. Changes
    - Add guest_info JSONB column to tickets table to store guest purchase information
    - Column is nullable since it's only used for guest purchases
    - Add validation check for required fields when guest_info is present

  2. Security
    - No changes to RLS policies required
*/

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'tickets' AND column_name = 'guest_info'
  ) THEN
    ALTER TABLE tickets 
    ADD COLUMN guest_info JSONB,
    ADD CONSTRAINT guest_info_check CHECK (
      guest_info IS NULL OR (
        guest_info ? 'first_name' AND
        guest_info ? 'last_name' AND
        guest_info ? 'email' AND
        guest_info ? 'phone' AND
        guest_info ? 'city' AND
        guest_info ? 'country'
      )
    );
  END IF;
END $$;