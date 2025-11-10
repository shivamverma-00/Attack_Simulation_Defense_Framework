import React from 'react';
import HeroPlayer from '../components/HeroPlayer';
import FlowDiagram from '../components/FlowDiagram';
import ExplainerCards from '../components/ExplainerCards';
import { AttackTimeline, ImpactMatrix, DetectionBars } from '../components/AnimatedGraphs';

const BruteForceExplainer = () => {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <HeroPlayer
        title="Brute-Force Authentication (Conceptual)"
        subtitle="A visual of repeated login attempts and layered defenses."
        mp4Src="/media/brute-hero.mp4"
        captionsSrc="/captions/brute.vtt"
        poster="/media/brute-hero-poster.png"
        type="BruteForce"
        defaultView="unique"
      />

      <FlowDiagram lanes={[{ actor: 'Login tokens', app: 'Auth Endpoint', target: 'Account', tokenColor: '#22d3ee', tokenColor2: '#f59e0b' }]} />

      <ExplainerCards
        items={[
          { title: 'Token Stream', caption: 'Multiple attempts push toward an endpoint.', icon: '💨', color: '#22d3ee' },
          { title: 'Threshold', caption: 'Burst activity exceeds safe expectations.', icon: '📈', color: '#f59e0b' },
          { title: 'Interception', caption: 'Controls slow, block, or challenge.', icon: '🚧', color: '#ef4444' },
          { title: 'Rate Limit', caption: 'Progressive delays and caps apply.', icon: '⏱️', color: '#10b981' },
          { title: 'Lockout & MFA', caption: 'Protect accounts after repeated failures.', icon: '🔐', color: '#60a5fa' },
          { title: 'Alerting', caption: 'Notify on spikes and anomalies.', icon: '📣', color: '#a78bfa' },
        ]}
      />

      <section className="mb-6 sm:mb-8" aria-labelledby="graphs-brute">
        <h2 id="graphs-brute" className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">Conceptual Graphs</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
          <div>
            <h3 className="text-white font-semibold mb-2">Failed Login Spikes</h3>
            <AttackTimeline />
          </div>
          <div>
            <h3 className="text-white font-semibold mb-2">Risk Matrix</h3>
            <ImpactMatrix />
          </div>
        </div>
      </section>

      <section className="mb-6 sm:mb-8" aria-labelledby="logs-brute">
        <h2 id="logs-brute" className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">Detection Signals & Example Logs</h2>
        <DetectionBars labels={[ 'Failed logins/min', 'Source anomaly score', 'Geo inconsistencies' ]} />
        <div className="mt-3 sm:mt-4 bg-gray-900 rounded border border-gray-700 p-3 sm:p-4 overflow-x-auto">
          <pre className="text-xs sm:text-sm text-gray-200 whitespace-pre-wrap break-words" aria-label="synthetic logs">{`2025-11-05T18:36:10Z app=auth event=failed_login user=redacted src=198.51.100.10
2025-11-05T18:36:40Z app=auth event=failed_login user=redacted src=198.51.100.10 count=20
2025-11-05T18:37:00Z app=auth event=rate_limited src=198.51.100.10 rule=per_ip_20pm
`}</pre>
          <p className="text-gray-400 text-xs mt-2">All entries are synthetic and non-actionable.</p>
        </div>
      </section>

      <section className="mb-6 sm:mb-8" aria-labelledby="mitigation-brute">
        <h2 id="mitigation-brute" className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">Mitigation Checklist</h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
          {[ 'Rate limiting & lockout', 'Adaptive auth & MFA', 'Progressive delays', 'IP reputation & blocklists', 'Alert thresholds', 'Session monitoring' ].map((item,i)=> (
            <li key={i} className="p-2 sm:p-3 bg-gray-900 border border-gray-700 rounded animate-pulse-once"><span className="text-white text-sm sm:text-base">{item}</span></li>
          ))}
        </ul>
      </section>

      <footer className="text-gray-500 text-xs sm:text-sm mt-6 sm:mt-8 px-2 sm:px-0 text-center sm:text-left">For authorized security testing and defensive learning only — do not use to attack systems. No runnable exploit code, real payloads, or step-by-step attack instructions.</footer>
    </div>
  );
};

export default BruteForceExplainer;



