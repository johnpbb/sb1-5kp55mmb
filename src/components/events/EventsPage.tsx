import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Event } from '../../types/event';
import { useAuth } from '../../contexts/AuthContext';
import { Calendar, MapPin, Ticket } from 'lucide-react';
import { motion } from 'framer-motion';
import BookingForm from './BookingForm';

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchEvents();
  }, []);

  async function fetchEvents() {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true });

      if (error) throw error;
      setEvents(data || []);
    } catch (err) {
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen">
      <div className="relative h-[60vh] flex items-center justify-center text-white">
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1520242739010-44e95bde329e?auto=format&fit=crop&q=80')",
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-blue-950/60 to-blue-900/60" />
        </div>
        
        <div className="container mx-auto px-6 z-10 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl font-bold mb-6 font-poppins"
          >
            Discover Amazing Events
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl mb-12 font-light"
          >
            Find and book tickets for the best events in town
          </motion.p>
        </div>
      </div>
      
      <div className="bg-gray-50 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-blue-950 mb-8">Upcoming Events</h2>
          
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-900"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((event) => (
                <div key={event.id} className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col">
                  <div className="relative h-48">
                    <img
                      src={event.image_url}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded-full flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-red-500" />
                      <span className="text-sm font-medium">
                        {new Date(event.date).toLocaleDateString('en-NZ', {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6 flex-grow">
                    <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                    <div 
                      className="text-gray-600 mb-4 prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: event.description }}
                    />
                    
                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                      <MapPin className="w-4 h-4" />
                      <span>{event.location}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-gray-600 mb-4">
                      <Ticket className="w-4 h-4" />
                      <span>{event.available_tickets} tickets available</span>
                    </div>

                    <div className="mt-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-blue-950">
                          From ${event.price.toFixed(2)}
                        </span>
                      </div>
                      
                      <button
                        onClick={() => setSelectedEvent(event)}
                        className="w-full bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors duration-200"
                      >
                        Select Seats
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedEvent && (
        <BookingForm
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </div>
  );
}