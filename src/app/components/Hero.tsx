'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import JustPreview from './JustPreview';

interface TShirt {
  img?: string;
  name: string;
  features?: string[];
  isVideo?: boolean;
}

const tshirts: TShirt[] = [
  {
    name: 'VideoSlide',
    isVideo: true,
  },
  {
    img: '/mockups/tshirt_1.jpg',
    name: 'Maroon',
    features: ['Classic','Breathable fabric'],
  },
    {
    img: '/mockups/tshirt_2.jpg',
    name: 'Army Green',
    features: ['Aesthetic','Comfortable fit'],
  },
  {
    img: '/mockups/tshirt_3.jpg',
    name: 'Black',
    features: ['Fade-resistant', 'Smooth finish'],
  },
  {
    img: '/mockups/tshirt_4.jpg',
    name: 'Lavender',
    features: ['Soft pastel hue', 'Wrinkle-resistant'],
  },
];

export default function TShirtShowcaseWithTwoVideos() {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState([false, false]);
  const [showPreview, setShowPreview] = useState([true, true]);
  const [mutedDemo4, setMutedDemo4] = useState(true);

  const videoRefs = [useRef<HTMLVideoElement>(null), useRef<HTMLVideoElement>(null)];
  const demo3VideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const currentSlide = tshirts[index];

    if (currentSlide.isVideo && demo3VideoRef.current) {
      const videoEl = demo3VideoRef.current;

      const handleVideoEnd = () => {
        setIndex((prev) => (prev + 1) % tshirts.length);
      };

      videoEl.currentTime = 0;
      videoEl.muted = mutedDemo4;
      videoEl.play().catch((err) => {
        console.error("Video failed to play", err);
      });

      videoEl.addEventListener('ended', handleVideoEnd);

      return () => {
        videoEl.removeEventListener('ended', handleVideoEnd);
      };
    } else {
      const timer = setTimeout(() => {
        setIndex((prev) => (prev + 1) % tshirts.length);
      }, 6000);

      return () => clearTimeout(timer);
    }
  }, [index, mutedDemo4]);

  const toggleVideo = (videoIndex: number) => {
    const ref = videoRefs[videoIndex].current;
    if (!ref) return;

    if (playing[videoIndex]) {
      ref.pause();
      updateState(videoIndex, false, true);
    } else {
      ref.play();
      updateState(videoIndex, true, false);
    }
  };

  const handleVideoEnd = (videoIndex: number) => {
    updateState(videoIndex, false, true);
  };

  const updateState = (videoIndex: number, isPlaying: boolean, showThumb: boolean) => {
    setPlaying((prev) => {
      const updated = [...prev];
      updated[videoIndex] = isPlaying;
      return updated;
    });
    setShowPreview((prev) => {
      const updated = [...prev];
      updated[videoIndex] = showThumb;
      return updated;
    });
  };

  return (
    <div className="min-h-screen mt-15 bg-gradient-to-br from-[#0f0f0f] via-black to-[#0f0f0f] text-white flex flex-col items-center justify-center p-6">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-5xl md:text-6xl font-extrabold mb-12 tracking-tight text-center bg-gradient-to-r from-white via-gray-300 to-white bg-clip-text text-transparent"
      >
        Comfortable - Durable - Easy to Use 
      </motion.h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start w-full max-w-7xl">
        {/* Video 1 */}
        {[0, 1].map((i) =>
          i === 0 ? (
            <div
              key={i}
              className="relative w-full max-w-sm mx-auto aspect-[3/4] rounded-2xl overflow-hidden border border-white/10 bg-white/5 shadow-xl backdrop-blur"
            >
              <video
                ref={videoRefs[i]}
                preload="metadata"
                className="w-full h-full object-cover"
                muted
                playsInline
                onEnded={() => handleVideoEnd(i)}
              >
                <source src={`/demo/demo${i + 1}.mp4`} type="video/mp4" />
                <source src={`/demo/demo${i + 1}.webm`} type="video/webm" />
              </video>

              {showPreview[i] && (
                <img
                  src={`/demo/thumbnail/demo${i + 1}.jpg`}
                  alt={`Preview ${i + 1}`}
                  className="absolute inset-0 w-full h-full object-cover z-10"
                />
              )}

              <button
                onClick={() => toggleVideo(i)}
                className="absolute top-4 left-4 bg-white/10 hover:bg-white/20 border border-white/30 rounded-lg w-12 h-12 flex items-center justify-center transition-all backdrop-blur z-20"
              >
                {playing[i] ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="white">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="white">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  </svg>
                )}
              </button>
            </div>
          ) : null
        )}

        {/* Center Container (demo4 or tshirts) */}
        <div className="w-full max-w-sm mx-auto aspect-[3/4]">
          {tshirts[index].isVideo ? (
            <div className="relative h-full rounded-2xl overflow-hidden border border-white/10 bg-white/5 shadow-xl backdrop-blur">
              <video
                ref={demo3VideoRef}
                className="w-full h-full object-cover rounded-xl"
                playsInline
                autoPlay
                loop={false}
                muted={mutedDemo4}
              >
                <source src="/demo/demo4.mp4" type="video/mp4" />
                <source src="/demo/demo4.webm" type="video/webm" />
              </video>

              {/* Mute toggle for demo4 */}
              <button
                onClick={() => setMutedDemo4((prev) => !prev)}
                className="absolute bottom-4 right-4 z-20 bg-white/10 hover:bg-white/20 border border-white/30 rounded-full w-10 h-10 flex items-center justify-center transition-all backdrop-blur"
              >
                {mutedDemo4 ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="white">
                    <path d="M9 9v6h4l5 5V4l-5 5H9z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="white">
                    <path d="M9 9v6h4l5 5V4l-5 5H9z" />
                    <line x1="3" y1="3" x2="21" y2="21" stroke="white" strokeWidth={2} />
                  </svg>
                )}
              </button>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={tshirts[index].name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.5 }}
                className="bg-white/5 border border-white/10 rounded-2xl shadow-xl p-6 h-full text-center backdrop-blur-sm flex flex-col justify-between overflow-hidden"
              >
                <div className="overflow-hidden">
                  <img
                    src={tshirts[index].img}
                    alt={tshirts[index].name}
                    className="w-full rounded-xl mb-6 object-cover shadow-lg"
                  />
                  <h4 className="text-2xl font-semibold mb-4 tracking-wide">{tshirts[index].name}</h4>
                  <div className="flex flex-wrap justify-center gap-2 break-words max-w-full">
                    {tshirts[index].features?.map((feature, i) => (
                      <span
                        key={i}
                        className="bg-white/10 px-4 py-1 rounded-full text-sm tracking-wide hover:bg-white/20 transition max-w-full"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          )}
        </div>

        {/* Video 2 */}
        {[0, 1].map((i) =>
          i === 1 ? (
            <div
              key={i}
              className="relative w-full max-w-sm mx-auto aspect-[3/4] rounded-2xl overflow-hidden border border-white/10 bg-white/5 shadow-xl backdrop-blur"
            >
              <video
                ref={videoRefs[i]}
                preload="metadata"
                className="w-full h-full object-cover"
                muted
                playsInline
                onEnded={() => handleVideoEnd(i)}
              >
                <source src={`/demo/demo${i + 1}.mp4`} type="video/mp4" />
                <source src={`/demo/demo${i + 1}.webm`} type="video/webm" />
              </video>

              {showPreview[i] && (
                <img
                  src={`/demo/thumbnail/demo${i + 1}.jpg`}
                  alt={`Preview ${i + 1}`}
                  className="absolute inset-0 w-full h-full object-cover z-10"
                />
              )}

              <button
                onClick={() => toggleVideo(i)}
                className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 border border-white/30 rounded-lg w-12 h-12 flex items-center justify-center transition-all backdrop-blur z-20"
              >
                {playing[i] ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="white">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="white">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  </svg>
                )}
              </button>
            </div>
          ) : null
        )}
      </div>
    </div>

    
  );
}
