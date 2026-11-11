import React, { useState, useRef } from 'react';
import {
  Sparkles,
  Calendar,
  PartyPopper,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Filter,
} from 'lucide-react';
import { useToast } from '../../context/NotificationContext';

export const codefliesEventsData = [
  {
    id: 'evt-1',
    name: 'Fun Friday Extravaganza',
    shortName: 'Fun Friday',
    month: 'November',
    monthKey: 'nov',
    date: '14 Nov, 2026',
    time: '04:30 PM',
    isUpcomingSoon: true,
    tag: 'Games & Fun',
    tagColor: 'bg-amber-100 text-amber-800 border-amber-200',
    ringColor: 'ring-amber-400',
    bgGradient: 'from-amber-400 to-orange-500',
    iconEmoji: '🍕',
    activity: 'Team Trivia, VR Gaming Lounge & Pizza Evening',
    venue: 'Cafeteria & Recreation Zone',
  },
  {
    id: 'evt-2',
    name: 'Pre-Diwali Activities',
    shortName: 'Pre-Diwali',
    month: 'November',
    monthKey: 'nov',
    date: '19 Nov, 2026',
    time: '02:00 PM',
    isUpcomingSoon: true,
    tag: 'Office Fest',
    tagColor: 'bg-teal-100 text-teal-800 border-teal-200',
    ringColor: 'ring-teal-400',
    bgGradient: 'from-teal-400 to-emerald-600',
    iconEmoji: '🪔',
    activity: 'Rangoli Contest, Bay Decoration & Traditional Wear Day',
    venue: 'All Office Floors & Reception',
  },
  {
    id: 'evt-3',
    name: 'Diwali Grand Gala & Puja',
    shortName: 'Diwali Gala',
    month: 'November',
    monthKey: 'nov',
    date: '20 Nov, 2026',
    time: '05:00 PM',
    isUpcomingSoon: true,
    tag: 'Celebration',
    tagColor: 'bg-purple-100 text-purple-800 border-purple-200',
    ringColor: 'ring-purple-400',
    bgGradient: 'from-purple-500 to-indigo-600',
    iconEmoji: '✨',
    activity: 'Lakshmi Puja, Gift Distribution, Mithai & DJ Night',
    venue: 'Main Auditorium & Terrace',
  },
  {
    id: 'evt-4',
    name: 'Thanksgiving Potluck Feast',
    shortName: 'Thanksgiving',
    month: 'November',
    monthKey: 'nov',
    date: '25 Nov, 2026',
    time: '01:00 PM',
    isUpcomingSoon: false,
    tag: 'Potluck & Games',
    tagColor: 'bg-orange-100 text-orange-800 border-orange-200',
    ringColor: 'ring-orange-400',
    bgGradient: 'from-orange-400 to-amber-600',
    iconEmoji: '🦃',
    activity: 'Community Potluck Feast, Gratitude Wall & Dessert Buffet',
    venue: 'Central Dining Hall',
  },
  {
    id: 'evt-5',
    name: 'Codeflies Tech Hackathon',
    shortName: 'Hackathon',
    month: 'November',
    monthKey: 'nov',
    date: '28 Nov, 2026',
    time: '10:00 AM',
    isUpcomingSoon: false,
    tag: 'Innovation',
    tagColor: 'bg-blue-100 text-blue-800 border-blue-200',
    ringColor: 'ring-blue-400',
    bgGradient: 'from-blue-500 to-cyan-600',
    iconEmoji: '💻',
    activity: '24hr Product Innovation Sprint, Mentorship & Cash Awards',
    venue: 'Tech Floor 3 & Zoom',
  },
  {
    id: 'evt-6',
    name: 'Winter Fest & Secret Santa',
    shortName: 'Secret Santa',
    month: 'December',
    monthKey: 'dec',
    date: '24 Dec, 2026',
    time: '03:00 PM',
    isUpcomingSoon: false,
    tag: 'Winter Fest',
    tagColor: 'bg-rose-100 text-rose-800 border-rose-200',
    ringColor: 'ring-rose-400',
    bgGradient: 'from-rose-500 to-red-600',
    iconEmoji: '🎄',
    activity: 'Secret Santa Gift Exchange, Caroling & Plum Cake Cutting',
    venue: 'Townhall Stage',
  },
  {
    id: 'evt-7',
    name: 'New Year Kickoff & Townhall',
    shortName: 'New Year Gala',
    month: 'January',
    monthKey: 'jan',
    date: '08 Jan, 2027',
    time: '04:00 PM',
    isUpcomingSoon: false,
    tag: 'Annual Awards',
    tagColor: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    ringColor: 'ring-indigo-400',
    bgGradient: 'from-indigo-500 to-purple-600',
    iconEmoji: '🥂',
    activity: 'Leadership Vision 2027, Excellence Awards & Gala Dinner',
    venue: 'Grand Ballroom',
  },
  {
    id: 'evt-8',
    name: 'Holi Colors & Drench Fest',
    shortName: 'Holi Fest',
    month: 'March',
    monthKey: 'mar',
    date: '24 Mar, 2027',
    time: '03:30 PM',
    isUpcomingSoon: false,
    tag: 'Colors Bash',
    tagColor: 'bg-pink-100 text-pink-800 border-pink-200',
    ringColor: 'ring-pink-400',
    bgGradient: 'from-pink-500 to-rose-600',
    iconEmoji: '🎨',
    activity: 'Organic Gulal, Thandai Bar, Live Dhol & Colors Drench',
    venue: 'Open Lawns & Courtyard',
  },
];

