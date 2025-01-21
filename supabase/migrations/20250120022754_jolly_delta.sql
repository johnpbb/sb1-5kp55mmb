/*
  # Fix Event Seating Configuration
  
  1. Changes
    - Add seating configurations for all events
    - Ensure seat counts are properly synchronized
    - Fix any missing sections or seats
  
  2. Security
    - Maintain existing RLS policies
*/

-- Function to create sections and seats for an event
CREATE OR REPLACE FUNCTION create_event_seating(p_event_id uuid)
RETURNS void AS $$
DECLARE
  v_section_id uuid;
BEGIN
  -- Create sections if they don't exist
  IF NOT EXISTS (
    SELECT 1 
    FROM sections s
    WHERE s.event_id = p_event_id
  ) THEN
    -- Front section
    INSERT INTO sections (name, event_id, rows, seats_per_row, price)
    VALUES ('Front Section', p_event_id, 4, 6, 199.99)
    RETURNING id INTO v_section_id;
    
    -- Create seats for front section
    FOR row_num IN 1..4 LOOP
      FOR seat_num IN 1..6 LOOP
        INSERT INTO seats (section_id, row, number, status)
        VALUES (v_section_id, CHR(64 + row_num), seat_num, 'available')
        ON CONFLICT (section_id, row, number) DO NOTHING;
      END LOOP;
    END LOOP;

    -- Middle section
    INSERT INTO sections (name, event_id, rows, seats_per_row, price)
    VALUES ('Middle Section', p_event_id, 4, 6, 149.99)
    RETURNING id INTO v_section_id;
    
    -- Create seats for middle section
    FOR row_num IN 1..4 LOOP
      FOR seat_num IN 1..6 LOOP
        INSERT INTO seats (section_id, row, number, status)
        VALUES (v_section_id, CHR(64 + row_num), seat_num, 'available')
        ON CONFLICT (section_id, row, number) DO NOTHING;
      END LOOP;
    END LOOP;

    -- Back section
    INSERT INTO sections (name, event_id, rows, seats_per_row, price)
    VALUES ('Back Section', p_event_id, 4, 6, 99.99)
    RETURNING id INTO v_section_id;
    
    -- Create seats for back section
    FOR row_num IN 1..4 LOOP
      FOR seat_num IN 1..6 LOOP
        INSERT INTO seats (section_id, row, number, status)
        VALUES (v_section_id, CHR(64 + row_num), seat_num, 'available')
        ON CONFLICT (section_id, row, number) DO NOTHING;
      END LOOP;
    END LOOP;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Create seating for all events
DO $$
DECLARE
  v_event_record RECORD;
BEGIN
  FOR v_event_record IN SELECT id FROM events
  LOOP
    PERFORM create_event_seating(v_event_record.id);
  END LOOP;
END $$;

-- Refresh event ticket counts
DO $$
DECLARE
  v_event_record RECORD;
BEGIN
  FOR v_event_record IN SELECT id FROM events
  LOOP
    UPDATE events e
    SET 
      total_tickets = calculate_event_seats(v_event_record.id),
      available_tickets = calculate_event_seats(v_event_record.id) - (
        SELECT COALESCE(COUNT(*), 0)
        FROM seat_bookings sb
        JOIN tickets t ON t.id = sb.ticket_id
        WHERE t.event_id = v_event_record.id
        AND t.status = 'confirmed'
      )
    WHERE e.id = v_event_record.id;
  END LOOP;
END $$;