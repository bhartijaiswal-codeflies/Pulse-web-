import React, { useState, useEffect } from 'react';
import { Clock, Play, Square, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { attendanceService } from '../../services/attendanceService';
import { currentUser } from '../../data/mockData';
import { useToast } from '../../context/NotificationContext';

export const TimeTodayCard = ({ onAttendanceChange }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isClockedIn, setIsClockedIn] = useState(true);
  const [showOtherMenu, setShowOtherMenu] = useState(false);
  const [workMode, setWorkMode] = useState('In Office');
  const { addToast } = useToast();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleToggleClock = () => {
    if (isClockedIn) {
      attendanceService.checkOut(currentUser.employeeId);
      setIsClockedIn(false);
      addToast({
        title: 'Web Clock-Out',
        message: 'Clocked out successfully. Shift completed.',
        type: 'info',
      });
    } else {
      attendanceService.checkIn(currentUser);
      setIsClockedIn(true);
      addToast({
        title: 'Web Clock-In',
        message: `Clocked in successfully at ${currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} (${workMode}).`,
        type: 'success',
      });
    }
    if (onAttendanceChange) onAttendanceChange();
  };

  const timeFormatted = currentTime.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  return (
    <div className="bg-gradient-to-br from-[#7C71BC] via-[#6D62AF] to-[#594E9A] text-white rounded-2xl p-5 shadow-card flex flex-col justify-between min-h-[175px]">
      {/* Header */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 font-bold tracking-wide">
          <Clock className="w-4 h-4 text-purple-200" />
          <span>Time Today -</span>
        </div>
        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/20 text-white">
          {workMode}
        </span>
      </div>

      {/* Clock Display */}
      <div className="my-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-purple-200 block mb-0.5">
          CURRENT TIME
        </span>
        <div className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-white flex items-center gap-2">
          <span>{timeFormatted}</span>
          <span className={`w-2 h-2 rounded-full ${isClockedIn ? 'bg-emerald-300 animate-pulse' : 'bg-rose-300'}`} />
        </div>
      </div>

      {/* Action Row */}
      <div className="flex items-center justify-between pt-2 border-t border-white/15">
        <div className="flex items-center gap-2">
          {/* Main Button */}
          <button
            onClick={handleToggleClock}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm active:scale-95 ${
              isClockedIn
                ? 'bg-rose-500 hover:bg-rose-600 text-white'
                : 'bg-white hover:bg-slate-100 text-[#594E9A]'
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

          {/* Other Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowOtherMenu(!showOtherMenu)}
              className="px-2.5 py-1.5 rounded-xl text-xs font-medium bg-black/20 hover:bg-black/30 text-white flex items-center gap-1 border border-white/20"
            >
              <span>Other</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {showOtherMenu && (
              <div className="absolute left-0 bottom-full mb-1 w-36 bg-white text-[#172033] rounded-xl shadow-dropdown border border-[#E5EAF2] py-1 z-20 animate-fade-in text-xs font-medium">
                {['In Office', 'Work from Home', 'On Client Site', 'Half Day'].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => {
                      setWorkMode(opt);
                      setShowOtherMenu(false);
                      addToast({ title: 'Work Mode Updated', message: `Location set to ${opt}.`, type: 'info' });
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-[#F7F9FC]"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <Link
          to="/attendance"
          className="text-xs text-purple-200 hover:text-white font-semibold hover:underline"
        >
          View All
        </Link>
      </div>
    </div>
  );
};

