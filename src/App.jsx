import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAppContext } from './context/AppContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Login from './pages/Auth/Login';

import Dashboard from './pages/Dashboard/Dashboard';
import OrganizationSetup from './pages/Organization/Setup';
import AssetDirectory from './pages/Assets/Directory';
import AllocationTransfer from './pages/Assets/Allocation';
import ResourceBooking from './pages/Booking/ResourceBooking';

import Maintenance from './pages/Maintenance/Maintenance';
import AssetAudit from './pages/Audit/AssetAudit';
import Reports from './pages/Reports/Analytics';
import ActivityLogs from './pages/Logs/ActivityLogs';

const AppLayout = ({ children }) => {
  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        <Header />
        {children}
      </main>
    </div>
  );
};

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { currentUser } = useAppContext();
  
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  
  if (adminOnly && currentUser.role !== 'Admin') {
    return <Navigate to="/" replace />;
  }

  return <AppLayout>{children}</AppLayout>;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Protected Routes */}
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/organization" element={<ProtectedRoute adminOnly><OrganizationSetup /></ProtectedRoute>} />
        <Route path="/assets" element={<ProtectedRoute><AssetDirectory /></ProtectedRoute>} />
        <Route path="/transfers" element={<ProtectedRoute><AllocationTransfer /></ProtectedRoute>} />
        <Route path="/booking" element={<ProtectedRoute><ResourceBooking /></ProtectedRoute>} />
        <Route path="/maintenance" element={<ProtectedRoute><Maintenance /></ProtectedRoute>} />
        <Route path="/audit" element={<ProtectedRoute adminOnly><AssetAudit /></ProtectedRoute>} />
        <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
        <Route path="/logs" element={<ProtectedRoute><ActivityLogs /></ProtectedRoute>} />
        
        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
