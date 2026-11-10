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
  Check,
  X,
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
      header: 'PAY PERIOD',
      accessor: 'month',
      render: (row) => (
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#2563EB] flex items-center justify-center font-bold text-xs">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-[#172033] text-xs">{row.month}</div>
            <div className="text-[10px] text-[#8292AD] font-medium">{row.payPeriod}</div>
          </div>
        </div>
      ),
    },
    {
      header: 'BASIC PAY',
      accessor: 'basicPay',
      render: (row) => <span className="text-xs font-bold text-[#172033]">{row.basicPay}</span>,
    },
    {
      header: 'ALLOWANCES',
      accessor: 'allowances',
      render: (row) => <span className="text-xs font-bold text-emerald-600">+{row.allowances}</span>,
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
      header: 'OPTIONS',
      accessor: 'status',
      align: 'center',
      render: (row) => <StatusBadge status={row.status} size="xs" showChevron={true} />,
    },
  ];

  const expenseColumns = [
    {
      header: 'EXPENSE ID / DATE',
      accessor: 'id',
      render: (row) => (
        <div>
          <div className="font-bold text-[#172033] text-xs">{row.id}</div>
          <div className="text-[10px] text-[#8292AD] font-medium">{row.date}</div>
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
      render: (row) => <span className="text-xs text-[#4E5D78] font-medium">{row.merchant}</span>,
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
      header: 'OPTIONS',
      accessor: 'status',
      align: 'center',
      render: (row) => <StatusBadge status={row.status} size="xs" showChevron={true} />,
    },
  ];

  const financeTabs = [
    {
      id: 'payslips',
      label: 'Monthly Payslips',
      count: finances.payslips.length,
      icon: <FileText className="w-3 h-3 text-[#2563EB]" />,
    },
    {
      id: 'expenses',
      label: 'Expense Claims',
      count: finances.expenses.length,
      icon: <Receipt className="w-3 h-3 text-purple-600" />,
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

      {/* Table Content with Tab Pills & Pagination matching Reference Image */}
      {activeTab === 'payslips' ? (
        <DataTable
          columns={payslipColumns}
          data={finances.payslips}
          pageSize={6}
          tabs={financeTabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          entityName="statements"
          actions={(row) => (
            <div className="inline-flex items-center justify-end gap-1.5">
              <button
                onClick={() => handleDownloadPayslip(row)}
                title="Download Payslip PDF"
                className="w-6 h-6 rounded-full bg-blue-50 text-[#2563EB] border border-blue-200 flex items-center justify-center hover:bg-blue-100 hover:scale-105 transition-all shadow-2xs"
              >
                <Download className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        />
      ) : (
        <DataTable
          columns={expenseColumns}
          data={finances.expenses}
          pageSize={6}
          tabs={financeTabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          entityName="claims"
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
                className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center hover:bg-emerald-100 hover:scale-105 transition-all shadow-2xs"
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
                className="w-6 h-6 rounded-full bg-rose-50 text-rose-500 border border-rose-200 flex items-center justify-center hover:bg-rose-100 hover:scale-105 transition-all shadow-2xs"
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

