import React, { useState, useEffect, useRef } from 'react';
import {
  CreditCard,
  DollarSign,
  Download,
  Receipt,
  Plus,
  ArrowUpRight,
  TrendingDown,
  TrendingUp,
  FileText,
  CheckCircle,
  Check,
  X,
  Search,
  Calendar,
  ChevronDown,
  RotateCw,
  Clock,
  AlertTriangle,
  Building,
} from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { StatsCard } from '../components/dashboard/StatsCard';
import { DataTable } from '../components/common/DataTable';
import { StatusBadge } from '../components/common/StatusBadge';
import { SearchBar } from '../components/common/SearchBar';
import { Modal } from '../components/common/Modal';
import { financeService } from '../services/financeService';
import { useToast } from '../context/NotificationContext';

export const MyFinances = () => {
  const [finances, setFinances] = useState(null);
  const [activeTab, setActiveTab] = useState('payslips'); // 'payslips' or 'expenses'
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const typeDropdownRef = useRef(null);

  // Period / Date filters
  const [periodFilter, setPeriodFilter] = useState('all');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const { addToast } = useToast();

  // New expense form
  const [category, setCategory] = useState('Home Office Setup');
  const [merchant, setMerchant] = useState('');
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');

  const loadFinances = () => {
    setFinances(financeService.getFinances());
  };

  useEffect(() => {
    loadFinances();
  }, []);

  // Close type dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        typeDropdownRef.current &&
        !typeDropdownRef.current.contains(e.target)
      ) {
        setShowTypeDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handlePayslipStatusChange = (id, newStatus) => {
    setFinances((prev) => ({
      ...prev,
      payslips: prev.payslips.map((p) =>
        p.id === id ? { ...p, status: newStatus } : p
      ),
    }));
    addToast({
      title: 'Status Updated',
      message: `Payslip status changed to "${newStatus}".`,
      type: 'info',
    });
  };

  const handleExpenseStatusChange = (id, newStatus) => {
    setFinances((prev) => ({
      ...prev,
      expenses: prev.expenses.map((e) =>
        e.id === id ? { ...e, status: newStatus } : e
      ),
    }));
    addToast({
      title: 'Status Updated',
      message: `Expense claim status changed to "${newStatus}".`,
      type: 'info',
    });
  };

  const handleDownloadPayslip = (slip) => {
    addToast({
      title: 'Downloading Payslip PDF',
      message: `Payslip for ${slip.month} (${slip.id}) is downloading...`,
      type: 'success',
    });
  };

  const handleCreateExpense = (e) => {
    e.preventDefault();
    if (!merchant.trim() || !amount) {
      addToast({
        title: 'Missing information',
        message: 'Please provide merchant name and expense amount.',
        type: 'warning',
      });
      return;
    }

    financeService.addExpense({
      category,
      merchant: merchant.trim(),
      amount: `$${parseFloat(amount).toFixed(2)}`,
      notes,
    });

    addToast({
      title: 'Expense Claim Submitted',
      message: `Claim for $${parseFloat(amount).toFixed(
        2
      )} at ${merchant.trim()} queued for Finance approval.`,
      type: 'success',
    });

    loadFinances();
    setShowExpenseModal(false);
    setMerchant('');
    setAmount('');
    setNotes('');
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
      message: `Reset filters for ${
        activeTab === 'payslips' ? 'Monthly Payslips' : 'Expense Claims'
      }.`,
      type: 'info',
    });
  };

  if (!finances) return null;

  // Filter Payslips
  const filteredPayslips = (finances.payslips || []).filter((p) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      p.month.toLowerCase().includes(q) ||
      p.payPeriod.toLowerCase().includes(q) ||
      p.id.toLowerCase().includes(q);

    const matchesStatus =
      statusFilter === 'All' ||
      p.status.toLowerCase() === statusFilter.toLowerCase();

    let matchesDate = true;
    if (periodFilter !== 'all') {
      const pDate = new Date(p.paymentDate || p.month);
      const now = new Date();
      if (!isNaN(pDate.getTime())) {
        if (periodFilter === 'this-month') {
          matchesDate =
            pDate.getMonth() === now.getMonth() &&
            pDate.getFullYear() === now.getFullYear();
        } else if (periodFilter === 'last-month') {
          const lastMonth = now.getMonth() === 0 ? 11 : now.getMonth() - 1;
          const lastYear =
            now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
          matchesDate =
            pDate.getMonth() === lastMonth && pDate.getFullYear() === lastYear;
        } else if (periodFilter === 'this-year') {
          matchesDate = pDate.getFullYear() === now.getFullYear();
        } else if (periodFilter === 'custom') {
          if (fromDate) {
            const from = new Date(fromDate);
            from.setHours(0, 0, 0, 0);
            if (pDate < from) matchesDate = false;
          }
          if (toDate) {
            const to = new Date(toDate);
            to.setHours(23, 59, 59, 999);
            if (pDate > to) matchesDate = false;
          }
        }
      }
    }

    return matchesSearch && matchesStatus && matchesDate;
  });

  // Filter Expenses
  const filteredExpenses = (finances.expenses || []).filter((e) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      e.id.toLowerCase().includes(q) ||
      e.merchant.toLowerCase().includes(q) ||
      e.category.toLowerCase().includes(q) ||
      (e.notes && e.notes.toLowerCase().includes(q));

    const matchesStatus =
      statusFilter === 'All' ||
      e.status.toLowerCase() === statusFilter.toLowerCase();

    const matchesCat =
      categoryFilter === 'All' ||
      e.category.toLowerCase() === categoryFilter.toLowerCase();

    let matchesDate = true;
    if (periodFilter !== 'all') {
      const eDate = new Date(e.date);
      const now = new Date();
      if (!isNaN(eDate.getTime())) {
        if (periodFilter === 'today') {
          matchesDate = eDate.toDateString() === now.toDateString();
        } else if (periodFilter === 'this-month') {
          matchesDate =
            eDate.getMonth() === now.getMonth() &&
            eDate.getFullYear() === now.getFullYear();
        } else if (periodFilter === 'this-year') {
          matchesDate = eDate.getFullYear() === now.getFullYear();
        } else if (periodFilter === 'custom') {
          if (fromDate) {
            const from = new Date(fromDate);
            from.setHours(0, 0, 0, 0);
            if (eDate < from) matchesDate = false;
          }
          if (toDate) {
            const to = new Date(toDate);
            to.setHours(23, 59, 59, 999);
            if (eDate > to) matchesDate = false;
          }
        }
      }
    }

    return matchesSearch && matchesStatus && matchesCat && matchesDate;
  });

  // Financial View Dropdown Configuration
  const typeFilterConfig = {
    payslips: {
      label: 'Monthly Payslips',
      count: (finances.payslips || []).length,
      icon: <FileText className="w-3.5 h-3.5 text-[#2563EB] stroke-[2.2]" />,
      pillClass:
        'bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE] hover:bg-blue-100/70',
      badgeClass: 'bg-[#DBEAFE] text-[#1D4ED8]',
    },
    expenses: {
      label: 'Expense Claims',
      count: (finances.expenses || []).length,
      icon: <Receipt className="w-3.5 h-3.5 text-purple-600 stroke-[2.2]" />,
      pillClass:
        'bg-[#FAF5FF] text-purple-700 border-[#E9D5FF] hover:bg-purple-100/70',
      badgeClass: 'bg-[#F3E8FF] text-[#6B21A8]',
    },
  };

  const currentTypeConfig =
    typeFilterConfig[activeTab] || typeFilterConfig.payslips;

  const currentFilteredData =
    activeTab === 'payslips' ? filteredPayslips : filteredExpenses;
  const currentTotalData =
    activeTab === 'payslips' ? finances.payslips : finances.expenses;

  // Single-Row Filter Bar matching Candidates design
  const financeFilterBar = (
    <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3">
      {/* Left: All Filters in 1 Row */}
      <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-0">
        {/* 1. View Type Dropdown Pill (Payslips / Expenses) */}
        <div className="relative flex-shrink-0" ref={typeDropdownRef}>
          <button
            type="button"
            onClick={() => setShowTypeDropdown((prev) => !prev)}
            className={`inline-flex items-center gap-2 px-3.5 h-9 rounded-xl border text-xs font-bold transition-all shadow-2xs cursor-pointer select-none active:scale-95 ${currentTypeConfig.pillClass}`}
          >
            <span className="flex-shrink-0">{currentTypeConfig.icon}</span>
            <span>
              {currentTypeConfig.label} ({currentTypeConfig.count})
            </span>
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform duration-200 ${
                showTypeDropdown ? 'rotate-180' : ''
              }`}
            />
          </button>

          {/* View Type Dropdown Popover */}
          {showTypeDropdown && (
            <div className="absolute left-0 top-full mt-2 z-50 bg-white rounded-2xl shadow-xl border border-[#E5EAF2] py-1.5 min-w-[220px] animate-fade-in text-left">
              <div className="px-3.5 py-1.5 text-[10px] font-bold text-[#8292AD] uppercase tracking-wider border-b border-[#F1F5F9] mb-1">
                Select Finance View
              </div>
              {Object.entries(typeFilterConfig).map(([key, cfg]) => {
                const isSelected = activeTab === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => {
                      setActiveTab(key);
                      setStatusFilter('All');
                      setCategoryFilter('All');
                      setShowTypeDropdown(false);
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

        {/* 2. Search Bar */}
        <div className="w-56 sm:w-64 min-w-[210px] flex-shrink-0">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onClear={() => setSearchQuery('')}
            placeholder={
              activeTab === 'payslips'
                ? 'Search pay period, month, ID...'
                : 'Search merchant, expense ID, notes...'
            }
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
            {activeTab === 'expenses' && <option value="today">Today</option>}
            <option value="this-month">This Month</option>
            <option value="last-month">Last Month</option>
            <option value="this-year">This Year</option>
            <option value="custom">Custom Date Range...</option>
          </select>
          <Calendar className="w-3.5 h-3.5 text-[#2563EB] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <ChevronDown className="w-3.5 h-3.5 text-[#8292AD] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
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

        {/* 5. Status Filter Dropdown */}
        <div className="relative min-w-[145px] flex-shrink-0">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full appearance-none pl-8 pr-8 h-9 text-xs font-semibold rounded-xl border border-[#E5EAF2] bg-white text-[#172033] hover:bg-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer shadow-2xs transition-colors"
          >
            <option value="All">All Statuses</option>
            {activeTab === 'payslips' ? (
              <>
                <option value="Paid">Paid</option>
                <option value="Processing">Processing</option>
                <option value="Pending">Pending</option>
              </>
            ) : (
              <>
                <option value="Approved">Approved</option>
                <option value="Processing">Processing</option>
                <option value="Reimbursed">Reimbursed</option>
                <option value="Declined">Declined</option>
              </>
            )}
          </select>
          <CheckCircle className="w-3.5 h-3.5 text-[#2563EB] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <ChevronDown className="w-3.5 h-3.5 text-[#8292AD] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* 6. Category Filter Dropdown (for Expense Claims) */}
        {activeTab === 'expenses' && (
          <div className="relative min-w-[160px] flex-shrink-0">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full appearance-none pl-8 pr-8 h-9 text-xs font-semibold rounded-xl border border-[#E5EAF2] bg-white text-[#172033] hover:bg-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer shadow-2xs transition-colors"
            >
              <option value="All">All Categories</option>
              <option value="Home Office Setup">Home Office Setup</option>
              <option value="Client Dinner / Travel">Client Dinner / Travel</option>
              <option value="Conference Registration">Conference Registration</option>
              <option value="Software & Subscriptions">Software & Subscriptions</option>
              <option value="Wellness & Medical">Wellness & Medical</option>
            </select>
            <Receipt className="w-3.5 h-3.5 text-[#2563EB] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <ChevronDown className="w-3.5 h-3.5 text-[#8292AD] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        )}
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
            Filtered: {currentFilteredData.length} Shown of {currentTotalData.length}
          </span>
          <button
            onClick={() => loadFinances()}
            title="Refresh Financial Records"
            className="p-1 hover:bg-[#F8FAFC] rounded-lg transition-transform active:rotate-180 cursor-pointer"
          >
            <RotateCw className="w-3.5 h-3.5 text-[#8292AD] hover:text-[#2563EB] transition-colors" />
          </button>
        </div>
      </div>
    </div>
  );

  const payslipColumns = [
    {
      header: 'PAY PERIOD',
      accessor: 'month',
      render: (row) => (
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#2563EB] flex items-center justify-center font-bold text-xs">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-[#172033] text-xs">{row.month}</div>
            <div className="text-[10px] text-[#8292AD] font-medium">
              {row.payPeriod}
            </div>
          </div>
        </div>
      ),
    },
    {
      header: 'BASIC PAY',
      accessor: 'basicPay',
      render: (row) => (
        <span className="text-xs font-bold text-[#172033]">
          {row.basicPay}
        </span>
      ),
    },
    {
      header: 'ALLOWANCES',
      accessor: 'allowances',
      render: (row) => (
        <span className="text-xs font-bold text-emerald-600">
          +{row.allowances}
        </span>
      ),
    },
    {
      header: 'DEDUCTIONS',
      accessor: 'taxDeduction',
      render: (row) => (
        <span className="text-xs font-bold text-rose-600">
          -{row.taxDeduction}
        </span>
      ),
    },
    {
      header: 'NET DISBURSED',
      accessor: 'netSalary',
      render: (row) => (
        <span className="text-xs font-black text-[#172033]">
          {row.netSalary}
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
          size="xs"
          showChevron={true}
          onStatusChange={(newStatus) =>
            handlePayslipStatusChange(row.id, newStatus)
          }
        />
      ),
    },
  ];

  const expenseColumns = [
    {
      header: 'EXPENSE ID / DATE',
      accessor: 'id',
      render: (row) => (
        <div>
          <div className="font-bold text-[#172033] text-xs">{row.id}</div>
          <div className="text-[10px] text-[#8292AD] font-medium">
            {row.date}
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
      header: 'MERCHANT',
      accessor: 'merchant',
      render: (row) => (
        <span className="text-xs text-[#4E5D78] font-medium">
          {row.merchant}
        </span>
      ),
    },
    {
      header: 'CLAIM AMOUNT',
      accessor: 'amount',
      render: (row) => (
        <span className="text-xs font-black text-[#172033]">
          {row.amount}
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
          size="xs"
          showChevron={true}
          onStatusChange={(newStatus) =>
            handleExpenseStatusChange(row.id, newStatus)
          }
        />
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <PageHeader
        title="Payroll & Finances"
        badgeText="Admin Finance Hub"
        subtitle="Manage company payroll distributions, tax compliance, and team expense reimbursements."
        breadcrumbs={[{ label: 'Home', link: '/' }, { label: 'Finances' }]}
        actions={
          <button
            onClick={() => setShowExpenseModal(true)}
            className="inline-flex items-center gap-1.5 px-4 h-9 text-xs font-bold rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white shadow-sm transition-all active:scale-95 shadow-blue-500/20 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Process Reimbursement</span>
          </button>
        }
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Monthly Base Pay"
          value={finances.summary.baseSalary}
          subtext="Gross monthly contract"
          badgeText="Active"
          badgeType="success"
          icon={CreditCard}
          iconBg="bg-blue-50 text-[#2563EB]"
        />
        <StatsCard
          title="Net Take-Home"
          value={finances.summary.netPayable}
          subtext="Direct deposit on 30th"
          badgeText="Disbursed"
          badgeType="success"
          icon={DollarSign}
          iconBg="bg-emerald-50 text-emerald-600"
        />
        <StatsCard
          title="Taxes & Benefits"
          value={finances.summary.deductions}
          subtext="Federal, state, and 401(k)"
          badgeText="19.3%"
          badgeType="default"
          icon={TrendingDown}
          iconBg="bg-amber-50 text-amber-600"
        />
        <StatsCard
          title="Reimbursements"
          value={finances.summary.reimbursements}
          subtext="Approved Q4 claims"
          badgeText="Pending Deposit"
          badgeType="default"
          icon={Receipt}
          iconBg="bg-purple-50 text-purple-600"
        />
      </div>

      {/* Table Content with Filter Bar matching Candidates design */}
      {activeTab === 'payslips' ? (
        <DataTable
          columns={payslipColumns}
          data={filteredPayslips}
          pageSize={6}
          filterBar={financeFilterBar}
          entityName="statements"
          emptyMessage="No payslips match your search"
          emptySubtext="Try adjusting your status or clearing search query."
          actions={(row) => (
            <div className="inline-flex items-center justify-end gap-1.5">
              <button
                onClick={() => handleDownloadPayslip(row)}
                title="Download Payslip PDF"
                className="w-7 h-7 rounded-full bg-blue-50 text-[#2563EB] border border-blue-200 flex items-center justify-center hover:bg-blue-100 hover:scale-105 transition-all shadow-2xs cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        />
      ) : (
        <DataTable
          columns={expenseColumns}
          data={filteredExpenses}
          pageSize={6}
          filterBar={financeFilterBar}
          entityName="claims"
          emptyMessage="No expense claims match your search"
          emptySubtext="Try selecting another category or clearing search query."
          actions={(row) => (
            <div className="inline-flex items-center justify-end gap-1.5">
              <button
                onClick={() =>
                  addToast({
                    title: 'Expense Claim Approved',
                    message: `Claim for ${row.id} marked as Approved.`,
                    type: 'success',
                  })
                }
                title="Approve Claim"
                className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center hover:bg-emerald-100 hover:scale-105 transition-all shadow-2xs cursor-pointer"
              >
                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
              <button
                onClick={() =>
                  addToast({
                    title: 'Expense Claim Declined',
                    message: `Claim for ${row.id} declined.`,
                    type: 'error',
                  })
                }
                title="Decline Claim"
                className="w-7 h-7 rounded-full bg-rose-50 text-rose-500 border border-rose-200 flex items-center justify-center hover:bg-rose-100 hover:scale-105 transition-all shadow-2xs cursor-pointer"
              >
                <X className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            </div>
          )}
        />
      )}

      {/* Claim Expense Modal */}
      {showExpenseModal && (
        <Modal
          isOpen={showExpenseModal}
          onClose={() => setShowExpenseModal(false)}
          title="Submit Expense Claim"
          subtitle="Upload receipt and specify business expense category"
        >
          <form onSubmit={handleCreateExpense} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#172033] mb-1.5">
                Expense Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 bg-white"
              >
                <option value="Home Office Setup">Home Office Setup</option>
                <option value="Client Dinner / Travel">Client Dinner / Travel</option>
                <option value="Conference Registration">Conference Registration</option>
                <option value="Software & Subscriptions">Software & Subscriptions</option>
                <option value="Wellness & Medical">Wellness & Medical</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#172033] mb-1.5">
                  Merchant / Vendor Name *
                </label>
                <input
                  type="text"
                  required
                  value={merchant}
                  onChange={(e) => setMerchant(e.target.value)}
                  placeholder="e.g. Delta Airlines, AWS"
                  className="w-full px-3.5 py-2 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#172033] mb-1.5">
                  Amount (USD) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="1"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-3.5 py-2 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#172033] mb-1.5">
                Notes / Justification
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Explain the business purpose of this expenditure..."
                className="w-full px-3.5 py-2 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#E5EAF2]">
              <button
                type="button"
                onClick={() => setShowExpenseModal(false)}
                className="px-4 py-2 text-xs rounded-xl border border-[#E5EAF2] text-[#8292AD] hover:bg-[#F7F9FC] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-semibold rounded-xl bg-[#2563EB] text-white hover:bg-blue-700 shadow-sm cursor-pointer"
              >
                Submit Claim
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
