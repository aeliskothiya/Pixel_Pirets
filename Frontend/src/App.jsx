import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { PrivateRoute } from './components/PrivateRoute';
import { OwnerRegister } from './pages/OwnerRegister';
import { OwnerLogin } from './pages/OwnerLogin';
import { CoordinatorLogin } from './pages/CoordinatorLogin';
import { OwnerDashboard } from './pages/OwnerDashboard';
import { CoordinatorDashboard } from './pages/CoordinatorDashboard';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Auth Routes */}
          <Route path="/" element={<Navigate to="/owner/login" />} />
          <Route path="/owner/register" element={<OwnerRegister />} />
          <Route path="/owner/login" element={<OwnerLogin />} />
          <Route path="/coordinator/login" element={<CoordinatorLogin />} />

          {/* Protected Routes */}
          <Route
            path="/owner/dashboard"
            element={
              <PrivateRoute requiredRole="owner">
                <OwnerDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/coordinator/dashboard"
            element={
              <PrivateRoute requiredRole="coordinator">
                <CoordinatorDashboard />
              </PrivateRoute>
            }
          />

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
