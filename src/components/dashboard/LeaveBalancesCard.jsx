import React from 'react';
import { Palmtree, Coffee, ShieldAlert, Plus, ArrowUpRight } from 'lucide-react';

export const LeaveBalancesCard = ({ onApplyLeaveClick }) => {
  const balances = [
    {
      type: 'Privilege Leave',
      available: 18,
      total: 24,
      used: 6,
      icon: Palmtree,
      color: 'text-[#2563EB] bg-blue-50 border-blue-100',
      barColor: 'bg-[#2563EB]',
    },
    {
      type: 'Casual Leave',
      available: 10,
      total: 12,
      used: 2,
      icon: Coffee,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
      barColor: 'bg-emerald-500',
    },
    {
      type: 'Sick Leave',
      available: 7,
      total: 10,
      used: 3,
      icon: ShieldAlert,
      color: 'text-amber-600 bg-amber-50 border-amber-100',
      barColor: 'bg-amber-500',
    },
  ];

  return (
    <div className="bg-white border border-[#E5EAF2] rounded-2xl p-5 shadow-card hover:shadow-subtle transition-all flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#E5EAF2]">
        <div>
          <h3 className="font-bold text-[#172033] text-sm">Leave Balances</h3>
          <p className="text-[11px] text-[#8292AD]">Fiscal Year 2026 Entitlements</p>
        </div>
        <button
          onClick={onApplyLeaveClick}
          className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-blue-50 text-[#2563EB] hover:bg-blue-100 border border-blue-200 transition-colors"
        >
          <Plus className="w-3 h-3 stroke-[2.5]" />
          <span>Apply Leave</span>
        </button>
      </div>

      {/* Balances list */}
      <div className="my-2.5 space-y-2.5">
        {balances.map((b) => {
          const Icon = b.icon;
          const percentage = Math.round((b.available / b.total) * 100);
          return (
            <div
              key={b.type}
              className="p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E5EAF2] hover:border-blue-200 transition-colors"
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <div className={`w-5 h-5 rounded-md flex items-center justify-center border ${b.color}`}>
                    <Icon className="w-3 h-3" />
                  </div>
                  <span className="text-xs font-bold text-[#172033]">{b.type}</span>
                </div>
                <span className="text-xs font-extrabold text-[#172033]">
                  {b.available} <span className="text-[10px] font-normal text-[#8292AD]">/ {b.total}d</span>
                </span>
              </div>
              <div className="w-full bg-[#E5EAF2] h-1.5 rounded-full overflow-hidden mt-1.5">
                <div className={`h-full rounded-full ${b.barColor}`} style={{ width: `${percentage}%` }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-[#E5EAF2] text-xs">
        <span className="text-[#8292AD] text-[11px]">35 total annual days</span>
        <button
          onClick={onApplyLeaveClick}
          className="text-[#2563EB] hover:underline font-semibold text-xs flex items-center gap-1"
        >
          <span>View All Balances</span>
          <ArrowUpRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
