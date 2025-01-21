import React, { useState, useEffect } from 'react';
import { PayPalButtons } from '@paypal/react-paypal-js';
import { supabase } from '../../lib/supabase';
import { SelectedSeat } from '../../types/seating';
import { AlertCircle, Check, CreditCard, Loader2 } from 'lucide-react';
import SeatMap from './SeatMap';

interface SeatingLayoutProps {
  eventId: string;
  onBookingComplete: () => void;
}

interface BuyerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  country: string;
}

type PaymentMethod = 'paypal' | 'card';

export default function SeatingLayout({ eventId, onBookingComplete }: SeatingLayoutProps) {
  const [selectedSeats, setSelectedSeats] = useState<SelectedSeat[]>([]);
  const [bookingStatus, setBookingStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>('card');
  const [buyerInfo, setBuyerInfo] = useState<BuyerInfo>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    city: '',
    country: ''
  });

  const totalAmount = selectedSeats.reduce((sum, seat) => sum + seat.section.price, 0);

  const validateBuyerInfo = () => {
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'city', 'country'] as const;
    for (const field of requiredFields) {
      if (!buyerInfo[field].trim()) {
        setErrorMessage(`Please fill in your ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return false;
      }
    }
    return true;
  };

  const handleSeatSelect = (seats: SelectedSeat[]) => {
    setSelectedSeats(seats);
    setErrorMessage(null);
    if (bookingStatus === 'error') {
      setBookingStatus('idle');
    }
  };

  const createOrder = async () => {
    try {
      const { data: ticket, error: ticketError } = await supabase
        .from('tickets')
        .insert({
          event_id: eventId,
          quantity: selectedSeats.length,
          total_price: totalAmount,
          status: 'pending',
          guest_info: buyerInfo
        })
        .select()
        .single();

      if (ticketError) throw ticketError;

      const { error: bookingError } = await supabase
        .from('seat_bookings')
        .insert(
          selectedSeats.map(seat => ({
            ticket_id: ticket.id,
            seat_id: seat.id
          }))
        );

      if (bookingError) throw bookingError;

      return ticket.id;
    } catch (err) {
      console.error('Error creating order:', err);
      throw new Error('Failed to create order');
    }
  };

  const handlePaymentSuccess = async (ticketId: string) => {
    try {
      const { error } = await supabase
        .from('tickets')
        .update({ status: 'confirmed' })
        .eq('id', ticketId);

      if (error) throw error;
      
      setBookingStatus('success');
      onBookingComplete();
    } catch (err) {
      console.error('Error updating ticket status:', err);
      setBookingStatus('error');
      setErrorMessage('Failed to confirm booking');
    }
  };

  const handleCardPayment = async () => {
    if (!validateBuyerInfo()) {
      return;
    }
    // Redirect to card payment gateway
    window.location.href = 'https://egate.anz.com/payment';
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <div className="lg:flex-1">
        <SeatMap
          eventId={eventId}
          onSeatSelect={handleSeatSelect}
          maxSeats={4}
        />
      </div>

      <div className="lg:w-96">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-6">Buyer Information</h3>
          
          <div className="space-y-4 mb-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input
                  type="text"
                  required
                  value={buyerInfo.firstName}
                  onChange={e => setBuyerInfo({...buyerInfo, firstName: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring focus:ring-blue-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input
                  type="text"
                  required
                  value={buyerInfo.lastName}
                  onChange={e => setBuyerInfo({...buyerInfo, lastName: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring focus:ring-blue-200"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                required
                value={buyerInfo.email}
                onChange={e => setBuyerInfo({...buyerInfo, email: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring focus:ring-blue-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="tel"
                required
                value={buyerInfo.phone}
                onChange={e => setBuyerInfo({...buyerInfo, phone: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring focus:ring-blue-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
              <input
                type="text"
                required
                value={buyerInfo.city}
                onChange={e => setBuyerInfo({...buyerInfo, city: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring focus:ring-blue-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
              <input
                type="text"
                required
                value={buyerInfo.country}
                onChange={e => setBuyerInfo({...buyerInfo, country: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:ring focus:ring-blue-200"
              />
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-xl font-semibold mb-4">Booking Summary</h3>
            
            {selectedSeats.length > 0 ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  {selectedSeats.map((seat) => (
                    <div key={seat.id} className="flex justify-between">
                      <span>
                        {seat.section.name} - Row {seat.row}, Seat {seat.number}
                      </span>
                      <span>${seat.section.price.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex justify-between font-semibold">
                    <span>Total Amount:</span>
                    <span>${totalAmount.toFixed(2)}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      id="card-payment"
                      checked={selectedPaymentMethod === 'card'}
                      onChange={() => setSelectedPaymentMethod('card')}
                      className="text-blue-600"
                    />
                    <label htmlFor="card-payment" className="flex items-center gap-2">
                      <CreditCard className="w-5 h-5" />
                      <span>Credit/Debit Card</span>
                    </label>
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      id="paypal-payment"
                      checked={selectedPaymentMethod === 'paypal'}
                      onChange={() => setSelectedPaymentMethod('paypal')}
                      className="text-blue-600"
                    />
                    <label htmlFor="paypal-payment">
                      <img src="https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_37x23.jpg" alt="PayPal" className="h-6" />
                    </label>
                  </div>
                </div>

                {selectedPaymentMethod === 'paypal' ? (
                  <PayPalButtons
                    style={{ 
                      layout: "vertical",
                      shape: "rect",
                      tagline: false
                    }}
                    fundingSource="paypal"
                    forceReRender={[totalAmount, selectedSeats.length]}
                    createOrder={(data, actions) => {
                      if (!validateBuyerInfo()) {
                        throw new Error('Please fill in all required fields');
                      }
                      setBookingStatus('processing');
                      return actions.order.create({
                        purchase_units: [
                          {
                            amount: {
                              currency_code: "USD",
                              value: totalAmount.toFixed(2)
                            },
                            description: `Ticket booking for ${selectedSeats.length} seat(s)`
                          }
                        ]
                      });
                    }}
                    onApprove={async (data, actions) => {
                      if (!actions.order) {
                        setBookingStatus('error');
                        setErrorMessage('Payment processing error');
                        return;
                      }

                      try {
                        const order = await actions.order.capture();
                        if (order.status === 'COMPLETED') {
                          const ticketId = await createOrder();
                          await handlePaymentSuccess(ticketId);
                        } else {
                          throw new Error('Payment not completed');
                        }
                      } catch (err) {
                        setBookingStatus('error');
                        setErrorMessage('Failed to process payment');
                        console.error('Payment error:', err);
                      }
                    }}
                    onError={(err) => {
                      console.error('PayPal error:', err);
                      setBookingStatus('error');
                      setErrorMessage('Payment failed. Please try again.');
                    }}
                    onCancel={() => {
                      setBookingStatus('idle');
                      setErrorMessage('Payment cancelled');
                    }}
                  />
                ) : (
                  <button
                    onClick={handleCardPayment}
                    className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <CreditCard className="w-5 h-5" />
                    <span>Proceed to Pay</span>
                  </button>
                )}
              </div>
            ) : (
              <p className="text-gray-600">Please select your seats from the seating chart.</p>
            )}

            {errorMessage && (
              <div className="mt-4 flex items-center gap-2 text-red-600 bg-red-50 p-4 rounded-lg">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {bookingStatus === 'success' && (
              <div className="mt-4 flex items-center gap-2 text-green-600 bg-green-50 p-4 rounded-lg">
                <Check className="w-5 h-5" />
                <span>Booking confirmed!</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}