'use client';

import Image from 'next/image';

// Create 15 image items
const artworks = Array.from({ length: 15 }, (_, i) => ({
  id: i + 1,
  img: `/designs/image_${i + 1}.webp`,
}));

// Duplicate images for seamless loop
const extendedArtworks = [...artworks, ...artworks];

export default function ArtworkSlide() {
  return (
    <div className="relative w-full bg-black py-[30px] overflow-hidden"> 
      {/* Centered Heading */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-white text-center pointer-events-none">
        <h2 className="text-3xl md:text-5xl font-bold">
          One T-shirt. Infinite Designs.
        </h2>
        <p className="mt-3 text-sm md:text-lg text-gray-300">
          Expand your wardrobe exponentially
        </p>
      </div>

      {/* Scrolling container */}
      <div className="relative flex w-max animate-marquee space-x-0">
        {extendedArtworks.map((art, index) => (
          <div
            key={index}
            className="relative w-[220px] h-[300px] flex-shrink-0"
          >
            <Image
              src={art.img}
              alt={`Artwork ${art.id}`}
              fill
              className="object-cover rounded-xl opacity-40"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
