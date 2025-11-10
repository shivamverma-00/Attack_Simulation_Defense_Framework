import React from 'react';
import HeroPlayer from '../components/HeroPlayer';
import FlowDiagram from '../components/FlowDiagram';
import ExplainerCards from '../components/ExplainerCards';
import { AttackTimeline, ImpactMatrix, DetectionBars } from '../components/AnimatedGraphs';

const SqlInjectionExplainer = () => {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <HeroPlayer
        title="SQL Injection (Conceptual)"
        subtitle="A visual overview of how query composition flaws can lead to unintended database actions."
        mp4Src="/media/sql-hero.mp4"
        captionsSrc="/captions/sql.vtt"
        poster="/media/sql-hero-poster.png"
        type="SQLi"
        defaultView="unique"
      >
        <p className="sr-only">No runnable exploit code, real payloads, or step-by-step instructions.</p>
      </HeroPlayer>

      <FlowDiagram lanes={[{ actor: 'User', app: 'Query Builder', target: 'Database', tokenColor: '#22d3ee', tokenColor2: '#f59e0b' }]} />

      <ExplainerCards
        items={[
          { title: 'Ungarded Input', caption: 'Free-form input influences query composition.', icon: '🧾', color: '#22d3ee' },
          { title: 'Query Logic Drift', caption: 'Abstract query blocks recombine in unintended ways.', icon: '🧩', color: '#f59e0b' },
          { title: 'Unexpected Results', caption: 'The system returns rows beyond the intended scope.', icon: '📊', color: '#ef4444' },
          { title: 'Mitigation Lens', caption: 'Bind values separate data from logic.', icon: '🛡️', color: '#10b981' },
          { title: 'Least Privilege', caption: 'Accounts limited to required actions only.', icon: '🔐', color: '#60a5fa' },
          { title: 'Audit & Monitor', caption: 'Watch for spikes in warnings and row counts.', icon: '🛰️', color: '#a78bfa' },
        ]}
      />

      <section className="mb-6 sm:mb-8" aria-labelledby="graphs-sql">
        <h2 id="graphs-sql" className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">Conceptual Graphs</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
          <div>
            <h3 className="text-white font-semibold mb-2">Attack Timeline</h3>
            <AttackTimeline />
            <p className="text-gray-400 text-sm mt-2">Illustrative peaks indicate suspicious activity. Values are synthetic.</p>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-2">Impact vs Likelihood</h3>
            <ImpactMatrix />
            <p className="text-gray-400 text-sm mt-2">High impact when query composition is unguarded; likelihood varies by control maturity.</p>
          </div>
        </div>
      </section>

      <section className="mb-6 sm:mb-8" aria-labelledby="logs-sql">
        <h2 id="logs-sql" className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">Detection Signals & Example Logs</h2>
        <DetectionBars labels={[ 'Query errors per min', 'Unexpected row counts', 'Anomaly score' ]} />
        <div className="mt-3 sm:mt-4 bg-gray-900 rounded border border-gray-700 p-3 sm:p-4 overflow-x-auto">
          <pre className="text-xs sm:text-sm text-gray-200 whitespace-pre-wrap break-words" aria-label="synthetic logs">{`2025-11-05T18:36:10Z app=db event=query_warning rows=unexpected source=web
2025-11-05T18:36:11Z app=db event=anomaly_score value=0.91 threshold=0.80
2025-11-05T18:36:12Z app=api route=/search event=validation_warning reason=input_format
`}</pre>
          <p className="text-gray-400 text-xs mt-2">All entries are synthetic and non-actionable.</p>
        </div>
      </section>

      <section className="mb-6 sm:mb-8" aria-labelledby="mitigation-sql">
        <h2 id="mitigation-sql" className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">Mitigation Checklist</h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
          {[ 
            'Parameterized queries (bind variables)', 
            'Input validation and normalization', 
            'Least-privilege DB accounts', 
            'Result filtering & allowlists', 
            'DB auditing & change monitoring', 
            'Monitoring & alerting thresholds'
          ].map((item, i)=> (
            <li key={i} className="p-2 sm:p-3 bg-gray-900 border border-gray-700 rounded animate-pulse-once">
              <span className="text-white text-sm sm:text-base">{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <footer className="text-gray-500 text-xs sm:text-sm mt-6 sm:mt-8 px-2 sm:px-0 text-center sm:text-left">For authorized security testing and defensive learning only — do not use to attack systems. No runnable exploit code, real payloads, or step-by-step attack instructions.</footer>
    </div>
  );
};

export default SqlInjectionExplainer;



