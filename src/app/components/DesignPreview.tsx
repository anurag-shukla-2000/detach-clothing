'use client';

import Image from 'next/image';
import { useCart } from '../context/CartContext';
import { useState, useEffect, useCallback, useMemo } from 'react';

// Toast Component (keep as is)
interface ToastProps {
  message: string;
  show: boolean;
  onClose: () => void;
}

const Toast = ({ message, show, onClose }: ToastProps) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  return (
    <div className={`
      fixed bottom-4 right-4 
      sm:bottom-6 sm:right-6
      bg-gray-900 text-white px-4 py-3 
      sm:px-6 sm:py-3 rounded-lg shadow-lg 
      transition-opacity duration-300 z-[1000] 
      ${show ? 'opacity-100' : 'opacity-0 pointer-events-none'}
      max-w-[90vw] text-sm sm:text-base
    `}>
      <div className="flex items-center">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-5 w-5 sm:h-6 sm:w-6 mr-2 text-green-400" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        <span className="truncate">{message}</span>
      </div>
    </div>
  );
};

// Constants (keep as is)
const ARTWORK_NAMES = [
  "Eclipse", "Nova", "Luna", "Sol", "Orbit", "Cosmos", "Nebula", "Pulsar", 
  "Quasar", "Vortex", "Zenith", "Aurora", "Celestial", "Infinity", "Eternal",
  "Mirage", "Onyx", "Crimson", "Azure", "Emerald", "Sapphire", "Amber", 
  "Ivory", "Obsidian", "Platinum", "Titan", "Aether", "Phantom", "Vapor", 
  "Luster", "Prism", "Radiance", "Silhouette", "Echo", "Ripple", "Frost",
  "Ember", "Blaze", "Glacier", "Monarch", "Dynasty", "Regal", "Majesty",
  "Opulence", "Pinnacle", "Summit", "Vertex", "Paragon", "Echelon", "Apex",
  "Crest", "Throne", "Crown", "Scepter", "Chalice", "Relic", "Artifact",
  "Glyph", "Rune", "Sigil", "Talisman", "Pendant", "Medallion", "Ornament"
];

const TSHIRTS = [
  { 
    src: '/mockups/tshirt_1.jpg', 
    label: 'Maroon', 
    details: '240 GSM Bio-Washed Cotton • Oversized Fit', 
    sizes: ['XL', 'XXL'], 
    price: 499 
  },
  { 
    src: '/mockups/tshirt_2.jpg', 
    label: 'Army Green', 
    details: '240 GSM Bio-Washed Cotton • Oversized Fit', 
    sizes: ['XL', 'XXL'], 
    price: 499 
  },
  { 
    src: '/mockups/tshirt_3.jpg', 
    label: 'Black', 
    details: '240 GSM Bio-Washed Cotton • Oversized Fit', 
    sizes: ['XL', 'XXL'], 
    price: 399 
  },
  { 
    src: '/mockups/tshirt_4.jpg', 
    label: 'Lavender', 
    details: '240 GSM Bio-Washed Cotton • Oversized Fit', 
    sizes: ['XL', 'XXL'], 
    price: 399 
  },
  { 
    src: '/mockups/tshirt_5.jpg', 
    label: 'White', 
    details: '240 GSM Bio-Washed Cotton • Oversized Fit', 
    sizes: ['XL', 'XXL'], 
    price: 499 
  },
];

const DESIGNS = Array.from({ length: 24 }, (_, i) => ({
  src: `/designs/image_${i + 1}.webp`,
  id: i + 1,
  price: 199
}));

