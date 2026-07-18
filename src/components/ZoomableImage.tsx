import React, { useState, useRef, MouseEvent, useEffect } from 'react';
import { Search } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ZoomableImageProps {
  src: string;
  alt: string;
  referrerPolicy?: 'no-referrer' | 'origin' | 'unsafe-url';
  fallbackSrc?: string;
  className?: string;
}

export default function ZoomableImage({
  src,
  alt,
  referrerPolicy = 'no-referrer',
  fallbackSrc = 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=400',
  className = '',
}: ZoomableImageProps) {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [lensStyle, setLensStyle] = useState<React.CSSProperties | null>(null);
  const [showLens, setShowLens] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync currentSrc if src prop changes
  useEffect(() => {
    setCurrentSrc(src);
  }, [src]);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;

    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;

    // Constrain position within the container bounds
    const boundedX = Math.max(0, Math.min(width, x));
    const boundedY = Math.max(0, Math.min(height, y));

    const zoomFactor = 3.5; // High magnification for beautiful luxury fabric textures
    const lensSize = 150; // Size of the circular magnifying lens

    // Calculate lens position so the cursor is exactly in the center
    const lensLeft = boundedX - lensSize / 2;
    const lensTop = boundedY - lensSize / 2;

    // Percentage across the image for background position
    const bgX = (boundedX / width) * 100;
    const bgY = (boundedY / height) * 100;

    setLensStyle({
      left: `${lensLeft}px`,
      top: `${lensTop}px`,
      width: `${lensSize}px`,
      height: `${lensSize}px`,
      backgroundImage: `url(${currentSrc})`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: `${width * zoomFactor}px ${height * zoomFactor}px`,
      backgroundPosition: `${bgX}% ${bgY}%`,
    });
  };

  const handleMouseEnter = () => {
    setShowLens(true);
  };

  const handleMouseLeave = () => {
    setShowLens(false);
    setLensStyle(null);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden w-full h-full select-none cursor-crosshair ${className}`}
    >
      <img
        src={currentSrc}
        alt={alt}
        referrerPolicy={referrerPolicy}
        className="w-full h-full object-cover transition-transform duration-300 ease-out scale-100 group-hover:scale-[1.01]"
        onError={() => {
          setCurrentSrc(fallbackSrc);
        }}
      />

      {/* Magnifying Lens Overlay */}
      <AnimatePresence>
        {showLens && lensStyle && (
          <motion.div
            initial={{ scale: 0.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.1, opacity: 0 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            style={lensStyle}
            className="absolute rounded-full pointer-events-none border-2 border-gold-400/90 shadow-[0_15px_35px_rgba(44,33,21,0.4),_inset_0_0_15px_rgba(0,0,0,0.2)] z-30 overflow-hidden"
          >
            {/* Subtle light/shine reflection across the lens */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/30 rounded-full pointer-events-none" />
            {/* Inner luxury gold highlight border */}
            <div className="absolute inset-1 rounded-full border border-gold-200/30 pointer-events-none" />
            
            {/* Highlighting elegant center crosshair pointer */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full border border-gold-400/40 bg-white/10 pointer-events-none" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Decorative luxury fabric indicator badge */}
      <div className="absolute bottom-3 left-3 z-10 pointer-events-none transition-all duration-300 transform translate-y-0 opacity-100 group-hover:translate-y-2 group-hover:opacity-0">
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#2C2115]/80 backdrop-blur-md rounded-full border border-gold-200/20 text-white text-[8px] tracking-widest font-sans uppercase font-medium">
          <Search size={9} className="text-gold-300" />
          <span>Hover to Inspect Texture</span>
        </div>
      </div>
    </div>
  );
}

