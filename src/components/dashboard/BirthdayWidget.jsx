import React from 'react';
import { Cake, Sparkles, Send } from 'lucide-react';
import { useToast } from '../../context/NotificationContext';

export const BirthdayWidget = ({ birthdays }) => {
  const { addToast } = useToast();

  const handleSendWish = (person) => {
    addToast({
      title: 'Birthday Wish Sent! 🎂',
      message: `Celebration card delivered to ${person.name}'s Slack and email.`,
      type: 'success',
    });
  };

  return (
    <div className="bg-white border border-[#E5EAF2] rounded-2xl shadow-card overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-[#E5EAF2] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-pink-50 text-pink-500 flex items-center justify-center">
            <Cake className="w-4 h-4" />
          </div>
          <h2 className="text-sm font-bold text-[#172033]">Celebrating Birthdays</h2>
        </div>
        <span className="text-[11px] font-semibold text-[#8292AD]">{birthdays.length} upcoming</span>
      </div>

      {/* List */}
      <div className="divide-y divide-[#E5EAF2]">
        {birthdays.map((item) => (
          <div
            key={item.id}
            className="p-3.5 hover:bg-[#F8FAFC] transition-colors flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative">
                <img
                  src={item.avatar}
                  alt={item.name}
                  className="w-9 h-9 rounded-full object-cover ring-2 ring-pink-100"
                />
                {item.isToday && (
                  <span className="absolute -top-1 -right-1 text-xs">🎉</span>
                )}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-[#172033] truncate">{item.name}</p>
                <p className="text-[11px] text-[#8292AD]">{item.department}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              {item.isToday ? (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-pink-100 text-pink-700 animate-pulse">
                  Today!
                </span>
              ) : (
                <span className="text-[11px] font-medium text-[#8292AD]">{item.date}</span>
              )}
              <button
                onClick={() => handleSendWish(item)}
                className="p-1.5 text-[#8292AD] hover:text-[#2563EB] hover:bg-blue-50 rounded-lg transition-colors"
                title="Send birthday wish"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
