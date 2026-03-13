import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { Plus, Clock } from 'lucide-react';
import { API_URL } from '../../config';

interface StudySessionPageProps {
  onLogout: () => void;
}

interface StudySession {
  id: number;
  user_id?: number;
  subject: string;
  duration: number;
  notes: string;
  created_at?: string;
}

export default function StudySessionPage({ onLogout }: StudySessionPageProps) {
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    subject: '',
    duration: '',
    notes: '',
  });

  // Get user ID from localStorage
  const userId = localStorage.getItem('userId');

  // Load sessions from backend
  useEffect(() => {
    if (userId) {
      fetchSessions();
    }
  }, [userId]);

  const fetchSessions = async () => {
    try {
      const response = await fetch(`${API_URL}/study-sessions/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setSessions(data);
      }
    } catch (error) {
      console.error('Error fetching sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userId) {
      alert('Please login first');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/study-sessions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          subject: formData.subject,
          duration: Number(formData.duration),
          notes: formData.notes,
        }),
      });

      if (response.ok) {
        // Refresh sessions list
        await fetchSessions();
        // Reset form
        setFormData({
          subject: '',
          duration: '',
          notes: '',
        });
        alert('Study session saved successfully!');
      } else {
        alert('Failed to save study session');
      }
    } catch (error) {
      console.error('Error saving session:', error);
      alert('Error saving study session');
    }
  };

  const totalDuration = sessions.reduce((acc, session) => acc + session.duration, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar onLogout={onLogout} />
        <div className="flex items-center justify-center h-96">
          <p className="text-gray-600">Loading sessions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onLogout={onLogout} />
      
      <div className="max-w-[1440px] mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl mb-2">Study Sessions</h1>
          <p className="text-gray-600">Log and track your study time</p>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Left Column - Log New Session */}
          <div className="col-span-4">
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 sticky top-6">
              <div className="flex items-center gap-2 mb-6">
                <Plus className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl">Log Study Session</h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="subject" className="block mb-2 text-sm">
                    Subject/Course
                  </label>
                  <input
                    id="subject"
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="CS 401 - Machine Learning"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="duration" className="block mb-2 text-sm">
                    Duration (minutes)
                  </label>
                  <input
                    id="duration"
                    type="number"
                    min="1"
                    value={formData.duration}
                    onChange={(e) =>
                      setFormData({ ...formData, duration: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="60"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="notes" className="block mb-2 text-sm">
                    Notes
                  </label>
                  <textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="What did you work on? Any blockers?"
                    rows={4}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Log Session
                </button>
              </form>

              {/* Summary Stats */}
              <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Sessions</span>
                  <span className="text-sm">{sessions.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Time</span>
                  <span className="text-sm">{Math.floor(totalDuration / 60)}h {totalDuration % 60}m</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Session History */}
          <div className="col-span-8">
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-6">
                <Clock className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl">Session History</h2>
              </div>

              {sessions.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No study sessions yet. Log your first session!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {sessions.map((session) => (
                    <div
                      key={session.id}
                      className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-sm mb-1">{session.subject}</h3>
                          <p className="text-xs text-gray-500">
                            {session.created_at && new Date(session.created_at).toLocaleDateString('en-US', {
                              weekday: 'long',
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-sm text-blue-600 font-medium">
                            {session.duration} minutes
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                        {session.notes}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
