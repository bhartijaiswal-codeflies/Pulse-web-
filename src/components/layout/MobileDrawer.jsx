import React, { useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { X, LogOut } from 'lucide-react';
import { navigationItems } from './Sidebar';
import { useToast } from '../../context/NotificationContext';

export const MobileDrawer = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addToast } = useToast();

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
        className="fixed inset-0 bg-[#060A18]/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative flex flex-col w-28 bg-[#060A18] text-[#8292AD] h-full shadow-2xl z-10 animate-fade-in border-r border-[#131B33] items-center py-4 justify-between">
        {/* Top Header */}
        <div className="flex flex-col items-center gap-3 w-full">
          <button
            onClick={onClose}
            className="self-end mr-3 p-1.5 text-[#627597] hover:text-white rounded-lg hover:bg-[#121A33] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] flex items-center justify-center text-white ring-2 ring-[#3B82F6]/70 shadow-[0_0_15px_rgba(37,99,235,0.4)]">
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
        </div>

        {/* Links */}
        <div className="flex-1 py-4 flex flex-col items-center space-y-2 w-full px-2 overflow-y-auto">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `relative w-[76px] h-[64px] flex flex-col items-center justify-center rounded-2xl transition-all ${
                    isActive
                      ? 'bg-[#0E1C3D] border border-blue-500/40 text-white shadow-[0_0_12px_rgba(37,99,235,0.22)]'
                      : 'text-[#627597] hover:text-white hover:bg-[#0D152D]'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {item.badge && (
                      <span
                        className={`absolute -top-1.5 -right-1 text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-sm leading-none ${
                          isActive
                            ? 'bg-[#2563EB] text-white'
                            : 'bg-[#1E3A8A] text-blue-200 border border-blue-400/30'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                    {item.redDot && !item.badge && (
                      <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-[#060A18]" />
                    )}
                    <Icon
                      className={`w-5 h-5 mb-1 ${
                        isActive ? 'text-[#3B82F6]' : 'text-[#627597]'
                      }`}
                    />
                    <span
                      className={`text-[10px] tracking-tight truncate max-w-[68px] ${
                        isActive ? 'font-bold text-[#93C5FD]' : 'font-medium text-[#627597]'
                      }`}
                    >
                      {item.name}
                    </span>
                  </>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Logout */}
        <div className="w-full px-2 pt-2 border-t border-[#131B33]">
          <button
            onClick={handleLogout}
            className="w-[76px] h-[56px] mx-auto flex flex-col items-center justify-center rounded-2xl text-[#627597] hover:text-rose-400 hover:bg-[#1A1222] transition-colors"
          >
            <LogOut className="w-5 h-5 mb-1" />
            <span className="text-[10px] font-medium">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};
