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
import { useTheme } from '../../context/ThemeContext';

export const navigationItems = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Attendance', path: '/attendance', icon: Clock, badge: '92%' },
  { name: 'HRMS', path: '/hrms', icon: Briefcase, badge: '5' },
  { name: 'Finances', path: '/finances', icon: CreditCard },
  { name: 'Users', path: '/users', icon: Users, badge: '248' },
  { name: 'Assets', path: '/assets', icon: Laptop, badge: '8' },
  { name: 'Calendar', path: '/calendar', icon: Calendar },
  { name: 'Profile', path: '/profile', icon: User, redDot: true },
];

export const Sidebar = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { isDark } = useTheme();

  const handleLogout = () => {
    addToast({
      title: 'Logged out successfully',
      message: 'You have been signed out of Pulse HR Dashboard.',
      type: 'info',
    });
    navigate('/login');
  };

  return (
    <aside
      className={`hidden md:flex flex-col items-center w-[76px] h-screen sticky top-0 py-4 select-none z-40 flex-shrink-0 justify-between overflow-hidden transition-colors duration-200 ${
        isDark
          ? 'bg-[#060A18] border-r border-[#131B33]'
          : 'bg-white border-r border-[#E5EAF2] shadow-2xs'
      }`}
    >
      {/* Top Section: Logo & Menu Tiles */}
      <div className="flex flex-col items-center w-full flex-1 overflow-hidden">
        {/* Brand Circular Glowing Logo */}
        <div className="relative group cursor-pointer pt-3 mb-4 flex-shrink-0">
          <div
            className="w-[46px] h-[46px] rounded-full bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] flex items-center justify-center p-2 ring-2 ring-[#3B82F6]/70 shadow-[0_0_16px_rgba(37,99,235,0.45)] transition-transform duration-200 group-hover:scale-105"
            style={{ outline: '1px solid #fff', outlineOffset: '-2px' }}
          >
            <img
              src="/logo.png"
              alt="Pulse HR Logo"
              className="w-full h-full object-contain brightness-0 invert"
            />
          </div>
          {/* Tooltip */}
          <div
            className={`absolute left-full ml-3 top-1/2 -translate-y-1/2 px-2.5 py-1 text-[11px] font-semibold rounded-md shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap ${
              isDark
                ? 'bg-[#0D152D] text-white border border-[#1A2544]'
                : 'bg-[#172033] text-white border-transparent'
            }`}
          >
            Pulse HR
          </div>
        </div>

        {/* Navigation Items (62px Tiles with full-width divider lines between items) */}
        <nav className="flex flex-col items-center w-full overflow-y-auto no-scrollbar flex-1 py-1">
          {navigationItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <React.Fragment key={item.name}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `group relative w-[62px] h-[52px] flex-shrink-0 flex flex-col items-center justify-center rounded-xl transition-all duration-150 ${
                      isActive
                        ? isDark
                          ? 'bg-[#0D1938] border border-blue-500/50 text-white shadow-[0_0_14px_rgba(37,99,235,0.28)]'
                          : 'bg-[#EFF6FF] border border-[#BFDBFE] text-[#2563EB] shadow-2xs font-bold'
                        : isDark
                        ? 'text-[#76849D] hover:text-white hover:bg-[#0D152D]/80 border border-transparent'
                        : 'text-[#64748B] hover:text-[#172033] hover:bg-[#F8FAFC] border border-transparent'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {/* Red Dot Indicator */}
                      {item.redDot && !item.badge && (
                        <span
                          className={`absolute top-1.5 right-2 w-2 h-2 rounded-full bg-[#FF3B5B] ring-2 animate-pulse ${
                            isDark ? 'ring-[#060A18]' : 'ring-white'
                          }`}
                        />
                      )}

                      {/* Icon */}
                      <Icon
                        className={`w-[18px] h-[18px] mb-1 transition-transform group-hover:scale-105 stroke-[1.8] ${
                          isActive
                            ? isDark
                              ? 'text-[#3B82F6]'
                              : 'text-[#2563EB]'
                            : isDark
                            ? 'text-[#e8eaed] group-hover:text-white'
                            : 'text-[#64748B] group-hover:text-[#172033]'
                        }`}
                      />

                      {/* Short Label */}
                      <span
                        className={`text-[10px] tracking-tight leading-none text-center truncate max-w-[58px] ${
                          isActive
                            ? isDark
                              ? 'font-semibold text-[#93C5FD]'
                              : 'font-bold text-[#2563EB]'
                            : isDark
                            ? 'font-medium text-[#e8eaed] group-hover:text-[#E2E8F0]'
                            : 'font-medium text-[#64748B] group-hover:text-[#172033]'
                        }`}
                      >
                        {item.name}
                      </span>

                      {/* Hover Tooltip */}
                      <div
                        className={`absolute left-full ml-3 px-2.5 py-1 text-[11px] font-semibold rounded-md shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap ${
                          isDark
                            ? 'bg-[#0D152D] text-white border border-[#1A2544]'
                            : 'bg-[#172033] text-white border-transparent'
                        }`}
                      >
                        {item.name}
                      </div>
                    </>
                  )}
                </NavLink>

                {/* Full-width Divider Line between navbar items */}
                {index < navigationItems.length - 1 && (
                  <div
                    className={`w-full h-[1px] my-1 flex-shrink-0 transition-colors ${
                      isDark ? 'bg-[#141E38]' : 'bg-[#F1F5F9]'
                    }`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section: Logout Tile (Separated with matching full-width border) */}
      <div
        className={`w-full px-1.5 pt-2 flex-shrink-0 mt-1 transition-colors ${
          isDark ? 'border-t border-[#141E38]' : 'border-t border-[#E5EAF2]'
        }`}
      >
        <button
          onClick={handleLogout}
          className={`group relative w-[62px] h-[50px] mx-auto flex flex-col items-center justify-center rounded-xl transition-all duration-150 ${
            isDark
              ? 'text-[#76849D] hover:text-rose-400 hover:bg-[#1A1222]'
              : 'text-[#64748B] hover:text-rose-600 hover:bg-rose-50'
          }`}
          title="Sign out"
        >
          <LogOut className="w-[18px] h-[18px] mb-1 group-hover:scale-105 transition-transform stroke-[1.8]" />
          <span className="text-[10px] font-medium leading-none">Logout</span>

          {/* Hover Tooltip */}
          <div
            className={`absolute left-full ml-3 px-2.5 py-1 text-[11px] font-semibold rounded-md shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap ${
              isDark
                ? 'bg-[#1A1222] text-rose-300 border border-rose-900/50'
                : 'bg-rose-900 text-white border-transparent'
            }`}
          >
            Logout
          </div>
        </button>
      </div>
    </aside>
  );
};
