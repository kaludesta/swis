import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { Brain, TrendingUp, AlertTriangle, Lightbulb, Activity, Target, Clock, Zap } from 'lucide-react';
import { API_URL } from '../../config';

interface InsightsPageProps {
  onLogout: () => void;
}

interface Recommendation {
  type: 'critical' | 'warning' | 'success' | 'info';
  category: string;
  icon: string;
  message: string;
  action: string;
  impact: string;
}

interface Insights {
  productivity: {
    score: number;
    level: string;
    message: string;
    confidence: {
      Low: number;
      Medium: number;
      High: number;
    };
  };
  recommendations: Recommendation[];
  burnoutRisk: {
    score: number;
    level: string;
    message: string;
    color: string;
    factors: string[];
  };
  studyPattern: {
    totalSessions: number;
    totalHours: string;
    avgSessionMinutes: number;
    mostStudiedSubject: string;
  } | null;
  metrics: {
    avgStudyHours: string;
    totalScreenTime: string;
    upcomingDeadlines: number;
    studySessions: number;
    estimatedSleep: string;
    focusScore: string;
  };
}

export default function InsightsPage({ onLogout }: InsightsPageProps) {
  const [insights, setInsights] = useState<Insights | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchInsights();
  }, []);

  const fetchInsights = async () => {
    try {
      setLoading(true);
      const userId = localStorage.getItem('userId');
      
      const response = await fetch(`${API_URL}/ml/insights/${userId}`, {
        method: 'POST'
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch insights');
      }
      
      const data = await response.json();
      setInsights(data);
      setError('');
    } catch (err) {
      setError('Failed to load insights. Make sure you have some activity data.');
      console.error('Error fetching insights:', err);
    } finally {
      setLoading(false);
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'critical': return 'bg-red-50 border-red-200 text-red-800';
      case 'warning': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'success': return 'bg-green-50 border-green-200 text-green-800';
      case 'info': return 'bg-blue-50 border-blue-200 text-blue-800';
      default: return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getProductivityColor = (level: string) => {
    switch (level) {
      case 'High': return 'text-green-600 bg-green-50';
      case 'Medium': return 'text-yellow-600 bg-yellow-50';
      case 'Low': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getBurnoutColor = (color: string) => {
    switch (color) {
      case 'red': return 'bg-red-500';
      case 'orange': return 'bg-orange-500';
      case 'green': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onLogout={onLogout} />
      
      <div className="max-w-[1440px] mx-auto px-6 py-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="flex items-center justify-center w-12 h-12 bg-purple-600 rounded-xl">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">ML Insights</h1>
            <p className="text-sm text-gray-600">AI-powered analysis of your study habits</p>
          </div>
        </div>

        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            <p className="mt-4 text-gray-600">Analyzing your data...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
            {error}
          </div>
        )}

        {!loading && !error && insights && (
          <div className="space-y-6">
            {/* Productivity Score */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="w-5 h-5 text-purple-600" />
                <h2 className="text-lg font-semibold text-gray-900">Productivity Score</h2>
              </div>
              
              <div className="flex items-center gap-6">
                <div className="flex-shrink-0">
                  <div className="relative w-32 h-32">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="#e5e7eb"
                        strokeWidth="12"
                        fill="none"
                      />
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke={insights.productivity.level === 'High' ? '#10b981' : insights.productivity.level === 'Medium' ? '#f59e0b' : '#ef4444'}
                        strokeWidth="12"
                        fill="none"
                        strokeDasharray={`${(insights.productivity.score / 100) * 351.86} 351.86`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-gray-900">{insights.productivity.score}</div>
                        <div className="text-xs text-gray-500">/ 100</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex-1">
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mb-2 ${getProductivityColor(insights.productivity.level)}`}>
                    {insights.productivity.level} Productivity
                  </div>
                  <p className="text-gray-700 mb-3">{insights.productivity.message}</p>
                  
                  <div className="space-y-2">
                    <div className="text-xs text-gray-500 mb-1">Confidence Levels:</div>
                    {Object.entries(insights.productivity.confidence).map(([level, confidence]) => (
                      <div key={level} className="flex items-center gap-2">
                        <span className="text-xs text-gray-600 w-16">{level}:</span>
                        <div className="flex-1 bg-gray-100 rounded-full h-2">
                          <div 
                            className="bg-purple-600 h-2 rounded-full transition-all"
                            style={{ width: `${confidence}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-600 w-8">{confidence}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Burnout Risk */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
                <h2 className="text-lg font-semibold text-gray-900">Burnout Risk Assessment</h2>
              </div>
              
              <div className="flex items-center gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex-1 bg-gray-200 rounded-full h-4">
                      <div 
                        className={`h-4 rounded-full transition-all ${getBurnoutColor(insights.burnoutRisk.color)}`}
                        style={{ width: `${insights.burnoutRisk.score}%` }}
                      />
                    </div>
                    <span className="text-2xl font-bold text-gray-900">{insights.burnoutRisk.score}%</span>
                  </div>
                  
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mb-2 ${
                    insights.burnoutRisk.color === 'red' ? 'bg-red-50 text-red-800' :
                    insights.burnoutRisk.color === 'orange' ? 'bg-orange-50 text-orange-800' :
                    'bg-green-50 text-green-800'
                  }`}>
                    {insights.burnoutRisk.level} Risk
                  </div>
                  
                  <p className="text-gray-700 mb-3">{insights.burnoutRisk.message}</p>
                  
                  {insights.burnoutRisk.factors.length > 0 && (
                    <div>
                      <div className="text-xs text-gray-500 mb-2">Risk Factors:</div>
                      <div className="flex flex-wrap gap-2">
                        {insights.burnoutRisk.factors.map((factor, index) => (
                          <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                            {factor}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-gray-600">Avg Study Hours</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">{insights.metrics.avgStudyHours}h</div>
              </div>
              
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-gray-600">Screen Time</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">{insights.metrics.totalScreenTime}h</div>
              </div>
              
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-4 h-4 text-purple-600" />
                  <span className="text-sm text-gray-600">Focus Score</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">{insights.metrics.focusScore}</div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <Lightbulb className="w-5 h-5 text-yellow-600" />
                <h2 className="text-lg font-semibold text-gray-900">Personalized Recommendations</h2>
              </div>
              
              <div className="space-y-3">
                {insights.recommendations.map((rec, index) => (
                  <div key={index} className={`border rounded-lg p-4 ${getTypeColor(rec.type)}`}>
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{rec.icon}</span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{rec.category}</span>
                          <span className="text-xs px-2 py-0.5 bg-white/50 rounded">
                            {rec.impact} impact
                          </span>
                        </div>
                        <p className="text-sm mb-2">{rec.message}</p>
                        <div className="flex items-center gap-2 text-sm">
                          <Zap className="w-3 h-3" />
                          <span className="font-medium">Action:</span>
                          <span>{rec.action}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Study Pattern */}
            {insights.studyPattern && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Activity className="w-5 h-5 text-blue-600" />
                  <h2 className="text-lg font-semibold text-gray-900">Study Pattern Analysis</h2>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Total Sessions</div>
                    <div className="text-2xl font-bold text-gray-900">{insights.studyPattern.totalSessions}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Total Hours</div>
                    <div className="text-2xl font-bold text-gray-900">{insights.studyPattern.totalHours}h</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Avg Session</div>
                    <div className="text-2xl font-bold text-gray-900">{insights.studyPattern.avgSessionMinutes}m</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Top Subject</div>
                    <div className="text-lg font-bold text-gray-900 truncate">{insights.studyPattern.mostStudiedSubject}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
