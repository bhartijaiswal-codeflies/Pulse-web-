import React from 'react';
import { Activity, Clock, User, Calendar, CreditCard, Laptop } from 'lucide-react';

export const RecentActivities = ({ activities }) => {
  const getIcon = (type) => {
    switch (type) {
      case 'leave':
        return <Calendar className="w-3.5 h-3.5 text-amber-600" />;
      case 'attendance':
        return <Clock className="w-3.5 h-3.5 text-blue-600" />;
      case 'asset':
        return <Laptop className="w-3.5 h-3.5 text-emerald-600" />;
      case 'finance':
        return <CreditCard className="w-3.5 h-3.5 text-purple-600" />;
      default:
        return <Activity className="w-3.5 h-3.5 text-slate-600" />;
    }
  };

  return (
    <div className="bg-white border border-[#E5EAF2] rounded-2xl shadow-card overflow-hidden">
      <div className="p-4 border-b border-[#E5EAF2] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#2563EB] flex items-center justify-center">
            <Activity className="w-4 h-4" />
          </div>
          <h2 className="text-sm font-bold text-[#172033]">Recent Activities</h2>
        </div>
        <span className="text-[11px] font-semibold text-[#8292AD]">Live Stream</span>
      </div>

      <div className="divide-y divide-[#E5EAF2]">
        {activities.map((act) => (
          <div key={act.id} className="p-3.5 hover:bg-[#F8FAFC] transition-colors flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-[#F7F9FC] border border-[#E5EAF2] flex items-center justify-center flex-shrink-0 mt-0.5">
              {getIcon(act.type)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-[#172033]">
                <strong className="font-semibold text-[#172033]">{act.actor}</strong>{' '}
                <span className="text-[#8292AD]">{act.action}</span>{' '}
                <span className="font-medium text-[#172033]">{act.target}</span>
              </p>
              <span className="text-[10px] text-[#8292AD] mt-0.5 block">{act.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

