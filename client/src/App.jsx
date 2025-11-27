import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import SubjectDetails from './pages/SubjectDetails';

import TimetablePage from './pages/TimetablePage';
import TasksPage from './pages/TasksPage';
import AnalyticsPage from './pages/AnalyticsPage';

import AppLayout from './components/AppLayout';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            {/* Protected App Routes */}
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/timetable" element={<TimetablePage />} />
              <Route path="/tasks" element={<TasksPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/subject/:id" element={<SubjectDetails />} />
            </Route>
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
