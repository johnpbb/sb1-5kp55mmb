import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Logo from './Logo';
import Navigation from './Navigation';
import SearchBar from './SearchBar';
import MobileMenu from './MobileMenu';
import Button from '../ui/Button';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();
  const headerBackground = useTransform(
    scrollY,
    [0, 100],
    ['rgba(30, 61, 89, 0)', 'rgba(30, 61, 89, 0.95)']
  );

  useEffect(() => {
    const unsubscribe = scrollY.onChange((latest) => {
      setIsScrolled(latest > 50);
    });
    return () => unsubscribe();
  }, [scrollY]);

  return (
    <motion.header
      style={{ backgroundColor: headerBackground }}
      className={`fixed top-0 left-0 right-0 z-50 transition-shadow duration-300 ${
        isScrolled ? 'shadow-lg backdrop-blur-sm' : ''
      }`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          <Logo />
          
          <Navigation />
          
          <div className="hidden md:flex items-center gap-4">
            <SearchBar />
            {/* <Button variant="primary" size="sm">
              Upcoming Events
            </Button> */}
            {/* <Button variant="secondary" size="sm">
              Buy Tickets
            </Button> */}
          </div>
          
          <MobileMenu />
        </div>
      </div>
    </motion.header>
  );
}