import React from 'react';
import { Palmtree, Clock, ShieldAlert, Coffee, ArrowUpRight } from 'lucide-react';

export const LeaveBalancesWidget = ({ onApplyLeaveClick }) => {
  const balances = [
    {
      type: 'Privilege Leave',
      available: 18,
      total: 24,
      used: 6,
      icon: Palmtree,
      color: 'text-blue-600 bg-blue-50 border-blue-100',
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
    <div className="bg-white border border-[#E5EAF2] rounded-2xl shadow-card p-5 overflow-hidden">
      <div className="flex items-center justify-between pb-3 border-b border-[#E5EAF2] mb-4">
        <div>
          <h3 className="text-sm font-bold text-[#172033]">My Leave Balances</h3>
          <p className="text-xs text-[#8292AD]">Fiscal Year 2026 Entitlements</p>
        </div>
        <button
          onClick={onApplyLeaveClick}
          className="text-xs font-semibold text-[#2563EB] hover:underline flex items-center gap-1"
        >
          <span>Apply Leave</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {balances.map((b) => {
          const Icon = b.icon;
          const percentage = Math.round((b.available / b.total) * 100);
          return (
            <div
              key={b.type}
              className="p-3.5 rounded-xl border border-[#E5EAF2] bg-[#FBFDFE] hover:border-blue-200 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center border ${b.color}`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-extrabold text-[#172033]">
                  {b.available} <span className="text-[10px] font-normal text-[#8292AD]">/ {b.total}d</span>
                </span>
              </div>
              <p className="text-xs font-semibold text-[#172033] truncate">{b.type}</p>
              <div className="mt-2 w-full bg-[#E5EAF2] h-1.5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${b.barColor}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="text-[10px] text-[#8292AD] mt-1.5 block">
                {b.used} days utilized this year
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

