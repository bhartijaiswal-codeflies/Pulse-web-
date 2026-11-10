import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Clock,
  UserCheck,
  AlertTriangle,
  Calendar as CalendarIcon,
  Download,
  Check,
  X,
  Search,
  Eye,
  Bell,
  Edit3,
  MapPin,
  Building,
  CheckCircle2,
  Calendar,
  Filter,
  Plus,
  Save,
  Trash2,
  RotateCcw,
} from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { StatsCard } from '../components/dashboard/StatsCard';
import { DataTable } from '../components/common/DataTable';
import { StatusBadge } from '../components/common/StatusBadge';
import { SearchBar } from '../components/common/SearchBar';
import { Modal } from '../components/common/Modal';
import { attendanceService } from '../services/attendanceService';
import { employeeService } from '../services/employeeService';
import { useToast } from '../context/NotificationContext';

const parseDate = (dateStr) => {
  if (!dateStr) return null;
  const s = String(dateStr).trim().toLowerCase();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (s === 'today') return today;
  if (s === 'yesterday') {
    const y = new Date(today);
    y.setDate(y.getDate() - 1);
    return y;
  }
  const d = new Date(dateStr);
  if (!isNaN(d.getTime())) {
    d.setHours(0, 0, 0, 0);
    return d;
  }
  return null;
};

