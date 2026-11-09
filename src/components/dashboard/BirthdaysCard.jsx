import React from 'react';
import { Cake, Send, Sparkles } from 'lucide-react';
import { useToast } from '../../context/NotificationContext';
import { upcomingBirthdays } from '../../data/mockData';

export const BirthdaysCard = () => {
  const { addToast } = useToast();

  const handleSendWish = (person) => {
    addToast({
      title: 'Birthday Greeting Sent! 🎂',
      message: `Delivered celebration card to ${person.name}.`,
      type: 'success',
    });
  };

  return (
    <div className="bg-white border border-[#E5EAF2] rounded-2xl p-5 shadow-card hover:shadow-subtle transition-all flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#E5EAF2]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center">
            <Cake className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-[#172033] text-sm">Celebrating Birthday</h3>
            <p className="text-[11px] text-[#8292AD]">Team Celebrations</p>
          </div>
        </div>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-pink-50 text-pink-700 border border-pink-200">
          {upcomingBirthdays.length} this month
        </span>
      </div>

      {/* Celebrating Inside Circle Image, then Name and Date */}
      <div className="my-4 flex items-center justify-around gap-3">
        {upcomingBirthdays.map((item) => (
          <div
            key={item.id}
            onClick={() => handleSendWish(item)}
            className="flex flex-col items-center group cursor-pointer text-center"
            title={`Wish ${item.name}`}
          >
            {/* Circle Image */}
            <div className="relative">
              <img
                src={item.avatar}
                alt={item.name}
                className="w-14 h-14 rounded-full object-cover ring-2 ring-pink-300 group-hover:scale-105 transition-transform shadow-xs"
              />
              {item.isToday && (
                <span className="absolute -top-1 -right-1 text-sm animate-bounce">
                  🎉
                </span>
              )}
            </div>

            {/* Name */}
            <p className="text-xs font-bold text-[#172033] mt-2 group-hover:text-[#2563EB] truncate max-w-[85px]">
              {item.name}
            </p>

            {/* Date */}
            <span
              className={`text-[10px] font-semibold mt-0.5 px-2 py-0.5 rounded-full ${
                item.isToday
                  ? 'bg-pink-100 text-pink-700 font-bold animate-pulse'
                  : 'text-[#8292AD] bg-[#F7F9FC] border border-[#E5EAF2]'
              }`}
            >
              {item.date}
            </span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-2.5 border-t border-[#E5EAF2] text-xs">
        <span className="text-[#8292AD] text-[11px]">Today: Priya Sharma 🎉</span>
        <button
          onClick={() => handleSendWish(upcomingBirthdays[0])}
          className="text-[#2563EB] hover:underline font-semibold text-xs flex items-center gap-1"
        >
          <Send className="w-3 h-3" />
          <span>Send Greeting</span>
        </button>
      </div>
    </div>
  );
};
