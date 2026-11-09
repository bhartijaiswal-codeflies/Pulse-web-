import React, { useState, useEffect } from 'react';
import { OnLeaveTodayWidget } from '../components/dashboard/OnLeaveTodayWidget';
import { CheckInsCard } from '../components/dashboard/CheckInsCard';
import { BirthdaysCard } from '../components/dashboard/BirthdaysCard';
import { WorkAnniversariesCard } from '../components/dashboard/WorkAnniversariesCard';
import { Holidays3CardsView } from '../components/dashboard/Holidays3CardsView';
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

      {/* 3-Column Grid: Upcoming Holidays in 2 columns using previous 3 cards view */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch w-full">
        {/* ROW 1: Col 1 -> Inbox leave requests (Above Today's Leaves) */}
        <div className="w-full lg:col-start-1 lg:row-start-1 flex flex-col">
          <InboxLeaveRequestsCard
            requests={leaveRequests}
            onApprove={handleApproveLeave}
            onReject={handleRejectLeave}
          />
        </div>

        {/* ROW 1: Col 2 -> Celebrating Birthday */}
        <div className="w-full lg:col-start-2 lg:row-start-1 flex flex-col">
          <BirthdaysCard />
        </div>

        {/* ROW 1: Col 3 -> Working Remotely */}
        <div className="w-full lg:col-start-3 lg:row-start-1 flex flex-col">
          <WorkingRemotelyWidget />
        </div>

        {/* ROW 2 & 3: Col 1 -> Today's Leaves (Spans 2 Rows alongside Anniversary & Holidays) */}
        <div className="w-full lg:col-start-1 lg:row-start-2 lg:row-span-2 flex flex-col">
          <OnLeaveTodayWidget />
        </div>

        {/* ROW 2: Col 2 -> Celebrating Work Anniversary */}
        <div className="w-full lg:col-start-2 lg:row-start-2 flex flex-col">
          <WorkAnniversariesCard />
        </div>

        {/* ROW 2: Col 3 -> Check-in / Check-out (Admin Roster List View) */}
        <div className="w-full lg:col-start-3 lg:row-start-2 flex flex-col">
          <CheckInsCard />
        </div>

        {/* ROW 3: Col 2 & 3 -> Upcoming Holidays (Spans 2 Columns with Previous 3 Cards View) */}
        <div className="w-full lg:col-start-2 lg:col-span-2 lg:row-start-3 flex flex-col">
          <Holidays3CardsView />
        </div>
      </div>
    </div>
  );
};
