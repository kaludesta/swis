import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { User, Shield, Bell, LogOut, Calendar, RefreshCw } from 'lucide-react';

interface SettingsPageProps {
  onLogout: () => void;
}

const API_URL = 'http://localhost:3000/api';

export default function SettingsPage({ onLogout }: SettingsPageProps) {
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [calendarUrl, setCalendarUrl] = useState('');
  const [lastSync, setLastSync] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState('');

  // Notification preferences
  const [notifications, setNotifications] = useState({
    deadlineReminders: true,
    workloadAlerts: true,
    weeklySummary: true
  });

  // Privacy preferences
  const [privacy, setPrivacy] = useState({
    dataCollection: true,
    analytics: true,
    emailNotifications: true,
  });

  // Change password state
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordMessage, setPasswordMessage] = useState('');

  // Delete account state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteMessage, setDeleteMessage] = useState('');

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    // Load user data from localStorage
    const name = localStorage.getItem('userName') || '';
    const email = localStorage.getItem('userEmail') || '';
    setUserName(name);
    setUserEmail(email);

    // Load calendar URL and preferences
    if (userId) {
      fetchCalendarUrl();
      fetchPreferences();
    }
  }, [userId]);

  const fetchPreferences = async () => {
    try {
      const response = await fetch(`${API_URL}/user/${userId}/preferences`);
      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications);
        setPrivacy(data.privacy);
      }
    } catch (error) {
      console.error('Error fetching preferences:', error);
    }
  };

  const savePreferences = async (type: 'notifications' | 'privacy', value: any) => {
    try {
      const body = type === 'notifications'
        ? { notifications: value }
        : { privacy: value };

      const response = await fetch(`${API_URL}/user/${userId}/preferences`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (response.ok) {
        console.log('Preferences saved');
      }
    } catch (error) {
      console.error('Error saving preferences:', error);
    }
  };

  const fetchCalendarUrl = async () => {
    try {
      const response = await fetch(`${API_URL}/user/${userId}/calendar-url`);
      if (response.ok) {
        const data = await response.json();
        setCalendarUrl(data.calendarUrl || '');
        setLastSync(data.lastSync);
      }
    } catch (error) {
      console.error('Error fetching calendar URL:', error);
    }
  };

  const saveCalendarUrl = async () => {
    try {
      const response = await fetch(`${API_URL}/user/${userId}/calendar-url`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ calendarUrl })
      });

      if (response.ok) {
        setSyncMessage('✓ Calendar URL saved!');
        setTimeout(() => setSyncMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error saving calendar URL:', error);
      setSyncMessage('✗ Failed to save');
      setTimeout(() => setSyncMessage(''), 3000);
    }
  };

  const syncCalendar = async (replaceAll = false) => {
    if (!calendarUrl) {
      setSyncMessage('Please enter a calendar URL first');
      setTimeout(() => setSyncMessage(''), 3000);
      return;
    }

    setSyncing(true);
    setSyncMessage(replaceAll ? 'Replacing all assignments...' : 'Syncing...');

    try {
      const response = await fetch(`${API_URL}/user/${userId}/sync-calendar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ replaceAll })
      });

      if (response.ok) {
        const data = await response.json();
        setLastSync(data.lastSync);

        if (data.message) {
          // Empty calendar or special message
          setSyncMessage(`⚠️ ${data.message}`);
        } else {
          let message = `✓ Synced ${data.synced} assignments`;
          if (data.new > 0) message += ` (${data.new} new)`;
          if (data.updated > 0) message += ` (${data.updated} updated)`;
          if (data.removed > 0) message += ` (${data.removed} removed)`;
          setSyncMessage(message);
        }
        setTimeout(() => setSyncMessage(''), 8000);
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        setSyncMessage(`✗ Sync failed: ${errorData.error || response.statusText}`);
        setTimeout(() => setSyncMessage(''), 5000);
      }
    } catch (error) {
      console.error('Error syncing calendar:', error);
      setSyncMessage(`✗ Sync failed: ${error.message || 'Network error'}`);
      setTimeout(() => setSyncMessage(''), 5000);
    } finally {
      setSyncing(false);
    }
  };

  const handleLogoutClick = () => {
    if (confirm('Are you sure you want to logout?')) {
      onLogout();
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordMessage('❌ Passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordMessage('❌ Password must be at least 6 characters');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/user/${userId}/change-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });

      const data = await response.json();

      if (response.ok) {
        setPasswordMessage('✅ Password changed successfully!');
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setTimeout(() => {
          setShowPasswordModal(false);
          setPasswordMessage('');
        }, 2000);
      } else {
        setPasswordMessage(`❌ ${data.error || 'Failed to change password'}`);
      }
    } catch (error) {
      setPasswordMessage('❌ Network error. Please try again.');
    }
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      setDeleteMessage('❌ Please enter your password');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/user/${userId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: deletePassword })
      });

      const data = await response.json();

      if (response.ok) {
        setDeleteMessage('✅ Account deleted. Logging out...');
        setTimeout(() => {
          onLogout();
        }, 2000);
      } else {
        setDeleteMessage(`❌ ${data.error || 'Failed to delete account'}`);
      }
    } catch (error) {
      setDeleteMessage('❌ Network error. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onLogout={onLogout} />

      <div className="max-w-[1440px] mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl mb-2">Settings</h1>
          <p className="text-gray-600">Manage your account and preferences</p>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Profile Information */}
          <div className="col-span-7 space-y-6">
            {/* Blackboard Calendar Integration */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-6">
                <Calendar className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl">Blackboard Calendar</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Calendar Feed URL
                  </label>
                  <input
                    type="text"
                    value={calendarUrl}
                    onChange={(e) => setCalendarUrl(e.target.value)}
                    placeholder="https://blackboard.usiu.ac.ke/webapps/calendar/calendarFeed/..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="mt-2 text-xs text-gray-500">
                    Get your calendar URL from Blackboard → Calendar → Subscribe to Calendar
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={saveCalendarUrl}
                    className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Save URL
                  </button>
                  <button
                    onClick={() => syncCalendar(false)}
                    disabled={syncing}
                    className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400"
                  >
                    <RefreshCw className={`w-5 h-5 ${syncing ? 'animate-spin' : ''}`} />
                    {syncing ? 'Syncing...' : 'Sync'}
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('This will delete all existing Blackboard assignments and fetch new ones. Continue?')) {
                        syncCalendar(true);
                      }
                    }}
                    disabled={syncing}
                    className="flex-1 flex items-center justify-center gap-2 bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 transition-colors disabled:bg-gray-400"
                    title="Delete old assignments and fetch new ones"
                  >
                    <RefreshCw className={`w-5 h-5 ${syncing ? 'animate-spin' : ''}`} />
                    Replace All
                  </button>
                </div>

                {syncMessage && (
                  <div className={`p-3 rounded-lg ${syncMessage.includes('✓') ? 'bg-green-50 text-green-800' : 'bg-yellow-50 text-yellow-800'}`}>
                    <p className="text-sm">{syncMessage}</p>
                  </div>
                )}

                {lastSync && (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-600">
                      Last synced: {new Date(lastSync).toLocaleString()}
                    </p>
                  </div>
                )}

                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-900 mb-2 font-medium">How to get your calendar URL:</p>
                  <ol className="text-xs text-blue-800 space-y-1 ml-4 list-decimal">
                    <li>Login to USIU Blackboard</li>
                    <li>Go to Calendar</li>
                    <li>Go to Settings</li>
                    <li>Press ...</li>
                    <li>Share Calander</li>
                    <li>Copy the iCal URL</li>
                    <li>Paste it here and click "Save URL"</li>
                    <li>Click "Sync Now" to import assignments</li>
                  </ol>
                </div>
              </div>
            </div>

            {/* Profile Information */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-6">
                <User className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl">Profile Information</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-700">
                    {userName || 'Not set'}
                  </div>
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-700">
                    {userEmail || 'Not set'}
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600 mb-4">
                    Your profile information is managed through your account. To update your name or email, please contact support.
                  </p>
                </div>

                <button
                  onClick={handleLogoutClick}
                  className="w-full flex items-center justify-center gap-2 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              </div>
            </div>
          </div>

          {/* Privacy & Notifications */}
          <div className="col-span-5 space-y-6">
            {/* Privacy Settings */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-6">
                <Shield className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl">Privacy & Consent</h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-start justify-between py-3 border-b border-gray-200">
                  <div className="pr-4">
                    <p className="text-sm font-medium mb-1">Data Collection</p>
                    <p className="text-xs text-gray-500">
                      Allow SWIS to collect your study patterns for personalized insights
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={privacy.dataCollection}
                      onChange={(e) => {
                        const newPrivacy = { ...privacy, dataCollection: e.target.checked };
                        setPrivacy(newPrivacy);
                        savePreferences('privacy', newPrivacy);
                      }}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-start justify-between py-3 border-b border-gray-200">
                  <div className="pr-4">
                    <p className="text-sm font-medium mb-1">Usage Analytics</p>
                    <p className="text-xs text-gray-500">
                      Help improve SWIS by sharing anonymous usage data
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={privacy.analytics}
                      onChange={(e) => {
                        const newPrivacy = { ...privacy, analytics: e.target.checked };
                        setPrivacy(newPrivacy);
                        savePreferences('privacy', newPrivacy);
                      }}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-start justify-between py-3">
                  <div className="pr-4">
                    <p className="text-sm font-medium mb-1">Email Notifications</p>
                    <p className="text-xs text-gray-500">
                      Receive deadline reminders and productivity tips
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={privacy.emailNotifications}
                      onChange={(e) => {
                        const newPrivacy = { ...privacy, emailNotifications: e.target.checked };
                        setPrivacy(newPrivacy);
                        savePreferences('privacy', newPrivacy);
                      }}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>

              <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-xs text-yellow-900">
                  <span className="font-medium">Important:</span> SWIS is designed for academic productivity tracking only. Do not input sensitive personal information.
                </p>
              </div>
            </div>

            {/* Notification Preferences */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-6">
                <Bell className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl">Notifications</h2>
              </div>

              <div className="space-y-3">
                <div className="p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <input
                      type="checkbox"
                      id="deadline-reminder"
                      checked={notifications.deadlineReminders}
                      onChange={(e) => {
                        const newNotifications = { ...notifications, deadlineReminders: e.target.checked };
                        setNotifications(newNotifications);
                        savePreferences('notifications', newNotifications);
                      }}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="deadline-reminder" className="text-sm font-medium">
                      Deadline Reminders
                    </label>
                  </div>
                  <p className="text-xs text-gray-500 ml-6">
                    Get notified 24h before deadlines
                  </p>
                </div>

                <div className="p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <input
                      type="checkbox"
                      id="workload-alert"
                      checked={notifications.workloadAlerts}
                      onChange={(e) => {
                        const newNotifications = { ...notifications, workloadAlerts: e.target.checked };
                        setNotifications(newNotifications);
                        savePreferences('notifications', newNotifications);
                      }}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="workload-alert" className="text-sm font-medium">
                      Workload Alerts
                    </label>
                  </div>
                  <p className="text-xs text-gray-500 ml-6">
                    Alerts when your weekly workload exceeds 50 hours
                  </p>
                </div>

                <div className="p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <input
                      type="checkbox"
                      id="weekly-summary"
                      checked={notifications.weeklySummary}
                      onChange={(e) => {
                        const newNotifications = { ...notifications, weeklySummary: e.target.checked };
                        setNotifications(newNotifications);
                        savePreferences('notifications', newNotifications);
                      }}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="weekly-summary" className="text-sm font-medium">
                      Weekly Summary
                    </label>
                  </div>
                  <p className="text-xs text-gray-500 ml-6">
                    Receive a summary every Sunday evening
                  </p>
                </div>
              </div>
            </div>

            {/* Account Actions */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
              <h3 className="text-sm font-medium text-gray-900 mb-4">Account Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => setShowPasswordModal(true)}
                  className="w-full text-left px-4 py-3 text-sm text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Change Password
                </button>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="w-full text-left px-4 py-3 text-sm text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Change Password Modal */}
        {showPasswordModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-xl font-semibold mb-4">Change Password</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {passwordMessage && (
                  <div className={`p-3 rounded-lg ${passwordMessage.includes('✅') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                    <p className="text-sm">{passwordMessage}</p>
                  </div>
                )}

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => {
                      setShowPasswordModal(false);
                      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                      setPasswordMessage('');
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleChangePassword}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Change Password
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Account Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-xl font-semibold mb-4 text-red-600">Delete Account</h3>

              <div className="space-y-4">
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-900 font-medium mb-2">⚠️ Warning: This action cannot be undone!</p>
                  <p className="text-xs text-red-800">
                    All your data including assignments, study sessions, and tracking data will be permanently deleted.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Enter your password to confirm
                  </label>
                  <input
                    type="password"
                    value={deletePassword}
                    onChange={(e) => setDeletePassword(e.target.value)}
                    placeholder="Your password"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>

                {deleteMessage && (
                  <div className={`p-3 rounded-lg ${deleteMessage.includes('✅') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                    <p className="text-sm">{deleteMessage}</p>
                  </div>
                )}

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => {
                      setShowDeleteModal(false);
                      setDeletePassword('');
                      setDeleteMessage('');
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteAccount}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
