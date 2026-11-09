import React, { useState, useEffect } from 'react';
import {
  Users,
  UserCheck,
  UserMinus,
  Clock,
  Plus,
  Calendar,
  Sparkles,
  Bell,
} from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { StatsCard } from '../components/dashboard/StatsCard';
import { InboxCard } from '../components/dashboard/InboxCard';
import { HolidayBannerCard } from '../components/dashboard/HolidayBannerCard';
import { OnLeaveTodayCard } from '../components/dashboard/OnLeaveTodayCard';
import { WorkingRemotelyCard } from '../components/dashboard/WorkingRemotelyCard';
import { TimeTodayCard } from '../components/dashboard/TimeTodayCard';
import { LeaveBalancesCard } from '../components/dashboard/LeaveBalancesCard';
import { CelebrationCards } from '../components/dashboard/CelebrationCards';
import { EmployeeChecklist } from '../components/dashboard/EmployeeChecklist';
import { RecentActivities } from '../components/dashboard/RecentActivities';
import { Modal } from '../components/common/Modal';
import { employeeService } from '../services/employeeService';
import {
  dashboardStats,
  currentUser,
} from '../data/mockData';
import { useToast } from '../context/NotificationContext';

export const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('DASHBOARD');
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [checklist, setChecklist] = useState([]);
  const [activities, setActivities] = useState([]);
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
      {/* Sub-header Tab Bar matching Reference Image 4 ("DASHBOARD" | "KEKA UPDATES") */}
      <div className="flex items-center justify-between border-b border-[#E5EAF2] pb-1 -mt-2">
        <div className="flex items-center gap-6">
          <button
            onClick={() => setActiveTab('DASHBOARD')}
            className={`text-xs font-extrabold uppercase tracking-wider pb-3 transition-colors relative ${
              activeTab === 'DASHBOARD'
                ? 'text-[#2563EB]'
                : 'text-[#8292AD] hover:text-[#172033]'
            }`}
          >
            <span>DASHBOARD</span>
            {activeTab === 'DASHBOARD' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2563EB] rounded-full" />
            )}
          </button>

          <button
            onClick={() => {
              setActiveTab('UPDATES');
              addToast({
                title: 'System Updates',
                message: 'All HR systems and payroll sync services are operating normally.',
                type: 'info',
              });
            }}
            className={`text-xs font-extrabold uppercase tracking-wider pb-3 transition-colors relative flex items-center gap-1.5 ${
              activeTab === 'UPDATES'
                ? 'text-[#2563EB]'
                : 'text-[#8292AD] hover:text-[#172033]'
            }`}
          >
            <span>PULSE UPDATES</span>
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            {activeTab === 'UPDATES' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2563EB] rounded-full" />
            )}
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

      {/* Row 1: Top Statistics Cards from Reference Image 3 */}
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

      {/* Row 2: Main Dashboard Grid Layout matching Reference Image 4 & Reference Image 1 Wireframe */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 w-full">
        {/* Left / Center Grid Region (7 Cols on large displays) */}
        <div className="lg:col-span-7 space-y-5">
          {/* 2-Column Card Grid (Inbox, Holidays, On Leave, Working Remotely, Time Today, Leave Balances) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* 1. Inbox Card */}
            <InboxCard
              requests={leaveRequests}
              onApprove={handleApproveLeave}
              onReject={handleRejectLeave}
            />

            {/* 2. Holidays Green Banner Card */}
            <HolidayBannerCard />

            {/* 3. On Leave Today Card */}
            <OnLeaveTodayCard />

            {/* 4. Working Remotely Card */}
            <WorkingRemotelyCard />

            {/* 5. Time Today Purple Live Clock Card */}
            <TimeTodayCard onAttendanceChange={loadData} />

            {/* 6. Leave Balances Card */}
            <LeaveBalancesCard onApplyLeaveClick={() => setShowApplyLeaveModal(true)} />
          </div>

          {/* 7. Employee Checklist / CheckIns (from Reference Image 1 Wireframe) */}
          <EmployeeChecklist
            tasks={checklist}
            onToggleTask={handleToggleChecklist}
            onAddTask={handleAddChecklistTask}
          />
        </div>

        {/* Right Region: Wide Cards Stack (5 Cols on large displays) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Celebration Cards: Birthdays, Work Anniversaries, New Joinees (Reference Image 4) */}
          <CelebrationCards />

          {/* Recent Activities Stream */}
          <RecentActivities activities={activities} />
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
