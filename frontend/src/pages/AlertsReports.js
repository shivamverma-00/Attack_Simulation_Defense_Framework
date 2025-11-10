import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import axios from 'axios';

const AlertsReports = () => {
  const [alerts, setAlerts] = useState([]);
  const [stats, setStats] = useState({
    total_attacks: 0,
    successful_attacks: 0,
    total_defenses: 0,
    successful_defenses: 0,
    attack_types: {}
  });
  const [reportFormat, setReportFormat] = useState('pdf');
  const [timeFilter, setTimeFilter] = useState('all');
  const [generatingReport, setGeneratingReport] = useState(false);

  useEffect(() => {
    fetchStats();
    generateAlerts();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const generateAlerts = () => {
    // Simulate real-time alerts based on stats
    const newAlerts = [];
    
    if (stats.successful_attacks > 0) {
      newAlerts.push({
        id: 1,
        type: 'critical',
        title: 'Active Attack Detected',
        message: `${stats.successful_attacks} successful attack(s) detected in the system`,
        timestamp: new Date().toISOString(),
        icon: '🚨'
      });
    }

    if (stats.total_attacks > 5) {
      newAlerts.push({
        id: 2,
        type: 'warning',
        title: 'High Attack Volume',
        message: `Total of ${stats.total_attacks} attacks detected. Consider reviewing security measures.`,
        timestamp: new Date().toISOString(),
        icon: '⚠️'
      });
    }

    if (stats.successful_defenses > 0) {
      newAlerts.push({
        id: 3,
        type: 'success',
        title: 'Defense Successful',
        message: `${stats.successful_defenses} defense(s) successfully blocked attacks`,
        timestamp: new Date().toISOString(),
        icon: '✅'
      });
    }

    setAlerts(newAlerts);
  };

  const generateReport = async () => {
    setGeneratingReport(true);
    try {
      const response = await axios.post('http://localhost:5000/api/reports', {
        format: reportFormat,
        time_filter: timeFilter
      }, {
        responseType: 'blob'
      });

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      
      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
      link.setAttribute('download', `cyber_sim_report_${timestamp}.${reportFormat}`);
      
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating report:', error);
      alert('Failed to generate report. Please try again.');
    } finally {
      setGeneratingReport(false);
    }
  };

  const dismissAlert = (alertId) => {
    setAlerts(alerts.filter(alert => alert.id !== alertId));
  };

  const getAlertColor = (type) => {
    switch (type) {
      case 'critical': return 'border-red-500 bg-red-900/20';
      case 'warning': return 'border-yellow-500 bg-yellow-900/20';
      case 'success': return 'border-green-500 bg-green-900/20';
      default: return 'border-gray-500 bg-gray-900/20';
    }
  };

  const getAlertTextColor = (type) => {
    switch (type) {
      case 'critical': return 'text-red-400';
      case 'warning': return 'text-yellow-400';
      case 'success': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  // Prepare chart data
  const attackTypeData = Object.entries(stats.attack_types).map(([type, count]) => ({
    name: type,
    value: count
  }));

  const COLORS = ['#DC2626', '#2563EB', '#16A34A', '#EAB308'];

  const frequencyData = [
    { name: 'Last 24h', attacks: Math.floor(stats.total_attacks * 0.3) },
    { name: 'Last 7d', attacks: Math.floor(stats.total_attacks * 0.7) },
    { name: 'All Time', attacks: stats.total_attacks }
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Alerts & Reports</h1>
        <p className="text-gray-400">Security alerts and comprehensive reporting</p>
      </div>

      {/* Live Alerts */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-4">Live Security Alerts</h2>
        <div className="space-y-4">
          {alerts.length > 0 ? (
            alerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-4 rounded-lg border-2 ${getAlertColor(alert.type)}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start">
                    <span className="text-2xl mr-3">{alert.icon}</span>
                    <div>
                      <h3 className={`font-bold ${getAlertTextColor(alert.type)}`}>
                        {alert.title}
                      </h3>
                      <p className="text-gray-300 mt-1">{alert.message}</p>
                      <p className="text-gray-500 text-sm mt-2">
                        {new Date(alert.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => dismissAlert(alert.id)}
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 text-center">
              <div className="text-4xl mb-2">🟢</div>
              <p className="text-gray-400">No active security alerts</p>
            </div>
          )}
        </div>
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Attack Frequency Chart */}
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h3 className="text-xl font-bold text-white mb-4">Attack Frequency Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={frequencyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F9FAFB'
                }} 
              />
              <Bar dataKey="attacks" fill="#DC2626" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Attack Types Pie Chart */}
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h3 className="text-xl font-bold text-white mb-4">Attack Types Distribution</h3>
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
                >
                  {attackTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#F9FAFB'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-400">
              No attack data available
            </div>
          )}
        </div>
      </div>

      {/* Success/Failure Ratio */}
      <div className="mb-8">
        <h3 className="text-xl font-bold text-white mb-4">Success vs Failure Ratio</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h4 className="text-lg font-bold text-cyber-red mb-3">Attack Success Rate</h4>
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400">Successful Attacks</span>
              <span className="text-cyber-red font-bold">
                {stats.total_attacks > 0 ? Math.round((stats.successful_attacks / stats.total_attacks) * 100) : 0}%
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3">
              <div 
                className="bg-cyber-red h-3 rounded-full transition-all duration-500"
                style={{ 
                  width: `${stats.total_attacks > 0 ? (stats.successful_attacks / stats.total_attacks) * 100 : 0}%` 
                }}
              ></div>
            </div>
            <p className="text-gray-400 text-sm mt-2">
              {stats.successful_attacks} of {stats.total_attacks} attacks succeeded
            </p>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h4 className="text-lg font-bold text-cyber-green mb-3">Defense Success Rate</h4>
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400">Successful Defenses</span>
              <span className="text-cyber-green font-bold">
                {stats.total_defenses > 0 ? Math.round((stats.successful_defenses / stats.total_defenses) * 100) : 0}%
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3">
              <div 
                className="bg-cyber-green h-3 rounded-full transition-all duration-500"
                style={{ 
                  width: `${stats.total_defenses > 0 ? (stats.successful_defenses / stats.total_defenses) * 100 : 0}%` 
                }}
              ></div>
            </div>
            <p className="text-gray-400 text-sm mt-2">
              {stats.successful_defenses} of {stats.total_defenses} defenses succeeded
            </p>
          </div>
        </div>
      </div>

      {/* Report Generation */}
      <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
        <h3 className="text-xl font-bold text-white mb-4">Generate Security Report</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-gray-300 text-sm font-bold mb-2">
              Report Format
            </label>
            <select
              value={reportFormat}
              onChange={(e) => setReportFormat(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyber-blue"
            >
              <option value="pdf">PDF Report</option>
              <option value="csv">CSV Export</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-bold mb-2">
              Time Range
            </label>
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyber-blue"
            >
              <option value="all">All Time</option>
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={generateReport}
              disabled={generatingReport}
              className={`w-full px-6 py-2 rounded-lg font-bold transition-colors duration-200 ${
                generatingReport
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-cyber-green hover:bg-green-700 text-white'
              }`}
            >
              {generatingReport ? 'Generating...' : '📋 Generate Report'}
            </button>
          </div>
        </div>

        <div className="text-sm text-gray-400">
          <p><strong>PDF Report includes:</strong> Attack summaries, defense results, charts, and recommendations</p>
          <p><strong>CSV Export includes:</strong> Raw data for further analysis in spreadsheet applications</p>
        </div>
      </div>
    </div>
  );
};

export default AlertsReports;


