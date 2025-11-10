import React, { useEffect, useMemo, useState } from 'react';

const stepsByAttack = {
  SQLi: [
    { title: 'User Input', desc: "Attacker enters a crafted payload like ' OR '1'='1", icon: '👨‍💻' },
    { title: 'Vulnerable Query', desc: "Input is concatenated into SQL, altering logic (tautology).", icon: '🧩' },
    { title: 'DB Response', desc: 'Database returns unintended rows (e.g., first user).', icon: '🗄️' },
    { title: 'Defense', desc: 'Prepared statements treat input as data, not SQL.', icon: '🛡️' },
  ],
  XSS: [
    { title: 'User Input', desc: 'Attacker submits a script payload.', icon: '👨‍💻' },
    { title: 'Reflection/Storage', desc: 'Payload is reflected or stored in page.', icon: '📨' },
    { title: 'Browser Execute', desc: 'Victim browser executes script in origin.', icon: '🌐' },
    { title: 'Defense', desc: 'Output encoding and CSP block execution.', icon: '🛡️' },
  ],
  BruteForce: [
    { title: 'Login Attempts', desc: 'Automated repeated guesses.', icon: '🔁' },
    { title: 'Detection', desc: 'Threshold reached triggers detection.', icon: '🚨' },
    { title: 'Rate Limit', desc: '429 Too Many Requests returned.', icon: '⏳' },
    { title: 'Lockout', desc: 'Account temporarily locked.', icon: '🔒' },
  ],
};

const AttackVisualizer = () => {
  const [attack, setAttack] = useState('SQLi');
  const [step, setStep] = useState(0);
  const [payload, setPayload] = useState("' OR '1'='1");
  const [autoPlay, setAutoPlay] = useState(true);
  const [speedMs, setSpeedMs] = useState(1200);

  const steps = stepsByAttack[attack];

  const next = () => setStep(s => Math.min(steps.length - 1, s + 1));
  const prev = () => setStep(s => Math.max(0, s - 1));
  const restart = () => setStep(0);

  // Autoplay through steps (loop)
  useEffect(() => {
    if (!autoPlay) return;
    const timer = setInterval(() => {
      setStep(s => (s >= steps.length - 1 ? 0 : s + 1));
    }, Math.max(300, speedMs));
    return () => clearInterval(timer);
  }, [autoPlay, speedMs, steps.length]);

  const progressPercent = useMemo(() => ((step + 1) / steps.length) * 100, [step, steps.length]);
  const codeProgress = progressPercent;

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Attack Visualizer</h1>
        <p className="text-gray-400">Animated walkthrough of how attacks execute and how defenses stop them.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-gray-300 text-sm font-bold mb-2">Attack Type</label>
          <select
            value={attack}
            onChange={(e) => setAttack(e.target.value)}
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
          >
            <option value="SQLi">SQL Injection</option>
            <option value="XSS">Cross-Site Scripting</option>
            <option value="BruteForce">Brute Force</option>
          </select>
        </div>
        <div className="lg:col-span-2">
          <label className="block text-gray-300 text-sm font-bold mb-2">Payload / Input</label>
          <input
            value={payload}
            onChange={(e) => setPayload(e.target.value)}
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
            placeholder="Enter payload"
          />
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center flex-wrap gap-3 mb-6 w-full">
        <div className="flex items-center gap-3">
          <button onClick={restart} className="px-4 py-2 bg-cyber-blue text-white rounded-lg hover:bg-blue-700">Restart</button>
          <button onClick={prev} className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600">← Previous</button>
          <button onClick={next} className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600">Next →</button>
          <button onClick={() => setAutoPlay(v => !v)} className={`px-4 py-2 rounded-lg ${autoPlay ? 'bg-yellow-600 hover:bg-yellow-500' : 'bg-green-600 hover:bg-green-500'}`}>
            {autoPlay ? 'Pause' : 'Play'}
          </button>
        </div>
        <div className="ml-auto flex items-center space-x-2 text-gray-300 text-sm">
          <span>Speed</span>
          <input
            type="range"
            min="300"
            max="2000"
            step="100"
            value={speedMs}
            onChange={(e) => setSpeedMs(parseInt(e.target.value))}
            className="w-40 accent-cyber-blue"
          />
        </div>
      </div>

      {/* Animated timeline bar */}
      <div className="mb-6">
        <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden border border-gray-700">
          <div className="h-2 bg-gradient-to-r from-cyber-blue via-cyber-yellow to-cyber-red transition-all duration-500" style={{ width: `${progressPercent}%` }}></div>
        </div>
        <div className="mt-2 flex justify-between text-xs text-gray-400">
          {steps.map((s, i) => (
            <span key={i} className={`${i <= step ? 'text-white' : ''}`}>{i + 1}</span>
          ))}
        </div>
      </div>

      {/* Diagram */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 relative overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {steps.map((s, i) => (
            <div key={i} className={`p-4 rounded-lg border transition-all duration-300 ${
              i <= step ? 'border-cyber-blue bg-gray-700 cyber-glow' : 'border-gray-700 bg-gray-800 opacity-70'
            }`}>
              <div className="text-3xl mb-2">{s.icon}</div>
              <h3 className="text-lg font-bold text-white mb-1">{i + 1}. {s.title}</h3>
              <p className="text-gray-300 text-sm">{s.desc}</p>
            </div>
          ))}
        </div>

        {/* Connector removed as requested */}

        {/* Code snippet for vulnerable vs safe */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-900 p-4 rounded border border-gray-700">
            <h4 className="font-bold text-white mb-2">Vulnerable</h4>
            {attack === 'SQLi' && (
              <pre className="text-xs overflow-x-auto"><code>{`// Bad: string concatenation
query = "SELECT * FROM users WHERE user='" + input + "' AND pass='" + pass + "'";`}</code></pre>
            )}
            {attack === 'XSS' && (
              <pre className="text-xs overflow-x-auto"><code>{`// Bad: unsanitized HTML
div.innerHTML = input;`}</code></pre>
            )}
            {attack === 'BruteForce' && (
              <pre className="text-xs overflow-x-auto"><code>{`// Bad: no threshold
allowLogin(user);`}</code></pre>
            )}
            {/* Thin progress bar under vulnerable code */}
            <div className="mt-2 relative">
              <div className="h-1 bg-gray-800 rounded"></div>
              <div className="h-1 bg-cyber-blue rounded absolute top-0 left-0 transition-all duration-500" style={{ width: `${codeProgress}%` }}></div>
            </div>
          </div>
          <div className="bg-gray-900 p-4 rounded border border-gray-700">
            <h4 className="font-bold text-white mb-2">Safe</h4>
            {attack === 'SQLi' && (
              <pre className="text-xs overflow-x-auto"><code>{`// Good: prepared statement
query = "SELECT * FROM users WHERE user=? AND pass=?";`}</code></pre>
            )}
            {attack === 'XSS' && (
              <pre className="text-xs overflow-x-auto"><code>{`// Good: encode output
div.textContent = input;`}</code></pre>
            )}
            {attack === 'BruteForce' && (
              <pre className="text-xs overflow-x-auto"><code>{`// Good: threshold & lockout
if (failedAttempts >= 3) lockAccount(user);`}</code></pre>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttackVisualizer;


