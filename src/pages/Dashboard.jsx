import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  UserCheck,
  UserMinus,
  Clock,
  Plus,
  Calendar,
  Sparkles,
  Inbox,
  Award,
  Cake,
  Laptop,
} from 'lucide-react';
import { StatsCard } from '../components/dashboard/StatsCard';
import { SketchInboxLeaveRequests } from '../components/dashboard/SketchInboxLeaveRequests';
import { SketchCheckIns } from '../components/dashboard/SketchCheckIns';
import { SketchOnLeaveToday } from '../components/dashboard/SketchOnLeaveToday';
import { SketchWorkingRemotely } from '../components/dashboard/SketchWorkingRemotely';
import { SketchBirthdays } from '../components/dashboard/SketchBirthdays';
import { SketchAnniversaries } from '../components/dashboard/SketchAnniversaries';
import { SketchNewJoinees } from '../components/dashboard/SketchNewJoinees';
import { SketchHolidays } from '../components/dashboard/SketchHolidays';
import { EmployeeChecklist } from '../components/dashboard/EmployeeChecklist';
import { Modal } from '../components/common/Modal';
import { employeeService } from '../services/employeeService';
import { dashboardStats, currentUser } from '../data/mockData';
import { useToast } from '../context/NotificationContext';

export const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [checklist, setChecklist] = useState([]);
  const [showApplyLeaveModal, setShowApplyLeaveModal] = useState(false);
  const { addToast } = useToast();

  // Apply leave form state
  const [leaveType, setLeaveType] = useState('Casual Leave');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [days, setDays] = useState(1);
  const [reason, setReason] = useState('');

  const loadData = () => {
    setLeaveRequests(employeeService.getLeaveRequests());
    setChecklist(employeeService.getChecklist());
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

  const handleToggleChecklist = (id) => {
    const updated = employeeService.toggleChecklistTask(id);
    setChecklist(updated);
  };

  const handleAddChecklistTask = (task) => {
    const updated = employeeService.addChecklistTask(task);
    setChecklist(updated);
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

  const pendingLeavesCount = leaveRequests.filter((r) => r.status === 'Pending').length;

  return (
    <div className="space-y-6 animate-fade-in pb-12 w-full">
      {/* Top Header / Tabs matching Handwritten Sketch: [Dashboard] / Candidate */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E5EAF2] pb-3">
        <div className="flex items-center gap-3">
          {/* [Dashboard] tab pill from sketch */}
          <button
            onClick={() => setActiveTab('Dashboard')}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs ${
              activeTab === 'Dashboard'
                ? 'bg-[#2563EB] text-white shadow-blue-500/20'
                : 'bg-white text-[#8292AD] border border-[#E5EAF2] hover:text-[#172033]'
            }`}
          >
            Dashboard
          </button>

          {/* Candidate button / link from sketch */}
          <button
            onClick={() => navigate('/candidates')}
            className="px-4 py-1.5 rounded-xl text-xs font-bold text-[#8292AD] bg-white border border-[#E5EAF2] hover:text-[#172033] hover:bg-[#F8FAFC] transition-colors"
          >
            Candidate
          </button>
        </div>

        <button
          onClick={() => setShowApplyLeaveModal(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white shadow-sm transition-all active:scale-95 shadow-blue-500/20 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Apply Leave</span>
        </button>
      </div>

      {/* Row 1: Key Statistics Cards from Reference Image 3 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Employees"
          value={dashboardStats.totalEmployees.value}
          subtext={dashboardStats.totalEmployees.description}
          badgeText={dashboardStats.totalEmployees.change}
          badgeType="success"
          icon={Users}
          iconBg="bg-blue-50 text-[#2563EB]"
        />

        <StatsCard
          title="Present Today"
          value={dashboardStats.presentToday.value}
          subtext={dashboardStats.presentToday.description}
          badgeText={dashboardStats.presentToday.change}
          badgeType="success"
          icon={UserCheck}
          iconBg="bg-emerald-50 text-emerald-600"
        />

        <StatsCard
          title="Employees on Leave"
          value={dashboardStats.onLeaveToday.value}
          subtext={dashboardStats.onLeaveToday.description}
          badgeText={dashboardStats.onLeaveToday.change}
          badgeType="default"
          icon={UserMinus}
          iconBg="bg-amber-50 text-amber-600"
        />

        <StatsCard
          title="Pending Leave Requests"
          value={pendingLeavesCount}
          subtext="Requires immediate manager approval"
          badgeText="Action Needed"
          badgeType="danger"
          icon={Clock}
          iconBg="bg-rose-50 text-rose-600"
        />
      </div>

      {/* Row 2: Handwritten Sketch Core Section 1: Inbox Leave Requests & CheckIns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 w-full">
        {/* 1. Inbox Leave Requests (from sketch: "Inbox leave requests") */}
        <SketchInboxLeaveRequests
          requests={leaveRequests}
          onApprove={handleApproveLeave}
          onReject={handleRejectLeave}
        />

        {/* 2. CheckIns (from sketch: "CheckIns") */}
        <SketchCheckIns onAttendanceChange={loadData} />
      </div>

      {/* Row 3: Handwritten Sketch Core Section 2: On leave Today, Working Remotely, Celebrating Birthdays */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 w-full">
        {/* 3. On Leave Today (from sketch: "On leave Today" [leave requests]) */}
        <SketchOnLeaveToday onApplyLeaveClick={() => setShowApplyLeaveModal(true)} />

        {/* 4. Working Remotely (from sketch: "working remotely") */}
        <SketchWorkingRemotely />

        {/* 5. Celebrating Birthdays (from sketch: "celebrating birthdays" with circle O, Name, Date) */}
        <SketchBirthdays />
      </div>

      {/* Row 4: Handwritten Sketch Core Section 3: Anniversaries, New Joinee, Holidays */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 w-full">
        {/* 6. Celebrating Work Anniversaries (from sketch: "celebrating work anniversaries" with O O O) */}
        <SketchAnniversaries />

        {/* 7. New Joinee (from sketch: "New Joinee") */}
        <SketchNewJoinees />

        {/* 8. Holidays (from sketch: "Holidays") */}
        <SketchHolidays />
      </div>

      {/* Row 5: Checklist / CheckIns Tasks (from sketch: CheckIns workflow) */}
      <div className="w-full">
        <EmployeeChecklist
          tasks={checklist}
          onToggleTask={handleToggleChecklist}
          onAddTask={handleAddChecklistTask}
        />
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
                <option value="Casual Leave">Casual Leave (Balance: 10 days)</option>
                <option value="Privilege Leave">Privilege Leave (Balance: 18 days)</option>
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
