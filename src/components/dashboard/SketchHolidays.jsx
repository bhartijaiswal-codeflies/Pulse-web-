import React from 'react';
import { Palmtree, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { upcomingHolidays } from '../../data/mockData';

export const SketchHolidays = () => {
  return (
    <div className="bg-white border border-[#E5EAF2] rounded-2xl p-5 shadow-card flex flex-col justify-between">
      {/* Header matching Sketch: "Holidays" */}
      <div className="flex items-center justify-between pb-3 border-b border-[#E5EAF2]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Palmtree className="w-4 h-4 stroke-[2.2]" />
          </div>
          <div>
            <h3 className="font-bold text-[#172033] text-sm">Holidays</h3>
            <p className="text-[11px] text-[#8292AD]">Upcoming Public & Company Days Off</p>
          </div>
        </div>

        <Link
          to="/calendar"
          className="text-xs font-semibold text-[#2563EB] hover:underline flex items-center gap-1"
        >
          <span>View Calendar</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Grid of 3 Holiday Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-3">
        {upcomingHolidays.map((h) => (
          <div
            key={h.id}
            className="p-3.5 rounded-xl border border-[#E5EAF2] bg-[#FBFDFE] hover:border-emerald-300 hover:bg-emerald-50/20 transition-all text-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  {h.badge}
                </span>
                <span className="text-[10px] text-[#8292AD] font-medium">{h.dayOfWeek}</span>
              </div>
              <h4 className="font-bold text-[#172033] text-sm mt-1">{h.name}</h4>
              <p className="text-xs text-[#8292AD] mt-0.5 font-medium">{h.date}</p>
            </div>
            <span className="text-[10px] text-[#8292AD] mt-2 block pt-1 border-t border-[#F1F5F9]">
              {h.type}
            </span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="pt-2.5 border-t border-[#E5EAF2] text-center text-xs text-[#8292AD]">
        <span>Offices officially closed on federal and company holidays</span>
      </div>
    </div>
  );
};
