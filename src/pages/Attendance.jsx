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
  Eye,
  Bell,
  Edit3,
  MapPin,
  Building,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { StatsCard } from '../components/dashboard/StatsCard';
import { DataTable } from '../components/common/DataTable';
import { StatusBadge } from '../components/common/StatusBadge';
import { SearchBar } from '../components/common/SearchBar';
import { Modal } from '../components/common/Modal';
import { attendanceService } from '../services/attendanceService';
import { useToast } from '../context/NotificationContext';

export const Attendance = () => {
  const [records, setRecords] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'calendar'
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [editingRecord, setEditingRecord] = useState(null);
  const [editInTime, setEditInTime] = useState('');
  const [editOutTime, setEditOutTime] = useState('');

  const { addToast } = useToast();

  const loadRecords = () => {
    const raw = attendanceService.getRecords();
    // Normalize status into the 5 standard attendance statuses
    const normalized = raw.map((r) => {
      let st = r.status;
      if (st === 'On Time') st = 'Present';
      if (st === 'Late') st = 'Half Day Marked';
      if (st === 'On Leave') st = 'First Half Leave';
      return { ...r, status: st };
    });
    setRecords(normalized);
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

  const handleRegularizeShift = (row) => {
    setRecords((prev) =>
      prev.map((r) =>
        r.id === row.id ? { ...r, status: 'Present', regularized: true } : r
      )
    );
    addToast({
      title: 'Shift Regularized',
      message: `${row.name}'s attendance has been verified & approved.`,
      type: 'success',
    });
  };

  const handleSendReminder = (row) => {
    addToast({
      title: 'Reminder Sent',
      message: `Shift timing notice delivered to ${row.name} (${row.employeeId}).`,
      type: 'info',
    });
  };

  const handleSaveEditTiming = (e) => {
    e.preventDefault();
    if (!editingRecord) return;
    setRecords((prev) =>
      prev.map((r) =>
        r.id === editingRecord.id
          ? {
            ...r,
            checkIn: editInTime,
            checkOut: editOutTime,
            regularized: true,
          }
          : r
      )
    );
    addToast({
      title: 'Punch Times Updated',
      message: `Updated timings for ${editingRecord.name}: ${editInTime} - ${editOutTime}`,
      type: 'success',
    });
    setEditingRecord(null);
  };

  // Filter matching
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

    return matchesSearch && matchesStatus;
  });

  // Calculate live counts for the 5 exact options
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
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${viewMode === 'table'
                  ? 'bg-[#2563EB] text-white shadow-xs'
                  : 'text-[#8292AD] hover:text-[#172033]'
                  }`}
              >
                Table View
              </button>
              <button
                onClick={() => setViewMode('calendar')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${viewMode === 'calendar'
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
          </div>
        }
      />

      {/* Row: Stats Cards matching Reference Image with compact spacing */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <StatsCard
          title="TOTAL PRESENT"
          value={presentCount}
          subtext={<span className="text-emerald-600 font-semibold">+8 today</span>}
          badgeText="92% Rate"
          badgeType="success"
          icon={UserCheck}
          iconBg="bg-blue-50 text-[#2563EB]"
        />
        <StatsCard
          title="ABSENT TODAY"
          value={absentCount}
          subtext={<span className="text-rose-600 font-semibold">Cutoff marked</span>}
          badgeText="ACTION NEEDED"
          badgeType="danger"
          icon={AlertTriangle}
          iconBg="bg-rose-50 text-rose-600"
        />
        <StatsCard
          title="HALF DAY LEAVES"
          value={firstHalfCount + secondHalfCount}
          subtext="1st & 2nd half"
          badgeText="Scheduled"
          badgeType="default"
          icon={Clock}
          iconBg="bg-amber-50 text-amber-600"
        />
        <StatsCard
          title="AVG WORK HOURS"
          value="8.4h"
          subtext={<span className="text-emerald-600 font-semibold">⚡ top 5% compliance</span>}
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
                  className={`p-2 rounded-xl border min-h-[64px] flex flex-col justify-between transition-colors ${isToday
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

      {/* Attendance Details Modal */}
      {selectedRecord && (
        <Modal
          isOpen={Boolean(selectedRecord)}
          onClose={() => setSelectedRecord(null)}
          title={`Employee Attendance Log`}
        >
          <div className="space-y-4">
            {/* Employee Header */}
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

            {/* Shift Breakdown */}
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

            {/* Current Status Selector */}
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
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${selectedRecord.status === st
                      ? 'bg-[#2563EB] text-white border-[#2563EB] shadow-xs'
                      : 'bg-white text-[#4E5D78] border-[#E5EAF2] hover:bg-[#F8FAFC]'
                      }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-[#E5EAF2]">
              <button
                type="button"
                onClick={() => {
                  handleSendReminder(selectedRecord);
                  setSelectedRecord(null);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 transition-colors cursor-pointer"
              >
                <Bell className="w-3.5 h-3.5" />
                <span>Send Alert</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedRecord(null)}
                  className="px-3.5 py-2 text-xs font-semibold text-[#64748B] hover:text-[#172033] rounded-xl hover:bg-[#F8FAFC] cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleRegularizeShift(selectedRecord);
                    setSelectedRecord(null);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white shadow-xs transition-all cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Regularize Shift</span>
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Edit Punch Hours Modal */}
      {editingRecord && (
        <Modal
          isOpen={Boolean(editingRecord)}
          onClose={() => setEditingRecord(null)}
          title={`Edit Punch Hours - ${editingRecord.name}`}
        >
          <form onSubmit={handleSaveEditTiming} className="space-y-4">
            <p className="text-xs text-[#8292AD]">
              Adjust shift clock-in and clock-out timestamps for{' '}
              <span className="font-bold text-[#172033]">{editingRecord.name}</span>{' '}
              ({editingRecord.employeeId}).
            </p>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#4E5D78] mb-1">
                  Clock In Time
                </label>
                <input
                  type="text"
                  required
                  value={editInTime}
                  onChange={(e) => setEditInTime(e.target.value)}
                  placeholder="e.g. 09:00 AM"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#E5EAF2] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#4E5D78] mb-1">
                  Clock Out Time
                </label>
                <input
                  type="text"
                  required
                  value={editOutTime}
                  onChange={(e) => setEditOutTime(e.target.value)}
                  placeholder="e.g. 06:00 PM"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#E5EAF2] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#E5EAF2]">
              <button
                type="button"
                onClick={() => setEditingRecord(null)}
                className="px-4 py-2 text-xs font-semibold text-[#64748B] hover:text-[#172033] rounded-xl hover:bg-[#F8FAFC] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold bg-[#2563EB] hover:bg-blue-700 text-white rounded-xl shadow-xs transition-all cursor-pointer"
              >
                Save Timings
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
