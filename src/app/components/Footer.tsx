'use client';

import { FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-black text-white px-4 sm:px-6 md:px-20 py-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12 md:gap-16">
        
        {/* Brand Section */}
        <div className="sm:col-span-2 md:col-span-1">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">DETACH</h2>
          <p className="mt-3 sm:mt-4 text-sm text-gray-400 leading-relaxed max-w-xs">
            Redefine your style. Switch your vibe. One T-shirt, infinite looks. Designed for those who don't settle.
          </p>
        </div>

        {/* Navigation Links */}
        <div>
          <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Explore</h3>
          <ul className="space-y-2 sm:space-y-3 text-gray-300 text-sm">
            {[
              { name: 'Home', href: '/' },
              { name: 'About Us', href: '/about' },
              { name: 'Custom Orders', href: '/custom-orders' }
            ].map((link) => (
              <li key={link.name}>
                <a
                  href={link.href}
                  className="hover:text-white hover:underline underline-offset-4 transition-all duration-200"
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Artist Upload Section */}
        <div className="sm:col-start-2 md:col-start-auto">
          <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">For Artists</h3>
          <p className="text-sm text-gray-400 mb-4 sm:mb-5 max-w-xs">
            Got a design that belongs on our tees? Share your art and become part of the movement.
          </p>
          <a
            href="/upload"
            className="inline-block px-4 sm:px-5 py-2 bg-white text-black rounded-lg font-medium sm:font-semibold text-sm sm:text-base shadow hover:bg-gray-100 hover:scale-105 transition-all duration-200"
          >
            Upload Artwork
          </a>
        </div>

        {/* Social Links */}
        <div className="sm:col-start-1 md:col-start-auto">
          <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Follow Us</h3>
          <div className="flex items-center space-x-4 sm:space-x-5 text-lg sm:text-xl text-gray-300">
            <a href="#" className="hover:text-white transition transform hover:scale-125 duration-200">
              <FaInstagram />
            </a>
            <a href="#" className="hover:text-white transition transform hover:scale-125 duration-200">
              <FaTwitter />
            </a>
            <a href="#" className="hover:text-white transition transform hover:scale-125 duration-200">
              <FaYoutube />
            </a>
          </div>
          <p className="mt-4 sm:mt-6 text-xs sm:text-sm text-gray-500">
            Phone - 9244967565
          </p>
        </div>
      </div>

      {/* Copyright */}
      <div className="mt-10 sm:mt-16 border-t border-gray-800 pt-6 text-center text-xs sm:text-sm text-gray-500">
        © {new Date().getFullYear()} Detach. All rights reserved.
      </div>
    </footer>
  );
}