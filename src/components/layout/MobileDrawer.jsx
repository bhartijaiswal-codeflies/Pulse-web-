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
      <div className="relative flex flex-col w-[76px] bg-[#060A18] text-[#8292AD] h-full shadow-2xl z-10 animate-fade-in border-r border-[#131B33] items-center py-4 justify-between overflow-hidden">
        {/* Top Header */}
        <div className="flex flex-col items-center gap-2.5 w-full flex-shrink-0">
          <button
            onClick={onClose}
            className="self-end mr-2 p-1 text-[#68758D] hover:text-white rounded-lg hover:bg-[#121A33] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="w-[38px] h-[38px] rounded-full bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] flex items-center justify-center text-white ring-2 ring-[#3B82F6]/70 shadow-[0_0_15px_rgba(37,99,235,0.4)]">
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
        </div>

        {/* Links with 8px gap and hidden scrollbar */}
        <div className="flex-1 py-3 flex flex-col items-center space-y-2 w-full px-1.5 overflow-y-auto no-scrollbar">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `relative w-[54px] h-[48px] flex-shrink-0 flex flex-col items-center justify-center rounded-xl transition-all ${
                    isActive
                      ? 'bg-[#0D1938] border border-blue-500/40 text-white shadow-[0_0_12px_rgba(37,99,235,0.25)]'
                      : 'text-[#68758D] hover:text-white hover:bg-[#0D152D]'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {item.badge && (
                      <span
                        className={`absolute -top-1 -right-0.5 text-[8.5px] font-extrabold px-1.5 py-0.2 rounded-full leading-tight shadow-xs ${
                          isActive
                            ? 'bg-[#2563EB] text-white'
                            : 'bg-[#1D3268] text-blue-200 border border-blue-400/25'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                    {item.redDot && !item.badge && (
                      <span className="absolute top-1 right-1.5 w-1.5 h-1.5 rounded-full bg-rose-500 ring-1 ring-[#060A18]" />
                    )}
                    <Icon
                      className={`w-[17px] h-[17px] mb-0.5 ${
                        isActive ? 'text-[#3B82F6]' : 'text-[#68758D]'
                      }`}
                    />
                    <span
                      className={`text-[9.5px] tracking-tight leading-none truncate max-w-[50px] ${
                        isActive ? 'font-bold text-[#93C5FD]' : 'font-medium text-[#68758D]'
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
        <div className="w-full px-1.5 pt-2 border-t border-[#131B33] flex-shrink-0">
          <button
            onClick={handleLogout}
            className="w-[54px] h-[46px] mx-auto flex flex-col items-center justify-center rounded-xl text-[#68758D] hover:text-rose-400 hover:bg-[#1A1222] transition-colors"
          >
            <LogOut className="w-[17px] h-[17px] mb-0.5" />
            <span className="text-[9.5px] font-medium leading-none">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};