// Color combinations for backgrounds
const COLOR_COMBINATIONS = [
  { tshirt: 'from-blue-50 to-blue-100', design: 'from-amber-50 to-amber-100', preview: 'from-emerald-50 to-emerald-100' },
  { tshirt: 'from-rose-50 to-rose-100', design: 'from-violet-50 to-violet-100', preview: 'from-cyan-50 to-cyan-100' },
  { tshirt: 'from-emerald-50 to-emerald-100', design: 'from-orange-50 to-orange-100', preview: 'from-indigo-50 to-indigo-100' },
  { tshirt: 'from-purple-50 to-purple-100', design: 'from-pink-50 to-pink-100', preview: 'from-teal-50 to-teal-100' },
  { tshirt: 'from-orange-50 to-orange-100', design: 'from-blue-50 to-blue-100', preview: 'from-rose-50 to-rose-100' },
  { tshirt: 'from-cyan-50 to-cyan-100', design: 'from-emerald-50 to-emerald-100', preview: 'from-purple-50 to-purple-100' },
  { tshirt: 'from-lime-50 to-lime-100', design: 'from-red-50 to-red-100', preview: 'from-amber-50 to-amber-100' },
  { tshirt: 'from-teal-50 to-teal-100', design: 'from-yellow-50 to-yellow-100', preview: 'from-blue-50 to-blue-100' },
  { tshirt: 'from-indigo-50 to-indigo-100', design: 'from-green-50 to-green-100', preview: 'from-orange-50 to-orange-100' },
  { tshirt: 'from-pink-50 to-pink-100', design: 'from-cyan-50 to-cyan-100', preview: 'from-lime-50 to-lime-100' },
  { tshirt: 'from-yellow-50 to-yellow-100', design: 'from-purple-50 to-purple-100', preview: 'from-teal-50 to-teal-100' },
  { tshirt: 'from-red-50 to-red-100', design: 'from-indigo-50 to-indigo-100', preview: 'from-pink-50 to-pink-100' },
];

