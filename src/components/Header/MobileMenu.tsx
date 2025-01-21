import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { useAdmin } from '../../contexts/AdminContext';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../ui/Button';

const menuItems = [
  { label: 'HOME', href: '/' },
  { label: 'SERVICES', href: '#services' },
  { label: 'EVENTS', href: '/events' },
  { label: 'ABOUT US', href: '#about' },
  { label: 'CONTACT', href: '#contact' },
];

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { isAdmin } = useAdmin();
  const { user } = useAuth();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#') && location.pathname === '/') {
      e.preventDefault();
      const element = document.getElementById(href.substring(1));
      element?.scrollIntoView({ behavior: 'smooth' });
    }
    setIsOpen(false);
  };

  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-white p-2"
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-blue-950 shadow-lg py-4 px-6"
          >
            <ul className="space-y-4">
              {menuItems.map((item) => (
                <li key={item.label}>
                  {item.href.startsWith('#') ? (
                    <a
                      href={item.href}
                      onClick={(e) => handleClick(e, item.href)}
                      className="block text-white hover:text-red-500 transition-colors duration-200"
                    >
                      {item.label}
                    </a>
                  ) : (
                    <Link
                      to={item.href}
                      onClick={() => setIsOpen(false)}
                      className="block text-white hover:text-red-500 transition-colors duration-200"
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
              {user ? (
                <li>
                  <Link
                    to={isAdmin ? "/admin" : "/dashboard"}
                    onClick={() => setIsOpen(false)}
                    className="block text-white hover:text-red-500 transition-colors duration-200"
                  >
                    {isAdmin ? "ADMIN" : "MY TICKETS"}
                  </Link>
                </li>
              ) : (
                <li>
                  <Link
                    to="/auth"
                    onClick={() => setIsOpen(false)}
                    className="block text-white hover:text-red-500 transition-colors duration-200"
                  >
                    LOGIN
                  </Link>
                </li>
              )}
            </ul>
            <div className="mt-6 flex flex-col gap-3">
              <Button variant="primary" size="sm" className="w-full">
                Plan Your Event
              </Button>
              <Button variant="secondary" size="sm" className="w-full">
                Buy Tickets
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}