import React, { useState, useEffect } from 'react';
import {
  Users,
  UserCheck,
  UserMinus,
  Clock,
  Plus,
  Send,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { StatsCard } from '../components/dashboard/StatsCard';
import { LeaveRequests } from '../components/dashboard/LeaveRequests';
import { EmployeeChecklist } from '../components/dashboard/EmployeeChecklist';
import { BirthdayWidget } from '../components/dashboard/BirthdayWidget';
import { AnniversaryWidget } from '../components/dashboard/AnniversaryWidget';
import { HolidayWidget } from '../components/dashboard/HolidayWidget';
import { QuickClockInWidget } from '../components/dashboard/QuickClockInWidget';
import { RecentActivities } from '../components/dashboard/RecentActivities';
import { Modal } from '../components/common/Modal';
import { employeeService } from '../services/employeeService';
import {
  dashboardStats,
  upcomingBirthdays,
  workAnniversaries,
  upcomingHolidays,
  currentUser,
} from '../data/mockData';
import { useToast } from '../context/NotificationContext';

export const Dashboard = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [checklist, setChecklist] = useState([]);
  const [activities, setActivities] = useState([]);
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
    setActivities(employeeService.getActivities());
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
      title: 'Leave Application Submitted',
      message: `Your ${leaveType} application for ${days} days has been queued for review.`,
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
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Page Header */}
      <PageHeader
        title="Dashboard"
        badgeText="Real-Time Sync"
        subtitle={`Welcome back, ${currentUser.name}! Here is your workforce summary for today.`}
        breadcrumbs={[{ label: 'Home', link: '/' }, { label: 'Dashboard' }]}
        actions={
          <button
            onClick={() => setShowApplyLeaveModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white shadow-sm transition-all shadow-blue-500/20 active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Apply For Leave</span>
          </button>
        }
      />

      {/* Row 1: Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
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

      {/* Row 2: Main Dashboard Widgets (Two Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols on desktop) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Leave Requests Inbox */}
          <LeaveRequests
            requests={leaveRequests}
            onApprove={handleApproveLeave}
            onReject={handleRejectLeave}
          />

          {/* Employee Checklist */}
          <EmployeeChecklist
            tasks={checklist}
            onToggleTask={handleToggleChecklist}
            onAddTask={handleAddChecklistTask}
          />

          {/* Recent Activities Feed */}
          <RecentActivities activities={activities} />
        </div>

        {/* Right Column (5 cols on desktop) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Web Clock-in / Working Remotely Widget */}
          <QuickClockInWidget onAttendanceChange={loadData} />

          {/* Upcoming Birthdays */}
          <BirthdayWidget birthdays={upcomingBirthdays} />

          {/* Work Anniversaries */}
          <AnniversaryWidget anniversaries={workAnniversaries} />

          {/* Upcoming Holidays */}
          <HolidayWidget holidays={upcomingHolidays} />
        </div>
      </div>

      {/* Apply Leave Modal */}
      {showApplyLeaveModal && (
        <Modal
          isOpen={showApplyLeaveModal}
          onClose={() => setShowApplyLeaveModal(false)}
          title="Submit Leave Request"
          subtitle="Submit formal leave notification to HR and supervisor"
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
                <option value="Casual Leave">Casual Leave (Balance: 12 days)</option>
                <option value="Sick Leave">Sick Leave (Balance: 8 days)</option>
                <option value="Privilege Leave">Privilege Leave (Balance: 18 days)</option>
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
                placeholder="Briefly state the reason for absence..."
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
                Submit Application
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
