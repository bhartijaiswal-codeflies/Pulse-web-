import React, { useState, useEffect } from 'react';
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
} from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { StatsCard } from '../components/dashboard/StatsCard';
import { DataTable } from '../components/common/DataTable';
import { StatusBadge } from '../components/common/StatusBadge';
import { Modal } from '../components/common/Modal';
import { financeService } from '../services/financeService';
import { useToast } from '../context/NotificationContext';

export const MyFinances = () => {
  const [finances, setFinances] = useState(null);
  const [activeTab, setActiveTab] = useState('payslips'); // 'payslips' or 'expenses'
  const [showExpenseModal, setShowExpenseModal] = useState(false);
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
      message: `Claim for $${parseFloat(amount).toFixed(2)} at ${merchant.trim()} queued for Finance approval.`,
      type: 'success',
    });

    loadFinances();
    setShowExpenseModal(false);
    setMerchant('');
    setAmount('');
    setNotes('');
  };

  if (!finances) return null;

  const payslipColumns = [
    {
      header: 'Pay Period',
      accessor: 'month',
      render: (row) => (
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#2563EB] flex items-center justify-center font-bold text-xs">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-[#172033]">{row.month}</div>
            <div className="text-[11px] text-[#8292AD]">{row.payPeriod}</div>
          </div>
        </div>
      ),
    },
    {
      header: 'Basic Pay',
      accessor: 'basicPay',
      render: (row) => <span className="text-xs font-medium text-[#172033]">{row.basicPay}</span>,
    },
    {
      header: 'Allowances',
      accessor: 'allowances',
      render: (row) => <span className="text-xs font-medium text-emerald-600">+{row.allowances}</span>,
    },
    {
      header: 'Deductions (Tax+PF)',
      accessor: 'taxDeduction',
      render: (row) => (
        <span className="text-xs font-medium text-rose-600">
          -{row.taxDeduction}
        </span>
      ),
    },
    {
      header: 'Net Disbursed',
      accessor: 'netSalary',
      render: (row) => (
        <span className="text-xs font-bold text-[#172033]">
          {row.netSalary}
        </span>
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      align: 'center',
      render: (row) => <StatusBadge status={row.status} size="sm" />,
    },
  ];

  const expenseColumns = [
    {
      header: 'Expense ID / Date',
      accessor: 'id',
      render: (row) => (
        <div>
          <div className="font-bold text-[#172033]">{row.id}</div>
          <div className="text-[11px] text-[#8292AD]">{row.date}</div>
        </div>
      ),
    },
    {
      header: 'Category',
      accessor: 'category',
      render: (row) => (
        <span className="text-xs font-semibold text-[#172033] px-2 py-0.5 rounded-md bg-[#F7F9FC] border border-[#E5EAF2]">
          {row.category}
        </span>
      ),
    },
    {
      header: 'Merchant / Description',
      accessor: 'merchant',
      render: (row) => <span className="text-xs text-[#4E5D78]">{row.merchant}</span>,
    },
    {
      header: 'Claim Amount',
      accessor: 'amount',
      render: (row) => (
        <span className="text-xs font-bold text-[#172033]">
          {row.amount}
        </span>
      ),
    },
    {
      header: 'Approval Status',
      accessor: 'status',
      align: 'center',
      render: (row) => <StatusBadge status={row.status} size="sm" />,
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
            className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white shadow-sm transition-all active:scale-95 shadow-blue-500/20"
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

      {/* Tabs */}
      <div className="flex items-center justify-between border-b border-[#E5EAF2] pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('payslips')}
            className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all ${
              activeTab === 'payslips'
                ? 'bg-[#2563EB] text-white shadow-sm'
                : 'text-[#8292AD] hover:text-[#172033] hover:bg-white'
            }`}
          >
            Monthly Payslips ({finances.payslips.length})
          </button>
          <button
            onClick={() => setActiveTab('expenses')}
            className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all ${
              activeTab === 'expenses'
                ? 'bg-[#2563EB] text-white shadow-sm'
                : 'text-[#8292AD] hover:text-[#172033] hover:bg-white'
            }`}
          >
            Expense Claims ({finances.expenses.length})
          </button>
        </div>
      </div>

      {/* Table Content */}
      {activeTab === 'payslips' ? (
        <DataTable
          columns={payslipColumns}
          data={finances.payslips}
          pageSize={6}
          actions={(row) => (
            <button
              onClick={() => handleDownloadPayslip(row)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg text-[#2563EB] bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>
          )}
        />
      ) : (
        <DataTable
          columns={expenseColumns}
          data={finances.expenses}
          pageSize={6}
          actions={(row) => (
            <button
              onClick={() =>
                addToast({
                  title: 'Expense Receipt View',
                  message: `Receipt receipt for ${row.id} loaded.`,
                  type: 'info',
                })
              }
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg text-[#172033] bg-[#F7F9FC] hover:bg-slate-200 border border-[#E5EAF2] transition-colors"
            >
              <FileText className="w-3.5 h-3.5 text-[#8292AD]" />
              <span>Receipt</span>
            </button>
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
                className="px-4 py-2 text-xs rounded-xl border border-[#E5EAF2] text-[#8292AD] hover:bg-[#F7F9FC]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-semibold rounded-xl bg-[#2563EB] text-white hover:bg-blue-700 shadow-sm"
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

