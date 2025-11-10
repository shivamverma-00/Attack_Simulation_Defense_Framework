import React, { useState, useEffect } from 'react';
import LoadingSpinner from '../components/LoadingSpinner';
import Notification from '../components/Notification';
import { api, handleApiError } from '../services/api';

const DefenseModule = () => {
  const [attacks, setAttacks] = useState([]);
  const [selectedAttack, setSelectedAttack] = useState(null);
  const [defenseResult, setDefenseResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [listLoading, setListLoading] = useState(false);

  useEffect(() => {
    fetchRecentAttacks();
  }, []);

  const [error, setError] = useState(null);

  const fetchRecentAttacks = async () => {
    try {
      setListLoading(true);
      const response = await api.get('/api/attacks?limit=50');
      setAttacks(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching attacks:', error);
      const info = handleApiError(error);
      setError(info.message);
    } finally {
      setListLoading(false);
    }
  };

  const applyDefense = async (attackId) => {
    setLoading(true);
    try {
      const response = await api.post('/api/defense', {
        attack_id: attackId
      });
      setDefenseResult(response.data);
      // refresh list to reflect any changes
      fetchRecentAttacks();
    } catch (error) {
      console.error('Defense failed:', error);
      const info = handleApiError(error);
      setDefenseResult({
        result: 'error',
        reason: info.message
      });
      if (info.status === 429) {
        // eslint-disable-next-line no-alert
        alert('Rate limit reached. Please wait a moment before retrying.');
      }
    } finally {
      setLoading(false);
    }
  };

  const defenseStrategies = {
    'SQLi': {
      name: 'SQL Injection Defense',
      icon: '🛡️',
      color: 'cyber-blue',
      techniques: [
        'Parameterized Queries',
        'Input Validation',
        'SQL Injection Filters',
        'Least Privilege Access'
      ],
      description: 'Protect against SQL injection by using prepared statements and input sanitization.'
    },
    'XSS': {
      name: 'XSS Defense',
      icon: '🔒',
      color: 'cyber-green',
      techniques: [
        'HTML Encoding',
        'Content Security Policy (CSP)',
        'Input Sanitization',
        'Output Encoding'
      ],
      description: 'Prevent cross-site scripting through proper encoding and CSP headers.'
    },
    'BruteForce': {
      name: 'Brute Force Defense',
      icon: '🔐',
      color: 'cyber-yellow',
      techniques: [
        'Account Lockout',
        'Rate Limiting',
        'CAPTCHA',
        'Multi-Factor Authentication'
      ],
      description: 'Mitigate brute force attacks with lockout policies and rate limiting.'
    }
  };

  const getAttackType = (attackType) => attackType || 'Unknown';

  return (
    <div className="p-8">
      {/* Notifications placeholder - reuse Notification if needed in future */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Defense Module</h1>
        <p className="text-gray-400">Blue Team - Apply defense strategies against attacks</p>
      </div>

      {/* Defense Strategies Overview */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-4">Defense Strategies</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(defenseStrategies).map(([type, strategy]) => (
            <div
              key={type}
              className={`p-6 rounded-lg border border-${strategy.color} bg-${strategy.color}/10`}
            >
              <div className="text-4xl mb-3">{strategy.icon}</div>
              <h3 className="text-xl font-bold text-white mb-2">{strategy.name}</h3>
              <p className="text-gray-400 text-sm mb-4">{strategy.description}</p>
              <div className="space-y-2">
                <h4 className="font-bold text-gray-300">Techniques:</h4>
                <ul className="text-sm text-gray-400 space-y-1">
                  {strategy.techniques.map((technique, index) => (
                    <li key={index}>• {technique}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Attacks */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-4">Recent Attacks</h2>
        <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
          {(listLoading || loading) && <LoadingSpinner message="Loading recent attacks..." />}
          {!loading && error && (
            <div className="p-8 text-center text-red-400">{error}</div>
          )}
          {!loading && !listLoading && !error && attacks.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Attack Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Payload
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Timestamp
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {attacks.slice(0, 10).map((attack) => {
                    const attackType = getAttackType(attack.attack_type);
                    const strategy = defenseStrategies[attackType];
                    return (
                      <tr key={attack.id} className="hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className="text-2xl mr-2">{strategy?.icon || '❓'}</span>
                            <span className="text-white font-medium">{attackType}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-300 max-w-xs truncate">
                            {attack.payload}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                          {new Date(attack.timestamp).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => {
                              setSelectedAttack(attack);
                              applyDefense(attack.id);
                            }}
                            disabled={loading}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                              loading
                                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                : 'bg-cyber-blue hover:bg-blue-700 text-white'
                            }`}
                          >
                            {loading ? 'Applying...' : 'Apply Defense'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center text-gray-400">
              No recent attacks found. Execute some attacks first to see them here.
            </div>
          )}
        </div>
      </div>

      {/* Defense Result */}
      {defenseResult && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Defense Result</h2>
          <div className={`p-6 rounded-lg border-2 ${
            defenseResult.result === 'success' 
              ? 'border-cyber-green bg-green-900/20 cyber-green-glow' 
              : defenseResult.result === 'failed'
              ? 'border-cyber-red bg-red-900/20 cyber-red-glow'
              : 'border-gray-600 bg-gray-800'
          }`}>
            <div className="flex items-center mb-4">
              <div className="text-3xl mr-3">
                {defenseResult.result === 'success' ? '🛡️' : defenseResult.result === 'failed' ? '🔴' : '❌'}
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">
                  Defense {defenseResult.result === 'success' ? 'Successful' : defenseResult.result === 'failed' ? 'Failed' : 'Error'}
                </h3>
                <p className="text-gray-400">Defense ID: {defenseResult.defense_id}</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <strong className="text-gray-300">Attack ID:</strong>
                <span className="ml-2 text-white">{defenseResult.attack_id}</span>
              </div>
              <div>
                <strong className="text-gray-300">Result:</strong>
                <span className={`ml-2 font-bold ${
                  defenseResult.result === 'success' ? 'text-cyber-green' : 
                  defenseResult.result === 'failed' ? 'text-cyber-red' : 'text-gray-400'
                }`}>
                  {defenseResult.result}
                </span>
              </div>
              <div>
                <strong className="text-gray-300">Reason:</strong>
                <span className="ml-2 text-white">{defenseResult.reason}</span>
              </div>
            </div>
            {selectedAttack && (
              <div className="mt-6 bg-gray-700 p-4 rounded">
                {(() => {
                  const t = getAttackType(selectedAttack.attack_type);
                  if (t === 'SQLi') {
                    return (
                      <div>
                        <h4 className="font-bold text-white mb-2">How the defense works (SQLi)</h4>
                        <p className="text-gray-300 text-sm mb-2">Parameterized queries ensure user input cannot alter SQL logic.</p>
                        <pre className="text-xs bg-gray-800 p-3 rounded overflow-x-auto"><code>{`// Vulnerable
sql = "SELECT * FROM users WHERE username='" + user + "' AND pass='" + pass + "'";

// Safe
sql = "SELECT * FROM users WHERE username=? AND pass=?";
db.execute(sql, [user, pass]);`}</code></pre>
                      </div>
                    );
                  }
                  if (t === 'XSS') {
                    return (
                      <div>
                        <h4 className="font-bold text-white mb-2">How the defense works (XSS)</h4>
                        <p className="text-gray-300 text-sm mb-2">Output encoding and CSP prevent scripts from executing.</p>
                        <pre className="text-xs bg-gray-800 p-3 rounded overflow-x-auto"><code>{`// Vulnerable
div.innerHTML = userInput;

// Safe
div.textContent = userInput; // encode on output`}</code></pre>
                      </div>
                    );
                  }
                  if (t === 'BruteForce') {
                    return (
                      <div>
                        <h4 className="font-bold text-white mb-2">How the defense works (Brute Force)</h4>
                        <p className="text-gray-300 text-sm mb-2">Rate limiting and lockout policies stop repeated guesses.</p>
                        <pre className="text-xs bg-gray-800 p-3 rounded overflow-x-auto"><code>{`// After 3 failed attempts → temporary lockout
if (failedAttempts >= 3) lockAccount(user);`}</code></pre>
                      </div>
                    );
                  }
                  return null;
                })()}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Defense Flow Chart */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-4">Defense Process Flow</h2>
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex flex-col items-center text-center">
              <div className="bg-cyber-red text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl mb-2">
                🔴
              </div>
              <h4 className="font-bold text-white">Attack Detected</h4>
              <p className="text-gray-400 text-sm">System identifies malicious activity</p>
            </div>
            
            <div className="text-2xl text-gray-400">→</div>
            
            <div className="flex flex-col items-center text-center">
              <div className="bg-cyber-yellow text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl mb-2">
                ⚡
              </div>
              <h4 className="font-bold text-white">Analysis</h4>
              <p className="text-gray-400 text-sm">Determine attack type and severity</p>
            </div>
            
            <div className="text-2xl text-gray-400">→</div>
            
            <div className="flex flex-col items-center text-center">
              <div className="bg-cyber-blue text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl mb-2">
                🛡️
              </div>
              <h4 className="font-bold text-white">Defense Applied</h4>
              <p className="text-gray-400 text-sm">Execute appropriate countermeasures</p>
            </div>
            
            <div className="text-2xl text-gray-400">→</div>
            
            <div className="flex flex-col items-center text-center">
              <div className="bg-cyber-green text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl mb-2">
                ✅
              </div>
              <h4 className="font-bold text-white">Result</h4>
              <p className="text-gray-400 text-sm">Attack blocked or mitigated</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DefenseModule;


