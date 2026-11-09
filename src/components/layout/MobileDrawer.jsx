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

          <div className="w-[46px] h-[46px] rounded-full bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] flex items-center justify-center p-2 ring-2 ring-[#3B82F6]/70 shadow-[0_0_16px_rgba(37,99,235,0.4)]">
            <img
              src="/logo.png"
              alt="Pulse HR Logo"
              className="w-full h-full object-contain brightness-0 invert"
            />
          </div>
        </div>

        {/* Links with 10px gap and hidden scrollbar */}
        <div className="flex-1 py-3 flex flex-col items-center space-y-2.5 w-full px-1.5 overflow-y-auto no-scrollbar">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `relative w-[62px] h-[54px] flex-shrink-0 flex flex-col items-center justify-center rounded-xl transition-all ${
                    isActive
                      ? 'bg-[#0D1938] border border-blue-500/50 text-white shadow-[0_0_14px_rgba(37,99,235,0.28)]'
                      : 'text-[#76849D] hover:text-white hover:bg-[#0D152D]/80 border border-transparent'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {item.badge && (
                      <span
                        className={`absolute -top-1 -right-0.5 text-[9px] font-bold px-1.5 py-0.5 rounded-full leading-none shadow-xs ${
                          isActive
                            ? 'bg-[#2563EB] text-white ring-1 ring-[#060A18]'
                            : 'bg-[#2563EB] text-white ring-1 ring-[#060A18]'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                    {item.redDot && !item.badge && (
                      <span className="absolute top-1.5 right-2 w-2 h-2 rounded-full bg-[#FF3B5B] ring-2 ring-[#060A18]" />
                    )}
                    <Icon
                      className={`w-[18px] h-[18px] mb-1 stroke-[1.8] ${
                        isActive ? 'text-[#3B82F6]' : 'text-[#76849D]'
                      }`}
                    />
                    <span
                      className={`text-[10px] tracking-tight leading-none text-center truncate max-w-[58px] ${
                        isActive ? 'font-semibold text-[#93C5FD]' : 'font-medium text-[#76849D]'
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
            className="w-[62px] h-[50px] mx-auto flex flex-col items-center justify-center rounded-xl text-[#76849D] hover:text-rose-400 hover:bg-[#1A1222] transition-colors"
          >
            <LogOut className="w-[18px] h-[18px] mb-1 stroke-[1.8]" />
            <span className="text-[10px] font-medium leading-none">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};
