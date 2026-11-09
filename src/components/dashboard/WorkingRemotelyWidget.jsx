import React from 'react';
import { Laptop, MapPin, Users, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export const WorkingRemotelyWidget = () => {
  const remoteStaff = [
    {
      id: 'R1',
      name: 'Aisha Al-Mansoor',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
      location: 'Seattle, WA',
      clockIn: '08:45 AM',
      department: 'Marketing',
    },
    {
      id: 'R2',
      name: 'Chloe Tremblay',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
      location: 'Montreal, QC',
      clockIn: '09:00 AM',
      department: 'UI/UX Design',
    },
    {
      id: 'R3',
      name: 'Alexei Ivanov',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80',
      location: 'Berlin, DE',
      clockIn: '09:15 AM',
      department: 'DevOps & Cloud',
    },
  ];

  return (
    <div className="bg-white border border-[#E5EAF2] rounded-2xl p-5 shadow-card hover:shadow-subtle transition-all flex flex-col justify-between h-full min-h-[190px]">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#E5EAF2]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Laptop className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-[#172033] text-sm">Working Remotely</h3>
            <p className="text-[11px] text-[#8292AD]">Remote Workforce Today</p>
          </div>
        </div>
        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
          {remoteStaff.length} Remote
        </span>
      </div>

      {/* Content */}
      <div className="my-2.5 space-y-2">
        {remoteStaff.map((staff) => (
          <div
            key={staff.id}
            className="p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E5EAF2] flex items-center justify-between gap-3 text-xs hover:bg-slate-100/70 transition-colors"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <img
                src={staff.avatar}
                alt={staff.name}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-blue-200 flex-shrink-0"
              />
              <div className="min-w-0">
                <p className="font-bold text-[#172033] truncate">{staff.name}</p>
                <p className="text-[10px] text-[#8292AD] flex items-center gap-1 truncate">
                  <MapPin className="w-3 h-3 text-[#2563EB] flex-shrink-0" />
                  <span>{staff.location}</span>
                </p>
              </div>
            </div>
            <span className="text-[10px] text-[#8292AD] font-medium flex-shrink-0">
              Since {staff.clockIn}
            </span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-[#E5EAF2] text-xs">
        <span className="text-[#8292AD] text-[11px]">224 members working in-office</span>
        <Link
          to="/attendance"
          className="text-[#2563EB] hover:underline font-semibold text-xs flex items-center gap-1"
        >
          <span>View Team</span>
          <ExternalLink className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
};

