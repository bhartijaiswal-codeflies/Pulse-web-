import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Clock,
  Briefcase,
  CreditCard,
  Users,
  Laptop,
  Calendar,
  User,
  LogOut,
  Activity,
} from 'lucide-react';
import { useToast } from '../../context/NotificationContext';

export const navigationItems = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Attendance', path: '/attendance', icon: Clock, badge: '92%' },
  { name: 'Candidates', path: '/candidates', icon: Briefcase, badge: '5' },
  { name: 'Finances', path: '/finances', icon: CreditCard },
  { name: 'Users', path: '/users', icon: Users, badge: '248' },
  { name: 'Assets', path: '/assets', icon: Laptop, badge: '8' },
  { name: 'Calendar', path: '/calendar', icon: Calendar },
  { name: 'Profile', path: '/profile', icon: User, redDot: true },
];

export const Sidebar = () => {
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
    <aside className="hidden md:flex flex-col items-center w-24 bg-[#060A18] border-r border-[#131B33] py-4 select-none z-30 flex-shrink-0 h-screen justify-between">
      {/* Top Section: Glowing Logo & Navigation */}
      <div className="flex flex-col items-center w-full space-y-4">
        {/* Brand Circular Glowing Logo matching Reference Image 3 Crop */}
        <div className="relative group cursor-pointer mb-2">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] flex items-center justify-center text-white ring-2 ring-[#3B82F6]/70 shadow-[0_0_20px_rgba(37,99,235,0.45)] transition-transform duration-300 group-hover:scale-105">
            <svg
              className="w-6 h-6 text-white stroke-[2.2]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </div>
          {/* Tooltip */}
          <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-[#0D152D] text-white text-xs font-semibold rounded-lg shadow-xl border border-[#1A2544] opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap">
            Pulse HR
          </div>
        </div>

        {/* Navigation Items (Stacked Icon + Label Tiles) */}
        <nav className="flex flex-col items-center space-y-2 w-full px-2 overflow-y-auto max-h-[calc(100vh-170px)] scrollbar-none">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `group relative w-[72px] h-[64px] flex flex-col items-center justify-center rounded-2xl transition-all duration-200 ${
                    isActive
                      ? 'bg-[#0E1C3D] border border-blue-500/40 text-white shadow-[0_0_15px_rgba(37,99,235,0.22)]'
                      : 'text-[#627597] hover:text-white hover:bg-[#0D152D] hover:border hover:border-[#1A243F]'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {/* Badge / Red Dot */}
                    {item.badge && (
                      <span
                        className={`absolute -top-1.5 -right-1 text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-sm leading-none transition-colors ${
                          isActive
                            ? 'bg-[#2563EB] text-white'
                            : 'bg-[#1E3A8A] text-blue-200 border border-blue-400/30'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}

                    {item.redDot && !item.badge && (
                      <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-[#060A18] animate-pulse" />
                    )}

                    {/* Icon */}
                    <Icon
                      className={`w-5 h-5 mb-1 transition-transform group-hover:scale-110 ${
                        isActive ? 'text-[#3B82F6]' : 'text-[#627597] group-hover:text-white'
                      }`}
                    />

                    {/* Short Label */}
                    <span
                      className={`text-[10px] tracking-tight leading-none truncate max-w-[64px] ${
                        isActive
                          ? 'font-bold text-[#93C5FD]'
                          : 'font-medium text-[#627597] group-hover:text-white'
                      }`}
                    >
                      {item.name}
                    </span>

                    {/* Hover Tooltip */}
                    <div className="absolute left-full ml-3 px-2.5 py-1 bg-[#0D152D] text-white text-xs font-semibold rounded-lg shadow-xl border border-[#1A2544] opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap">
                      {item.name}
                    </div>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section: Logout Tile */}
      <div className="w-full px-2 pt-2 border-t border-[#131B33]">
        <button
          onClick={handleLogout}
          className="group relative w-[72px] h-[56px] flex flex-col items-center justify-center rounded-2xl text-[#627597] hover:text-rose-400 hover:bg-[#1A1222] hover:border hover:border-rose-900/40 transition-all duration-200"
          title="Sign out"
        >
          <LogOut className="w-5 h-5 mb-1 group-hover:scale-110 transition-transform" />
          <span className="text-[10px] font-medium leading-none">Logout</span>

          {/* Hover Tooltip */}
          <div className="absolute left-full ml-3 px-2.5 py-1 bg-[#1A1222] text-rose-300 text-xs font-semibold rounded-lg shadow-xl border border-rose-900/50 opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap">
            Logout
          </div>
        </button>
      </div>
    </aside>
  );
};
