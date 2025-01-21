import React from 'react';
import Header from './Header';
import Hero from './Hero';
import Services from './Services';
import Stats from './Stats';
import FeaturedEvents from './FeaturedEvents';
import Testimonials from './Testimonials';
import CallToAction from './CallToAction';
import Footer from './Footer';

export default function AppContent() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <Services />
      <Stats />
      <FeaturedEvents />
      <Testimonials />
      <CallToAction />
      <Footer />
    </main>
  );
}