'use client';
import { useCart } from '../context/CartContext';
import Image from 'next/image';
import { useEffect, useState } from 'react';

const artworkNames = [
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

const DesignGrid = () => {
  const { addToCart } = useCart();
  const [selectedDesigns, setSelectedDesigns] = useState<number[]>([]);
  const [designs, setDesigns] = useState<Array<{src: string, id: number, price: number}>>([]);

  useEffect(() => {
    const loadDesigns = async () => {
      const initialDesigns = Array.from({ length: 25 }, (_, i) => ({
        src: `/designs/image_${i + 1}.webp`,
        id: i + 1,
        price: 199
      }));
      setDesigns(initialDesigns);
    };
    loadDesigns();
  }, []);

  const handleAddToCart = (design: typeof designs[0]) => {
    setSelectedDesigns(prev =>
      prev.includes(design.id)
        ? prev.filter(id => id !== design.id)
        : [...prev, design.id]
    );
    
    addToCart({
      type: 'design',
      item: design,
      price: design.price
    });
  };

  return (
    <section id="designs" className="mt-16 px-4 md:px-16 text-center">
      <div className="space-y-6 mb-10">
        <div className="w-275 h-[2px] bg-white grid justify-center mt-[5px]" />
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">Infinite Styles.</h1>
        <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto">
      Trial Room will appear when you add something to cart
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {designs.map((design) => (
          <div
            key={design.id}
            className="relative overflow-hidden rounded-2xl group shadow-md hover:shadow-lg transition-all duration-300"
          >
            <Image
              src={design.src}
              alt={`Design ${design.id}`}
              width={300}
              height={300}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            
            <div className="absolute inset-0 flex items-end sm:items-center justify-center bg-black/50 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300 px-2 pb-2 sm:pb-0">
              <button
                onClick={() => handleAddToCart(design)}
                className={`bg-white text-black px-4 py-2 rounded-full font-medium w-full sm:w-auto transition-all duration-300
                  ${selectedDesigns.includes(design.id) ? "!bg-blue-500 !text-white" : "hover:bg-gray-100"}
                  translate-y-0 sm:translate-y-0 sm:group-hover:translate-y-[110px]
                `}
              >
                {selectedDesigns.includes(design.id) ? "Added to Cart ✔" : `Add to Cart - ₹${design.price}`}
              </button>
            </div>

            <span className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
              #{design.id} {artworkNames[design.id - 1]}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default DesignGrid;
