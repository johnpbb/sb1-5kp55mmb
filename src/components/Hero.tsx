import React from 'react';
import { motion } from 'framer-motion';
import Button from './ui/Button';

export default function Hero() {
  return (
    <section className="relative h-screen flex items-center justify-center text-white">
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1520242739010-44e95bde329e?auto=format&fit=crop&q=80')",
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-blue-950/60 to-blue-900/60" />
      </div>
      
      <div className="container mx-auto px-6 z-10 text-center">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-6xl font-bold mb-6 font-poppins"
        >
          Transform Your Vision into Unforgettable Events
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl md:text-2xl mb-12 font-light"
        >
          South Pacific's Premier Event Management Solutions
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button variant="primary" size="lg">Plan Your Event</Button>
          <Button variant="secondary" size="lg">Buy Tickets</Button>
        </motion.div>
      </div>
    </section>
  );
}