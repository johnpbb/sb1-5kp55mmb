import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Event } from '../../types/event';
import { Ticket } from '../../types/event';
import { Calendar, MapPin, Ticket as TicketIcon } from 'lucide-react';

export default function Dashboard() {
  const [tickets, setTickets] = useState<(Ticket & { event: Event })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserTickets();
  }, []);

  const fetchUserTickets = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('tickets')
        .select(`
          *,
          event:events(*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTickets(data || []);
    } catch (err) {
      console.error('Error fetching tickets:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-900"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Tickets</h1>

        {tickets.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <TicketIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tickets yet</h3>
            <p className="text-gray-600 mb-4">You haven't purchased any tickets yet.</p>
            <a
              href="/events"
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Browse Events
            </a>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {tickets.map((ticket) => (
              <div key={ticket.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <img
                  src={ticket.event.image_url}
                  alt={ticket.event.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-2">{ticket.event.title}</h3>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>{new Date(ticket.event.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span>{ticket.event.location}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <TicketIcon className="w-4 h-4 mr-2" />
                      <span>{ticket.quantity} ticket{ticket.quantity > 1 ? 's' : ''}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500">
                      Order ID: {ticket.id.slice(0, 8)}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      ticket.status === 'confirmed'
                        ? 'bg-green-100 text-green-800'
                        : ticket.status === 'cancelled'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}