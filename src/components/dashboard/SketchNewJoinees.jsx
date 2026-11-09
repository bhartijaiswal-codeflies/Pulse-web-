import React from 'react';
import { UserPlus, Send, Sparkles } from 'lucide-react';
import { useToast } from '../../context/NotificationContext';

export const SketchNewJoinees = () => {
  const { addToast } = useToast();

  const newJoinees = [
    {
      id: 'J1',
      name: 'Ananya Deshmukh',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80',
      role: 'Financial Analyst',
      department: 'Finances',
      joined: 'Joined 3 days ago',
    },
    {
      id: 'J2',
      name: 'Devin Thorne',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80',
      role: 'DevOps Specialist',
      department: 'Engineering',
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
    <div className="bg-white border border-[#E5EAF2] rounded-2xl p-5 shadow-card flex flex-col justify-between">
      {/* Header matching Sketch: "New Joinee" */}
      <div className="flex items-center justify-between pb-3 border-b border-[#E5EAF2]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <UserPlus className="w-4 h-4 stroke-[2.2]" />
          </div>
          <div>
            <h3 className="font-bold text-[#172033] text-sm">New Joinee</h3>
            <p className="text-[11px] text-[#8292AD]">Welcoming Recent Team Members</p>
          </div>
        </div>

        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
          Last 30 Days
        </span>
      </div>

      {/* List */}
      <div className="my-3 space-y-2.5">
        {newJoinees.map((staff) => (
          <div
            key={staff.id}
            className="flex items-center justify-between p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E5EAF2] hover:bg-slate-100/70 transition-colors text-xs"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <img
                src={staff.avatar}
                alt={staff.name}
                className="w-9 h-9 rounded-full object-cover ring-2 ring-emerald-200 flex-shrink-0"
              />
              <div className="min-w-0">
                <p className="font-bold text-[#172033] truncate">{staff.name}</p>
                <p className="text-[10px] text-[#8292AD]">{staff.role} • {staff.department}</p>
                <span className="text-[9px] text-emerald-600 font-semibold block">{staff.joined}</span>
              </div>
            </div>

            <button
              onClick={() => handleWelcome(staff.name)}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors flex-shrink-0"
            >
              <Send className="w-3 h-3" />
              <span>Welcome</span>
            </button>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="pt-2.5 border-t border-[#E5EAF2] text-center text-xs text-[#8292AD]">
        <span>Onboarding buddy assigned for smooth integration</span>
      </div>
    </div>
  );
};
