import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { OnLeaveTodayWidget } from '../components/dashboard/OnLeaveTodayWidget';
import { CheckInsCard } from '../components/dashboard/CheckInsCard';
import { BirthdaysCard } from '../components/dashboard/BirthdaysCard';
import { WorkAnniversariesCard } from '../components/dashboard/WorkAnniversariesCard';
import { HolidaysSliderCard } from '../components/dashboard/HolidaysSliderCard';
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
      {/* Top Header Row matching Wireframe: Dashboard | Candidate + Apply Leave button */}
      <div className="flex items-center justify-between border-b border-[#E5EAF2] pb-3 -mt-2">
        <div className="flex items-center gap-6">
          <button
            onClick={() => setActiveTab('DASHBOARD')}
            className={`text-xs font-extrabold uppercase tracking-wider pb-2 transition-colors relative ${
              activeTab === 'DASHBOARD'
                ? 'text-[#2563EB]'
                : 'text-[#8292AD] hover:text-[#172033]'
            }`}
          >
            <span>Dashboard</span>
            {activeTab === 'DASHBOARD' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2563EB] rounded-full" />
            )}
          </button>

          <button
            onClick={() => {
              setActiveTab('CANDIDATE');
              window.location.href = '/candidates';
            }}
            className="text-xs font-bold uppercase tracking-wider pb-2 text-[#8292AD] hover:text-[#172033] transition-colors"
          >
            Candidate
          </button>
        </div>

        <button
          onClick={() => setShowApplyLeaveModal(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white shadow-xs transition-all active:scale-95 shadow-blue-500/20"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Apply Leave</span>
        </button>
      </div>

      {/* 3-Column Dashboard Layout as requested:
          Column 1: on leave today & checkin and checkout
          Column 2: celebrating birthday, celebrating work anniversary, and holidays slider of 3 cards
          Column 3: working remotely & inbox having leave request */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start w-full">
        {/* Column 1: On Leave Today & Checkin and Checkout */}
        <div className="flex flex-col gap-6 w-full">
          <OnLeaveTodayWidget onApplyLeaveClick={() => setShowApplyLeaveModal(true)} />
          <CheckInsCard onAttendanceChange={loadData} />
        </div>

        {/* Column 2: Celebrating Birthday, Celebrating Work Anniversary, and Holidays Slider */}
        <div className="flex flex-col gap-6 w-full">
          <BirthdaysCard />
          <WorkAnniversariesCard />
          <HolidaysSliderCard />
        </div>

        {/* Column 3: Working Remotely & Inbox Having Leave Request */}
        <div className="flex flex-col gap-6 w-full">
          <WorkingRemotelyWidget />
          <InboxLeaveRequestsCard
            requests={leaveRequests}
            onApprove={handleApproveLeave}
            onReject={handleRejectLeave}
          />
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
