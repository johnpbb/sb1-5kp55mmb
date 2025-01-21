import React, { useState } from 'react';
import { Event } from '../../types/event';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { X, CreditCard } from 'lucide-react';
import { PaymentMethod } from '../../types/payment';
import SeatingLayout from '../seating/SeatingLayout';

interface BookingFormProps {
  event: Event;
  onClose: () => void;
}

type Step = 'seat-selection' | 'buyer-info' | 'payment' | 'processing';

interface BuyerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  country: string;
}

export default function BookingForm({ event, onClose }: BookingFormProps) {
  const [step, setStep] = useState<Step>('seat-selection');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>('card');
  const [buyerInfo, setBuyerInfo] = useState<BuyerInfo>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    city: '',
    country: ''
  });
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptMarketing, setAcceptMarketing] = useState(false);
  const { user } = useAuth();

  const serviceFee = 0.75;

  const handleBookingComplete = () => {
    setStep('buyer-info');
  };

  const handleBuyerInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('payment');
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep('processing');
    
    try {
      if (selectedPaymentMethod === 'mpaisa') {
        window.location.href = 'https://pay.mpaisa.vodafone.com.fj/payment';
      } else {
        window.location.href = 'https://egate.anz.com/payment';
      }
    } catch (err) {
      alert('Failed to process payment. Please try again.');
      setStep('payment');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl font-bold">
            {step === 'seat-selection' ? 'Select Seats' :
             step === 'buyer-info' ? 'Buyer Information' : 
             'Payment'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {step === 'seat-selection' ? (
          <SeatingLayout 
            eventId={event.id}
            onBookingComplete={handleBookingComplete}
          />
        ) : step === 'buyer-info' ? (
          <form onSubmit={handleBuyerInfoSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">First name</label>
                <input
                  type="text"
                  required
                  value={buyerInfo.firstName}
                  onChange={e => setBuyerInfo({...buyerInfo, firstName: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Last name</label>
                <input
                  type="text"
                  required
                  value={buyerInfo.lastName}
                  onChange={e => setBuyerInfo({...buyerInfo, lastName: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                required
                value={buyerInfo.email}
                onChange={e => setBuyerInfo({...buyerInfo, email: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input
                type="tel"
                required
                value={buyerInfo.phone}
                onChange={e => setBuyerInfo({...buyerInfo, phone: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Town/City</label>
                <input
                  type="text"
                  required
                  value={buyerInfo.city}
                  onChange={e => setBuyerInfo({...buyerInfo, city: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Country</label>
                <input
                  type="text"
                  required
                  value={buyerInfo.country}
                  onChange={e => setBuyerInfo({...buyerInfo, country: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Continue to Payment
            </button>
          </form>
        ) : step === 'payment' ? (
          <form onSubmit={handlePaymentSubmit} className="space-y-6">
            <div className="space-y-4">
              <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer">
                <input
                  type="radio"
                  name="payment"
                  value="card"
                  checked={selectedPaymentMethod === 'card'}
                  onChange={() => setSelectedPaymentMethod('card')}
                  className="text-blue-600"
                />
                <span>Credit/Debit Card</span>
                <div className="ml-auto flex gap-2">
                  <img src="https://d1yjjnpx0p53s8.cloudfront.net/styles/logo-thumbnail/s3/062019/visa.png" alt="Visa" className="h-6" />
                  <img src="https://d1yjjnpx0p53s8.cloudfront.net/styles/logo-original-577x577/s3/072016/untitled-1_137.png" alt="Mastercard" className="h-6" />
                </div>
              </label>

              <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer">
                <input
                  type="radio"
                  name="payment"
                  value="mpaisa"
                  checked={selectedPaymentMethod === 'mpaisa'}
                  onChange={() => setSelectedPaymentMethod('mpaisa')}
                  className="text-blue-600"
                />
                <span>M-PAISA Mobile Wallet</span>
                <div className="ml-auto flex gap-2">
                  <img src="https://play-lh.googleusercontent.com/zi2WKWOI8ubMJ9A26JlsYTzFT-73S7Rl9EQglUyheK0VeTXyES_CjuAWHt4LPgzuKSLM=w240-h480-rw" alt="M-PAISA" className="h-6"/>
                </div>
              </label>
            </div>

            <div className="space-y-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={e => setAcceptTerms(e.target.checked)}
                  required
                  className="text-blue-600"
                />
                <span className="text-sm">
                  I agree to the Terms and Conditions and Privacy Policy
                </span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={acceptMarketing}
                  onChange={e => setAcceptMarketing(e.target.checked)}
                  className="text-blue-600"
                />
                <span className="text-sm">
                  I'd like to receive updates about events and offers
                </span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-lg font-medium text-white transition-colors bg-blue-600 hover:bg-blue-700 flex items-center justify-center gap-2"
            >
              {selectedPaymentMethod === 'mpaisa' ? (
                <>
                  <img 
                    src="https://play-lh.googleusercontent.com/zi2WKWOI8ubMJ9A26JlsYTzFT-73S7Rl9EQglUyheK0VeTXyES_CjuAWHt4LPgzuKSLM=w240-h480-rw" 
                    alt="M-PAISA" 
                    className="h-5"
                  />
                  <span>Pay with M-PAISA</span>
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5" />
                  <span>Pay with Card</span>
                </>
              )}
            </button>
          </form>
        ) : (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-900 mx-auto mb-4"></div>
            <p className="text-gray-600">Processing payment</p>
            <p className="text-sm text-gray-500">Please do not refresh or close your browser window</p>
          </div>
        )}
      </div>
    </div>
  );
}