import React from 'react';
import { 
  Package, 
  CheckCircle, 
  Wrench, 
  CalendarDays, 
  ArrowRightLeft, 
  AlertTriangle,
  Plus
} from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import '../../styles/components.css';

const Dashboard = () => {
  const { assets, maintenance, bookings, currentUser } = useAppContext();

  // Calculate KPIs
  const availableAssets = assets.filter(a => a.status === 'Available').length;
  const allocatedAssets = assets.filter(a => a.status === 'Allocated').length;
  const maintenanceToday = maintenance.filter(m => m.status === 'In Progress').length;
  const activeBookings = bookings.filter(b => b.status === 'Upcoming' || b.status === 'Ongoing').length;
  const pendingTransfers = 0; // Mock value
  
  // Find overdue returns
  const today = new Date();
  const overdueReturns = assets.filter(a => {
    if (a.status === 'Allocated' && a.expectedReturn) {
      const returnDate = new Date(a.expectedReturn);
      return returnDate < today;
    }
    return false;
  });

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Welcome back, {currentUser?.name}. Here's your operational snapshot.</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-primary">
            <Plus size={18} /> Register Asset
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-lg)', marginBottom: 'var(--space-xl)' }}>
        <div className="card stat-card">
          <div className="stat-header">
            <span>Assets Available</span>
            <div className="stat-icon" style={{ color: 'var(--success)' }}><CheckCircle size={20} /></div>
          </div>
          <div className="stat-value">{availableAssets}</div>
        </div>
        <div className="card stat-card">
          <div className="stat-header">
            <span>Assets Allocated</span>
            <div className="stat-icon" style={{ color: 'var(--info)' }}><Package size={20} /></div>
          </div>
          <div className="stat-value">{allocatedAssets}</div>
        </div>
        <div className="card stat-card">
          <div className="stat-header">
            <span>Maintenance Today</span>
            <div className="stat-icon" style={{ color: 'var(--warning)' }}><Wrench size={20} /></div>
          </div>
          <div className="stat-value">{maintenanceToday}</div>
        </div>
        <div className="card stat-card">
          <div className="stat-header">
            <span>Active Bookings</span>
            <div className="stat-icon" style={{ color: 'var(--accent-primary)' }}><CalendarDays size={20} /></div>
          </div>
          <div className="stat-value">{activeBookings}</div>
        </div>
        <div className="card stat-card">
          <div className="stat-header">
            <span>Pending Transfers</span>
            <div className="stat-icon" style={{ color: 'var(--text-secondary)' }}><ArrowRightLeft size={20} /></div>
          </div>
          <div className="stat-value">{pendingTransfers}</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-xl)' }}>
        {/* Overdue Returns */}
        <div className="card">
          <h3 style={{ marginBottom: 'var(--space-md)', display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
            <AlertTriangle size={20} color="var(--danger)" /> Overdue Returns
          </h3>
          {overdueReturns.length > 0 ? (
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Asset Tag</th>
                    <th>Name</th>
                    <th>Holder</th>
                    <th>Due Date</th>
                  </tr>
                </thead>
                <tbody>
                  {overdueReturns.map(asset => (
                    <tr key={asset.id}>
                      <td>{asset.id}</td>
                      <td>{asset.name}</td>
                      <td>{asset.holder}</td>
                      <td style={{ color: 'var(--danger)', fontWeight: 500 }}>{asset.expectedReturn}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ padding: 'var(--space-lg)', textAlign: 'center', color: 'var(--text-muted)' }}>
              No overdue returns.
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h3 style={{ marginBottom: 'var(--space-md)' }}>Quick Actions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            <button className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
              <Package size={18} /> Register New Asset
            </button>
            <button className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
              <CalendarDays size={18} /> Book a Resource
            </button>
            <button className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
              <Wrench size={18} /> Raise Maintenance Request
            </button>
            <button className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
              <ArrowRightLeft size={18} /> Request Asset Transfer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
