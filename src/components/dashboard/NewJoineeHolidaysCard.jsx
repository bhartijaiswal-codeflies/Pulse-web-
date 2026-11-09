import React, { useState } from 'react';
import { UserPlus, Palmtree, Calendar, Send, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { upcomingHolidays } from '../../data/mockData';
import { useToast } from '../../context/NotificationContext';

export const NewJoineeHolidaysCard = () => {
  const [activeSubTab, setActiveSubTab] = useState('all'); // 'all', 'joinees', 'holidays'
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
      role: 'Senior DevOps SRE',
      department: 'Infrastructure',
      joined: 'Joined 1 week ago',
    },
    {
      id: 'J3',
      name: 'Lucas Brandao',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
      role: 'Lead UX Designer',
      department: 'Design',
      joined: 'Joined 2 weeks ago',
    },
  ];

  const handleWelcome = (name) => {
    addToast({
      title: 'Welcome Message Sent! 👋',
      message: `Onboarding greeting delivered to ${name}.`,
      type: 'success',
    });
  };

  return (
    <div className="bg-white border border-[#E5EAF2] rounded-2xl p-5 shadow-card hover:shadow-subtle transition-all flex flex-col justify-between h-full">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-[#E5EAF2]">
          <div>
            <h3 className="font-bold text-[#172033] text-sm flex items-center gap-1.5">
              <span>New Joinee / Holidays</span>
            </h3>
            <p className="text-[11px] text-[#8292AD]">Onboarding & Office Schedule</p>
          </div>

          {/* Sub-tab pills */}
          <div className="inline-flex rounded-lg p-0.5 bg-[#F7F9FC] border border-[#E5EAF2] text-[11px] font-semibold">
            <button
              onClick={() => setActiveSubTab('all')}
              className={`px-2 py-0.5 rounded-md transition-colors ${
                activeSubTab === 'all'
                  ? 'bg-white text-[#2563EB] shadow-xs'
                  : 'text-[#8292AD] hover:text-[#172033]'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveSubTab('joinees')}
              className={`px-2 py-0.5 rounded-md transition-colors ${
                activeSubTab === 'joinees'
                  ? 'bg-white text-[#2563EB] shadow-xs'
                  : 'text-[#8292AD] hover:text-[#172033]'
              }`}
            >
              Joinees
            </button>
            <button
              onClick={() => setActiveSubTab('holidays')}
              className={`px-2 py-0.5 rounded-md transition-colors ${
                activeSubTab === 'holidays'
                  ? 'bg-white text-[#2563EB] shadow-xs'
                  : 'text-[#8292AD] hover:text-[#172033]'
              }`}
            >
              Holidays
            </button>
          </div>
        </div>

        {/* Content Items */}
        <div className="my-3 space-y-4">
          {/* New Joinees Section */}
          {(activeSubTab === 'all' || activeSubTab === 'joinees') && (
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#8292AD] mb-2 flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <UserPlus className="w-3.5 h-3.5 text-emerald-600" /> New Joiners ({newJoinees.length})
                </span>
              </div>
              <div className="space-y-2">
                {newJoinees.map((joinee) => (
                  <div
                    key={joinee.id}
                    className="p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E5EAF2] flex items-center justify-between gap-3 text-xs hover:border-blue-200 transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={joinee.avatar}
                        alt={joinee.name}
                        className="w-8 h-8 rounded-full object-cover ring-2 ring-emerald-200 flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="font-bold text-[#172033] truncate">{joinee.name}</p>
                        <p className="text-[10px] text-[#8292AD] truncate">{joinee.role}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleWelcome(joinee.name)}
                      className="px-2 py-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200 transition-colors flex-shrink-0"
                    >
                      Welcome
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upcoming Holidays Section */}
          {(activeSubTab === 'all' || activeSubTab === 'holidays') && (
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#8292AD] mb-2 flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <Palmtree className="w-3.5 h-3.5 text-blue-600" /> Upcoming Holidays
                </span>
                <Link to="/calendar" className="text-[10px] text-[#2563EB] hover:underline normal-case font-semibold">
                  View Calendar
                </Link>
              </div>
              <div className="space-y-2">
                {upcomingHolidays.slice(0, 2).map((h) => (
                  <div
                    key={h.id}
                    className="p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E5EAF2] flex items-center justify-between gap-2 text-xs"
                  >
                    <div>
                      <p className="font-bold text-[#172033]">{h.name}</p>
                      <p className="text-[10px] text-[#8292AD]">{h.date} ({h.dayOfWeek})</p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex-shrink-0">
                      {h.badge}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="pt-2 border-t border-[#E5EAF2] text-[11px] text-[#8292AD] flex items-center justify-between">
        <span>3 joiners in Q4</span>
        <Link to="/calendar" className="text-[#2563EB] font-semibold hover:underline">
          View Holiday Policy
        </Link>
      </div>
    </div>
  );
};

