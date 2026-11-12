import React, { useState, useMemo } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  MapPin,
  Users,
  Filter,
  CheckCircle2,
  Cake,
  Award,
  Palmtree,
  Sparkles,
  Search,
  Download,
  Share2,
  Video,
  ExternalLink,
  Trash2,
  Edit2,
  CalendarDays,
  List,
  Grid,
  Sun,
  X,
  Tag,
  Check,
  Building,
  Bell,
  ArrowRight,
} from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { Modal } from '../components/common/Modal';
import { calendarEvents as initialCalendarEvents } from '../data/mockData';
import { useToast } from '../context/NotificationContext';

const CALENDAR_STORAGE_KEY = 'pulse_calendar_events_v2';

// Enhanced initial event dataset with rich metadata
const defaultEnhancedEvents = [
  ...initialCalendarEvents,
  {
    id: 'EVT-8',
    title: 'Alexei Ivanov Birthday Celebration',
    date: '2026-11-12',
    startTime: '04:30 PM',
    endTime: '05:00 PM',
    type: 'birthday',
    location: '6th Floor Lounge & Virtual Hangout',
    color: 'bg-pink-500 text-white',
    description: 'Cake cutting and celebrations for Alexei in the common lounge.',
    attendees: 'Design & Engineering Teams',
  },
  {
    id: 'EVT-9',
    title: 'Michael Scott 3yr Work Anniversary',
    date: '2026-11-12',
    startTime: '03:00 PM',
    endTime: '03:30 PM',
    type: 'anniversary',
    location: 'Town Hall & Zoom',
    color: 'bg-amber-500 text-white',
    description: 'Celebrating 3 remarkable years of leadership and achievements.',
    attendees: 'Company Wide',
  },
  {
    id: 'EVT-10',
    title: 'Aisha Al-Mansoor Planned Leave',
    date: '2026-11-14',
    startTime: 'All Day',
    endTime: 'All Day',
    type: 'leave',
    location: 'Out of Office',
    color: 'bg-purple-500 text-white',
    description: 'Approved casual leave for personal commitments.',
    attendees: 'Marketing Team',
  },
  {
    id: 'EVT-11',
    title: 'Codeflies Tech All-Hands & Demo Day',
    date: '2026-11-20',
    startTime: '02:00 PM',
    endTime: '04:00 PM',
    type: 'company',
    location: 'Main Auditorium & Google Meet',
    color: 'bg-[#2563EB] text-white',
    description: 'Bi-weekly engineering demos, product roadmaps, and executive AMA.',
    attendees: 'All Personnel',
  },
  {
    id: 'EVT-12',
    title: 'Day After Thanksgiving (Paid Recess)',
    date: '2026-11-27',
    startTime: 'All Day',
    endTime: 'All Day',
    type: 'holiday',
    location: 'Global Offices Closed',
    color: 'bg-emerald-500 text-white',
    description: 'Official corporate extended holiday and paid long weekend.',
    attendees: 'Global Workforce',
  },
  {
    id: 'EVT-13',
    title: 'Winter Break & Christmas Eve',
    date: '2026-12-24',
    startTime: 'All Day',
    endTime: 'All Day',
    type: 'holiday',
    location: 'Global Offices Closed',
    color: 'bg-emerald-500 text-white',
    description: 'Year-end holiday festivities commence.',
    attendees: 'Global Workforce',
  },
  {
    id: 'EVT-14',
    title: 'Christmas Day Observed',
    date: '2026-12-25',
    startTime: 'All Day',
    endTime: 'All Day',
    type: 'holiday',
    location: 'Global Offices Closed',
    color: 'bg-emerald-500 text-white',
    description: 'Official federal public holiday.',
    attendees: 'Global Workforce',
  },
];

