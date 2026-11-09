import React from 'react';
import { Award, Heart } from 'lucide-react';
import { useToast } from '../../context/NotificationContext';
import { workAnniversaries } from '../../data/mockData';

export const SketchAnniversaries = () => {
  const { addToast } = useToast();

  const handleCelebrate = (item) => {
    addToast({
      title: 'Anniversary Kudos Sent! 🌟',
      message: `Sent congratulation kudos to ${item.name} for ${item.years} years of service!`,
      type: 'success',
    });
  };

  return (
    <div className="bg-white border border-[#E5EAF2] rounded-2xl p-5 shadow-card flex flex-col justify-between">
      {/* Header matching Sketch: "celebrating work anniversaries" */}
      <div className="flex items-center justify-between pb-3 border-b border-[#E5EAF2]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
            <Award className="w-4 h-4 stroke-[2.2]" />
          </div>
          <div>
            <h3 className="font-bold text-[#172033] text-sm">celebrating work anniversaries</h3>
            <p className="text-[11px] text-[#8292AD]">Team Tenure Milestones</p>
          </div>
        </div>

        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
          Milestones
        </span>
      </div>

      {/* 3 Circles O O O Row matching Sketch */}
      <div className="my-3 space-y-2.5">
        {workAnniversaries.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E5EAF2] hover:bg-slate-100/70 transition-colors text-xs"
          >
            <div className="flex items-center gap-3 min-w-0">
              {/* Circle Avatar O with badge */}
              <div className="relative flex-shrink-0">
                <img
                  src={item.avatar}
                  alt={item.name}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-amber-300"
                />
                <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-white font-black text-[9px] flex items-center justify-center ring-1 ring-white">
                  {item.years}
                </span>
              </div>

              <div className="min-w-0">
                <p className="font-bold text-[#172033] truncate">{item.name}</p>
                <p className="text-[11px] text-[#8292AD]">{item.department} • Joined {item.joiningDate}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 whitespace-nowrap">
                {item.years} Years
              </span>
              <button
                onClick={() => handleCelebrate(item)}
                className="p-1.5 text-amber-600 hover:bg-amber-100/70 rounded-lg transition-colors border border-transparent hover:border-amber-200"
                title="Congratulate"
              >
                <Heart className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="pt-2.5 border-t border-[#E5EAF2] text-center text-xs text-[#8292AD]">
        <span>Recognizing company dedication & loyalty</span>
      </div>
    </div>
  );
};
