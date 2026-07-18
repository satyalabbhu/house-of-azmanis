import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface SplashProps {
  onComplete: () => void;
}

export default function Splash({ onComplete }: SplashProps) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      setTimeout(onComplete, 800); // Wait for fade-out animation to finish
    }, 3200);

    return () => clearTimeout(timer);
  }, [onComplete]);

  const handleSkip = () => {
    setShow(false);
    onComplete();
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          id="splash-screen"
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#FAF7F2] p-4 select-none overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
        >
          {/* Subtle floral background pattern */}
          <div className="absolute inset-0 opacity-5 pointer-events-none arch-pattern"></div>

          {/* Skip button */}
          <button
            id="skip-splash-btn"
            onClick={handleSkip}
            className="absolute top-6 right-6 px-4 py-1.5 border border-gold-300 text-gold-700 hover:bg-gold-50 transition-all rounded-full text-xs font-sans tracking-widest uppercase cursor-pointer"
          >
            Skip Intro
          </button>

          {/* Outer elegant frame matching the brand screenshot */}
          <motion.div
            className="relative w-full max-w-[580px] h-[90vh] max-h-[700px] bg-white border border-[#F0EBE0] shadow-2xl rounded-2xl p-8 flex flex-col justify-between items-center overflow-hidden"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, ease: 'easeOut' }}
          >
            {/* Elegant Golden Arch Border Design */}
            <div className="absolute inset-4 border border-[#ECE5D8] rounded-xl pointer-events-none"></div>
            
            {/* Inner Arch Frame Layer */}
            <div className="absolute inset-5 flex flex-col items-center justify-between border-2 border-double border-gold-200 rounded-lg p-6 pointer-events-none">
              
              {/* Corner Ornaments */}
              <div className="absolute top-2 left-2 w-4 h-4 border-t border-l border-gold-400"></div>
              <div className="absolute top-2 right-2 w-4 h-4 border-t border-r border-gold-400"></div>
              <div className="absolute bottom-2 left-2 w-4 h-4 border-b border-l border-gold-400"></div>
              <div className="absolute bottom-2 right-2 w-4 h-4 border-b border-r border-gold-400"></div>

              {/* Mughal/Indian Arch SVG Silhouette Outline around the text */}
              <div className="absolute inset-4 flex items-center justify-center pointer-events-none opacity-[0.03]">
                <svg viewBox="0 0 100 100" className="w-full h-full text-gold-800">
                  <path d="M50 0 C25 15, 10 30, 10 60 L10 100 L90 100 L90 60 C90 30, 75 15, 50 0 Z" fill="currentColor"/>
                </svg>
              </div>

            </div>

            {/* Top Text spacing */}
            <div className="mt-8"></div>

            {/* Central Brand Information */}
            <div className="flex flex-col items-center justify-center text-center space-y-6 z-10 px-4">
              
              {/* Small Header */}
              <motion.span
                className="text-xs uppercase tracking-[0.25em] text-gold-600 font-sans font-medium"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                The House Of
              </motion.span>

              {/* Majestic Serif Brand Name */}
              <motion.h1
                className="text-3xl sm:text-4xl md:text-5xl font-display font-medium tracking-[0.12em] text-[#2C2115] uppercase leading-tight"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                Azmanis
              </motion.h1>

              {/* Golden Separator Mandala */}
              <motion.div
                className="py-2"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8, duration: 0.6 }}
              >
                {/* Stunning golden multi-petal flower SVG */}
                <svg viewBox="0 0 100 100" className="w-12 h-12 text-gold-500 fill-current">
                  <path d="M50,15 C45,28 35,38 35,50 C35,62 45,72 50,85 C55,72 65,62 65,50 C65,38 55,28 50,15 Z" opacity="0.9" />
                  <path d="M15,50 C28,45 38,35 38,35 C38,35 45,28 50,15 C50,15 55,28 62,35 C62,35 72,45 85,50 C72,55 62,65 62,65 C62,65 55,72 50,85 C50,85 45,72 38,65 C38,65 28,55 15,50 Z" opacity="0.7" />
                  <circle cx="50" cy="50" r="5" className="text-white fill-current" />
                </svg>
              </motion.div>

              {/* Curated Slogan */}
              <motion.p
                className="text-sm md:text-base font-serif italic text-gold-700 tracking-wide"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.1, duration: 0.8 }}
              >
                Curated for Her.
              </motion.p>
            </div>

            {/* Bottom details */}
            <div className="z-10 flex flex-col items-center space-y-4 mb-4">
              <motion.div
                className="h-[1px] w-48 bg-gradient-to-r from-transparent via-gold-300 to-transparent"
                initial={{ width: 0 }}
                animate={{ width: 192 }}
                transition={{ delay: 0.7, duration: 0.8 }}
              />
              <motion.span
                className="text-[10px] tracking-[0.3em] uppercase text-gold-600 font-sans"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.3, duration: 0.6 }}
              >
                Apparel | Accessories | Lifestyle
              </motion.span>
            </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
