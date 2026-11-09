import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Menu,
  Bell,
  Search,
  Calendar as CalendarIcon,
  User as UserIcon,
  Settings,
  LogOut,
  ChevronDown,
  CheckCircle2,
  Clock,
  Sparkles,
  X,
} from 'lucide-react';
import { currentUser, notificationsList } from '../../data/mockData';
import { useToast } from '../../context/NotificationContext';

export const Header = ({ onOpenMobileMenu, globalSearch, setGlobalSearch }) => {
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [notifications, setNotifications] = useState(notificationsList);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const notifRef = useRef(null);
  const profileRef = useRef(null);
  const searchInputRef = useRef(null);

  const unreadCount = notifications.filter((n) => n.unread).length;

  // Format today's date matching Reference Image 3: "Today: Nov 9, 2026"
  const formattedToday = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date());

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Global keyboard shortcut for search (⌘K or Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowMobileSearch(true);
        setTimeout(() => searchInputRef.current?.focus(), 50);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
    addToast({
      title: 'Notifications Cleared',
      message: 'All notifications marked as read.',
      type: 'info',
    });
  };

  const handleLogout = () => {
    setShowProfileMenu(false);
    addToast({
      title: 'Logged out successfully',
      message: 'You have been signed out of Pulse HR Dashboard.',
      type: 'info',
    });
    navigate('/');
  };

  return (
    <header className="h-16 bg-white border-b border-[#E5EAF2] sticky top-0 z-20 px-4 sm:px-6 flex items-center justify-between transition-colors">
      {/* Left: Mobile Menu Trigger + Global Search */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <button
          onClick={onOpenMobileMenu}
          className="md:hidden p-2 text-[#8292AD] hover:text-[#172033] hover:bg-[#F7F9FC] rounded-xl transition-colors"
          aria-label="Open mobile navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Desktop / Tablet Search */}
        <div className="relative w-full hidden sm:block">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8292AD] pointer-events-none" />
          <input
            ref={searchInputRef}
            type="text"
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            placeholder="Search employees, candidates, departments... [⌘K]"
            className="w-full pl-9 pr-14 py-2 bg-[#F7F9FC] text-sm text-[#172033] placeholder-[#8292AD] border border-transparent hover:border-[#E5EAF2] focus:border-[#2563EB] focus:bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/15 transition-all"
          />
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {globalSearch ? (
              <button
                onClick={() => setGlobalSearch('')}
                className="p-1 text-[#8292AD] hover:text-[#172033]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            ) : (
              <kbd className="hidden lg:inline-flex items-center px-1.5 py-0.5 text-[10px] font-semibold text-[#8292AD] bg-white border border-[#E5EAF2] rounded shadow-xs">
                ⌘K
              </kbd>
            )}
          </div>
        </div>

        {/* Mobile Search Toggle Button */}
        <button
          onClick={() => setShowMobileSearch(!showMobileSearch)}
          className="sm:hidden p-2 text-[#8292AD] hover:text-[#172033] hover:bg-[#F7F9FC] rounded-xl transition-colors"
          aria-label="Toggle mobile search"
        >
          <Search className="w-5 h-5" />
        </button>
      </div>

      {/* Right: Date, Notifications, Profile */}
      <div className="flex items-center gap-2 sm:gap-4 ml-4">
        {/* Current Date Display */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-[#F7F9FC] border border-[#E5EAF2] rounded-xl text-xs font-semibold text-[#172033]">
          <CalendarIcon className="w-3.5 h-3.5 text-[#2563EB]" />
          <span>Today: {formattedToday}</span>
        </div>

        {/* Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-[#8292AD] hover:text-[#172033] hover:bg-[#F7F9FC] rounded-xl transition-colors"
            aria-label="View notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white animate-pulse" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-[#E5EAF2] rounded-2xl shadow-dropdown z-50 overflow-hidden animate-fade-in">
              <div className="p-4 border-b border-[#E5EAF2] flex items-center justify-between bg-[#FCFDFE]">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-[#172033]">Notifications</h4>
                  {unreadCount > 0 && (
                    <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-blue-100 text-[#2563EB]">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-xs text-[#2563EB] hover:underline font-medium"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-[#E5EAF2]">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-3.5 hover:bg-[#F8FAFC] transition-colors flex items-start gap-3 ${
                      notif.unread ? 'bg-blue-50/30' : ''
                    }`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                        notif.unread ? 'bg-[#2563EB]' : 'bg-transparent'
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-[#172033]">{notif.title}</p>
                      <p className="text-[11px] text-[#8292AD] mt-0.5 line-clamp-2">
                        {notif.message}
                      </p>
                      <span className="text-[10px] text-[#8292AD] mt-1 block">{notif.time}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-2.5 text-center border-t border-[#E5EAF2] bg-[#FCFDFE]">
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-xs font-semibold text-[#8292AD] hover:text-[#172033]"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar & Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-[#F7F9FC] transition-colors focus:outline-none"
            aria-label="User profile menu"
          >
            <div className="relative">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-9 h-9 rounded-full object-cover ring-2 ring-white shadow-xs"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
            </div>

            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-bold text-[#172033] leading-snug">
                {currentUser.name}
              </span>
              <span className="text-[10px] text-[#8292AD] leading-tight font-medium">
                {currentUser.role}
              </span>
            </div>

            <ChevronDown className="w-3.5 h-3.5 text-[#8292AD] hidden md:block" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-[#E5EAF2] rounded-2xl shadow-dropdown z-50 overflow-hidden animate-fade-in">
              <div className="p-4 border-b border-[#E5EAF2] bg-[#FCFDFE]">
                <p className="text-xs font-bold text-[#172033]">{currentUser.name}</p>
                <p className="text-[11px] text-[#8292AD] truncate">{currentUser.email}</p>
                <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-100 text-[10px] font-semibold text-emerald-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  {currentUser.status}
                </div>
              </div>

              <div className="p-1.5">
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    navigate('/profile');
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[#172033] hover:bg-[#F7F9FC] rounded-lg transition-colors"
                >
                  <UserIcon className="w-4 h-4 text-[#8292AD]" />
                  <span>My Profile</span>
                </button>

                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    navigate('/profile?tab=settings');
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[#172033] hover:bg-[#F7F9FC] rounded-lg transition-colors"
                >
                  <Settings className="w-4 h-4 text-[#8292AD]" />
                  <span>Account Settings</span>
                </button>
              </div>

              <div className="p-1.5 border-t border-[#E5EAF2]">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4 text-rose-500" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Expandable Mobile Search Bar */}
      {showMobileSearch && (
        <div className="absolute inset-x-0 top-16 bg-white border-b border-[#E5EAF2] p-3 sm:hidden shadow-md animate-fade-in z-20 flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8292AD]" />
            <input
              type="text"
              autoFocus
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              placeholder="Search employees, candidates..."
              className="w-full pl-9 pr-8 py-2 bg-[#F7F9FC] text-sm text-[#172033] rounded-xl border border-[#E5EAF2] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
            />
            {globalSearch && (
              <button
                onClick={() => setGlobalSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-[#8292AD]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <button
            onClick={() => setShowMobileSearch(false)}
            className="text-xs font-semibold text-[#8292AD] px-2 py-1"
          >
            Cancel
          </button>
        </div>
      )}
    </header>
  );
};
