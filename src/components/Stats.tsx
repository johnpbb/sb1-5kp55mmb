import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const stats = [
  { value: 1000, label: 'Events Managed', suffix: '+' },
  { value: 500, label: 'Happy Clients', suffix: '+' },
  { value: 100, label: 'Premium Venues', suffix: '+' },
  { value: 50, label: 'Team Members', suffix: '+' }
];

export default function Stats() {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  return (
    <section className="py-20 bg-gradient-to-r from-blue-950 to-blue-900 text-white">
      <div className="max-w-6xl mx-auto px-6">
        <div ref={ref} className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <motion.div
                initial={{ number: 0 }}
                animate={inView ? { number: stat.value } : { number: 0 }}
                transition={{ duration: 2, ease: "easeOut" }}
                className="text-4xl md:text-5xl font-bold mb-2"
              >
                {inView ? stat.value : 0}{stat.suffix}
              </motion.div>
              <div className="text-lg text-gray-300">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}