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
    <aside className="hidden md:flex flex-col items-center w-[68px] bg-[#060A18] border-r border-[#131B33] py-3.5 select-none z-30 flex-shrink-0 h-screen justify-between">
      {/* Top Section: Logo & Menu Tiles */}
      <div className="flex flex-col items-center w-full space-y-3">
        {/* Brand Circular Glowing Logo matching Reference Image */}
        <div className="relative group cursor-pointer mb-1">
          <div className="w-[38px] h-[38px] rounded-full bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] flex items-center justify-center text-white ring-2 ring-[#3B82F6]/70 shadow-[0_0_15px_rgba(37,99,235,0.45)] transition-transform duration-200 group-hover:scale-105">
            <svg
              className="w-[18px] h-[18px] text-white stroke-[2.2]"
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
          <div className="absolute left-full ml-2.5 top-1/2 -translate-y-1/2 px-2 py-1 bg-[#0D152D] text-white text-[11px] font-semibold rounded-md shadow-xl border border-[#1A2544] opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap">
            Pulse HR
          </div>
        </div>

        {/* Navigation Items (Stacked Icon + Small Label) */}
        <nav className="flex flex-col items-center space-y-1 w-full px-1.5 overflow-y-auto max-h-[calc(100vh-140px)] scrollbar-none">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `group relative w-[54px] h-[48px] flex flex-col items-center justify-center rounded-xl transition-all duration-150 ${
                    isActive
                      ? 'bg-[#0D1938] border border-blue-500/40 text-white shadow-[0_0_12px_rgba(37,99,235,0.25)]'
                      : 'text-[#68758D] hover:text-white hover:bg-[#0D152D]'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {/* Badge Pill */}
                    {item.badge && (
                      <span
                        className={`absolute -top-1 -right-0.5 text-[8.5px] font-extrabold px-1.5 py-0.2 rounded-full leading-tight shadow-xs transition-colors ${
                          isActive
                            ? 'bg-[#2563EB] text-white'
                            : 'bg-[#1D3268] text-blue-200 border border-blue-400/25'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}

                    {/* Red Dot Indicator */}
                    {item.redDot && !item.badge && (
                      <span className="absolute top-1 right-1.5 w-1.5 h-1.5 rounded-full bg-rose-500 ring-1 ring-[#060A18] animate-pulse" />
                    )}

                    {/* Icon */}
                    <Icon
                      className={`w-[17px] h-[17px] mb-0.5 transition-transform group-hover:scale-105 stroke-[1.9] ${
                        isActive ? 'text-[#3B82F6]' : 'text-[#68758D] group-hover:text-white'
                      }`}
                    />

                    {/* Short Label */}
                    <span
                      className={`text-[9.5px] tracking-tight leading-none truncate max-w-[50px] ${
                        isActive
                          ? 'font-bold text-[#93C5FD]'
                          : 'font-medium text-[#68758D] group-hover:text-[#CBD5E1]'
                      }`}
                    >
                      {item.name}
                    </span>

                    {/* Hover Tooltip */}
                    <div className="absolute left-full ml-2.5 px-2 py-1 bg-[#0D152D] text-white text-[11px] font-semibold rounded-md shadow-xl border border-[#1A2544] opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap">
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
      <div className="w-full px-1.5 pt-1.5 border-t border-[#131B33]">
        <button
          onClick={handleLogout}
          className="group relative w-[54px] h-[46px] mx-auto flex flex-col items-center justify-center rounded-xl text-[#68758D] hover:text-rose-400 hover:bg-[#1A1222] transition-all duration-150"
          title="Sign out"
        >
          <LogOut className="w-[17px] h-[17px] mb-0.5 group-hover:scale-105 transition-transform stroke-[1.9]" />
          <span className="text-[9.5px] font-medium leading-none">Logout</span>

          {/* Hover Tooltip */}
          <div className="absolute left-full ml-2.5 px-2 py-1 bg-[#1A1222] text-rose-300 text-[11px] font-semibold rounded-md shadow-xl border border-rose-900/50 opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap">
            Logout
          </div>
        </button>
      </div>
    </aside>
  );
};
