import React from 'react';
import { Award, Heart } from 'lucide-react';
import { useToast } from '../../context/NotificationContext';

export const AnniversaryWidget = ({ anniversaries }) => {
  const { addToast } = useToast();

  const handleCelebrate = (item) => {
    addToast({
      title: 'Anniversary Kudos Sent! 🌟',
      message: `Sent congratulation kudos to ${item.name} for ${item.years} years of service!`,
      type: 'success',
    });
  };

  return (
    <div className="bg-white border border-[#E5EAF2] rounded-2xl shadow-card overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-[#E5EAF2] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <Award className="w-4 h-4" />
          </div>
          <h2 className="text-sm font-bold text-[#172033]">Celebrating Work Anniversaries</h2>
        </div>
        <span className="text-[11px] font-semibold text-[#8292AD]">This Month</span>
      </div>

      {/* List */}
      <div className="divide-y divide-[#E5EAF2]">
        {anniversaries.map((item) => (
          <div
            key={item.id}
            className="p-3.5 hover:bg-[#F8FAFC] transition-colors flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-3 min-w-0">
              <img
                src={item.avatar}
                alt={item.name}
                className="w-9 h-9 rounded-full object-cover ring-2 ring-amber-100"
              />
              <div className="min-w-0">
                <p className="text-xs font-bold text-[#172033] truncate">{item.name}</p>
                <p className="text-[11px] text-[#8292AD]">{item.department} • Joined {item.joiningDate}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                {item.years} Years
              </span>
              <button
                onClick={() => handleCelebrate(item)}
                className="p-1.5 text-[#8292AD] hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                title="Congratulate"
              >
                <Heart className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

