/*
  # Add sample seating data

  1. New Data
    - Sample sections for events
    - Sample seats for each section
  2. Changes
    - Inserts sample data into sections and seats tables
  3. Notes
    - Only adds data for existing events
    - Creates realistic venue layouts
*/

-- Insert sample sections for the first event
DO $$ 
DECLARE
  event_id uuid;
BEGIN
  -- Get the first event
  SELECT id INTO event_id FROM events LIMIT 1;

  -- Insert sections
  INSERT INTO sections (name, event_id, rows, seats_per_row, price)
  VALUES
    ('Front Section', event_id, 5, 10, 199.99),
    ('Middle Section', event_id, 8, 12, 149.99),
    ('Rear Section', event_id, 10, 15, 99.99);
END $$;

-- Insert seats for each section
DO $$ 
DECLARE
  section_record RECORD;
  row_letter text;
  seat_number integer;
BEGIN
  -- Loop through each section
  FOR section_record IN SELECT * FROM sections
  LOOP
    -- Create seats for each row
    FOR row_num IN 1..section_record.rows
    LOOP
      -- Convert row number to letter (1=A, 2=B, etc.)
      row_letter := CHR(64 + row_num);
      
      -- Create seats in the row
      FOR seat_number IN 1..section_record.seats_per_row
      LOOP
        INSERT INTO seats (section_id, row, number, status)
        VALUES (section_record.id, row_letter, seat_number, 'available');
      END LOOP;
    END LOOP;
  END LOOP;
END $$;