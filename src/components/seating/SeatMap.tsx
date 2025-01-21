import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { Section, Seat, SelectedSeat } from '../../types/seating';
import { AlertCircle } from 'lucide-react';

interface SeatMapProps {
  eventId: string;
  onSeatSelect: (seats: SelectedSeat[]) => void;
  maxSeats?: number;
}

export default function SeatMap({ eventId, onSeatSelect, maxSeats = 4 }: SeatMapProps) {
  const [sections, setSections] = useState<Section[]>([]);
  const [seats, setSeats] = useState<Record<string, Seat[]>>({});
  const [selectedSeats, setSelectedSeats] = useState<SelectedSeat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSections();
  }, [eventId]);

  useEffect(() => {
    if (sections.length > 0) {
      fetchSeats();
    }
  }, [sections]);

  const fetchSections = async () => {
    try {
      const { data, error } = await supabase
        .from('sections')
        .select('*')
        .eq('event_id', eventId)
        .order('name');

      if (error) throw error;
      setSections(data || []);
    } catch (err) {
      setError('Failed to load sections');
      console.error('Error:', err);
    }
  };

  const fetchSeats = async () => {
    try {
      const seatData: Record<string, Seat[]> = {};
      
      for (const section of sections) {
        const { data, error } = await supabase
          .from('seats')
          .select('*')
          .eq('section_id', section.id)
          .order('row')
          .order('number');

        if (error) throw error;
        seatData[section.id] = data || [];
      }

      setSeats(seatData);
      setLoading(false);
    } catch (err) {
      setError('Failed to load seats');
      console.error('Error:', err);
    }
  };

  const handleSeatClick = (seat: Seat, section: Section) => {
    if (seat.status === 'booked') return;

    const isSelected = selectedSeats.some(s => s.id === seat.id);
    let newSelectedSeats: SelectedSeat[];

    if (isSelected) {
      newSelectedSeats = selectedSeats.filter(s => s.id !== seat.id);
    } else {
      if (selectedSeats.length >= maxSeats) {
        alert(`You can only select up to ${maxSeats} seats`);
        return;
      }
      newSelectedSeats = [...selectedSeats, { ...seat, section }];
    }

    setSelectedSeats(newSelectedSeats);
    onSeatSelect(newSelectedSeats);
  };

  const getSeatColor = (seat: Seat) => {
    if (seat.status === 'booked') return 'bg-gray-300 cursor-not-allowed';
    if (selectedSeats.some(s => s.id === seat.id)) return 'bg-yellow-400 hover:bg-yellow-500';
    return 'bg-green-500 hover:bg-green-600';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 text-red-600">
        <AlertCircle className="w-6 h-6 mr-2" />
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {sections.map((section) => (
        <div key={section.id} className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-4">{section.name}</h3>
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, rowIndex) => { // 4 rows
              const rowLetter = String.fromCharCode(65 + rowIndex);
              return (
                <div key={rowLetter} className="flex items-center gap-2">
                  <span className="w-8 text-center font-medium">{rowLetter}</span>
                  <div className="flex gap-2 flex-wrap">
                    {Array.from({ length: 6 }).map((_, seatIndex) => { // 6 seats per row
                      const seatNumber = seatIndex + 1;
                      const seat = seats[section.id]?.find(
                        s => s.row === rowLetter && s.number === seatNumber
                      );
                      
                      if (!seat) return null;

                      return (
                        <motion.button
                          key={`${rowLetter}${seatNumber}`}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleSeatClick(seat, section)}
                          className={`w-10 h-10 rounded-lg ${getSeatColor(seat)} text-white text-sm font-medium transition-colors duration-200`}
                          disabled={seat.status === 'booked'}
                          title={`Row ${rowLetter}, Seat ${seatNumber}`}
                        >
                          {seatNumber}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-4 text-sm text-gray-600">
            Price per seat: ${section.price.toFixed(2)}
          </div>
        </div>
      ))}

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium mb-2">Legend:</h4>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span>Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-400 rounded"></div>
            <span>Selected</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-300 rounded"></div>
            <span>Booked</span>
          </div>
        </div>
      </div>
    </div>
  );
}