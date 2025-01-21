import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { TicketWithDetails } from '../../types/admin';
import { Ban } from 'lucide-react';

export default function TicketsManager() {
  const [tickets, setTickets] = useState<TicketWithDetails[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTickets();
  }, []);

  async function fetchTickets() {
    try {
      const { data, error } = await supabase
        .from('tickets')
        .select(`
          *,
          event:events(*),
          user:profiles(email, full_name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTickets(data || []);
    } catch (err) {
      console.error('Error fetching tickets:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleCancelTicket(ticketId: string) {
    if (!confirm('Are you sure you want to cancel this ticket?')) return;

    try {
      const ticket = tickets.find(t => t.id === ticketId);
      if (!ticket) return;

      const { error: ticketError } = await supabase
        .from('tickets')
        .update({ status: 'cancelled' })
        .eq('id', ticketId);

      if (ticketError) throw ticketError;

      const { error: eventError } = await supabase
        .from('events')
        .update({
          available_tickets: ticket.event.available_tickets + ticket.quantity
        })
        .eq('id', ticket.event_id);

      if (eventError) throw eventError;

      await fetchTickets();
    } catch (err) {
      console.error('Error cancelling ticket:', err);
    }
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Tickets Management</h1>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ticket ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purchase Date</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tickets.map((ticket) => (
              <tr key={ticket.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {ticket.id.slice(0, 8)}...
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <img
                      src={ticket.event.image_url}
                      alt={ticket.event.title}
                      className="h-10 w-10 rounded-lg object-cover"
                    />
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{ticket.event.title}</div>
                      <div className="text-sm text-gray-500">
                        {new Date(ticket.event.date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{ticket.user.full_name}</div>
                  <div className="text-sm text-gray-500">{ticket.user.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {ticket.quantity}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  ${ticket.total_price.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    ticket.status === 'confirmed'
                      ? 'bg-green-100 text-green-800'
                      : ticket.status === 'cancelled'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {ticket.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(ticket.created_at).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {ticket.status === 'confirmed' && (
                    <button
                      onClick={() => handleCancelTicket(ticket.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Ban className="w-5 h-5" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}