export const Calendar = () => {
  const { addToast } = useToast();

  // Events state with persistence
  const [events, setEvents] = useState(() => {
    const saved = localStorage.getItem(CALENDAR_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error(e);
      }
    }
    return defaultEnhancedEvents;
  });

  const saveEvents = (updatedList) => {
    setEvents(updatedList);
    localStorage.setItem(CALENDAR_STORAGE_KEY, JSON.stringify(updatedList));
  };

  // Dynamic Date Engine (Defaults to Nov 2026)
  const [currentDate, setCurrentDate] = useState(new Date(2026, 10, 1)); // November 2026

  // View mode: 'month' | 'week' | 'day' | 'agenda'
  const [viewMode, setViewMode] = useState('month');

  // Filters & Search
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingEventId, setEditingEventId] = useState(null);

  // Add/Edit Event form
  const [eventForm, setEventForm] = useState({
    title: '',
    date: '2026-11-12',
    startTime: '10:00 AM',
    endTime: '11:00 AM',
    type: 'company',
    location: 'Main Auditorium & Zoom Link',
    description: '',
    attendees: 'Company Wide',
  });

  // Month navigation handlers
  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleJumpToday = () => {
    // Jump to November 12, 2026 (the active portal date)
    setCurrentDate(new Date(2026, 10, 12));
  };

  // Month metadata
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth(); // 0-indexed
  const monthName = currentDate.toLocaleString('default', { month: 'long' });

  // Filtered Events logic
  const filteredEvents = useMemo(() => {
    return events.filter((e) => {
      const matchesCategory = selectedCategory === 'all' || e.type === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        e.title?.toLowerCase().includes(q) ||
        e.location?.toLowerCase().includes(q) ||
        e.attendees?.toLowerCase().includes(q) ||
        e.description?.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [events, selectedCategory, searchQuery]);

  // Calendar Matrix Generator for current month
  const calendarDays = useMemo(() => {
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();

    // Monday-based week: Mon = 0, Tue = 1, ... Sun = 6
    let startingDayOfWeek = firstDayOfMonth.getDay() - 1;
    if (startingDayOfWeek === -1) startingDayOfWeek = 6; // Sunday becomes 6

    const prevMonthLastDay = new Date(currentYear, currentMonth, 0).getDate();

    const days = [];

    // Preceding overflow days from previous month
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const day = prevMonthLastDay - i;
      const m = currentMonth === 0 ? 12 : currentMonth;
      const y = currentMonth === 0 ? currentYear - 1 : currentYear;
      const dateKey = `${y}-${String(m).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      days.push({
        dayNumber: day,
        dateKey,
        isCurrentMonth: false,
        isToday: false,
      });
    }

    // Current month days
    for (let d = 1; d <= daysInMonth; d++) {
      const dateKey = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      // In our mock timeline, 12 Nov 2026 is Today
      const isToday = currentYear === 2026 && currentMonth === 10 && d === 12;
      days.push({
        dayNumber: d,
        dateKey,
        isCurrentMonth: true,
        isToday,
      });
    }

    // Succeeding overflow days into next month to complete standard 35 or 42 grid
    const totalSlots = days.length > 35 ? 42 : 35;
    const remainingSlots = totalSlots - days.length;
    for (let n = 1; n <= remainingSlots; n++) {
      const m = currentMonth === 11 ? 1 : currentMonth + 2;
      const y = currentMonth === 11 ? currentYear + 1 : currentYear;
      const dateKey = `${y}-${String(m).padStart(2, '0')}-${String(n).padStart(2, '0')}`;
      days.push({
        dayNumber: n,
        dateKey,
        isCurrentMonth: false,
        isToday: false,
      });
    }

    return days;
  }, [currentYear, currentMonth]);

  // Executive Metric Counts for the current view month
  const metrics = useMemo(() => {
    const monthPrefix = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`;
    const monthEvts = events.filter((e) => e.date?.startsWith(monthPrefix));

    return {
      total: monthEvts.length,
      company: monthEvts.filter((e) => e.type === 'company').length,
      holidays: monthEvts.filter((e) => e.type === 'holiday').length,
      birthdays: monthEvts.filter((e) => e.type === 'birthday').length,
      anniversaries: monthEvts.filter((e) => e.type === 'anniversary').length,
      leaves: monthEvts.filter((e) => e.type === 'leave').length,
    };
  }, [events, currentYear, currentMonth]);

  // Color generator for category
  const getEventStyles = (type) => {
    switch (type) {
      case 'holiday':
        return {
          pill: 'bg-emerald-50 text-emerald-800 border border-emerald-200/80 hover:bg-emerald-100',
          dot: 'bg-emerald-500',
          badge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
          label: 'Public Holiday',
          icon: Palmtree,
        };
      case 'birthday':
        return {
          pill: 'bg-pink-50 text-pink-800 border border-pink-200/80 hover:bg-pink-100',
          dot: 'bg-pink-500',
          badge: 'bg-pink-100 text-pink-800 border-pink-200',
          label: 'Birthday',
          icon: Cake,
        };
      case 'anniversary':
        return {
          pill: 'bg-amber-50 text-amber-800 border border-amber-200/80 hover:bg-amber-100',
          dot: 'bg-amber-500',
          badge: 'bg-amber-100 text-amber-800 border-amber-200',
          label: 'Anniversary',
          icon: Award,
        };
      case 'leave':
        return {
          pill: 'bg-purple-50 text-purple-800 border border-purple-200/80 hover:bg-purple-100',
          dot: 'bg-purple-500',
          badge: 'bg-purple-100 text-purple-800 border-purple-200',
          label: 'Employee Leave',
          icon: CalendarIcon,
        };
      default:
        return {
          pill: 'bg-blue-50 text-[#1D4ED8] border border-blue-200/80 hover:bg-blue-100',
          dot: 'bg-[#2563EB]',
          badge: 'bg-blue-100 text-[#1D4ED8] border-blue-200',
          label: 'Company Event',
          icon: Building,
        };
    }
  };

  // Open Add modal with optional prefilled date
  const handleOpenAddEvent = (presetDate = null) => {
    setEditingEventId(null);
    setEventForm({
      title: '',
      date: presetDate || `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-12`,
      startTime: '10:00 AM',
      endTime: '11:00 AM',
      type: 'company',
      location: 'Conference Room A & Zoom',
      description: '',
      attendees: 'Company Wide',
    });
    setShowAddModal(true);
  };

  // Open Edit event
  const handleOpenEditEvent = (evt) => {
    setEditingEventId(evt.id);
    setEventForm({
      title: evt.title,
      date: evt.date,
      startTime: evt.startTime,
      endTime: evt.endTime,
      type: evt.type,
      location: evt.location,
      description: evt.description || '',
      attendees: evt.attendees || 'Team Members',
    });
    setSelectedEvent(null);
    setShowAddModal(true);
  };

  // Save Event (Add or Edit)
  const handleSaveEvent = (e) => {
    e.preventDefault();
    if (!eventForm.title.trim()) {
      addToast({ title: 'Title Required', message: 'Please enter an event title.', type: 'warning' });
      return;
    }

    if (editingEventId) {
      const updated = events.map((item) =>
        item.id === editingEventId
          ? {
              ...item,
              ...eventForm,
              color:
                eventForm.type === 'holiday'
                  ? 'bg-emerald-500 text-white'
                  : eventForm.type === 'birthday'
                  ? 'bg-pink-500 text-white'
                  : eventForm.type === 'anniversary'
                  ? 'bg-amber-500 text-white'
                  : eventForm.type === 'leave'
                  ? 'bg-purple-500 text-white'
                  : 'bg-[#2563EB] text-white',
            }
          : item
      );
      saveEvents(updated);
      addToast({
        title: 'Event Updated ✓',
        message: `"${eventForm.title}" changes saved.`,
        type: 'success',
      });
    } else {
      const newEvt = {
        id: `EVT-${Date.now().toString().slice(-4)}`,
        ...eventForm,
        color:
          eventForm.type === 'holiday'
            ? 'bg-emerald-500 text-white'
            : eventForm.type === 'birthday'
            ? 'bg-pink-500 text-white'
            : eventForm.type === 'anniversary'
            ? 'bg-amber-500 text-white'
            : eventForm.type === 'leave'
            ? 'bg-purple-500 text-white'
            : 'bg-[#2563EB] text-white',
      };
      saveEvents([newEvt, ...events]);
      addToast({
        title: 'Event Scheduled ✓',
        message: `"${newEvt.title}" added to organizational schedule.`,
        type: 'success',
      });
    }

    setShowAddModal(false);
  };

  // Delete Event
  const handleDeleteEvent = (id, title) => {
    const updated = events.filter((e) => e.id !== id);
    saveEvents(updated);
    addToast({
      title: 'Event Removed',
      message: `"${title}" has been deleted from calendar.`,
      type: 'info',
    });
    setSelectedEvent(null);
  };

  // Export iCalendar / ICS file
  const handleExportICS = () => {
    let icsContent = `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Pulse HRMS//Organization Calendar//EN\nCALSCALE:GREGORIAN\n`;
    events.forEach((evt) => {
      const cleanDate = evt.date.replace(/-/g, '');
      icsContent += `BEGIN:VEVENT\nSUMMARY:${evt.title}\nDTSTART;VALUE=DATE:${cleanDate}\nDESCRIPTION:${evt.description || evt.title}\nLOCATION:${evt.location || 'HQ'}\nSTATUS:CONFIRMED\nEND:VEVENT\n`;
    });
    icsContent += `END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Pulse_Organization_Calendar_${monthName}_${currentYear}.ics`;
    link.click();

    addToast({
      title: 'Calendar Exported',
      message: 'iCal (.ics) file downloaded for Google / Apple / Outlook calendar sync.',
      type: 'success',
    });
  };

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* 1. Header with Mode Switcher & Primary Action */}
      <PageHeader
        title="Calendar"
        badgeText="Organization Schedule"
        subtitle="Coordinate company all-hands, national holidays, birthdays, anniversaries, and approved time-offs."
        breadcrumbs={[{ label: 'Home', link: '/' }, { label: 'Calendar' }]}
        actions={
          <div className="flex items-center gap-2 flex-wrap">
            {/* View Mode Toggle Pill Bar */}
            <div className="inline-flex items-center h-9 rounded-xl p-1 bg-white border border-[#E5EAF2] shadow-2xs">
              {[
                { id: 'month', label: 'Month', icon: Grid },
                { id: 'week', label: 'Week', icon: CalendarDays },
                { id: 'day', label: 'Day', icon: Clock },
                { id: 'agenda', label: 'Agenda', icon: List },
              ].map((m) => {
                const Icon = m.icon;
                const isSelected = viewMode === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => setViewMode(m.id)}
                    className={`h-7 px-3 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? 'bg-[#2563EB] text-white shadow-xs'
                        : 'text-[#8292AD] hover:text-[#172033] hover:bg-slate-50'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span className="capitalize">{m.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Export ICS Button */}
            <button
              onClick={handleExportICS}
              className="inline-flex items-center gap-1.5 px-3 h-9 text-xs font-bold rounded-xl bg-white border border-[#E5EAF2] text-[#172033] hover:bg-slate-50 shadow-2xs transition-all cursor-pointer"
              title="Export calendar to Google / Outlook / Apple Calendar"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Sync .ICS</span>
            </button>

            {/* Schedule Event Button */}
            <button
              onClick={() => handleOpenAddEvent()}
              className="inline-flex items-center gap-1.5 px-4 h-9 text-xs font-bold rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white shadow-sm transition-all active:scale-95 shadow-blue-500/20 cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Schedule Event</span>
            </button>
          </div>
        }
      />

      {/* 2. Top Executive Pulse Cards (4 Top Highlights) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Company Meetings */}
        <div
          onClick={() => setSelectedCategory('company')}
          className="p-4 rounded-2xl bg-white border border-[#E5EAF2] shadow-card hover:border-blue-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#8292AD] uppercase tracking-wider">Company Events</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center group-hover:scale-110 transition-transform">
              <Building className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#172033] mt-2">{metrics.company}</div>
          <div className="text-[11px] text-blue-600 font-semibold mt-0.5 flex items-center gap-1">
            <span>All-Hands & Demos</span>
            <ArrowRight className="w-3 h-3 opacity-60" />
          </div>
        </div>

        {/* Card 2: Public Holidays */}
        <div
          onClick={() => setSelectedCategory('holiday')}
          className="p-4 rounded-2xl bg-white border border-[#E5EAF2] shadow-card hover:border-emerald-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#8292AD] uppercase tracking-wider">Public Holidays</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Palmtree className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-950 mt-2">{metrics.holidays}</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-0.5 flex items-center gap-1">
            <span>Thanksgiving & Recess</span>
            <ArrowRight className="w-3 h-3 opacity-60" />
          </div>
        </div>

        {/* Card 3: Team Celebrations */}
        <div
          onClick={() => setSelectedCategory('birthday')}
          className="p-4 rounded-2xl bg-white border border-[#E5EAF2] shadow-card hover:border-pink-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#8292AD] uppercase tracking-wider">Birthdays & Anniversaries</span>
            <div className="w-8 h-8 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Cake className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#172033] mt-2">
            {metrics.birthdays + metrics.anniversaries}
          </div>
          <div className="text-[11px] text-pink-600 font-semibold mt-0.5 flex items-center gap-1">
            <span>Team Milestones</span>
            <ArrowRight className="w-3 h-3 opacity-60" />
          </div>
        </div>

        {/* Card 4: Employee Leaves */}
        <div
          onClick={() => setSelectedCategory('leave')}
          className="p-4 rounded-2xl bg-white border border-[#E5EAF2] shadow-card hover:border-purple-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#8292AD] uppercase tracking-wider">Planned Leaves</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#172033] mt-2">{metrics.leaves}</div>
          <div className="text-[11px] text-purple-600 font-semibold mt-0.5 flex items-center gap-1">
            <span>Approved Time Off</span>
            <ArrowRight className="w-3 h-3 opacity-60" />
          </div>
        </div>
      </div>

      {/* 3. Interactive Toolbar: Month Controls, Search & Category Filters */}
      <div className="bg-white p-4 rounded-2xl border border-[#E5EAF2] shadow-card flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        {/* Left: Month Navigator & Quick Jump */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1 border border-[#E5EAF2] rounded-xl p-0.5 bg-slate-50/50">
            <button
              onClick={handlePrevMonth}
              className="p-1.5 rounded-lg hover:bg-white text-slate-700 transition-colors cursor-pointer"
              title="Previous Month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleJumpToday}
              className="px-2.5 py-1 text-xs font-bold rounded-lg hover:bg-white text-[#2563EB] transition-colors cursor-pointer"
              title="Jump to Today (Nov 12, 2026)"
            >
              Today
            </button>
            <button
              onClick={handleNextMonth}
              className="p-1.5 rounded-lg hover:bg-white text-slate-700 transition-colors cursor-pointer"
              title="Next Month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <h2 className="text-base sm:text-lg font-black text-[#172033] tracking-tight">
            {monthName} {currentYear}
          </h2>

          <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-extrabold bg-blue-50 text-[#2563EB] border border-blue-200 shadow-2xs">
            {filteredEvents.length} Events
          </span>
        </div>

        {/* Center: Search Filter */}
        <div className="relative w-full xl:w-64 min-w-[200px]">
          <input
            type="text"
            placeholder="Search events, room, attendees..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-7 py-2 text-xs rounded-xl border border-[#E5EAF2] bg-[#FBFDFE] text-[#172033] placeholder:text-[#8292AD] focus:outline-none focus:border-[#2563EB] focus:bg-white transition-all"
          />
          <Search className="w-3.5 h-3.5 text-[#8292AD] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Right: Category Chips */}
        <div className="flex items-center gap-1.5 flex-wrap overflow-x-auto no-scrollbar">
          {[
            { id: 'all', label: 'All Items' },
            { id: 'company', label: 'Company Events', color: 'bg-[#2563EB]' },
            { id: 'holiday', label: 'Holidays', color: 'bg-emerald-500' },
            { id: 'birthday', label: 'Birthdays', color: 'bg-pink-500' },
            { id: 'anniversary', label: 'Anniversaries', color: 'bg-amber-500' },
            { id: 'leave', label: 'Leaves', color: 'bg-purple-500' },
          ].map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? 'bg-[#172033] text-white shadow-xs'
                    : 'bg-[#F7F9FC] text-[#8292AD] hover:text-[#172033] hover:bg-slate-200/60'
                }`}
              >
                {cat.color && (
                  <span className={`w-2 h-2 rounded-full ${cat.color}`} />
                )}
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Main Calendar Content Area */}
      <div className="bg-white border border-[#E5EAF2] rounded-2xl shadow-card overflow-hidden">
        {/* VIEW 1: MONTH VIEW */}
        {viewMode === 'month' && (
          <div className="p-4 sm:p-5">
            {/* Weekday Column Headers (Mon to Sun) */}
            <div className="grid grid-cols-7 gap-2 mb-2 text-center text-xs font-extrabold text-[#8292AD] uppercase tracking-wider">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => (
                <div
                  key={day}
                  className={`py-2 border-b border-[#E5EAF2] ${
                    idx >= 5 ? 'text-amber-700/80 bg-amber-50/20 rounded-t-lg' : ''
                  }`}
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days Matrix */}
            <div className="grid grid-cols-7 gap-2 text-xs">
              {calendarDays.map((cell, idx) => {
                const daysEvents = filteredEvents.filter((e) => e.date === cell.dateKey);
                const isWeekend = idx % 7 === 5 || idx % 7 === 6;

                return (
                  <div
                    key={cell.dateKey + idx}
                    className={`min-h-[118px] sm:min-h-[128px] p-2 rounded-xl border flex flex-col justify-between transition-all group ${
                      !cell.isCurrentMonth
                        ? 'bg-[#FBFDFE] border-[#F1F5F9] text-[#CBD5E1] opacity-60'
                        : cell.isToday
                        ? 'border-[#2563EB] bg-blue-50/25 ring-2 ring-blue-500/20 shadow-xs'
                        : isWeekend
                        ? 'bg-amber-50/10 border-[#E5EAF2] hover:border-blue-300 hover:bg-[#FCFDFE]'
                        : 'border-[#E5EAF2] hover:border-blue-300 hover:bg-[#FCFDFE]'
                    }`}
                  >
                    {/* Day Cell Top Header */}
                    <div className="flex items-center justify-between mb-1.5">
                      <span
                        className={`text-xs font-bold ${
                          cell.isToday
                            ? 'w-6 h-6 rounded-full bg-[#2563EB] text-white flex items-center justify-center shadow-xs'
                            : cell.isCurrentMonth
                            ? isWeekend
                              ? 'text-amber-800/80'
                              : 'text-[#172033]'
                            : 'text-[#CBD5E1]'
                        }`}
                      >
                        {cell.dayNumber}
                      </span>

                      <div className="flex items-center gap-1">
                        {/* Quick Add Button on Hover */}
                        <button
                          type="button"
                          onClick={() => handleOpenAddEvent(cell.dateKey)}
                          title={`Schedule event on ${cell.dateKey}`}
                          className="opacity-0 group-hover:opacity-100 p-1 rounded-md text-slate-400 hover:text-[#2563EB] hover:bg-blue-50 transition-all cursor-pointer"
                        >
                          <Plus className="w-3 h-3 stroke-[2.5]" />
                        </button>

                        {daysEvents.length > 0 && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]" />
                        )}
                      </div>
                    </div>

                    {/* Events List in Day Cell */}
                    <div className="space-y-1.5 flex-1 overflow-hidden">
                      {daysEvents.slice(0, 3).map((evt) => {
                        const style = getEventStyles(evt.type);
                        return (
                          <div
                            key={evt.id}
                            onClick={() => setSelectedEvent(evt)}
                            title={`${evt.title} (${evt.startTime})`}
                            className={`px-1.5 py-1 rounded-lg text-[10.5px] font-bold truncate cursor-pointer transition-all hover:scale-[1.02] shadow-2xs flex items-center gap-1.5 ${style.pill}`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${style.dot}`} />
                            <span className="truncate">{evt.title}</span>
                          </div>
                        );
                      })}

                      {/* "+N More" badge if more than 3 events */}
                      {daysEvents.length > 3 && (
                        <button
                          type="button"
                          onClick={() => {
                            setCurrentDate(new Date(cell.dateKey));
                            setViewMode('day');
                          }}
                          className="text-[10px] font-bold text-[#2563EB] hover:underline block pt-0.5"
                        >
                          +{daysEvents.length - 3} more events
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* VIEW 2: WEEK VIEW */}
        {viewMode === 'week' && (
          <div className="p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5EAF2]">
              <h3 className="text-sm font-bold text-[#172033]">
                7-Day Chronological View • {monthName} {currentYear}
              </h3>
              <span className="text-xs text-[#8292AD]">Standard Working Days (Mon - Fri) + Weekend</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((dayLabel, idx) => {
                // In November 2026 week: Nov 09 - Nov 15
                const dayNum = 9 + idx;
                const dateKey = `2026-11-${String(dayNum).padStart(2, '0')}`;
                const daysEvents = filteredEvents.filter((e) => e.date === dateKey);
                const isToday = dayNum === 12;

                return (
                  <div
                    key={dayLabel}
                    className={`p-3.5 rounded-2xl border flex flex-col justify-between min-h-[300px] transition-all ${
                      isToday
                        ? 'border-[#2563EB] bg-blue-50/20 ring-2 ring-blue-500/20'
                        : 'bg-[#FBFDFE] border-[#E5EAF2]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between pb-2.5 border-b border-[#E5EAF2] mb-3">
                        <div>
                          <span className="text-[11px] font-bold text-[#8292AD] uppercase block">{dayLabel}</span>
                          <span className={`text-base font-black ${isToday ? 'text-[#2563EB]' : 'text-[#172033]'}`}>
                            Nov {dayNum}
                          </span>
                        </div>
                        {isToday && (
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-[#2563EB] text-white">
                            Today
                          </span>
                        )}
                      </div>

                      <div className="space-y-2">
                        {daysEvents.map((evt) => {
                          const style = getEventStyles(evt.type);
                          return (
                            <div
                              key={evt.id}
                              onClick={() => setSelectedEvent(evt)}
                              className={`p-2.5 rounded-xl text-xs font-semibold cursor-pointer shadow-2xs border transition-all hover:scale-[1.02] ${style.pill}`}
                            >
                              <div className="flex items-center gap-1.5 mb-1">
                                <span className={`w-2 h-2 rounded-full ${style.dot}`} />
                                <span className="font-extrabold text-[11px] truncate">{evt.title}</span>
                              </div>
                              <div className="flex items-center gap-1 text-[10px] text-slate-500">
                                <Clock className="w-3 h-3" />
                                <span>{evt.startTime}</span>
                              </div>
                            </div>
                          );
                        })}

                        {daysEvents.length === 0 && (
                          <div className="py-8 text-center text-[#8292AD] text-[11px] italic">
                            No events
                          </div>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleOpenAddEvent(dateKey)}
                      className="w-full mt-3 py-1.5 rounded-lg border border-dashed border-[#CBD5E1] text-[10px] font-bold text-[#8292AD] hover:text-[#2563EB] hover:border-blue-400 hover:bg-white transition-all flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add Event</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* VIEW 3: DAY VIEW */}
        {viewMode === 'day' && (
          <div className="p-5 max-w-3xl mx-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5EAF2]">
              <div>
                <span className="text-xs font-bold text-[#8292AD] uppercase tracking-wider block">Day Schedule</span>
                <h3 className="text-lg font-black text-[#172033]">Thursday, November 12, 2026</h3>
              </div>
              <button
                type="button"
                onClick={() => handleOpenAddEvent('2026-11-12')}
                className="px-3.5 py-1.5 text-xs font-bold rounded-xl bg-[#2563EB] text-white hover:bg-blue-700 flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Event Today</span>
              </button>
            </div>

            <div className="space-y-3">
              {filteredEvents
                .filter((e) => e.date === '2026-11-12' || e.date === '2026-11-10')
                .map((evt) => {
                  const style = getEventStyles(evt.type);
                  return (
                    <div
                      key={evt.id}
                      onClick={() => setSelectedEvent(evt)}
                      className="p-4 rounded-2xl border border-[#E5EAF2] hover:border-blue-300 bg-white hover:shadow-card transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="flex items-start gap-3.5">
                        <div className={`w-3 h-12 rounded-full flex-shrink-0 ${style.dot}`} />
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-sm font-bold text-[#172033]">{evt.title}</h4>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${style.badge}`}>
                              {style.label}
                            </span>
                          </div>

                          <div className="flex items-center gap-4 text-xs text-[#8292AD] mt-1.5 flex-wrap">
                            <span className="flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5 text-[#2563EB]" />
                              <span>{evt.startTime} – {evt.endTime}</span>
                            </span>
                            <span className="flex items-center gap-1.5">
                              <MapPin className="w-3.5 h-3.5 text-slate-500" />
                              <span>{evt.location}</span>
                            </span>
                            {evt.attendees && (
                              <span className="flex items-center gap-1.5">
                                <Users className="w-3.5 h-3.5 text-slate-500" />
                                <span>{evt.attendees}</span>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <button
                          type="button"
                          className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-blue-50 text-[#2563EB] text-xs font-bold border border-[#E5EAF2] transition-colors"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* VIEW 4: AGENDA / LIST VIEW */}
        {viewMode === 'agenda' && (
          <div className="p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5EAF2]">
              <div>
                <h3 className="text-sm font-bold text-[#172033]">Chronological Agenda Timeline</h3>
                <p className="text-xs text-[#8292AD]">Sequential list of company events, holidays and celebrations</p>
              </div>
              <span className="text-xs font-semibold text-[#8292AD]">
                Showing {filteredEvents.length} items
              </span>
            </div>

            <div className="space-y-3">
              {filteredEvents.map((evt) => {
                const style = getEventStyles(evt.type);
                const Icon = style.icon;
                return (
                  <div
                    key={evt.id}
                    onClick={() => setSelectedEvent(evt)}
                    className="p-4 rounded-2xl border border-[#E5EAF2] hover:border-blue-300 bg-white hover:shadow-card transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4">
                      {/* Date Badge */}
                      <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col items-center justify-center flex-shrink-0 text-center">
                        <span className="text-[10px] font-extrabold text-[#2563EB] uppercase">
                          {new Date(evt.date).toLocaleString('default', { month: 'short' })}
                        </span>
                        <span className="text-xl font-black text-[#172033]">
                          {evt.date.split('-')[2]}
                        </span>
                      </div>

                      {/* Content */}
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-sm font-bold text-[#172033]">{evt.title}</h4>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${style.badge}`}>
                            {style.label}
                          </span>
                        </div>

                        <p className="text-xs text-slate-600 mt-1 line-clamp-1">{evt.description || evt.location}</p>

                        <div className="flex items-center gap-4 text-xs text-[#8292AD] mt-1.5 flex-wrap">
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-[#2563EB]" />
                            <span>{evt.startTime} – {evt.endTime}</span>
                          </span>
                          <span className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-slate-500" />
                            <span>{evt.location}</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end md:self-center">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenEditEvent(evt);
                        }}
                        className="p-2 rounded-xl border border-[#E5EAF2] text-slate-600 hover:bg-slate-50 cursor-pointer"
                        title="Edit event"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteEvent(evt.id, evt.title);
                        }}
                        className="p-2 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 cursor-pointer"
                        title="Delete event"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* MODALS SECTION                                                           */}
      {/* ========================================================================= */}

      {/* Modal 1: Schedule / Edit Event Modal */}
      {showAddModal && (
        <Modal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          title={editingEventId ? 'Edit Event Schedule' : 'Schedule New Event'}
          subtitle="Publish meeting, public holiday, or employee milestone to company calendar"
          maxWidth="max-w-xl"
        >
          <form onSubmit={handleSaveEvent} className="space-y-4 text-xs">
            <div>
              <label className="block text-xs font-bold text-[#172033] mb-1">Event Title *</label>
              <input
                type="text"
                required
                value={eventForm.title}
                onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                placeholder="e.g. Q4 Growth Review & Planning"
                className="w-full px-3.5 py-2 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:border-[#2563EB]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-[#172033] mb-1">Event Date *</label>
                <input
                  type="date"
                  required
                  value={eventForm.date}
                  onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#172033] mb-1">Category Type</label>
                <select
                  value={eventForm.type}
                  onChange={(e) => setEventForm({ ...eventForm, type: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:border-[#2563EB] cursor-pointer"
                >
                  <option value="company">Company Event</option>
                  <option value="holiday">Public Holiday</option>
                  <option value="birthday">Team Birthday</option>
                  <option value="anniversary">Work Anniversary</option>
                  <option value="leave">Employee Leave</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#172033] mb-1">Start Time</label>
                <input
                  type="text"
                  value={eventForm.startTime}
                  onChange={(e) => setEventForm({ ...eventForm, startTime: e.target.value })}
                  placeholder="10:00 AM"
                  className="w-full px-3.5 py-2 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#172033] mb-1">End Time</label>
                <input
                  type="text"
                  value={eventForm.endTime}
                  onChange={(e) => setEventForm({ ...eventForm, endTime: e.target.value })}
                  placeholder="11:30 AM"
                  className="w-full px-3.5 py-2 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:border-[#2563EB]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#172033] mb-1">
                Location / Conference Room / Link
              </label>
              <input
                type="text"
                value={eventForm.location}
                onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                placeholder="Main Auditorium & Zoom Link"
                className="w-full px-3.5 py-2 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:border-[#2563EB]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#172033] mb-1">Target Attendees / Department</label>
              <input
                type="text"
                value={eventForm.attendees}
                onChange={(e) => setEventForm({ ...eventForm, attendees: e.target.value })}
                placeholder="e.g. Company Wide, Design Team, Engineering"
                className="w-full px-3.5 py-2 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:border-[#2563EB]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#172033] mb-1">Description / Agenda Notes</label>
              <textarea
                rows={3}
                value={eventForm.description}
                onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                placeholder="Add meeting agenda, celebration details, or instructions..."
                className="w-full px-3.5 py-2 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:border-[#2563EB]"
              />
            </div>

            <div className="flex justify-end gap-2.5 pt-3 border-t border-[#E5EAF2]">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-xs font-semibold rounded-xl border border-[#E5EAF2] text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white shadow-sm cursor-pointer"
              >
                {editingEventId ? 'Save Changes' : 'Schedule Event'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Modal 2: Event Dossier Details Modal */}
      {selectedEvent && (() => {
        const style = getEventStyles(selectedEvent.type);
        const Icon = style.icon;

        return (
          <Modal
            isOpen={!!selectedEvent}
            onClose={() => setSelectedEvent(null)}
            title="Event Schedule Dossier"
            subtitle={`Scheduled on ${selectedEvent.date}`}
            maxWidth="max-w-md"
          >
            <div className="space-y-4 text-xs">
              {/* Header Box */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50/80 to-indigo-50/50 border border-blue-100 flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-white text-[#2563EB] flex items-center justify-center shadow-xs flex-shrink-0">
                  <Icon className="w-5 h-5 text-[#2563EB]" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${style.badge}`}>
                      {style.label}
                    </span>
                    <span className="text-[11px] font-mono text-[#8292AD]">{selectedEvent.date}</span>
                  </div>
                  <h3 className="text-base font-extrabold text-[#172033] leading-snug">
                    {selectedEvent.title}
                  </h3>
                </div>
              </div>

              {/* Event Details Grid */}
              <div className="space-y-2.5 text-xs">
                <div className="p-3 rounded-xl border border-[#E5EAF2] flex items-center gap-3">
                  <Clock className="w-4 h-4 text-[#2563EB] flex-shrink-0" />
                  <div>
                    <span className="text-[10px] text-[#8292AD] uppercase font-bold block">Time Duration</span>
                    <span className="font-bold text-[#172033]">
                      {selectedEvent.startTime} – {selectedEvent.endTime}
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-xl border border-[#E5EAF2] flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <div>
                    <span className="text-[10px] text-[#8292AD] uppercase font-bold block">Meeting Location</span>
                    <span className="font-semibold text-[#172033]">{selectedEvent.location}</span>
                  </div>
                </div>

                {selectedEvent.attendees && (
                  <div className="p-3 rounded-xl border border-[#E5EAF2] flex items-center gap-3">
                    <Users className="w-4 h-4 text-purple-600 flex-shrink-0" />
                    <div>
                      <span className="text-[10px] text-[#8292AD] uppercase font-bold block">Target Attendees</span>
                      <span className="font-semibold text-[#172033]">{selectedEvent.attendees}</span>
                    </div>
                  </div>
                )}

                {selectedEvent.description && (
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-[#8292AD] uppercase font-bold block mb-1">Description</span>
                    <p className="text-xs text-slate-700 leading-relaxed">{selectedEvent.description}</p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between gap-2 pt-3 border-t border-[#E5EAF2]">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenEditEvent(selectedEvent)}
                    className="px-3 py-1.5 rounded-xl border border-[#E5EAF2] text-slate-700 hover:bg-slate-50 font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteEvent(selectedEvent.id, selectedEvent.title)}
                    className="px-3 py-1.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedEvent(null)}
                  className="px-4 py-1.5 text-xs font-bold rounded-xl bg-[#2563EB] text-white hover:bg-blue-700 cursor-pointer shadow-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </Modal>
        );
      })()}
    </div>
  );
};