export const CodefliesEventsCard = () => {
  const { addToast } = useToast();
  const [selectedMonth, setSelectedMonth] = useState('all'); // 'all', 'nov', 'dec', 'jan', 'mar'
  const [selectedEventId, setSelectedEventId] = useState('evt-1');
  const [rsvpdEvents, setRsvpdEvents] = useState(['evt-1', 'evt-2']);

  // Filter events based on month selection:
  // 'all' shows the primary 6 cards.
  // 'nov' shows the monthly 5 cards for November!
  const filteredEvents =
    selectedMonth === 'all'
      ? codefliesEventsData.slice(0, 6)
      : selectedMonth === 'nov'
      ? codefliesEventsData.filter((e) => e.monthKey === 'nov')
      : codefliesEventsData.filter((e) => e.monthKey === selectedMonth);

  const activeEvent =
    codefliesEventsData.find((e) => e.id === selectedEventId) || filteredEvents[0] || codefliesEventsData[0];

  const handleRSVP = (evt) => {
    if (rsvpdEvents.includes(evt.id)) {
      setRsvpdEvents((prev) => prev.filter((id) => id !== evt.id));
      addToast({
        title: 'RSVP Cancelled',
        message: `Your participation for ${evt.name} has been updated.`,
        type: 'info',
      });
    } else {
      setRsvpdEvents((prev) => [...prev, evt.id]);
      addToast({
        title: `RSVP Confirmed! ${evt.iconEmoji}`,
        message: `You are booked for Codeflies ${evt.name} on ${evt.date}.`,
        type: 'success',
      });
    }
  };

  return (
    <div className="bg-white border border-[#E5EAF2] rounded-2xl p-5 shadow-card hover:shadow-subtle transition-all flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#E5EAF2]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shadow-2xs">
            <PartyPopper className="w-4 h-4 text-purple-600" />
          </div>
          <div>
            <h3 className="font-bold text-[#172033] text-sm">Upcoming Codeflies Events</h3>
            <p className="text-[11px] text-[#8292AD]">Company Celebrations & Culture</p>
          </div>
        </div>

        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
          {filteredEvents.length} Events ({selectedMonth === 'all' ? '6 Cards' : selectedMonth.toUpperCase()})
        </span>
      </div>

      {/* Monthly Filter Tabs: All (6 Cards) or Monthly 4-5 Cards (No scroll, wraps naturally) */}
      <div className="flex items-center flex-wrap gap-1.5 pt-2.5 pb-1">
        <button
          type="button"
          onClick={() => setSelectedMonth('all')}
          className={`px-2.5 py-0.5 text-[10.5px] font-bold rounded-lg transition-colors cursor-pointer ${
            selectedMonth === 'all'
              ? 'bg-[#2563EB] text-white shadow-xs'
              : 'bg-[#F8FAFC] text-[#64748B] hover:text-[#172033] hover:bg-slate-100 border border-[#E5EAF2]'
          }`}
        >
          All (6 Cards)
        </button>
        <button
          type="button"
          onClick={() => setSelectedMonth('nov')}
          className={`px-2.5 py-0.5 text-[10.5px] font-bold rounded-lg transition-colors cursor-pointer ${
            selectedMonth === 'nov'
              ? 'bg-[#2563EB] text-white shadow-xs'
              : 'bg-[#F8FAFC] text-[#64748B] hover:text-[#172033] hover:bg-slate-100 border border-[#E5EAF2]'
          }`}
        >
          Nov (5 Cards)
        </button>
        <button
          type="button"
          onClick={() => setSelectedMonth('dec')}
          className={`px-2 py-0.5 text-[10.5px] font-bold rounded-lg transition-colors cursor-pointer ${
            selectedMonth === 'dec'
              ? 'bg-[#2563EB] text-white shadow-xs'
              : 'bg-[#F8FAFC] text-[#64748B] hover:text-[#172033] hover:bg-slate-100 border border-[#E5EAF2]'
          }`}
        >
          Dec
        </button>
        <button
          type="button"
          onClick={() => setSelectedMonth('jan')}
          className={`px-2 py-0.5 text-[10.5px] font-bold rounded-lg transition-colors cursor-pointer ${
            selectedMonth === 'jan'
              ? 'bg-[#2563EB] text-white shadow-xs'
              : 'bg-[#F8FAFC] text-[#64748B] hover:text-[#172033] hover:bg-slate-100 border border-[#E5EAF2]'
          }`}
        >
          Jan
        </button>
        <button
          type="button"
          onClick={() => setSelectedMonth('mar')}
          className={`px-2 py-0.5 text-[10.5px] font-bold rounded-lg transition-colors cursor-pointer ${
            selectedMonth === 'mar'
              ? 'bg-[#2563EB] text-white shadow-xs'
              : 'bg-[#F8FAFC] text-[#64748B] hover:text-[#172033] hover:bg-slate-100 border border-[#E5EAF2]'
          }`}
        >
          Mar
        </button>
      </div>

      {/* Circular Celebrations Grid: 6 Cards (2 rows of 3) or 4-5 Cards (Zero scroll) */}
      <div className="my-3 grid grid-cols-3 gap-y-3.5 gap-x-2 justify-items-center w-full py-1">
        {filteredEvents.map((item) => {
          const isSelected = item.id === activeEvent.id;
          const isRsvpd = rsvpdEvents.includes(item.id);

          return (
            <div
              key={item.id}
              onClick={() => setSelectedEventId(item.id)}
              className="flex flex-col items-center group cursor-pointer text-center w-full"
              title={`View ${item.name}`}
            >
              {/* Circle Avatar with Event Emoji & Glow Ring */}
              <div className="relative">
                <div
                  className={`w-13 h-13 rounded-full bg-gradient-to-br ${item.bgGradient} flex items-center justify-center text-2xl shadow-xs transition-transform group-hover:scale-105 ring-2 ${
                    isSelected ? 'ring-offset-2 ring-[#2563EB] scale-105' : item.ringColor
                  }`}
                >
                  <span className="drop-shadow-sm select-none">{item.iconEmoji}</span>
                </div>

                {isRsvpd && (
                  <span
                    className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[9px] font-bold ring-2 ring-white shadow-xs"
                    title="RSVP Confirmed"
                  >
                    ✓
                  </span>
                )}
              </div>

              {/* Event Name */}
              <p
                className={`text-[11px] font-bold mt-1.5 truncate max-w-[85px] transition-colors ${
                  isSelected ? 'text-[#2563EB]' : 'text-[#172033] group-hover:text-[#2563EB]'
                }`}
              >
                {item.shortName}
              </p>

              {/* Date Badge */}
              <span
                className={`text-[9px] font-semibold mt-0.5 px-1.5 py-0.2 rounded-full whitespace-nowrap ${
                  item.isUpcomingSoon
                    ? 'bg-amber-100 text-amber-800 font-bold border border-amber-300'
                    : 'text-[#8292AD] bg-[#F7F9FC] border border-[#E5EAF2]'
                }`}
              >
                {item.date.split(',')[0]}
              </span>
            </div>
          );
        })}
      </div>

      {/* Selected Event Spotlight Strip */}
      <div className="p-3 rounded-xl bg-gradient-to-r from-[#F8FAFC] to-purple-50/40 border border-[#E5EAF2] flex items-center justify-between gap-2.5 text-xs">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-extrabold text-[#172033] text-xs">
              {activeEvent.name}
            </span>
            <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${activeEvent.tagColor}`}>
              {activeEvent.tag}
            </span>
          </div>
          <p className="text-[10.5px] text-[#64748B] font-medium truncate mt-0.5">
            {activeEvent.activity}
          </p>
          <div className="text-[10px] text-slate-500 font-medium flex items-center gap-1 mt-0.5">
            <span className="font-semibold text-purple-700">{activeEvent.date}</span>
            <span>•</span>
            <span>{activeEvent.time}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => handleRSVP(activeEvent)}
          className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-colors cursor-pointer flex-shrink-0 shadow-2xs ${
            rsvpdEvents.includes(activeEvent.id)
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 hover:bg-emerald-100'
              : 'bg-[#2563EB] text-white hover:bg-blue-700'
          }`}
        >
          {rsvpdEvents.includes(activeEvent.id) ? 'Joined ✓' : 'Join / RSVP'}
        </button>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-2.5 mt-2 border-t border-[#E5EAF2] text-xs">
        <span className="text-[#8292AD] text-[11px] flex items-center gap-1">
          <Calendar className="w-3 h-3 text-[#2563EB]" />
          <span>Next: {activeEvent.date}</span>
        </span>
        <button
          onClick={() => handleRSVP(activeEvent)}
          className="text-[#2563EB] hover:underline font-semibold text-xs flex items-center gap-0.5 cursor-pointer"
        >
          <span>View Activities</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
