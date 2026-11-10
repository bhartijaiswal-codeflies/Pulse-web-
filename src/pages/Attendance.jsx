import React, { useState, useEffect, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
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
  RotateCw,
  ChevronDown,
  ChevronUp,
  XCircle,
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

  // Punches Dropdown Popover
  const [showPunchDropdown, setShowPunchDropdown] = useState(false);
  const punchDropdownRef = useRef(null);

  // Close punch dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (punchDropdownRef.current && !punchDropdownRef.current.contains(e.target)) {
        setShowPunchDropdown(false);
      }
    };
    if (showPunchDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showPunchDropdown]);

  // Create Attendance Modal States (matching media_1794294290231_6c5fd112.png)
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createEmployee, setCreateEmployee] = useState('');
  const [createInTime, setCreateInTime] = useState('');
  const [createOutTime, setCreateOutTime] = useState('');
  const [createDates, setCreateDates] = useState(['']);
  const [createStatus, setCreateStatus] = useState('');
  const [createRemarks, setCreateRemarks] = useState('');

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && showCreateModal) {
        setShowCreateModal(false);
      }
    };
    if (showCreateModal) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [showCreateModal]);

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

  const handleApplyFilters = () => {
    addToast({
      title: 'Filters Applied',
      message: `Showing ${filteredRecords.length} of ${records.length} attendance records.`,
      type: 'info',
    });
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setPeriodFilter('all');
    setFromDate('');
    setToDate('');
    setDeptFilter('All');
    setStatusFilter('All');
    addToast({
      title: 'Filters Cleared',
      message: 'All filter criteria have been reset.',
      type: 'info',
    });
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
      header: 'STATUS',
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

  const punchStatusConfig = {
    All: {
      label: 'All Punches',
      count: records.length,
      icon: <UserCheck className="w-3.5 h-3.5 text-[#2563EB] stroke-[2.2]" />,
      pillClass: 'bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE] hover:bg-blue-100/70',
      badgeClass: 'bg-[#DBEAFE] text-[#1D4ED8]',
    },
    Present: {
      label: 'Present',
      count: presentCount,
      icon: <Check className="w-3.5 h-3.5 text-[#059669] stroke-[2.5]" />,
      pillClass: 'bg-[#ECFDF5] text-[#059669] border-[#A7F3D0] hover:bg-emerald-100/70',
      badgeClass: 'bg-[#D1FAE5] text-[#047857]',
    },
    Absent: {
      label: 'Absent',
      count: absentCount,
      icon: <XCircle className="w-3.5 h-3.5 text-[#DC2626] stroke-[2]" />,
      pillClass: 'bg-[#FEF2F2] text-[#DC2626] border-[#FECACA] hover:bg-rose-100/70',
      badgeClass: 'bg-[#FEE2E2] text-[#B91C1C]',
    },
    'First Half Leave': {
      label: 'First Half Leave',
      count: firstHalfCount,
      icon: <Clock className="w-3.5 h-3.5 text-[#D97706] stroke-[2.2]" />,
      pillClass: 'bg-[#FFFBEB] text-[#D97706] border-[#FDE68A] hover:bg-amber-100/70',
      badgeClass: 'bg-[#FEF3C7] text-[#B45309]',
    },
    'Second Half Leave': {
      label: 'Second Half Leave',
      count: secondHalfCount,
      icon: <Clock className="w-3.5 h-3.5 text-[#2563EB] stroke-[2.2]" />,
      pillClass: 'bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE] hover:bg-blue-100/70',
      badgeClass: 'bg-[#DBEAFE] text-[#1D4ED8]',
    },
    'Half Day Marked': {
      label: 'Half Day Marked',
      count: halfDayCount,
      icon: <AlertTriangle className="w-3.5 h-3.5 text-[#7C3AED] stroke-[2.2]" />,
      pillClass: 'bg-[#FAF5FF] text-[#7C3AED] border-[#E9D5FF] hover:bg-purple-100/70',
      badgeClass: 'bg-[#F3E8FF] text-[#6D28D9]',
    },
  };

  const currentPunchConfig = punchStatusConfig[statusFilter] || punchStatusConfig.All;

  const attendanceFilterBar = (
    <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3">
      {/* Left: All Filters in 1 Row */}
      <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-0">
        {/* 1. All Punches in 1 Styled Colored Dropdown (same rounded-xl shape) */}
        <div className="relative flex-shrink-0" ref={punchDropdownRef}>
          <button
            type="button"
            onClick={() => setShowPunchDropdown((prev) => !prev)}
            className={`inline-flex items-center gap-2 px-3.5 h-9 rounded-xl border text-xs font-bold transition-all shadow-2xs cursor-pointer select-none active:scale-95 ${currentPunchConfig.pillClass}`}
          >
            <span className="flex-shrink-0">{currentPunchConfig.icon}</span>
            <span>
              {currentPunchConfig.label} ({currentPunchConfig.count})
            </span>
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform duration-200 ${
                showPunchDropdown ? 'rotate-180' : ''
              }`}
            />
          </button>

          {/* Punch Options Popover */}
          {showPunchDropdown && (
            <div className="absolute left-0 top-full mt-2 z-50 bg-white rounded-2xl shadow-xl border border-[#E5EAF2] py-1.5 min-w-[220px] animate-fade-in text-left">
              <div className="px-3.5 py-1.5 text-[10px] font-bold text-[#8292AD] uppercase tracking-wider border-b border-[#F1F5F9] mb-1">
                Filter by Punch Status
              </div>
              {Object.entries(punchStatusConfig).map(([key, cfg]) => {
                const isSelected = statusFilter === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => {
                      setStatusFilter(key);
                      setShowPunchDropdown(false);
                    }}
                    className={`w-full px-3.5 py-2 text-xs flex items-center justify-between gap-3 transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-[#F8FAFC] font-bold'
                        : 'hover:bg-[#F8FAFC] font-medium text-[#4E5D78]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="flex-shrink-0">{cfg.icon}</span>
                      <span className={isSelected ? 'text-[#172033]' : ''}>
                        {cfg.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${cfg.badgeClass}`}
                      >
                        {cfg.count}
                      </span>
                      {isSelected && (
                        <Check className="w-3.5 h-3.5 text-[#2563EB] stroke-[2.5]" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* 2. Search Employee / ID (fixed text cutting issue) */}
        <div className="w-56 sm:w-64 min-w-[210px] flex-shrink-0">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onClear={() => setSearchQuery('')}
            placeholder="Search employee, ID..."
          />
        </div>

        {/* 3. Quick Period Dropdown (calendar removed from option All Dates) */}
        <div className="relative min-w-[150px] flex-shrink-0">
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
            className="w-full appearance-none pl-8 pr-8 h-9 text-xs font-semibold rounded-xl border border-[#E5EAF2] bg-white text-[#172033] hover:bg-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer shadow-2xs transition-colors"
          >
            <option value="all">All Dates</option>
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

        {/* 4. Custom Date Range Inputs (when 'custom' selected, same rounded-xl shape) */}
        {periodFilter === 'custom' && (
          <div className="flex items-center gap-2 animate-fade-in bg-[#F8FAFC] px-2.5 h-9 rounded-xl border border-[#E5EAF2] flex-shrink-0">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#64748B]">
              <span className="text-[11px] text-[#8292AD]">From:</span>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="px-2 py-1 h-7 text-xs rounded-lg border border-[#D1D5DB] bg-white text-[#172033] font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#64748B]">
              <span className="text-[11px] text-[#8292AD]">To:</span>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="px-2 py-1 h-7 text-xs rounded-lg border border-[#D1D5DB] bg-white text-[#172033] font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>
        )}

        {/* 5. Department Filter (same rounded-xl shape) */}
        <div className="relative min-w-[145px] flex-shrink-0">
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="w-full appearance-none pl-8 pr-8 h-9 text-xs font-semibold rounded-xl border border-[#E5EAF2] bg-white text-[#172033] hover:bg-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer shadow-2xs transition-colors"
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

      {/* Right: Clear with cross + Live Filter Counter + Refresh */}
      <div className="flex items-center gap-2 flex-shrink-0 ml-auto pt-1 xl:pt-0 border-t xl:border-t-0 border-[#F1F5F9]">
        {/* Clear Button with Cross - Very Small */}
        <button
          type="button"
          onClick={handleResetFilters}
          title="Clear all filters"
          className="inline-flex items-center gap-1 px-2.5 h-7 text-[11px] font-bold rounded-lg text-[#DC2626] bg-[#FEF2F2] hover:bg-rose-100 border border-[#FECACA] transition-all cursor-pointer shadow-2xs whitespace-nowrap active:scale-95"
        >
          <X className="w-3 h-3 stroke-[2.5]" />
          <span>Clear</span>
        </button>

        {/* Divider */}
        <div className="h-6 w-px bg-[#E5EAF2] hidden sm:block mx-0.5" />

        {/* Live Filter Counter + Refresh */}
        <div className="text-xs text-[#8292AD] font-medium flex items-center gap-1.5 whitespace-nowrap select-none">
          <span>
            Filtered: {filteredRecords.length} Shown of {records.length}
          </span>
          <button
            onClick={() => loadRecords()}
            title="Refresh Records"
            className="p-1 hover:bg-[#F8FAFC] rounded-lg transition-transform active:rotate-180 cursor-pointer"
          >
            <RotateCw className="w-3.5 h-3.5 text-[#8292AD] hover:text-[#2563EB] transition-colors" />
          </button>
        </div>
      </div>
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
          pageSize={10}
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
      {showCreateModal &&
        createPortal(
          <div
            className="fixed top-16 left-0 md:left-[76px] right-0 bottom-0 z-30 overflow-y-auto bg-slate-900/40 backdrop-blur-[2px] flex items-center justify-center p-4 sm:p-6 animate-fade-in"
            onClick={() => setShowCreateModal(false)}
          >
            <div
              className="bg-white rounded-2xl shadow-2xl border border-[#E5EAF2] max-w-lg w-full overflow-hidden animate-scale-in my-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-[#F1F5F9]">
                <h3 className="text-base font-bold text-[#172033]">
                  Create Attendance
                </h3>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-[#F8FAFC] transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
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
                      <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                        <svg className="w-3 h-3 fill-slate-400" viewBox="0 0 24 24">
                          <path d="M7 10l5 5 5-5z" />
                        </svg>
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
                          className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-[#D1D5DB] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-[#111827] cursor-pointer"
                        />
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
                          className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-[#D1D5DB] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-[#111827] cursor-pointer"
                        />
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
                                className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-[#D1D5DB] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-[#111827] cursor-pointer"
                              />
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
                        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                          <svg className="w-3 h-3 fill-slate-400" viewBox="0 0 24 24">
                            <path d="M7 10l5 5 5-5z" />
                          </svg>
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
          </div>,
          document.body
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
