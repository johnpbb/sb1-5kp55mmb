import React, { useState } from 'react';
import { usePayment } from '../../contexts/PaymentContext';
import { PaymentMethod } from '../../types/payment';
import { CreditCard } from 'lucide-react';

interface PaymentFormProps {
  amount: number;
  itemDetails: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export default function PaymentForm({ 
  amount, 
  itemDetails,
  onSuccess,
  onError
}: PaymentFormProps) {
  const { status, error, initiatePayment } = usePayment();
  const [loading, setLoading] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('card');

  const handlePayment = async () => {
    try {
      setLoading(true);
      if (selectedMethod === 'mpaisa') {
        await initiatePayment(amount, itemDetails);
      } else {
        // Handle card payment
        window.location.href = 'https://egate.anz.com/payment';
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Payment failed';
      onError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Select Payment Method</h3>
        
        {/* Card Payment Option */}
        <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
          <input
            type="radio"
            name="payment"
            value="card"
            checked={selectedMethod === 'card'}
            onChange={() => setSelectedMethod('card')}
            className="text-blue-600"
          />
          <div className="flex items-center gap-3">
            <CreditCard className="w-6 h-6 text-gray-600" />
            <div>
              <p className="font-medium">Credit/Debit Card</p>
              <p className="text-sm text-gray-500">Pay securely with your card</p>
            </div>
          </div>
          <div className="ml-auto flex gap-2">
            <img src="https://www.vectorlogo.zone/logos/visa/visa-icon.svg" alt="Visa" className="h-6" />
            <img src="https://www.vectorlogo.zone/logos/mastercard/mastercard-icon.svg" alt="Mastercard" className="h-6" />
          </div>
        </label>

        {/* M-PAISA Option */}
        <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
          <input
            type="radio"
            name="payment"
            value="mpaisa"
            checked={selectedMethod === 'mpaisa'}
            onChange={() => setSelectedMethod('mpaisa')}
            className="text-blue-600"
          />
          <div className="flex items-center gap-3">
            <img 
              src="https://www.vodafone.com.fj/images/logo.png" 
              alt="M-PAISA" 
              className="h-6"
            />
            <div>
              <p className="font-medium">M-PAISA</p>
              <p className="text-sm text-gray-500">Pay with your M-PAISA mobile wallet</p>
            </div>
          </div>
        </label>
      </div>

      <button
        onClick={handlePayment}
        disabled={loading || status === 'processing'}
        className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-colors ${
          selectedMethod === 'mpaisa' 
            ? 'bg-green-600 hover:bg-green-700' 
            : 'bg-blue-600 hover:bg-blue-700'
        } disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Processing...</span>
          </>
        ) : (
          <>
            {selectedMethod === 'mpaisa' ? (
              <>
                <img 
                  src="https://www.vodafone.com.fj/images/logo.png" 
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
          </>
        )}
      </button>

      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-lg flex items-center gap-2">
          <XCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      {status === 'success' && (
        <div className="p-4 bg-green-50 text-green-700 rounded-lg flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />
          <span>Payment successful!</span>
        </div>
      )}
    </div>
  );
}