import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Clock,
  UserCheck,
  Briefcase,
  CreditCard,
  Users,
  Laptop,
  Calendar,
  User,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Activity,
} from 'lucide-react';
import { useToast } from '../../context/NotificationContext';

export const navigationItems = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Attendance', path: '/attendance', icon: Clock },
  { name: 'Candidates', path: '/candidates', icon: Briefcase, badge: '5' },
  { name: 'Finances', path: '/finances', icon: CreditCard },
  { name: 'Users', path: '/users', icon: Users },
  { name: 'Assets', path: '/assets', icon: Laptop, badge: '8' },
  { name: 'Calendar', path: '/calendar', icon: Calendar },
  { name: 'Profile', path: '/profile', icon: User },
];

export const Sidebar = ({ isCollapsed, toggleCollapsed }) => {
  const navigate = useNavigate();
  const { addToast } = useToast();

  const handleLogout = () => {
    addToast({
      title: 'Logged out successfully',
      message: 'You have been signed out of Pulse HR Dashboard.',
      type: 'info',
    });
    navigate('/');
  };

  return (
    <aside
      className={`hidden md:flex flex-col bg-[#080D20] text-[#8292AD] border-r border-[#151D36] transition-all duration-300 select-none z-30 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-5 border-b border-[#151D36]">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-[#2563EB] flex items-center justify-center text-white shadow-md shadow-blue-500/20 flex-shrink-0">
            <Activity className="w-5 h-5 stroke-[2.2]" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="text-white font-bold text-base tracking-wide flex items-center gap-1.5">
                Pulse <span className="text-[10px] uppercase font-semibold tracking-wider px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400">HR</span>
              </span>
              <span className="text-[11px] text-[#8292AD] leading-tight">People Management</span>
            </div>
          )}
        </div>

        <button
          onClick={toggleCollapsed}
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="text-[#8292AD] hover:text-white p-1 rounded-lg hover:bg-[#121A33] transition-colors"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 py-5 px-3 space-y-1.5 overflow-y-auto">
        <div className={`px-3 mb-2 text-[10px] font-semibold uppercase tracking-wider text-[#4E5D78] ${isCollapsed ? 'text-center' : ''}`}>
          {isCollapsed ? '•••' : 'Main Menu'}
        </div>

        {navigationItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `group relative flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-[#2563EB] text-white shadow-sm font-semibold'
                    : 'text-[#8292AD] hover:text-white hover:bg-[#121A33]'
                } ${isCollapsed ? 'justify-center' : ''}`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={`w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-105 ${
                      isActive ? 'text-white' : 'text-[#8292AD] group-hover:text-white'
                    }`}
                  />
                  {!isCollapsed && (
                    <span className="truncate flex-1">{item.name}</span>
                  )}
                  {!isCollapsed && item.badge && (
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-[#151D36] text-blue-400 border border-blue-500/20'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}

                  {/* Tooltip for collapsed state */}
                  {isCollapsed && (
                    <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-[#0D152D] text-white text-xs rounded-lg shadow-xl border border-[#1A2544] opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity z-50 whitespace-nowrap">
                      {item.name}
                      {item.badge && ` (${item.badge})`}
                    </div>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* Bottom Section - Logout */}
      <div className="p-3 border-t border-[#151D36] space-y-1">
        <button
          onClick={handleLogout}
          className={`group relative w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-medium text-[#8292AD] hover:text-rose-400 hover:bg-[#1A1222] transition-colors ${
            isCollapsed ? 'justify-center' : ''
          }`}
        >
          <LogOut className="w-5 h-5 flex-shrink-0 text-[#8292AD] group-hover:text-rose-400 transition-colors" />
          {!isCollapsed && <span>Logout</span>}

          {isCollapsed && (
            <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-[#0D152D] text-rose-300 text-xs rounded-lg shadow-xl border border-[#1A2544] opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity z-50 whitespace-nowrap">
              Logout
            </div>
          )}
        </button>
      </div>
    </aside>
  );
};
