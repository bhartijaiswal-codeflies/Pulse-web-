import React, { useState, useEffect } from 'react';
import { Clock, Play, Square, MapPin, CheckCircle2 } from 'lucide-react';
import { attendanceService } from '../../services/attendanceService';
import { currentUser } from '../../data/mockData';
import { useToast } from '../../context/NotificationContext';

export const CheckInsCard = ({ onAttendanceChange }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isCheckedIn, setIsCheckedIn] = useState(true);
  const [checkInTime, setCheckInTime] = useState('08:52 AM');
  const [workLocation, setWorkLocation] = useState('In Office');
  const { addToast } = useToast();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleToggleCheckIn = () => {
    if (isCheckedIn) {
      attendanceService.checkOut(currentUser.employeeId);
      setIsCheckedIn(false);
      addToast({
        title: 'Checked Out',
        message: `Checked out at ${currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.`,
        type: 'info',
      });
    } else {
      attendanceService.checkIn(currentUser);
      setIsCheckedIn(true);
      const timeStr = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setCheckInTime(timeStr);
      addToast({
        title: 'Checked In Successfully',
        message: `Checked in at ${timeStr} (${workLocation}).`,
        type: 'success',
      });
    }
    if (onAttendanceChange) onAttendanceChange();
  };

  return (
    <div className="bg-white border border-[#E5EAF2] rounded-2xl p-5 shadow-card hover:shadow-subtle transition-all flex flex-col justify-between h-full min-h-[190px]">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#E5EAF2]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-[#172033] text-sm">CheckIns</h3>
            <p className="text-[11px] text-[#8292AD]">Web Punch & Time Tracker</p>
          </div>
        </div>
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
            isCheckedIn
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : 'bg-slate-50 text-slate-600 border-slate-200'
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              isCheckedIn ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
            }`}
          />
          <span>{isCheckedIn ? 'Checked In' : 'Checked Out'}</span>
        </span>
      </div>

      {/* Clock and Status Display */}
      <div className="my-2.5">
        <div className="flex items-baseline justify-between">
          <div className="text-2xl font-black font-mono tracking-tight text-[#172033]">
            {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </div>
          <span className="text-[11px] font-semibold text-[#2563EB] bg-blue-50 px-2 py-0.5 rounded-md">
            5h 46m logged
          </span>
        </div>

        <p className="text-xs text-[#8292AD] mt-1 flex items-center gap-1">
          {isCheckedIn ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>Shift started at {checkInTime}</span>
            </>
          ) : (
            <span>Not currently clocked in for shift</span>
          )}
        </p>

        {/* Shift progress indicator */}
        <div className="mt-2.5">
          <div className="flex items-center justify-between text-[10px] text-[#8292AD] mb-1">
            <span>Progress: 72% of 8h 00m</span>
            <span>Ends 05:30 PM</span>
          </div>
          <div className="w-full bg-[#E5EAF2] h-1.5 rounded-full overflow-hidden">
            <div className="bg-[#2563EB] h-full rounded-full transition-all duration-500" style={{ width: '72%' }} />
          </div>
        </div>
      </div>

      {/* Location Selector & Check In / Out Button */}
      <div className="flex items-center gap-2 pt-2.5 border-t border-[#E5EAF2]">
        <select
          value={workLocation}
          onChange={(e) => setWorkLocation(e.target.value)}
          className="text-xs bg-[#F7F9FC] border border-[#E5EAF2] text-[#172033] rounded-xl px-2.5 py-2 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 flex-1 font-medium"
        >
          <option value="In Office">🏢 In Office</option>
          <option value="Remote">🏠 Remote</option>
          <option value="Client Site">🌐 Client Site</option>
        </select>

        <button
          onClick={handleToggleCheckIn}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm active:scale-95 ${
            isCheckedIn
              ? 'bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200'
              : 'bg-[#2563EB] hover:bg-blue-700 text-white shadow-blue-500/20'
          }`}
        >
          {isCheckedIn ? (
            <>
              <Square className="w-3.5 h-3.5 fill-current" />
              <span>Check Out</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Check In</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

