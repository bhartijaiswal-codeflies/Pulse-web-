import React from 'react';
import { Palmtree, Coffee, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

export const LeaveBalancesCard = ({ onApplyLeaveClick }) => {
  return (
    <div className="bg-white border border-[#E5EAF2] rounded-2xl p-5 shadow-card flex flex-col justify-between min-h-[175px]">
      {/* Header */}
      <div className="flex items-center justify-between text-xs">
        <h3 className="font-bold text-[#172033] tracking-wide text-sm">Leave Balances</h3>
        <span className="text-[11px] text-[#8292AD] font-medium">FY 2026</span>
      </div>

      {/* Balances Display */}
      <div className="grid grid-cols-2 gap-3 my-2">
        {/* Privileged Leave */}
        <div className="p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E5EAF2]">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#8292AD] block mb-1">
            PRIVILEGED LEAVE
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-black text-[#172033]">18</span>
            <span className="text-xs text-[#8292AD]">/ 24 days</span>
          </div>
          <div className="w-full bg-[#E5EAF2] h-1.5 rounded-full overflow-hidden mt-1.5">
            <div className="bg-[#2563EB] h-full rounded-full" style={{ width: '75%' }} />
          </div>
        </div>

        {/* Casual Leave */}
        <div className="p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E5EAF2]">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#8292AD] block mb-1">
            CASUAL LEAVE
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-black text-[#172033]">10</span>
            <span className="text-xs text-[#8292AD]">/ 12 days</span>
          </div>
          <div className="w-full bg-[#E5EAF2] h-1.5 rounded-full overflow-hidden mt-1.5">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: '83%' }} />
          </div>
        </div>
      </div>

      {/* Footer Links matching Reference Image 4 */}
      <div className="flex items-center justify-between pt-2 border-t border-[#E5EAF2] text-xs">
        <button
          onClick={onApplyLeaveClick}
          className="text-[#2563EB] hover:underline font-semibold"
        >
          View All Balances
        </button>

        <button
          onClick={onApplyLeaveClick}
          className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-lg bg-blue-50 text-[#2563EB] hover:bg-blue-100 border border-blue-200 transition-colors"
        >
          <Plus className="w-3 h-3 stroke-[2.5]" />
          <span>Apply Leave</span>
        </button>
      </div>
    </div>
  );
};

