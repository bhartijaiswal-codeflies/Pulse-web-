import React, { useState } from 'react';
import { Palmtree, ChevronLeft, ChevronRight, Calendar, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const holidaysList = [
  {
    id: 'H-1',
    name: 'Thanksgiving Day',
    date: '26 Nov, 2026',
    dayOfWeek: 'Thursday',
    type: 'National Holiday',
    badge: '3 days left',
    bgGradient: 'from-[#538E42] via-[#467E36] to-[#366827]',
    description: 'Federal holiday observed across all offices nationwide.',
  },
  {
    id: 'H-2',
    name: 'Day After Thanksgiving',
    date: '27 Nov, 2026',
    dayOfWeek: 'Friday',
    type: 'Company Holiday',
    badge: '4 days left',
    bgGradient: 'from-[#2563EB] via-[#1D4ED8] to-[#1E40AF]',
    description: 'Paid company wide time-off for extended holiday weekend.',
  },
  {
    id: 'H-3',
    name: 'Winter Break & Christmas',
    date: '25 Dec, 2026',
    dayOfWeek: 'Friday',
    type: 'Federal Holiday',
    badge: 'Mandatory',
    bgGradient: 'from-[#7C3AED] via-[#6D28D9] to-[#5B21B6]',
    description: 'Year-end holiday closure and annual celebration recess.',
  },
];

export const HolidaysSliderCard = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? holidaysList.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === holidaysList.length - 1 ? 0 : prev + 1));
  };

  const activeHoliday = holidaysList[currentIndex];

  return (
    <div className="bg-white border border-[#E5EAF2] rounded-2xl p-5 shadow-card hover:shadow-subtle transition-all flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#E5EAF2]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Palmtree className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-[#172033] text-sm">Upcoming Holidays</h3>
            <p className="text-[11px] text-[#8292AD]">Holiday Schedule (Slider)</p>
          </div>
        </div>

        {/* Slide Counter & Arrow Controls */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-[#8292AD]">
            {currentIndex + 1} / {holidaysList.length}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={prevSlide}
              className="p-1 rounded-lg border border-[#E5EAF2] hover:bg-[#F7F9FC] text-[#172033] transition-colors"
              title="Previous holiday"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={nextSlide}
              className="p-1 rounded-lg border border-[#E5EAF2] hover:bg-[#F7F9FC] text-[#172033] transition-colors"
              title="Next holiday"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Slider of 3 Cards Container */}
      <div className="my-3">
        <div
          className={`relative overflow-hidden rounded-xl p-4 text-white bg-gradient-to-br ${activeHoliday.bgGradient} shadow-sm min-h-[140px] flex flex-col justify-between transition-all duration-300`}
        >
          {/* Subtle Skyline Backdrop */}
          <div className="absolute inset-0 opacity-15 pointer-events-none flex items-end">
            <svg viewBox="0 0 400 120" className="w-full h-20 fill-white" preserveAspectRatio="none">
              <path d="M0,120 L0,60 Q30,60 40,40 Q60,70 80,50 Q100,50 110,20 Q130,70 150,55 L160,120 Z" />
              <path d="M170,120 L180,30 Q200,10 220,30 L230,120 Z" />
              <path d="M250,120 L260,50 Q280,20 300,50 L310,120 Z" />
            </svg>
          </div>

          <div className="relative z-10 flex items-start justify-between">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/20 text-white border border-white/30 backdrop-blur-xs">
              {activeHoliday.type}
            </span>
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-white text-[#172033] shadow-xs">
              {activeHoliday.badge}
            </span>
          </div>

          <div className="relative z-10 my-2">
            <h4 className="text-base sm:text-lg font-black tracking-tight drop-shadow-sm text-white">
              {activeHoliday.name}
            </h4>
            <p className="text-xs text-white/90 font-medium mt-0.5">
              {activeHoliday.date} • {activeHoliday.dayOfWeek}
            </p>
          </div>

          <div className="relative z-10 text-[10px] text-white/80 truncate">
            {activeHoliday.description}
          </div>
        </div>

        {/* Pagination Dots */}
        <div className="flex items-center justify-center gap-1.5 mt-2.5">
          {holidaysList.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-1.5 rounded-full transition-all ${
                idx === currentIndex ? 'w-5 bg-[#2563EB]' : 'w-1.5 bg-[#CBD5E1]'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-[#E5EAF2] text-xs">
        <span className="text-[#8292AD] text-[11px]">3 holidays scheduled in Q4</span>
        <Link
          to="/calendar"
          className="text-[#2563EB] hover:underline font-semibold text-xs flex items-center gap-1"
        >
          <span>View Calendar</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
};
