import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import WelcomePage from './pages/WelcomePage';
import DashboardPage from './pages/DashboardPage';
import PaymentPage from './pages/PaymentPage';
import PaymentHistoryPage from './pages/PaymentHistoryPage';

// Protected Route Component
const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/welcome" />;
  }

  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) return null;

  return (
    <Routes>
      <Route path="/welcome" element={!user ? <WelcomePage /> : <Navigate to="/" />} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <DashboardPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/payment/:id"
        element={
          <PrivateRoute>
            <PaymentPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/transactions/:id/history"
        element={
          <PrivateRoute>
            <PaymentHistoryPage />
          </PrivateRoute>
        }
      />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
};

export default App;
