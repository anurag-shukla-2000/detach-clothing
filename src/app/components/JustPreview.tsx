'use client';

import Image from 'next/image';
import { useMemo, useState, useCallback } from 'react';
import { useCart } from '../context/CartContext';

// Constants (kept exactly as before)
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
  { src: '/mockups/tshirt_1.jpg', label: 'Maroon', details: '240 GSM Bio-Washed Cotton • Oversized Fit', sizes: ['XL', 'XXL'], price: 499 },
  { src: '/mockups/tshirt_2.jpg', label: 'Army Green', details: '240 GSM Bio-Washed Cotton • Oversized Fit', sizes: ['XL', 'XXL'], price: 499 },
  { src: '/mockups/tshirt_3.jpg', label: 'Black', details: '240 GSM Bio-Washed Cotton • Oversized Fit', sizes: ['XL', 'XXL'], price: 399 },
  { src: '/mockups/tshirt_4.jpg', label: 'Lavender', details: '240 GSM Bio-Washed Cotton • Oversized Fit', sizes: ['XL', 'XXL'], price: 399 },
  { src: '/mockups/tshirt_5.jpg', label: 'White', details: '240 GSM Bio-Washed Cotton • Oversized Fit', sizes: ['XL', 'XXL'], price: 499 },
];

const DESIGNS = Array.from({ length: 24 }, (_, i) => ({
  src: `/designs/image_${i + 1}.webp`,
  id: i + 1,
  price: 199
}));

// Make props optional so component can be used standalone
interface JustPreviewProps {
  currentTshirt?: number;
  currentDesign?: number;
  selectedSize?: string;
  onTshirtChange?: (index: number) => void;
  onDesignChange?: (index: number) => void;
  onSizeChange?: (size: string) => void;
  onAddToCart?: () => void;
}

export default function JustPreview({
  currentTshirt: propTshirt,
  currentDesign: propDesign,
  selectedSize: propSize,
  onTshirtChange: propOnTshirtChange,
  onDesignChange: propOnDesignChange,
  onSizeChange: propOnSizeChange,
  onAddToCart: propOnAddToCart
}: JustPreviewProps) {
  // local fallback state (used if parent didn't provide props)
  const [localTshirt, setLocalTshirt] = useState<number>(propTshirt ?? 0);
  const [localDesign, setLocalDesign] = useState<number>(propDesign ?? 0);
  const [localSize, setLocalSize] = useState<string>(propSize ?? 'XL');

  // prefer prop values if provided, else local
  const currentTshirtIndex = propTshirt ?? localTshirt;
  const currentDesignIndex = propDesign ?? localDesign;
  const selectedSize = propSize ?? localSize;

  const currentTshirtData = useMemo(() => TSHIRTS[currentTshirtIndex], [currentTshirtIndex]);
  const currentDesignData = useMemo(() => DESIGNS[currentDesignIndex], [currentDesignIndex]);

  // cart context for standalone behavior
  const { addToCart } = useCart() as any;

  // handlers: call parent callbacks if provided, otherwise update local state
  const handleTshirtChange = useCallback((index: number) => {
    if (propOnTshirtChange) return propOnTshirtChange(index);
    setLocalTshirt(index);
  }, [propOnTshirtChange]);

  const handleDesignChange = useCallback((index: number) => {
    if (propOnDesignChange) return propOnDesignChange(index);
    setLocalDesign(index);
  }, [propOnDesignChange]);

  const handleSizeChange = useCallback((size: string) => {
    if (propOnSizeChange) return propOnSizeChange(size);
    setLocalSize(size);
  }, [propOnSizeChange]);

  // shuffle combo: pick random indices and apply via handlers
  const handleShuffle = useCallback(() => {
    const randomTshirt = Math.floor(Math.random() * TSHIRTS.length);
    const randomDesign = Math.floor(Math.random() * DESIGNS.length);
    handleTshirtChange(randomTshirt);
    handleDesignChange(randomDesign);
  }, [handleTshirtChange, handleDesignChange]);

  // add to cart: call parent onAddToCart if provided, otherwise use cart context
  const handleAddToCart = useCallback(() => {
    if (propOnAddToCart) return propOnAddToCart();

    // fallback: add both to cart using same shape as other components
    try {
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
    } catch (e) {
      // fail silently; parent may provide onAddToCart for robust behavior
      // console.error('Add to cart failed', e);
    }
  }, [propOnAddToCart, addToCart, currentTshirtData, currentDesignData, selectedSize]);

  return (
    <div className="w-full py-30 md:py-34 pb-40 md:pb-52 relative">
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: 'linear-gradient(45deg, #fff 10%, transparent 10%, transparent 50%, #fff 90%)',
          backgroundSize: '300px 300px'
        }}
      ></div>

      {/* Background Image */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center"
        style={{
          backgroundImage: "url('/background/background1.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      ></div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8 md:mb-12">
          <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 md:mb-4 tracking-tight">
            Random T-Shirt & Design Combo
          </h3>
          <p className="text-base md:text-xl text-gray-300 max-w-2xl mx-auto">
            Can't decide? Let us surprise you with a unique mix.
          </p>
        </div>

        <div className="relative group w-full max-w-2xl mx-auto">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-700 to-gray-900 rounded-xl md:rounded-2xl opacity-0 group-hover:opacity-15 blur-xl transition-opacity duration-500"></div>

          <div className="relative bg-gray-900/80 backdrop-blur-sm border-2 border-black p-4 sm:p-5 md:p-6 rounded-xl md:rounded-2xl shadow-xl md:shadow-2xl transition-all duration-500 group-hover:border-gray-800">
            <div className="relative w-full aspect-square">
              <Image
                src={currentTshirtData.src}
                alt={currentTshirtData.label}
                width={1080}
                height={1080}
                className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                priority
              />
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[30%] sm:w-[32%] group-hover:scale-110 transition-transform duration-500">
                <Image
                  src={currentDesignData.src}
                  alt={`Design ${currentDesignData.id}`}
                  width={300}
                  height={300}
                  className="w-full h-full object-contain drop-shadow-lg"
                  priority
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 md:gap-5 text-center">
          <button
            onClick={handleShuffle}
            className="bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 px-6 md:px-8 rounded-full text-base md:text-lg transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg whitespace-nowrap w-full sm:w-auto"
          >
            Try Another Combo
          </button>

          <button
            onClick={handleAddToCart}
            className="bg-gray-900 hover:bg-gray-800 text-white font-bold py-3 md:py-4 px-6 md:px-10 rounded-full text-base md:text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl whitespace-nowrap w-full sm:w-auto"
          >
            Add This Combo — ₹{currentTshirtData.price + currentDesignData.price}
          </button>
        </div>
      </div>
    </div>
  );
}