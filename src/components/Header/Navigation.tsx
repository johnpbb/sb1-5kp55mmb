import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useAdmin } from '../../contexts/AdminContext';

const menuItems = [
  { label: 'HOME', href: '/' },
  { label: 'SERVICES', href: '#services' },
  { label: 'EVENTS', href: '/events' },
  { label: 'ABOUT US', href: '#about' },
  { label: 'CONTACT', href: '#contact' },
];

export default function Navigation() {
  const location = useLocation();
  const { isAdmin } = useAdmin();
  const { user } = useAuth();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#') && location.pathname === '/') {
      e.preventDefault();
      const element = document.getElementById(href.substring(1));
      element?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const renderNavLink = (href: string, label: string) => (
    <Link
      to={href}
      className="text-white text-sm font-medium tracking-wider hover:text-red-500 transition-colors duration-200 relative group"
    >
      {label}
      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-red-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200" />
    </Link>
  );

  return (
    <nav className="hidden md:block">
      <ul className="flex gap-8">
        {menuItems.map((item) => (
          <li key={item.label}>
            {item.href.startsWith('#') ? (
              <a
                href={item.href}
                onClick={(e) => handleClick(e, item.href)}
                className="text-white text-sm font-medium tracking-wider hover:text-red-500 transition-colors duration-200 relative group"
              >
                {item.label}
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-red-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200" />
              </a>
            ) : (
              <Link
                to={item.href}
                className="text-white text-sm font-medium tracking-wider hover:text-red-500 transition-colors duration-200 relative group"
              >
                {item.label}
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-red-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200" />
              </Link>
            )}
          </li>
        ))}
        {user && (
          <li>
            {isAdmin ? (
              renderNavLink("/admin", "ADMIN")
            ) : (
              renderNavLink("/dashboard", "MY TICKETS")
            )}
          </li>
        )}
        {!user && (
          <li>
            {renderNavLink("/auth", "LOGIN")}
          </li>
        )}
      </ul>
    </nav>
  );
}