'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface Product {
  id: string;
  name: string;
  image: string;
  type: 'tshirt' | 'design';
  features?: string[];
}

// Mock data - you'll want to move this to constants.ts later
const tshirts: Product[] = [
  {
    id: '1',
    name: 'Maroon',
    image: '/mockups/tshirt_1.jpg',
    type: 'tshirt',
    features: ['Classic', 'Breathable fabric'],
  },
  {
    id: '2', 
    name: 'Army Green',
    image: '/mockups/tshirt_2.jpg',
    type: 'tshirt',
    features: ['Aesthetic', 'Comfortable fit'],
  },
  {
    id: '3',
    name: 'Black',
    image: '/mockups/tshirt_3.jpg',
    type: 'tshirt',
    features: ['Fade-resistant', 'Smooth finish'],
  },
];

const designs: Product[] = [
  {
    id: 'd1',
    name: 'Mountain',
    image: '/designs/design1.png', // You'll need to add these images
    type: 'design',
  },
  {
    id: 'd2',
    name: 'Geometric',
    image: '/designs/design2.png',
    type: 'design',
  },
  {
    id: 'd3',
    name: 'Minimal',
    image: '/designs/design3.png', 
    type: 'design',
  },
];

export default function CustomizerStudio() {
  const [selectedTshirt, setSelectedTshirt] = useState<Product>(tshirts[0]);
  const [selectedDesign, setSelectedDesign] = useState<Product>(designs[0]);
  const [showTutorial, setShowTutorial] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f0f] via-black to-[#0f0f0f] text-white flex flex-col items-center justify-center p-4 pt-20">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight bg-gradient-to-r from-white via-gray-300 to-white bg-clip-text text-transparent">
          Create Your Unique Style
        </h1>
        <p className="text-gray-400 text-lg">Mix and match to express yourself</p>
      </motion.div>

      {/* Main Customizer Grid */}
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* T-shirt Selector - Left Side */}
        <div className="lg:col-span-1">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-xl font-semibold">1. Choose Your Base</h2>
            {showTutorial && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-sm bg-white/10 px-3 py-1 rounded-full"
              >
                Start here
              </motion.div>
            )}
          </div>
          
          <div className="flex lg:flex-col gap-4 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0">
            {tshirts.map((tshirt) => (
              <motion.button
                key={tshirt.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setSelectedTshirt(tshirt);
                  setShowTutorial(false);
                }}
                className={`flex-shrink-0 w-24 h-24 lg:w-full lg:h-auto aspect-square rounded-xl border-2 overflow-hidden ${
                  selectedTshirt.id === tshirt.id 
                    ? 'border-white bg-white/20' 
                    : 'border-white/20 bg-white/5 hover:bg-white/10'
                } transition-all`}
              >
                <img
                  src={tshirt.image}
                  alt={tshirt.name}
                  className="w-full h-full object-cover"
                />
              </motion.button>
            ))}
          </div>
        </div>

        {/* Main Preview - Center */}
        <div className="lg:col-span-1 flex flex-col items-center">
          <div className="relative w-full max-w-md aspect-square bg-white/5 rounded-2xl border border-white/10 p-8 mb-6">
            {/* Combined Preview */}
            <div className="relative w-full h-full flex items-center justify-center">
              <img
                src={selectedTshirt.image}
                alt="Base T-shirt"
                className="absolute inset-0 w-full h-full object-contain"
              />
              <motion.img
                key={selectedDesign.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                src={selectedDesign.image}
                alt="Selected design"
                className="absolute w-1/2 h-1/2 object-contain"
                style={{ top: '25%', left: '25%' }}
              />
            </div>

            {showTutorial && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20"
              >
                ✨ Your creation appears here
              </motion.div>
            )}
          </div>

          {/* Add to Cart */}
          <button className="bg-white text-black px-8 py-3 rounded-full font-semibold hover:bg-gray-200 transition-colors">
            Add to Cart - $49
          </button>
        </div>

        {/* Design Selector - Right Side */}
        <div className="lg:col-span-1">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-xl font-semibold">2. Choose Your Design</h2>
            {showTutorial && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-sm bg-white/10 px-3 py-1 rounded-full"
              >
                Then pick a vibe
              </motion.div>
            )}
          </div>
          
          <div className="flex lg:flex-col gap-4 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0">
            {designs.map((design) => (
              <motion.button
                key={design.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setSelectedDesign(design);
                  setShowTutorial(false);
                }}
                className={`flex-shrink-0 w-24 h-24 lg:w-full lg:h-auto aspect-square rounded-xl border-2 overflow-hidden ${
                  selectedDesign.id === design.id 
                    ? 'border-white bg-white/20' 
                    : 'border-white/20 bg-white/5 hover:bg-white/10'
                } transition-all`}
              >
                <img
                  src={design.image}
                  alt={design.name}
                  className="w-full h-full object-cover bg-white/10"
                />
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}