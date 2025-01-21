import React from 'react';
import { Loader2 } from 'lucide-react';

interface PaymentButtonProps {
  onClick: () => void;
  loading?: boolean;
  disabled?: boolean;
}

export default function PaymentButton({ onClick, loading = false, disabled = false }: PaymentButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={loading || disabled}
      className="flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full"
    >
      {loading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <>
          <img 
            src="https://www.vodafone.com.fj/images/logo.png" 
            alt="M-PAISA" 
            className="h-6"
          />
          <span>Pay with M-PAISA</span>
        </>
      )}
    </button>
  );
}