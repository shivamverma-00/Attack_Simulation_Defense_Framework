import React, { useState, useEffect } from 'react';
import { api, handleApiError } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import Notification from '../components/Notification';

const AttackSimulation = () => {
  const [selectedAttack, setSelectedAttack] = useState(null);
  const [payload, setPayload] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [attackProgress, setAttackProgress] = useState(0);
  const [isExecuting, setIsExecuting] = useState(false);

  const attackTypes = [
    {
      type: 'SQLi',
      name: 'SQL Injection',
      description: 'Simulate SQL injection attacks against database queries',
      icon: '💉',
      color: 'cyber-red',
      examplePayload: "' OR '1'='1"
    },
    {
      type: 'XSS',
      name: 'Cross-Site Scripting',
      description: 'Simulate XSS attacks with malicious scripts',
      icon: '🌐',
      color: 'cyber-yellow',
      examplePayload: '<script>alert("XSS")</script>'
    },
    {
      type: 'BruteForce',
      name: 'Brute Force',
      description: 'Simulate brute force password attacks',
      icon: '🔨',
      color: 'cyber-red',
      examplePayload: 'Multiple login attempts'
    }
  ];

  const addNotification = (type, message) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  };

  const handleAttackSelect = (attack) => {
    setSelectedAttack(attack);
    setPayload(attack.examplePayload);
    setResult(null);
    addNotification('info', `${attack.name} attack selected`);
  };

  const executeAttack = async () => {
    if (!selectedAttack || !payload) return;

    setIsExecuting(true);
    setLoading(true);
    setAttackProgress(0);

    // Simulate attack progress
    const progressInterval = setInterval(() => {
      setAttackProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + Math.random() * 20;
      });
    }, 200);

    try {
      const response = await api.post('/api/attack', {
        attack_type: selectedAttack.type,
        payload: payload,
        attempts: selectedAttack.type === 'BruteForce' ? 3 : 1
      });

      setAttackProgress(100);
      setResult(response.data);
      
      if (response.data.result === 'success') {
        addNotification('error', 'Attack successful! System compromised.');
      } else {
        addNotification('success', 'Attack blocked by defense mechanisms.');
      }
    } catch (error) {
      console.error('Attack failed:', error);
      const info = handleApiError(error);
      setResult({
        result: 'error',
        reason: info.message
      });
      if (info.status === 429) {
        addNotification('warning', 'You are sending requests too fast. Please wait and try again.');
      } else {
        addNotification('error', 'Attack execution failed');
      }
    } finally {
      setLoading(false);
      setIsExecuting(false);
      clearInterval(progressInterval);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 fade-in">
      {/* Notifications */}
      {notifications.map(notification => (
        <Notification
          key={notification.id}
          type={notification.type}
          message={notification.message}
          onClose={() => setNotifications(prev => prev.filter(n => n.id !== notification.id))}
        />
      ))}

      <div className="mb-8 fade-in">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2 slide-in-right">Attack Simulation</h1>
        <p className="text-sm sm:text-base text-gray-400 slide-in-right">Red Team - Simulate various cyber attacks</p>
      </div>

      {/* Attack Type Selection */}
      <div className="mb-8 fade-in-delay-1">
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 slide-in-left">Select Attack Type</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {attackTypes.map((attack, index) => (
            <div
              key={attack.type}
              onClick={() => handleAttackSelect(attack)}
              className={`p-6 rounded-lg border-2 cursor-pointer transition-all duration-300 card-hover hover:scale-105 ${
                selectedAttack?.type === attack.type
                  ? `border-${attack.color} bg-${attack.color}/10 cyber-${attack.color}-glow bounce-in`
                  : 'border-gray-700 bg-gray-800 hover:border-gray-600 hover:shadow-lg'
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="text-4xl mb-3 float">{attack.icon}</div>
              <h3 className="text-xl font-bold text-white mb-2">{attack.name}</h3>
              <p className="text-gray-400 text-sm">{attack.description}</p>
              {selectedAttack?.type === attack.type && (
                <div className="mt-3 flex items-center">
                  <div className="w-2 h-2 bg-cyber-red rounded-full pulse-fast mr-2"></div>
                  <span className="text-sm text-cyber-red font-bold">Selected</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Attack Configuration */}
      {selectedAttack && (
        <div className="mb-8 fade-in-delay-2">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 slide-in-left">Configure Attack</h2>
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 card-hover">
            <div className="mb-4">
              <label className="block text-gray-300 text-sm font-bold mb-2">
                Payload / Input
              </label>
              <textarea
                value={payload}
                onChange={(e) => setPayload(e.target.value)}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cyber-blue transition-all duration-300 focus:shadow-lg"
                rows={3}
                placeholder={`Enter ${selectedAttack.name} payload...`}
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-300 text-sm font-bold mb-2">
                Attack Details
              </label>
              <div className="bg-gray-700 p-4 rounded-lg fade-in-delay-3">
                <p className="text-gray-300">
                  <strong>Type:</strong> {selectedAttack.name}
                </p>
                <p className="text-gray-300">
                  <strong>Description:</strong> {selectedAttack.description}
                </p>
                <p className="text-gray-300">
                  <strong>Example:</strong> {selectedAttack.examplePayload}
                </p>
                <div className="mt-3 text-gray-300 text-sm">
                  <strong>How it works:</strong>
                  <ul className="list-disc ml-6 mt-1 space-y-1">
                    {selectedAttack.type === 'SQLi' && (
                      <>
                        <li>User input is concatenated into a SQL query</li>
                        <li>Malicious payload alters query logic (e.g., tautology)</li>
                        <li>Database returns unintended results (auth bypass/data leak)</li>
                      </>
                    )}
                    {selectedAttack.type === 'XSS' && (
                      <>
                        <li>Payload is reflected or stored in a page</li>
                        <li>Browser executes injected script in victim context</li>
                        <li>Can steal cookies/tokens or perform actions</li>
                      </>
                    )}
                    {selectedAttack.type === 'BruteForce' && (
                      <>
                        <li>Repeated login attempts with varying passwords</li>
                        <li>Detection after threshold (rate limit/lockout)</li>
                        <li>Goal is to guess valid credentials</li>
                      </>
                    )}
                  </ul>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            {isExecuting && (
              <div className="mb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400">Attack Progress</span>
                  <span className="text-cyber-red font-bold">{Math.round(attackProgress)}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-cyber-red h-2 rounded-full progress-bar cyber-red-glow"
                    style={{ width: `${attackProgress}%` }}
                  ></div>
                </div>
              </div>
            )}

            <button
              onClick={executeAttack}
              disabled={loading || !payload}
              className={`px-6 py-3 rounded-lg font-bold transition-all duration-300 hover:scale-105 btn-press ${
                loading || !payload
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : `bg-${selectedAttack.color} hover:bg-${selectedAttack.color}/80 text-white hover:shadow-lg`
              } ${isExecuting ? 'attack-blast' : ''}`}
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="loading-spinner w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                  Executing Attack...
                </div>
              ) : (
                <span className="flex items-center">
                  <span className="mr-2">🚀</span>
                  Execute {selectedAttack.name} Attack
                </span>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Attack Result */}
      {result && (
        <div className="mb-8 fade-in-delay-3">
          <h2 className="text-2xl font-bold text-white mb-4 slide-in-left">Attack Result</h2>
          <div className={`p-6 rounded-lg border-2 card-hover ${
            result.result === 'success' 
              ? 'border-cyber-red bg-red-900/20 cyber-red-glow attack-blast' 
              : result.result === 'failure'
              ? 'border-cyber-green bg-green-900/20 cyber-green-glow defense-shield'
              : 'border-gray-600 bg-gray-800'
          }`}>
            <div className="flex items-center mb-4">
              <div className="text-3xl mr-3 bounce-in">
                {result.result === 'success' ? '🔴' : result.result === 'failure' ? '🛡️' : '❌'}
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">
                  Attack {result.result === 'success' ? 'Successful' : result.result === 'failure' ? 'Blocked' : 'Failed'}
                </h3>
                <p className="text-gray-400">Attack ID: {result.attack_id}</p>
              </div>
            </div>
            
            <div className="space-y-3 fade-in-delay-4">
              <div className="flex items-center">
                <strong className="text-gray-300">Attack Type:</strong>
                <span className="ml-2 text-white font-mono bg-gray-700 px-2 py-1 rounded">{result.attack_type}</span>
              </div>
              <div className="flex items-center">
                <strong className="text-gray-300">Payload:</strong>
                <span className="ml-2 text-white font-mono text-sm bg-gray-700 px-2 py-1 rounded">
                  {result.payload}
                </span>
              </div>
              <div className="flex items-center">
                <strong className="text-gray-300">Result:</strong>
                <span className={`ml-2 font-bold ${
                  result.result === 'success' ? 'text-cyber-red' : 
                  result.result === 'failure' ? 'text-cyber-green' : 'text-gray-400'
                }`}>
                  {result.result}
                </span>
              </div>
              <div className="flex items-center">
                <strong className="text-gray-300">Reason:</strong>
                <span className="ml-2 text-white">{result.reason}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Attack Steps */}
      {selectedAttack && (
        <div className="fade-in-delay-4">
          <h2 className="text-2xl font-bold text-white mb-4 slide-in-left">Attack Process</h2>
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 card-hover">
            <div className="space-y-4">
              <div className="flex items-start fade-in-delay-1">
                <div className="bg-cyber-blue text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 pulse-slow">
                  1
                </div>
                <div>
                  <h4 className="font-bold text-white">Payload Preparation</h4>
                  <p className="text-gray-400">Craft malicious input based on attack type</p>
                </div>
              </div>
              
              <div className="flex items-start fade-in-delay-2">
                <div className="bg-cyber-blue text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 pulse-slow">
                  2
                </div>
                <div>
                  <h4 className="font-bold text-white">Attack Execution</h4>
                  <p className="text-gray-400">Send payload to target system</p>
                </div>
              </div>
              
              <div className="flex items-start fade-in-delay-3">
                <div className="bg-cyber-blue text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 pulse-slow">
                  3
                </div>
                <div>
                  <h4 className="font-bold text-white">Result Analysis</h4>
                  <p className="text-gray-400">Analyze system response and determine success</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttackSimulation;


