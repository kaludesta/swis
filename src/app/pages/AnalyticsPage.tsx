import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Clock, Globe } from 'lucide-react';

interface AnalyticsPageProps {
  onLogout: () => void;
}

interface TrackingData {
  id: number;
  domain: string;
  time_spent: number;
  visit_date: string;
}

interface TopSite {
  domain: string;
  total_time: number;
  visit_count: number;
}

const API_URL = 'http://localhost:3000/api';

const COLORS = ['#2563eb', '#7c3aed', '#db2777', '#ea580c', '#ca8a04', '#16a34a', '#0891b2', '#4f46e5'];

export default function AnalyticsPage({ onLogout }: AnalyticsPageProps) {
  const [trackingData, setTrackingData] = useState<TrackingData[]>([]);
  const [topSites, setTopSites] = useState<TopSite[]>([]);
  const [loading, setLoading] = useState(true);
  const [timePeriod, setTimePeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (userId) {
      fetchAnalytics();
    }
  }, [userId, timePeriod]);

  const getDateRange = () => {
    const today = new Date();
    let startDate = new Date();
    
    if (timePeriod === 'daily') {
      startDate = today;
    } else if (timePeriod === 'weekly') {
      startDate.setDate(today.getDate() - 7);
    } else if (timePeriod === 'monthly') {
      startDate.setDate(today.getDate() - 30);
    }
    
    return {
      startDate: startDate.toISOString().split('T')[0],
      endDate: today.toISOString().split('T')[0]
    };
  };

  const fetchAnalytics = async () => {
    try {
      const { startDate, endDate } = getDateRange();
      
      // Fetch tracking data with date range
      const trackingResponse = await fetch(
        `${API_URL}/tracking/${userId}?startDate=${startDate}&endDate=${endDate}`
      );
      if (trackingResponse.ok) {
        const tracking = await trackingResponse.json();
        setTrackingData(tracking);
      }

      // Fetch top sites with date range
      const topResponse = await fetch(
        `${API_URL}/tracking/${userId}/top?limit=10&startDate=${startDate}&endDate=${endDate}`
      );
      if (topResponse.ok) {
        const top = await topResponse.json();
        setTopSites(top);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate total time
  const totalSeconds = trackingData.reduce((sum, item) => sum + item.time_spent, 0);
  const totalHours = Math.floor(totalSeconds / 3600);
  const totalMinutes = Math.floor((totalSeconds % 3600) / 60);

  // Format time for display
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  // Prepare data for charts
  const topSitesChart = topSites.slice(0, 8).map(site => ({
    name: site.domain.length > 20 ? site.domain.substring(0, 20) + '...' : site.domain,
    value: Math.floor(site.total_time / 60), // Convert to minutes
    fullName: site.domain
  }));

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar onLogout={onLogout} />
        <div className="flex items-center justify-center h-96">
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onLogout={onLogout} />
      
      <div className="max-w-[1440px] mx-auto px-6 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl mb-2">Analytics</h1>
            <p className="text-gray-600">Insights into your browsing patterns and time tracking</p>
          </div>
          
          {/* Time Period Filter */}
          <div className="flex items-center gap-2 bg-white rounded-lg border border-gray-200 p-1">
            <button
              onClick={() => setTimePeriod('daily')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                timePeriod === 'daily'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Today
            </button>
            <button
              onClick={() => setTimePeriod('weekly')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                timePeriod === 'weekly'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Last 7 Days
            </button>
            <button
              onClick={() => setTimePeriod('monthly')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                timePeriod === 'monthly'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Last 30 Days
            </button>
          </div>
        </div>

        {trackingData.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-12 text-center">
            <Globe className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600 mb-2">No tracking data yet</p>
            <p className="text-sm text-gray-500">Install the browser extension to start tracking your time</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-3 gap-6">
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <h3 className="text-sm text-gray-600">Total Time Tracked</h3>
                </div>
                <p className="text-3xl font-semibold">{totalHours}h {totalMinutes}m</p>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Globe className="w-5 h-5 text-purple-600" />
                  <h3 className="text-sm text-gray-600">Websites Visited</h3>
                </div>
                <p className="text-3xl font-semibold">{topSites.length}</p>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                <div className="flex items-center gap-3 mb-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  <h3 className="text-sm text-gray-600">Total Sessions</h3>
                </div>
                <p className="text-3xl font-semibold">{trackingData.length}</p>
              </div>
            </div>

            {/* Top Sites Bar Chart */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl">Top Websites by Time Spent</h2>
              </div>
              {topSitesChart.length > 0 ? (
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={topSitesChart}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" stroke="#6b7280" angle={-45} textAnchor="end" height={100} />
                    <YAxis stroke="#6b7280" label={{ value: 'Minutes', angle: -90, position: 'insideLeft' }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                      }}
                      formatter={(value: number, name: string, props: any) => [
                        `${value} minutes`,
                        props.payload.fullName
                      ]}
                    />
                    <Bar dataKey="value" fill="#2563eb" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-center text-gray-500 py-12">No data available</p>
              )}
            </div>

            {/* Top Sites Table */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-6">
                <Globe className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl">Detailed Breakdown</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm text-gray-700">Rank</th>
                      <th className="px-6 py-3 text-left text-sm text-gray-700">Website</th>
                      <th className="px-6 py-3 text-left text-sm text-gray-700">Time Spent</th>
                      <th className="px-6 py-3 text-left text-sm text-gray-700">Visits</th>
                      <th className="px-6 py-3 text-left text-sm text-gray-700">Avg per Visit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {topSites.map((site, index) => (
                      <tr key={site.domain} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-700">#{index + 1}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: COLORS[index % COLORS.length] }}
                            />
                            <span className="text-sm font-medium">{site.domain}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {formatTime(site.total_time)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {site.visit_count}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {formatTime(Math.floor(site.total_time / site.visit_count))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-sm font-medium text-blue-900 mb-2">About Time Tracking</h3>
              <p className="text-sm text-blue-800">
                Data is collected from the browser extension and updated every 30 seconds while you browse. 
                Only active browsing time is tracked - the timer pauses when you switch away from your browser.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
