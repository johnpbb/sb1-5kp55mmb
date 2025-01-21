import React from 'react';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { PaymentStatus } from '../../types/payment';

interface PaymentStatusProps {
  status: PaymentStatus;
  message?: string;
}

export default function PaymentStatus({ status, message }: PaymentStatusProps) {
  const statusConfig = {
    idle: { icon: null, color: '', text: '' },
    processing: { 
      icon: <Loader2 className="w-6 h-6 animate-spin" />, 
      color: 'text-blue-500',
      text: 'Processing payment...'
    },
    success: {
      icon: <CheckCircle className="w-6 h-6" />,
      color: 'text-green-500',
      text: 'Payment successful!'
    },
    failed: {
      icon: <XCircle className="w-6 h-6" />,
      color: 'text-red-500',
      text: 'Payment failed'
    },
    cancelled: {
      icon: <AlertCircle className="w-6 h-6" />,
      color: 'text-yellow-500',
      text: 'Payment cancelled'
    }
  };

  if (status === 'idle') return null;

  const config = statusConfig[status];

  return (
    <div className={`flex items-center gap-2 ${config.color}`}>
      {config.icon}
      <span>{message || config.text}</span>
    </div>
  );
}