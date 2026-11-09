import React from 'react';
import { Award, Heart, Sparkles } from 'lucide-react';
import { useToast } from '../../context/NotificationContext';

export const WorkAnniversariesCard = () => {
  const { addToast } = useToast();

  const anniversaries = [
    {
      id: 'WA-1',
      name: 'Sarah Connor',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80',
      department: 'Security Operations',
      years: 5,
      date: '10 Nov',
      badgeNum: '5',
    },
    {
      id: 'WA-2',
      name: 'Michael Scott',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
      department: 'Regional Management',
      years: 3,
      date: '12 Nov',
      badgeNum: '3',
    },
    {
      id: 'WA-3',
      name: 'Amara Okafor',
      avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=150&q=80',
      department: 'Talent Acquisition',
      years: 2,
      date: '15 Nov',
      badgeNum: '2',
    },
  ];

  const handleCongratulate = (name, years) => {
    addToast({
      title: 'Anniversary Kudos Sent! 🌟',
      message: `Sent congratulation kudos to ${name} for ${years} years of service!`,
      type: 'success',
    });
  };

  return (
    <div className="bg-white border border-[#E5EAF2] rounded-2xl p-5 shadow-card hover:shadow-subtle transition-all flex flex-col justify-between h-full min-h-[190px]">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#E5EAF2]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
            <Award className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-[#172033] text-sm">celebrating work anniversaries</h3>
            <p className="text-[11px] text-[#8292AD]">Team Service Milestones</p>
          </div>
        </div>
        <span className="text-[11px] font-semibold text-[#8292AD]">This Month</span>
      </div>

      {/* 3 Circular Avatars matching wireframe circles ( ) ( ) ( ) */}
      <div className="my-3 flex items-center justify-around gap-2">
        {anniversaries.map((item) => (
          <div
            key={item.id}
            onClick={() => handleCongratulate(item.name, item.years)}
            className="flex flex-col items-center group cursor-pointer text-center"
            title={`Congratulate ${item.name}`}
          >
            <div className="relative">
              <img
                src={item.avatar}
                alt={item.name}
                className="w-12 h-12 rounded-full object-cover ring-2 ring-amber-300 group-hover:scale-105 transition-transform shadow-xs"
              />
              <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-amber-500 text-white font-extrabold text-[10px] flex items-center justify-center shadow-xs border-2 border-white">
                {item.badgeNum}
              </span>
            </div>
            <p className="text-xs font-bold text-[#172033] mt-2 group-hover:text-[#2563EB] truncate max-w-[85px]">
              {item.name}
            </p>
            <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.2 rounded-full border border-amber-200 mt-0.5">
              {item.years} Yrs • {item.date}
            </span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-[#E5EAF2] text-xs">
        <span className="text-[#8292AD] text-[11px]">3 milestones in November</span>
        <span className="text-[11px] font-semibold text-amber-600 flex items-center gap-1">
          <Heart className="w-3 h-3 fill-amber-500 text-amber-500" /> Click to send kudos
        </span>
      </div>
    </div>
  );
};
