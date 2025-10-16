'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '../context/CartContext';
import TrialRoom from '../components/TrialRoom';

type CatState = 'walking' | 'sitting' | 'playing' | 'meowing';

interface WhiteCatAnimationProps {
  state: CatState;
}

const WhiteCatAnimation = ({ state }: WhiteCatAnimationProps) => {
  const CatStates: Record<CatState, React.ReactElement> = {
    walking: (
      <svg width="40" height="30" viewBox="0 0 40 30" className="animate-walk">
        <path d="M20 15C20 20 25 25 25 25" stroke="white" strokeWidth="2" />
        <path d="M15 20C15 25 10 28 10 28" stroke="white" strokeWidth="2" />
        <circle cx="30" cy="10" r="5" fill="white" />
        <ellipse cx="30" cy="10" rx="3" ry="2" fill="black" />
        <path d="M28 8L26 6M32 8L34 6" stroke="white" strokeWidth="1.5" />
      </svg>
    ),
    sitting: (
      <svg width="40" height="30" viewBox="0 0 40 30" className="animate-pulse">
        <circle cx="20" cy="10" r="7" fill="white" />
        <ellipse cx="20" cy="10" rx="4" ry="3" fill="black" />
        <path d="M17 8L15 6M23 8L25 6" stroke="white" strokeWidth="1.5" />
        <path d="M20 17L20 25" stroke="white" strokeWidth="2" />
      </svg>
    ),
    playing: (
      <svg width="40" height="30" viewBox="0 0 40 30" className="animate-bounce">
        <circle cx="20" cy="15" r="5" fill="white" />
        <path d="M20 20L20 25L15 30" stroke="white" strokeWidth="2" />
        <circle cx="18" cy="14" r="1" fill="black" />
        <circle cx="22" cy="14" r="1" fill="black" />
        <path d="M19 17L21 17" stroke="black" strokeWidth="1.5" />
      </svg>
    ),
    meowing: (
      <div className="relative">
        <svg width="40" height="30" viewBox="0 0 40 30">
          <circle cx="20" cy="15" r="8" fill="white" />
          <circle cx="16" cy="13" r="2" fill="black" />
          <circle cx="24" cy="13" r="2" fill="black" />
          <path d="M18 18L22 18" stroke="black" strokeWidth="2" />
          <path d="M20 15L20 20" stroke="black" strokeWidth="1.5" />
        </svg>
        <div className="absolute -top-5 -right-2 text-xs bg-white text-black px-2 py-1 rounded-full animate-fade">
            <span className="font-bold">Buy Something!</span>
        </div>
      </div>
    )
  };

  return CatStates[state] ?? CatStates.sitting;
};

export default function Navbar() {
  const { cartItems } = useCart();
  const [showTrialRoom, setShowTrialRoom] = useState(false);
  const [catState, setCatState] = useState<CatState>('walking');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const states: CatState[] = ['walking', 'sitting', 'playing', 'meowing'];
    const interval = setInterval(() => {
      setCatState(prev => states[(states.indexOf(prev) + 1) % states.length]);
    }, 50000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      <nav className="w-full px-4 md:px-6 py-3 md:py-5 bg-black text-white flex items-center fixed top-0 z-50 border-b border-gray-800 shadow-lg h-[60px] md:h-[70px]">
        {/* Mobile menu button */}
        <button 
          className="md:hidden p-2 mr-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-6 w-6" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} 
            />
          </svg>
        </button>

        {/* Logo and Mobile Cart */}
        <div className="flex items-center">
          <Link href="/" className="text-lg md:text-xl font-bold hover:text-gray-300 transition-colors duration-200">
            DETACH
          </Link>
          
          {/* Mobile Cart Icon - positioned next to logo */}
          <div className="md:hidden ml-4 relative">
            <Link href="/cart" className="flex items-center hover:text-gray-300">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-6 w-6" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" 
                />
              </svg>
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* White Cat Animation - Desktop only */}
        <div className="hidden md:flex flex-1 justify-center">
          <div className="flex items-center">
            <WhiteCatAnimation state={catState} />
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6 ml-auto">
          <Link href="#designs" className="hover:text-gray-300 transition-colors duration-200 hover:scale-105 transform">
            Designs
          </Link>
          <Link href="/about" className="hover:text-gray-300 transition-colors duration-200 hover:scale-105 transform">
            About 
          </Link>
          <Link href="/upload" className="hover:text-gray-300 transition-colors duration-200 hover:scale-105 transform">
            Upload
          </Link>
          
          {/* Trial Room Button - Desktop */}
          {cartItems.length > 0 && (
            <button
              onClick={() => setShowTrialRoom(true)}
              className="px-3 py-1 bg-white text-black rounded-full text-sm hover:bg-gray-100 transition-colors duration-200 whitespace-nowrap"
            >
              Trial Room
            </button>
          )}

          {/* Cart Icon - Desktop */}
          <div className="relative ml-2">
            <Link href="/cart" className="flex items-center hover:text-gray-300 transition-all duration-200 hover:scale-110 transform">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </Link>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed top-[60px] left-0 right-0 bg-black z-40 border-b border-gray-800 shadow-lg md:hidden">
          <div className="flex flex-col space-y-4 p-4">
            <Link 
              href="#designs" 
              className="hover:text-gray-300 transition-colors duration-200 py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Designs
            </Link>
            <Link 
              href="/about" 
              className="hover:text-gray-300 transition-colors duration-200 py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link 
              href="/upload" 
              className="hover:text-gray-300 transition-colors duration-200 py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Upload
            </Link>
{cartItems.length > 0 && (
  <div className="pt-4 border-t border-gray-700 flex justify-start">
    <button
      onClick={() => {
        setShowTrialRoom(true);
        setIsMobileMenuOpen(false);
      }}
      className="text-xs px-3 py-1 bg-white text-black rounded-full hover:bg-gray-200 transition duration-150"
    >
      Trial Room
    </button>
  </div>
)}


          </div>
        </div>
      )}

      {/* Trial Room Modal */}
      {showTrialRoom && <TrialRoom onClose={() => setShowTrialRoom(false)} />}

      {/* Animation styles */}
      <style jsx global>{`
        @keyframes walk {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px) rotate(-5deg); }
          50% { transform: translateX(0); }
          75% { transform: translateX(5px) rotate(5deg); }
        }
        .animate-walk {
          animation: walk 2s infinite;
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        .animate-pulse {
          animation: pulse 3s infinite;
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .animate-bounce {
          animation: bounce 1.5s infinite;
        }
        @keyframes fade {
          0%, 100% { opacity: 0; transform: translateY(0); }
          50% { opacity: 1; transform: translateY(-5px); }
        }
        .animate-fade {
          animation: fade 2s infinite;
        }
      `}</style>
    </>
  );
}