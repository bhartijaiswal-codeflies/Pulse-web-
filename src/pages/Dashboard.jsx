import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { OnLeaveTodayWidget } from '../components/dashboard/OnLeaveTodayWidget';
import { CheckInsCard } from '../components/dashboard/CheckInsCard';
import { BirthdaysCard } from '../components/dashboard/BirthdaysCard';
import { WorkAnniversariesCard } from '../components/dashboard/WorkAnniversariesCard';
import { Holidays3CardsView } from '../components/dashboard/Holidays3CardsView';
import { WorkingRemotelyWidget } from '../components/dashboard/WorkingRemotelyWidget';
import { InboxLeaveRequestsCard } from '../components/dashboard/InboxLeaveRequestsCard';
import { Modal } from '../components/common/Modal';
import { employeeService } from '../services/employeeService';
import { currentUser } from '../data/mockData';
import { useToast } from '../context/NotificationContext';

export const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('DASHBOARD');
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [showApplyLeaveModal, setShowApplyLeaveModal] = useState(false);
  const { addToast } = useToast();

  // Apply leave form state
  const [leaveType, setLeaveType] = useState('Privilege Leave');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [days, setDays] = useState(2);
  const [reason, setReason] = useState('');

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

  const handleApplyLeaveSubmit = (e) => {
    e.preventDefault();
    if (!startDate || !endDate) {
      addToast({
        title: 'Missing dates',
        message: 'Please choose both start and end dates.',
        type: 'warning',
      });
      return;
    }

    employeeService.addLeaveRequest({
      employeeName: currentUser.name,
      employeeId: currentUser.employeeId,
      avatar: currentUser.avatar,
      department: currentUser.department,
      leaveType,
      startDate,
      endDate,
      days: Number(days) || 1,
      reason,
    });

    addToast({
      title: 'Leave Request Submitted',
      message: `Your ${leaveType} (${days} days) has been logged for supervisor approval.`,
      type: 'success',
    });

    loadData();
    setShowApplyLeaveModal(false);
    setReason('');
    setStartDate('');
    setEndDate('');
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

      {/* 3-Column Grid Layout: Equal Alignment Across All Rows */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch w-full">
        {/* ROW 1 */}
        {/* Col 1 -> Inbox leave requests (Moved above Today's Leaves) */}
        <div className="w-full flex flex-col">
          <InboxLeaveRequestsCard
            requests={leaveRequests}
            onApprove={handleApproveLeave}
            onReject={handleRejectLeave}
          />
        </div>

        {/* Col 2 -> Celebrating Birthday */}
        <div className="w-full flex flex-col">
          <BirthdaysCard />
        </div>

        {/* Col 3 -> Working Remotely */}
        <div className="w-full flex flex-col">
          <WorkingRemotelyWidget />
        </div>

        {/* ROW 2 */}
        {/* Col 1 -> Today's Leaves */}
        <div className="w-full flex flex-col">
          <OnLeaveTodayWidget onApplyLeaveClick={() => setShowApplyLeaveModal(true)} />
        </div>

        {/* Col 2 -> Celebrating Work Anniversary */}
        <div className="w-full flex flex-col">
          <WorkAnniversariesCard />
        </div>

        {/* Col 3 -> Check-in / Check-out (Admin Roster List View) */}
        <div className="w-full flex flex-col">
          <CheckInsCard />
        </div>

        {/* ROW 3 -> Upcoming Holidays (Spans all 3 Columns with 3 Cards View) */}
        <div className="w-full lg:col-span-3 flex flex-col">
          <Holidays3CardsView />
        </div>
      </div>

      {/* Apply Leave Modal */}
      {showApplyLeaveModal && (
        <Modal
          isOpen={showApplyLeaveModal}
          onClose={() => setShowApplyLeaveModal(false)}
          title="Submit Leave Request"
          subtitle="Submit formal time-off request for manager approval"
        >
          <form onSubmit={handleApplyLeaveSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#172033] mb-1.5">
                Leave Type *
              </label>
              <select
                value={leaveType}
                onChange={(e) => setLeaveType(e.target.value)}
                className="w-full px-3.5 py-2 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 bg-white"
              >
                <option value="Privilege Leave">Privilege Leave (Balance: 18 days)</option>
                <option value="Casual Leave">Casual Leave (Balance: 10 days)</option>
                <option value="Sick Leave">Sick Leave (Balance: 7 days)</option>
                <option value="Compensatory Off">Compensatory Off (Balance: 2 days)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#172033] mb-1.5">
                  Start Date *
                </label>
                <input
                  type="date"
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#172033] mb-1.5">
                  End Date *
                </label>
                <input
                  type="date"
                  required
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#172033] mb-1.5">
                Total Days
              </label>
              <input
                type="number"
                min="1"
                max="30"
                value={days}
                onChange={(e) => setDays(e.target.value)}
                className="w-full px-3.5 py-2 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#172033] mb-1.5">
                Reason for Leave
              </label>
              <textarea
                rows={3}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Briefly describe the reason for your time-off..."
                className="w-full px-3.5 py-2 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#E5EAF2]">
              <button
                type="button"
                onClick={() => setShowApplyLeaveModal(false)}
                className="px-4 py-2 text-xs rounded-xl border border-[#E5EAF2] text-[#8292AD] hover:bg-[#F7F9FC]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-semibold rounded-xl bg-[#2563EB] text-white hover:bg-blue-700 shadow-sm"
              >
                Submit Request
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
