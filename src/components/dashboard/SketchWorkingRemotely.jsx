import React from 'react';
import { Laptop, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export const SketchWorkingRemotely = () => {
  const remoteStaff = [
    {
      id: 'R1',
      name: 'Aisha Al-Mansoor',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
      department: 'Marketing',
      location: 'Seattle, WA',
      clockIn: '08:45 AM',
      ip: 'VPN Secured',
    },
    {
      id: 'R2',
      name: 'Chloe Tremblay',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
      department: 'UI/UX Design',
      location: 'Montreal, QC',
      clockIn: '09:00 AM',
      ip: 'VPN Secured',
    },
  ];

  return (
    <div className="bg-white border border-[#E5EAF2] rounded-2xl p-5 shadow-card flex flex-col justify-between">
      {/* Header matching Sketch: "working remotely" */}
      <div className="flex items-center justify-between pb-3 border-b border-[#E5EAF2]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center">
            <Laptop className="w-4 h-4 stroke-[2.2]" />
          </div>
          <div>
            <h3 className="font-bold text-[#172033] text-sm">Working Remotely</h3>
            <p className="text-[11px] text-[#8292AD]">{remoteStaff.length} team members active remote</p>
          </div>
        </div>

        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-[#2563EB] border border-blue-200">
          WFH / Offsite
        </span>
      </div>

      {/* List */}
      <div className="my-3 space-y-2.5">
        {remoteStaff.map((staff) => (
          <div
            key={staff.id}
            className="flex items-center justify-between p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E5EAF2] hover:bg-slate-100/70 transition-colors text-xs"
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
                  <MapPin className="w-3 h-3 text-[#2563EB]" /> {staff.location}
                </p>
              </div>
            </div>

            <div className="text-right flex-shrink-0">
              <span className="text-[10px] text-[#172033] font-bold block">
                Since {staff.clockIn}
              </span>
              <span className="text-[9px] text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded font-semibold border border-emerald-200">
                {staff.ip}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="pt-2.5 border-t border-[#E5EAF2] flex items-center justify-between text-xs text-[#8292AD]">
        <span>In-office headcount: 224</span>
        <Link to="/attendance" className="text-[#2563EB] font-semibold hover:underline">
          View Log
        </Link>
      </div>
    </div>
  );
};
