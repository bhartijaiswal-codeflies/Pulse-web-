import React, { useState } from 'react';
import { Sparkles, Calendar, PartyPopper, CheckCircle2, ChevronRight, Bell } from 'lucide-react';
import { useToast } from '../../context/NotificationContext';

export const codefliesEventsData = [
  {
    id: 'evt-1',
    name: 'Fun Friday',
    shortName: 'Fun Friday',
    date: '14 Nov, 2026',
    time: '04:30 PM',
    isUpcomingSoon: true,
    tag: 'Fun & Games',
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
    date: '28 Oct, 2026',
    time: '02:00 PM',
    isUpcomingSoon: false,
    tag: 'Carnival',
    tagColor: 'bg-teal-100 text-teal-800 border-teal-200',
    ringColor: 'ring-teal-400',
    bgGradient: 'from-teal-400 to-emerald-600',
    iconEmoji: '🪔',
    activity: 'Rangoli Contest, Bay Decoration & Traditional Wear Day',
    venue: 'All Office Floors & Reception',
  },
  {
    id: 'evt-3',
    name: 'Diwali Celebration',
    shortName: 'Diwali Gala',
    date: '29 Oct, 2026',
    time: '05:00 PM',
    isUpcomingSoon: false,
    tag: 'Grand Puja',
    tagColor: 'bg-purple-100 text-purple-800 border-purple-200',
    ringColor: 'ring-purple-400',
    bgGradient: 'from-purple-500 to-indigo-600',
    iconEmoji: '✨',
    activity: 'Lakshmi Puja, Gift Distribution, Mithai & DJ Night',
    venue: 'Main Auditorium & Terrace',
  },
  {
    id: 'evt-4',
    name: 'Holi Colors Fest',
    shortName: 'Holi Fest',
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
  const [selectedEventId, setSelectedEventId] = useState('evt-1');
  const [rsvpdEvents, setRsvpdEvents] = useState(['evt-1']);

  const activeEvent = codefliesEventsData.find((e) => e.id === selectedEventId) || codefliesEventsData[0];

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
            <h3 className="font-bold text-[#172033] text-sm">Codeflies Events</h3>
            <p className="text-[11px] text-[#8292AD]">Company Culture & Celebrations</p>
          </div>
        </div>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
          {codefliesEventsData.length} upcoming
        </span>
      </div>

      {/* Circular Celebrations Display (matching Birthday / Anniversary format) */}
      <div className="my-3.5 flex items-center justify-around gap-2">
        {codefliesEventsData.map((item) => {
          const isSelected = item.id === selectedEventId;
          const isRsvpd = rsvpdEvents.includes(item.id);

          return (
            <div
              key={item.id}
              onClick={() => setSelectedEventId(item.id)}
              className="flex flex-col items-center group cursor-pointer text-center"
              title={`View ${item.name}`}
            >
              {/* Circle Avatar with Event Emoji & Vibrant Gradient */}
              <div className="relative">
                <div
                  className={`w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br ${item.bgGradient} flex items-center justify-center text-2xl shadow-xs transition-transform group-hover:scale-105 ring-2 ${
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
                className={`text-xs font-bold mt-2 truncate max-w-[80px] transition-colors ${
                  isSelected ? 'text-[#2563EB]' : 'text-[#172033] group-hover:text-[#2563EB]'
                }`}
              >
                {item.shortName}
              </p>

              {/* Date Badge */}
              <span
                className={`text-[9.5px] font-semibold mt-0.5 px-2 py-0.5 rounded-full ${
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
      <div className="p-2.5 rounded-xl bg-gradient-to-r from-[#F8FAFC] to-purple-50/40 border border-[#E5EAF2] flex items-center justify-between gap-2 text-xs">
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
        </div>

        <button
          type="button"
          onClick={() => handleRSVP(activeEvent)}
          className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-colors cursor-pointer flex-shrink-0 shadow-2xs ${
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

