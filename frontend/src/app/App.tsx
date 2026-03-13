import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router';
import { useState } from 'react';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import DashboardPage from '../pages/DashboardPage';
import AssignmentsPage from '../pages/AssignmentsPage';
import StudySessionPage from '../pages/StudySessionPage';
import AnalyticsPage from '../pages/AnalyticsPage';
import InsightsPage from '../pages/InsightsPage';
import SettingsPage from '../pages/SettingsPage';

export default function App() {
  // Check if user is already logged in
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('userId') !== null;
  });

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={
            isAuthenticated ? 
            <Navigate to="/dashboard" replace /> : 
            <LoginPage onLogin={handleLogin} />
          } 
        />
        <Route 
          path="/register" 
          element={
            isAuthenticated ? 
            <Navigate to="/dashboard" replace /> : 
            <RegisterPage />
          } 
        />
        <Route
          path="/dashboard"
          element={
            isAuthenticated ?
            <DashboardPage onLogout={handleLogout} /> :
            <Navigate to="/login" replace />
          }
        />
        <Route
          path="/assignments"
          element={
            isAuthenticated ?
            <AssignmentsPage onLogout={handleLogout} /> :
            <Navigate to="/login" replace />
          }
        />
        <Route
          path="/study-sessions"
          element={
            isAuthenticated ?
            <StudySessionPage onLogout={handleLogout} /> :
            <Navigate to="/login" replace />
          }
        />
        <Route
          path="/analytics"
          element={
            isAuthenticated ?
            <AnalyticsPage onLogout={handleLogout} /> :
            <Navigate to="/login" replace />
          }
        />
        <Route
          path="/insights"
          element={
            isAuthenticated ?
            <InsightsPage onLogout={handleLogout} /> :
            <Navigate to="/login" replace />
          }
        />
        <Route
          path="/settings"
          element={
            isAuthenticated ?
            <SettingsPage onLogout={handleLogout} /> :
            <Navigate to="/login" replace />
          }
        />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}
