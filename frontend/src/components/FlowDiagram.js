import React from 'react';

const FlowDiagram = ({ lanes }) => {
  return (
    <section className="mb-6 sm:mb-8" aria-labelledby="flow-title">
      <h2 id="flow-title" className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">Conceptual Flow</h2>
      <div className="rounded-lg border border-gray-700 p-2 sm:p-4 bg-gray-900 overflow-x-auto">
        <svg viewBox="0 0 800 260" className="w-full h-48 sm:h-56 min-w-[600px]" role="img" aria-label="Conceptual data flow" preserveAspectRatio="xMidYMid meet">
          <defs>
            <marker id="arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto" markerUnits="strokeWidth">
              <path d="M0,0 L0,6 L6,3 z" fill="#22d3ee" />
            </marker>
          </defs>
          {lanes.map((lane, idx) => (
            <g key={idx} transform={`translate(0, ${idx * 80})`}>
              <rect x="40" y="20" width="150" height="40" rx="8" fill="#1f2937" stroke="#374151" />
              <text x="115" y="46" textAnchor="middle" fill="#e5e7eb" fontSize="12">{lane.actor}</text>

              <rect x="325" y="20" width="150" height="40" rx="8" fill="#1f2937" stroke="#374151" />
              <text x="400" y="46" textAnchor="middle" fill="#e5e7eb" fontSize="12">{lane.app}</text>

              <rect x="610" y="20" width="150" height="40" rx="8" fill="#1f2937" stroke="#374151" />
              <text x="685" y="46" textAnchor="middle" fill="#e5e7eb" fontSize="12">{lane.target}</text>

              <path d="M190 40 C 240 10, 280 10, 325 40" stroke="#22d3ee" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />
              <path d="M475 40 C 520 70, 560 70, 610 40" stroke="#f59e0b" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />

              <circle cx="210" cy="40" r="6" fill={lane.tokenColor || '#22d3ee'}>
                <animate attributeName="cx" values="210;315" dur="3s" repeatCount="indefinite" />
              </circle>
              <circle cx="490" cy="40" r="6" fill={lane.tokenColor2 || '#f59e0b'}>
                <animate attributeName="cx" values="490;600" dur="3s" repeatCount="indefinite" />
              </circle>
            </g>
          ))}
        </svg>
        <p className="text-gray-400 text-sm mt-2">Abstract flow of actor → application → target. Icons and paths are conceptual, not code.</p>
      </div>
    </section>
  );
};

export default FlowDiagram;



