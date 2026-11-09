import React from 'react';
import { Cake, Send, Sparkles } from 'lucide-react';
import { useToast } from '../../context/NotificationContext';
import { upcomingBirthdays } from '../../data/mockData';

export const BirthdaysCard = () => {
  const { addToast } = useToast();

  const handleSendWish = (person) => {
    addToast({
      title: 'Birthday Wish Sent! 🎂',
      message: `Celebration greeting delivered to ${person.name}.`,
      type: 'success',
    });
  };

  return (
    <div className="bg-white border border-[#E5EAF2] rounded-2xl p-5 shadow-card hover:shadow-subtle transition-all flex flex-col justify-between h-full min-h-[190px]">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#E5EAF2]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center">
            <Cake className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-[#172033] text-sm">celebrating birthdays</h3>
            <p className="text-[11px] text-[#8292AD]">Team Celebrations</p>
          </div>
        </div>
        <span className="text-[11px] font-semibold text-[#8292AD]">
          {upcomingBirthdays.length} this month
        </span>
      </div>

      {/* Main Birthday Item (Avatar Circle, Name, Date matching wireframe) */}
      <div className="my-2.5 divide-y divide-[#E5EAF2]">
        {upcomingBirthdays.map((item) => (
          <div
            key={item.id}
            className="py-2 flex items-center justify-between gap-3 text-xs hover:bg-[#F8FAFC] transition-colors rounded-lg px-2 -mx-2"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative flex-shrink-0">
                <img
                  src={item.avatar}
                  alt={item.name}
                  className="w-9 h-9 rounded-full object-cover ring-2 ring-pink-200"
                />
                {item.isToday && (
                  <span className="absolute -top-1 -right-1 text-xs">🎉</span>
                )}
              </div>
              <div className="min-w-0">
                <p className="font-bold text-[#172033] truncate">{item.name}</p>
                <p className="text-[10px] text-[#8292AD] truncate">{item.department}</p>
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

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-[#E5EAF2] text-xs">
        <span className="text-[#8292AD] text-[11px]">Today: Priya Sharma 🎉</span>
        <button
          onClick={() => handleSendWish(upcomingBirthdays[0])}
          className="text-[#2563EB] hover:underline font-semibold text-xs"
        >
          Send Greeting
        </button>
      </div>
    </div>
  );
};

