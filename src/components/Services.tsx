import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Music, Camera, Users, Gift, Map, Utensils, Mic, Trophy } from 'lucide-react';

const services = [
  { icon: Calendar, title: 'Event Planning', description: 'Comprehensive event planning and coordination' },
  { icon: Music, title: 'Entertainment', description: 'Top-tier entertainment booking services' },
  { icon: Camera, title: 'Photography', description: 'Professional event photography and videography' },
  { icon: Users, title: 'Staffing', description: 'Experienced event staff and management' },
  { icon: Gift, title: 'Decor', description: 'Creative and elegant decoration services' },
  { icon: Map, title: 'Venue Selection', description: 'Access to premium venues and locations' },
  { icon: Utensils, title: 'Catering', description: 'Gourmet catering and beverage services' },
  { icon: Mic, title: 'Production', description: 'Full-scale audio and visual production' },
  { icon: Trophy, title: 'Corporate Events', description: 'Specialized corporate event solutions' }
];

export default function Services() {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 font-poppins text-blue-950">
          Our Services
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="p-6 rounded-lg bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <service.icon className="w-12 h-12 text-red-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
              <p className="text-gray-600">{service.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}