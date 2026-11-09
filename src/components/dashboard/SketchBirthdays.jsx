import React from 'react';
import { Cake, Send, Sparkles } from 'lucide-react';
import { useToast } from '../../context/NotificationContext';
import { upcomingBirthdays } from '../../data/mockData';

export const SketchBirthdays = () => {
  const { addToast } = useToast();

  const handleSendWish = (person) => {
    addToast({
      title: 'Birthday Wish Sent! 🎂',
      message: `Birthday greetings delivered to ${person.name}.`,
      type: 'success',
    });
  };

  return (
    <div className="bg-white border border-[#E5EAF2] rounded-2xl p-5 shadow-card flex flex-col justify-between">
      {/* Header matching Sketch: "celebrating birthdays" */}
      <div className="flex items-center justify-between pb-3 border-b border-[#E5EAF2]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center">
            <Cake className="w-4 h-4 stroke-[2.2]" />
          </div>
          <div>
            <h3 className="font-bold text-[#172033] text-sm">celebrating birthdays</h3>
            <p className="text-[11px] text-[#8292AD]">Upcoming Birthdays & Wishes</p>
          </div>
        </div>

        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-pink-50 text-pink-600 border border-pink-200">
          {upcomingBirthdays.length} this month
        </span>
      </div>

      {/* List with Circle Avatar O, Name, Date matching sketch */}
      <div className="my-3 space-y-2.5">
        {upcomingBirthdays.map((b) => (
          <div
            key={b.id}
            className="flex items-center justify-between p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E5EAF2] hover:bg-slate-100/70 transition-colors text-xs"
          >
            <div className="flex items-center gap-3 min-w-0">
              {/* Circle Avatar O */}
              <div className="relative flex-shrink-0">
                <img
                  src={b.avatar}
                  alt={b.name}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-pink-200"
                />
                {b.isToday && (
                  <span className="absolute -top-1 -right-1 text-xs">🎉</span>
                )}
              </div>

              {/* Name and Date fields */}
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-bold text-[#172033] truncate">{b.name}</p>
                  {b.isToday && (
                    <span className="text-[9px] font-extrabold uppercase bg-pink-500 text-white px-1.5 py-0.2 rounded-full animate-pulse">
                      Today!
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-[#8292AD]">{b.department} • <span className="font-medium text-[#172033]">{b.date}</span></p>
              </div>
            </div>

            <button
              onClick={() => handleSendWish(b)}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-pink-50 text-pink-600 hover:bg-pink-100 border border-pink-200 transition-colors flex-shrink-0"
              title="Send birthday wish"
            >
              <Send className="w-3 h-3" />
              <span>Wish</span>
            </button>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="pt-2.5 border-t border-[#E5EAF2] text-center text-xs text-[#8292AD]">
        <span>Automated Slack celebration message scheduled at 9:00 AM</span>
      </div>
    </div>
  );
};
