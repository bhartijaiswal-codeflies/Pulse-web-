import React from 'react';
import { UserMinus, Calendar, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const SketchOnLeaveToday = ({ onApplyLeaveClick }) => {
  const onLeaveStaff = [
    {
      id: 'L1',
      name: 'Marcus Vance',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      department: 'Product Design',
      type: 'Sick Leave',
      duration: '2 days',
      returns: 'Back tomorrow',
    },
    {
      id: 'L2',
      name: 'David Chen',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
      department: 'Data & Analytics',
      type: 'Paternity Leave',
      duration: '15 days',
      returns: 'Back Dec 05',
    },
  ];

  return (
    <div className="bg-white border border-[#E5EAF2] rounded-2xl p-5 shadow-card flex flex-col justify-between">
      {/* Header matching Sketch: "On leave Today" [leave requests] */}
      <div className="flex items-center justify-between pb-3 border-b border-[#E5EAF2]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <UserMinus className="w-4 h-4 stroke-[2.2]" />
          </div>
          <div>
            <h3 className="font-bold text-[#172033] text-sm">On leave Today</h3>
            <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
              [leave requests: {onLeaveStaff.length}]
            </span>
          </div>
        </div>

        <button
          onClick={onApplyLeaveClick}
          className="text-xs font-semibold text-[#2563EB] hover:underline flex items-center gap-1"
        >
          <span>Apply Leave</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* List */}
      <div className="my-3 space-y-2.5">
        {onLeaveStaff.map((staff) => (
          <div
            key={staff.id}
            className="flex items-center justify-between p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E5EAF2] hover:bg-slate-100/70 transition-colors text-xs"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <img
                src={staff.avatar}
                alt={staff.name}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-amber-200 flex-shrink-0"
              />
              <div className="min-w-0">
                <p className="font-bold text-[#172033] truncate">{staff.name}</p>
                <p className="text-[10px] text-[#8292AD]">{staff.department} • {staff.type}</p>
              </div>
            </div>

            <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200 whitespace-nowrap">
              {staff.returns}
            </span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="pt-2.5 border-t border-[#E5EAF2] flex items-center justify-between text-xs text-[#8292AD]">
        <span>Total workforce absent: 2 of 248</span>
        <Link to="/attendance" className="text-[#2563EB] font-semibold hover:underline">
          View Attendance
        </Link>
      </div>
    </div>
  );
};
