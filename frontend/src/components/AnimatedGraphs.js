import React, { useEffect, useRef } from 'react';

export const AttackTimeline = () => {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let w = el.clientWidth, h = 120, t = 0;
    const ctx = el.getContext('2d');
    let id;
    const draw = () => {
      ctx.clearRect(0,0,w,h);
      ctx.strokeStyle = '#374151';
      ctx.strokeRect(0,0,w,h);
      ctx.strokeStyle = '#60a5fa';
      ctx.beginPath();
      ctx.moveTo(0,h-20);
      for (let x=0;x<w;x++){
        const y = h-20 - 10*Math.sin((x+t)/25) - (x%80<5? (10*((x+t)%400>300?1:0)) : 0);
        ctx.lineTo(x,y);
      }
      ctx.stroke();
      t+=2;
      id = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(id);
  },[]);
  return <canvas ref={ref} width={600} height={120} className="w-full bg-gray-900 rounded border border-gray-700" aria-label="Attack attempts over time" />;
};

export const ImpactMatrix = () => (
  <svg viewBox="0 0 300 160" className="w-full bg-gray-900 rounded border border-gray-700" aria-label="Impact vs likelihood">
    <rect x="0" y="0" width="300" height="160" fill="#111827" />
    {[1,2,3,4].map((i)=> (
      <line key={`v${i}`} x1={i*60} y1={20} x2={i*60} y2={140} stroke="#374151" />
    ))}
    {[1,2].map((i)=> (
      <line key={`h${i}`} x1={20} y1={i*40+20} x2={280} y2={i*40+20} stroke="#374151" />
    ))}
    <circle cx="220" cy="60" r="10" fill="#ef4444" />
    <circle cx="180" cy="100" r="8" fill="#f59e0b" />
    <circle cx="120" cy="120" r="6" fill="#10b981" />
  </svg>
);

export const DetectionBars = ({ labels }) => (
  <div className="bg-gray-900 rounded border border-gray-700 p-4" aria-label="Detection signals">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {labels.map((l,i)=> (
        <div key={i}>
          <div className="text-gray-300 text-sm mb-2">{l}</div>
          <div className="h-2 bg-gray-800 rounded">
            <div className="h-2 bg-cyber-blue rounded animate-pulse" style={{width: `${40 + (i*15)%50}%`}}></div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const AnimatedGraphs = { AttackTimeline, ImpactMatrix, DetectionBars };
export default AnimatedGraphs;



