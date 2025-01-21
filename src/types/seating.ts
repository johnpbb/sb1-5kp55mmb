export interface Section {
  id: string;
  name: string;
  event_id: string;
  rows: number;
  seats_per_row: number;
  price: number;
  created_at: string;
  updated_at: string;
}

export interface Seat {
  id: string;
  section_id: string;
  row: string;
  number: number;
  status: 'available' | 'selected' | 'booked';
  created_at: string;
  updated_at: string;
}

export interface SeatBooking {
  id: string;
  ticket_id: string;
  seat_id: string;
  created_at: string;
}

export interface SelectedSeat extends Seat {
  section: Section;
}