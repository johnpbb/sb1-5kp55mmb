/*
  # Fix Payment Settings Table
  
  1. Changes
    - Drop and recreate payment settings table if it exists
    - Ensure proper RLS policies are in place
    - Add default settings
  
  2. Security
    - Enable RLS
    - Add admin-only policies
*/

-- Recreate payment settings table
DROP TABLE IF EXISTS payment_settings;

CREATE TABLE payment_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  paypal_client_id text NOT NULL,
  paypal_client_secret text NOT NULL,
  paypal_mode text NOT NULL CHECK (paypal_mode IN ('sandbox', 'live')),
  currency text NOT NULL DEFAULT 'USD',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE payment_settings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Admins can view payment settings"
  ON payment_settings
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can manage payment settings"
  ON payment_settings
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Insert default settings
INSERT INTO payment_settings (
  paypal_client_id,
  paypal_client_secret,
  paypal_mode,
  currency
) VALUES (
  'ARZ_TLO1lGVZXel_XdT4fTObZWHJig-mbIVrDuVNKMt7KWIJNnqN5pleg3rP99V6cmFyAPmnLdUlMiEJ',
  'dummy_secret',
  'sandbox',
  'USD'
) ON CONFLICT DO NOTHING;