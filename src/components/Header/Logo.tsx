import React from 'react';
import { Tent } from 'lucide-react';

export default function Logo() {
  return (
    <a href="/" className="flex items-center gap-2 text-white">
      <Tent className="w-8 h-8 text-red-500" />
      <span className="text-xl font-bold tracking-wider">
        The TOTAL<span className="text-red-500">EVENT Co.</span>
      </span>
    </a>
  );
}