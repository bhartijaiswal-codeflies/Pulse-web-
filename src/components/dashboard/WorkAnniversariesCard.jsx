import React from 'react';
import { Award, Heart, Sparkles } from 'lucide-react';
import { useToast } from '../../context/NotificationContext';
import { workAnniversaries } from '../../data/mockData';

export const WorkAnniversariesCard = () => {
  const { addToast } = useToast();

  const handleCongratulate = (name, years) => {
    addToast({
      title: 'Anniversary Kudos Sent! 🌟',
      message: `Sent congratulation kudos to ${name} for ${years} years of service!`,
      type: 'success',
    });
  };

  return (
    <div className="bg-white border border-[#E5EAF2] rounded-2xl p-5 shadow-card hover:shadow-subtle transition-all flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#E5EAF2]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
            <Award className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-[#172033] text-sm">Celebrating Work Anniversary</h3>
            <p className="text-[11px] text-[#8292AD]">Team Service Milestones</p>
          </div>
        </div>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
          {workAnniversaries.length} this month
        </span>
      </div>

      {/* Celebrating Inside Circle Image, then Name and Date */}
      <div className="my-4 flex items-center justify-around gap-3">
        {workAnniversaries.map((item) => (
          <div
            key={item.id}
            onClick={() => handleCongratulate(item.name, item.years)}
            className="flex flex-col items-center group cursor-pointer text-center"
            title={`Congratulate ${item.name}`}
          >
            {/* Circle Image with milestone badge */}
            <div className="relative">
              <img
                src={item.avatar}
                alt={item.name}
                className="w-14 h-14 rounded-full object-cover ring-2 ring-amber-300 group-hover:scale-105 transition-transform shadow-xs"
              />
              <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-amber-500 text-white font-extrabold text-[10px] flex items-center justify-center shadow-xs border-2 border-white">
                {item.years}
              </span>
            </div>

            {/* Name */}
            <p className="text-xs font-bold text-[#172033] mt-2 group-hover:text-[#2563EB] truncate max-w-[85px]">
              {item.name}
            </p>

            {/* Date */}
            <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 mt-0.5">
              {item.joiningDate}
            </span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-2.5 border-t border-[#E5EAF2] text-xs">
        <span className="text-[#8292AD] text-[11px]">3 milestones in November</span>
        <button
          onClick={() => handleCongratulate(workAnniversaries[0].name, workAnniversaries[0].years)}
          className="text-amber-700 hover:underline font-semibold text-xs flex items-center gap-1"
        >
          <Heart className="w-3 h-3 fill-amber-500 text-amber-500" />
          <span>Send Kudos</span>
        </button>
      </div>
    </div>
  );
};
