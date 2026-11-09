import React from 'react';
import { UserMinus, Users, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const OnLeaveTodayCard = () => {
  const onLeaveStaff = [
    {
      id: 'L1',
      name: 'Marcus Vance',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      type: 'Sick Leave',
      returns: 'Back tomorrow',
    },
    {
      id: 'L2',
      name: 'David Chen',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
      type: 'Paternity Leave',
      returns: 'Back Dec 05',
    },
  ];

  return (
    <div className="bg-white border border-[#E5EAF2] rounded-2xl p-5 shadow-card flex flex-col justify-between min-h-[175px]">
      {/* Header */}
      <div className="flex items-center justify-between text-xs">
        <h3 className="font-bold text-[#172033] tracking-wide text-sm flex items-center gap-1.5">
          <UserMinus className="w-4 h-4 text-amber-500" />
          <span>On Leave today</span>
        </h3>
        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
          {onLeaveStaff.length} on leave
        </span>
      </div>

      {/* Content */}
      <div className="my-2 space-y-2">
        {onLeaveStaff.map((staff) => (
          <div
            key={staff.id}
            className="flex items-center justify-between p-2 rounded-xl bg-[#F8FAFC] border border-[#E5EAF2] text-xs hover:bg-slate-100/70 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <img
                src={staff.avatar}
                alt={staff.name}
                className="w-7 h-7 rounded-full object-cover ring-1 ring-amber-300"
              />
              <div>
                <p className="font-bold text-[#172033]">{staff.name}</p>
                <p className="text-[10px] text-[#8292AD]">{staff.type}</p>
              </div>
            </div>
            <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
              {staff.returns}
            </span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-[#E5EAF2] text-xs">
        <span className="text-[#8292AD] text-[11px]">2 employees off duty today</span>
        <Link
          to="/attendance"
          className="text-[#2563EB] hover:underline font-semibold text-xs"
        >
          View Team Attendance
        </Link>
      </div>
    </div>
  );
};
