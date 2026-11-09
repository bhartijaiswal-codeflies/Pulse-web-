import React, { useState } from 'react';
import { Clock, Users, ArrowUpRight, CheckCircle2, AlertTriangle, LogOut, MapPin, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { StatusBadge } from '../common/StatusBadge';

export const CheckInsCard = () => {
  const [filter, setFilter] = useState('All'); // 'All', 'In Office', 'Remote', 'Late'

  // Admin roster data of team check-ins & check-outs
  const livePunches = [
    {
      id: 'P-1',
      name: 'Marcus Vance',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      department: 'Product Design',
      checkIn: '08:30 AM',
      checkOut: '--',
      workHours: '5h 30m',
      location: 'In Office',
      status: 'On Time',
    },
    {
      id: 'P-2',
      name: 'Priya Sharma',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      department: 'Engineering',
      checkIn: '08:45 AM',
      checkOut: '--',
      workHours: '5h 15m',
      location: 'In Office',
      status: 'On Time',
    },
    {
      id: 'P-3',
      name: 'Aisha Al-Mansoor',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
      department: 'Marketing',
      checkIn: '09:00 AM',
      checkOut: '--',
      workHours: '5h 00m',
      location: 'Remote',
      status: 'On Time',
    },
    {
      id: 'P-4',
      name: 'David Chen',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
      department: 'Data & Analytics',
      checkIn: '09:22 AM',
      checkOut: '--',
      workHours: '4h 38m',
      location: 'In Office',
      status: 'Late',
    },
    {
      id: 'P-5',
      name: 'Alexei Ivanov',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80',
      department: 'DevOps',
      checkIn: '08:00 AM',
      checkOut: '04:30 PM',
      workHours: '8h 30m',
      location: 'In Office',
      status: 'Checked Out',
    },
  ];

  const filteredPunches = livePunches.filter((p) => {
    if (filter === 'All') return true;
    if (filter === 'In Office') return p.location === 'In Office' && p.status !== 'Checked Out';
    if (filter === 'Remote') return p.location === 'Remote';
    if (filter === 'Late') return p.status === 'Late';
    return true;
  });

  return (
    <div className="bg-white border border-[#E5EAF2] rounded-2xl p-5 shadow-card hover:shadow-subtle transition-all flex flex-col justify-between h-full min-h-[220px]">
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-[#E5EAF2]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-[#172033] text-sm">Check-in / Check-out</h3>
                <span className="text-[10px] font-semibold text-[#8292AD] bg-[#F7F9FC] px-2 py-0.5 rounded border border-[#E5EAF2]">
                  Admin View
                </span>
              </div>
              <p className="text-[11px] text-[#8292AD]">Live Employee Punch Roster</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>224 Present</span>
            </span>
          </div>
        </div>

        {/* Quick Filter Tabs */}
        <div className="flex items-center gap-1.5 my-2.5">
          {['All', 'In Office', 'Remote', 'Late'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`text-[10px] font-bold px-2 py-0.5 rounded-md transition-colors ${
                filter === f
                  ? 'bg-[#2563EB] text-white'
                  : 'bg-[#F7F9FC] text-[#8292AD] hover:text-[#172033] border border-[#E5EAF2]'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* List of Employee Punches */}
        <div className="divide-y divide-[#E5EAF2]">
          {filteredPunches.slice(0, 4).map((p) => (
            <div
              key={p.id}
              className="py-2 flex items-center justify-between gap-3 text-xs hover:bg-[#F8FAFC] transition-colors rounded-lg px-2 -mx-2"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <img
                  src={p.avatar}
                  alt={p.name}
                  className="w-7 h-7 rounded-full object-cover ring-2 ring-[#E5EAF2] flex-shrink-0"
                />
                <div className="min-w-0">
                  <p className="font-bold text-[#172033] text-xs truncate">{p.name}</p>
                  <p className="text-[10px] text-[#8292AD] truncate">
                    {p.department} • <span className="font-medium text-[#4E5D78]">{p.location}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <div className="text-right">
                  <span className="text-[11px] font-mono font-bold text-[#172033] block leading-none">
                    {p.checkIn}
                  </span>
                  <span className="text-[9.5px] text-[#8292AD] block mt-0.5 leading-none">
                    {p.status === 'Checked Out' ? `Out: ${p.checkOut}` : p.workHours}
                  </span>
                </div>
                <StatusBadge status={p.status} size="xs" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-2.5 border-t border-[#E5EAF2] text-xs mt-2">
        <span className="text-[#8292AD] text-[11px]">224 active • 248 total roster</span>
        <Link
          to="/attendance"
          className="text-[#2563EB] hover:underline font-semibold text-xs flex items-center gap-1"
        >
          <span>Attendance Register</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
