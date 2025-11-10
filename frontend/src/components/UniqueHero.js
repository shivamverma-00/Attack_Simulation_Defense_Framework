import React, { useEffect, useRef } from 'react';

const UniqueHero = ({ type = 'SQLi' }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    
    const updateCanvasSize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio || 1;
      canvas.height = rect.height * window.devicePixelRatio || 1;
      ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
    };

    updateCanvasSize();

    const configs = {
      SQLi: {
        colors: ['#22d3ee', '#06b6d4', '#0891b2'],
        particleCount: 30,
        speed: 0.5,
      },
      XSS: {
        colors: ['#f59e0b', '#d97706', '#b45309'],
        particleCount: 40,
        speed: 0.7,
      },
      BruteForce: {
        colors: ['#ef4444', '#dc2626', '#b91c1c'],
        particleCount: 50,
        speed: 0.9,
      },
      Summary: {
        colors: ['#10b981', '#059669', '#047857'],
        particleCount: 35,
        speed: 0.6,
      },
    };

    const cfg = configs[type] || configs.SQLi;

    // Initialize particles
    const initParticles = () => {
      const newParticles = [];
      const width = canvas.width / (window.devicePixelRatio || 1);
      const height = canvas.height / (window.devicePixelRatio || 1);
      
      for (let i = 0; i < cfg.particleCount; i++) {
        newParticles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * cfg.speed * 2,
          vy: (Math.random() - 0.5) * cfg.speed * 2,
          radius: Math.random() * 3 + 1,
          color: cfg.colors[Math.floor(Math.random() * cfg.colors.length)],
          opacity: Math.random() * 0.5 + 0.3,
        });
      }
      return newParticles;
    };

    let currentParticles = initParticles();
    let animationId = null;

    const animate = () => {
      const width = canvas.width / (window.devicePixelRatio || 1);
      const height = canvas.height / (window.devicePixelRatio || 1);
      
      ctx.clearRect(0, 0, width, height);

      // Update and draw particles
      currentParticles.forEach((particle, i) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Bounce off edges
        if (particle.x < 0 || particle.x > width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > height) particle.vy *= -1;

        // Keep particles in bounds
        particle.x = Math.max(0, Math.min(width, particle.x));
        particle.y = Math.max(0, Math.min(height, particle.y));

        // Draw particle with glow
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.radius * 2
        );
        gradient.addColorStop(0, particle.color);
        gradient.addColorStop(1, 'transparent');
        
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = particle.opacity;
        ctx.fill();
        
        // Glow effect
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius * 2, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.globalAlpha = particle.opacity * 0.3;
        ctx.fill();
        ctx.globalAlpha = 1;

        // Draw connections
        currentParticles.slice(i + 1).forEach((other) => {
          const dx = particle.x - other.x;
          const dy = particle.y - other.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 120) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(other.x, other.y);
            ctx.strokeStyle = particle.color;
            ctx.globalAlpha = (120 - distance) / 120 * 0.2;
            ctx.lineWidth = 1;
            ctx.stroke();
            ctx.globalAlpha = 1;
          }
        });
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      updateCanvasSize();
      currentParticles = initParticles();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [type]);

  const configs = {
    SQLi: {
      icon: '🗄️',
      title: 'SQL Injection',
      subtitle: 'Database Query Manipulation',
      gradient: 'from-cyan-500 via-blue-500 to-cyan-600',
    },
    XSS: {
      icon: '🌐',
      title: 'Cross-Site Scripting',
      subtitle: 'Client-Side Code Execution',
      gradient: 'from-amber-500 via-orange-500 to-amber-600',
    },
    BruteForce: {
      icon: '🔐',
      title: 'Brute Force',
      subtitle: 'Authentication Bypass Attempts',
      gradient: 'from-red-500 via-rose-500 to-red-600',
    },
    Summary: {
      icon: '🛡️',
      title: 'Security Detection',
      subtitle: 'Threat Analysis & Response',
      gradient: 'from-emerald-500 via-green-500 to-emerald-600',
    },
  };

  const cfg = configs[type] || configs.SQLi;

  return (
    <div className="w-full h-48 sm:h-56 md:h-64 lg:h-72 xl:h-80 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-lg border border-gray-700 overflow-hidden relative">
      {/* Animated background canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ background: 'transparent' }}
      />

      {/* Gradient overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br ${cfg.gradient} opacity-10`} />

      {/* Content overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 px-4">
        <div className="text-6xl sm:text-7xl md:text-8xl mb-2 sm:mb-3 animate-bounce" style={{ animationDuration: '2s' }}>
          {cfg.icon}
        </div>
        <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1 sm:mb-2 text-center">
          {cfg.title}
        </h3>
        <p className="text-gray-300 text-xs sm:text-sm md:text-base text-center max-w-md">
          {cfg.subtitle}
        </p>
      </div>

      {/* Animated border glow */}
      <div className={`absolute inset-0 rounded-lg border-2 border-transparent bg-gradient-to-r ${cfg.gradient} opacity-20 animate-pulse`} style={{ 
        maskImage: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
        maskComposite: 'exclude',
        WebkitMaskComposite: 'xor',
        padding: '2px'
      }} />

      {/* Floating particles overlay */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full"
            style={{
              background: cfg.gradient.includes('cyan') ? '#22d3ee' :
                          cfg.gradient.includes('amber') ? '#f59e0b' :
                          cfg.gradient.includes('red') ? '#ef4444' : '#10b981',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 2}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
              opacity: 0.6,
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { 
            transform: translateY(0px) translateX(0px) scale(1);
            opacity: 0.3;
          }
          50% { 
            transform: translateY(-30px) translateX(15px) scale(1.2);
            opacity: 0.8;
          }
        }
      `}</style>
    </div>
  );
};

export default UniqueHero;

