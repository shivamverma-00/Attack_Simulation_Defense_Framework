import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import LoadingSpinner from './components/LoadingSpinner';
import AttackSimulation from './pages/AttackSimulation';
import DefenseModule from './pages/DefenseModule';
import EducationModule from './pages/EducationModule';
import MonitoringLogs from './pages/MonitoringLogs';
import AlertsReports from './pages/AlertsReports';
import Dashboard from './pages/Dashboard';
import AttackVisualizer from './pages/AttackVisualizer';
import SqlInjectionExplainer from './pages/SqlInjectionExplainer';
import XssExplainer from './pages/XssExplainer';
import BruteForceExplainer from './pages/BruteForceExplainer';
import SummaryExplainer from './pages/SummaryExplainer';

const AnimatedRoute = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsVisible(false);
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <div className={`transition-all duration-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}`}>
      {children}
    </div>
  );
};

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    // Simulate app initialization
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  if (isLoading) {
    return (
      <div className="h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="cyber-glow mb-8">
            <h1 className="text-6xl font-bold text-cyber-blue mb-4 bounce-in">
              AegisCore
            </h1>
            <p className="text-gray-400 text-xl">Attack & Defense Framework</p>
          </div>
          <LoadingSpinner message="Initializing Security Framework..." size="large" />
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="flex h-screen bg-gray-900 text-white fade-in">
        {/* Mobile Header */}
        <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-gray-800 border-b border-gray-700 px-4 py-3 flex items-center justify-between">
          <button
            onClick={toggleSidebar}
            className="text-white hover:text-cyber-blue transition-colors duration-300"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-lg font-bold text-cyber-blue">CyberSim</h1>
          <div className="w-6"></div> {/* Spacer for centering */}
        </div>

        {/* Sidebar */}
        <div className={`fixed inset-y-0 left-0 z-40 lg:relative lg:translate-x-0 transition-transform duration-300 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}>
          <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
        </div>

        {/* Backdrop for mobile */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
            onClick={closeSidebar}
          ></div>
        )}

        <main className="flex-1 overflow-auto lg:ml-0">
          <div className="pt-16 lg:pt-0"> {/* Add top padding on mobile for header */}
            <Routes>
              <Route path="/" element={
                <AnimatedRoute>
                  <Dashboard />
                </AnimatedRoute>
              } />
              <Route path="/attack" element={
                <AnimatedRoute>
                  <AttackSimulation />
                </AnimatedRoute>
              } />
              <Route path="/defense" element={
                <AnimatedRoute>
                  <DefenseModule />
                </AnimatedRoute>
              } />
              <Route path="/education" element={
                <AnimatedRoute>
                  <EducationModule />
                </AnimatedRoute>
              } />
              <Route path="/visualizer" element={
                <AnimatedRoute>
                  <AttackVisualizer />
                </AnimatedRoute>
              } />
              <Route path="/monitoring" element={
                <AnimatedRoute>
                  <MonitoringLogs />
                </AnimatedRoute>
              } />
              <Route path="/reports" element={
                <AnimatedRoute>
                  <AlertsReports />
                </AnimatedRoute>
              } />
              <Route path="/sql-injection" element={
                <AnimatedRoute>
                  <SqlInjectionExplainer />
                </AnimatedRoute>
              } />
              <Route path="/xss" element={
                <AnimatedRoute>
                  <XssExplainer />
                </AnimatedRoute>
              } />
              <Route path="/brute-force" element={
                <AnimatedRoute>
                  <BruteForceExplainer />
                </AnimatedRoute>
              } />
              <Route path="/summary" element={
                <AnimatedRoute>
                  <SummaryExplainer />
                </AnimatedRoute>
              } />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;


