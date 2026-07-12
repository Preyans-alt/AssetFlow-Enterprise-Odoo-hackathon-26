import { ReactNode } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Box,
  Users,
  Building2,
  CalendarDays,
  Wrench,
  ShieldCheck,
  FileText,
  Bell,
  LogOut,
  Settings
} from 'lucide-react';
import clsx from 'clsx';

interface LayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: LayoutProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard', roles: ['ADMIN', 'ASSET_MANAGER', 'DEPARTMENT_HEAD', 'EMPLOYEE'] },
    { name: 'Assets', icon: Box, path: '/assets', roles: ['ADMIN', 'ASSET_MANAGER', 'DEPARTMENT_HEAD', 'EMPLOYEE'] },
    { name: 'Bookings', icon: CalendarDays, path: '/bookings', roles: ['ADMIN', 'ASSET_MANAGER', 'DEPARTMENT_HEAD', 'EMPLOYEE'] },
    { name: 'Maintenance', icon: Wrench, path: '/maintenance', roles: ['ADMIN', 'ASSET_MANAGER', 'DEPARTMENT_HEAD', 'EMPLOYEE'] },
    { name: 'Departments', icon: Building2, path: '/departments', roles: ['ADMIN'] },
    { name: 'Employees', icon: Users, path: '/employees', roles: ['ADMIN'] },
    { name: 'Audit', icon: ShieldCheck, path: '/audit', roles: ['ADMIN', 'ASSET_MANAGER'] },
    { name: 'Reports', icon: FileText, path: '/reports', roles: ['ADMIN', 'ASSET_MANAGER'] },
  ];

  const allowedMenus = menuItems.filter(item => user && item.roles.includes(user.role));

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0F172A] flex flex-col border-r border-slate-800">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center text-white font-bold">
            <Box className="w-5 h-5" />
          </div>
          <span className="text-white font-semibold text-lg tracking-tight">AssetFlow</span>
        </div>
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto py-4">
          {allowedMenus.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                clsx(
                  "flex items-center gap-3 px-3 py-2 transition-colors rounded-md",
                  isActive
                    ? "bg-indigo-600/10 text-indigo-400 border-r-4 border-indigo-500 font-medium"
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                )
              }
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {item.name}
            </NavLink>
          ))}
        </nav>
        
        {/* User profile & logout */}
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-indigo-500 border-2 border-slate-700 flex items-center justify-center text-white text-sm">
              {user?.name?.charAt(0) || user?.email?.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm text-white font-medium truncate">{user?.name || 'User'}</p>
              <p className="text-xs text-slate-500 truncate">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2 text-sm font-medium text-red-400 rounded-md hover:text-red-300 hover:bg-slate-800 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between shrink-0">
          <div className="flex-1"></div>
          <div className="flex items-center gap-6">
            <button className="p-2 text-slate-400 hover:text-slate-500 rounded-full hover:bg-slate-100 transition-colors">
              <Bell className="w-5 h-5" />
            </button>
            <button className="p-2 text-slate-400 hover:text-slate-500 rounded-full hover:bg-slate-100 transition-colors">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-auto p-8">
          <div className="max-w-7xl mx-auto flex flex-col gap-8">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
