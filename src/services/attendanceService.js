import { attendanceRecords } from '../data/mockData';

const ATTENDANCE_KEY = 'pulse_attendance_v3';

export const attendanceService = {
  getRecords: () => {
    const saved = localStorage.getItem(ATTENDANCE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    localStorage.setItem(ATTENDANCE_KEY, JSON.stringify(attendanceRecords));
    return attendanceRecords;
  },

  checkIn: (emp) => {
    const records = attendanceService.getRecords();
    const existingIndex = records.findIndex((r) => r.employeeId === emp.employeeId);
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    let updated = [...records];
    if (existingIndex >= 0) {
      updated[existingIndex] = {
        ...updated[existingIndex],
        checkIn: timeStr,
        status: 'On Time',
        workHours: 'Active',
      };
    } else {
      updated.unshift({
        id: `ATT-${Date.now().toString().slice(-4)}`,
        employeeId: emp.employeeId,
        name: emp.name,
        avatar: emp.avatar,
        department: emp.department,
        date: 'Today',
        checkIn: timeStr,
        checkOut: '--:--',
        workHours: 'Active',
        status: 'On Time',
        location: 'Office (SF HQ)',
      });
    }
    localStorage.setItem(ATTENDANCE_KEY, JSON.stringify(updated));
    return updated;
  },

  checkOut: (employeeId) => {
    const records = attendanceService.getRecords();
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const updated = records.map((r) => {
      if (r.employeeId === employeeId) {
        return {
          ...r,
          checkOut: timeStr,
          workHours: '8h 15m (Completed)',
        };
      }
      return r;
    });

    localStorage.setItem(ATTENDANCE_KEY, JSON.stringify(updated));
    return updated;
  },
};

