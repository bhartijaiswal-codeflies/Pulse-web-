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
    const list = filteredRecords.length > 0 ? filteredRecords : records;
    if (list.length === 0) {
      addToast({
        title: 'Export Failed',
        message: 'No records available to export.',
        type: 'warning',
      });
      return;
    }

    const headers = [
      'Record ID',
      'Employee ID',
      'Employee Name',
      'Department',
      'Date',
      'Check In',
      'Check Out',
      'Work Hours',
      'Location',
      'Status',
      'Remarks',
    ];

    const rows = list.map((r) => [
      r.id || '',
      r.employeeId || '',
      `"${(r.name || '').replace(/"/g, '""')}"`,
      `"${(r.department || '').replace(/"/g, '""')}"`,
      r.date || '',
      r.checkIn || '',
      r.checkOut || '',
      r.workHours || '',
      `"${(r.location || '').replace(/"/g, '""')}"`,
      r.status || '',
      `"${(r.remarks || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `attendance_report_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast({
      title: 'Attendance Report Exported',
      message: `${list.length} records successfully downloaded as CSV.`,
      type: 'success',
    });
  };

  const handleStatusChange = (id, newStatus) => {
    attendanceService.updateRecord(id, { status: newStatus });
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

  // Edit Attendance Record Modal States
  const [editingRecord, setEditingRecord] = useState(null);
  const [editInTime, setEditInTime] = useState('');
  const [editOutTime, setEditOutTime] = useState('');
  const [editDate, setEditDate] = useState('');
  const [editStatus, setEditStatus] = useState('Present');
  const [editLocation, setEditLocation] = useState('Office (SF HQ)');
  const [editRemarks, setEditRemarks] = useState('');

  // Delete Attendance Record State
  const [recordToDelete, setRecordToDelete] = useState(null);

  const handleOpenEdit = (record) => {
    setEditingRecord(record);
    setEditInTime(record.checkIn && record.checkIn !== '--:--' ? record.checkIn : '09:00 AM');
    setEditOutTime(record.checkOut && record.checkOut !== '--:--' ? record.checkOut : '06:00 PM');
    setEditDate(record.date || 'Today');
    setEditStatus(record.status || 'Present');
    setEditLocation(record.location || 'Office (SF HQ)');
    setEditRemarks(record.remarks || '');
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editingRecord) return;

    let workHours = editingRecord.workHours;
    if (editStatus === 'Absent') {
      workHours = '0h 00m';
    } else if (editStatus.includes('Half')) {
      workHours = '4h 00m';
    } else if (editInTime && editOutTime && editOutTime !== '--:--') {
      workHours = '8h 30m';
    }

    const updates = {
      checkIn: editInTime,
      checkOut: editOutTime,
      date: editDate,
      status: editStatus,
      location: editLocation,
      remarks: editRemarks,
      workHours,
    };

    attendanceService.updateRecord(editingRecord.id, updates);
    setRecords((prev) =>
      prev.map((r) => (r.id === editingRecord.id ? { ...r, ...updates } : r))
    );

    if (selectedRecord && selectedRecord.id === editingRecord.id) {
      setSelectedRecord((prev) => ({ ...prev, ...updates }));
    }

    setEditingRecord(null);
    addToast({
      title: 'Attendance Updated',
      message: `Record for ${editingRecord.name} has been successfully updated.`,
      type: 'success',
    });
  };

  const handleConfirmDelete = () => {
    if (!recordToDelete) return;
    const name = recordToDelete.name;
    const id = recordToDelete.id;

    attendanceService.deleteRecord(id);
    setRecords((prev) => prev.filter((r) => r.id !== id));

    if (selectedRecord && selectedRecord.id === id) {
      setSelectedRecord(null);
    }
    setRecordToDelete(null);

    addToast({
      title: 'Attendance Record Deleted',
      message: `Record for ${name} has been removed.`,
      type: 'info',
    });
  };

  const handleCalendarDayClick = (day) => {
    setViewMode('table');
    addToast({
      title: `November ${day}, 2026 Selected`,
      message: `Switched to Table View for day ${day} inspection.`,
      type: 'info',
    });
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

    attendanceService.addRecord(newRecord);
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
      className: 'w-[125px] min-w-[120px] max-w-[130px] sm:w-auto sm:min-w-[180px] sm:max-w-none',
      render: (row) => (
        <div
          onClick={() => setSelectedRecord(row)}
          className="flex items-center gap-2 sm:gap-2.5 cursor-pointer group/emp min-w-0"
          title={`Click to view attendance log for ${row.name}`}
        >
          <img
            src={row.avatar}
            alt={row.name}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover ring-2 ring-[#E5EAF2] group-hover/emp:ring-[#2563EB] transition-all flex-shrink-0"
          />
          <div className="min-w-0">
            <div className="font-bold text-[#172033] text-xs group-hover/emp:text-[#2563EB] transition-colors truncate">
              {row.name}
            </div>
            <div className="text-[10px] text-[#8292AD] font-medium truncate">{row.employeeId}</div>
          </div>
        </div>
      ),
    },
    {
      header: 'DEPARTMENT',
      accessor: 'department',
      className: 'min-w-[120px] whitespace-nowrap',
      render: (row) => (
        <span className="text-xs text-[#4E5D78] font-medium whitespace-nowrap">{row.department}</span>
      ),
    },
    {
      header: 'DATE',
      accessor: 'date',
      className: 'min-w-[100px] whitespace-nowrap',
      render: (row) => <span className="text-xs text-[#8292AD] font-medium whitespace-nowrap">{row.date}</span>,
    },
    {
      header: 'CHECK IN',
      accessor: 'checkIn',
      className: 'min-w-[95px] whitespace-nowrap',
      render: (row) => (
        <span className="text-xs font-bold text-[#172033] whitespace-nowrap">{row.checkIn}</span>
      ),
    },
    {
      header: 'CHECK OUT',
      accessor: 'checkOut',
      className: 'min-w-[95px] whitespace-nowrap',
      render: (row) => (
        <span className="text-xs font-medium text-[#4E5D78] whitespace-nowrap">{row.checkOut}</span>
      ),
    },
    {
      header: 'HOURS',
      accessor: 'workHours',
      className: 'min-w-[90px] whitespace-nowrap',
      render: (row) => (
        <span className="text-xs font-semibold text-[#172033] bg-[#F7F9FC] px-2 py-0.5 rounded-full border border-[#E5EAF2] whitespace-nowrap inline-block">
          {row.workHours}
        </span>
      ),
    },
    {
      header: 'LOCATION',
      accessor: 'location',
      className: 'min-w-[115px] whitespace-nowrap',
      render: (row) => (
        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#4E5D78] bg-[#F7F9FC] px-2 py-0.5 rounded-full border border-[#E5EAF2] whitespace-nowrap">
          {row.location}
        </span>
      ),
    },
    {
      header: 'STATUS',
      accessor: 'status',
      align: 'center',
      className: 'min-w-[135px] whitespace-nowrap',
      render: (row) => (
        <div className="whitespace-nowrap">
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
        </div>
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
        <div className="relative w-full sm:w-auto flex-shrink-0" ref={punchDropdownRef}>
          <button
            type="button"
            onClick={() => setShowPunchDropdown((prev) => !prev)}
            className={`w-full sm:w-auto inline-flex items-center justify-between sm:justify-start gap-2 px-3.5 h-9 rounded-xl border text-xs font-bold transition-all shadow-2xs cursor-pointer select-none active:scale-95 whitespace-nowrap ${currentPunchConfig.pillClass}`}
          >
            <span className="flex items-center gap-2">
              <span className="flex-shrink-0">{currentPunchConfig.icon}</span>
              <span>
                {currentPunchConfig.label} ({currentPunchConfig.count})
              </span>
            </span>
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform duration-200 ${
                showPunchDropdown ? 'rotate-180' : ''
              }`}
            />
          </button>

          {/* Punch Options Popover */}
          {showPunchDropdown && (
            <div className="absolute left-0 top-full mt-2 z-50 bg-white rounded-2xl shadow-xl border border-[#E5EAF2] py-1.5 min-w-[220px] max-w-[90vw] animate-fade-in text-left">
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

        {/* 2. Search Employee / ID (Full width on mobile, 240px on desktop) */}
        <div className="w-full sm:w-64 min-w-0 sm:min-w-[210px] flex-shrink-0 sm:flex-initial">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onClear={() => setSearchQuery('')}
            placeholder="Search employee, ID..."
          />
        </div>

        {/* 3 & 4. Dropdowns Row: 50/50 paired on mobile, inline on desktop */}
        <div className="flex items-center gap-2 w-full sm:w-auto flex-1 min-w-0">
          {/* Quick Period Dropdown */}
          <div className="relative flex-1 sm:flex-initial sm:w-auto min-w-0 sm:min-w-[145px]">
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
              className="w-full appearance-none pl-7 sm:pl-8 pr-7 sm:pr-8 h-9 text-xs font-semibold rounded-xl border border-[#E5EAF2] bg-white text-[#172033] hover:bg-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer shadow-2xs transition-colors"
            >
              <option value="all">All Dates</option>
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="this-week">This Week</option>
              <option value="this-month">This Month</option>
              <option value="custom">Custom Date Range...</option>
            </select>
            <CalendarIcon className="w-3.5 h-3.5 text-[#2563EB] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <ChevronDown className="w-3.5 h-3.5 text-[#8292AD] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Department Filter */}
          <div className="relative flex-1 sm:flex-initial sm:w-auto min-w-0 sm:min-w-[150px]">
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="w-full appearance-none pl-7 sm:pl-8 pr-7 sm:pr-8 h-9 text-xs font-semibold rounded-xl border border-[#E5EAF2] bg-white text-[#172033] hover:bg-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer shadow-2xs transition-colors"
            >
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept === 'All' ? 'All Departments' : dept}
                </option>
              ))}
            </select>
            <Building className="w-3.5 h-3.5 text-[#2563EB] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <ChevronDown className="w-3.5 h-3.5 text-[#8292AD] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* 5. Custom Date Range Inputs (when 'custom' selected) */}
        {periodFilter === 'custom' && (
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 animate-fade-in bg-[#F8FAFC] p-2 sm:px-2.5 sm:h-9 rounded-xl border border-[#E5EAF2] w-full sm:w-auto">
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
      </div>

      {/* Right: Clear with cross + Live Filter Counter + Refresh */}
      <div className="flex items-center justify-between sm:justify-end gap-2 flex-wrap sm:flex-nowrap w-full xl:w-auto pt-2 xl:pt-0 border-t xl:border-t-0 border-[#F1F5F9]">
        {/* Clear Button with Cross */}
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
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full sm:w-auto">
            {/* View Mode Segmented Control: full width on mobile, inline on sm+ */}
            <div className="inline-flex items-center h-10 sm:h-9 rounded-xl p-1 bg-white border border-[#E5EAF2] w-full sm:w-auto shadow-2xs">
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`h-8 sm:h-7 px-3.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center justify-center flex-1 sm:flex-initial whitespace-nowrap ${
                  viewMode === 'table'
                    ? 'bg-[#2563EB] text-white shadow-xs font-bold'
                    : 'text-[#8292AD] hover:text-[#172033]'
                }`}
              >
                Table View
              </button>
              <button
                type="button"
                onClick={() => setViewMode('calendar')}
                className={`h-8 sm:h-7 px-3.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center justify-center flex-1 sm:flex-initial whitespace-nowrap ${
                  viewMode === 'calendar'
                    ? 'bg-[#2563EB] text-white shadow-xs font-bold'
                    : 'text-[#8292AD] hover:text-[#172033]'
                }`}
              >
                Calendar View
              </button>
            </div>

            {/* Export & Create Action Buttons: 50% each on mobile, auto on sm+ */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleExportCSV}
                className="inline-flex items-center justify-center gap-2 px-3.5 h-10 sm:h-9 text-xs font-semibold rounded-xl bg-white border border-[#E5EAF2] hover:bg-[#F7F9FC] text-[#172033] shadow-xs transition-colors cursor-pointer flex-1 sm:flex-initial whitespace-nowrap active:scale-95"
              >
                <Download className="w-3.5 h-3.5 text-[#8292AD] flex-shrink-0" />
                <span>Export CSV</span>
              </button>

              {/* Create Button at the top */}
              <button
                type="button"
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center justify-center gap-1.5 px-4 h-10 sm:h-9 text-xs font-bold rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white shadow-sm transition-all active:scale-95 shadow-blue-500/20 cursor-pointer flex-1 sm:flex-initial whitespace-nowrap"
              >
                <Plus className="w-4 h-4 stroke-[2.5] flex-shrink-0" />
                <span>Create</span>
              </button>
            </div>
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
          actions={(row) => (
            <div className="inline-flex items-center justify-end gap-1.5">
              {/* View Button */}
              <button
                type="button"
                onClick={() => setSelectedRecord(row)}
                title={`View attendance details for ${row.name}`}
                className="w-7 h-7 rounded-full bg-blue-50 text-[#2563EB] border border-blue-200 hover:bg-blue-100 hover:scale-105 flex items-center justify-center transition-all shadow-2xs cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
              </button>

              {/* Edit Button */}
              <button
                type="button"
                onClick={() => handleOpenEdit(row)}
                title={`Edit attendance log for ${row.name}`}
                className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-100 hover:scale-105 flex items-center justify-center transition-all shadow-2xs cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>

              {/* Delete Button */}
              <button
                type="button"
                onClick={() => setRecordToDelete(row)}
                title={`Delete attendance record for ${row.name}`}
                className="w-7 h-7 rounded-full bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100 hover:scale-105 flex items-center justify-center transition-all shadow-2xs cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        />
      ) : (
        /* Monthly Attendance Calendar View */
        <div className="bg-white border border-[#E5EAF2] rounded-2xl p-4 sm:p-6 shadow-card overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-[#E5EAF2]">
            <div>
              <h3 className="text-base font-bold text-[#172033]">November 2026 Attendance Grid</h3>
              <p className="text-xs text-[#8292AD]">Overview of business days and attendance ratios</p>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 text-xs flex-wrap">
              <span className="flex items-center gap-1.5 whitespace-nowrap">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Present (92%)
              </span>
              <span className="flex items-center gap-1.5 whitespace-nowrap">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Absent (5%)
              </span>
              <span className="flex items-center gap-1.5 whitespace-nowrap">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Half Day (3%)
              </span>
            </div>
          </div>

          <div className="overflow-x-auto pb-2">
            <div className="min-w-[560px]">
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
                    <button
                      key={day}
                      type="button"
                      onClick={() => handleCalendarDayClick(day)}
                      title={`Click to view attendance records for Nov ${day}`}
                      className={`p-2 rounded-xl border min-h-[64px] flex flex-col justify-between transition-all cursor-pointer text-left active:scale-95 ${
                        isToday
                          ? 'bg-blue-50/50 border-blue-400 font-bold shadow-2xs hover:bg-blue-100/60'
                          : isWeekend
                          ? 'bg-[#F7F9FC] border-transparent text-[#8292AD] hover:bg-slate-100'
                          : 'bg-white border-[#E5EAF2] hover:border-blue-300 hover:shadow-xs'
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
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CREATE ATTENDANCE POPUP MODAL (Matching exact design of media_1794294290231_6c5fd112.png) */}
      {showCreateModal &&
        createPortal(
          <div
            className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-[2px] flex items-center justify-center p-3 sm:p-6 animate-fade-in"
            onClick={() => setShowCreateModal(false)}
          >
            <div
              className="bg-white rounded-2xl shadow-2xl border border-[#E5EAF2] max-w-lg w-full overflow-hidden animate-scale-in my-auto max-h-[92vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-4 sm:px-6 pt-5 pb-3 border-b border-[#F1F5F9]">
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
              <form onSubmit={handleCreateAttendance} className="flex flex-col overflow-hidden flex-1">
                <div className="px-4 sm:px-6 py-4 space-y-4 overflow-y-auto flex-1">
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
                      <ChevronDown className="w-3.5 h-3.5 text-[#8292AD] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
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
                        <ChevronDown className="w-3.5 h-3.5 text-[#8292AD] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
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
                <div className="bg-[#ECEEF2] px-4 sm:px-6 py-3.5 border-t border-[#E5EAF2] flex items-center justify-between">
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

            <div className="flex items-center justify-between pt-3 border-t border-[#E5EAF2] flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    handleOpenEdit(selectedRecord);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-colors cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Record</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setRecordToDelete(selectedRecord);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
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

      {/* EDIT ATTENDANCE MODAL */}
      {editingRecord &&
        createPortal(
          <div
            className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-[2px] flex items-center justify-center p-3 sm:p-6 animate-fade-in"
            onClick={() => setEditingRecord(null)}
          >
            <div
              className="bg-white rounded-2xl shadow-2xl border border-[#E5EAF2] max-w-lg w-full overflow-hidden animate-scale-in my-auto max-h-[92vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-4 sm:px-6 pt-5 pb-3 border-b border-[#F1F5F9]">
                <div>
                  <h3 className="text-base font-bold text-[#172033]">
                    Edit Attendance Record
                  </h3>
                  <p className="text-xs text-[#8292AD] mt-0.5">
                    Update clock-in, clock-out times, and attendance status
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setEditingRecord(null)}
                  className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-[#F8FAFC] transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Body Form */}
              <form onSubmit={handleSaveEdit} className="flex flex-col overflow-hidden flex-1">
                <div className="px-4 sm:px-6 py-4 space-y-4 overflow-y-auto flex-1">
                  {/* Employee Info Header Pill */}
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-[#F8FAFC] border border-[#E5EAF2]">
                    <img
                      src={editingRecord.avatar}
                      alt={editingRecord.name}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-300 flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="font-bold text-xs text-[#172033] truncate">
                        {editingRecord.name}
                      </p>
                      <p className="text-[10.5px] text-[#8292AD] truncate mt-0.5">
                        {editingRecord.employeeId} • {editingRecord.department}
                      </p>
                    </div>
                  </div>

                  {/* Date & Location */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#374151] mb-1.5">
                        Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={editDate}
                        onChange={(e) => setEditDate(e.target.value)}
                        placeholder="e.g. 15 Nov, 2026 or Today"
                        className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-[#D1D5DB] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-[#111827]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#374151] mb-1.5">
                        Location
                      </label>
                      <input
                        type="text"
                        value={editLocation}
                        onChange={(e) => setEditLocation(e.target.value)}
                        placeholder="e.g. Office (SF HQ)"
                        className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-[#D1D5DB] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-[#111827]"
                      />
                    </div>
                  </div>

                  {/* In Time & Out Time */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#374151] mb-1.5">
                        In Time
                      </label>
                      <input
                        type="text"
                        value={editInTime}
                        onChange={(e) => setEditInTime(e.target.value)}
                        placeholder="e.g. 09:00 AM"
                        className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-[#D1D5DB] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-[#111827]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#374151] mb-1.5">
                        Out Time
                      </label>
                      <input
                        type="text"
                        value={editOutTime}
                        onChange={(e) => setEditOutTime(e.target.value)}
                        placeholder="e.g. 06:00 PM or --:--"
                        className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-[#D1D5DB] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-[#111827]"
                      />
                    </div>
                  </div>

                  {/* Attendance Status */}
                  <div>
                    <label className="block text-xs font-bold text-[#374151] mb-1.5">
                      Status <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        required
                        value={editStatus}
                        onChange={(e) => setEditStatus(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-[#D1D5DB] bg-white text-[#111827] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 appearance-none cursor-pointer"
                      >
                        <option value="Present">Present</option>
                        <option value="Absent">Absent</option>
                        <option value="First Half Leave">First Half Leave</option>
                        <option value="Second Half Leave">Second Half Leave</option>
                        <option value="Half Day Marked">Half Day Marked</option>
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 text-[#8292AD] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  {/* Remarks */}
                  <div>
                    <label className="block text-xs font-bold text-[#374151] mb-1.5">
                      Remarks / Notes
                    </label>
                    <textarea
                      rows={2}
                      value={editRemarks}
                      onChange={(e) => setEditRemarks(e.target.value)}
                      placeholder="Add any supervisor comments or punch justifications..."
                      className="w-full px-3.5 py-2 text-xs rounded-lg border border-[#D1D5DB] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-[#111827] resize-y"
                    />
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="bg-[#ECEEF2] px-4 sm:px-6 py-3.5 border-t border-[#E5EAF2] flex items-center justify-between">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-md bg-[#2563EB] hover:bg-blue-700 text-white shadow-xs transition-all active:scale-95 cursor-pointer"
                  >
                    <Save className="w-4 h-4 stroke-[2.2]" />
                    <span>Save Changes</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditingRecord(null)}
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

      {/* DELETE CONFIRMATION MODAL */}
      {recordToDelete &&
        createPortal(
          <div
            className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-[2px] flex items-center justify-center p-3 sm:p-6 animate-fade-in"
            onClick={() => setRecordToDelete(null)}
          >
            <div
              className="bg-white rounded-2xl shadow-2xl border border-[#E5EAF2] max-w-sm w-full overflow-hidden animate-scale-in p-5 text-center my-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-3 border border-rose-100">
                <Trash2 className="w-6 h-6 stroke-[2]" />
              </div>
              <h3 className="text-base font-bold text-[#172033]">
                Delete Attendance Record?
              </h3>
              <p className="text-xs text-[#64748B] mt-1.5 leading-relaxed">
                Are you sure you want to remove the attendance log for{' '}
                <strong className="text-[#172033] font-bold">{recordToDelete.name}</strong> on{' '}
                <span className="font-semibold">{recordToDelete.date}</span>? This action cannot be undone.
              </p>

              <div className="flex items-center justify-center gap-2.5 mt-5">
                <button
                  type="button"
                  onClick={() => setRecordToDelete(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-[#F8FAFC] rounded-xl border border-[#E5EAF2] cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};
