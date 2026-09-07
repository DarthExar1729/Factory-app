import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './lib/auth';
import { I18nProvider } from './lib/i18n';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import Attendance from './pages/Attendance';
import Production from './pages/Production';
import Inventory from './pages/Inventory';
import Sales from './pages/Sales';
import SystemUsers from './pages/SystemUsers';

const ProtectedRoute = ({ children, allowedRoles, requiredPermission }: { children: React.ReactNode, allowedRoles?: ('admin' | 'manager')[], requiredPermission?: string }) => {
  const { user, role, permissions, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (allowedRoles && role && !allowedRoles.includes(role)) {
    return <Navigate to="/dashboard" />;
  }
  
  if (requiredPermission && role !== 'admin') {
    if (!permissions.includes(requiredPermission)) {
      return <Navigate to="/dashboard" />;
    }
  }
  
  return <>{children}</>;
};

export default function App() {
  return (
    <AuthProvider>
      <I18nProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            
            <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="employees" element={<ProtectedRoute requiredPermission="employees"><Employees /></ProtectedRoute>} />
              <Route path="attendance" element={<ProtectedRoute requiredPermission="attendance"><Attendance /></ProtectedRoute>} />
              <Route path="production" element={<ProtectedRoute requiredPermission="production"><Production /></ProtectedRoute>} />
              <Route path="inventory" element={<ProtectedRoute requiredPermission="inventory"><Inventory /></ProtectedRoute>} />
              <Route path="sales" element={<ProtectedRoute requiredPermission="sales"><Sales /></ProtectedRoute>} />
              <Route path="users" element={<ProtectedRoute allowedRoles={['admin']}><SystemUsers /></ProtectedRoute>} />
            </Route>
          </Routes>
        </BrowserRouter>
      </I18nProvider>
    </AuthProvider>
  );
}
