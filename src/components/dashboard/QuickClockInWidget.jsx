import React, { useState, useEffect } from 'react';
import { Clock, Play, Square, MapPin, CheckCircle2 } from 'lucide-react';
import { attendanceService } from '../../services/attendanceService';
import { currentUser } from '../../data/mockData';
import { useToast } from '../../context/NotificationContext';

export const QuickClockInWidget = ({ onAttendanceChange }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isClockedIn, setIsClockedIn] = useState(true);
  const [clockInTime, setClockInTime] = useState('08:52 AM');
  const [workLocation, setWorkLocation] = useState('In Office');
  const { addToast } = useToast();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleToggleClock = () => {
    if (isClockedIn) {
      // Clock Out
      attendanceService.checkOut(currentUser.employeeId);
      setIsClockedIn(false);
      addToast({
        title: 'Clocked Out',
        message: `Clocked out at ${currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}. Have a great evening!`,
        type: 'info',
      });
    } else {
      // Clock In
      attendanceService.checkIn(currentUser);
      setIsClockedIn(true);
      const timeStr = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setClockInTime(timeStr);
      addToast({
        title: 'Clocked In Successfully',
        message: `Welcome! Checked in at ${timeStr} (${workLocation}).`,
        type: 'success',
      });
    }
    if (onAttendanceChange) onAttendanceChange();
  };

  return (
    <div className="bg-gradient-to-br from-[#1E293B] to-[#0F172A] text-white border border-[#334155] rounded-2xl p-4 shadow-card">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-blue-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Time Tracker
          </span>
        </div>
        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
          Live
        </span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="text-2xl font-black font-mono tracking-tight text-white">
            {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${isClockedIn ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
            {isClockedIn ? `Clocked in at ${clockInTime}` : 'Not currently clocked in'}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={workLocation}
            onChange={(e) => setWorkLocation(e.target.value)}
            className="text-xs bg-slate-800 border border-slate-700 text-slate-300 rounded-xl px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-400"
          >
            <option value="In Office">🏢 In Office</option>
            <option value="Remote">🏠 Remote</option>
            <option value="Hybrid">🌐 Client Site</option>
          </select>

          <button
            onClick={handleToggleClock}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm ${
              isClockedIn
                ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/20'
                : 'bg-[#2563EB] hover:bg-blue-600 text-white shadow-blue-500/20'
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
      </div>
    </div>
  );
};
