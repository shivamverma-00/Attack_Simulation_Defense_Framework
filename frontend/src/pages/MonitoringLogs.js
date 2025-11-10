import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import axios from 'axios';
import io from 'socket.io-client';

const MonitoringLogs = () => {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [attackTypeFilter, setAttackTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [socket, setSocket] = useState(null);
  const [stats, setStats] = useState({
    total_attacks: 0,
    successful_attacks: 0,
    total_defenses: 0,
    successful_defenses: 0,
    attack_types: {}
  });

  useEffect(() => {
    fetchLogs();
    fetchStats();
    setupWebSocket();
    
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    filterLogs();
  }, [logs, attackTypeFilter, statusFilter]);

  const setupWebSocket = () => {
    const newSocket = io('http://localhost:5000');
    
    newSocket.on('connect', () => {
      console.log('Connected to WebSocket');
    });

    newSocket.on('attack_event', (data) => {
      console.log('Attack event received:', data);
      fetchLogs(); // Refresh logs when new attack occurs
      fetchStats(); // Refresh stats
    });

    newSocket.on('defense_event', (data) => {
      console.log('Defense event received:', data);
      fetchLogs(); // Refresh logs when new defense occurs
      fetchStats(); // Refresh stats
    });

    setSocket(newSocket);
  };

  const fetchLogs = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/logs');
      setLogs(response.data);
    } catch (error) {
      console.error('Error fetching logs:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const filterLogs = () => {
    let filtered = [...logs];

    if (attackTypeFilter !== 'all') {
      filtered = filtered.filter(log => 
        log.event.toLowerCase().includes(attackTypeFilter.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(log => 
        log.details.toLowerCase().includes(statusFilter.toLowerCase())
      );
    }

    setFilteredLogs(filtered);
  };

  const getLogIcon = (event) => {
    if (event.includes('Attack')) return '🔴';
    if (event.includes('Defense')) return '🛡️';
    return '📝';
  };

  const getLogColor = (event) => {
    if (event.includes('Attack')) return 'text-cyber-red';
    if (event.includes('Defense')) return 'text-cyber-blue';
    return 'text-gray-400';
  };

  // Prepare chart data
  const attackTypeData = Object.entries(stats.attack_types).map(([type, count]) => ({
    name: type,
    attacks: count
  }));

  const timeSeriesData = logs.slice(0, 20).map((log, index) => ({
    time: new Date(log.timestamp).toLocaleTimeString(),
    events: 1,
    type: log.event.includes('Attack') ? 'Attack' : 'Defense'
  }));

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Monitoring & Logs</h1>
        <p className="text-gray-400">Real-time security event monitoring and analysis</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Events</p>
              <p className="text-3xl font-bold text-white">{logs.length}</p>
            </div>
            <div className="text-4xl">📊</div>
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Active Attacks</p>
              <p className="text-3xl font-bold text-cyber-red">{stats.successful_attacks}</p>
            </div>
            <div className="text-4xl">🔴</div>
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Defenses Applied</p>
              <p className="text-3xl font-bold text-cyber-blue">{stats.total_defenses}</p>
            </div>
            <div className="text-4xl">🛡️</div>
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Success Rate</p>
              <p className="text-3xl font-bold text-cyber-green">
                {stats.total_defenses > 0 ? Math.round((stats.successful_defenses / stats.total_defenses) * 100) : 0}%
              </p>
            </div>
            <div className="text-4xl">✅</div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Attack Types Chart */}
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h3 className="text-xl font-bold text-white mb-4">Attack Types Distribution</h3>
          {attackTypeData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={attackTypeData}>
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
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-400">
              No attack data available
            </div>
          )}
        </div>

        {/* Time Series Chart */}
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h3 className="text-xl font-bold text-white mb-4">Event Timeline</h3>
          {timeSeriesData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={timeSeriesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="time" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#F9FAFB'
                  }} 
                />
                <Line type="monotone" dataKey="events" stroke="#2563EB" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-400">
              No timeline data available
            </div>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-4">Event Logs</h2>
        <div className="flex space-x-4 mb-4">
          <select
            value={attackTypeFilter}
            onChange={(e) => setAttackTypeFilter(e.target.value)}
            className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyber-blue"
          >
            <option value="all">All Attack Types</option>
            <option value="sqli">SQL Injection</option>
            <option value="xss">XSS</option>
            <option value="bruteforce">Brute Force</option>
          </select>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyber-blue"
          >
            <option value="all">All Status</option>
            <option value="success">Success</option>
            <option value="failed">Failed</option>
            <option value="blocked">Blocked</option>
          </select>
          
          <button
            onClick={fetchLogs}
            className="px-4 py-2 bg-cyber-blue text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
        {filteredLogs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Event
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Timestamp
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredLogs.map((log, index) => (
                  <tr key={index} className="hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-2xl mr-3">{getLogIcon(log.event)}</span>
                        <span className={`font-medium ${getLogColor(log.event)}`}>
                          {log.event}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-300 max-w-md">
                        {log.details}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        log.details.toLowerCase().includes('success') 
                          ? 'bg-green-900 text-green-300'
                          : log.details.toLowerCase().includes('failed') || log.details.toLowerCase().includes('blocked')
                          ? 'bg-red-900 text-red-300'
                          : 'bg-gray-900 text-gray-300'
                      }`}>
                        {log.details.toLowerCase().includes('success') ? 'Success' :
                         log.details.toLowerCase().includes('failed') ? 'Failed' :
                         log.details.toLowerCase().includes('blocked') ? 'Blocked' : 'Info'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-gray-400">
            No logs found matching the current filters.
          </div>
        )}
      </div>

      {/* Real-time Status */}
      <div className="mt-8 flex items-center justify-between">
        <div className="flex items-center">
          <div className={`w-3 h-3 rounded-full mr-2 ${socket ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className="text-gray-400">
            {socket ? 'Connected to real-time updates' : 'Disconnected from real-time updates'}
          </span>
        </div>
        <div className="text-sm text-gray-400">
          Showing {filteredLogs.length} of {logs.length} events
        </div>
      </div>
    </div>
  );
};

export default MonitoringLogs;


