import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { Calendar } from 'lucide-react';
import Button from './ui/Button';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const events = [
  {
    id: 1,
    title: 'Pacific Tech Summit 2024',
    date: '2024-06-15',
    location: 'Auckland Convention Centre',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80'
  },
  {
    id: 2,
    title: 'Wine & Food Festival',
    date: '2024-07-22',
    location: 'Wellington Waterfront',
    image: 'https://images.unsplash.com/photo-1510924199351-4e9d94df18a6?auto=format&fit=crop&q=80'
  },
  {
    id: 3,
    title: 'Summer Music Festival',
    date: '2024-08-10',
    location: 'Christchurch Park',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80'
  }
];

export default function FeaturedEvents() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 font-poppins text-blue-950">
          Featured Events
        </h2>
        
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000 }}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 }
          }}
          className="pb-12"
        >
          {events.map((event) => (
            <SwiperSlide key={event.id}>
              <div className="bg-white rounded-lg overflow-hidden shadow-lg">
                <div className="relative h-48">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded-full flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-red-500" />
                    <span className="text-sm font-medium">
                      {new Date(event.date).toLocaleDateString('en-NZ', { 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                  <p className="text-gray-600 mb-4">{event.location}</p>
                  <Button variant="primary" size="sm" className="w-full">
                    Get Tickets
                  </Button>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}