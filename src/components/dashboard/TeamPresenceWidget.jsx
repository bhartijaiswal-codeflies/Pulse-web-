import React from 'react';
import { UserMinus, Laptop, UserPlus, Sparkles, Send } from 'lucide-react';
import { useToast } from '../../context/NotificationContext';

export const TeamPresenceWidget = () => {
  const { addToast } = useToast();

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
      location: 'Montreal, Canada',
      clockIn: '09:00 AM',
    },
  ];

  const newJoinees = [
    {
      id: 'J1',
      name: 'Ananya Deshmukh',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80',
      role: 'Financial Analyst',
      joined: 'Joined 3 days ago',
    },
    {
      id: 'J2',
      name: 'Devin Thorne',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80',
      role: 'DevOps Specialist',
      joined: 'Joined 1 week ago',
    },
  ];

  const handleWelcome = (name) => {
    addToast({
      title: 'Welcome Message Delivered! 👋',
      message: `Sent orientation welcome note to ${name}.`,
      type: 'success',
    });
  };

  return (
    <div className="bg-white border border-[#E5EAF2] rounded-2xl shadow-card overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-[#E5EAF2] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <h2 className="text-sm font-bold text-[#172033]">Team Presence & New Joinees</h2>
        </div>
        <span className="text-[11px] font-semibold text-[#8292AD]">Today's Roster</span>
      </div>

      <div className="p-4 space-y-4">
        {/* On Leave Today */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#4E5D78] flex items-center gap-1.5">
              <UserMinus className="w-3.5 h-3.5 text-amber-500" />
              <span>On Leave Today ({onLeaveStaff.length})</span>
            </span>
          </div>
          <div className="space-y-1.5">
            {onLeaveStaff.map((staff) => (
              <div
                key={staff.id}
                className="flex items-center justify-between p-2 rounded-xl bg-[#FBFDFE] border border-[#E5EAF2] text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <img
                    src={staff.avatar}
                    alt={staff.name}
                    className="w-7 h-7 rounded-full object-cover ring-1 ring-amber-200"
                  />
                  <div>
                    <p className="font-semibold text-[#172033]">{staff.name}</p>
                    <p className="text-[10px] text-[#8292AD]">{staff.type}</p>
                  </div>
                </div>
                <span className="text-[10px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                  {staff.returns}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Working Remotely */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#4E5D78] flex items-center gap-1.5">
              <Laptop className="w-3.5 h-3.5 text-blue-500" />
              <span>Working Remotely ({remoteStaff.length})</span>
            </span>
          </div>
          <div className="space-y-1.5">
            {remoteStaff.map((staff) => (
              <div
                key={staff.id}
                className="flex items-center justify-between p-2 rounded-xl bg-[#FBFDFE] border border-[#E5EAF2] text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <img
                    src={staff.avatar}
                    alt={staff.name}
                    className="w-7 h-7 rounded-full object-cover ring-1 ring-blue-200"
                  />
                  <div>
                    <p className="font-semibold text-[#172033]">{staff.name}</p>
                    <p className="text-[10px] text-[#8292AD]">{staff.location}</p>
                  </div>
                </div>
                <span className="text-[10px] text-[#8292AD]">Since {staff.clockIn}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Welcome New Joinees */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#4E5D78] flex items-center gap-1.5">
              <UserPlus className="w-3.5 h-3.5 text-emerald-500" />
              <span>Welcome New Joinees</span>
            </span>
          </div>
          <div className="space-y-1.5">
            {newJoinees.map((staff) => (
              <div
                key={staff.id}
                className="flex items-center justify-between p-2 rounded-xl bg-[#FBFDFE] border border-[#E5EAF2] text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <img
                    src={staff.avatar}
                    alt={staff.name}
                    className="w-7 h-7 rounded-full object-cover ring-1 ring-emerald-200"
                  />
                  <div>
                    <p className="font-semibold text-[#172033]">{staff.name}</p>
                    <p className="text-[10px] text-[#8292AD]">{staff.role}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleWelcome(staff.name)}
                  className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200 transition-colors"
                >
                  <Send className="w-3 h-3" />
                  <span>Welcome</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

