import React from 'react';
import { Laptop, MapPin, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

export const WorkingRemotelyCard = () => {
  const remoteStaff = [
    {
      id: 'R1',
      name: 'Aisha Al-Mansoor',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
      location: 'Seattle, WA',
      clockIn: '08:45 AM',
    },
    {
      id: 'R2',
      name: 'Chloe Tremblay',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
      location: 'Montreal, QC',
      clockIn: '09:00 AM',
    },
  ];

  return (
    <div className="bg-white border border-[#E5EAF2] rounded-2xl p-5 shadow-card flex flex-col justify-between min-h-[175px]">
      {/* Header */}
      <div className="flex items-center justify-between text-xs">
        <h3 className="font-bold text-[#172033] tracking-wide text-sm flex items-center gap-1.5">
          <Laptop className="w-4 h-4 text-blue-500" />
          <span>Working Remotely</span>
        </h3>
        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
          {remoteStaff.length} remote
        </span>
      </div>

      {/* Content */}
      <div className="my-2 space-y-2">
        {remoteStaff.map((staff) => (
          <div
            key={staff.id}
            className="flex items-center justify-between p-2 rounded-xl bg-[#F8FAFC] border border-[#E5EAF2] text-xs hover:bg-slate-100/70 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <img
                src={staff.avatar}
                alt={staff.name}
                className="w-7 h-7 rounded-full object-cover ring-1 ring-blue-300"
              />
              <div>
                <p className="font-bold text-[#172033]">{staff.name}</p>
                <p className="text-[10px] text-[#8292AD] flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#2563EB]" /> {staff.location}
                </p>
              </div>
            </div>
            <span className="text-[10px] text-[#8292AD] font-medium">
              In at {staff.clockIn}
            </span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-[#E5EAF2] text-xs">
        <span className="text-[#8292AD] text-[11px]">224 members working in-office</span>
        <Link
          to="/attendance"
          className="text-[#2563EB] hover:underline font-semibold text-xs"
        >
          View Locations
        </Link>
      </div>
    </div>
  );
};