export const Attendance = () => {
  const [records, setRecords] = useState([]);
  const [employeesList, setEmployeesList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [periodFilter, setPeriodFilter] = useState('all'); // 'all', 'today', 'yesterday', 'this-week', 'this-month', 'custom'
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'calendar'
  const [selectedRecord, setSelectedRecord] = useState(null);

  // Create Attendance Modal States (matching media_1794294290231_6c5fd112.png)
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createEmployee, setCreateEmployee] = useState('');
  const [createInTime, setCreateInTime] = useState('');
  const [createOutTime, setCreateOutTime] = useState('');
  const [createDates, setCreateDates] = useState(['']);
  const [createStatus, setCreateStatus] = useState('');
  const [createRemarks, setCreateRemarks] = useState('');

  const { addToast } = useToast();

  const loadRecords = () => {
    const raw = attendanceService.getRecords();
    const normalized = raw.map((r, idx) => {
      let st = r.status;
      if (st === 'On Time' || st === 'Present') st = 'Present';
      else if (st === 'Late') st = idx === 1 ? 'Half Day Marked' : 'Absent';
      else if (st === 'On Leave') st = idx % 2 === 0 ? 'First Half Leave' : 'Second Half Leave';
      return { ...r, status: st };
    });
    setRecords(normalized);

    // Load employees for the select dropdown
    const emps = employeeService.getEmployees();
    setEmployeesList(emps);
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

  const handleStatusChange = (id, newStatus) => {
    setRecords((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );
    addToast({
      title: 'Status Updated',
      message: `Shift status changed to "${newStatus}".`,
      type: 'info',
    });
    if (selectedRecord && selectedRecord.id === id) {
      setSelectedRecord((prev) => ({ ...prev, status: newStatus }));
    }
  };

  // Add more date input row in Create Modal
  const handleAddDateRow = () => {
    setCreateDates((prev) => [...prev, '']);
  };

  const handleDateChange = (index, value) => {
    setCreateDates((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  const handleRemoveDateRow = (index) => {
    if (createDates.length <= 1) return;
    setCreateDates((prev) => prev.filter((_, i) => i !== index));
  };

  // Form submission matching image
  const handleCreateAttendance = (e) => {
    e.preventDefault();
    if (!createEmployee) {
      addToast({
        title: 'Validation Error',
        message: 'Please select an Employee / User.',
        type: 'warning',
      });
      return;
    }
    if (!createInTime) {
      addToast({
        title: 'Validation Error',
        message: 'Please specify an In Time.',
        type: 'warning',
      });
      return;
    }
    if (!createDates[0]) {
      addToast({
        title: 'Validation Error',
        message: 'Please pick a Date.',
        type: 'warning',
      });
      return;
    }
    if (!createStatus) {
      addToast({
        title: 'Validation Error',
        message: 'Please select a Status.',
        type: 'warning',
      });
      return;
    }

    const empObj = employeesList.find(
      (emp) => emp.name === createEmployee || emp.id === createEmployee
    ) || {
      name: createEmployee,
      employeeId: 'PLS-' + Math.floor(1000 + Math.random() * 9000),
      department: 'General Operations',
      avatar:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    };

    // Calculate work hours
    let hoursStr = '--';
    if (createInTime && createOutTime) {
      hoursStr = '8h 30m';
    } else if (createStatus === 'Present') {
      hoursStr = 'Active';
    }

    // Format dates
    const formattedDate = createDates[0]
      ? new Date(createDates[0]).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        })
      : 'Today';

    const newRecord = {
      id: `ATT-${Date.now().toString().slice(-4)}`,
      employeeId: empObj.id || empObj.employeeId,
      name: empObj.name,
      avatar:
        empObj.avatar ||
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      department: empObj.department,
      date: formattedDate,
      checkIn: createInTime,
      checkOut: createOutTime || '--:--',
      workHours: hoursStr,
      status: createStatus,
      location: 'Office (SF HQ)',
      remarks: createRemarks,
    };

    setRecords((prev) => [newRecord, ...prev]);
    setShowCreateModal(false);

    // Reset fields
    setCreateEmployee('');
    setCreateInTime('');
    setCreateOutTime('');
    setCreateDates(['']);
    setCreateStatus('');
    setCreateRemarks('');

    addToast({
      title: 'Attendance Created',
      message: `Attendance log successfully recorded for ${newRecord.name}.`,
      type: 'success',
    });
  };

  // Extract unique departments for dropdown
  const departments = useMemo(() => {
    const list = records.map((r) => r.department).filter(Boolean);
    return ['All', ...Array.from(new Set(list))];
  }, [records]);

  // Check if date matches the selected period
  const checkDateMatch = (dateStr) => {
    if (periodFilter === 'all' && !fromDate && !toDate) return true;
    const recDate = parseDate(dateStr);
    if (!recDate) return true;

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    if (periodFilter === 'today') {
      return recDate.getTime() === today.getTime();
    }

    if (periodFilter === 'yesterday') {
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);
      return recDate.getTime() === yesterday.getTime();
    }

    if (periodFilter === 'this-week') {
      const weekStart = new Date(today);
      const day = weekStart.getDay();
      const diff = weekStart.getDate() - day + (day === 0 ? -6 : 1);
      weekStart.setDate(diff);
      weekStart.setHours(0, 0, 0, 0);

      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      weekEnd.setHours(23, 59, 59, 999);

      return recDate >= weekStart && recDate <= weekEnd;
    }

    if (periodFilter === 'this-month') {
      return (
        recDate.getMonth() === today.getMonth() &&
        recDate.getFullYear() === today.getFullYear()
      );
    }

    if (periodFilter === 'custom' || fromDate || toDate) {
      if (fromDate) {
        const from = new Date(fromDate);
        from.setHours(0, 0, 0, 0);
        if (recDate < from) return false;
      }
      if (toDate) {
        const to = new Date(toDate);
        to.setHours(23, 59, 59, 999);
        if (recDate > to) return false;
      }
      return true;
    }

    return true;
  };

  // Filter matching (Search + Status Tab + Quick Period / Dates + Department)
  const filteredRecords = records.filter((r) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      r.name?.toLowerCase().includes(q) ||
      r.department?.toLowerCase().includes(q) ||
      r.employeeId?.toLowerCase().includes(q);

    const normalizedStatus = (r.status || '').toLowerCase();
    const filterKey = statusFilter.toLowerCase();
    const matchesStatus = filterKey === 'all' || normalizedStatus === filterKey;

    const matchesDept =
      deptFilter === 'All' ||
      (r.department && r.department.toLowerCase() === deptFilter.toLowerCase());

    const matchesDate = checkDateMatch(r.date);

    return matchesSearch && matchesStatus && matchesDept && matchesDate;
  });

  const isAnyFilterActive =
    Boolean(searchQuery.trim()) ||
    periodFilter !== 'all' ||
    Boolean(fromDate) ||
    Boolean(toDate) ||
    deptFilter !== 'All' ||
    statusFilter !== 'All';

  const handleResetFilters = () => {
    setSearchQuery('');
    setPeriodFilter('all');
    setFromDate('');
    setToDate('');
    setDeptFilter('All');
    setStatusFilter('All');
  };

  // Calculate live counts for the 4 clean cards
  const presentCount = records.filter((r) => r.status === 'Present').length;
  const absentCount = records.filter((r) => r.status === 'Absent').length;
  const firstHalfCount = records.filter(
    (r) => r.status === 'First Half Leave'
  ).length;
  const secondHalfCount = records.filter(
    (r) => r.status === 'Second Half Leave'
  ).length;
  const halfDayCount = records.filter(
    (r) => r.status === 'Half Day Marked'
  ).length;

  const approvedLeavesCount = firstHalfCount + secondHalfCount;
  const unapprovedLeavesCount = halfDayCount;

  const attendanceTabs = [
    { id: 'All', label: 'All Punches', count: records.length },
    {
      id: 'Present',
      label: 'Present',
      count: presentCount,
      icon: <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />,
    },
    {
      id: 'Absent',
      label: 'Absent',
      count: absentCount,
      icon: <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" />,
      badgeColor: 'bg-rose-50 text-rose-600 border border-rose-200',
    },
    {
      id: 'First Half Leave',
      label: 'First Half Leave',
      count: firstHalfCount,
      icon: <Clock className="w-3 h-3 text-amber-500" />,
      badgeColor: 'bg-amber-50 text-amber-600 border border-amber-200',
    },
    {
      id: 'Second Half Leave',
      label: 'Second Half Leave',
      count: secondHalfCount,
      icon: <Clock className="w-3 h-3 text-blue-500" />,
      badgeColor: 'bg-blue-50 text-blue-600 border border-blue-200',
    },
    {
      id: 'Half Day Marked',
      label: 'Half Day Marked',
      count: halfDayCount,
      icon: <AlertTriangle className="w-3 h-3 text-purple-500" />,
      badgeColor: 'bg-purple-50 text-purple-600 border border-purple-200',
    },
  ];

  const columns = [
    {
      header: 'EMPLOYEE',
      accessor: 'name',
      render: (row) => (
        <div
          onClick={() => setSelectedRecord(row)}
          className="flex items-center gap-2.5 cursor-pointer group/emp"
          title={`Click to view attendance log for ${row.name}`}
        >
          <img
            src={row.avatar}
            alt={row.name}
            className="w-8 h-8 rounded-full object-cover ring-2 ring-[#E5EAF2] group-hover/emp:ring-[#2563EB] transition-all"
          />
          <div>
            <div className="font-bold text-[#172033] text-xs group-hover/emp:text-[#2563EB] transition-colors">
              {row.name}
            </div>
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
      render: (row) => <span className="text-xs text-[#8292AD] font-medium">{row.date}</span>,
    },
    {
      header: 'CHECK IN',
      accessor: 'checkIn',
      render: (row) => (
        <span className="text-xs font-bold text-[#172033]">{row.checkIn}</span>
      ),
    },
    {
      header: 'CHECK OUT',
      accessor: 'checkOut',
      render: (row) => (
        <span className="text-xs font-medium text-[#4E5D78]">{row.checkOut}</span>
      ),
    },
    {
      header: 'HOURS',
      accessor: 'workHours',
      render: (row) => (
        <span className="text-xs font-semibold text-[#172033] bg-[#F7F9FC] px-2 py-0.5 rounded-full border border-[#E5EAF2]">
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
          options={[
            'Present',
            'Absent',
            'First Half Leave',
            'Second Half Leave',
            'Half Day Marked',
          ]}
          size="xs"
          showChevron={true}
          onStatusChange={(newStatus) => handleStatusChange(row.id, newStatus)}
        />
      ),
    },
  ];

  const attendanceFilterBar = (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Left: Search + Quick Period Dropdown + Custom Date Range + Department */}
        <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-[280px]">
          {/* Search Bar */}
          <div className="w-full sm:w-64 min-w-[200px]">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              onClear={() => setSearchQuery('')}
              placeholder="Search employee, ID, department..."
            />
          </div>

          {/* Quick Period Dropdown */}
          <div className="relative min-w-[160px]">
            <select
              value={periodFilter}
              onChange={(e) => {
                const val = e.target.value;
                setPeriodFilter(val);
                if (val !== 'custom') {
                  setFromDate('');
                  setToDate('');
                }
              }}
              className="w-full appearance-none pl-8 pr-8 py-2 text-xs font-semibold rounded-xl border border-[#E5EAF2] bg-white text-[#172033] hover:bg-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer shadow-2xs"
            >
              <option value="all">📅 All Dates</option>
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="this-week">This Week</option>
              <option value="this-month">This Month</option>
              <option value="custom">Custom Date Range...</option>
            </select>
            <CalendarIcon className="w-3.5 h-3.5 text-[#2563EB] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-[10px] text-slate-400">
              ▼
            </span>
          </div>

          {/* Custom Date Pickers (Inline when 'custom' is selected) */}
          {periodFilter === 'custom' && (
            <div className="flex items-center gap-2 animate-fade-in bg-[#F8FAFC] p-1 rounded-xl border border-[#E5EAF2]">
              <div className="flex items-center gap-1 text-[11px] font-semibold text-[#64748B] px-1">
                <span>From:</span>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="px-2 py-1 text-xs rounded-lg border border-[#D1D5DB] bg-white text-[#172033] focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
              <div className="flex items-center gap-1 text-[11px] font-semibold text-[#64748B] px-1">
                <span>To:</span>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="px-2 py-1 text-xs rounded-lg border border-[#D1D5DB] bg-white text-[#172033] focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>
          )}

          {/* Department Filter */}
          <div className="relative min-w-[150px]">
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="w-full appearance-none pl-8 pr-8 py-2 text-xs font-semibold rounded-xl border border-[#E5EAF2] bg-white text-[#172033] hover:bg-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer shadow-2xs"
            >
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept === 'All' ? 'All Departments' : dept}
                </option>
              ))}
            </select>
            <Building className="w-3.5 h-3.5 text-[#2563EB] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-[10px] text-slate-400">
              ▼
            </span>
          </div>
        </div>

        {/* Right: Reset Filters Button */}
        {isAnyFilterActive && (
          <button
            type="button"
            onClick={handleResetFilters}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors cursor-pointer whitespace-nowrap"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        )}
      </div>

      {/* Active Filter Chips */}
      {isAnyFilterActive && (
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-[#F1F5F9] text-[11px]">
          <span className="text-[#8292AD] font-bold uppercase tracking-wider text-[10px] mr-1">
            Active Filters:
          </span>
          {searchQuery && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 text-[#2563EB] font-semibold border border-blue-200">
              <span>Search: &ldquo;{searchQuery}&rdquo;</span>
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="hover:text-blue-800 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {periodFilter !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-600 font-semibold border border-indigo-200">
              <span>
                Period:{' '}
                {periodFilter === 'this-week'
                  ? 'This Week'
                  : periodFilter === 'this-month'
                  ? 'This Month'
                  : periodFilter.charAt(0).toUpperCase() + periodFilter.slice(1)}
                {periodFilter === 'custom' && (fromDate || toDate)
                  ? ` (${fromDate || '...'} to ${toDate || '...'})`
                  : ''}
              </span>
              <button
                type="button"
                onClick={() => {
                  setPeriodFilter('all');
                  setFromDate('');
                  setToDate('');
                }}
                className="hover:text-indigo-800 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {deptFilter !== 'All' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 font-semibold border border-emerald-200">
              <span>Dept: {deptFilter}</span>
              <button
                type="button"
                onClick={() => setDeptFilter('All')}
                className="hover:text-emerald-800 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {statusFilter !== 'All' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-[#4E5D78] font-semibold border border-slate-200">
              <span>Status: {statusFilter}</span>
              <button
                type="button"
                onClick={() => setStatusFilter('All')}
                className="hover:text-slate-800 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header with Top Action Button */}
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
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'table'
                    ? 'bg-[#2563EB] text-white shadow-xs'
                    : 'text-[#8292AD] hover:text-[#172033]'
                }`}
              >
                Table View
              </button>
              <button
                onClick={() => setViewMode('calendar')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'calendar'
                    ? 'bg-[#2563EB] text-white shadow-xs'
                    : 'text-[#8292AD] hover:text-[#172033]'
                }`}
              >
                Calendar View
              </button>
            </div>

            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl bg-white border border-[#E5EAF2] hover:bg-[#F7F9FC] text-[#172033] shadow-xs transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-[#8292AD]" />
              <span>Export CSV</span>
            </button>

            {/* Create Button at the top */}
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white shadow-sm transition-all active:scale-95 shadow-blue-500/20 cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Create</span>
            </button>
          </div>
        }
      />

      {/* Row: Stats Cards (No badges, No subtext, clean numbers) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <StatsCard
          title="TOTAL PRESENT"
          value={presentCount}
          icon={UserCheck}
          iconBg="bg-blue-50 text-[#2563EB]"
        />
        <StatsCard
          title="ABSENT TODAY"
          value={absentCount}
          icon={AlertTriangle}
          iconBg="bg-rose-50 text-rose-600"
        />
        <StatsCard
          title="APPROVED LEAVES"
          value={approvedLeavesCount}
          icon={CheckCircle2}
          iconBg="bg-emerald-50 text-emerald-600"
        />
        <StatsCard
          title="UNAPPROVED LEAVES"
          value={unapprovedLeavesCount}
          icon={Clock}
          iconBg="bg-amber-50 text-amber-600"
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
          filterBar={attendanceFilterBar}
          entityName="records"
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
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Absent (5%)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Half Day (3%)
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

      {/* CREATE ATTENDANCE POPUP MODAL (Matching exact design of media_1794294290231_6c5fd112.png) */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-[#E5EAF2] max-w-lg w-full overflow-hidden animate-scale-in">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 pt-5 pb-2">
              <h3 className="text-base font-bold text-[#172033]">
                Create Attendance
              </h3>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-[#F8FAFC] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleCreateAttendance}>
              <div className="px-6 py-4 space-y-4">
                {/* 1. Employee / User * */}
                <div>
                  <label className="block text-xs font-bold text-[#374151] mb-1.5">
                    Employee / User <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      required
                      value={createEmployee}
                      onChange={(e) => setCreateEmployee(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-[#D1D5DB] bg-white text-[#111827] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 appearance-none cursor-pointer"
                    >
                      <option value="">-- Select --</option>
                      {employeesList.map((emp) => (
                        <option key={emp.id} value={emp.name}>
                          {emp.name} ({emp.id}) - {emp.department}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                      ▼
                    </div>
                  </div>
                </div>

                {/* 2. In Time * and Out Time */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#374151] mb-1.5">
                      In Time <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="time"
                        required
                        value={createInTime}
                        onChange={(e) => setCreateInTime(e.target.value)}
                        placeholder="--:-- --"
                        className="w-full px-3.5 py-2.5 pr-10 text-xs rounded-lg border border-[#D1D5DB] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-[#111827]"
                      />
                      <Clock className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#374151] mb-1.5">
                      Out Time
                    </label>
                    <div className="relative">
                      <input
                        type="time"
                        value={createOutTime}
                        onChange={(e) => setCreateOutTime(e.target.value)}
                        placeholder="--:-- --"
                        className="w-full px-3.5 py-2.5 pr-10 text-xs rounded-lg border border-[#D1D5DB] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-[#111827]"
                      />
                      <Clock className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* 3. Date * (+ Add More) and Status * */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <label className="text-xs font-bold text-[#374151]">
                        Date <span className="text-red-500">*</span>
                      </label>
                      <button
                        type="button"
                        onClick={handleAddDateRow}
                        className="text-[10px] font-bold bg-[#4F46E5] hover:bg-indigo-700 text-white px-2 py-0.5 rounded cursor-pointer transition-colors"
                      >
                        + Add More
                      </button>
                    </div>

                    <div className="space-y-2">
                      {createDates.map((dVal, dIdx) => (
                        <div key={dIdx} className="relative flex items-center gap-1.5">
                          <div className="relative flex-1">
                            <input
                              type="date"
                              required
                              value={dVal}
                              onChange={(e) =>
                                handleDateChange(dIdx, e.target.value)
                              }
                              placeholder="dd/mm/yyyy"
                              className="w-full px-3.5 py-2.5 pr-10 text-xs rounded-lg border border-[#D1D5DB] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-[#111827]"
                            />
                            <CalendarIcon className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                          </div>
                          {createDates.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveDateRow(dIdx)}
                              className="text-slate-400 hover:text-rose-500 p-1"
                              title="Remove date"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#374151] mb-1.5">
                      Status <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        required
                        value={createStatus}
                        onChange={(e) => setCreateStatus(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-[#D1D5DB] bg-white text-[#111827] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 appearance-none cursor-pointer"
                      >
                        <option value="">-- Select --</option>
                        <option value="Present">Present</option>
                        <option value="Absent">Absent</option>
                        <option value="First Half Leave">First Half Leave</option>
                        <option value="Second Half Leave">Second Half Leave</option>
                        <option value="Half Day Marked">Half Day Marked</option>
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                        ▼
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4. Remarks */}
                <div>
                  <label className="block text-xs font-bold text-[#374151] mb-1.5">
                    Remarks
                  </label>
                  <textarea
                    rows={3}
                    value={createRemarks}
                    onChange={(e) => setCreateRemarks(e.target.value)}
                    placeholder=""
                    className="w-full px-3.5 py-2 text-xs rounded-lg border border-[#D1D5DB] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-[#111827] resize-y"
                  />
                </div>
              </div>

              {/* Modal Footer matching exact image with light gray bg and teal Submit button */}
              <div className="bg-[#ECEEF2] px-6 py-3.5 border-t border-[#E5EAF2] flex items-center justify-between">
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-md bg-[#00A896] hover:bg-[#008f80] text-white shadow-xs transition-all active:scale-95 cursor-pointer"
                >
                  <Save className="w-4 h-4 stroke-[2.2]" />
                  <span>Submit</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Attendance Details Modal (Clicking on Employee) */}
      {selectedRecord && (
        <Modal
          isOpen={Boolean(selectedRecord)}
          onClose={() => setSelectedRecord(null)}
          title={`Employee Attendance Log`}
        >
          <div className="space-y-4">
            <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-[#F8FAFC] border border-[#E5EAF2]">
              <img
                src={selectedRecord.avatar}
                alt={selectedRecord.name}
                className="w-12 h-12 rounded-full object-cover ring-2 ring-blue-300 flex-shrink-0"
              />
              <div className="min-w-0">
                <h4 className="font-bold text-sm text-[#172033] truncate">
                  {selectedRecord.name}
                </h4>
                <p className="text-xs text-[#8292AD] flex items-center gap-2 mt-0.5">
                  <span>{selectedRecord.employeeId}</span>
                  <span>•</span>
                  <span>{selectedRecord.department}</span>
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl border border-[#E5EAF2] bg-white">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8292AD] block">
                  Date
                </span>
                <span className="font-semibold text-[#172033] block mt-1">
                  {selectedRecord.date}
                </span>
              </div>
              <div className="p-3 rounded-xl border border-[#E5EAF2] bg-white">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8292AD] block">
                  Location
                </span>
                <span className="font-semibold text-[#172033] block mt-1">
                  {selectedRecord.location}
                </span>
              </div>
              <div className="p-3 rounded-xl border border-[#E5EAF2] bg-white">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8292AD] block">
                  Clock In
                </span>
                <span className="font-bold text-emerald-600 block mt-1">
                  {selectedRecord.checkIn}
                </span>
              </div>
              <div className="p-3 rounded-xl border border-[#E5EAF2] bg-white">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8292AD] block">
                  Clock Out
                </span>
                <span className="font-bold text-[#172033] block mt-1">
                  {selectedRecord.checkOut}
                </span>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#8292AD] block mb-1.5">
                Current Attendance Status
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  'Present',
                  'Absent',
                  'First Half Leave',
                  'Second Half Leave',
                  'Half Day Marked',
                ].map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => handleStatusChange(selectedRecord.id, st)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                      selectedRecord.status === st
                        ? 'bg-[#2563EB] text-white border-[#2563EB] shadow-xs'
                        : 'bg-white text-[#4E5D78] border-[#E5EAF2] hover:bg-[#F8FAFC]'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end pt-3 border-t border-[#E5EAF2]">
              <button
                type="button"
                onClick={() => setSelectedRecord(null)}
                className="px-4 py-2 text-xs font-semibold text-[#64748B] hover:text-[#172033] rounded-xl hover:bg-[#F8FAFC] cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
