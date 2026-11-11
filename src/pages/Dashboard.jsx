import React, { useState, useEffect } from 'react';
import { OnLeaveTodayWidget } from '../components/dashboard/OnLeaveTodayWidget';
import { CheckInsCard } from '../components/dashboard/CheckInsCard';
import { BirthdaysCard } from '../components/dashboard/BirthdaysCard';
import { WorkAnniversariesCard } from '../components/dashboard/WorkAnniversariesCard';
import { CodefliesEventsCard } from '../components/dashboard/CodefliesEventsCard';
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

      {/* Dashboard Master Layout: Column 1 + Columns 2 & 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start w-full">
        {/* COLUMN 1: Inbox Leave Requests + Today's Leaves */}
        <div className="space-y-6 flex flex-col">
          <InboxLeaveRequestsCard
            requests={leaveRequests}
            onApprove={handleApproveLeave}
            onReject={handleRejectLeave}
          />
          <OnLeaveTodayWidget />
        </div>

        {/* COLUMNS 2 & 3 CONTAINER */}
        <div className="lg:col-span-2 space-y-6 flex flex-col">
          {/* Top 2-Column Split: Column 2 (left) and Column 3 (right) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {/* COLUMN 2: Birthday + Codeflies Events + Working Remotely */}
            <div className="space-y-6 flex flex-col">
              <BirthdaysCard />
              <CodefliesEventsCard />
              <WorkingRemotelyWidget />
            </div>

            {/* COLUMN 3: Work Anniversary + Check-in / Check-out */}
            <div className="space-y-6 flex flex-col">
              <WorkAnniversariesCard />
              <CheckInsCard />
            </div>
          </div>

          {/* 2nd & 3rd Column: Upcoming Holidays (Spans both Columns 2 & 3) */}
          <div className="w-full flex flex-col">
            <Holidays3CardsView />
          </div>
        </div>
      </div>
    </div>
  );
};
