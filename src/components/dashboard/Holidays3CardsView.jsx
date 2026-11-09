import React from 'react';
import { Palmtree, Calendar, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export const holidays3Cards = [
  {
    id: 'H-1',
    name: 'Thanksgiving Day',
    date: '26 Nov, 2026',
    dayOfWeek: 'Thursday',
    type: 'National Holiday',
    badge: '3 days left',
    bgGradient: 'from-[#538E42] via-[#467E36] to-[#366827]',
    description: 'Federal holiday observed across all offices.',
  },
  {
    id: 'H-2',
    name: 'Day After Thanksgiving',
    date: '27 Nov, 2026',
    dayOfWeek: 'Friday',
    type: 'Company Holiday',
    badge: '4 days left',
    bgGradient: 'from-[#2563EB] via-[#1D4ED8] to-[#1E40AF]',
    description: 'Paid extended long weekend recess.',
  },
  {
    id: 'H-3',
    name: 'Winter Break & Christmas',
    date: '25 Dec, 2026',
    dayOfWeek: 'Friday',
    type: 'Federal Holiday',
    badge: 'Mandatory',
    bgGradient: 'from-[#7C3AED] via-[#6D28D9] to-[#5B21B6]',
    description: 'Year-end annual holiday celebration.',
  },
];

export const Holidays3CardsView = () => {
  return (
    <div className="bg-white border border-[#E5EAF2] rounded-2xl p-5 shadow-card hover:shadow-subtle transition-all flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#E5EAF2]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Palmtree className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-[#172033] text-sm">Upcoming Holidays</h3>
            <p className="text-[11px] text-[#8292AD]">Q4 Holiday Schedule (3 Cards View)</p>
          </div>
        </div>

        <Link
          to="/calendar"
          className="text-xs text-[#2563EB] hover:underline font-semibold flex items-center gap-1"
        >
          <span>View Calendar</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* 3 Cards View: Displayed side-by-side across the 2-span container */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 my-3">
        {holidays3Cards.map((h) => (
          <div
            key={h.id}
            className={`relative overflow-hidden rounded-xl p-4 text-white bg-gradient-to-br ${h.bgGradient} shadow-sm min-h-[145px] flex flex-col justify-between group hover:scale-[1.01] transition-transform`}
          >
            {/* Subtle Skyline Backdrop */}
            <div className="absolute inset-0 opacity-15 pointer-events-none flex items-end">
              <svg viewBox="0 0 300 100" className="w-full h-16 fill-white" preserveAspectRatio="none">
                <path d="M0,100 L0,50 Q20,50 30,30 Q50,60 70,40 Q90,70 110,45 L120,100 Z" />
                <path d="M130,100 L140,25 Q160,10 180,25 L190,100 Z" />
                <path d="M200,100 L210,40 Q230,20 250,40 L260,100 Z" />
              </svg>
            </div>

            {/* Top Badges */}
            <div className="relative z-10 flex items-start justify-between">
              <span className="px-2 py-0.5 rounded-full text-[9.5px] font-bold bg-white/20 text-white border border-white/30 backdrop-blur-xs">
                {h.type}
              </span>
              <span className="text-[9.5px] font-extrabold px-2 py-0.5 rounded-full bg-white text-[#172033] shadow-xs">
                {h.badge}
              </span>
            </div>

            {/* Title & Date */}
            <div className="relative z-10 my-2">
              <h4 className="text-sm font-black tracking-tight drop-shadow-sm text-white truncate">
                {h.name}
              </h4>
              <p className="text-[11px] text-white/90 font-medium mt-0.5">
                {h.date} • {h.dayOfWeek}
              </p>
            </div>

            {/* Description */}
            <div className="relative z-10 text-[10px] text-white/80 truncate">
              {h.description}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-[#E5EAF2] text-xs">
        <span className="text-[#8292AD] text-[11px]">3 official company holidays remaining in 2026</span>
        <span className="text-emerald-700 font-semibold text-xs flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>All Global Offices Observed</span>
        </span>
      </div>
    </div>
  );
};
