'use client';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import DesignPreview from './components/DesignPreview';
import DesignGrid from './components/DesignGrid';
import Footer from './components/Footer';
import ArtworkSlide from './components/ArtworkSlide';
import JustPreview from './components/JustPreview';

export default function Home() {
  return (
    <>
      <Navbar />
      <ArtworkSlide />
      <DesignPreview />
      <DesignGrid />
      <Hero />
      <JustPreview />
      <Footer />
    </>
  );
}
