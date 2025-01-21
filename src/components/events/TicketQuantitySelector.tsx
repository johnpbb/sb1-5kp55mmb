import React from 'react';
import { Minus, Plus } from 'lucide-react';

interface TicketQuantitySelectorProps {
  quantity: number;
  onChange: (quantity: number) => void;
  maxQuantity: number;
}

export default function TicketQuantitySelector({ 
  quantity, 
  onChange, 
  maxQuantity 
}: TicketQuantitySelectorProps) {
  return (
    <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1">
      <button
        onClick={() => onChange(Math.max(1, quantity - 1))}
        disabled={quantity <= 1}
        className="p-1.5 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label="Decrease quantity"
      >
        <Minus className="w-4 h-4" />
      </button>
      
      <span className="text-lg font-semibold min-w-[2ch] text-center">
        {quantity}
      </span>
      
      <button
        onClick={() => onChange(Math.min(maxQuantity, quantity + 1))}
        disabled={quantity >= maxQuantity}
        className="p-1.5 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label="Increase quantity"
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  );
}