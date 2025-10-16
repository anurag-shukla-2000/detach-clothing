'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute, FaExpand } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { AnimatePresence } from 'framer-motion';

const quotes = [
  "Don't ever, for any reason, do anything to anyone for any reason ever... – Michael Scott",
  "Wubba Lubba Dub Dub! – Rick Sanchez",
  "What, so everyone's supposed to sleep every single night now? You realize that nighttime makes up half of all time? – Rick Sanchez",
  "You are all the things that are wrong with you. – Bojack Horseman",
  "It gets easier. Every day it gets a little easier. But you gotta do it every day — that's the hard part. – Jogging Baboon",
  "Whenever I get sad, I stop being sad and be awesome instead. True story. – Barney Stinson",
  "Because sometimes even if you know how something's gonna end, that doesn't mean you can't enjoy the ride. – Ted Mosby",
  "We were on a break! – Ross Geller",
  "I'm not great at the advice. Can I interest you in a sarcastic comment? – Chandler Bing",
  "Welcome to the real world. It sucks. You're gonna love it. – Monica Geller"
];

const AboutPage = () => {
  const [hasWindow, setHasWindow] = useState(false);
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  
  // Video states
  const [heroVideoState, setHeroVideoState] = useState({
    isPlaying: false,
    isMuted: true,
    showThumbnail: true
  });

  const [prototypeVideoState, setPrototypeVideoState] = useState({
    isPlaying: false,
    isMuted: true,
    showThumbnail: true
  });

  const [demoVideoState, setDemoVideoState] = useState({
    isPlaying: false,
    isMuted: true,
    showThumbnail: true
  });

  // Video refs
  const heroVideoRef = useRef<HTMLVideoElement>(null);
  const prototypeVideoRef = useRef<HTMLVideoElement>(null);
  const demoVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setHasWindow(true);
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuoteIndex((prevIndex) => (prevIndex + 1) % quotes.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // Video cropping settings
  const videoCropSettings = {
    hero: {
      outputWidth: 1080,
      outputHeight: 1080,
      originalWidth: 1080,
      originalHeight: 1080
    },
    prototype: {
      showTopHalf: true,
      originalWidth: 487,
      originalHeight: 723,
      outputWidth: 487,
      outputHeight: 450
    },
    demo: {
      showTopHalf: false,
      originalWidth: 787,
      originalHeight: 1024,
      outputWidth: 787,
      outputHeight: 1024
    }
  };

  // Calculate crop styles
  const getCropStyle = (settings: any) => {
    if (settings.showTopHalf) {
      const scale = settings.originalWidth / settings.outputWidth;
      return {
        width: '100%',
        height: '200%',
        objectFit: 'cover',
        objectPosition: 'center top',
        transform: `scale(${scale})`
      };
    }
    
    const widthRatio = settings.originalWidth / settings.outputWidth;
    const heightRatio = settings.originalHeight / settings.outputHeight;
    const scale = Math.max(widthRatio, heightRatio);
    
    return {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      objectPosition: 'center center',
      transform: `scale(${scale})`
    };
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
      },
    },
  };

  return (
    <div className="bg-white text-gray-900 min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section 
        className="relative flex items-center justify-center overflow-hidden"
        style={{ 
          height: 'calc(100vh - 4rem)',
          marginTop: '4rem'
        }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/30 z-10" />
        
        {/* Background Video */}
        <div className="absolute inset-0 overflow-hidden">
          {hasWindow ? (
            <div className="w-full h-full relative group">
              {/* Video Thumbnail */}
              {heroVideoState.showThumbnail && (
                <div className="absolute inset-0 z-10">
                  <Image
                    src="/about/wall_painting_thumbnail.webp"
                    alt="Wall painting video thumbnail"
                    fill
                    className="object-cover brightness-90"
                    quality={100}
                  />
                </div>
              )}
              
              {/* Video Element */}
              <video 
                ref={heroVideoRef}
                onClick={() => {
                  if (heroVideoRef.current) {
                    if (heroVideoState.isPlaying) {
                      heroVideoRef.current.pause();
                      setHeroVideoState(prev => ({...prev, isPlaying: false}));
                    } else {
                      heroVideoRef.current.play();
                      setHeroVideoState(prev => ({...prev, isPlaying: true, showThumbnail: false}));
                    }
                  }
                }}
                autoPlay
                loop
                muted={heroVideoState.isMuted}
                playsInline
                style={getCropStyle(videoCropSettings.hero) as React.CSSProperties}
                className="w-full h-full"
              >
                <source src="/about/wall_painting.webm" type="video/webm" />
              </video>
              
              {/* Minimal Controls */}
              <div className={`absolute bottom-6 right-6 z-20 flex items-center gap-3 transition-opacity duration-300 ${heroVideoState.isPlaying ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'}`}>
                <button 
                  onClick={() => {
                    if (heroVideoRef.current) {
                      if (heroVideoState.isPlaying) {
                        heroVideoRef.current.pause();
                        setHeroVideoState(prev => ({...prev, isPlaying: false}));
                      } else {
                        heroVideoRef.current.play();
                        setHeroVideoState(prev => ({...prev, isPlaying: true, showThumbnail: false}));
                      }
                    }
                  }}
                  className="bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition-all"
                  aria-label={heroVideoState.isPlaying ? "Pause" : "Play"}
                >
                  {heroVideoState.isPlaying ? <FaPause size={16} /> : <FaPlay size={16} />}
                </button>
                <button 
                  onClick={() => {
                    if (heroVideoRef.current) {
                      heroVideoRef.current.muted = !heroVideoState.isMuted;
                      setHeroVideoState(prev => ({...prev, isMuted: !prev.isMuted}));
                    }
                  }}
                  className="bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition-all"
                  aria-label={heroVideoState.isMuted ? "Unmute" : "Mute"}
                >
                  {heroVideoState.isMuted ? <FaVolumeMute size={16} /> : <FaVolumeUp size={16} />}
                </button>
              </div>
            </div>
          ) : (
            <Image
              src="/about/wall_painting_thumbnail.webp"
              alt="Wall painting"
              fill
              className="object-cover"
            />
          )}
        </div>
        
        {/* Content */}
        <div className="relative z-20 px-6 text-center max-w-4xl">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl font-bold mb-6 text-white"
          >
            The Story of Detach
          </motion.h1>
          <AnimatePresence mode="wait">
            <motion.p
              key={currentQuoteIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.6 }}
              className="text-xl md:text-2xl text-white/90 mb-8"
            >
              {quotes[currentQuoteIndex]}
            </motion.p>
          </AnimatePresence>
        </div>
      </section>

      {/* Story Sections */}
      <motion.div 
        className="py-20 px-4 sm:px-6 max-w-6xl mx-auto"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
      >
        {/* 2018 Origin Story */}
        <motion.section 
          className="mb-20 md:mb-32 flex flex-col md:flex-row gap-8 md:gap-12 items-center"
          variants={itemVariants}
        >
          <div className="md:w-1/2">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">Three Black T-shirt and a Jackass</h2>
            <p className="text-base md:text-lg">
              Back in 2018, I was 18 and obsessed with The Office. So obsessed that for my birthday, I got not one, not two, but three black t-shirts, 
              all from the same show. The only difference? Each one had a different quote. As much as I love The Office, I remember thinking... man, it would've been cool if one of them was a Rick & Morty tee, or even something from Fleabag. I love so many things — shows, movies, characters — and I like expressing that through what I wear. But instead, I had three almost identical black t-shirts, and within six months, all of them were worn out. The fabric gave up, the prints faded, and just like that — they were unwearable. That's when the idea struck: what if I didn't need three separate t-shirts for three different designs? What if I could have one shirt, and change the art whenever I wanted?
            </p>
          </div>
          <div className="md:w-1/2 relative aspect-square w-full">
            <div className="absolute inset-0 border-4 border-gray-200 rounded-xl shadow-2xl overflow-hidden">
              <Image
                src="/about/about1.webp"
                alt="First prototype - blue t-shirt with Rick & Morty design"
                fill
                className="object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-gray-200 flex items-center justify-center hidden">
                <p className="text-gray-500">First prototype image not available</p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Prototype Journey Section */}
        <motion.section 
          className="mb-20 md:mb-32 flex flex-col md:flex-row-reverse gap-8 md:gap-12 items-center"
          variants={itemVariants}
        >
          <div className="md:w-1/2">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">The First Prototype</h2>
            <p className="text-base md:text-lg">
              Still knee-deep in college and broke as hell, I started experimenting. I painted some Rick & Morty fanart on a piece of cloth, cut it out, and thought — how do I attach this to a shirt? First, I tried sewing buttons onto both the patch and the t-shirt. It kind of worked, but it felt clunky and looked odd. Then my dad stepped in — we stitched Velcro on both the shirt and the patch. And just like that, the first prototype was born: a black t-shirt with a detachable design, homemade with a handkerchief and stitched Velcro. The patch stayed, the design popped, and I couldn't stop thinking about where this could go.
            </p>
          </div>
          <div className="md:w-1/2 relative w-full" 
               style={{
                 aspectRatio: `${videoCropSettings.prototype.originalWidth}/${videoCropSettings.prototype.outputHeight}`
               }}>
            {hasWindow ? (
              <div className="w-full h-full overflow-hidden rounded-xl shadow-2xl relative group">
                {/* Video Thumbnail */}
                {prototypeVideoState.showThumbnail && (
                  <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/20">
                    <Image
                      src="/about/about_thumbnail.webp"
                      alt="Video thumbnail"
                      fill
                      className="object-cover opacity-90"
                    />
                    <button 
                      onClick={() => {
                        if (prototypeVideoRef.current) {
                          prototypeVideoRef.current.play();
                          setPrototypeVideoState(prev => ({
                            ...prev,
                            isPlaying: true,
                            showThumbnail: false
                          }));
                        }
                      }}
                      className="absolute z-20 bg-black/70 rounded-full p-4 hover:bg-black/90 transition-all"
                    >
                      <FaPlay className="text-white text-2xl" />
                    </button>
                  </div>
                )}
                
                {/* Video Element */}
                <video 
                  ref={prototypeVideoRef}
                  onClick={() => {
                    if (prototypeVideoRef.current) {
                      if (prototypeVideoState.isPlaying) {
                        prototypeVideoRef.current.pause();
                        setPrototypeVideoState(prev => ({...prev, isPlaying: false}));
                      } else {
                        prototypeVideoRef.current.play();
                        setPrototypeVideoState(prev => ({
                          ...prev,
                          isPlaying: true,
                          showThumbnail: false
                        }));
                      }
                    }
                  }}
                  onEnded={() => {
                    setPrototypeVideoState(prev => ({
                      ...prev,
                      isPlaying: false,
                      showThumbnail: true
                    }));
                    if (prototypeVideoRef.current) {
                      prototypeVideoRef.current.currentTime = 0;
                    }
                  }}
                  className="w-full h-full"
                  style={getCropStyle(videoCropSettings.prototype) as React.CSSProperties}
                >
                  <source src="/about/about2.webm" type="video/webm" />
                </video>
                
                {/* Video Controls */}
                <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 flex items-center justify-between transition-opacity duration-300 ${prototypeVideoState.isPlaying ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'}`}>
                  <div className="flex items-center space-x-4">
                    <button 
                      onClick={() => {
                        if (prototypeVideoRef.current) {
                          if (prototypeVideoState.isPlaying) {
                            prototypeVideoRef.current.pause();
                            setPrototypeVideoState(prev => ({...prev, isPlaying: false}));
                          } else {
                            prototypeVideoRef.current.play();
                            setPrototypeVideoState(prev => ({
                              ...prev,
                              isPlaying: true,
                              showThumbnail: false
                            }));
                          }
                        }
                      }}
                      className="text-white hover:text-gray-300 transition-colors"
                    >
                      {prototypeVideoState.isPlaying ? <FaPause size={18} /> : <FaPlay size={18} />}
                    </button>
                    <button 
                      onClick={() => {
                        if (prototypeVideoRef.current) {
                          prototypeVideoRef.current.muted = !prototypeVideoState.isMuted;
                          setPrototypeVideoState(prev => ({...prev, isMuted: !prev.isMuted}));
                        }
                      }}
                      className="text-white hover:text-gray-300 transition-colors"
                    >
                      {prototypeVideoState.isMuted ? <FaVolumeMute size={18} /> : <FaVolumeUp size={18} />}
                    </button>
                  </div>
                  <button 
                    onClick={() => {
                      if (prototypeVideoRef.current) {
                        if (document.fullscreenElement) {
                          document.exitFullscreen();
                        } else {
                          prototypeVideoRef.current.requestFullscreen();
                        }
                      }
                    }}
                    className="text-white hover:text-gray-300 transition-colors"
                  >
                    <FaExpand size={16} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="w-full h-full bg-gray-200 rounded-xl shadow-2xl flex items-center justify-center">
                <p className="text-gray-500">Prototype video not available</p>
              </div>
            )}
          </div>
        </motion.section>

        {/* Current Development */}
        <motion.section 
          className="mb-20 md:mb-32 flex flex-col md:flex-row gap-8 md:gap-12 items-center"
          variants={itemVariants}
        >
          <div className="md:w-1/2">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">Perfecting the Vision</h2>
            <p className="text-base md:text-lg">
              Fast forward to now—I've been laser-focused since, making this real. This wasn't just about throwing a patch on a shirt—it was about creating a system that's durable, premium, and scalable. Here's what I worked on: Custom-manufactured Velcro, soft enough to be worn daily, strong enough to stick. Stitching techniques that keep the design securely fastened and easy to replace. Found breathable, long-lasting fabric that holds shape, resists wrinkles, and feels amazing. Tested dozens of printing techniques to make sure colors pop, don't crack, and can handle repeated attachment/detachment. Every decision was based on one question: How can I make this better than a regular designer t-shirt?
            </p>
          </div>
          <div className="md:w-1/2 relative w-full" 
               style={{
                 aspectRatio: '787/1024'
               }}>
            {hasWindow ? (
              <div className="w-full h-full overflow-hidden rounded-xl shadow-2xl relative group">
                {/* Thumbnail */}
                {demoVideoState.showThumbnail && (
                  <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/20">
                    <Image
                      src="/about/demo1.webp"
                      alt=""
                      fill
                      className="object-contain"
                    />
                    <button 
                      onClick={() => {
                        if (demoVideoRef.current) {
                          demoVideoRef.current.play();
                          setDemoVideoState(prev => ({
                            ...prev,
                            isPlaying: true,
                            showThumbnail: false
                          }));
                        }
                      }}
                      className="absolute z-20 bg-black/70 rounded-full p-4 hover:bg-black/90 transition-all"
                    >
                      <FaPlay className="text-white text-2xl" />
                    </button>
                  </div>
                )}

                {/* Video */}
                <video 
                  ref={demoVideoRef}
                  onClick={() => {
                    if (demoVideoRef.current) {
                      if (demoVideoState.isPlaying) {
                        demoVideoRef.current.pause();
                        setDemoVideoState(prev => ({...prev, isPlaying: false}));
                      } else {
                        demoVideoRef.current.play();
                        setDemoVideoState(prev => ({
                          ...prev,
                          isPlaying: true,
                          showThumbnail: false
                        }));
                      }
                    }
                  }}
                  onEnded={() => {
                    setDemoVideoState(prev => ({
                      ...prev,
                      isPlaying: false,
                      showThumbnail: true
                    }));
                    if (demoVideoRef.current) demoVideoRef.current.currentTime = 0;
                  }}
                  className="w-full h-full object-contain"
                >
                  <source src="/about/demo4.webm" type="video/webm" />
                </video>
                
                {/* Video Controls */}
                <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 flex items-center justify-between transition-opacity duration-300 ${demoVideoState.isPlaying ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'}`}>
                  <div className="flex items-center space-x-4">
                    <button 
                      onClick={() => {
                        if (demoVideoRef.current) {
                          if (demoVideoState.isPlaying) {
                            demoVideoRef.current.pause();
                            setDemoVideoState(prev => ({...prev, isPlaying: false}));
                          } else {
                            demoVideoRef.current.play();
                            setDemoVideoState(prev => ({
                              ...prev,
                              isPlaying: true,
                              showThumbnail: false
                            }));
                          }
                        }
                      }}
                      className="text-white hover:text-gray-300 transition-colors"
                    >
                      {demoVideoState.isPlaying ? <FaPause size={18} /> : <FaPlay size={18} />}
                    </button>
                    <button 
                      onClick={() => {
                        if (demoVideoRef.current) {
                          demoVideoRef.current.muted = !demoVideoState.isMuted;
                          setDemoVideoState(prev => ({...prev, isMuted: !prev.isMuted}));
                        }
                      }}
                      className="text-white hover:text-gray-300 transition-colors"
                    >
                      {demoVideoState.isMuted ? <FaVolumeMute size={18} /> : <FaVolumeUp size={18} />}
                    </button>
                  </div>
                  <button 
                    onClick={() => {
                      if (demoVideoRef.current) {
                        if (document.fullscreenElement) {
                          document.exitFullscreen();
                        } else {
                          demoVideoRef.current.requestFullscreen();
                        }
                      }
                    }}
                    className="text-white hover:text-gray-300 transition-colors"
                  >
                    <FaExpand size={16} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="w-full h-full bg-gray-200 rounded-xl flex items-center justify-center">
                <p className="text-gray-500">Video not available</p>
              </div>
            )}
          </div>
        </motion.section>

        {/* Product Gallery */}
<motion.section 
  className="mb-20 md:mb-32 flex flex-col md:flex-row gap-8 md:gap-12 items-center"
  variants={itemVariants}
>
  <div className="w-full md:w-1/2">
    <div className="grid grid-cols-2 gap-3 sm:gap-4">
      <div className="relative aspect-square bg-gray-100 rounded-lg shadow-md">
        <Image
          src="/about/hoodie-prototype.webp"
          alt="Hoodie prototype"
          fill
          className="object-cover rounded-lg"
          sizes="(max-width: 768px) 50vw, 25vw"
        />
      </div>
      <div className="relative aspect-square bg-gray-100 rounded-lg shadow-md">
        <Image
          src="/about/jacket-prototype.webp"
          alt="Jacket prototype"
          fill
          className="object-cover rounded-lg"
          sizes="(max-width: 768px) 50vw, 25vw"
        />
      </div>
      <div className="relative aspect-square bg-gray-100 rounded-lg shadow-md">
        <Image
          src="/about/bag-prototype.webp"
          alt="Bag prototype"
          fill
          className="object-cover rounded-lg"
          sizes="(max-width: 768px) 50vw, 25vw"
        />
      </div>
      <div className="relative aspect-square bg-gray-100 rounded-lg shadow-md">
        <Image
          src="/about/phonecover-prototype.webp"
          alt="Phone cover prototype"
          fill
          className="object-cover rounded-lg"
          sizes="(max-width: 768px) 50vw, 25vw"
        />
      </div>
    </div>
  </div>
          <div className="md:w-1/2">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">A New Way to Wear</h2>
            <p className="text-base md:text-lg">
              You buy one high-quality black t-shirt and get a collection of detachable designs you can swap out anytime. But that's just the beginning. With Detach, we're building a system that puts creative control in your hands. You'll be able to upload your own artwork or inside jokes and choose whether to get it printed as a Velcro-backed patch or directly on the shirt in a traditional, seamless style. Different designs deserve different treatments, so you'll also be able to select the printing method that suits your vibe — from DTG (Direct to Garment) for rich, colorful artwork, to DTF (Direct to Film) for smooth, vibrant durability, screen printing for bold classics, sublimation for all-over patterns, and even embroidery for a textured, premium look. You'll also have the power to choose your fabric: from soft 100% cotton, organic cotton, and long-lasting blends to structured heavyweight cloth for statement pieces. You decide not only the design but also its size and placement — left chest, center, sleeve, lower side — whatever fits your mood. And it doesn't stop at t-shirts. This modular system will soon expand to hoodies, jackets, bags, wallets, phone covers, and even laptop sleeves. Your entire wardrobe becomes modular, customizable, and an evolving expression of who you are. Whether you're an artist, a fan, or someone who just loves mixing things up, Detach is designed to give you freedom, individuality, and the tools to wear what you feel.
            </p>
          </div>
        </motion.section>

        {/* Future Vision */}
        <motion.section 
          className="mb-20 md:mb-32 text-center px-4"
          variants={itemVariants}
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Extremely Talented Highly Undervalued</h2>
          <p className="text-base md:text-lg mb-8 max-w-3xl mx-auto">
            Every design added to our platform stays in the artist's control. 
            You choose how your art appears — as a patch, a print, or a limited drop. 
            And every time someone connects with your work and makes a purchase, you earn fair royalties. 
            No hidden terms. No fine print. Just a simple system that rewards creativity and helps you keep doing what you love. 
            Whether you're a professional illustrator, a meme wizard, or someone who doodles for the fun of it — Detach is built to give your ideas a home (and a paycheck).
          </p>
          <div className="flex flex-wrap justify-center gap-4 md:gap-6 mt-8">
            <Link 
              href="/upload" 
              className="px-6 py-2 md:px-8 md:py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-colors duration-300 text-sm md:text-base"
            >
              Upload Your Design
            </Link>
            <Link 
              href="/upload" 
              className="px-6 py-2 md:px-8 md:py-3 border-2 border-black text-black rounded-full hover:bg-gray-100 transition-colors duration-300 text-sm md:text-base"
            >
              Become an Artist
            </Link>
          </div>
        </motion.section>
      </motion.div>

      <Footer />
    </div>
  );
};

export default AboutPage;