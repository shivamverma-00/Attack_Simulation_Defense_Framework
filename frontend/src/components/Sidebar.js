import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const [isOnline, setIsOnline] = useState(true);
  const [pulseStatus, setPulseStatus] = useState(true);

  const menuItems = [
    { path: '/', label: 'Dashboard', icon: '📊', delay: 0 },
    { path: '/attack', label: 'Attack Simulation', icon: '🔴', delay: 100 },
    { path: '/defense', label: 'Defense Module', icon: '🔵', delay: 200 },
    { path: '/education', label: 'Education', icon: '📚', delay: 300 },
    { path: '/visualizer', label: 'Attack Visualizer', icon: '🎞️', delay: 350 },
    { path: '/sql-injection', label: 'SQL Injection', icon: '🧩', delay: 360 },
    { path: '/xss', label: 'XSS', icon: '🌐', delay: 370 },
    { path: '/brute-force', label: 'Brute Force', icon: '🔐', delay: 380 },
    { path: '/summary', label: 'Summary & Detection', icon: '🧭', delay: 390 },
    { path: '/monitoring', label: 'Monitoring & Logs', icon: '📡', delay: 400 },
    { path: '/reports', label: 'Alerts & Reports', icon: '📋', delay: 500 },
  ];

  useEffect(() => {
    // Simulate connection status
    const interval = setInterval(() => {
      setPulseStatus(prev => !prev);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-64 bg-gray-800 shadow-lg slide-in-left h-full">
      <div className="p-6 fade-in relative">
        {/* Close button for mobile */}
        <button
          onClick={onClose}
          className="lg:hidden absolute top-4 right-4 text-gray-400 hover:text-white transition-colors duration-300"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h1 className="text-2xl font-bold text-cyber-blue cyber-glow">
          AegisCore
        </h1>
        <p className="text-gray-400 text-sm mt-2 fade-in-delay-1">
          Attack & Defense Framework
        </p>
      </div>
      
      <nav className="mt-8">
        {menuItems.map((item, index) => (
          <Link
            key={item.path}
            to={item.path}
            onClick={onClose}
            className={`flex items-center px-6 py-3 text-gray-300 hover:bg-gray-700 hover:text-white transition-all duration-300 hover:translate-x-2 hover:shadow-lg smooth-transition ${
              location.pathname === item.path
                ? 'bg-cyber-blue text-white border-r-4 border-cyber-blue cyber-glow'
                : ''
            }`}
            style={{ animationDelay: `${item.delay}ms` }}
          >
            <span className={`text-xl mr-3 transition-transform duration-300 hover:scale-110 ${
              location.pathname === item.path ? 'bounce-in' : ''
            }`}>
              {item.icon}
            </span>
            <span className="font-medium">{item.label}</span>
            {location.pathname === item.path && (
              <div className="ml-auto">
                <div className="w-2 h-2 bg-white rounded-full pulse-fast"></div>
              </div>
            )}
          </Link>
        ))}
      </nav>
      
      <div className="absolute bottom-0 w-64 p-6 border-t border-gray-700 fade-in-delay-4">
        <div className="flex items-center">
          <div className={`w-3 h-3 rounded-full mr-2 transition-all duration-300 ${
            isOnline ? 'bg-green-500' : 'bg-red-500'
          } ${pulseStatus ? 'pulse-fast' : ''}`}></div>
          <span className="text-sm text-gray-400">
            System {isOnline ? 'Online' : 'Offline'}
          </span>
        </div>
        <div className="mt-2 text-xs text-gray-500">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;


