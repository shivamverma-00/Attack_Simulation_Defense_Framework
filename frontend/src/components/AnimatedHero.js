import React, { useEffect, useRef, useState } from 'react';

const AnimatedHero = ({ type = 'SQLi' }) => {
  const svgRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 700, height: 200 });

  useEffect(() => {
    const updateDimensions = () => {
      const container = svgRef.current?.parentElement;
      if (container) {
        const aspectRatio = 700 / 200;
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;
        const calculatedWidth = Math.max(700, containerWidth);
        const calculatedHeight = calculatedWidth / aspectRatio;
        setDimensions({ width: calculatedWidth, height: calculatedHeight });
      }
    };
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [type]);

  const configs = {
    SQLi: {
      steps: ['User Input', 'Query Builder', 'Database'],
      colors: ['#22d3ee', '#f59e0b', '#ef4444'],
      icons: ['👨‍💻', '🧩', '🗄️'],
      path: 'M 50 100 Q 200 50, 350 100 T 650 100',
      description: 'Input influences query structure, leading to unintended database access.',
    },
    XSS: {
      steps: ['Payload', 'Web App', 'Victim Browser'],
      colors: ['#22d3ee', '#f59e0b', '#ef4444'],
      icons: ['📝', '🌐', '👤'],
      path: 'M 50 100 Q 200 50, 350 100 T 650 100',
      description: 'Untrusted content reaches browser context, potentially executing scripts.',
    },
    BruteForce: {
      steps: ['Login Attempts', 'Auth Endpoint', 'Account'],
      colors: ['#22d3ee', '#f59e0b', '#ef4444'],
      icons: ['🔁', '🚪', '🔐'],
      path: 'M 50 100 Q 200 50, 350 100 T 650 100',
      description: 'Repeated authentication attempts target account access.',
    },
    Summary: {
      steps: ['Indicators', 'Aggregation', 'Response'],
      colors: ['#22d3ee', '#f59e0b', '#10b981'],
      icons: ['📊', '🧰', '🛡️'],
      path: 'M 50 100 Q 200 50, 350 100 T 650 100',
      description: 'Combine signals, analyze patterns, and respond with defenses.',
    },
  };

  const cfg = configs[type] || configs.SQLi;

  return (
    <div className="w-full h-48 sm:h-56 md:h-64 lg:h-72 xl:h-80 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-lg border border-gray-700 overflow-hidden relative">
      {/* Background particles */}
      <div className="absolute inset-0 opacity-20">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-cyber-blue rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 2}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <svg 
        ref={svgRef} 
        viewBox="0 0 700 200" 
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id={`pathGrad-${type}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#ef4444" stopOpacity="0.4" />
          </linearGradient>
          <filter id={`glow-${type}`}>
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <radialGradient id={`nodeGrad-${type}`}>
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Animated path */}
        <path 
          d={cfg.path} 
          fill="none" 
          stroke={`url(#pathGrad-${type})`} 
          strokeWidth="4" 
          strokeDasharray="8,4" 
          opacity="0.5"
        >
          <animate attributeName="stroke-dashoffset" values="0;-24" dur="2s" repeatCount="indefinite" />
        </path>

        {/* Step nodes */}
        {cfg.steps.map((step, i) => {
          const x = 50 + (i * 300);
          const y = 100;
          return (
            <g key={i}>
              {/* Outer glow ring */}
              <circle 
                cx={x} 
                cy={y} 
                r="32" 
                fill={cfg.colors[i]} 
                opacity="0.15" 
                filter={`url(#glow-${type})`}
              >
                <animate attributeName="r" values="32;38;32" dur="3s" repeatCount="indefinite" />
              </circle>
              {/* Middle ring */}
              <circle 
                cx={x} 
                cy={y} 
                r="24" 
                fill={cfg.colors[i]} 
                opacity="0.3"
              >
                <animate attributeName="opacity" values="0.3;0.5;0.3" dur="2.5s" repeatCount="indefinite" />
              </circle>
              {/* Inner circle */}
              <circle 
                cx={x} 
                cy={y} 
                r="18" 
                fill={cfg.colors[i]} 
                opacity="0.8"
              >
                <animate attributeName="opacity" values="0.8;1;0.8" dur="2s" repeatCount="indefinite" />
              </circle>
              {/* Icon background */}
              <circle cx={x} cy={y} r="14" fill="rgba(0,0,0,0.3)" />
              {/* Icon */}
              <text 
                x={x} 
                y={y + 6} 
                textAnchor="middle" 
                fontSize="18"
                style={{ filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.3))' }}
              >
                {cfg.icons[i]}
              </text>
              {/* Label */}
              <text 
                x={x} 
                y={y + 55} 
                textAnchor="middle" 
                fill="#e5e7eb" 
                fontSize="10" 
                fontWeight="600"
                className="font-semibold"
              >
                <tspan>{step.split(' ')[0]}</tspan>
                {step.includes(' ') && <tspan x={x} dy="12">{step.split(' ').slice(1).join(' ')}</tspan>}
              </text>
            </g>
          );
        })}

        {/* Moving token */}
        <circle 
          cx="50" 
          cy="100" 
          r="10" 
          fill="#22d3ee" 
          filter={`url(#glow-${type})`}
        >
          <animateMotion dur="4s" repeatCount="indefinite">
            <mpath href={`#path-${type}`} />
          </animateMotion>
          <animate attributeName="r" values="8;12;8" dur="1s" repeatCount="indefinite" />
        </circle>

        {/* Trail effect */}
        <circle 
          cx="50" 
          cy="100" 
          r="6" 
          fill="#22d3ee" 
          opacity="0.4"
        >
          <animateMotion dur="4s" repeatCount="indefinite">
            <mpath href={`#path-${type}`} />
          </animateMotion>
        </circle>

        <path id={`path-${type}`} d={cfg.path} fill="none" stroke="none" />
      </svg>

      {/* Description overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent p-2 sm:p-3 md:p-4">
        <p className="text-gray-300 text-xs sm:text-sm text-center mb-0.5 sm:mb-1 px-2">{cfg.description}</p>
        <p className="text-gray-500 text-xs text-center px-2">Conceptual visualization — no executable code</p>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0.3; }
          50% { transform: translateY(-20px) translateX(10px); opacity: 0.6; }
        }
      `}</style>
    </div>
  );
};

export default AnimatedHero;