export default function DesignPreview() {
  const [currentTshirt, setCurrentTshirt] = useState(0);
  const [currentDesign, setCurrentDesign] = useState(0);
  const [selectedSize, setSelectedSize] = useState('XL');
  const { addToCart } = useCart();
  
  // Toast state
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Get current color combination based on indices
  const currentColors = useMemo(() => {
    const comboIndex = (currentTshirt + currentDesign) % COLOR_COMBINATIONS.length;
    return COLOR_COMBINATIONS[comboIndex];
  }, [currentTshirt, currentDesign]);

  // Memoized current selections
  const currentTshirtData = useMemo(() => TSHIRTS[currentTshirt], [currentTshirt]);
  const currentDesignData = useMemo(() => DESIGNS[currentDesign], [currentDesign]);

  // Get adjacent T-shirts and designs for showroom effect
  const adjacentTshirts = useMemo(() => {
    const prevIndex = (currentTshirt - 1 + TSHIRTS.length) % TSHIRTS.length;
    const nextIndex = (currentTshirt + 1) % TSHIRTS.length;
    return [TSHIRTS[prevIndex], TSHIRTS[currentTshirt], TSHIRTS[nextIndex]];
  }, [currentTshirt]);

  const adjacentDesigns = useMemo(() => {
    // Use only first 10 designs for faster loading
    const designPool = DESIGNS.slice(0, 10);
    const prevIndex = (currentDesign - 1 + designPool.length) % designPool.length;
    const nextIndex = (currentDesign + 1) % designPool.length;
    return [designPool[prevIndex], designPool[currentDesign], designPool[nextIndex]];
  }, [currentDesign]);

  // Optimized handlers
  const showNotification = useCallback((message: string) => {
    setToastMessage(message);
    setShowToast(true);
  }, []);

  const handleAddTshirtToCart = useCallback(() => {
    addToCart({
      type: 'tshirt',
      item: currentTshirtData,
      size: selectedSize,
      price: currentTshirtData.price
    });
    showNotification(`${currentTshirtData.label} T-shirt (${selectedSize}) added to cart`);
  }, [currentTshirtData, selectedSize, addToCart, showNotification]);

  const handleAddDesignToCart = useCallback(() => {
    addToCart({
      type: 'design',
      item: currentDesignData,
      price: currentDesignData.price
    });
    showNotification(`Design #${currentDesignData.id} (${ARTWORK_NAMES[currentDesignData.id - 1]}) added to cart`);
  }, [currentDesignData, addToCart, showNotification]);

  const handleAddBothToCart = useCallback(() => {
    addToCart({
      type: 'tshirt',
      item: currentTshirtData,
      size: selectedSize,
      price: currentTshirtData.price
    });
    addToCart({
      type: 'design',
      item: currentDesignData,
      price: currentDesignData.price
    });
    showNotification('Complete outfit added to cart');
  }, [currentTshirtData, currentDesignData, selectedSize, addToCart, showNotification]);

  // Navigation handlers
  const nextTshirt = useCallback(() => {
    setCurrentTshirt((prev) => (prev + 1) % TSHIRTS.length);
  }, []);

  const prevTshirt = useCallback(() => {
    setCurrentTshirt((prev) => (prev - 1 + TSHIRTS.length) % TSHIRTS.length);
  }, []);

  const nextDesign = useCallback(() => {
    setCurrentDesign((prev) => (prev + 1) % 10); // Only loop through first 10 designs
  }, []);

  const prevDesign = useCallback(() => {
    setCurrentDesign((prev) => (prev - 1 + 10) % 10); // Only loop through first 10 designs
  }, []);

  // Direct selection handlers
  const selectTshirt = useCallback((index: number) => {
    setCurrentTshirt(index);
  }, []);

  const selectDesign = useCallback((index: number) => {
    setCurrentDesign(index);
  }, []);

  return (
    <div className="min-h-screen bg-gray-300">
      <Toast message={toastMessage} show={showToast} onClose={() => setShowToast(false)} />
      
      <div className="pt-5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          {/* Hero Text - More Compact */}
          <div className="text-center mb-6 md:mb-8">
            <p className="text-base text-gray-600 mt-2 leading-relaxed">
              Buy One really amazing quality Tshirt and Switch designs in seconds for every occasion.
            </p>
            <p className="text-base text-gray-600 mt-1 leading-relaxed">
              "Leave your mark on our Collection — upload your own artwork and earn royalties every time your design makes a sale."
            </p>
          </div>

          {/* Main Customizer Section */}
          <div className="flex flex-col xl:flex-row gap-4 md:gap-6 mb-12">
            
            {/* Left Column - T-shirt Selector with Showroom */}
            <div className="xl:w-1/2">
              {/* T-shirt Selector */}
              <div className={`bg-white p-4 rounded-xl shadow-lg bg-gradient-to-br ${currentColors.tshirt}`}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">Choose T-shirt</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={prevTshirt}
                      className="w-9 h-9 flex items-center justify-center bg-gray-800 hover:bg-gray-900 text-white rounded-full transition-all shadow-md hover:shadow-lg"
                      aria-label="Previous t-shirt"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      onClick={nextTshirt}
                      className="w-9 h-9 flex items-center justify-center bg-gray-800 hover:bg-gray-900 text-white rounded-full transition-all shadow-md hover:shadow-lg"
                      aria-label="Next t-shirt"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* T-shirt Showroom - 3 T-shirts side by side */}
                <div className="flex gap-2 mb-3">
                  {adjacentTshirts.map((tshirt, index) => {
                    const isActive = tshirt.label === currentTshirtData.label;
                    const tshirtIndex = TSHIRTS.findIndex(t => t.label === tshirt.label);
                    return (
                      <div
                        key={tshirt.label}
                        onClick={() => selectTshirt(tshirtIndex)}
                        className={`flex-1 cursor-pointer transition-all duration-300 ${
                          isActive 
                            ? 'scale-105 ring-2 ring-gray-800 rounded-lg' 
                            : 'scale-95 opacity-70 hover:scale-100 hover:opacity-90'
                        }`}
                      >
                        <div className="relative bg-white/50 rounded-lg p-2">
                          <Image
                            src={tshirt.src}
                            alt={tshirt.label}
                            width={200}
                            height={200}
                            className="w-full h-28 object-contain"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="text-center space-y-2">
                  <h4 className="font-medium text-gray-900 text-lg">{currentTshirtData.label}</h4>
                  <p className="text-sm text-gray-600">{currentTshirtData.details}</p>
                  
                  {/* Size Selector */}
                  <div className="flex justify-center gap-2 mt-2">
                    {currentTshirtData.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 rounded-full font-medium text-sm transition-all ${
                          selectedSize === size 
                            ? 'bg-gray-900 text-white shadow-sm' 
                            : 'bg-white/80 text-gray-800 hover:bg-white'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>

                  {/* Add T-shirt Button with Price */}
                  <button
                    onClick={handleAddTshirtToCart}
                    className="w-full mt-3 bg-gray-800 hover:bg-gray-700 text-white py-3 rounded-lg transition-colors font-medium shadow-md flex items-center justify-center gap-2"
                  >
                    <span>Add T-shirt to cart -</span>
                    <span className="bg-gray-800/20 px-0 py-0.5 rounded text-sm">₹{currentTshirtData.price}</span>
                  </button>
                </div>
              </div>

              {/* Design Selector with Showroom */}
              <div className={`bg-white p-4 rounded-xl shadow-lg bg-gradient-to-br ${currentColors.design} mt-4`}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">Choose Design</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={prevDesign}
                      className="w-9 h-9 flex items-center justify-center bg-gray-800 hover:bg-gray-900 text-white rounded-full transition-all shadow-md hover:shadow-lg"
                      aria-label="Previous design"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      onClick={nextDesign}
                      className="w-9 h-9 flex items-center justify-center bg-gray-800 hover:bg-gray-900 text-white rounded-full transition-all shadow-md hover:shadow-lg"
                      aria-label="Next design"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Design Showroom - 3 designs side by side */}
                <div className="flex gap-2 mb-3">
                  {adjacentDesigns.map((design, index) => {
                    const isActive = design.id === currentDesignData.id;
                    return (
                      <div
                        key={design.id}
                        onClick={() => selectDesign(design.id - 1)}
                        className={`flex-1 cursor-pointer transition-all duration-300 ${
                          isActive 
                            ? 'scale-105 ring-2 ring-gray-800 rounded-lg' 
                            : 'scale-95 opacity-70 hover:scale-100 hover:opacity-90'
                        }`}
                      >
                        <div className="relative bg-white/50 rounded-lg p-2">
                          <Image
                            src={design.src}
                            alt={`Design ${design.id}`}
                            width={200}
                            height={200}
                            className="w-full h-28 object-contain"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="text-center space-y-2">
                  <h4 className="font-medium text-gray-900 text-lg">
                    {ARTWORK_NAMES[currentDesignData.id - 1]} #{currentDesignData.id}
                  </h4>
                  <p className="text-sm text-gray-600">Detachable design • Fits all Detach t-shirts</p>

                  {/* Add Design Button with Price */}
                  <button
                    onClick={handleAddDesignToCart}
                    className="w-full mt-3 bg-gray-800 hover:bg-gray-700 text-white py-3 rounded-lg transition-colors font-medium shadow-md flex items-center justify-center gap-2"
                  >
                    <span>Add Design to cart -</span>
                    <span className="bg-gray-800/20 px-0 py-1 rounded text-sm">₹{currentDesignData.price}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column - Preview & Add to Cart */}
            <div className="xl:w-1/2 flex flex-col mt-0">
            <div className={`bg-white p-4 rounded-2xl shadow-xl flex-1 bg-gradient-to-br ${currentColors.preview}`}>
              <div className="text-center mb-4">
                  <h3 className="text-xl font-bold text-gray-900">Your Custom Creation</h3>
                  <p className="text-gray-600 text-sm">Live Preview - Changes Instantly</p>
                </div>

            {/* Combined Preview - Optimized Size */}
            <div className="relative aspect-square max-w-md mx-auto mb-4">
              <div className="relative w-full h-full">
                {/* T-shirt Base */}
                <Image
                  src={currentTshirtData.src}
                  alt={currentTshirtData.label}
                  width={500}
                  height={500}
                  className="w-full h-full object-contain"
                  priority
                />
                {/* Design Overlay - Increased Size */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1/3">
                  <Image
                    src={currentDesignData.src}
                    alt={`Design ${currentDesignData.id}`}
                    width={250}
                    height={250}
                    className="w-full h-full object-contain drop-shadow-lg"
                    priority
                  />
                </div>
              </div>
            </div>
                {/* Compact Price Breakdown - Same width as button */}
                <div className="flex justify-center mb-4">
                  <div className="bg-white/70 rounded-lg px-4 py-2 flex items-center gap-3 text-sm max-w-md w-full justify-center">
                    <div className="text-center">
                      <p className="text-gray-900 text-xs">T-shirt</p>
                      <p className="font-semibold text-gray-900">₹{currentTshirtData.price}</p>
                    </div>
                    <div className="text-gray-500">+</div>
                    <div className="text-center">
                      <p className="text-gray-900 text-xs">Design</p>
                      <p className="font-semibold text-gray-900">₹{currentDesignData.price}</p>
                    </div>
                    <div className="text-gray-500">=</div>
                    <div className="text-center">
                      <p className="text-gray-600 text-xs">Total</p>
                      <p className="font-bold text-gray-900">₹{currentTshirtData.price + currentDesignData.price}</p>
                    </div>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <div className="text-center">
                  <button
                    onClick={handleAddBothToCart}
                    className="w-full max-w-md bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg mx-auto"
                  >
                    Add Complete Outfit - ₹{currentTshirtData.price + currentDesignData.price}
                  </button>
                  <p className="text-xs text-gray-500 mt-2">
                    1 week shipping • 30-day returns • COD available in Bhopal
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}