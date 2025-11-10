import React from 'react';
import HeroPlayer from '../components/HeroPlayer';
import FlowDiagram from '../components/FlowDiagram';
import ExplainerCards from '../components/ExplainerCards';
import { AttackTimeline, ImpactMatrix, DetectionBars } from '../components/AnimatedGraphs';

const XssExplainer = () => {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <HeroPlayer
        title="Cross-Site Scripting (XSS) — Conceptual"
        subtitle="A visual overview of reflected and stored flows converging on a victim browser."
        mp4Src="/media/xss-hero.mp4"
        captionsSrc="/captions/xss.vtt"
        poster="/media/xss-hero-poster.png"
        type="XSS"
        defaultView="unique"
      />

      <FlowDiagram lanes={[{ actor: 'Reflected Flow', app: 'Web App', target: 'Victim Browser', tokenColor: '#22d3ee', tokenColor2: '#f59e0b' }, { actor: 'Stored Flow', app: 'Content Store', target: 'Victim Browser', tokenColor: '#22d3ee', tokenColor2: '#f59e0b' }]} />

      <ExplainerCards
        items={[
          { title: 'Reflected Path', caption: 'Response mirrors user-supplied content.', icon: '🔁', color: '#22d3ee' },
          { title: 'Stored Path', caption: 'Persisted content later delivered to browsers.', icon: '🗄️', color: '#f59e0b' },
          { title: 'Victim Context', caption: 'Untrusted content may render in-page.', icon: '🌐', color: '#ef4444' },
          { title: 'Encode Output', caption: 'Templates output text safely by default.', icon: '🔤', color: '#10b981' },
          { title: 'CSP Shield', caption: 'Restrict script sources and report violations.', icon: '🛡️', color: '#60a5fa' },
          { title: 'Monitor Reports', caption: 'Use CSP reports and render alerts.', icon: '📈', color: '#a78bfa' },
        ]}
      />

      <section className="mb-6 sm:mb-8" aria-labelledby="graphs-xss">
        <h2 id="graphs-xss" className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">Conceptual Graphs</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
          <div>
            <h3 className="text-white font-semibold mb-2">Incident Reduction with CSP</h3>
            <ImpactMatrix />
            <p className="text-gray-400 text-sm mt-2">Conceptual matrix; CSP adoption correlates with fewer incidents.</p>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-2">Timeline of Suspicious Renders</h3>
            <AttackTimeline />
          </div>
        </div>
      </section>

      <section className="mb-6 sm:mb-8" aria-labelledby="logs-xss">
        <h2 id="logs-xss" className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">Detection Signals & Example Logs</h2>
        <DetectionBars labels={[ 'Content sanitization warnings', 'CSP report counts', 'Unusual render hotspots' ]} />
        <div className="mt-3 sm:mt-4 bg-gray-900 rounded border border-gray-700 p-3 sm:p-4 overflow-x-auto">
          <pre className="text-xs sm:text-sm text-gray-200 whitespace-pre-wrap break-words" aria-label="synthetic logs">{`2025-11-05T18:36:10Z app=web event=sanitize_warning field=comment
2025-11-05T18:36:11Z app=web event=csp_report blocked=inline-script
2025-11-05T18:36:12Z app=cdn event=render_anomaly score=0.82
`}</pre>
          <p className="text-gray-400 text-xs mt-2">All entries are synthetic and non-actionable.</p>
        </div>
      </section>

      <section className="mb-6 sm:mb-8" aria-labelledby="mitigation-xss">
        <h2 id="mitigation-xss" className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">Mitigation Checklist</h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
          {[ 'Output encoding/escaping', 'Content Security Policy (CSP)', 'httpOnly cookies', 'Input validation', 'Template auto-escape', 'CSP reporting & monitoring' ].map((item,i)=> (
            <li key={i} className="p-2 sm:p-3 bg-gray-900 border border-gray-700 rounded animate-pulse-once"><span className="text-white text-sm sm:text-base">{item}</span></li>
          ))}
        </ul>
      </section>

      <footer className="text-gray-500 text-xs sm:text-sm mt-6 sm:mt-8 px-2 sm:px-0 text-center sm:text-left">For authorized security testing and defensive learning only — do not use to attack systems. No runnable exploit code, real payloads, or step-by-step attack instructions.</footer>
    </div>
  );
};

export default XssExplainer;



