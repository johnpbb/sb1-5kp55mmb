import React from 'react';
import { motion } from 'framer-motion';
import Button from './ui/Button';

export default function CallToAction() {
  return (
    <section className="py-20 bg-gradient-to-r from-blue-950 to-blue-900 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_0%,rgba(0,0,0,0)_50%)]" />
      </div>
      
      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-3xl md:text-5xl font-bold mb-6 text-white font-poppins"
        >
          Ready to Create Your Next Event?
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-lg md:text-xl mb-12 text-gray-300"
        >
          Let's transform your vision into an unforgettable experience
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button variant="primary" size="lg">
            Contact Us
          </Button>
          
        </motion.div>
      </div>
    </section>
  );
}