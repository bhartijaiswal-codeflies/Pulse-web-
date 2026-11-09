import React, { useState } from 'react';
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
} from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { Modal } from '../components/common/Modal';
import { calendarEvents } from '../data/mockData';
import { useToast } from '../context/NotificationContext';

export const Calendar = () => {
  const [events, setEvents] = useState(calendarEvents);
  const [viewMode, setViewMode] = useState('month'); // 'month', 'week', 'day'
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const { addToast } = useToast();

  // Add event form
  const [eventTitle, setEventTitle] = useState('');
  const [eventDate, setEventDate] = useState('2026-11-14');
  const [eventType, setEventType] = useState('company');
  const [startTime, setStartTime] = useState('11:00 AM');
  const [endTime, setEndTime] = useState('12:00 PM');
  const [location, setLocation] = useState('Conference Room A & Zoom');

  const handleCreateEvent = (e) => {
    e.preventDefault();
    if (!eventTitle.trim()) return;

    const newEvent = {
      id: `EVT-${Date.now().toString().slice(-4)}`,
      title: eventTitle.trim(),
      date: eventDate,
      startTime,
      endTime,
      type: eventType,
      location,
      color:
        eventType === 'holiday'
          ? 'bg-emerald-500 text-white'
          : eventType === 'birthday'
          ? 'bg-pink-500 text-white'
          : eventType === 'anniversary'
          ? 'bg-amber-500 text-white'
          : eventType === 'leave'
          ? 'bg-purple-500 text-white'
          : 'bg-[#2563EB] text-white',
    };

    setEvents((prev) => [newEvent, ...prev]);

    addToast({
      title: 'Event Scheduled',
      message: `"${newEvent.title}" added to organization calendar.`,
      type: 'success',
    });

    setShowAddModal(false);
    setEventTitle('');
  };

  const filteredEvents = events.filter((e) => {
    if (selectedCategory === 'all') return true;
    return e.type === selectedCategory;
  });

  const getEventBadge = (type) => {
    switch (type) {
      case 'holiday':
        return <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full">Holiday</span>;
      case 'birthday':
        return <span className="text-[10px] bg-pink-100 text-pink-800 font-semibold px-2 py-0.5 rounded-full">Birthday</span>;
      case 'anniversary':
        return <span className="text-[10px] bg-amber-100 text-amber-800 font-semibold px-2 py-0.5 rounded-full">Anniversary</span>;
      case 'leave':
        return <span className="text-[10px] bg-purple-100 text-purple-800 font-semibold px-2 py-0.5 rounded-full">Employee Leave</span>;
      default:
        return <span className="text-[10px] bg-blue-100 text-[#2563EB] font-semibold px-2 py-0.5 rounded-full">Company Event</span>;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <PageHeader
        title="Calendar"
        badgeText="Organization Schedule"
        subtitle="View company meetings, public holidays, team celebrations and planned time off."
        breadcrumbs={[{ label: 'Home', link: '/' }, { label: 'Calendar' }]}
        actions={
          <div className="flex items-center gap-2">
            <div className="inline-flex rounded-xl p-1 bg-white border border-[#E5EAF2]">
              {['month', 'week', 'day'].map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize transition-colors ${
                    viewMode === mode
                      ? 'bg-[#2563EB] text-white shadow-xs'
                      : 'text-[#8292AD] hover:text-[#172033]'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white shadow-sm transition-all active:scale-95 shadow-blue-500/20"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Schedule Event</span>
            </button>
          </div>
        }
      />

      {/* Categories Filter Pills */}
      <div className="flex items-center justify-between flex-wrap gap-3 bg-white p-4 rounded-2xl border border-[#E5EAF2] shadow-card">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-[#8292AD] mr-1 uppercase">Filter:</span>
          {[
            { id: 'all', label: 'All Items' },
            { id: 'company', label: 'Company Events' },
            { id: 'holiday', label: 'Holidays' },
            { id: 'birthday', label: 'Birthdays' },
            { id: 'anniversary', label: 'Anniversaries' },
            { id: 'leave', label: 'Leaves' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-[#2563EB] text-white shadow-xs'
                  : 'bg-[#F7F9FC] text-[#8292AD] hover:text-[#172033] hover:bg-slate-100'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-[#172033]">
          <button className="p-1 rounded-lg hover:bg-[#F7F9FC] border border-[#E5EAF2]">
            <ChevronLeft className="w-4 h-4 text-[#8292AD]" />
          </button>
          <span>November 2026</span>
          <button className="p-1 rounded-lg hover:bg-[#F7F9FC] border border-[#E5EAF2]">
            <ChevronRight className="w-4 h-4 text-[#8292AD]" />
          </button>
        </div>
      </div>

      {/* Main Calendar Grid Area */}
      <div className="bg-white border border-[#E5EAF2] rounded-2xl p-5 shadow-card overflow-hidden">
        {viewMode === 'month' && (
          <div>
            {/* Days of week */}
            <div className="grid grid-cols-7 gap-2 mb-2 text-center text-xs font-bold text-[#8292AD] uppercase tracking-wider">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                <div key={day} className="py-2 border-b border-[#E5EAF2]">
                  {day}
                </div>
              ))}
            </div>

            {/* Grid days */}
            <div className="grid grid-cols-7 gap-2 text-xs">
              {Array.from({ length: 35 }, (_, i) => {
                const dayNum = i - 1; // starts end of oct
                const isCurrentMonth = dayNum >= 1 && dayNum <= 30;
                const isToday = dayNum === 9;
                const dateKey = `2026-11-${String(dayNum).padStart(2, '0')}`;
                const daysEvents = filteredEvents.filter((e) => e.date === dateKey);

                return (
                  <div
                    key={i}
                    className={`min-h-[105px] p-2 rounded-xl border flex flex-col justify-between transition-all ${
                      !isCurrentMonth
                        ? 'bg-[#FBFDFE] border-[#F1F5F9] text-[#CBD5E1]'
                        : isToday
                        ? 'border-[#2563EB] bg-blue-50/20 ring-2 ring-blue-100'
                        : 'border-[#E5EAF2] hover:border-blue-200 hover:bg-[#FCFDFE]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className={`text-xs font-bold ${
                          isToday
                            ? 'w-6 h-6 rounded-full bg-[#2563EB] text-white flex items-center justify-center'
                            : isCurrentMonth
                            ? 'text-[#172033]'
                            : 'text-[#CBD5E1]'
                        }`}
                      >
                        {isCurrentMonth ? dayNum : dayNum < 1 ? 31 + dayNum : dayNum - 30}
                      </span>
                      {daysEvents.length > 0 && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]" />
                      )}
                    </div>

                    <div className="space-y-1 flex-1 overflow-y-auto">
                      {daysEvents.map((evt) => (
                        <div
                          key={evt.id}
                          onClick={() => setSelectedEvent(evt)}
                          className={`p-1.5 rounded-lg text-[10px] font-semibold truncate cursor-pointer transition-transform hover:scale-[1.02] shadow-xs ${evt.color}`}
                        >
                          {evt.title}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {viewMode === 'week' && (
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-[#172033] mb-2">Week of Nov 09 – Nov 15, 2026</h3>
            <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
              {['Mon 9', 'Tue 10', 'Wed 11', 'Thu 12', 'Fri 13', 'Sat 14', 'Sun 15'].map((col, idx) => {
                const dayNum = 9 + idx;
                const dateKey = `2026-11-${String(dayNum).padStart(2, '0')}`;
                const daysEvents = filteredEvents.filter((e) => e.date === dateKey);
                return (
                  <div key={col} className="p-3 bg-[#FBFDFE] border border-[#E5EAF2] rounded-xl min-h-[220px]">
                    <div className="font-bold text-xs text-[#172033] pb-2 border-b border-[#E5EAF2] mb-2">
                      {col}
                    </div>
                    <div className="space-y-2">
                      {daysEvents.map((evt) => (
                        <div
                          key={evt.id}
                          onClick={() => setSelectedEvent(evt)}
                          className={`p-2 rounded-lg text-xs font-semibold cursor-pointer shadow-xs ${evt.color}`}
                        >
                          <p className="truncate font-bold">{evt.title}</p>
                          <p className="text-[10px] opacity-90">{evt.startTime}</p>
                        </div>
                      ))}
                      {daysEvents.length === 0 && (
                        <p className="text-[11px] text-[#8292AD] italic">No events</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {viewMode === 'day' && (
          <div className="space-y-3 max-w-2xl mx-auto">
            <h3 className="text-sm font-bold text-[#172033] mb-2">Today's Schedule: Monday, Nov 09, 2026</h3>
            <div className="space-y-2.5">
              {filteredEvents.map((evt) => (
                <div
                  key={evt.id}
                  onClick={() => setSelectedEvent(evt)}
                  className="p-4 rounded-xl border border-[#E5EAF2] hover:border-blue-200 bg-[#FCFDFE] cursor-pointer flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-10 rounded-full ${evt.color.split(' ')[0]}`} />
                    <div>
                      <h4 className="text-sm font-bold text-[#172033]">{evt.title}</h4>
                      <div className="flex items-center gap-3 text-xs text-[#8292AD] mt-0.5">
                        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {evt.startTime} – {evt.endTime}</span>
                        <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {evt.location}</span>
                      </div>
                    </div>
                  </div>
                  {getEventBadge(evt.type)}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Schedule Event Modal */}
      {showAddModal && (
        <Modal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          title="Schedule New Event"
          subtitle="Publish meeting, holiday, or employee milestone to company calendar"
        >
          <form onSubmit={handleCreateEvent} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#172033] mb-1.5">
                Event Title *
              </label>
              <input
                type="text"
                required
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
                placeholder="e.g. Q4 Growth Review & Planning"
                className="w-full px-3.5 py-2 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#172033] mb-1.5">
                  Date
                </label>
                <input
                  type="date"
                  required
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#172033] mb-1.5">
                  Category
                </label>
                <select
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 bg-white"
                >
                  <option value="company">Company Event</option>
                  <option value="holiday">Holiday</option>
                  <option value="birthday">Birthday</option>
                  <option value="anniversary">Work Anniversary</option>
                  <option value="leave">Employee Leave</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#172033] mb-1.5">
                  Start Time
                </label>
                <input
                  type="text"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  placeholder="10:00 AM"
                  className="w-full px-3.5 py-2 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#172033] mb-1.5">
                  End Time
                </label>
                <input
                  type="text"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  placeholder="11:30 AM"
                  className="w-full px-3.5 py-2 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#172033] mb-1.5">
                Location / Conference Room
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Main Auditorium & Zoom Link"
                className="w-full px-3.5 py-2 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#E5EAF2]">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-xs rounded-xl border border-[#E5EAF2] text-[#8292AD] hover:bg-[#F7F9FC]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-semibold rounded-xl bg-[#2563EB] text-white hover:bg-blue-700 shadow-sm"
              >
                Save Event
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Event Details Modal */}
      {selectedEvent && (
        <Modal
          isOpen={!!selectedEvent}
          onClose={() => setSelectedEvent(null)}
          title="Event Details"
          subtitle={`Schedule: ${selectedEvent.date}`}
        >
          <div className="space-y-4">
            <div className="p-4 bg-[#F7F9FC] rounded-2xl border border-[#E5EAF2]">
              <div className="flex items-center justify-between mb-2">
                {getEventBadge(selectedEvent.type)}
                <span className="text-xs font-mono text-[#8292AD]">{selectedEvent.date}</span>
              </div>
              <h3 className="text-lg font-bold text-[#172033]">{selectedEvent.title}</h3>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl border border-[#E5EAF2] flex items-center gap-3">
                <Clock className="w-4 h-4 text-[#2563EB]" />
                <div>
                  <span className="text-[#8292AD] block">Time Window</span>
                  <span className="font-semibold text-[#172033]">{selectedEvent.startTime} – {selectedEvent.endTime}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl border border-[#E5EAF2] flex items-center gap-3">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <div>
                  <span className="text-[#8292AD] block">Meeting Location</span>
                  <span className="font-semibold text-[#172033]">{selectedEvent.location}</span>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

