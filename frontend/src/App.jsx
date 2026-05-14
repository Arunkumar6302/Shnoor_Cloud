import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Auth from './pages/Auth';
import Settings from './pages/Settings';
import FilePreviewPage from './pages/FilePreviewPage';
import { AuthProvider, useAuth } from './context/AuthContext';
import NotificationManager from './components/NotificationManager';

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/auth" />;
};

function AppRoutes() {
  const { user } = useAuth();
  
  return (
    <Routes>
      {/* Root route: Shows Auth if not logged in, otherwise shows Dashboard */}
      <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Auth />} />
      <Route path="/auth" element={user ? <Navigate to="/dashboard" /> : <Auth />} />
      
      {/* Protected Dashboard Routes */}
      <Route path="/dashboard" element={
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

      <Route path="/preview/:id" element={
        <PrivateRoute>
          <FilePreviewPage />
        </PrivateRoute>
      } />

      {/* Catch-all: Redirect to root */}
      <Route path="*" element={<Navigate to="/" />} />
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
