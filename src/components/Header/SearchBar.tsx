import React from 'react';
import { Search } from 'lucide-react';

export default function SearchBar() {
  return (
    <div className="hidden lg:flex items-center relative">
      <input
        type="text"
        placeholder="Search events..."
        className="w-48 px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white/20 transition-all duration-200"
      />
      <Search className="absolute right-3 w-5 h-5 text-white/60" />
    </div>
  );
}