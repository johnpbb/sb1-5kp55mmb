import React from 'react';
import { Facebook, Instagram, Twitter, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

const quickLinks = [
  { title: 'About Us', href: '#' },
  { title: 'Services', href: '#' },
  { title: 'Events', href: '#' },
  { title: 'Gallery', href: '#' },
  { title: 'Testimonials', href: '#' },
  { title: 'Contact', href: '#' },
];

const services = [
  { title: 'Corporate Events', href: '#' },
  { title: 'Weddings', href: '#' },
  { title: 'Private Parties', href: '#' },
  { title: 'Conferences', href: '#' },
  { title: 'Product Launches', href: '#' },
  { title: 'Virtual Events', href: '#' },
];

export default function Footer() {
  return (
    <footer className="bg-blue-950 text-gray-300">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-6">The Total Event Company</h3>
            <div className="space-y-4">
              <p className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-red-500" />
                <span>123 Business Avenue, Auckland, NZ</span>
              </p>
              <p className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-red-500" />
                <span>+64 9 123 4567</span>
              </p>
              <p className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-red-500" />
                <span>info@totalevent.co.nz</span>
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.title}>
                  <a 
                    href={link.href}
                    className="hover:text-white transition-colors duration-200"
                  >
                    {link.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-6">Our Services</h3>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service.title}>
                  <a 
                    href={service.href}
                    className="hover:text-white transition-colors duration-200"
                  >
                    {service.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-6">Newsletter</h3>
            <p className="mb-4">Subscribe to our newsletter for updates and exclusive offers.</p>
            <form className="space-y-3">
              <input
                type="email"
                placeholder="Your email address"
                className="w-full px-4 py-2 rounded-lg bg-blue-900 border border-blue-800 focus:outline-none focus:ring-2 focus:ring-red-500 text-white placeholder-gray-400"
              />
              <button
                type="submit"
                className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-blue-900">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <p>&copy; {new Date().getFullYear()} The Total Event Company. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white transition-colors duration-200">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-white transition-colors duration-200">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-white transition-colors duration-200">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-white transition-colors duration-200">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}