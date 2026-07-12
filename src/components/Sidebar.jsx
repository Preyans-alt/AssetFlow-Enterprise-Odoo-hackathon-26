import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  PackageSearch, 
  ArrowRightLeft,
  CalendarDays,
  Wrench,
  ClipboardCheck,
  BarChart3,
  Bell,
  LogOut,
  Hexagon
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import '../styles/layout.css';

const Sidebar = () => {
  const { currentUser, logout } = useAppContext();

  // Navigation items. Could filter by role.
  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Organization', path: '/organization', icon: <Users size={20} />, adminOnly: true },
    { name: 'Asset Directory', path: '/assets', icon: <PackageSearch size={20} /> },
    { name: 'Allocation & Transfer', path: '/transfers', icon: <ArrowRightLeft size={20} /> },
    { name: 'Resource Booking', path: '/booking', icon: <CalendarDays size={20} /> },
    { name: 'Maintenance', path: '/maintenance', icon: <Wrench size={20} /> },
    { name: 'Asset Audit', path: '/audit', icon: <ClipboardCheck size={20} />, adminOnly: true },
    { name: 'Reports & Analytics', path: '/reports', icon: <BarChart3 size={20} /> },
    { name: 'Activity Logs', path: '/logs', icon: <Bell size={20} /> },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <Hexagon size={28} className="sidebar-logo-icon" />
        <h2 className="text-gradient">AssetFlow</h2>
      </div>
      
      <nav className="sidebar-nav">
        {navItems.map((item) => {
          // Basic role-based hiding
          if (item.adminOnly && currentUser?.role !== 'Admin') return null;
          
          return (
            <NavLink 
              key={item.name} 
              to={item.path}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              {item.icon}
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="sidebar-footer" style={{ padding: 'var(--space-md)' }}>
        <button className="nav-item" onClick={logout} style={{ width: '100%', background: 'transparent', border: 'none', textAlign: 'left' }}>
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
