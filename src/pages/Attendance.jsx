import React, { useState, useEffect } from 'react';
import {
  Clock,
  UserCheck,
  AlertTriangle,
  Calendar as CalendarIcon,
  Download,
  Check,
  X,
  Search,
  Skull,
} from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { StatsCard } from '../components/dashboard/StatsCard';
import { DataTable } from '../components/common/DataTable';
import { StatusBadge } from '../components/common/StatusBadge';
import { ActionDropdown } from '../components/common/ActionDropdown';
import { SearchBar } from '../components/common/SearchBar';
import { attendanceService } from '../services/attendanceService';
import { useToast } from '../context/NotificationContext';

export const Attendance = () => {
  const [records, setRecords] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'calendar'
  const { addToast } = useToast();

  const loadRecords = () => {
    setRecords(attendanceService.getRecords());
  };

  useEffect(() => {
    loadRecords();
  }, []);

  const handleExportCSV = () => {
    addToast({
      title: 'Attendance Report Exported',
      message: 'Monthly attendance log has been downloaded as CSV.',
      type: 'success',
    });
  };

  const handleVerifyShift = (row) => {
    addToast({
      title: 'Shift Verified',
      message: `${row.name}'s punch on ${row.date} confirmed.`,
      type: 'success',
    });
  };

  const handleFlagShift = (row) => {
    addToast({
      title: 'Shift Flagged',
      message: `${row.name}'s attendance record flagged for HR review.`,
      type: 'warning',
    });
  };

  const handleStatusChange = (id, newStatus) => {
    setRecords((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );
    addToast({
      title: 'Status Updated',
      message: `Shift status changed to "${newStatus}".`,
      type: 'info',
    });
  };

  const handleActionChange = (id, newAction) => {
    setRecords((prev) =>
      prev.map((r) => (r.id === id ? { ...r, action: newAction } : r))
    );
    const labelMap = {
      qualified: 'Verified Shift',
      dead: 'Flagged Discrepancy',
      'not-qualified': 'Marked Absent',
    };
    addToast({
      title: 'Action Recorded',
      message: `Shift marked as ${labelMap[newAction] || newAction}.`,
      type: newAction === 'qualified' ? 'success' : 'warning',
    });
  };

  const filteredRecords = records.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.employeeId.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'All' || r.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const presentCount = records.filter((r) => r.status === 'On Time').length;
  const lateCount = records.filter((r) => r.status === 'Late').length;
  const onLeaveCount = records.filter((r) => r.status === 'On Leave').length;

  const attendanceTabs = [
    { id: 'All', label: 'All Punches', count: records.length },
    {
      id: 'On Time',
      label: 'On Time',
      count: presentCount,
      icon: <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />,
    },
    {
      id: 'Late',
      label: 'Late Arrivals',
      count: lateCount,
      icon: <Clock className="w-3 h-3 text-rose-500" />,
      badgeColor: 'bg-rose-50 text-rose-600 border border-rose-200',
    },
    {
      id: 'On Leave',
      label: 'On Leave',
      count: onLeaveCount,
      icon: <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />,
    },
  ];

  const columns = [
    {
      header: 'EMPLOYEE',
      accessor: 'name',
      render: (row) => (
        <div className="flex items-center gap-2.5">
          <img
            src={row.avatar}
            alt={row.name}
            className="w-8 h-8 rounded-full object-cover ring-2 ring-[#E5EAF2]"
          />
          <div>
            <div className="font-bold text-[#172033] text-xs">{row.name}</div>
            <div className="text-[10px] text-[#8292AD] font-medium">{row.employeeId}</div>
          </div>
        </div>
      ),
    },
    {
      header: 'DEPARTMENT',
      accessor: 'department',
      render: (row) => (
        <span className="text-xs text-[#4E5D78] font-medium">{row.department}</span>
      ),
    },
    {
      header: 'DATE',
      accessor: 'date',
      render: (row) => {
        const isToday = (row.date || '').toLowerCase().includes('today') || (row.date || '').includes('09 Nov');
        return isToday ? (
          <span className="text-xs font-bold text-[#2563EB]">Today</span>
        ) : (
          <span className="text-xs font-medium text-slate-500">{row.date}</span>
        );
      },
    },
    {
      header: 'CHECK IN',
      accessor: 'checkIn',
      render: (row) => (
        <span className="text-xs font-bold text-[#172033] font-mono">
          {row.checkIn}
        </span>
      ),
    },
    {
      header: 'CHECK OUT',
      accessor: 'checkOut',
      render: (row) => (
        <span className="text-xs font-medium text-slate-500 font-mono">
          {row.checkOut}
        </span>
      ),
    },
    {
      header: 'WORK HOURS',
      accessor: 'workHours',
      render: (row) => (
        <span className="text-xs font-bold text-[#172033]">
          {row.workHours}
        </span>
      ),
    },
    {
      header: 'LOCATION',
      accessor: 'location',
      render: (row) => (
        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#4E5D78] bg-[#F7F9FC] px-2 py-0.5 rounded-full border border-[#E5EAF2]">
          {row.location}
        </span>
      ),
    },
    {
      header: 'OPTIONS',
      accessor: 'status',
      align: 'center',
      render: (row) => (
        <StatusBadge
          status={row.status}
          size="xs"
          showChevron={true}
          onStatusChange={(newStatus) => handleStatusChange(row.id, newStatus)}
        />
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <PageHeader
        title="Attendance Management"
        badgeText="Live Sync"
        subtitle="Track employee punches, shift hours, and leave compliance in real-time."
        breadcrumbs={[{ label: 'Home', link: '/' }, { label: 'Attendance' }]}
        actions={
          <div className="flex items-center gap-2">
            <div className="inline-flex rounded-xl p-1 bg-white border border-[#E5EAF2]">
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${viewMode === 'table'
                  ? 'bg-[#2563EB] text-white shadow-xs'
                  : 'text-[#8292AD] hover:text-[#172033]'
                  }`}
              >
                Table View
              </button>
              <button
                onClick={() => setViewMode('calendar')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${viewMode === 'calendar'
                  ? 'bg-[#2563EB] text-white shadow-xs'
                  : 'text-[#8292AD] hover:text-[#172033]'
                  }`}
              >
                Calendar View
              </button>
            </div>

            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl bg-white border border-[#E5EAF2] hover:bg-[#F7F9FC] text-[#172033] shadow-xs transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-[#8292AD]" />
              <span>Export CSV</span>
            </button>
          </div>
        }
      />

      {/* Row: Stats Cards matching Reference Image */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="TOTAL PRESENT"
          value={presentCount}
          subtext="On-time shift arrival"
          badgeText="92% Rate"
          badgeType="success"
          icon={UserCheck}
          iconBg="bg-blue-50 text-[#2563EB]"
        />
        <StatsCard
          title="LATE ARRIVALS"
          value={lateCount}
          subtext="After 9:00 AM cutoff"
          badgeText="ACTION NEEDED"
          badgeType="danger"
          icon={AlertTriangle}
          iconBg="bg-rose-50 text-rose-600"
        />
        <StatsCard
          title="ON LEAVE TODAY"
          value={onLeaveCount}
          subtext="Casual & Sick leaves"
          badgeText="Scheduled"
          badgeType="default"
          icon={Clock}
          iconBg="bg-amber-50 text-amber-600"
        />
        <StatsCard
          title="AVG WORK HOURS"
          value="8.4 hrs"
          subtext="⚡ top 5% compliance"
          badgeText="+0.2 hrs"
          badgeType="success"
          icon={CalendarIcon}
          iconBg="bg-emerald-50 text-emerald-600"
        />
      </div>

      {viewMode === 'table' ? (
        <DataTable
          columns={columns}
          data={filteredRecords}
          pageSize={6}
          tabs={attendanceTabs}
          activeTab={statusFilter}
          onTabChange={setStatusFilter}
          filterInfo={`Filtered: ${filteredRecords.length} Shown of ${records.length}`}
          entityName="records"
          searchBar={
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              onClear={() => setSearchQuery('')}
              placeholder="Search by name, dept, ID..."
            />
          }
          actions={(row) => (
            <ActionDropdown
              currentAction={
                row.action ||
                (row.status === 'On Time' || row.status === 'Present'
                  ? 'qualified'
                  : row.status === 'Late'
                  ? 'dead'
                  : 'not-qualified')
              }
              onActionChange={(newAction) =>
                handleActionChange(row.id, newAction)
              }
              actions={[
                {
                  id: 'qualified',
                  label: 'Qualified / Verified Shift',
                  icon: <Check className="w-4 h-4 text-[#059669] stroke-[2.5]" />,
                },
                {
                  id: 'dead',
                  label: 'Dead / Flag Issue',
                  icon: <Skull className="w-4 h-4 text-[#172033] stroke-[1.8]" />,
                },
                {
                  id: 'not-qualified',
                  label: 'Not Qualified / Absent',
                  icon: <X className="w-4 h-4 text-[#DC2626] stroke-[2]" />,
                },
              ]}
            />
          )}
          emptyMessage="No attendance records found"
          emptySubtext="Try selecting another filter or adjusting your search term."
        />
      ) : (
        /* Monthly Attendance Calendar View */
        <div className="bg-white border border-[#E5EAF2] rounded-2xl p-6 shadow-card">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#E5EAF2]">
            <div>
              <h3 className="text-base font-bold text-[#172033]">November 2026 Attendance Grid</h3>
              <p className="text-xs text-[#8292AD]">Overview of business days and attendance ratios</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Present (92%)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Late (5%)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Leave (3%)
              </span>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2 text-center text-xs">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
              <div key={day} className="py-2 font-bold text-[#8292AD] uppercase tracking-wider text-[11px]">
                {day}
              </div>
            ))}
            {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => {
              const isWeekend = day % 7 === 0 || day % 7 === 6;
              const isToday = day === 9;
              return (
                <div
                  key={day}
                  className={`p-2 rounded-xl border min-h-[64px] flex flex-col justify-between transition-colors ${
                    isToday
                      ? 'bg-blue-50/50 border-blue-400 font-bold'
                      : isWeekend
                      ? 'bg-[#F7F9FC] border-transparent text-[#8292AD]'
                      : 'bg-white border-[#E5EAF2] hover:border-blue-200'
                    }`}
                >
                  <span className={`text-xs ${isToday ? 'text-[#2563EB]' : 'text-[#172033]'}`}>
                    {day}
                  </span>
                  {!isWeekend && (
                    <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md">
                      98%
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
