import React from 'react';
import { UserMinus, Calendar, Plus, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { StatusBadge } from '../common/StatusBadge';

export const OnLeaveTodayWidget = ({ onApplyLeaveClick }) => {
  const onLeaveStaff = [
    {
      id: 'L1',
      name: 'Marcus Vance',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      department: 'Product Design',
      type: 'Sick Leave',
      dates: '09 Nov – 11 Nov',
      duration: '2 days',
      status: 'On Leave',
    },
    {
      id: 'L2',
      name: 'David Chen',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
      department: 'Data & Analytics',
      type: 'Paternity Leave',
      dates: '09 Nov – 05 Dec',
      duration: '15 days',
      status: 'On Leave',
    },
    {
      id: 'L3',
      name: 'Elena Rostova',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
      department: 'Engineering',
      type: 'Privilege Leave',
      dates: '12 Nov – 15 Nov',
      duration: '4 days (Upcoming)',
      status: 'Pending',
    },
  ];

  return (
    <div className="bg-white border border-[#E5EAF2] rounded-2xl p-5 shadow-card hover:shadow-subtle transition-all flex flex-col justify-between h-full min-h-[190px]">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#E5EAF2]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <UserMinus className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-[#172033] text-sm">On leave Today</h3>
              <span className="text-[10px] font-semibold text-[#8292AD] bg-[#F7F9FC] px-2 py-0.5 rounded border border-[#E5EAF2]">
                leave requests
              </span>
            </div>
            <p className="text-[11px] text-[#8292AD]">Team Time-Off Roster</p>
          </div>
        </div>

        <button
          onClick={onApplyLeaveClick}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-blue-50 text-[#2563EB] hover:bg-blue-100 border border-blue-200 transition-colors"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Apply Leave</span>
        </button>
      </div>

      {/* Leave rows matching wireframe lines --- */}
      <div className="my-2.5 divide-y divide-[#E5EAF2]">
        {onLeaveStaff.map((staff) => (
          <div
            key={staff.id}
            className="py-2.5 flex items-center justify-between gap-3 text-xs hover:bg-[#F8FAFC] transition-colors rounded-lg px-2 -mx-2"
          >
            <div className="flex items-center gap-3 min-w-0">
              <img
                src={staff.avatar}
                alt={staff.name}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-amber-100 flex-shrink-0"
              />
              <div className="min-w-0">
                <p className="font-bold text-[#172033] truncate">{staff.name}</p>
                <p className="text-[10px] text-[#8292AD] truncate">
                  {staff.department} • {staff.type}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 flex-shrink-0">
              <span className="text-[11px] text-[#4E5D78] font-medium hidden sm:inline">
                {staff.dates} ({staff.duration})
              </span>
              <StatusBadge status={staff.status} size="xs" />
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-[#E5EAF2] text-xs">
        <span className="text-[#8292AD] text-[11px]">
          2 employees currently absent • 1 scheduled upcoming
        </span>
        <Link
          to="/attendance"
          className="text-[#2563EB] hover:underline font-semibold text-xs flex items-center gap-1"
        >
          <span>Attendance Register</span>
          <ExternalLink className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
};
