export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  image_url: string;
  price: number;
  total_tickets: number;
  available_tickets: number;
  created_at: string;
  updated_at: string;
}

export interface Ticket {
  id: string;
  event_id: string;
  user_id: string | null;
  quantity: number;
  total_price: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  created_at: string;
  guest_info?: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    city: string;
    country: string;
  } | null;
}