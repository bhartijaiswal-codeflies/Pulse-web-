import React, { useState, useEffect, useRef, useMemo } from 'react';
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
  Users,
  Wallet,
  Briefcase,
  Edit2,
  Trash2,
  Eye,
  Printer,
  ChevronLeft,
  ChevronRight,
  Filter,
  Layers,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Info,
} from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { StatsCard } from '../components/dashboard/StatsCard';
import { DataTable } from '../components/common/DataTable';
import { StatusBadge } from '../components/common/StatusBadge';
import { SearchBar } from '../components/common/SearchBar';
import { Modal } from '../components/common/Modal';
import {
  financeService,
  payrollMonthsList,
  getDaysInMonth,
  calculatePayrollRow,
} from '../services/financeService';
import { useToast } from '../context/NotificationContext';

export const MyFinances = () => {
  const { addToast } = useToast();

  // Active View: 'payroll' (All Employees Monthly Calculation) | 'payslips' (Personal Slips) | 'expenses' (Expense Claims)
  const [activeTab, setActiveTab] = useState('payroll');

  // Selected Month for Payroll Table (Defaults to Jan 2026 as per handwritten requirement)
  const [selectedMonth, setSelectedMonth] = useState('Jan 2026');

  // Payroll data state
  const [payrollData, setPayrollData] = useState([]);

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Existing finances state (for payslips & expenses tabs)
  const [finances, setFinances] = useState(null);

  // Modals state
  const [editingPayrollRow, setEditingPayrollRow] = useState(null);
  const [selectedPayslipRow, setSelectedPayslipRow] = useState(null);
  const [showAddPayrollModal, setShowAddPayrollModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);

  // Form states for Edit Payroll
  const [editForm, setEditForm] = useState({
    salary: 10000,
    grossSalary: 10000,
    baseSalary: 5000, // 50% of 10000 Gross Salary
    leaveTaken: 2,
    bucketAvailable: 3,
    pf: 1200, // 24% of Base Salary
    esi: 200, // 4% of Base Salary
    tds: 0,
    otherDeduction: 1245,
    deductionNotes: '',
    status: 'Paid',
    remarks: '',
  });

  // Form states for Add Payroll
  const [addForm, setAddForm] = useState({
    name: '',
    empCode: '',
    designation: 'Executive',
    salary: 25000,
    grossSalary: 25000,
    baseSalary: 12500, // 50% of 25000 Gross Salary
    leaveTaken: 0,
    bucketAvailable: 2,
    pf: 3000,  // 24% of 12500 Base Salary
    esi: 500,  // 4% of 12500 Base Salary
    tds: 0,    // Manual entry
    otherDeduction: 200,
    deductionNotes: 'Professional Tax',
    status: 'Processed',
    remarks: 'Monthly addition',
  });

  // Expense claim form states
  const [expenseForm, setExpenseForm] = useState({
    category: 'Home Office Setup',
    merchant: '',
    amount: '',
    notes: '',
  });

  // Load data for active month and finances
  const loadData = () => {
    setFinances(financeService.getFinances());
    const monthlyList = financeService.getMonthlyPayroll(selectedMonth);
    setPayrollData(monthlyList);
  };

  useEffect(() => {
    loadData();
  }, [selectedMonth]);

  // Days in selected month
  const daysInCurrentMonth = useMemo(() => {
    return getDaysInMonth(selectedMonth);
  }, [selectedMonth]);

  // Navigate to previous month
  const handlePrevMonth = () => {
    const currentIndex = payrollMonthsList.findIndex((m) => m.key === selectedMonth);
    if (currentIndex < payrollMonthsList.length - 1) {
      setSelectedMonth(payrollMonthsList[currentIndex + 1].key);
    }
  };

  // Navigate to next month
  const handleNextMonth = () => {
    const currentIndex = payrollMonthsList.findIndex((m) => m.key === selectedMonth);
    if (currentIndex > 0) {
      setSelectedMonth(payrollMonthsList[currentIndex - 1].key);
    }
  };

  // Filtered Payroll Data
  const filteredPayroll = useMemo(() => {
    return payrollData.filter((row) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        row.name?.toLowerCase().includes(q) ||
        row.empCode?.toLowerCase().includes(q) ||
        row.designation?.toLowerCase().includes(q);

      const matchesStatus = statusFilter === 'All' || row.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [payrollData, searchQuery, statusFilter]);

  // Calculate top summary metrics for selected month
  const summaryMetrics = useMemo(() => {
    const totalGross = filteredPayroll.reduce((acc, row) => acc + (Number(row.grossSalary || row.salary) || 0), 0);
    const totalBase = filteredPayroll.reduce((acc, row) => acc + (Number(row.baseSalary || Math.round((Number(row.grossSalary || row.salary) || 0) * 0.5))), 0);
    const totalPayable = filteredPayroll.reduce((acc, row) => acc + (Number(row.payable) || 0), 0);
    const totalUnpaidLeaves = filteredPayroll.reduce((acc, row) => acc + (Number(row.unpaidLeave) || 0), 0);
    const totalUnpaidDeduction = filteredPayroll.reduce((acc, row) => acc + (Number(row.unpaidDeductionAmount) || 0), 0);
    const totalPf = filteredPayroll.reduce((acc, row) => acc + (Number(row.pf) || 0), 0);
    const totalEsi = filteredPayroll.reduce((acc, row) => acc + (Number(row.esi) || 0), 0);
    const totalTds = filteredPayroll.reduce((acc, row) => acc + (Number(row.tds) || 0), 0);
    const totalOtherDeductions = filteredPayroll.reduce((acc, row) => acc + (Number(row.otherDeduction) || 0), 0);
    const totalDeductions = totalUnpaidDeduction + totalPf + totalEsi + totalTds + totalOtherDeductions;

    return {
      totalGross,
      totalBase,
      totalPayable,
      totalUnpaidLeaves,
      totalUnpaidDeduction,
      totalPf,
      totalEsi,
      totalTds,
      totalOtherDeductions,
      totalDeductions,
      headcount: filteredPayroll.length,
    };
  }, [filteredPayroll]);

  // --- ACTIONS ---

  // Direct Inline Manual TDS Update in Table Row
  const handleInlineTdsChange = (employeeId, val) => {
    const cleanVal = val === '' ? 0 : Math.max(0, Number(val) || 0);
    financeService.updatePayrollEntry(selectedMonth, employeeId, { tds: cleanVal });
    setPayrollData((prev) =>
      prev.map((r) =>
        r.id === employeeId || r.empCode === employeeId
          ? calculatePayrollRow({ ...r, tds: cleanVal }, daysInCurrentMonth)
          : r
      )
    );
  };

  // Open Edit Modal
  const handleOpenEdit = (row) => {
    setEditingPayrollRow(row);
    const gross = Number(row.grossSalary !== undefined ? row.grossSalary : row.salary) || 0;
    const base = Number(row.baseSalary !== undefined ? row.baseSalary : Math.round(gross * 0.5)) || 0;
    setEditForm({
      salary: gross,
      grossSalary: gross,
      baseSalary: base,
      leaveTaken: row.leaveTaken,
      bucketAvailable: row.bucketAvailable,
      pf: row.pf !== undefined ? row.pf : Math.round(base * 0.24),
      esi: row.esi !== undefined ? row.esi : Math.round(base * 0.04),
      tds: row.tds || 0,
      otherDeduction: row.otherDeduction,
      deductionNotes: row.deductionNotes || '',
      status: row.status || 'Paid',
      remarks: row.remarks || '',
    });
  };

  // Save Edit Payroll
  const handleSaveEditPayroll = (e) => {
    e.preventDefault();
    if (!editingPayrollRow) return;

    const gross = Number(editForm.grossSalary !== undefined ? editForm.grossSalary : editForm.salary) || 0;
    const base = Number(editForm.baseSalary !== undefined ? editForm.baseSalary : Math.round(gross * 0.5)) || 0;

    financeService.updatePayrollEntry(selectedMonth, editingPayrollRow.id, {
      salary: gross,
      grossSalary: gross,
      baseSalary: base,
      leaveTaken: Number(editForm.leaveTaken),
      bucketAvailable: Number(editForm.bucketAvailable),
      pf: Number(editForm.pf),
      esi: Number(editForm.esi),
      tds: Number(editForm.tds),
      otherDeduction: Number(editForm.otherDeduction),
      deductionNotes: editForm.deductionNotes,
      status: editForm.status,
      remarks: editForm.remarks,
    });

    addToast({
      title: 'Payroll Updated ✓',
      message: `${editingPayrollRow.name}'s calculation saved for ${selectedMonth}.`,
      type: 'success',
    });

    setEditingPayrollRow(null);
    loadData();
  };

  // Add Payroll Entry
  const handleSaveAddPayroll = (e) => {
    e.preventDefault();
    if (!addForm.name.trim()) {
      addToast({ title: 'Name Required', message: 'Please provide employee name.', type: 'warning' });
      return;
    }

    const gross = Number(addForm.grossSalary !== undefined ? addForm.grossSalary : addForm.salary) || 0;
    const base = Number(addForm.baseSalary !== undefined ? addForm.baseSalary : Math.round(gross * 0.5)) || 0;

    const newEntry = {
      id: `EMP-${Date.now().toString().slice(-4)}`,
      name: addForm.name.trim(),
      empCode: addForm.empCode || `CFT-${Math.floor(100 + Math.random() * 900)}`,
      designation: addForm.designation,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      salary: gross,
      grossSalary: gross,
      baseSalary: base,
      leaveTaken: Number(addForm.leaveTaken),
      bucketAvailable: Number(addForm.bucketAvailable),
      pf: Number(addForm.pf),
      esi: Number(addForm.esi),
      tds: Number(addForm.tds),
      otherDeduction: Number(addForm.otherDeduction),
      deductionNotes: addForm.deductionNotes,
      status: addForm.status,
      paymentDate: `28 ${selectedMonth}`,
      remarks: addForm.remarks,
    };

    financeService.addPayrollEntry(selectedMonth, newEntry);

    addToast({
      title: 'Employee Added ✓',
      message: `${newEntry.name} added to ${selectedMonth} payroll sheet.`,
      type: 'success',
    });

    setShowAddPayrollModal(false);
    loadData();
  };

  // Delete Payroll Entry
  const handleDeletePayroll = (row) => {
    financeService.deletePayrollEntry(selectedMonth, row.id);
    addToast({
      title: 'Record Removed',
      message: `${row.name}'s payroll entry removed for ${selectedMonth}.`,
      type: 'info',
    });
    loadData();
  };

  // Export to CSV matching the handwritten sheet with PF 24%, ESI 4%, and TDS
  const handleExportCSV = () => {
    let csv = `Employee Name,Employee Code,Month,Gross Salary (INR),Base Salary (INR),Leaves Taken,Bucket Available,Unpaid Leaves,New Bucket Leave,PF 24% of Base (INR),ESI 4% of Base (INR),TDS Manual (INR),Other Deductions (INR),Total Deductions (INR),Net Payable Salary (INR),Status\n`;

    filteredPayroll.forEach((row) => {
      const gross = row.grossSalary || row.salary;
      const base = row.baseSalary || Math.round(gross * 0.5);
      csv += `"${row.name}","${row.empCode}","${selectedMonth}",${gross},${base},${row.leaveTaken},${row.bucketAvailable},${row.unpaidLeave},${row.newBucket},${row.pf},${row.esi},${row.tds},${row.otherDeduction},${row.totalDeductions},${row.payable},"${row.status}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Pulse_Payroll_Calculation_${selectedMonth.replace(/\s+/g, '_')}.csv`;
    link.click();

    addToast({
      title: 'Payroll Exported ✓',
      message: `Downloaded CSV payroll sheet for ${selectedMonth}.`,
      type: 'success',
    });
  };

  // Handle New Expense Claim
  const handleCreateExpense = (e) => {
    e.preventDefault();
    if (!expenseForm.merchant.trim() || !expenseForm.amount) {
      addToast({ title: 'Missing Information', message: 'Please provide merchant and amount.', type: 'warning' });
      return;
    }

    financeService.addExpense({
      category: expenseForm.category,
      merchant: expenseForm.merchant.trim(),
      amount: `₹${parseFloat(expenseForm.amount).toFixed(2)}`,
      notes: expenseForm.notes,
    });

    addToast({
      title: 'Expense Claim Submitted',
      message: `Claim for ₹${expenseForm.amount} queued for approval.`,
      type: 'success',
    });

    setShowExpenseModal(false);
    setExpenseForm({ category: 'Home Office Setup', merchant: '', amount: '', notes: '' });
    loadData();
  };

  // Format currency helper
  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  // --- TABLE COLUMNS CONFIGURATION (MATCHING USER HANDWRITTEN SHEET) ---
  const payrollColumns = [
    {
      header: 'EMPLOYEE LIST',
      accessor: 'name',
      render: (row) => (
        <div className="flex items-center gap-2.5">
          <img
            src={row.avatar}
            alt={row.name}
            className="w-8 h-8 rounded-full object-cover ring-2 ring-[#E5EAF2] flex-shrink-0"
          />
          <div className="min-w-0">
            <div
              onClick={() => setSelectedPayslipRow(row)}
              className="font-bold text-[#172033] text-xs hover:text-[#2563EB] cursor-pointer truncate"
              title={`View ${row.name} payslip`}
            >
              {row.name}
            </div>
            <div className="text-[10px] text-[#8292AD] font-medium mt-0.5">
              <span className="font-mono text-slate-700">{row.empCode}</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      header: 'SALARY (GROSS / BASE)',
      accessor: 'salary',
      render: (row) => {
        const gross = Number(row.grossSalary || row.salary) || 0;
        const base = Number(row.baseSalary || Math.round(gross * 0.5)) || 0;
        return (
          <div className="flex flex-col">
            <span className="font-bold text-[#172033] text-xs">
              {formatCurrency(gross)}
            </span>
            <span className="text-[10px] text-blue-700 font-semibold" title="Base Salary (50% of Gross)">
              Base: {formatCurrency(base)}
            </span>
          </div>
        );
      },
    },
    {
      header: 'LEAVE TAKEN',
      accessor: 'leaveTaken',
      render: (row) => (
        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
          <Calendar className="w-3 h-3 text-slate-500" />
          <span>{row.leaveTaken} {row.leaveTaken === 1 ? 'Day' : 'Days'}</span>
        </span>
      ),
    },
    {
      header: 'BUCKET AVAILABLE',
      accessor: 'bucketAvailable',
      render: (row) => (
        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-[#1D4ED8] border border-blue-200">
          <Wallet className="w-3 h-3 text-[#2563EB]" />
          <span>{row.bucketAvailable} {row.bucketAvailable === 1 ? 'Day' : 'Days'}</span>
        </span>
      ),
    },
    {
      header: 'UNPAID LEAVE',
      accessor: 'unpaidLeave',
      render: (row) => {
        if (row.unpaidLeave > 0) {
          return (
            <span
              title={`Deduction: -${formatCurrency(row.unpaidDeductionAmount)} (${daysInCurrentMonth} days divisor)`}
              className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200"
            >
              <AlertTriangle className="w-3 h-3 text-rose-600" />
              <span>{row.unpaidLeave} {row.unpaidLeave === 1 ? 'Day' : 'Days'} LOP</span>
            </span>
          );
        }
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            <Check className="w-3 h-3 text-emerald-600" />
            <span>0 Days</span>
          </span>
        );
      },
    },
    {
      header: 'NEW BUCKET',
      accessor: 'newBucket',
      className: 'min-w-[100px]',
      render: (row) => (
        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-teal-50 text-[#008080] border border-teal-200">
          <Layers className="w-3 h-3 text-[#008080]" />
          <span>{row.newBucket} {row.newBucket === 1 ? 'Day' : 'Days'}</span>
        </span>
      ),
    },
    {
      header: 'PF (24%)',
      accessor: 'pf',
      className: 'min-w-[110px]',
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-bold text-rose-700 text-xs">
            -{formatCurrency(row.pf)}
          </span>
          <span className="text-[9.5px] text-[#8292AD] font-semibold flex items-center gap-1 mt-0.5" title="Calculated on Base Salary (50% of Gross)">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            <span>24% of Base</span>
          </span>
        </div>
      ),
    },
    {
      header: 'ESI (4%)',
      accessor: 'esi',
      className: 'min-w-[100px]',
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-bold text-rose-700 text-xs">
            -{formatCurrency(row.esi)}
          </span>
          <span className="text-[9.5px] text-[#8292AD] font-semibold flex items-center gap-1 mt-0.5" title="Calculated on Base Salary (50% of Gross)">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
            <span>4% of Base</span>
          </span>
        </div>
      ),
    },
    {
      header: 'TDS (MANUAL)',
      accessor: 'tds',
      className: 'min-w-[140px]',
      render: (row) => (
        <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
          <div className="relative flex items-center">
            <span className="absolute left-2.5 text-slate-400 text-xs font-bold pointer-events-none">₹</span>
            <input
              type="number"
              min="0"
              step="50"
              value={row.tds ?? ''}
              placeholder="0"
              onChange={(e) => handleInlineTdsChange(row.id, e.target.value)}
              className="w-24 pl-5 pr-2 py-1 text-xs font-bold text-rose-700 bg-rose-50/50 hover:bg-white focus:bg-white border border-rose-200 focus:border-[#2563EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all text-right shadow-2xs"
              title="Click to enter manual TDS deduction"
            />
          </div>
        </div>
      ),
    },
    {
      header: 'OTHER DEDUCTION',
      accessor: 'otherDeduction',
      className: 'min-w-[120px]',
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-semibold text-rose-700 text-xs">
            -{formatCurrency(row.otherDeduction)}
          </span>
          {row.deductionNotes && (
            <span className="text-[9.5px] text-[#8292AD] truncate max-w-[120px]" title={row.deductionNotes}>
              {row.deductionNotes}
            </span>
          )}
        </div>
      ),
    },
    {
      header: 'PAYABLE SALARY',
      accessor: 'payable',
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-black text-emerald-700 text-sm">
            {formatCurrency(row.payable)}
          </span>
          <span className="text-[9.5px] text-emerald-600 font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>{row.status}</span>
          </span>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* 1. Page Header */}
      <PageHeader
        title="Finance & Payroll"
        badgeText="Executive Disbursement"
        subtitle="Manage monthly workforce salary calculations, leave buckets, loss of pay deductions, and payslips."
        breadcrumbs={[{ label: 'Home', link: '/' }, { label: 'Finances' }]}
        actions={
          <div className="flex items-center gap-2 flex-wrap">
            {/* Export CSV Button (Matching Handwritten Sheet) */}
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 px-3.5 h-9 text-xs font-bold rounded-xl bg-white border border-[#E5EAF2] text-[#172033] hover:bg-slate-50 shadow-2xs transition-all cursor-pointer"
              title="Download full monthly payroll calculations CSV"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Export CSV</span>
            </button>

            {/* Primary Action Button */}
            {activeTab === 'payroll' ? (
              <button
                onClick={() => setShowAddPayrollModal(true)}
                className="inline-flex items-center gap-1.5 px-4 h-9 text-xs font-bold rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white shadow-sm transition-all active:scale-95 shadow-blue-500/20 cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>Add Record</span>
              </button>
            ) : (
              <button
                onClick={() => setShowExpenseModal(true)}
                className="inline-flex items-center gap-1.5 px-4 h-9 text-xs font-bold rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white shadow-sm transition-all active:scale-95 shadow-blue-500/20 cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>New Expense Claim</span>
              </button>
            )}
          </div>
        }
      />

      {/* 2. Top Summary Metrics Cards for Selected Month */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Net Payable */}
        <div className="p-4 rounded-2xl bg-white border border-[#E5EAF2] shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#8292AD] uppercase tracking-wider">Total Net Payable</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-950 mt-2">
            {formatCurrency(summaryMetrics.totalPayable)}
          </div>
          <div className="text-[11px] text-emerald-700 font-semibold mt-0.5 flex items-center gap-1">
            <span>Cycle: {selectedMonth}</span>
          </div>
        </div>

        {/* Card 2: Total Gross Base Salary */}
        <div className="p-4 rounded-2xl bg-white border border-[#E5EAF2] shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#8292AD] uppercase tracking-wider">Gross & Base Payroll</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center font-bold">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#172033] mt-2">
            {formatCurrency(summaryMetrics.totalGross)}
          </div>
          <div className="text-[11px] text-blue-700 font-semibold mt-0.5">
            Base (50%): {formatCurrency(summaryMetrics.totalBase)} • {summaryMetrics.headcount} Staff
          </div>
        </div>

        {/* Card 3: Total Unpaid LOP Leaves */}
        <div className="p-4 rounded-2xl bg-white border border-[#E5EAF2] shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#8292AD] uppercase tracking-wider">Unpaid LOP Leaves</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-rose-700 mt-2">
            {summaryMetrics.totalUnpaidLeaves} Days
          </div>
          <div className="text-[11px] text-rose-600 font-semibold mt-0.5">
            -{formatCurrency(summaryMetrics.totalUnpaidDeduction)} deducted
          </div>
        </div>

        {/* Card 4: Total Statutory & Other Deductions */}
        <div className="p-4 rounded-2xl bg-white border border-[#E5EAF2] shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#8292AD] uppercase tracking-wider">Total Deductions</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-rose-700 mt-2">
            -{formatCurrency(summaryMetrics.totalDeductions)}
          </div>
          <div className="text-[10px] text-[#8292AD] font-semibold mt-0.5 truncate" title={`PF 24%: ${formatCurrency(summaryMetrics.totalPf)} | ESI 4%: ${formatCurrency(summaryMetrics.totalEsi)} | TDS: ${formatCurrency(summaryMetrics.totalTds)}`}>
            PF: {formatCurrency(summaryMetrics.totalPf)} • ESI: {formatCurrency(summaryMetrics.totalEsi)} • TDS: {formatCurrency(summaryMetrics.totalTds)}
          </div>
        </div>
      </div>

      {/* 3. View Switcher Tabs Bar */}
      <div className="flex items-center gap-2 border-b border-[#E5EAF2] pb-1 overflow-x-auto no-scrollbar">
        {[
          { id: 'payroll', label: 'Monthly Payroll Calculation', count: filteredPayroll.length, icon: Briefcase },
          { id: 'payslips', label: 'My Personal Payslips', count: finances?.payslips?.length || 4, icon: FileText },
          { id: 'expenses', label: 'Expense Claims', count: finances?.expenses?.length || 6, icon: Receipt },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-2xl whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#2563EB] text-white shadow-md shadow-blue-500/20'
                  : 'text-[#8292AD] hover:text-[#172033] hover:bg-white border border-transparent'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              <span
                className={`text-[9.5px] font-extrabold px-1.5 py-0.2 rounded-full leading-tight ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* VIEW 1: MONTHLY PAYROLL CALCULATION (CORE REQUIREMENT)                    */}
      {/* ========================================================================= */}
      {activeTab === 'payroll' && (
        <DataTable
          columns={payrollColumns}
          data={filteredPayroll}
          pageSize={8}
          entityName="employees"
          emptyMessage="No payroll records found"
          emptySubtext="Try selecting another month from the filter dropdown or adjusting your search."
          filterBar={
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3">
              {/* Left Side: Month Dropdown + Prev/Next Buttons + Search + Dept Filter */}
              <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-0">
                {/* 1. Month Selector Dropdown (with Prev / Next buttons) */}
                <div className="flex items-center gap-1 border border-[#BFDBFE] rounded-xl p-0.5 bg-[#EFF6FF] shadow-2xs">
                  <button
                    type="button"
                    onClick={handlePrevMonth}
                    title="Previous Month"
                    className="p-1.5 rounded-lg hover:bg-blue-100 text-[#2563EB] transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>

                  <div className="relative">
                    <select
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(e.target.value)}
                      className="appearance-none pl-7 pr-7 h-7 text-xs font-extrabold rounded-lg bg-transparent text-[#2563EB] focus:outline-none cursor-pointer"
                    >
                      {payrollMonthsList.map((m) => (
                        <option key={m.key} value={m.key} className="text-[#172033] font-semibold">
                          {m.label}
                        </option>
                      ))}
                    </select>
                    <Calendar className="w-3.5 h-3.5 text-[#2563EB] absolute left-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <ChevronDown className="w-3 h-3 text-[#2563EB] absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>

                  <button
                    type="button"
                    onClick={handleNextMonth}
                    title="Next Month"
                    className="p-1.5 rounded-lg hover:bg-blue-100 text-[#2563EB] transition-colors cursor-pointer"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* 2. Search Input */}
                <div className="w-56 sm:w-64 min-w-[210px] flex-shrink-0">
                  <SearchBar
                    value={searchQuery}
                    onChange={setSearchQuery}
                    onClear={() => setSearchQuery('')}
                    placeholder="Search Anuj, Ajay, Bharat, code..."
                  />
                </div>

                {/* 3. Status Filter */}
                <div className="relative min-w-[130px] flex-shrink-0">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full appearance-none pl-8 pr-8 h-9 text-xs font-semibold rounded-xl border border-[#E5EAF2] bg-white text-[#172033] hover:bg-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer shadow-2xs transition-colors"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Paid">Paid</option>
                    <option value="Processed">Processed</option>
                    <option value="Pending">Pending</option>
                  </select>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <ChevronDown className="w-3.5 h-3.5 text-[#8292AD] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                {/* Clear Filter Button */}
                {(searchQuery || statusFilter !== 'All') && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setStatusFilter('All');
                    }}
                    className="inline-flex items-center gap-1.5 px-3 h-9 text-xs font-semibold rounded-xl border border-rose-200 bg-rose-50/70 text-rose-700 hover:bg-rose-100 transition-colors shadow-2xs cursor-pointer flex-shrink-0"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Clear</span>
                  </button>
                )}
              </div>

              {/* Right Side: Refresh & Count Indicator */}
              <div className="flex items-center gap-2 text-xs text-[#8292AD] font-medium flex-shrink-0 select-none">
                <span>
                  Showing {filteredPayroll.length} of {payrollData.length} records
                </span>
                <button
                  onClick={loadData}
                  title="Recalculate and Refresh"
                  className="p-1 hover:bg-[#F8FAFC] rounded-lg transition-transform active:rotate-180 cursor-pointer"
                >
                  <RotateCw className="w-3.5 h-3.5 text-[#8292AD] hover:text-[#2563EB]" />
                </button>
              </div>
            </div>
          }
          actions={(row) => (
            <div className="inline-flex items-center justify-end gap-1.5">
              {/* View Payslip */}
              <button
                type="button"
                onClick={() => setSelectedPayslipRow(row)}
                title={`View ${row.name}'s Salary Slip`}
                className="w-7 h-7 rounded-full bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100 hover:scale-105 flex items-center justify-center transition-all shadow-2xs cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5 text-[#2563EB]" />
              </button>

              {/* Edit / Adjust Calculation */}
              <button
                type="button"
                onClick={() => handleOpenEdit(row)}
                title={`Adjust ${row.name}'s salary or deductions`}
                className="w-7 h-7 rounded-full bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100 hover:scale-105 flex items-center justify-center transition-all shadow-2xs cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>

              {/* Delete */}
              <button
                type="button"
                onClick={() => handleDeletePayroll(row)}
                title={`Remove ${row.name} from ${selectedMonth}`}
                className="w-7 h-7 rounded-full bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100 hover:scale-105 flex items-center justify-center transition-all shadow-2xs cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        />
      )}

      {/* ========================================================================= */}
      {/* VIEW 2: MY PERSONAL PAYSLIPS (PRESERVED PREVIOUS FEATURE)                 */}
      {/* ========================================================================= */}
      {activeTab === 'payslips' && finances && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {finances.payslips.map((slip) => (
              <div
                key={slip.id}
                className="p-5 rounded-2xl bg-white border border-[#E5EAF2] shadow-card hover:border-blue-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between pb-2 border-b border-[#F7F9FC]">
                    <span className="text-xs font-bold text-[#172033]">{slip.month}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {slip.status}
                    </span>
                  </div>
                  <div className="text-xl font-black text-emerald-700 mt-3">{slip.netSalary}</div>
                  <p className="text-[11px] text-[#8292AD] mt-1 font-mono">ID: {slip.id}</p>
                </div>

                <div className="pt-3 border-t border-[#E5EAF2] mt-4 flex items-center justify-between">
                  <span className="text-[10px] text-slate-500">{slip.paymentDate}</span>
                  <button
                    type="button"
                    onClick={() => {
                      addToast({
                        title: 'Downloading Payslip',
                        message: `Payslip for ${slip.month} downloaded.`,
                        type: 'success',
                      });
                    }}
                    className="p-1.5 rounded-lg border border-[#E5EAF2] text-slate-600 hover:bg-blue-50 hover:text-[#2563EB] cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 3: EXPENSE CLAIMS (PRESERVED PREVIOUS FEATURE)                       */}
      {activeTab === 'expenses' && finances && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {finances.expenses.map((exp) => (
              <div
                key={exp.id}
                className="p-4 rounded-2xl bg-white border border-[#E5EAF2] shadow-card flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                    <Receipt className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#172033]">{exp.merchant}</h4>
                    <span className="text-[10px] text-[#8292AD]">{exp.category}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-black text-[#172033]">{exp.amount}</span>
                  <span className="block text-[10px] font-bold text-amber-600">{exp.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODALS SECTION                                                           */}
      {/* ========================================================================= */}

      {/* Modal 1: Edit / Adjust Payroll Calculation Modal */}
      {editingPayrollRow && (
        <Modal
          isOpen={!!editingPayrollRow}
          onClose={() => setEditingPayrollRow(null)}
          title={`Adjust Payroll: ${editingPayrollRow.name}`}
          subtitle={`Calculation sheet for ${selectedMonth} (${daysInCurrentMonth} calendar days)`}
          maxWidth="max-w-xl"
        >
          <form onSubmit={handleSaveEditPayroll} className="space-y-4 text-xs">
            {/* Live Calculation Preview Banner */}
            {(() => {
              const preview = calculatePayrollRow(
                {
                  ...editingPayrollRow,
                  salary: Number(editForm.grossSalary ?? editForm.salary) || 0,
                  grossSalary: Number(editForm.grossSalary ?? editForm.salary) || 0,
                  baseSalary: Number(editForm.baseSalary) || Math.round((Number(editForm.grossSalary ?? editForm.salary) || 0) * 0.5),
                  leaveTaken: Number(editForm.leaveTaken) || 0,
                  bucketAvailable: Number(editForm.bucketAvailable) || 0,
                  pf: Number(editForm.pf),
                  esi: Number(editForm.esi),
                  tds: Number(editForm.tds) || 0,
                  otherDeduction: Number(editForm.otherDeduction) || 0,
                },
                daysInCurrentMonth
              );

              return (
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-50/80 via-indigo-50/40 to-slate-50 border border-blue-200">
                  <div className="flex items-center justify-between pb-2 border-b border-blue-100">
                    <span className="font-extrabold text-[#172033] text-xs">Live Calculation Preview</span>
                    <span className="text-base font-black text-emerald-700">
                      Net: {formatCurrency(preview.payable)}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-[10.5px] pt-2 text-[#172033]">
                    <div>
                      <span className="text-[#8292AD] block">Gross Salary:</span>
                      <strong className="font-bold">{formatCurrency(preview.grossSalary || preview.salary)}</strong>
                    </div>
                    <div>
                      <span className="text-[#8292AD] block">Base (50%):</span>
                      <strong className="text-blue-700 font-bold">{formatCurrency(preview.baseSalary)}</strong>
                    </div>
                    <div>
                      <span className="text-[#8292AD] block">Unpaid LOP:</span>
                      <strong className="text-rose-700 font-bold">{preview.unpaidLeave} Days</strong>
                    </div>
                    <div>
                      <span className="text-[#8292AD] block">PF (24% Base):</span>
                      <strong className="text-rose-700 font-bold">-{formatCurrency(preview.pf)}</strong>
                    </div>
                    <div>
                      <span className="text-[#8292AD] block">ESI (4% Base):</span>
                      <strong className="text-rose-700 font-bold">-{formatCurrency(preview.esi)}</strong>
                    </div>
                    <div>
                      <span className="text-[#8292AD] block">Net Payable:</span>
                      <strong className="text-emerald-700 font-black">{formatCurrency(preview.payable)}</strong>
                    </div>
                  </div>
                </div>
              );
            })()}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Option 1: Monthly Gross Salary */}
              <div>
                <label className="block text-xs font-bold text-[#172033] mb-1">
                  Monthly Gross Salary (₹) *
                </label>
                <input
                  type="number"
                  required
                  value={editForm.grossSalary ?? editForm.salary}
                  onChange={(e) => {
                    const gross = e.target.value;
                    const grossNum = Number(gross) || 0;
                    const baseNum = Math.round(grossNum * 0.5); // Base salary is 50% of gross salary
                    setEditForm({
                      ...editForm,
                      salary: gross,
                      grossSalary: gross,
                      baseSalary: baseNum,
                      pf: Math.round(baseNum * 0.24), // PF is 24% of Base Salary
                      esi: Math.round(baseNum * 0.04), // ESI is 4% of Base Salary
                    });
                  }}
                  className="w-full px-3 py-2 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:border-[#2563EB] font-bold text-[#172033]"
                />
              </div>

              {/* Option 2: Base Salary (50% of Gross Salary) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-[#172033]">
                    Base Salary (50% of Gross) (₹) *
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const grossNum = Number(editForm.grossSalary ?? editForm.salary) || 0;
                      const baseNum = Math.round(grossNum * 0.5);
                      setEditForm({
                        ...editForm,
                        baseSalary: baseNum,
                        pf: Math.round(baseNum * 0.24),
                        esi: Math.round(baseNum * 0.04),
                      });
                    }}
                    className="text-[10px] text-[#2563EB] font-bold hover:underline cursor-pointer"
                    title="Auto-calculate exact 50% of Gross Salary"
                  >
                    Auto 50%
                  </button>
                </div>
                <input
                  type="number"
                  required
                  value={editForm.baseSalary}
                  onChange={(e) => {
                    const base = e.target.value;
                    const baseNum = Number(base) || 0;
                    setEditForm({
                      ...editForm,
                      baseSalary: base,
                      pf: Math.round(baseNum * 0.24), // PF based on Base Salary
                      esi: Math.round(baseNum * 0.04), // ESI based on Base Salary
                    });
                  }}
                  className="w-full px-3 py-2 text-xs border border-blue-200 bg-blue-50/30 rounded-xl focus:outline-none focus:border-[#2563EB] font-bold text-blue-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#172033] mb-1">Payment Status</label>
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:border-[#2563EB] cursor-pointer"
                >
                  <option value="Paid">Paid</option>
                  <option value="Processed">Processed</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#172033] mb-1">Leaves Taken in {selectedMonth} *</label>
                <input
                  type="number"
                  min="0"
                  max="31"
                  required
                  value={editForm.leaveTaken}
                  onChange={(e) => setEditForm({ ...editForm, leaveTaken: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#172033] mb-1">Available Bucket Leaves *</label>
                <input
                  type="number"
                  min="0"
                  max="30"
                  required
                  value={editForm.bucketAvailable}
                  onChange={(e) => setEditForm({ ...editForm, bucketAvailable: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              {/* PF (24% of Base Salary) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-[#172033]">PF (24% of Base) (₹)</label>
                  <button
                    type="button"
                    onClick={() => {
                      const baseNum = Number(editForm.baseSalary) || Math.round((Number(editForm.grossSalary ?? editForm.salary) || 0) * 0.5);
                      setEditForm({ ...editForm, pf: Math.round(baseNum * 0.24) });
                    }}
                    className="text-[10px] text-[#2563EB] font-bold hover:underline cursor-pointer"
                    title="Calculate 24% of Base Salary"
                  >
                    Reset 24%
                  </button>
                </div>
                <input
                  type="number"
                  min="0"
                  value={editForm.pf}
                  onChange={(e) => setEditForm({ ...editForm, pf: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              {/* ESI (4% of Base Salary) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-[#172033]">ESI (4% of Base) (₹)</label>
                  <button
                    type="button"
                    onClick={() => {
                      const baseNum = Number(editForm.baseSalary) || Math.round((Number(editForm.grossSalary ?? editForm.salary) || 0) * 0.5);
                      setEditForm({ ...editForm, esi: Math.round(baseNum * 0.04) });
                    }}
                    className="text-[10px] text-[#2563EB] font-bold hover:underline cursor-pointer"
                    title="Calculate 4% of Base Salary"
                  >
                    Reset 4%
                  </button>
                </div>
                <input
                  type="number"
                  min="0"
                  value={editForm.esi}
                  onChange={(e) => setEditForm({ ...editForm, esi: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              {/* TDS (Manual Entry) */}
              <div>
                <label className="block text-xs font-bold text-[#172033] mb-1">TDS (Manual Entry) (₹)</label>
                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={editForm.tds}
                  onChange={(e) => setEditForm({ ...editForm, tds: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-rose-200 bg-rose-50/30 rounded-xl focus:outline-none focus:border-[#2563EB] font-semibold text-rose-700"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#172033] mb-1">Other Deductions (₹)</label>
                <input
                  type="number"
                  min="0"
                  value={editForm.otherDeduction}
                  onChange={(e) => setEditForm({ ...editForm, otherDeduction: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-[#172033] mb-1">Deduction Notes / Remarks</label>
                <input
                  type="text"
                  placeholder="e.g. PT + Advance Repayment"
                  value={editForm.deductionNotes}
                  onChange={(e) => setEditForm({ ...editForm, deductionNotes: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:border-[#2563EB]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2.5 pt-3 border-t border-[#E5EAF2]">
              <button
                type="button"
                onClick={() => setEditingPayrollRow(null)}
                className="px-4 py-2 text-xs font-semibold rounded-xl border border-[#E5EAF2] text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white shadow-sm cursor-pointer"
              >
                Save Calculation
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Modal 2: Employee Monthly Salary Slip Modal */}
      {selectedPayslipRow && (
        <Modal
          isOpen={!!selectedPayslipRow}
          onClose={() => setSelectedPayslipRow(null)}
          title={`Salary Slip: ${selectedPayslipRow.name}`}
          subtitle={`Pay Period: ${selectedMonth} • Disbursed ${selectedPayslipRow.paymentDate}`}
          maxWidth="max-w-lg"
        >
          <div className="space-y-4 text-xs">
            {/* Payslip Header Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50/70 to-indigo-50/30 border border-blue-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={selectedPayslipRow.avatar}
                  alt={selectedPayslipRow.name}
                  className="w-12 h-12 rounded-2xl object-cover ring-2 ring-white shadow-xs"
                />
                <div>
                  <h3 className="text-base font-extrabold text-[#172033]">{selectedPayslipRow.name}</h3>
                  <p className="text-[11px] text-[#8292AD] font-medium">
                    ID: <strong className="text-slate-800">{selectedPayslipRow.empCode}</strong>
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                {selectedPayslipRow.status}
              </span>
            </div>

            {/* Salary Breakdown Table */}
            <div className="border border-[#E5EAF2] rounded-2xl overflow-hidden divide-y divide-[#E5EAF2]">
              <div className="bg-slate-50/80 px-4 py-2 text-[11px] font-extrabold text-slate-700 uppercase tracking-wider flex justify-between">
                <span>Earnings Breakdown</span>
                <span>Amount (INR)</span>
              </div>
              <div className="p-3.5 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-600">Monthly Gross Salary</span>
                  <span className="font-bold text-[#172033]">{formatCurrency(selectedPayslipRow.grossSalary || selectedPayslipRow.salary)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Base Salary (50% of Gross)</span>
                  <span className="font-semibold text-blue-700">{formatCurrency(selectedPayslipRow.baseSalary || Math.round((selectedPayslipRow.grossSalary || selectedPayslipRow.salary) * 0.5))}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Allowances & Special Components</span>
                  <span className="font-semibold text-slate-700">
                    {formatCurrency((selectedPayslipRow.grossSalary || selectedPayslipRow.salary) - (selectedPayslipRow.baseSalary || Math.round((selectedPayslipRow.grossSalary || selectedPayslipRow.salary) * 0.5)))}
                  </span>
                </div>
              </div>

              <div className="bg-slate-50/80 px-4 py-2 text-[11px] font-extrabold text-slate-700 uppercase tracking-wider flex justify-between">
                <span>Leaves & Deductions</span>
                <span>Amount (INR)</span>
              </div>
              <div className="p-3.5 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-600">
                    Loss of Pay ({selectedPayslipRow.unpaidLeave} Unpaid Days / {daysInCurrentMonth} days)
                  </span>
                  <span className="font-bold text-rose-700">
                    -{formatCurrency(selectedPayslipRow.unpaidDeductionAmount)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Provident Fund (PF 24% of Base)</span>
                  <span className="font-bold text-rose-700">
                    -{formatCurrency(selectedPayslipRow.pf)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Employee State Insurance (ESI 4% of Base)</span>
                  <span className="font-bold text-rose-700">
                    -{formatCurrency(selectedPayslipRow.esi)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Tax Deducted at Source (TDS)</span>
                  <span className="font-bold text-rose-700">
                    -{formatCurrency(selectedPayslipRow.tds || 0)}
                  </span>
                </div>
                {Number(selectedPayslipRow.otherDeduction) > 0 && (
                  <div className="flex justify-between">
                    <span className="text-slate-600">
                      Other Deductions ({selectedPayslipRow.deductionNotes || 'Misc'})
                    </span>
                    <span className="font-bold text-rose-700">
                      -{formatCurrency(selectedPayslipRow.otherDeduction)}
                    </span>
                  </div>
                )}
              </div>

              {/* Net Pay Total Banner */}
              <div className="p-4 bg-emerald-50/60 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-extrabold text-emerald-900 block">Net Payable Salary</span>
                  <span className="text-xs text-emerald-700">Disbursed via Corporate Transfer</span>
                </div>
                <span className="text-2xl font-black text-emerald-800">
                  {formatCurrency(selectedPayslipRow.payable)}
                </span>
              </div>
            </div>

            {/* Leave Bucket Balance Status */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-700 text-[11px] flex items-center justify-between">
              <span>Paid Leave Bucket Remaining for Next Month:</span>
              <strong className="text-teal-700 font-bold">{selectedPayslipRow.newBucket} Days</strong>
            </div>

            <div className="flex justify-end gap-2.5 pt-2 border-t border-[#E5EAF2]">
              <button
                type="button"
                onClick={() => {
                  addToast({
                    title: 'Printing Payslip',
                    message: `Sending payslip for ${selectedPayslipRow.name} to printer.`,
                    type: 'info',
                  });
                }}
                className="px-3.5 py-1.5 rounded-xl border border-[#E5EAF2] text-slate-700 font-bold flex items-center gap-1.5 hover:bg-slate-50 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedPayslipRow(null)}
                className="px-4 py-1.5 rounded-xl bg-[#2563EB] text-white font-bold hover:bg-blue-700 cursor-pointer shadow-sm"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal 3: Add Employee to Monthly Payroll */}
      {showAddPayrollModal && (
        <Modal
          isOpen={showAddPayrollModal}
          onClose={() => setShowAddPayrollModal(false)}
          title={`Add Employee to ${selectedMonth} Payroll`}
          subtitle="Configure salary, leave bucket, and deduction metrics"
          maxWidth="max-w-xl"
        >
          <form onSubmit={handleSaveAddPayroll} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-[#172033] mb-1">Employee Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bharat Kumar"
                  value={addForm.name}
                  onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#172033] mb-1">Employee Code</label>
                <input
                  type="text"
                  placeholder="e.g. CFT-101"
                  value={addForm.empCode}
                  onChange={(e) => setAddForm({ ...addForm, empCode: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#172033] mb-1">Monthly Gross Salary (₹) *</label>
                <input
                  type="number"
                  required
                  value={addForm.grossSalary ?? addForm.salary}
                  onChange={(e) => {
                    const gross = e.target.value;
                    const grossNum = Number(gross) || 0;
                    const baseNum = Math.round(grossNum * 0.5);
                    setAddForm({
                      ...addForm,
                      salary: gross,
                      grossSalary: gross,
                      baseSalary: baseNum,
                      pf: Math.round(baseNum * 0.24),
                      esi: Math.round(baseNum * 0.04),
                    });
                  }}
                  className="w-full px-3 py-2 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:border-[#2563EB] font-bold text-[#172033]"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-[#172033]">Base Salary (50% of Gross) (₹) *</label>
                  <button
                    type="button"
                    onClick={() => {
                      const grossNum = Number(addForm.grossSalary ?? addForm.salary) || 0;
                      const baseNum = Math.round(grossNum * 0.5);
                      setAddForm({
                        ...addForm,
                        baseSalary: baseNum,
                        pf: Math.round(baseNum * 0.24),
                        esi: Math.round(baseNum * 0.04),
                      });
                    }}
                    className="text-[10px] text-[#2563EB] font-bold hover:underline cursor-pointer"
                  >
                    Auto 50%
                  </button>
                </div>
                <input
                  type="number"
                  required
                  value={addForm.baseSalary}
                  onChange={(e) => {
                    const base = e.target.value;
                    const baseNum = Number(base) || 0;
                    setAddForm({
                      ...addForm,
                      baseSalary: base,
                      pf: Math.round(baseNum * 0.24),
                      esi: Math.round(baseNum * 0.04),
                    });
                  }}
                  className="w-full px-3 py-2 text-xs border border-blue-200 bg-blue-50/30 rounded-xl focus:outline-none focus:border-[#2563EB] font-bold text-blue-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#172033] mb-1">Leaves Taken</label>
                <input
                  type="number"
                  min="0"
                  value={addForm.leaveTaken}
                  onChange={(e) => setAddForm({ ...addForm, leaveTaken: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#172033] mb-1">Available Bucket Leaves</label>
                <input
                  type="number"
                  min="0"
                  value={addForm.bucketAvailable}
                  onChange={(e) => setAddForm({ ...addForm, bucketAvailable: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              {/* PF (24% of Base) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-[#172033]">PF (24% of Base) (₹)</label>
                  <button
                    type="button"
                    onClick={() => {
                      const baseNum = Number(addForm.baseSalary) || Math.round((Number(addForm.grossSalary ?? addForm.salary) || 0) * 0.5);
                      setAddForm({ ...addForm, pf: Math.round(baseNum * 0.24) });
                    }}
                    className="text-[10px] text-[#2563EB] font-bold hover:underline cursor-pointer"
                  >
                    Reset 24%
                  </button>
                </div>
                <input
                  type="number"
                  min="0"
                  value={addForm.pf}
                  onChange={(e) => setAddForm({ ...addForm, pf: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              {/* ESI (4% of Base) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-[#172033]">ESI (4% of Base) (₹)</label>
                  <button
                    type="button"
                    onClick={() => {
                      const baseNum = Number(addForm.baseSalary) || Math.round((Number(addForm.grossSalary ?? addForm.salary) || 0) * 0.5);
                      setAddForm({ ...addForm, esi: Math.round(baseNum * 0.04) });
                    }}
                    className="text-[10px] text-[#2563EB] font-bold hover:underline cursor-pointer"
                  >
                    Reset 4%
                  </button>
                </div>
                <input
                  type="number"
                  min="0"
                  value={addForm.esi}
                  onChange={(e) => setAddForm({ ...addForm, esi: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              {/* TDS (Manual Entry) */}
              <div>
                <label className="block text-xs font-bold text-[#172033] mb-1">TDS (Manual Entry) (₹)</label>
                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={addForm.tds}
                  onChange={(e) => setAddForm({ ...addForm, tds: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-rose-200 bg-rose-50/30 rounded-xl focus:outline-none focus:border-[#2563EB] font-semibold text-rose-700"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#172033] mb-1">Other Deductions (₹)</label>
                <input
                  type="number"
                  min="0"
                  value={addForm.otherDeduction}
                  onChange={(e) => setAddForm({ ...addForm, otherDeduction: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-[#172033] mb-1">Deduction Description</label>
                <input
                  type="text"
                  value={addForm.deductionNotes}
                  onChange={(e) => setAddForm({ ...addForm, deductionNotes: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:border-[#2563EB]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2.5 pt-3 border-t border-[#E5EAF2]">
              <button
                type="button"
                onClick={() => setShowAddPayrollModal(false)}
                className="px-4 py-2 text-xs font-semibold rounded-xl border border-[#E5EAF2] text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white shadow-sm cursor-pointer"
              >
                Add to Payroll
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Modal 4: Expense Claim Modal */}
      {showExpenseModal && (
        <Modal
          isOpen={showExpenseModal}
          onClose={() => setShowExpenseModal(false)}
          title="Submit Expense Claim"
          subtitle="File receipt for corporate reimbursement"
          maxWidth="max-w-md"
        >
          <form onSubmit={handleCreateExpense} className="space-y-4 text-xs">
            <div>
              <label className="block text-xs font-bold text-[#172033] mb-1">Merchant / Vendor *</label>
              <input
                type="text"
                required
                placeholder="e.g. Apple Store / WeWork"
                value={expenseForm.merchant}
                onChange={(e) => setExpenseForm({ ...expenseForm, merchant: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:border-[#2563EB]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#172033] mb-1">Expense Amount (₹) *</label>
              <input
                type="number"
                required
                placeholder="1500"
                value={expenseForm.amount}
                onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:border-[#2563EB]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#172033] mb-1">Category</label>
              <select
                value={expenseForm.category}
                onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:border-[#2563EB] cursor-pointer"
              >
                <option value="Home Office Setup">Home Office Setup</option>
                <option value="Travel & Logistics">Travel & Logistics</option>
                <option value="Client Entertainment">Client Entertainment</option>
                <option value="Software & Subscriptions">Software & Subscriptions</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#172033] mb-1">Notes & Justification</label>
              <textarea
                rows={2}
                value={expenseForm.notes}
                onChange={(e) => setExpenseForm({ ...expenseForm, notes: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:border-[#2563EB]"
              />
            </div>

            <div className="flex justify-end gap-2.5 pt-3 border-t border-[#E5EAF2]">
              <button
                type="button"
                onClick={() => setShowExpenseModal(false)}
                className="px-4 py-2 text-xs font-semibold rounded-xl border border-[#E5EAF2] text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white shadow-sm cursor-pointer"
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
