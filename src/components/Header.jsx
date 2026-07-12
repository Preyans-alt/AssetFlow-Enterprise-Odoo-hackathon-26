import React from 'react';
import { Search, Bell, Settings } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import '../styles/layout.css';

const Header = () => {
  const { currentUser, notifications } = useAppContext();
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="top-header">
      <div className="header-search">
        <Search className="search-icon" />
        <input type="text" placeholder="Search assets, users, departments..." />
      </div>

      <div className="header-actions">
        <button className="icon-btn">
          <Bell size={20} />
          {unreadCount > 0 && <span className="badge"></span>}
        </button>
        <button className="icon-btn">
          <Settings size={20} />
        </button>
        <div className="user-profile">
          <div className="avatar">
            {currentUser?.name.charAt(0)}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{currentUser?.name}</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{currentUser?.role}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
