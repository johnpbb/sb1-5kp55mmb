/*
  # Add Email to Profiles Table

  1. Changes
    - Add email column to profiles table
    - Update handle_new_user function to store email
  
  2. Security
    - Maintain existing RLS policies
*/

-- Add email column to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS email text;

-- Update existing profiles with email from auth.users
UPDATE profiles
SET email = users.email
FROM auth.users
WHERE profiles.id = users.id;

-- Make email required and unique after data migration
ALTER TABLE profiles
ALTER COLUMN email SET NOT NULL,
ADD CONSTRAINT profiles_email_unique UNIQUE (email);

-- Update handle_new_user function to include email
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, username, full_name, email)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.email
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;