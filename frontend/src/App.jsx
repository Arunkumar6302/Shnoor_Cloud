import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Auth from './pages/Auth';
import Settings from './pages/Settings';
import { AuthProvider, useAuth } from './context/AuthContext';
import NotificationManager from './components/NotificationManager';

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/auth" />;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/auth" element={<Auth />} />
      <Route path="/" element={
        <PrivateRoute>
          <Layout />
        </PrivateRoute>
      }>
        <Route index element={<Dashboard />} />
        <Route path="files" element={<Dashboard />} />
        <Route path="shared" element={<Dashboard />} />
        <Route path="recent" element={<Dashboard />} />
        <Route path="starred" element={<Dashboard />} />
        <Route path="trash" element={<Dashboard />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <NotificationManager />
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
