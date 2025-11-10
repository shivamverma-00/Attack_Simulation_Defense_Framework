import React, { useState, useEffect } from 'react';
import { api, handleApiError } from '../services/api';

const EducationModule = () => {
  const [activeTab, setActiveTab] = useState('tutorials');
  const [playground, setPlayground] = useState({ attack: 'SQLi', input: "' OR '1'='1", step: 0 });
  const [selectedTutorial, setSelectedTutorial] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizResults, setQuizResults] = useState(null);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [usedQuestionIds, setUsedQuestionIds] = useState([]);

  const tutorials = [
    {
      id: 'sqli',
      title: 'SQL Injection Attacks',
      icon: '💉',
      content: `
        <h2>What is SQL Injection?</h2>
        <p>SQL Injection is a code injection technique used to attack data-driven applications. It involves inserting malicious SQL statements into an entry field for execution.</p>
        
        <h3>How it works:</h3>
        <ul>
          <li>Attackers input malicious SQL code into web forms</li>
          <li>The application executes the malicious code</li>
          <li>This can lead to data theft, data corruption, or unauthorized access</li>
        </ul>
        
        <h3>Common SQL Injection Patterns:</h3>
        <pre><code>' OR '1'='1
'; DROP TABLE users; --
UNION SELECT * FROM passwords</code></pre>
        
        <h3>Request/Response Example:</h3>
        <pre><code>POST /login
username=' OR '1'='1&password=anything

-- Server-side concatenation (vulnerable)
SELECT * FROM users WHERE username = '\${username}' AND password='\${password}'

-- Effective query
SELECT * FROM users WHERE username = '' OR '1'='1' AND password='anything'
-- Returns first user → login bypass
        </code></pre>
        
        <h3>Prevention:</h3>
        <ul>
          <li>Use parameterized queries (prepared statements)</li>
          <li>Input validation and sanitization</li>
          <li>Least privilege database access</li>
          <li>Regular security testing</li>
        </ul>
      `
    },
    {
      id: 'xss',
      title: 'Cross-Site Scripting (XSS)',
      icon: '🌐',
      content: `
        <h2>What is XSS?</h2>
        <p>Cross-Site Scripting (XSS) is a security vulnerability that allows attackers to inject malicious scripts into web pages viewed by other users.</p>
        
        <h3>Types of XSS:</h3>
        <ul>
          <li><strong>Stored XSS:</strong> Malicious script is stored on the server</li>
          <li><strong>Reflected XSS:</strong> Malicious script is reflected off the web server</li>
          <li><strong>DOM-based XSS:</strong> Vulnerability exists in client-side code</li>
        </ul>
        
        <h3>Common XSS Payloads:</h3>
        <pre><code>&lt;script&gt;alert('XSS')&lt;/script&gt;
&lt;img src=x onerror=alert('XSS')&gt;
javascript:alert('XSS')</code></pre>

        <h3>How it exploits the browser:</h3>
        <ul>
          <li>Malicious script executes in the victim's browser context</li>
          <li>Can steal cookies, tokens, or perform actions as the user</li>
          <li>Impacts trust and can spread via stored content</li>
        </ul>
        
        <h3>Prevention:</h3>
        <ul>
          <li>Input validation and output encoding</li>
          <li>Content Security Policy (CSP)</li>
          <li>HTTP-only cookies</li>
          <li>Regular security audits</li>
        </ul>
      `
    },
    {
      id: 'bruteforce',
      title: 'Brute Force Attacks',
      icon: '🔨',
      content: `
        <h2>What is a Brute Force Attack?</h2>
        <p>A brute force attack is a trial-and-error method used to obtain information such as passwords or encryption keys.</p>
        
        <h3>How it works:</h3>
        <ul>
          <li>Attackers systematically try all possible combinations</li>
          <li>Automated tools speed up the process</li>
          <li>Can target passwords, encryption keys, or hidden web pages</li>
        </ul>

        <h3>Real-world example:</h3>
        <pre><code>POST /login  →  401
POST /login  →  401
...
POST /login  →  429 Too Many Requests (rate limited)
        </code></pre>
        
        <h3>Common Targets:</h3>
        <ul>
          <li>Login credentials</li>
          <li>Encrypted files</li>
          <li>API keys</li>
          <li>PIN codes</li>
        </ul>
        
        <h3>Prevention:</h3>
        <ul>
          <li>Account lockout policies</li>
          <li>Rate limiting</li>
          <li>CAPTCHA challenges</li>
          <li>Strong password policies</li>
          <li>Multi-factor authentication</li>
        </ul>
      `
    }
  ];

  // Fetch questions from backend
  const fetchQuestions = async (replace = false) => {
    setLoadingQuestions(true);
    try {
      const categories = ['SQLi', 'XSS', 'BruteForce'];
      const allQuestions = [];
      
      // Fetch 3 questions from each category
      for (const category of categories) {
        const excludeIds = replace ? [] : usedQuestionIds;
        const params = new URLSearchParams();
        params.append('category', category);
        params.append('count', '3');
        
        // Add exclude IDs as multiple query parameters
        if (excludeIds.length > 0) {
          excludeIds.forEach(id => params.append('exclude', id.toString()));
        }
        
        const response = await api.get(`/api/quiz/questions?${params.toString()}`);
        allQuestions.push(...response.data);
      }
      
      // Track used question IDs
      const newQuestionIds = allQuestions.map(q => q.id);
      if (replace) {
        setUsedQuestionIds(newQuestionIds);
        setQuizAnswers({});
        setQuizResults(null);
      } else {
        setUsedQuestionIds(prev => [...prev, ...newQuestionIds]);
      }
      
      setQuizQuestions(allQuestions);
    } catch (error) {
      const errorInfo = handleApiError(error);
      console.error('Failed to fetch questions:', errorInfo);
      alert(`Failed to load questions: ${errorInfo.message}`);
    } finally {
      setLoadingQuestions(false);
    }
  };

  // Load initial questions when quiz tab is opened
  useEffect(() => {
    if (activeTab === 'quizzes' && quizQuestions.length === 0) {
      fetchQuestions(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const quizzes = [
    {
      id: 'comprehensive-quiz',
      title: 'Comprehensive Cybersecurity Quiz',
      questions: quizQuestions
    }
  ];

  const handleQuizSubmit = (quizId) => {
    const quiz = quizzes.find(q => q.id === quizId);
    const answers = quizAnswers[quizId] || {};
    
    let correct = 0;
    const results = quiz.questions.map(question => {
      const userAnswer = answers[question.id];
      const isCorrect = userAnswer === question.correct;
      if (isCorrect) correct++;
      
      return {
        question: question.question,
        userAnswer: question.options[userAnswer] || 'Not answered',
        correctAnswer: question.options[question.correct],
        isCorrect
      };
    });
    
    setQuizResults({
      quizId,
      correct,
      total: quiz.questions.length,
      percentage: Math.round((correct / quiz.questions.length) * 100),
      results
    });
  };

  const resetQuiz = (quizId) => {
    setQuizAnswers(prev => ({
      ...prev,
      [quizId]: {}
    }));
    setQuizResults(null);
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Education Module</h1>
        <p className="text-gray-400">Learn about cybersecurity attacks and defenses</p>
      </div>

      {/* Tab Navigation */}
      <div className="mb-8">
        <div className="flex space-x-1 bg-gray-800 p-1 rounded-lg w-fit">
          <button
            onClick={() => setActiveTab('tutorials')}
            className={`px-6 py-3 rounded-md font-medium transition-colors duration-200 ${
              activeTab === 'tutorials'
                ? 'bg-cyber-blue text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            📚 Tutorials
          </button>
          <button
            onClick={() => setActiveTab('quizzes')}
            className={`px-6 py-3 rounded-md font-medium transition-colors duration-200 ${
              activeTab === 'quizzes'
                ? 'bg-cyber-blue text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            🧠 Quizzes
          </button>
          <button
            onClick={() => setActiveTab('playground')}
            className={`px-6 py-3 rounded-md font-medium transition-colors duration-200 ${
              activeTab === 'playground'
                ? 'bg-cyber-blue text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            🧪 Playground
          </button>
        </div>
      </div>

      {/* Tutorials Tab */}
      {activeTab === 'tutorials' && (
        <div>
          {!selectedTutorial ? (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Available Tutorials</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {tutorials.map((tutorial) => (
                  <div
                    key={tutorial.id}
                    onClick={() => setSelectedTutorial(tutorial)}
                    className="bg-gray-800 p-6 rounded-lg border border-gray-700 cursor-pointer hover:border-cyber-blue transition-colors duration-200"
                  >
                    <div className="text-4xl mb-4">{tutorial.icon}</div>
                    <h3 className="text-xl font-bold text-white mb-2">{tutorial.title}</h3>
                    <p className="text-gray-400 text-sm">
                      Learn about {tutorial.title.toLowerCase()} attacks and how to defend against them.
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center mb-6">
                <button
                  onClick={() => setSelectedTutorial(null)}
                  className="mr-4 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200"
                >
                  ← Back to Tutorials
                </button>
                <div className="text-3xl mr-3">{selectedTutorial.icon}</div>
                <h2 className="text-2xl font-bold text-white">{selectedTutorial.title}</h2>
              </div>
              
              <div className="bg-gray-800 p-8 rounded-lg border border-gray-700">
                <div 
                  className="prose prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: selectedTutorial.content }}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Quizzes Tab */}
      {activeTab === 'quizzes' && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Interactive Quizzes</h2>
            <div className="flex items-center space-x-4">
              <span className="text-gray-400 text-sm">
                {quizQuestions.length} Questions (3 per category)
              </span>
              <button
                onClick={() => fetchQuestions(true)}
                disabled={loadingQuestions}
                className="px-4 py-2 bg-cyber-blue text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loadingQuestions ? 'Loading...' : '🔄 New Questions'}
              </button>
            </div>
          </div>
          
          {loadingQuestions && quizQuestions.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400">Loading questions...</div>
            </div>
          ) : (
            <div className="space-y-8">
              {quizzes.map((quiz) => (
                <div key={quiz.id} className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-white">{quiz.title}</h3>
                    <span className="text-gray-400 text-sm">
                      {quiz.questions.length} Questions
                    </span>
                  </div>
                
                <div className="space-y-4">
                  {quiz.questions.map((question, qIndex) => (
                    <div key={question.id} className="bg-gray-700 p-4 rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="font-bold text-white flex-1">
                          {qIndex + 1}. {question.question}
                        </h4>
                        <span className="ml-2 px-2 py-1 bg-gray-600 text-gray-300 text-xs rounded">
                          {question.category}
                        </span>
                      </div>
                      <div className="space-y-2">
                        {question.options.map((option, index) => (
                          <label key={index} className="flex items-center cursor-pointer hover:bg-gray-600 p-2 rounded transition-colors">
                            <input
                              type="radio"
                              name={`${quiz.id}-${question.id}`}
                              value={index}
                              checked={quizAnswers[quiz.id]?.[question.id] === index}
                              onChange={(e) => setQuizAnswers(prev => ({
                                ...prev,
                                [quiz.id]: {
                                  ...prev[quiz.id],
                                  [question.id]: parseInt(e.target.value)
                                }
                              }))}
                              className="mr-3"
                            />
                            <span className="text-gray-300">{String.fromCharCode(65 + index)}. {option}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 flex space-x-4">
                  <button
                    onClick={() => handleQuizSubmit(quiz.id)}
                    className="px-6 py-2 bg-cyber-blue text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    Submit Quiz
                  </button>
                  <button
                    onClick={() => resetQuiz(quiz.id)}
                    className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors duration-200"
                  >
                    Reset Answers
                  </button>
                </div>
                
                {/* Quiz Results */}
                {quizResults && quizResults.quizId === quiz.id && (
                  <div className="mt-6 p-4 bg-gray-700 rounded-lg">
                    <h4 className="font-bold text-white mb-3">
                      Quiz Results: {quizResults.percentage}% ({quizResults.correct}/{quizResults.total})
                    </h4>
                    <div className="space-y-2">
                      {quizResults.results.map((result, index) => (
                        <div key={index} className="text-sm">
                          <p className="text-gray-300">
                            <strong>Q{index + 1}:</strong> {result.question}
                          </p>
                          <p className={`ml-4 ${result.isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                            Your answer: {result.userAnswer} {result.isCorrect ? '✓' : '✗'}
                          </p>
                          {!result.isCorrect && (
                            <p className="ml-4 text-green-400">
                              Correct answer: {result.correctAnswer}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
            </div>
          )}
        </div>
      )}
      {activeTab === 'playground' && (
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Attack Playground</h2>
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-gray-300 text-sm font-bold mb-2">Attack Type</label>
                <select
                  value={playground.attack}
                  onChange={(e) => setPlayground(p => ({ ...p, attack: e.target.value }))}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
                >
                  <option value="SQLi">SQL Injection</option>
                  <option value="XSS">Cross-Site Scripting</option>
                  <option value="BruteForce">Brute Force</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-gray-300 text-sm font-bold mb-2">Input / Payload</label>
                <input
                  value={playground.input}
                  onChange={(e) => setPlayground(p => ({ ...p, input: e.target.value }))}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
                  placeholder="Enter payload"
                />
              </div>
            </div>

            <div className="flex space-x-3 mb-4">
              <button
                onClick={() => setPlayground(p => ({ ...p, step: 0 }))}
                className="px-4 py-2 bg-cyber-blue text-white rounded-lg hover:bg-blue-700"
              >
                Restart
              </button>
              <button
                onClick={() => setPlayground(p => ({ ...p, step: Math.max(0, p.step - 1) }))}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500"
              >
                ← Previous
              </button>
              <button
                onClick={() => setPlayground(p => ({ ...p, step: Math.min(3, p.step + 1) }))}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500"
              >
                Next →
              </button>
            </div>

            <div className="space-y-4">
              <div className={`p-4 rounded bg-gray-700 ${playground.step >= 0 ? 'opacity-100' : 'opacity-50'}`}>
                <h4 className="font-bold text-white mb-2">1) User Input</h4>
                <p className="text-gray-300 text-sm">Payload entered: <span className="font-mono bg-gray-800 px-2 py-1 rounded">{playground.input}</span></p>
              </div>
              <div className={`p-4 rounded bg-gray-700 ${playground.step >= 1 ? 'opacity-100' : 'opacity-50'}`}>
                <h4 className="font-bold text-white mb-2">2) Application Handling</h4>
                {playground.attack === 'SQLi' && (
                  <pre className="text-xs bg-gray-800 p-3 rounded overflow-x-auto"><code>{`// Vulnerable concatenation
query = "SELECT * FROM users WHERE user='" + input + "' AND pass='" + pass + "'";

// Safe (prepared statement)
query = "SELECT * FROM users WHERE user=? AND pass=?";`}</code></pre>
                )}
                {playground.attack === 'XSS' && (
                  <pre className="text-xs bg-gray-800 p-3 rounded overflow-x-auto"><code>{`// Vulnerable
div.innerHTML = input;

// Safe
div.textContent = input;`}</code></pre>
                )}
                {playground.attack === 'BruteForce' && (
                  <pre className="text-xs bg-gray-800 p-3 rounded overflow-x-auto"><code>{`// Detection threshold example
if (failedAttempts >= 3) lockAccount(user);`}</code></pre>
                )}
              </div>
              <div className={`p-4 rounded bg-gray-700 ${playground.step >= 2 ? 'opacity-100' : 'opacity-50'}`}>
                <h4 className="font-bold text-white mb-2">3) System Response</h4>
                <p className="text-gray-300 text-sm">
                  {playground.attack === 'SQLi' ? 'Tautology may bypass authentication if unprotected.' : playground.attack === 'XSS' ? 'Script executes in victim browser if not encoded.' : 'Further attempts blocked by rate limit/lockout.'}
                </p>
              </div>
              <div className={`p-4 rounded bg-gray-700 ${playground.step >= 3 ? 'opacity-100' : 'opacity-50'}`}>
                <h4 className="font-bold text-white mb-2">4) Defense Outcome</h4>
                <p className="text-gray-300 text-sm">
                  {playground.attack === 'SQLi' ? 'Prepared statements treat input as data, not SQL.' : playground.attack === 'XSS' ? 'Output encoding and CSP block script execution.' : 'Lockout and rate limiting slow/stop guessing.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EducationModule;
