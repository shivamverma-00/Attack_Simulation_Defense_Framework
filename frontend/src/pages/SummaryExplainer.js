import React from 'react';
import HeroPlayer from '../components/HeroPlayer';
import { DetectionBars } from '../components/AnimatedGraphs';
import ExplainerCards from '../components/ExplainerCards';

const SummaryExplainer = () => {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <HeroPlayer
        title="Summary & Detection"
        subtitle="Aggregated indicators, logging patterns, and a defensive checklist."
        mp4Src="/media/summary-hero.mp4"
        captionsSrc="/captions/summary.vtt"
        poster="/media/summary-hero-poster.png"
        type="Summary"
        defaultView="unique"
      />

      <section className="mb-6 sm:mb-8" aria-labelledby="signals">
        <h2 id="signals" className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">Detection Signals Overview</h2>
        <DetectionBars labels={[ 'Unusual errors', 'Anomaly scores', 'Failed auth spikes', 'CSP reports' ]} />
      </section>

      <ExplainerCards
        items={[
          { title: 'Indicators', caption: 'Track shifts in behavior over time.', icon: '📊', color: '#22d3ee' },
          { title: 'Aggregation', caption: 'Combine sources for better context.', icon: '🧰', color: '#f59e0b' },
          { title: 'Response', caption: 'Escalate and contain quickly.', icon: '🚀', color: '#ef4444' },
        ]}
      />

      <section className="mb-6 sm:mb-8" aria-labelledby="logs-summary">
        <h2 id="logs-summary" className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">Synthetic Example Logs</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
          <div className="bg-gray-900 rounded border border-gray-700 p-3 sm:p-4 overflow-x-auto">
            <h3 className="text-white font-semibold mb-2 text-sm sm:text-base">API / App</h3>
            <pre className="text-xs sm:text-sm text-gray-200 whitespace-pre-wrap break-words">{`2025-11-05T18:36:11Z app=api route=/search event=input_warning
2025-11-05T18:36:12Z app=web event=csp_report blocked=inline-script
`}</pre>
          </div>
          <div className="bg-gray-900 rounded border border-gray-700 p-3 sm:p-4 overflow-x-auto">
            <h3 className="text-white font-semibold mb-2 text-sm sm:text-base">Auth / DB</h3>
            <pre className="text-xs sm:text-sm text-gray-200 whitespace-pre-wrap break-words">{`2025-11-05T18:36:40Z app=auth event=failed_login src=198.51.100.10 count=20
2025-11-05T18:36:45Z app=db event=query_warning rows=unexpected
`}</pre>
          </div>
        </div>
        <p className="text-gray-400 text-xs sm:text-sm mt-2 px-2 sm:px-0">All examples are synthetic and non-actionable; values are illustrative.</p>
      </section>

      <section className="mb-6 sm:mb-8" aria-labelledby="defensive-checklist">
        <h2 id="defensive-checklist" className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">Defensive Checklist</h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
          {[ 'Parameterized queries', 'Output encoding/escaping', 'CSP with reporting', 'Rate limiting & lockout', 'MFA & adaptive auth', 'Least-privilege roles', 'Monitoring & alerting', 'Secure logging hygiene', 'Regular testing & reviews' ].map((item,i)=> (
            <li key={i} className="p-2 sm:p-3 bg-gray-900 border border-gray-700 rounded animate-pulse-once"><span className="text-white text-sm sm:text-base">{item}</span></li>
          ))}
        </ul>
      </section>

      <footer className="text-gray-500 text-xs sm:text-sm mt-6 sm:mt-8 px-2 sm:px-0 text-center sm:text-left">For authorized security testing and defensive learning only — do not use to attack systems. No runnable exploit code, real payloads, or step-by-step attack instructions.</footer>
    </div>
  );
};

export default SummaryExplainer;



