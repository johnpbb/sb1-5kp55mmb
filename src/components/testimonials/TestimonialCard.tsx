import React from 'react';
import { Star } from 'lucide-react';
import { Testimonial } from '../../types/testimonial';

interface TestimonialCardProps {
  testimonial: Testimonial;
}

export default function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <div className="bg-gray-50 rounded-lg p-8 md:p-12 text-center">
      <div className="w-20 h-20 mx-auto mb-6">
        <img
          src={testimonial.image}
          alt={testimonial.name}
          className="w-full h-full object-cover rounded-full"
        />
      </div>
      <div className="flex justify-center gap-1 mb-6">
        {[...Array(testimonial.rating)].map((_, i) => (
          <Star key={i} className="w-5 h-5 fill-current text-yellow-400" />
        ))}
      </div>
      <blockquote className="text-lg md:text-xl italic mb-6 text-gray-700">
        "{testimonial.quote}"
      </blockquote>
      <div className="font-semibold text-lg">{testimonial.name}</div>
      <div className="text-gray-600">
        {testimonial.role} at {testimonial.company}
      </div>
    </div>
  );
}