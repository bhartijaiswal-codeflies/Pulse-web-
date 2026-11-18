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
  Sun,
  Moon,
} from 'lucide-react';
import { currentUser, notificationsList } from '../../data/mockData';
import { useToast } from '../../context/NotificationContext';
import { useTheme } from '../../context/ThemeContext';

export const Header = ({ onOpenMobileMenu, globalSearch, setGlobalSearch }) => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { isDark, toggleTheme } = useTheme();

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

  const handleNotificationClick = (notif) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notif.id ? { ...n, unread: false } : n))
    );
    if (notif.type === 'leave') {
      navigate('/attendance');
      setShowNotifications(false);
    } else if (notif.type === 'candidate') {
      navigate('/hrms');
      setShowNotifications(false);
    } else if (notif.type === 'asset') {
      navigate('/assets');
      setShowNotifications(false);
    }
  };

  const handleDismissNotification = (e, notifId) => {
    e.stopPropagation();
    setNotifications((prev) => prev.filter((n) => n.id !== notifId));
  };

  const handleLogout = () => {
    setShowProfileMenu(false);
    addToast({
      title: 'Logged out successfully',
      message: 'You have been signed out of Pulse HR Dashboard.',
      type: 'info',
    });
    navigate('/login');
  };

  return (
    <header className="h-16 bg-white border-b border-[#E5EAF2] sticky top-0 z-40 px-4 sm:px-6 flex items-center justify-between transition-colors">
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

        {/* Dark / Light Mode Switcher (YouTube Style) */}
        <button
          onClick={() => toggleTheme(true)}
          className="relative p-2 text-[#8292AD] hover:text-[#172033] hover:bg-[#F7F9FC] rounded-xl transition-all duration-200 group cursor-pointer"
          aria-label={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
          title={isDark ? 'Appearance: Dark (Click to switch to Light mode)' : 'Appearance: Light (Click to switch to Dark mode)'}
        >
          {isDark ? (
            <Sun className="w-5 h-5 text-amber-500 group-hover:rotate-45 transition-transform" />
          ) : (
            <Moon className="w-5 h-5 text-[#2563EB] group-hover:-rotate-12 transition-transform" />
          )}
        </button>

        {/* Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-[#8292AD] hover:text-[#172033] hover:bg-[#F7F9FC] rounded-xl transition-colors cursor-pointer"
            aria-label="View notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white animate-pulse" />
            )}
          </button>

          {showNotifications && (
            <>
              {/* Mobile Backdrop Overlay (sm:hidden) */}
              <div
                className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 sm:hidden animate-fade-in"
                onClick={() => setShowNotifications(false)}
              />

              {/* Notification Panel: fixed full-width with safe margins on mobile, anchored dropdown on desktop */}
              <div
                className={`fixed inset-x-3.5 top-16 sm:inset-x-auto sm:absolute sm:right-0 sm:top-full sm:mt-2 w-auto sm:w-96 max-w-[calc(100vw-1.75rem)] sm:max-w-none rounded-2xl shadow-2xl sm:shadow-dropdown z-50 overflow-hidden animate-fade-in border ${
                  isDark
                    ? 'bg-[#0D152D] border-[#1E294B] text-slate-100'
                    : 'bg-white border-[#E5EAF2] text-[#172033]'
                }`}
              >
                {/* Panel Header */}
                <div
                  className={`p-3.5 sm:p-4 border-b flex items-center justify-between ${
                    isDark ? 'bg-[#0A1024] border-[#1E294B]' : 'bg-[#FCFDFE] border-[#E5EAF2]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#2563EB] flex items-center justify-center">
                      <Bell className="w-3.5 h-3.5" />
                    </div>
                    <h4 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-[#172033]'}`}>
                      Notifications
                    </h4>
                    {unreadCount > 0 && (
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-blue-100 text-[#2563EB]">
                        {unreadCount} new
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {unreadCount > 0 && (
                      <button
                        type="button"
                        onClick={handleMarkAllRead}
                        className="text-xs text-[#2563EB] hover:underline font-semibold cursor-pointer"
                      >
                        Mark all read
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setShowNotifications(false)}
                      className="p-1 rounded-lg text-slate-400 hover:text-slate-600 sm:hidden cursor-pointer"
                      aria-label="Close notifications"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Notifications List */}
                <div
                  className={`max-h-[60vh] sm:max-h-80 overflow-y-auto divide-y ${
                    isDark ? 'divide-[#1E294B]' : 'divide-[#E5EAF2]'
                  }`}
                >
                  {notifications.map((notif) => {
                    let IconComponent = Bell;
                    let iconBg = 'bg-blue-50 text-[#2563EB]';
                    if (notif.type === 'leave') {
                      IconComponent = CalendarIcon;
                      iconBg = 'bg-amber-50 text-amber-600';
                    } else if (notif.type === 'candidate') {
                      IconComponent = UserIcon;
                      iconBg = 'bg-teal-50 text-teal-600';
                    } else if (notif.type === 'birthday') {
                      IconComponent = Sparkles;
                      iconBg = 'bg-pink-50 text-pink-600';
                    }

                    return (
                      <div
                        key={notif.id}
                        onClick={() => handleNotificationClick(notif)}
                        className={`p-3.5 transition-colors flex items-start gap-3 cursor-pointer group ${
                          notif.unread
                            ? isDark
                              ? 'bg-blue-950/20 hover:bg-blue-950/40'
                              : 'bg-blue-50/40 hover:bg-blue-50/70'
                            : isDark
                            ? 'hover:bg-[#121A33]'
                            : 'hover:bg-[#F8FAFC]'
                        }`}
                      >
                        <div
                          className={`w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${iconBg}`}
                        >
                          <IconComponent className="w-3.5 h-3.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-1">
                            <p
                              className={`text-xs font-semibold leading-snug truncate ${
                                isDark ? 'text-white' : 'text-[#172033]'
                              }`}
                            >
                              {notif.title}
                            </p>
                            <button
                              type="button"
                              onClick={(e) => handleDismissNotification(e, notif.id)}
                              className="text-slate-400 hover:text-slate-600 p-0.5 opacity-60 group-hover:opacity-100 transition-opacity cursor-pointer"
                              title="Dismiss"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                          <p
                            className={`text-[11px] mt-0.5 line-clamp-2 leading-relaxed ${
                              isDark ? 'text-slate-400' : 'text-[#8292AD]'
                            }`}
                          >
                            {notif.message}
                          </p>
                          <div className="flex items-center gap-2 mt-1.5">
                            <span className="text-[10px] text-[#8292AD] flex items-center gap-1">
                              <Clock className="w-2.5 h-2.5" />
                              <span>{notif.time}</span>
                            </span>
                            {notif.unread && (
                              <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]" />
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {notifications.length === 0 && (
                    <div className="py-10 text-center text-slate-400">
                      <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-500 mb-2 opacity-80" />
                      <p className="text-xs font-bold text-slate-600">All caught up!</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">No new notifications</p>
                    </div>
                  )}
                </div>

                {/* Panel Footer */}
                <div
                  className={`p-2.5 text-center border-t ${
                    isDark ? 'bg-[#0A1024] border-[#1E294B]' : 'bg-[#FCFDFE] border-[#E5EAF2]'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setShowNotifications(false)}
                    className="text-xs font-bold text-[#8292AD] hover:text-[#172033] py-1 px-4 cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            </>
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
                  <span>Admin Profile</span>
                </button>

                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    navigate('/profile?tab=settings');
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[#172033] hover:bg-[#F7F9FC] rounded-lg transition-colors"
                >
                  <Settings className="w-4 h-4 text-[#8292AD]" />
                  <span>System Settings</span>
                </button>

                {/* Appearance: Dark / Light Mode (YouTube Style) */}
                <button
                  onClick={() => toggleTheme(true)}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-[#172033] hover:bg-[#F7F9FC] rounded-lg transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    {isDark ? (
                      <Moon className="w-4 h-4 text-[#8292AD]" />
                    ) : (
                      <Sun className="w-4 h-4 text-amber-500" />
                    )}
                    <span>Appearance: <strong className="font-bold">{isDark ? 'Dark theme' : 'Light theme'}</strong></span>
                  </div>
                  <div className={`w-8 h-4.5 rounded-full p-0.5 transition-colors ${isDark ? 'bg-[#008080]' : 'bg-[#CBD5E1]'}`}>
                    <div className={`w-3.5 h-3.5 rounded-full bg-white transition-transform ${isDark ? 'translate-x-3.5' : 'translate-x-0'}`} />
                  </div>
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

