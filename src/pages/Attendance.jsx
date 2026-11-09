import React, { useState, useEffect } from 'react';
import {
  Clock,
  UserCheck,
  AlertTriangle,
  Calendar as CalendarIcon,
  Download,
  Filter,
  CheckCircle,
  Play,
  Square,
  Search,
} from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { StatsCard } from '../components/dashboard/StatsCard';
import { DataTable } from '../components/common/DataTable';
import { StatusBadge } from '../components/common/StatusBadge';
import { SearchBar } from '../components/common/SearchBar';
import { attendanceService } from '../services/attendanceService';
import { currentUser } from '../data/mockData';
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

  const columns = [
    {
      header: 'Employee',
      accessor: 'name',
      render: (row) => (
        <div className="flex items-center gap-3">
          <img
            src={row.avatar}
            alt={row.name}
            className="w-9 h-9 rounded-full object-cover ring-2 ring-[#E5EAF2]"
          />
          <div>
            <div className="font-bold text-[#172033]">{row.name}</div>
            <div className="text-[11px] text-[#8292AD]">{row.employeeId}</div>
          </div>
        </div>
      ),
    },
    {
      header: 'Department',
      accessor: 'department',
      render: (row) => <span className="text-xs text-[#4E5D78] font-medium">{row.department}</span>,
    },
    {
      header: 'Date',
      accessor: 'date',
      render: (row) => <span className="text-xs text-[#8292AD]">{row.date}</span>,
    },
    {
      header: 'Check In',
      accessor: 'checkIn',
      render: (row) => (
        <span className="text-xs font-semibold text-[#172033] font-mono">
          {row.checkIn}
        </span>
      ),
    },
    {
      header: 'Check Out',
      accessor: 'checkOut',
      render: (row) => (
        <span className="text-xs font-semibold text-[#8292AD] font-mono">
          {row.checkOut}
        </span>
      ),
    },
    {
      header: 'Work Hours',
      accessor: 'workHours',
      render: (row) => (
        <span className="text-xs font-semibold text-[#172033]">
          {row.workHours}
        </span>
      ),
    },
    {
      header: 'Location',
      accessor: 'location',
      render: (row) => (
        <span className="text-xs text-[#8292AD]">{row.location}</span>
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      align: 'center',
      render: (row) => <StatusBadge status={row.status} size="sm" />,
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
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  viewMode === 'table'
                    ? 'bg-[#2563EB] text-white shadow-xs'
                    : 'text-[#8292AD] hover:text-[#172033]'
                }`}
              >
                Table View
              </button>
              <button
                onClick={() => setViewMode('calendar')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
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
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl bg-white border border-[#E5EAF2] hover:bg-[#F7F9FC] text-[#172033] shadow-xs transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-[#8292AD]" />
              <span>Export CSV</span>
            </button>
          </div>
        }
      />

      {/* Row: Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Present Today"
          value={presentCount}
          subtext="On-time shift arrival"
          badgeText="92% Rate"
          badgeType="success"
          icon={UserCheck}
          iconBg="bg-emerald-50 text-emerald-600"
        />
        <StatsCard
          title="Late Arrivals"
          value={lateCount}
          subtext="After 9:00 AM cutoff"
          badgeText="Follow Up"
          badgeType="danger"
          icon={AlertTriangle}
          iconBg="bg-rose-50 text-rose-600"
        />
        <StatsCard
          title="Employees On Leave"
          value={onLeaveCount}
          subtext="Casual & Sick leaves"
          badgeText="Scheduled"
          badgeType="default"
          icon={Clock}
          iconBg="bg-amber-50 text-amber-600"
        />
        <StatsCard
          title="Avg Daily Hours"
          value="8.4 hrs"
          subtext="Healthy workforce balance"
          badgeText="+0.2 hrs"
          badgeType="success"
          icon={CalendarIcon}
          iconBg="bg-blue-50 text-[#2563EB]"
        />
      </div>

      {viewMode === 'table' ? (
        <>
          {/* Filters Bar matching Reference Image 3 */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#E5EAF2] shadow-card">
            {/* Pill Filters */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {['All', 'On Time', 'Late', 'On Leave'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setStatusFilter(tab)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap transition-colors ${
                    statusFilter === tab
                      ? 'bg-[#2563EB] text-white shadow-xs'
                      : 'bg-[#F7F9FC] text-[#8292AD] hover:text-[#172033] hover:bg-slate-100'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="w-full sm:w-72">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                onClear={() => setSearchQuery('')}
                placeholder="Search by name, ID..."
              />
            </div>
          </div>

          {/* Records Data Table */}
          <DataTable
            columns={columns}
            data={filteredRecords}
            pageSize={6}
            emptyMessage="No attendance records found"
            emptySubtext="Try selecting another filter or adjusting your search term."
          />
        </>
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
            {Array.from({ length: 30 }, (_, i) => {
              const dayNum = i + 1;
              const isWeekend = i % 7 === 5 || i % 7 === 6;
              const isToday = dayNum === 9;
              return (
                <div
                  key={dayNum}
                  className={`p-3 rounded-xl border text-left min-h-[75px] transition-all ${
                    isToday
                      ? 'border-[#2563EB] bg-blue-50/40 ring-2 ring-blue-100'
                      : isWeekend
                      ? 'bg-[#F8FAFC] border-dashed border-[#E5EAF2] text-[#CBD5E1]'
                      : 'border-[#E5EAF2] hover:border-blue-200 hover:bg-[#FBFDFE]'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold text-xs mb-1">
                    <span className={isToday ? 'text-[#2563EB]' : 'text-[#172033]'}>{dayNum}</span>
                    {isToday && (
                      <span className="text-[9px] uppercase px-1 py-0.2 bg-[#2563EB] text-white rounded font-bold">
                        Today
                      </span>
                    )}
                  </div>
                  {!isWeekend && (
                    <div className="space-y-1">
                      <div className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-medium truncate">
                        ✓ 224 Present
                      </div>
                      {dayNum % 4 === 0 && (
                        <div className="text-[10px] text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded font-medium truncate">
                          ! 3 Late
                        </div>
                      )}
                    </div>
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

