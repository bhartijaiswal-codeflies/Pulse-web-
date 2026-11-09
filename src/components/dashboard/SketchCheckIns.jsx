import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle2, AlertTriangle, Play, Square, MapPin } from 'lucide-react';
import { attendanceService } from '../../services/attendanceService';
import { currentUser } from '../../data/mockData';
import { useToast } from '../../context/NotificationContext';

export const SketchCheckIns = ({ onAttendanceChange }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isClockedIn, setIsClockedIn] = useState(true);
  const [records, setRecords] = useState([]);
  const { addToast } = useToast();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const loadData = () => {
    setRecords(attendanceService.getRecords());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleClock = () => {
    if (isClockedIn) {
      attendanceService.checkOut(currentUser.employeeId);
      setIsClockedIn(false);
      addToast({
        title: 'Clocked Out',
        message: 'Checked out for the day.',
        type: 'info',
      });
    } else {
      attendanceService.checkIn(currentUser);
      setIsClockedIn(true);
      addToast({
        title: 'Clocked In',
        message: `Checked in successfully at ${currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.`,
        type: 'success',
      });
    }
    loadData();
    if (onAttendanceChange) onAttendanceChange();
  };

  return (
    <div className="bg-white border border-[#E5EAF2] rounded-2xl p-5 shadow-card flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#E5EAF2]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center">
            <Clock className="w-4 h-4 stroke-[2.2]" />
          </div>
          <div>
            <h3 className="font-bold text-[#172033] text-sm">CheckIns</h3>
            <p className="text-[11px] text-[#8292AD]">Live Employee Punch Records</p>
          </div>
        </div>

        {/* Quick Web Clock-In / Out Button */}
        <button
          onClick={handleToggleClock}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl transition-all shadow-xs active:scale-95 ${
            isClockedIn
              ? 'bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200'
              : 'bg-[#2563EB] text-white hover:bg-blue-700'
          }`}
        >
          {isClockedIn ? (
            <>
              <Square className="w-3.5 h-3.5 fill-current" />
              <span>Clock Out</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Web Clock-In</span>
            </>
          )}
        </button>
      </div>

      {/* Live Punch Feed */}
      <div className="my-3 space-y-2 max-h-[220px] overflow-y-auto pr-1">
        {records.slice(0, 5).map((r) => (
          <div
            key={r.id}
            className="flex items-center justify-between p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E5EAF2] hover:bg-slate-100/70 transition-colors text-xs"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <img
                src={r.avatar}
                alt={r.name}
                className="w-8 h-8 rounded-full object-cover ring-1 ring-[#E5EAF2] flex-shrink-0"
              />
              <div className="min-w-0">
                <p className="font-bold text-[#172033] truncate">{r.name}</p>
                <p className="text-[10px] text-[#8292AD] flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#2563EB]" /> {r.location}
                </p>
              </div>
            </div>

            <div className="text-right flex-shrink-0">
              <span className="font-mono font-bold text-xs text-[#172033] block">
                {r.checkIn}
              </span>
              <span
                className={`text-[10px] font-semibold px-2 py-0.2 rounded-full inline-block ${
                  r.status === 'On Time'
                    ? 'text-emerald-700 bg-emerald-50 border border-emerald-200'
                    : r.status === 'Late'
                    ? 'text-rose-700 bg-rose-50 border border-rose-200'
                    : 'text-amber-700 bg-amber-50 border border-amber-200'
                }`}
              >
                {r.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="pt-2.5 border-t border-[#E5EAF2] flex items-center justify-between text-xs text-[#8292AD]">
        <span className="font-mono text-[11px]">
          Time now: {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </span>
        <span className="text-emerald-600 font-semibold text-[11px] flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5" /> 224 Present
        </span>
      </div>
    </div>
  );
};
