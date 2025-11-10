import React from 'react';

const Token = ({ color = '#22d3ee' }) => (
  <svg viewBox="0 0 80 20" className="w-full h-6">
    <defs>
      <linearGradient id="g" x1="0" x2="1">
        <stop offset="0%" stopColor={color} stopOpacity="0.2" />
        <stop offset="100%" stopColor={color} stopOpacity="0.6" />
      </linearGradient>
    </defs>
    <path d="M2 10 Q 20 2, 40 10 T 78 10" fill="none" stroke="url(#g)" strokeWidth="2" />
    <circle r="3" cy="10">
      <animate attributeName="cx" values="2;78" dur="2.2s" repeatCount="indefinite" />
      <animate attributeName="fill" values={color+";"+color} dur="2.2s" repeatCount="indefinite" />
    </circle>
  </svg>
);

const ExplainerCards = ({ items }) => {
  return (
    <section className="mb-6 sm:mb-8" aria-labelledby="explain-title">
      <h2 id="explain-title" className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">How it works (Conceptual)</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {items.map((it, i) => (
          <div key={i} className="p-3 sm:p-4 rounded-lg border border-gray-700 bg-gray-900 hover:border-cyber-blue transition-all duration-300">
            <div className="flex items-center mb-2">
              <div className="text-xl sm:text-2xl mr-2">
                <span role="img" aria-label={it.title}>{it.icon}</span>
              </div>
              <h3 className="text-white font-semibold text-sm sm:text-base">{it.title}</h3>
            </div>
            <p className="text-gray-300 text-xs sm:text-sm mb-2">{it.caption}</p>
            <Token color={it.color} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default ExplainerCards;


