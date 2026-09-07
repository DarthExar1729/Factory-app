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

const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode, allowedRoles?: ('admin' | 'manager')[] }) => {
  const { user, role, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (allowedRoles && role && !allowedRoles.includes(role)) {
    return <Navigate to="/dashboard" />;
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
              <Route path="employees" element={<ProtectedRoute allowedRoles={['admin']}><Employees /></ProtectedRoute>} />
              <Route path="attendance" element={<Attendance />} />
              <Route path="production" element={<Production />} />
              <Route path="inventory" element={<ProtectedRoute allowedRoles={['admin']}><Inventory /></ProtectedRoute>} />
              <Route path="sales" element={<ProtectedRoute allowedRoles={['admin']}><Sales /></ProtectedRoute>} />
            </Route>
          </Routes>
        </BrowserRouter>
      </I18nProvider>
    </AuthProvider>
  );
}
