import React, { useState, useEffect } from 'react';
import { OnLeaveTodayWidget } from '../components/dashboard/OnLeaveTodayWidget';
import { CheckInsCard } from '../components/dashboard/CheckInsCard';
import { BirthdaysCard } from '../components/dashboard/BirthdaysCard';
import { WorkAnniversariesCard } from '../components/dashboard/WorkAnniversariesCard';
import { HolidaysSliderCard } from '../components/dashboard/HolidaysSliderCard';
import { WorkingRemotelyWidget } from '../components/dashboard/WorkingRemotelyWidget';
import { InboxLeaveRequestsCard } from '../components/dashboard/InboxLeaveRequestsCard';
import { employeeService } from '../services/employeeService';

export const Dashboard = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);

  const loadData = () => {
    setLeaveRequests(employeeService.getLeaveRequests());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleApproveLeave = (id) => {
    const updated = employeeService.updateLeaveStatus(id, 'Approved');
    setLeaveRequests(updated);
  };

  const handleRejectLeave = (id) => {
    const updated = employeeService.updateLeaveStatus(id, 'Rejected');
    setLeaveRequests(updated);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12 w-full">
      {/* Top Header: Only Dashboard text heading */}
      <div className="flex items-center justify-between pb-3 border-b border-[#E5EAF2] -mt-1">
        <div>
          <h1 className="text-xl font-extrabold text-[#172033] tracking-tight">Dashboard</h1>
          <p className="text-xs text-[#8292AD] mt-0.5">Admin Overview & Workforce Operations</p>
        </div>
      </div>

      {/* 3-Column Dashboard Grid: No separate row for holidays */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start w-full">
        {/* COLUMN 1 */}
        <div className="flex flex-col space-y-6 w-full">
          {/* Inbox leave requests (Above Today's Leaves) */}
          <InboxLeaveRequestsCard
            requests={leaveRequests}
            onApprove={handleApproveLeave}
            onReject={handleRejectLeave}
          />
          {/* Today's Leaves */}
          <OnLeaveTodayWidget />
        </div>

        {/* COLUMN 2 */}
        <div className="flex flex-col space-y-6 w-full">
          {/* Celebrating Birthday */}
          <BirthdaysCard />
          {/* Celebrating Work Anniversary */}
          <WorkAnniversariesCard />
          {/* Upcoming Holidays (Inside Column 2 Slider - Not in a new row) */}
          <HolidaysSliderCard />
        </div>

        {/* COLUMN 3 */}
        <div className="flex flex-col space-y-6 w-full">
          {/* Working Remotely */}
          <WorkingRemotelyWidget />
          {/* Check-in / Check-out (Admin Roster List View) */}
          <CheckInsCard />
        </div>
      </div>
    </div>
  );
};
