export interface AdminUser {
  id: string;
  email: string;
  role: 'admin';
}

export interface TicketWithDetails extends Ticket {
  event: Event;
  user: {
    email: string;
    full_name: string;
  };
}