import React, { useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { X, LogOut, Activity } from 'lucide-react';
import { navigationItems } from './Sidebar';
import { useToast } from '../../context/NotificationContext';

export const MobileDrawer = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addToast } = useToast();

  // Close drawer automatically on route change
  useEffect(() => {
    onClose();
  }, [location.pathname]);

  const handleLogout = () => {
    onClose();
    addToast({
      title: 'Logged out successfully',
      message: 'You have been signed out of Pulse HR Dashboard.',
      type: 'info',
    });
    navigate('/');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#080D20]/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative flex flex-col w-72 max-w-[80vw] bg-[#080D20] text-[#8292AD] h-full shadow-2xl z-10 animate-fade-in border-r border-[#151D36]">
        {/* Drawer Header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-[#151D36]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#2563EB] flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <span className="text-white font-bold text-base tracking-wide flex items-center gap-1.5">
                Pulse <span className="text-[10px] uppercase font-semibold tracking-wider px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400">HR</span>
              </span>
              <p className="text-[10px] text-[#8292AD]">People Management</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#8292AD] hover:text-white rounded-lg hover:bg-[#121A33] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Links */}
        <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          <div className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-wider text-[#4E5D78]">
            Navigation
          </div>
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-[#2563EB] text-white shadow-sm font-semibold'
                      : 'text-[#8292AD] hover:text-white hover:bg-[#121A33]'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={`w-5 h-5 flex-shrink-0 ${
                        isActive ? 'text-white' : 'text-[#8292AD]'
                      }`}
                    />
                    <span className="truncate flex-1">{item.name}</span>
                    {item.badge && (
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
                  </>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Drawer Footer */}
        <div className="p-3 border-t border-[#151D36]">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-medium text-[#8292AD] hover:text-rose-400 hover:bg-[#1A1222] transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};
