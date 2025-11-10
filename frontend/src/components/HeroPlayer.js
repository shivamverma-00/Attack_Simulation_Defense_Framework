import React, { useState } from 'react';
import AnimatedHero from './AnimatedHero';
import UniqueHero from './UniqueHero';

const HeroPlayer = ({ title, subtitle, mp4Src, captionsSrc, poster, type = 'SQLi', defaultView = 'unique', children }) => {
  const [viewMode, setViewMode] = useState(defaultView);

  return (
    <section aria-labelledby="hero-title" className="mb-4 sm:mb-6 md:mb-8 w-full">
      <div className="mb-2 sm:mb-3 md:mb-4 px-1 sm:px-2 md:px-0">
        <h1 id="hero-title" className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white break-words">{title}</h1>
        {subtitle && <p className="text-gray-400 mt-1 text-xs sm:text-sm md:text-base break-words">{subtitle}</p>}
      </div>
      <div className="rounded-lg overflow-hidden border border-gray-700 bg-gray-800 w-full">
        {viewMode === 'unique' ? (
          <div className="relative w-full">
            <UniqueHero type={type} />
            <button
              onClick={() => setViewMode('flow')}
              className="absolute top-1 right-1 sm:top-2 sm:right-2 px-2 py-1 sm:px-3 sm:py-1.5 bg-cyber-blue/90 hover:bg-cyber-blue text-white text-xs sm:text-sm rounded transition-colors z-10"
              aria-label="Switch to flow animation"
            >
              Flow View
            </button>
          </div>
        ) : (
          <div className="relative w-full">
            <AnimatedHero type={type} />
            <button
              onClick={() => setViewMode('unique')}
              className="absolute top-1 right-1 sm:top-2 sm:right-2 px-2 py-1 sm:px-3 sm:py-1.5 bg-cyber-blue/90 hover:bg-cyber-blue text-white text-xs sm:text-sm rounded transition-colors z-10"
              aria-label="Switch to unique animation"
            >
              Particle View
            </button>
          </div>
        )}
      </div>
      {children}
    </section>
  );
};

export default HeroPlayer;



