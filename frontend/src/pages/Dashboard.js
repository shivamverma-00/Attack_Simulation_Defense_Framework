import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import axios from 'axios';

const Dashboard = () => {
  const [stats, setStats] = useState({
    total_attacks: 0,
    successful_attacks: 0,
    total_defenses: 0,
    successful_defenses: 0,
    attack_types: {}
  });
  const [loading, setLoading] = useState(true);
  const [animatedStats, setAnimatedStats] = useState({
    total_attacks: 0,
    successful_attacks: 0,
    total_defenses: 0,
    successful_defenses: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    // Animate numbers
    const animateNumbers = () => {
      const duration = 2000;
      const steps = 60;
      const stepDuration = duration / steps;
      
      let currentStep = 0;
      const interval = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;
        
        setAnimatedStats({
          total_attacks: Math.floor(stats.total_attacks * progress),
          successful_attacks: Math.floor(stats.successful_attacks * progress),
          total_defenses: Math.floor(stats.total_defenses * progress),
          successful_defenses: Math.floor(stats.successful_defenses * progress)
        });
        
        if (currentStep >= steps) {
          clearInterval(interval);
          setAnimatedStats(stats);
        }
      }, stepDuration);
    };

    if (!loading) {
      animateNumbers();
    }
  }, [stats, loading]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/stats');
      setStats(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching stats:', error);
      setLoading(false);
    }
  };

  const attackTypeData = Object.entries(stats.attack_types).map(([type, count]) => ({
    name: type,
    value: count
  }));

  const COLORS = ['#dc2626', '#2563eb', '#16a34a'];

  const successRate = stats.total_attacks > 0 ? 
    ((stats.successful_attacks / stats.total_attacks) * 100).toFixed(1) : 0;
  
  const defenseRate = stats.total_defenses > 0 ? 
    ((stats.successful_defenses / stats.total_defenses) * 100).toFixed(1) : 0;

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="loading-spinner w-12 h-12 border-4 border-cyber-blue border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-400">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 fade-in">
      <div className="mb-8 fade-in">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2 slide-in-right">Dashboard</h1>
        <p className="text-sm sm:text-base text-gray-400 slide-in-right">Cybersecurity Simulation Overview</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 card-hover fade-in-delay-1 cyber-red-glow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Attacks</p>
              <p className="text-3xl font-bold text-cyber-red">{animatedStats.total_attacks}</p>
            </div>
            <div className="text-4xl float">🔴</div>
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 card-hover fade-in-delay-2 cyber-red-glow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Successful Attacks</p>
              <p className="text-3xl font-bold text-cyber-red">{animatedStats.successful_attacks}</p>
            </div>
            <div className="text-4xl float">⚠️</div>
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 card-hover fade-in-delay-3 cyber-glow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Defenses</p>
              <p className="text-3xl font-bold text-cyber-blue">{animatedStats.total_defenses}</p>
            </div>
            <div className="text-4xl float">🔵</div>
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 card-hover fade-in-delay-4 cyber-green-glow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Successful Defenses</p>
              <p className="text-3xl font-bold text-cyber-green">{animatedStats.successful_defenses}</p>
            </div>
            <div className="text-4xl float">🛡️</div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Attack Types Pie Chart */}
        <div className="bg-gray-800 p-4 sm:p-6 rounded-lg border border-gray-700 card-hover fade-in-delay-1">
          <h3 className="text-lg sm:text-xl font-bold text-white mb-4 slide-in-left">Attack Types Distribution</h3>
          {attackTypeData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={attackTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  animationBegin={0}
                  animationDuration={1000}
                >
                  {attackTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-400">
              <div className="text-center">
                <div className="loading-dots text-4xl mb-4">📊</div>
                <p>No attack data available</p>
              </div>
            </div>
          )}
        </div>

        {/* Success Rates */}
        <div className="bg-gray-800 p-4 sm:p-6 rounded-lg border border-gray-700 card-hover fade-in-delay-2">
          <h3 className="text-lg sm:text-xl font-bold text-white mb-4 slide-in-right">Success Rates</h3>
          <div className="space-y-6">
            <div className="fade-in-delay-3">
              <div className="flex justify-between mb-2">
                <span className="text-gray-400">Attack Success Rate</span>
                <span className="text-cyber-red font-bold">{successRate}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-cyber-red h-2 rounded-full progress-bar cyber-red-glow"
                  style={{ width: `${successRate}%` }}
                ></div>
              </div>
            </div>
            
            <div className="fade-in-delay-4">
              <div className="flex justify-between mb-2">
                <span className="text-gray-400">Defense Success Rate</span>
                <span className="text-cyber-green font-bold">{defenseRate}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-cyber-green h-2 rounded-full progress-bar cyber-green-glow"
                  style={{ width: `${defenseRate}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 fade-in-delay-4">
        <h3 className="text-lg sm:text-xl font-bold text-white mb-4 slide-in-left">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <button 
            onClick={() => window.location.href = '/attack'}
            className="bg-cyber-red hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg btn-press attack-blast"
          >
            <span className="flex items-center justify-center">
              <span className="mr-2">🔴</span>
              Launch Attack Simulation
            </span>
          </button>
          <button 
            onClick={() => window.location.href = '/defense'}
            className="bg-cyber-blue hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg btn-press defense-shield"
          >
            <span className="flex items-center justify-center">
              <span className="mr-2">🔵</span>
              Test Defense Module
            </span>
          </button>
          <button 
            onClick={() => window.location.href = '/reports'}
            className="bg-cyber-green hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg btn-press success-check"
          >
            <span className="flex items-center justify-center">
              <span className="mr-2">📋</span>
              Generate Report
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;


