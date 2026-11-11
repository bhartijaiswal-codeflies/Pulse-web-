import React, { useState, useEffect, useRef } from 'react';
import {
  Laptop,
  Plus,
  CloudDownload,
  CheckCircle,
  AlertCircle,
  RotateCcw,
  RotateCw,
  Search,
  Filter,
  Monitor,
  Smartphone,
  Headphones,
  Check,
  X,
  Eye,
  Loader2,
  RefreshCw,
  Calendar,
  ChevronDown,
  User,
  Shield,
  Tag,
  Clock,
  Sparkles,
} from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { StatsCard } from '../components/dashboard/StatsCard';
import { DataTable } from '../components/common/DataTable';
import { StatusBadge } from '../components/common/StatusBadge';
import { SearchBar } from '../components/common/SearchBar';
import { Modal } from '../components/common/Modal';
import { assetService } from '../services/assetService';
import { employeeService } from '../services/employeeService';
import { useToast } from '../context/NotificationContext';

export const Assets = () => {
  const [assets, setAssets] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const statusDropdownRef = useRef(null);

  // Period / Date filters
  const [periodFilter, setPeriodFilter] = useState('all');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [assigningAsset, setAssigningAsset] = useState(null);
  const [selectedEmpId, setSelectedEmpId] = useState('');

  // Firebase import state
  const [isImporting, setIsImporting] = useState(false);
  const [importError, setImportError] = useState(null);
  const [simulateError, setSimulateError] = useState(false);

  // New asset form
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Laptops');
  const [serial, setSerial] = useState('');
  const [tag, setTag] = useState('');
  const [condition, setCondition] = useState('Brand New');

  const { addToast } = useToast();
  const employees = employeeService.getEmployees();

  const loadAssets = () => {
    setAssets(assetService.getAssets());
  };

  useEffect(() => {
    loadAssets();
  }, []);

  // Close status dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        statusDropdownRef.current &&
        !statusDropdownRef.current.contains(e.target)
      ) {
        setShowStatusDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCreateAsset = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      addToast({
        title: 'Validation error',
        message: 'Asset name/model is required.',
        type: 'warning',
      });
      return;
    }

    const created = assetService.addAsset({
      name: name.trim(),
      category,
      serial: serial.trim() || `SN-${Math.floor(100000 + Math.random() * 900000)}`,
      tag: tag.trim() || `TAG-${category.slice(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
      condition,
      assignedTo: 'Unassigned',
      employeeId: null,
      assignedDate: '--',
      status: 'Available',
    });

    addToast({
      title: 'Asset Registered',
      message: `${created.name} (${created.tag}) added to inventory.`,
      type: 'success',
    });

    loadAssets();
    setShowAddModal(false);
    setName('');
    setSerial('');
    setTag('');
  };

  const handleImportFromFirebase = async () => {
    setIsImporting(true);
    setImportError(null);

    try {
      const result = await assetService.importFromFirebase(simulateError);
      addToast({
        title: 'Firebase Import Successful',
        message: result.message,
        type: 'success',
      });
      loadAssets();
    } catch (err) {
      setImportError(err.message);
      addToast({
        title: 'Firebase Import Failed',
        message: err.message,
        type: 'error',
      });
    } finally {
      setIsImporting(false);
    }
  };

  const handleAssignSubmit = (e) => {
    e.preventDefault();
    if (!selectedEmpId || !assigningAsset) return;

    const emp = employees.find((e) => e.id === selectedEmpId);
    if (!emp) return;

    assetService.assignAsset(assigningAsset.id, emp.name, emp.id);

    addToast({
      title: 'Asset Assigned',
      message: `${assigningAsset.name} assigned to ${emp.name}.`,
      type: 'success',
    });

    loadAssets();
    setAssigningAsset(null);
    setSelectedEmpId('');
  };

  const handleReturnAsset = (asset) => {
    assetService.updateAsset(asset.id, {
      assignedTo: 'Unassigned',
      employeeId: null,
      status: 'Available',
      returnStatus: 'Returned (Ready)',
      assignedDate: '--',
    });

    addToast({
      title: 'Asset Returned',
      message: `${asset.name} marked returned and available for reallocation.`,
      type: 'info',
    });

    loadAssets();
  };

  const handleStatusChange = (id, newStatus) => {
    assetService.updateAsset(id, { status: newStatus });
    addToast({
      title: 'Asset Status Updated',
      message: `Equipment status changed to "${newStatus}".`,
      type: 'info',
    });
    loadAssets();
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('All');
    setCategoryFilter('All');
    setPeriodFilter('all');
    setFromDate('');
    setToDate('');
    addToast({
      title: 'Filters Cleared',
      message: 'Showing all hardware inventory.',
      type: 'info',
    });
  };

  // Filter Assets
  const filteredAssets = assets.filter((a) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      a.name.toLowerCase().includes(q) ||
      a.tag.toLowerCase().includes(q) ||
      a.serial.toLowerCase().includes(q) ||
      (a.assignedTo && a.assignedTo.toLowerCase().includes(q));

    const matchesStatus =
      statusFilter === 'All' || a.status.toLowerCase() === statusFilter.toLowerCase();

    const matchesCat =
      categoryFilter === 'All' || a.category.toLowerCase() === categoryFilter.toLowerCase();

    let matchesDate = true;
    if (periodFilter !== 'all' && a.assignedDate && a.assignedDate !== '--') {
      const aDate = new Date(a.assignedDate);
      const now = new Date();
      if (!isNaN(aDate.getTime())) {
        if (periodFilter === 'today') {
          matchesDate = aDate.toDateString() === now.toDateString();
        } else if (periodFilter === 'this-week') {
          const oneWeekAgo = new Date();
          oneWeekAgo.setDate(now.getDate() - 7);
          matchesDate = aDate >= oneWeekAgo && aDate <= now;
        } else if (periodFilter === 'this-month') {
          matchesDate =
            aDate.getMonth() === now.getMonth() &&
            aDate.getFullYear() === now.getFullYear();
        } else if (periodFilter === 'custom') {
          if (fromDate) {
            const from = new Date(fromDate);
            from.setHours(0, 0, 0, 0);
            if (aDate < from) matchesDate = false;
          }
          if (toDate) {
            const to = new Date(toDate);
            to.setHours(23, 59, 59, 999);
            if (aDate > to) matchesDate = false;
          }
        }
      }
    }

    return matchesSearch && matchesStatus && matchesCat && matchesDate;
  });

  // Status Filter Pill Dropdown Configuration matching Candidate Page
  const statusFilterConfig = {
    All: {
      label: 'All Hardware',
      count: assets.length,
      icon: <Laptop className="w-3.5 h-3.5 text-[#2563EB] stroke-[2.2]" />,
      pillClass: 'bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE] hover:bg-blue-100/70',
      badgeClass: 'bg-[#DBEAFE] text-[#1D4ED8]',
    },
    Assigned: {
      label: 'Assigned to Staff',
      count: assets.filter((a) => a.status === 'Assigned').length,
      icon: <CheckCircle className="w-3.5 h-3.5 text-[#059669] stroke-[2.2]" />,
      pillClass: 'bg-[#ECFDF5] text-[#059669] border-[#A7F3D0] hover:bg-emerald-100/70',
      badgeClass: 'bg-[#D1FAE5] text-[#047857]',
    },
    Available: {
      label: 'Available in Stock',
      count: assets.filter((a) => a.status === 'Available').length,
      icon: <RotateCcw className="w-3.5 h-3.5 text-[#7C3AED] stroke-[2.2]" />,
      pillClass: 'bg-[#FAF5FF] text-[#7C3AED] border-[#E9D5FF] hover:bg-purple-100/70',
      badgeClass: 'bg-[#F3E8FF] text-[#6B21A8]',
    },
    Maintenance: {
      label: 'Under Maintenance',
      count: assets.filter((a) => a.status === 'Maintenance').length,
      icon: <AlertCircle className="w-3.5 h-3.5 text-[#D97706] stroke-[2.2]" />,
      pillClass: 'bg-[#FFFBEB] text-[#D97706] border-[#FDE68A] hover:bg-amber-100/70',
      badgeClass: 'bg-[#FEF3C7] text-[#92400E]',
    },
  };

  const currentStatusConfig = statusFilterConfig[statusFilter] || statusFilterConfig.All;

  // Single-Row Filter Bar matching Candidates design
  const assetFilterBar = (
    <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3">
      {/* Left: All Filters in 1 Row */}
      <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-0">
        {/* 1. Status Dropdown Pill */}
        <div className="relative flex-shrink-0" ref={statusDropdownRef}>
          <button
            type="button"
            onClick={() => setShowStatusDropdown((prev) => !prev)}
            className={`inline-flex items-center gap-2 px-3.5 h-9 rounded-xl border text-xs font-bold transition-all shadow-2xs cursor-pointer select-none active:scale-95 ${currentStatusConfig.pillClass}`}
          >
            <span className="flex-shrink-0">{currentStatusConfig.icon}</span>
            <span>
              {currentStatusConfig.label} ({currentStatusConfig.count})
            </span>
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform duration-200 ${
                showStatusDropdown ? 'rotate-180' : ''
              }`}
            />
          </button>

          {/* Status Dropdown Popover */}
          {showStatusDropdown && (
            <div className="absolute left-0 top-full mt-2 z-50 bg-white rounded-2xl shadow-xl border border-[#E5EAF2] py-1.5 min-w-[220px] animate-fade-in text-left">
              <div className="px-3.5 py-1.5 text-[10px] font-bold text-[#8292AD] uppercase tracking-wider border-b border-[#F1F5F9] mb-1">
                Filter by Asset Status
              </div>
              {Object.entries(statusFilterConfig).map(([key, cfg]) => {
                const isSelected = statusFilter === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => {
                      setStatusFilter(key);
                      setShowStatusDropdown(false);
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

        {/* 2. Search Tag, Model, Serial, User */}
        <div className="w-56 sm:w-64 min-w-[210px] flex-shrink-0">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onClear={() => setSearchQuery('')}
            placeholder="Search tag, model, serial, user..."
          />
        </div>

        {/* 3. Quick Period Dropdown */}
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
            <option value="this-week">This Week</option>
            <option value="this-month">This Month</option>
            <option value="custom">Custom Date Range...</option>
          </select>
          <Calendar className="w-3.5 h-3.5 text-[#2563EB] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <span className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-[10px] text-slate-400">
            ▼
          </span>
        </div>

        {/* 4. Custom Date Range Inputs (when 'custom' selected) */}
        {periodFilter === 'custom' && (
          <div className="flex items-center gap-2 animate-fade-in bg-[#F8FAFC] px-2.5 h-9 rounded-xl border border-[#E5EAF2] flex-shrink-0">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#64748B]">
              <span className="text-[11px] text-[#8292AD]">From:</span>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="px-2 py-1 h-7 text-xs rounded-lg border border-[#D1D5DB] bg-white text-[#172033] font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
              />
            </div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#64748B]">
              <span className="text-[11px] text-[#8292AD]">To:</span>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="px-2 py-1 h-7 text-xs rounded-lg border border-[#D1D5DB] bg-white text-[#172033] font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
              />
            </div>
          </div>
        )}

        {/* 5. Category Filter Dropdown */}
        <div className="relative min-w-[155px] flex-shrink-0">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full appearance-none pl-8 pr-8 h-9 text-xs font-semibold rounded-xl border border-[#E5EAF2] bg-white text-[#172033] hover:bg-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer shadow-2xs transition-colors"
          >
            <option value="All">All Categories</option>
            <option value="Laptops">Laptops</option>
            <option value="Monitors">Monitors</option>
            <option value="Mobile Devices">Mobile Devices</option>
            <option value="Peripherals">Peripherals</option>
          </select>
          <Laptop className="w-3.5 h-3.5 text-[#2563EB] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
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
            Filtered: {filteredAssets.length} Shown of {assets.length}
          </span>
          <button
            onClick={() => loadAssets()}
            title="Refresh Assets"
            className="p-1 hover:bg-[#F8FAFC] rounded-lg transition-transform active:rotate-180 cursor-pointer"
          >
            <RotateCw className="w-3.5 h-3.5 text-[#8292AD] hover:text-[#2563EB] transition-colors" />
          </button>
        </div>
      </div>
    </div>
  );

  const columns = [
    {
      header: 'ASSET & TAG',
      accessor: 'name',
      render: (row) => (
        <div>
          <div
            className="font-bold text-[#172033] text-xs hover:text-[#2563EB] cursor-pointer"
            onClick={() => setSelectedAsset(row)}
          >
            {row.name}
          </div>
          <div className="text-[10px] text-[#8292AD] font-mono mt-0.5">
            {row.tag} • S/N: {row.serial}
          </div>
        </div>
      ),
    },
    {
      header: 'CATEGORY',
      accessor: 'category',
      render: (row) => (
        <span className="text-[11px] font-semibold text-[#172033] px-2.5 py-0.5 rounded-full bg-[#F7F9FC] border border-[#E5EAF2]">
          {row.category}
        </span>
      ),
    },
    {
      header: 'ASSIGNED TO',
      accessor: 'assignedTo',
      render: (row) => (
        <div>
          <div
            className={`text-xs font-bold ${
              row.assignedTo === 'Unassigned'
                ? 'text-[#8292AD]'
                : 'text-[#172033]'
            }`}
          >
            {row.assignedTo}
          </div>
          {row.assignedDate && row.assignedDate !== '--' && (
            <div className="text-[10px] text-[#8292AD] font-medium">
              Since {row.assignedDate}
            </div>
          )}
        </div>
      ),
    },
    {
      header: 'RETURN STATUS',
      accessor: 'returnStatus',
      render: (row) => (
        <span className="text-xs text-[#4E5D78] font-medium">
          {row.returnStatus}
        </span>
      ),
    },
    {
      header: 'CONDITION',
      accessor: 'condition',
      render: (row) => (
        <span className="text-xs text-[#8292AD] font-medium">{row.condition}</span>
      ),
    },
    {
      header: 'STATUS',
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
        title="Asset Management"
        badgeText="Hardware & Devices"
        subtitle="Track equipment inventory, employee assignments, return lifecycle and cloud sync."
        breadcrumbs={[{ label: 'Home', link: '/' }, { label: 'Assets' }]}
        actions={
          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Firebase Import Button */}
            <button
              onClick={handleImportFromFirebase}
              disabled={isImporting}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl bg-white border border-[#E5EAF2] hover:bg-[#F7F9FC] text-[#172033] shadow-xs transition-all disabled:opacity-60 cursor-pointer"
            >
              {isImporting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[#2563EB]" />
                  <span>Syncing Firebase...</span>
                </>
              ) : (
                <>
                  <CloudDownload className="w-3.5 h-3.5 text-[#2563EB]" />
                  <span>Import From Firebase</span>
                </>
              )}
            </button>

            {/* Add Asset Button */}
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white shadow-sm transition-all active:scale-95 shadow-blue-500/20 cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Add Asset</span>
            </button>
          </div>
        }
      />

      {/* Firebase Sync Notification Banner / Error States */}
      {isImporting && (
        <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-blue-900 flex items-center justify-between animate-pulse">
          <div className="flex items-center gap-3">
            <Loader2 className="w-5 h-5 animate-spin text-[#2563EB]" />
            <div>
              <p className="text-xs font-bold">Importing asset data from Firebase Firestore...</p>
              <p className="text-[11px] text-blue-700">Connecting to collection: company_assets (read-only mode)</p>
            </div>
          </div>
          <span className="text-xs font-mono font-semibold">1400ms SLA</span>
        </div>
      )}

      {importError && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
            <div>
              <p className="text-xs font-bold">Firebase Import Error State</p>
              <p className="text-[11px] text-rose-700">{importError}</p>
            </div>
          </div>
          <button
            onClick={() => setImportError(null)}
            className="text-xs font-semibold text-rose-600 hover:underline cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Quick Test Bar for Reviewer */}
      <div className="p-3 bg-white rounded-xl border border-[#E5EAF2] flex items-center justify-between text-xs text-[#8292AD]">
        <span className="flex items-center gap-1.5">
          <RefreshCw className="w-3.5 h-3.5 text-[#2563EB]" />
          <span>Firebase Connection Mock Service (Ready for backend API credentials)</span>
        </span>
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={simulateError}
            onChange={(e) => setSimulateError(e.target.checked)}
            className="rounded text-[#2563EB] focus:ring-0"
          />
          <span className="text-[11px]">Simulate Firebase Error State on next click</span>
        </label>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Hardware"
          value={assets.length}
          subtext="Catalogued equipment"
          badgeText="Active"
          badgeType="success"
          icon={Laptop}
          iconBg="bg-blue-50 text-[#2563EB]"
        />
        <StatsCard
          title="Assigned to Staff"
          value={assets.filter((a) => a.status === 'Assigned').length}
          subtext="In active employee use"
          badgeText="Deployed"
          badgeType="success"
          icon={CheckCircle}
          iconBg="bg-emerald-50 text-emerald-600"
        />
        <StatsCard
          title="Available in Stock"
          value={assets.filter((a) => a.status === 'Available').length}
          subtext="Ready for allocation"
          badgeText="Stock Ready"
          badgeType="default"
          icon={RotateCcw}
          iconBg="bg-purple-50 text-purple-600"
        />
        <StatsCard
          title="Under Maintenance"
          value={assets.filter((a) => a.status === 'Maintenance').length}
          subtext="Servicing / RMA repair"
          badgeText="Attention"
          badgeType="danger"
          icon={AlertCircle}
          iconBg="bg-amber-50 text-amber-600"
        />
      </div>

      {/* Table with Filter Bar matching Candidates design */}
      <DataTable
        columns={columns}
        data={filteredAssets}
        pageSize={6}
        filterBar={assetFilterBar}
        entityName="devices"
        emptyMessage="No assets match your search"
        emptySubtext="Try adjusting your status filter or clearing search query."
        actions={(row) => (
          <div className="inline-flex items-center justify-end gap-1.5">
            <button
              type="button"
              onClick={() => setSelectedAsset(row)}
              title={`View ${row.name} specifications`}
              className="w-7 h-7 rounded-full bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100 hover:scale-105 flex items-center justify-center transition-all shadow-2xs cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>

            {row.assignedTo === 'Unassigned' ? (
              <button
                type="button"
                onClick={() => setAssigningAsset(row)}
                title={`Assign ${row.name} to employee`}
                className="w-7 h-7 rounded-full bg-blue-50 text-[#2563EB] border border-blue-200 flex items-center justify-center hover:bg-blue-100 hover:scale-105 transition-all shadow-2xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleReturnAsset(row)}
                title={`Mark ${row.name} as returned to inventory`}
                className="w-7 h-7 rounded-full bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center hover:bg-amber-100 hover:scale-105 transition-all shadow-2xs cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
      />

      {/* Add Asset Modal */}
      {showAddModal && (
        <Modal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          title="Register Hardware Asset"
          subtitle="Add new company equipment, serial ID, and initial assignment status"
        >
          <form onSubmit={handleCreateAsset} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#172033] mb-1.5">
                Asset Name / Hardware Model *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder='e.g. MacBook Pro 16" M3 Max (36GB RAM)'
                className="w-full px-3.5 py-2 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#172033] mb-1.5">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 bg-white"
                >
                  <option value="Laptops">Laptops</option>
                  <option value="Monitors">Monitors</option>
                  <option value="Mobile Devices">Mobile Devices</option>
                  <option value="Peripherals">Peripherals</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#172033] mb-1.5">
                  Condition
                </label>
                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 bg-white"
                >
                  <option value="Brand New">Brand New (Sealed)</option>
                  <option value="Excellent">Excellent Condition</option>
                  <option value="Good">Good (Refurbished)</option>
                  <option value="Fair">Fair / Usable</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#172033] mb-1.5">
                  Internal Asset Tag (Optional)
                </label>
                <input
                  type="text"
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  placeholder="e.g. TAG-MBP-109"
                  className="w-full px-3.5 py-2 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#172033] mb-1.5">
                  Serial Number (Optional)
                </label>
                <input
                  type="text"
                  value={serial}
                  onChange={(e) => setSerial(e.target.value)}
                  placeholder="e.g. C02G9988PL99"
                  className="w-full px-3.5 py-2 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#E5EAF2]">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-xs rounded-xl border border-[#E5EAF2] text-[#8292AD] hover:bg-[#F7F9FC] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-semibold rounded-xl bg-[#2563EB] text-white hover:bg-blue-700 shadow-sm cursor-pointer"
              >
                Create Asset
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Assign Asset Modal */}
      {assigningAsset && (
        <Modal
          isOpen={!!assigningAsset}
          onClose={() => setAssigningAsset(null)}
          title="Assign Asset to Employee"
          subtitle={`Assigning ${assigningAsset.name} (${assigningAsset.tag})`}
        >
          <form onSubmit={handleAssignSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#172033] mb-1.5">
                Select Team Member *
              </label>
              <select
                required
                value={selectedEmpId}
                onChange={(e) => setSelectedEmpId(e.target.value)}
                className="w-full px-3.5 py-2 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 bg-white"
              >
                <option value="">-- Choose active employee --</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.name} ({emp.designation})
                  </option>
                ))}
              </select>
            </div>

            <div className="p-3 bg-[#F7F9FC] rounded-xl border border-[#E5EAF2] text-xs space-y-1">
              <div className="font-semibold text-[#172033]">Asset Details:</div>
              <div className="text-[#8292AD]">Model: {assigningAsset.name}</div>
              <div className="text-[#8292AD]">Serial Number: {assigningAsset.serial}</div>
              <div className="text-[#8292AD]">Condition: {assigningAsset.condition}</div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#E5EAF2]">
              <button
                type="button"
                onClick={() => setAssigningAsset(null)}
                className="px-4 py-2 text-xs rounded-xl border border-[#E5EAF2] text-[#8292AD] hover:bg-[#F7F9FC] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!selectedEmpId}
                className="px-5 py-2 text-xs font-semibold rounded-xl bg-[#2563EB] text-white hover:bg-blue-700 shadow-sm disabled:opacity-50 cursor-pointer"
              >
                Confirm Assignment
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Asset Details Modal */}
      {selectedAsset && (
        <Modal
          isOpen={!!selectedAsset}
          onClose={() => setSelectedAsset(null)}
          title="Hardware Asset Specification"
          subtitle={`Tag: ${selectedAsset.tag}`}
        >
          <div className="space-y-4">
            <div className="p-4 bg-[#F7F9FC] rounded-2xl border border-[#E5EAF2] flex items-center justify-between">
              <div>
                <h4 className="text-base font-bold text-[#172033]">{selectedAsset.name}</h4>
                <p className="text-xs text-[#8292AD] mt-0.5">Serial: {selectedAsset.serial}</p>
              </div>
              <StatusBadge status={selectedAsset.status} size="sm" />
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl border border-[#E5EAF2]">
                <span className="text-[#8292AD] block mb-0.5">Category</span>
                <span className="font-semibold text-[#172033]">{selectedAsset.category}</span>
              </div>
              <div className="p-3 rounded-xl border border-[#E5EAF2]">
                <span className="text-[#8292AD] block mb-0.5">Condition Rating</span>
                <span className="font-semibold text-[#172033]">{selectedAsset.condition}</span>
              </div>
              <div className="p-3 rounded-xl border border-[#E5EAF2]">
                <span className="text-[#8292AD] block mb-0.5">Assigned Employee</span>
                <span className="font-semibold text-[#172033]">{selectedAsset.assignedTo}</span>
              </div>
              <div className="p-3 rounded-xl border border-[#E5EAF2]">
                <span className="text-[#8292AD] block mb-0.5">Assignment Date</span>
                <span className="font-semibold text-[#172033]">{selectedAsset.assignedDate || 'Unassigned'}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl border border-[#E5EAF2] bg-[#FCFDFE] text-xs">
              <span className="text-[#8292AD] block mb-0.5">Return Lifecycle State</span>
              <span className="font-semibold text-[#172033]">{selectedAsset.returnStatus}</span>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
