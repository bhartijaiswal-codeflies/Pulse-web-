import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { upcomingHolidays } from '../../data/mockData';

export const HolidayBannerCard = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevHoliday = () => {
    setCurrentIndex((prev) => (prev === 0 ? upcomingHolidays.length - 1 : prev - 1));
  };

  const nextHoliday = () => {
    setCurrentIndex((prev) => (prev === upcomingHolidays.length - 1 ? 0 : prev + 1));
  };

  const current = upcomingHolidays[currentIndex];

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-[#538E42] via-[#467E36] to-[#366827] text-white rounded-2xl p-5 shadow-card flex flex-col justify-between min-h-[175px]">
      {/* Background festive skyline silhouette effect */}
      <div className="absolute inset-0 opacity-15 pointer-events-none flex items-end justify-center">
        <svg viewBox="0 0 500 150" className="w-full h-24 fill-white" preserveAspectRatio="none">
          <path d="M0,150 L0,80 Q25,80 30,50 Q40,90 50,70 Q70,70 80,40 Q90,90 110,60 Q120,60 130,30 Q140,80 160,70 L170,150 Z" />
          <path d="M180,150 L190,40 Q210,10 230,40 L240,150 Z" />
          <path d="M250,150 L260,70 Q280,30 300,70 L310,150 Z" />
          <path d="M330,150 L340,60 Q360,20 380,60 L390,150 Z" />
          <path d="M400,150 L410,50 Q430,70 450,50 L460,150 Z" />
        </svg>
      </div>

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 font-bold tracking-wide">
          <Calendar className="w-4 h-4 text-emerald-200" />
          <span>Holidays</span>
        </div>
        <Link
          to="/calendar"
          className="text-emerald-100 hover:text-white font-semibold hover:underline"
        >
          View All
        </Link>
      </div>

      {/* Main Holiday Info with Carousel Arrows */}
      <div className="relative z-10 flex items-center justify-between my-2">
        <button
          onClick={prevHoliday}
          className="p-1 rounded-full bg-black/15 hover:bg-black/30 text-white transition-colors"
          title="Previous holiday"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="text-center px-2 flex-1">
          <h4 className="text-xl sm:text-2xl font-black tracking-tight drop-shadow-sm truncate">
            {current.name}
          </h4>
          <p className="text-xs text-emerald-100 font-medium mt-1">
            {current.date} ({current.dayOfWeek})
          </p>
          <span className="inline-block mt-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/20 text-white border border-white/30 backdrop-blur-xs">
            {current.type} • {current.badge}
          </span>
        </div>

        <button
          onClick={nextHoliday}
          className="p-1 rounded-full bg-black/15 hover:bg-black/30 text-white transition-colors"
          title="Next holiday"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Bottom Progress dots */}
      <div className="relative z-10 flex justify-center gap-1.5 pt-1">
        {upcomingHolidays.map((_, idx) => (
          <span
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`cursor-pointer h-1 rounded-full transition-all ${
              idx === currentIndex ? 'w-5 bg-white' : 'w-1.5 bg-white/40'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

