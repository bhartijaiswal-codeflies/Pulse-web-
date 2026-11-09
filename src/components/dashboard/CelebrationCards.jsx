import React from 'react';
import { Cake, Award, UserPlus, Heart, Sparkles, Send } from 'lucide-react';
import { useToast } from '../../context/NotificationContext';

export const CelebrationCards = () => {
  const { addToast } = useToast();

  const birthdays = [
    {
      id: 'B1',
      initials: 'PS',
      name: 'Priya Sharma',
      date: 'TODAY',
      isToday: true,
      color: 'bg-gradient-to-tr from-[#38BDF8] to-[#0284C7]',
    },
    {
      id: 'B2',
      initials: 'AI',
      name: 'Alexei Ivanov',
      date: 'NOV 12',
      isToday: false,
      color: 'bg-gradient-to-tr from-[#818CF8] to-[#4F46E5]',
    },
    {
      id: 'B3',
      initials: 'CT',
      name: 'Chloe Tremblay',
      date: 'NOV 16',
      isToday: false,
      color: 'bg-gradient-to-tr from-[#EC4899] to-[#BE185D]',
    },
  ];

  const anniversaries = [
    {
      id: 'A1',
      initials: 'SC',
      badgeNum: '5',
      name: 'Sarah Connor',
      date: 'NOV 10',
      color: 'bg-gradient-to-tr from-[#2DD4BF] to-[#0D9488]',
    },
    {
      id: 'A2',
      initials: 'MS',
      badgeNum: '3',
      name: 'Michael Scott',
      date: 'NOV 12',
      color: 'bg-gradient-to-tr from-[#FBBF24] to-[#D97706]',
    },
    {
      id: 'A3',
      initials: 'AO',
      badgeNum: '2',
      name: 'Amara Okafor',
      date: 'NOV 15',
      color: 'bg-gradient-to-tr from-[#FB923C] to-[#EA580C]',
    },
  ];

  const newJoinees = [
    {
      id: 'J1',
      initials: 'AD',
      name: 'Ananya Deshmukh',
      date: 'NOV 06',
      color: 'bg-gradient-to-tr from-[#34D399] to-[#059669]',
    },
    {
      id: 'J2',
      initials: 'DT',
      name: 'Devin Thorne',
      date: 'NOV 01',
      color: 'bg-gradient-to-tr from-[#60A5FA] to-[#2563EB]',
    },
    {
      id: 'J3',
      initials: 'LB',
      name: 'Lucas Brandao',
      date: 'OCT 28',
      color: 'bg-gradient-to-tr from-[#A78BFA] to-[#7C3AED]',
    },
  ];

  const handleWish = (name, type) => {
    addToast({
      title: `${type} Sent! 🎉`,
      message: `Delivered celebration kudos to ${name}.`,
      type: 'success',
    });
  };

  return (
    <div className="space-y-4">
      {/* 1. Celebrating Birthdays Card */}
      <div className="bg-white border border-[#E5EAF2] rounded-2xl p-5 shadow-card hover:shadow-subtle transition-all">
        <div className="flex items-center justify-between pb-3 border-b border-[#E5EAF2] mb-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-cyan-50 text-[#0284C7] flex items-center justify-center">
              <Cake className="w-3.5 h-3.5" />
            </div>
            <h3 className="font-bold text-[#172033] text-sm tracking-wide">
              Celebrating Birthdays
            </h3>
          </div>
          <span className="text-[11px] font-semibold text-[#8292AD]">This Month</span>
        </div>

        {/* Circular Pills Row matching Reference Image 4 */}
        <div className="flex items-center gap-6 overflow-x-auto py-1">
          {birthdays.map((b) => (
            <div
              key={b.id}
              onClick={() => handleWish(b.name, 'Birthday Greeting')}
              className="flex flex-col items-center group cursor-pointer flex-shrink-0"
              title={`Click to send birthday wish to ${b.name}`}
            >
              <div className="relative">
                <div
                  className={`w-12 h-12 rounded-full ${b.color} text-white flex items-center justify-center font-bold text-sm shadow-sm ring-2 ring-white group-hover:scale-105 transition-transform`}
                >
                  {b.initials}
                </div>
                {b.isToday && (
                  <span className="absolute -top-1 -right-1 text-xs">🎉</span>
                )}
              </div>
              <span className="text-xs font-semibold text-[#172033] mt-2 group-hover:text-[#2563EB] truncate max-w-[80px] text-center">
                {b.name}
              </span>
              <span
                className={`text-[10px] font-bold mt-0.5 ${
                  b.isToday ? 'text-pink-600 bg-pink-50 px-1.5 rounded-full' : 'text-[#8292AD]'
                }`}
              >
                {b.date}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Celebrating Work Anniversaries Card */}
      <div className="bg-white border border-[#E5EAF2] rounded-2xl p-5 shadow-card hover:shadow-subtle transition-all">
        <div className="flex items-center justify-between pb-3 border-b border-[#E5EAF2] mb-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center">
              <Award className="w-3.5 h-3.5" />
            </div>
            <h3 className="font-bold text-[#172033] text-sm tracking-wide">
              Celebrating Work Anniversaries
            </h3>
          </div>
          <span className="text-[11px] font-semibold text-[#8292AD]">Milestones</span>
        </div>

        {/* Circular Pills with Number Badges matching Reference Image 4 */}
        <div className="flex items-center gap-6 overflow-x-auto py-1">
          {anniversaries.map((a) => (
            <div
              key={a.id}
              onClick={() => handleWish(a.name, `${a.badgeNum}-Year Milestone Kudos`)}
              className="flex flex-col items-center group cursor-pointer flex-shrink-0"
              title={`Congratulate ${a.name} for ${a.badgeNum} years of service!`}
            >
              <div className="relative">
                <div
                  className={`w-12 h-12 rounded-full ${a.color} text-white flex items-center justify-center font-bold text-sm shadow-sm ring-2 ring-white group-hover:scale-105 transition-transform`}
                >
                  {a.initials}
                </div>
                {/* Milestone badge e.g. "1", "3", "5" */}
                <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-white text-amber-700 font-extrabold text-[9px] flex items-center justify-center shadow-xs border border-amber-300">
                  {a.badgeNum}
                </span>
              </div>
              <span className="text-xs font-semibold text-[#172033] mt-2 group-hover:text-[#2563EB] truncate max-w-[80px] text-center">
                {a.name}
              </span>
              <span className="text-[10px] font-bold text-[#8292AD] mt-0.5">
                {a.date}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Welcome New Joinees Card */}
      <div className="bg-white border border-[#E5EAF2] rounded-2xl p-5 shadow-card hover:shadow-subtle transition-all">
        <div className="flex items-center justify-between pb-3 border-b border-[#E5EAF2] mb-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <UserPlus className="w-3.5 h-3.5" />
            </div>
            <h3 className="font-bold text-[#172033] text-sm tracking-wide">
              Welcome New Joinees
            </h3>
          </div>
          <span className="text-[11px] font-semibold text-[#8292AD]">Last 30 Days</span>
        </div>

        {/* Circular Pills Row */}
        <div className="flex items-center gap-6 overflow-x-auto py-1">
          {newJoinees.map((j) => (
            <div
              key={j.id}
              onClick={() => handleWish(j.name, 'Welcome Onboarding Message')}
              className="flex flex-col items-center group cursor-pointer flex-shrink-0"
              title={`Send welcome message to ${j.name}`}
            >
              <div
                className={`w-12 h-12 rounded-full ${j.color} text-white flex items-center justify-center font-bold text-sm shadow-sm ring-2 ring-white group-hover:scale-105 transition-transform`}
              >
                {j.initials}
              </div>
              <span className="text-xs font-semibold text-[#172033] mt-2 group-hover:text-[#2563EB] truncate max-w-[80px] text-center">
                {j.name}
              </span>
              <span className="text-[10px] font-bold text-[#8292AD] mt-0.5">
                {j.date}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

