import React, { useState } from 'react';
import {
  Clock,
  ArrowUpRight,
  Check,
  X,
  RotateCw,
  MoreHorizontal,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { StatusBadge } from '../common/StatusBadge';
import { useToast } from '../../context/NotificationContext';

export const CheckInsCard = () => {
  const [filter, setFilter] = useState('All'); // 'All', 'In Office', 'Remote', 'Late'
  const { addToast } = useToast();

  // Admin roster data of team check-ins & check-outs
  const [livePunches, setLivePunches] = useState([
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
  ]);

  const handleApprovePunch = (p) => {
    addToast({
      title: 'Punch Verified',
      message: `${p.name}'s clock-in at ${p.checkIn} confirmed.`,
      type: 'success',
    });
  };

  const handleFlagPunch = (p) => {
    addToast({
      title: 'Punch Flagged',
      message: `${p.name}'s punch flagged for manager review.`,
      type: 'warning',
    });
  };

  const handleStatusChange = (id, newStatus) => {
    setLivePunches((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p))
    );
    addToast({
      title: 'Status Updated',
      message: `Punch status changed to "${newStatus}".`,
      type: 'info',
    });
  };

  const handleActionChange = (id, newAction) => {
    setLivePunches((prev) =>
      prev.map((p) => (p.id === id ? { ...p, action: newAction } : p))
    );
    addToast({
      title: 'Action Recorded',
      message: `Punch action set to ${newAction}.`,
      type: newAction === 'qualified' ? 'success' : 'warning',
    });
  };

  const filterTabs = [
    { id: 'All', label: 'All', count: livePunches.length },
    { id: 'In Office', label: 'In Office', count: livePunches.filter((p) => p.location === 'In Office' && p.status !== 'Checked Out').length },
    { id: 'Remote', label: 'Remote', count: livePunches.filter((p) => p.location === 'Remote').length },
    { id: 'Late', label: 'Late', count: livePunches.filter((p) => p.status === 'Late').length, badgeColor: 'bg-rose-50 text-rose-600 border border-rose-200' },
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
      <div>
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E5EAF2]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-[#172033] text-sm">Check-in / Check-out</h3>
                <span className="text-[10px] font-semibold text-[#2563EB] bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                  Live Feed
                </span>
              </div>
              <p className="text-[11px] text-[#8292AD]">Admin Employee Punch Table</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>224 Present</span>
            </span>
          </div>
        </div>

        {/* Filter Pills Bar (styled identical to Reference Image) */}
        <div className="flex items-center justify-between gap-2 my-3 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1.5">
            {filterTabs.map((t) => {
              const isActive = filter === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setFilter(t.id)}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10.5px] font-semibold transition-all ${isActive
                    ? 'bg-[#2563EB] text-white shadow-2xs'
                    : 'bg-white text-[#64748B] hover:text-[#172033] hover:bg-[#F8FAFC] border border-[#E5EAF2]'
                    }`}
                >
                  <span>{t.label}</span>
                  <span
                    className={`text-[9.5px] font-bold px-1.5 py-0.2 rounded-full ml-0.5 ${isActive
                      ? 'bg-[#1D4ED8] text-white'
                      : t.badgeColor || 'bg-[#F1F5F9] text-[#64748B]'
                      }`}
                  >
                    {t.count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="text-[10px] text-[#8292AD] font-medium hidden sm:flex items-center gap-1 flex-shrink-0">
            <span>{filteredPunches.length} Shown</span>
            <RotateCw className="w-2.5 h-2.5 text-[#8292AD]" />
          </div>
        </div>

        {/* Table styled identical to Reference Image: fonts, colors, borders & alignment */}
        <div className="overflow-x-auto -mx-1">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E5EAF2] bg-white">
                <th className="py-2.5 px-3 text-[10px] font-bold text-[#8292AD] uppercase tracking-wider">
                  EMPLOYEE
                </th>
                <th className="py-2.5 px-2 text-[10px] font-bold text-[#8292AD] uppercase tracking-wider">
                  PUNCH
                </th>
                <th className="py-2.5 px-2 text-[10px] font-bold text-[#8292AD] uppercase tracking-wider text-right">
                  OPTIONS
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9] text-xs text-[#172033]">
              {filteredPunches.slice(0, 4).map((p) => (
                <tr
                  key={p.id}
                  className="hover:bg-[#F8FAFC] transition-colors group"
                >
                  {/* Employee & Dept */}
                  <td className="py-2.5 px-3 align-middle">
                    <div className="flex items-center gap-2 min-w-0">
                      <img
                        src={p.avatar}
                        alt={p.name}
                        className="w-7 h-7 rounded-full object-cover ring-2 ring-[#E5EAF2] flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="font-bold text-[#172033] text-xs truncate leading-tight">
                          {p.name}
                        </p>
                        <p className="text-[10px] text-[#8292AD] truncate mt-0.5">
                          {p.department}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Punch in & duration */}
                  <td className="py-2.5 px-2 align-middle whitespace-nowrap">
                    <span className="text-[11px] font-bold text-[#172033] block leading-none">
                      {p.checkIn}
                    </span>
                    <span className="text-[10px] text-[#8292AD] block mt-1 leading-none">
                      {p.status === 'Checked Out' ? `Out: ${p.checkOut}` : p.workHours}
                    </span>
                  </td>

                  {/* Options Pill Badge (Clean Static Badge) */}
                  <td className="py-2.5 px-2 align-middle text-right whitespace-nowrap">
                    <StatusBadge
                      status={p.status}
                      size="xs"
                      showChevron={false}
                      interactive={false}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-2.5 border-t border-[#E5EAF2] text-xs mt-2">
        <span className="text-[#8292AD] text-[11px]">
          Showing {Math.min(4, filteredPunches.length)} of {livePunches.length} records
        </span>
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
