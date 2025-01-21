-- Function to count total seats for an event
CREATE OR REPLACE FUNCTION calculate_event_seats(event_id uuid)
RETURNS integer AS $$
DECLARE
  total_seats integer;
BEGIN
  SELECT COALESCE(SUM(rows * seats_per_row), 0)
  INTO total_seats
  FROM sections
  WHERE sections.event_id = $1;
  
  RETURN total_seats;
END;
$$ LANGUAGE plpgsql;

-- Function to update event tickets based on seating
CREATE OR REPLACE FUNCTION sync_event_tickets()
RETURNS trigger AS $$
BEGIN
  -- Update the event's total and available tickets
  UPDATE events
  SET 
    total_tickets = calculate_event_seats(NEW.event_id),
    available_tickets = calculate_event_seats(NEW.event_id)
  WHERE id = NEW.event_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for sections changes
DROP TRIGGER IF EXISTS on_section_change ON sections;
CREATE TRIGGER on_section_change
  AFTER INSERT OR UPDATE OR DELETE ON sections
  FOR EACH ROW
  EXECUTE FUNCTION sync_event_tickets();

-- Update existing events with correct ticket counts
DO $$ 
DECLARE
  event_record RECORD;
  seat_count integer;
BEGIN
  FOR event_record IN SELECT * FROM events
  LOOP
    seat_count := calculate_event_seats(event_record.id);
    
    UPDATE events
    SET 
      total_tickets = seat_count,
      available_tickets = seat_count - (
        SELECT COALESCE(COUNT(*), 0)
        FROM seat_bookings sb
        JOIN tickets t ON t.id = sb.ticket_id
        WHERE t.event_id = event_record.id
        AND t.status = 'confirmed'
      )
    WHERE id = event_record.id;
  END LOOP;
END $$;

-- Function to update available tickets when booking seats
CREATE OR REPLACE FUNCTION update_available_tickets()
RETURNS trigger AS $$
DECLARE
  event_id uuid;
BEGIN
  -- Get the event ID from the ticket
  SELECT t.event_id INTO event_id
  FROM tickets t
  WHERE t.id = NEW.ticket_id;

  -- Update the event's available tickets
  UPDATE events
  SET available_tickets = available_tickets - 1
  WHERE id = event_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for seat bookings
DROP TRIGGER IF EXISTS on_seat_booking ON seat_bookings;
CREATE TRIGGER on_seat_booking
  AFTER INSERT ON seat_bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_available_tickets();