import React, { createContext, useContext, useState } from 'react';
import { PaymentStatus, PaymentResponse } from '../types/payment';
import { initializePayment, verifyTransaction } from '../lib/mpaisa';

interface PaymentContextType {
  status: PaymentStatus;
  error: string | null;
  initiatePayment: (amount: number, itemDetails: string) => Promise<void>;
  verifyPayment: (transactionId: string) => Promise<void>;
  resetPayment: () => void;
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export function PaymentProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<PaymentStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  const initiatePayment = async (amount: number, itemDetails: string) => {
    try {
      setStatus('processing');
      setError(null);
      const paymentUrl = await initializePayment(amount, itemDetails);
      window.location.href = paymentUrl;
    } catch (err) {
      setStatus('failed');
      setError(err instanceof Error ? err.message : 'Payment initialization failed');
    }
  };

  const verifyPayment = async (transactionId: string) => {
    try {
      const response = await verifyTransaction(transactionId);
      switch (response.code) {
        case '101':
          setStatus('success');
          break;
        case '111':
          setStatus('cancelled');
          break;
        default:
          setStatus('failed');
          setError(response.message);
      }
    } catch (err) {
      setStatus('failed');
      setError(err instanceof Error ? err.message : 'Payment verification failed');
    }
  };

  const resetPayment = () => {
    setStatus('idle');
    setError(null);
  };

  return (
    <PaymentContext.Provider value={{
      status,
      error,
      initiatePayment,
      verifyPayment,
      resetPayment
    }}>
      {children}
    </PaymentContext.Provider>
  );
}

export function usePayment() {
  const context = useContext(PaymentContext);
  if (context === undefined) {
    throw new Error('usePayment must be used within a PaymentProvider');
  }
  return context;
}