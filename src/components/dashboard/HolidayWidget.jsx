import React from 'react';
import { Calendar, Palmtree, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const HolidayWidget = ({ holidays }) => {
  return (
    <div className="bg-white border border-[#E5EAF2] rounded-2xl shadow-card overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-[#E5EAF2] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Palmtree className="w-4 h-4" />
          </div>
          <h2 className="text-sm font-bold text-[#172033]">Upcoming Holidays</h2>
        </div>
        <Link
          to="/calendar"
          className="text-[11px] font-semibold text-[#2563EB] hover:underline flex items-center gap-1"
        >
          <span>View All</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {/* List */}
      <div className="divide-y divide-[#E5EAF2]">
        {holidays.map((h) => (
          <div
            key={h.id}
            className="p-3.5 hover:bg-[#F8FAFC] transition-colors flex items-center justify-between gap-3"
          >
            <div className="min-w-0">
              <p className="text-xs font-bold text-[#172033]">{h.name}</p>
              <div className="flex items-center gap-2 text-[11px] text-[#8292AD] mt-0.5">
                <span>{h.date} ({h.dayOfWeek})</span>
                <span>•</span>
                <span>{h.type}</span>
              </div>
            </div>

            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 whitespace-nowrap">
              {h.badge}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
