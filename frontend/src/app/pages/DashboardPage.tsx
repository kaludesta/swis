import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { Calendar, Clock, BookOpen, CheckSquare } from 'lucide-react';
import { API_URL } from '../../config';

interface DashboardPageProps {
  onLogout: () => void;
}

interface Assignment {
  id: number;
  title: string;
  description: string;
  due_date: string;
  priority: string;
  status: string;
}

interface StudySession {
  id: number;
  subject: string;
  duration: number;
  created_at: string;
}

export default function DashboardPage({ onLogout }: DashboardPageProps) {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [studySessions, setStudySessions] = useState<StudySession[]>([]);
  const [loading, setLoading] = useState(true);

  const userId = localStorage.getItem('userId');
  const userName = localStorage.getItem('userName') || 'Student';

  useEffect(() => {
    if (userId) {
      fetchDashboardData();
    }
  }, [userId]);

  const fetchDashboardData = async () => {
    try {
      // Fetch assignments
      const assignmentsRes = await fetch(`${API_URL}/assignments/${userId}`);
      if (assignmentsRes.ok) {
        const assignmentsData = await assignmentsRes.json();
        setAssignments(assignmentsData);
      }

      // Fetch study sessions
      const sessionsRes = await fetch(`${API_URL}/study-sessions/${userId}`);
      if (sessionsRes.ok) {
        const sessionsData = await sessionsRes.json();
        setStudySessions(sessionsData);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics
  const upcomingAssignments = assignments
    .filter(a => a.status !== 'completed')
    .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())
    .slice(0, 5);

  const totalStudyTime = studySessions.reduce((sum, session) => sum + session.duration, 0);
  const recentSessions = studySessions.slice(0, 5);

  const getDaysUntil = (dateString: string) => {
    const today = new Date();
    const dueDate = new Date(dateString);
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700';
      case 'low':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar onLogout={onLogout} />
        <div className="flex items-center justify-center h-96">
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onLogout={onLogout} />
      
      <div className="max-w-[1440px] mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl mb-2">Welcome back, {userName}!</h1>
          <p className="text-gray-600">Here's your academic overview</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-2">
              <CheckSquare className="w-5 h-5 text-blue-600" />
              <h3 className="text-sm text-gray-600">Total Assignments</h3>
            </div>
            <p className="text-3xl font-semibold">{assignments.length}</p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="w-5 h-5 text-orange-600" />
              <h3 className="text-sm text-gray-600">Pending</h3>
            </div>
            <p className="text-3xl font-semibold">
              {assignments.filter(a => a.status === 'pending' || a.status === 'in_progress').length}
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-2">
              <BookOpen className="w-5 h-5 text-purple-600" />
              <h3 className="text-sm text-gray-600">Study Sessions</h3>
            </div>
            <p className="text-3xl font-semibold">{studySessions.length}</p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-5 h-5 text-green-600" />
              <h3 className="text-sm text-gray-600">Total Study Time</h3>
            </div>
            <p className="text-3xl font-semibold">{Math.floor(totalStudyTime / 60)}h {totalStudyTime % 60}m</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Upcoming Assignments */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-6">
              <Calendar className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl">Upcoming Assignments</h2>
            </div>
            
            {upcomingAssignments.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <CheckSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No pending assignments</p>
                <p className="text-sm mt-2">Great job staying on top of your work!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingAssignments.map((assignment) => {
                  const daysLeft = getDaysUntil(assignment.due_date);
                  return (
                    <div
                      key={assignment.id}
                      className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-sm font-medium pr-2">{assignment.title}</h3>
                        <span className={`px-2 py-1 text-xs rounded whitespace-nowrap ${getPriorityColor(assignment.priority)}`}>
                          {assignment.priority}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mb-2">{assignment.description}</p>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-gray-500">
                          {new Date(assignment.due_date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </p>
                        <p className={`text-xs font-medium ${daysLeft <= 3 ? 'text-red-600' : 'text-blue-600'}`}>
                          {daysLeft > 0 ? `${daysLeft} days left` : daysLeft === 0 ? 'Due today!' : 'Overdue'}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Recent Study Sessions */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-6">
              <BookOpen className="w-5 h-5 text-purple-600" />
              <h2 className="text-xl">Recent Study Sessions</h2>
            </div>
            
            {recentSessions.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No study sessions yet</p>
                <p className="text-sm mt-2">Start logging your study time!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentSessions.map((session) => (
                  <div
                    key={session.id}
                    className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-sm font-medium">{session.subject}</h3>
                      <span className="text-sm text-purple-600 font-medium whitespace-nowrap">
                        {session.duration} min
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      {new Date(session.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-blue-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-3 gap-4">
            <a
              href="/assignments"
              className="p-4 bg-white rounded-lg border border-blue-200 hover:border-blue-400 transition-colors text-center"
            >
              <CheckSquare className="w-6 h-6 mx-auto mb-2 text-blue-600" />
              <p className="text-sm font-medium text-gray-900">Add Assignment</p>
            </a>
            <a
              href="/study-sessions"
              className="p-4 bg-white rounded-lg border border-blue-200 hover:border-blue-400 transition-colors text-center"
            >
              <BookOpen className="w-6 h-6 mx-auto mb-2 text-blue-600" />
              <p className="text-sm font-medium text-gray-900">Log Study Session</p>
            </a>
            <a
              href="/analytics"
              className="p-4 bg-white rounded-lg border border-blue-200 hover:border-blue-400 transition-colors text-center"
            >
              <Clock className="w-6 h-6 mx-auto mb-2 text-blue-600" />
              <p className="text-sm font-medium text-gray-900">View Analytics</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
