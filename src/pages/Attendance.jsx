import React, { useState, useEffect, useRef } from 'react';
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
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'calendar'
  const [selectedRecord, setSelectedRecord] = useState(null);

  // Date Range Filter States
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [showDateFilter, setShowDateFilter] = useState(false);
  const dateFilterRef = useRef(null);

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

  // Close date filter popover on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dateFilterRef.current && !dateFilterRef.current.contains(e.target)) {
        setShowDateFilter(false);
      }
    };
    if (showDateFilter) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDateFilter]);

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

  // Filter matching (Search + Status Tab + From/To Date Range)
  const filteredRecords = records.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.employeeId.toLowerCase().includes(searchQuery.toLowerCase());

    const normalizedStatus = (r.status || '').toLowerCase();
    const filterKey = statusFilter.toLowerCase();

    let matchesStatus = filterKey === 'all';
    if (!matchesStatus) {
      matchesStatus = normalizedStatus === filterKey;
    }

    // Date range filter
    let matchesDate = true;
    if (fromDate || toDate) {
      const recDate = parseDate(r.date);
      if (recDate) {
        if (fromDate) {
          const from = new Date(fromDate);
          from.setHours(0, 0, 0, 0);
          if (recDate < from) matchesDate = false;
        }
        if (toDate) {
          const to = new Date(toDate);
          to.setHours(23, 59, 59, 999);
          if (recDate > to) matchesDate = false;
        }
      }
    }

    return matchesSearch && matchesStatus && matchesDate;
  });

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
          entityName="records"
          searchBar={
            <div className="flex items-center gap-2">
              <div className="w-full sm:w-56">
                <SearchBar
                  value={searchQuery}
                  onChange={setSearchQuery}
                  onClear={() => setSearchQuery('')}
                  placeholder="Search by name, ID..."
                />
              </div>

              {/* Date Filter Icon with From - To Calendar Popover */}
              <div className="relative" ref={dateFilterRef}>
                <button
                  type="button"
                  onClick={() => setShowDateFilter((prev) => !prev)}
                  title="Filter attendance by From-To date range"
                  className={`h-9 px-3 rounded-xl border flex items-center gap-1.5 text-xs font-semibold transition-all cursor-pointer whitespace-nowrap shadow-2xs ${
                    fromDate || toDate
                      ? 'bg-blue-50 text-[#2563EB] border-[#BFDBFE] ring-2 ring-blue-400/20'
                      : 'bg-white text-[#4E5D78] hover:text-[#172033] hover:bg-[#F8FAFC] border-[#E5EAF2]'
                  }`}
                >
                  <Filter className="w-3.5 h-3.5 text-[#2563EB]" />
                  <CalendarIcon className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">
                    {fromDate && toDate
                      ? `${fromDate} to ${toDate}`
                      : fromDate
                      ? `From ${fromDate}`
                      : toDate
                      ? `To ${toDate}`
                      : 'Date Filter'}
                  </span>
                  {(fromDate || toDate) && (
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        setFromDate('');
                        setToDate('');
                      }}
                      className="ml-1 p-0.5 hover:bg-blue-200 rounded-full cursor-pointer"
                      title="Clear date filter"
                    >
                      <X className="w-3 h-3 text-[#2563EB]" />
                    </span>
                  )}
                </button>

                {/* From - To Date Calendar Popover */}
                {showDateFilter && (
                  <div className="absolute right-0 top-full mt-2 z-50 bg-white rounded-2xl shadow-2xl border border-[#E5EAF2] p-4 min-w-[280px] sm:min-w-[320px] animate-fade-in text-left select-none">
                    <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#F1F5F9]">
                      <span className="text-[11px] font-bold text-[#8292AD] uppercase tracking-wider flex items-center gap-1.5">
                        <CalendarIcon className="w-3.5 h-3.5 text-[#2563EB]" />
                        Filter by Date Range
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowDateFilter(false)}
                        className="text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-[11px] font-bold text-[#4E5D78] mb-1">
                          From Date
                        </label>
                        <input
                          type="date"
                          value={fromDate}
                          onChange={(e) => setFromDate(e.target.value)}
                          className="w-full px-3 py-1.5 text-xs rounded-xl border border-[#E5EAF2] bg-[#F8FAFC] focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-[#172033]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-[#4E5D78] mb-1">
                          To Date
                        </label>
                        <input
                          type="date"
                          value={toDate}
                          onChange={(e) => setToDate(e.target.value)}
                          className="w-full px-3 py-1.5 text-xs rounded-xl border border-[#E5EAF2] bg-[#F8FAFC] focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-[#172033]"
                        />
                      </div>

                      {/* Presets */}
                      <div className="flex items-center gap-1.5 pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            const now = new Date();
                            const iso = now.toISOString().split('T')[0];
                            setFromDate(iso);
                            setToDate(iso);
                          }}
                          className="text-[10px] font-semibold px-2 py-1 rounded-lg bg-slate-50 hover:bg-slate-100 text-[#4E5D78] cursor-pointer"
                        >
                          Today
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const now = new Date();
                            const past = new Date();
                            past.setDate(now.getDate() - 7);
                            setFromDate(past.toISOString().split('T')[0]);
                            setToDate(now.toISOString().split('T')[0]);
                          }}
                          className="text-[10px] font-semibold px-2 py-1 rounded-lg bg-slate-50 hover:bg-slate-100 text-[#4E5D78] cursor-pointer"
                        >
                          Last 7 Days
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setFromDate('2026-11-01');
                            setToDate('2026-11-30');
                          }}
                          className="text-[10px] font-semibold px-2 py-1 rounded-lg bg-slate-50 hover:bg-slate-100 text-[#4E5D78] cursor-pointer"
                        >
                          This Month
                        </button>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-[#F1F5F9]">
                        <button
                          type="button"
                          onClick={() => {
                            setFromDate('');
                            setToDate('');
                            setShowDateFilter(false);
                          }}
                          className="text-xs font-semibold text-slate-500 hover:text-slate-800 cursor-pointer"
                        >
                          Reset
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowDateFilter(false)}
                          className="px-3.5 py-1.5 text-xs font-bold bg-[#2563EB] hover:bg-blue-700 text-white rounded-xl shadow-xs cursor-pointer"
                        >
                          Apply Filter
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          }
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
