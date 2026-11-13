import { financesData } from '../data/mockData';

const FINANCES_KEY = 'pulse_finances';
const PAYROLL_KEY = 'pulse_monthly_payroll_directory_v3';

// Month helper: days in month
export const getDaysInMonth = (monthKey) => {
  // monthKey format e.g. "Jan 2026", "2026-01"
  const months = {
    Jan: 31, Feb: 28, Mar: 31, Apr: 30, May: 31, Jun: 30,
    Jul: 31, Aug: 31, Sep: 30, Oct: 31, Nov: 30, Dec: 31,
  };
  const prefix = monthKey.slice(0, 3);
  return months[prefix] || 30;
};

// Available months list for dropdown
export const payrollMonthsList = [
  { key: 'Nov 2026', label: 'November 2026 (Current)', days: 30 },
  { key: 'Oct 2026', label: 'October 2026', days: 31 },
  { key: 'Sep 2026', label: 'September 2026', days: 30 },
  { key: 'Aug 2026', label: 'August 2026', days: 31 },
  { key: 'Jul 2026', label: 'July 2026', days: 31 },
  { key: 'Jun 2026', label: 'June 2026', days: 30 },
  { key: 'May 2026', label: 'May 2026', days: 31 },
  { key: 'Apr 2026', label: 'April 2026', days: 30 },
  { key: 'Mar 2026', label: 'March 2026', days: 31 },
  { key: 'Feb 2026', label: 'February 2026', days: 28 },
  { key: 'Jan 2026', label: 'January 2026', days: 31 },
  { key: 'Dec 2025', label: 'December 2025', days: 31 },
  { key: 'Nov 2025', label: 'November 2025', days: 30 },
  { key: 'Oct 2025', label: 'October 2025', days: 31 },
];

// Initial January 2026 baseline matching the handwritten user sheet
const initialJan2026Payroll = [
  {
    id: 'EMP-ANUJ',
    name: 'Anuj',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    empCode: 'CFT-088',
    department: 'Engineering',
    designation: 'Software Developer',
    salary: 10000,
    grossSalary: 10000,
    baseSalary: 5000,
    leaveTaken: 2,
    bucketAvailable: 3,
    unpaidLeave: 0,
    newBucket: 1,
    pf: 1200, // 24% of Base Salary (₹5,000)
    esi: 200, // 4% of Base Salary (₹5,000)
    tds: 0,
    otherDeduction: 200,
    deductionNotes: 'Professional Tax (₹200)',
    status: 'Paid',
    paymentDate: '31 Jan, 2026',
    remarks: 'Salary processed on time via Direct Bank Transfer',
  },
  {
    id: 'EMP-AJAY',
    name: 'Ajay',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80',
    empCode: 'CFT-092',
    department: 'Web Design',
    designation: 'UI/UX Designer',
    salary: 35000,
    grossSalary: 35000,
    baseSalary: 17500,
    leaveTaken: 1,
    bucketAvailable: 2,
    unpaidLeave: 0,
    newBucket: 1,
    pf: 4200, // 24% of Base Salary (₹17,500)
    esi: 700, // 4% of Base Salary (₹17,500)
    tds: 1000,
    otherDeduction: 200,
    deductionNotes: 'PF + Professional Tax (₹200)',
    status: 'Paid',
    paymentDate: '31 Jan, 2026',
    remarks: 'Disbursed via HDFC Corporate',
  },
  {
    id: 'EMP-BHARAT',
    name: 'Bharat',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    empCode: 'CFT-095',
    department: 'Frontend Tech',
    designation: 'Senior Frontend Engineer',
    salary: 45000,
    grossSalary: 45000,
    baseSalary: 22500,
    leaveTaken: 4,
    bucketAvailable: 2,
    unpaidLeave: 2,
    newBucket: 0,
    pf: 5400, // 24% of Base Salary (₹22,500)
    esi: 900, // 4% of Base Salary (₹22,500)
    tds: 1500,
    otherDeduction: 200,
    deductionNotes: 'PT (₹200)',
    status: 'Paid',
    paymentDate: '31 Jan, 2026',
    remarks: '2 LOP days deducted',
  },
  {
    id: 'PLS-10024',
    name: 'Saurabh H.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    empCode: 'CFT0010024',
    department: 'People Operations',
    designation: 'Senior HR Manager',
    salary: 40000,
    leaveTaken: 1,
    bucketAvailable: 2,
    unpaidLeave: 0,
    newBucket: 1,
    otherDeduction: 2800,
    deductionNotes: 'Standard PF + Health Benefit Copay',
    payable: 37200,
    status: 'Paid',
    paymentDate: '31 Jan, 2026',
    remarks: 'Paid via ICICI Direct',
  },
  {
    id: 'PLS-1049',
    name: 'Elena Rostova',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    empCode: 'CFT001049',
    department: 'Engineering',
    designation: 'Lead Backend Architect',
    salary: 85000,
    leaveTaken: 3,
    bucketAvailable: 5,
    unpaidLeave: 0,
    newBucket: 2,
    otherDeduction: 5600,
    deductionNotes: 'TDS (₹3,500) + PF (₹2,100)',
    payable: 79400,
    status: 'Paid',
    paymentDate: '31 Jan, 2026',
    remarks: 'Paid on time',
  },
  {
    id: 'PLS-1021',
    name: 'Marcus Vance',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    empCode: 'CFT001021',
    department: 'Product Design',
    designation: 'Staff UX Researcher',
    salary: 52000,
    leaveTaken: 3,
    bucketAvailable: 1,
    unpaidLeave: 2,
    newBucket: 0,
    otherDeduction: 3800,
    deductionNotes: 'TDS (₹2,000) + PF (₹1,800)',
    payable: 44845,
    status: 'Paid',
    paymentDate: '31 Jan, 2026',
    remarks: '2 Unpaid Sick leaves deducted',
  },
  {
    id: 'PLS-1088',
    name: 'Aisha Al-Mansoor',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
    empCode: 'CFT001088',
    department: 'Marketing',
    designation: 'VP Brand & Communications',
    salary: 60000,
    leaveTaken: 2,
    bucketAvailable: 3,
    unpaidLeave: 0,
    newBucket: 1,
    otherDeduction: 4200,
    deductionNotes: 'Statutory PF & PT',
    payable: 55800,
    status: 'Paid',
    paymentDate: '31 Jan, 2026',
    remarks: 'Processed',
  },
  {
    id: 'PLS-1015',
    name: 'David Chen',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
    empCode: 'CFT001015',
    department: 'Data & Analytics',
    designation: 'Principal Data Scientist',
    salary: 70000,
    leaveTaken: 0,
    bucketAvailable: 4,
    unpaidLeave: 0,
    newBucket: 4,
    otherDeduction: 4900,
    deductionNotes: 'TDS (₹2,800) + PF (₹2,100)',
    payable: 65100,
    status: 'Paid',
    paymentDate: '31 Jan, 2026',
    remarks: '100% Attendance Bonus Qualified',
  },
  {
    id: 'PLS-1033',
    name: 'Sarah Connor',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80',
    empCode: 'CFT001033',
    department: 'People Operations',
    designation: 'Director of HR & Culture',
    salary: 65000,
    leaveTaken: 1,
    bucketAvailable: 2,
    unpaidLeave: 0,
    newBucket: 1,
    otherDeduction: 4500,
    deductionNotes: 'Standard Deductions',
    payable: 60500,
    status: 'Paid',
    paymentDate: '31 Jan, 2026',
    remarks: 'Processed',
  },
  {
    id: 'PLS-1092',
    name: 'Liam Gallagher',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80',
    empCode: 'CFT001092',
    department: 'Security & QA',
    designation: 'Lead QA Engineer',
    salary: 48000,
    leaveTaken: 2,
    bucketAvailable: 2,
    unpaidLeave: 0,
    newBucket: 0,
    otherDeduction: 3300,
    deductionNotes: 'PF (₹3,100) + PT (₹200)',
    payable: 44700,
    status: 'Paid',
    paymentDate: '31 Jan, 2026',
    remarks: 'Full Paid Bucket consumed',
  },
];

// Helper to calculate exact row numbers
export const calculatePayrollRow = (row, daysInMonth = 30) => {
  const grossSalary = Number(row.grossSalary !== undefined && row.grossSalary !== null ? row.grossSalary : row.salary) || 0;
  const baseSalary = Number(row.baseSalary !== undefined && row.baseSalary !== null ? row.baseSalary : Math.round(grossSalary * 0.5)) || 0;
  const leaveTaken = Number(row.leaveTaken) || 0;
  const bucketAvailable = Number(row.bucketAvailable) || 0;
  const otherDeduction = Number(row.otherDeduction) || 0;

  // 3 Statutory & Tax Columns (PF & ESI based on Base Salary as 50% of Gross):
  // 1. PF (24% of Base Salary)
  // 2. ESI (4% of Base Salary)
  // 3. TDS (Manual entry)
  const oldGrossPf = Math.round(grossSalary * 0.24);
  const oldGrossEsi = Math.round(grossSalary * 0.04);
  const pf = (row.pf !== undefined && row.pf !== null && row.pf !== oldGrossPf)
    ? Number(row.pf)
    : Math.round(baseSalary * 0.24);
  const esi = (row.esi !== undefined && row.esi !== null && row.esi !== oldGrossEsi)
    ? Number(row.esi)
    : Math.round(baseSalary * 0.04);
  const tds = Number(row.tds) || 0;

  let unpaidLeave = 0;
  let newBucket = 0;

  if (leaveTaken > bucketAvailable) {
    unpaidLeave = leaveTaken - bucketAvailable;
    newBucket = 0;
  } else {
    unpaidLeave = 0;
    newBucket = bucketAvailable - leaveTaken;
  }

  // Calculate unpaid leave deduction (Loss of Pay based on Gross Salary)
  const perDaySalary = daysInMonth > 0 ? grossSalary / daysInMonth : 0;
  const unpaidDeductionAmount = Math.round(unpaidLeave * perDaySalary);

  // Total deductions: Unpaid Leave LOP + PF (24% of Base) + ESI (4% of Base) + TDS (Manual) + Other Deductions
  const totalDeductions = unpaidDeductionAmount + pf + esi + tds + otherDeduction;

  // Net payable
  const payable = Math.max(0, Math.round(grossSalary - totalDeductions));

  return {
    ...row,
    salary: grossSalary,
    grossSalary,
    baseSalary,
    leaveTaken,
    bucketAvailable,
    unpaidLeave,
    newBucket,
    pf,
    esi,
    tds,
    otherDeduction,
    unpaidDeductionAmount,
    totalDeductions,
    payable,
  };
};

export const financeService = {
  // Existing payslips and expenses
  getFinances: () => {
    const saved = localStorage.getItem(FINANCES_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    localStorage.setItem(FINANCES_KEY, JSON.stringify(financesData));
    return financesData;
  },

  addExpense: (expense) => {
    const data = financeService.getFinances();
    const newExpense = {
      ...expense,
      id: `EXP-${Math.floor(400 + Math.random() * 500)}`,
      date: 'Today',
      status: 'Processing',
      receiptUrl: '#',
    };
    const updated = {
      ...data,
      expenses: [newExpense, ...data.expenses],
    };
    localStorage.setItem(FINANCES_KEY, JSON.stringify(updated));
    return updated;
  },

  // --- MONTHLY PAYROLL DIRECTORY ---
  getAllMonthlyPayrolls: () => {
    const saved = localStorage.getItem(PAYROLL_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') return parsed;
      } catch (e) {
        console.error(e);
      }
    }

    // Default payroll record dictionary keyed by month
    const initialDirectory = {
      'Jan 2026': initialJan2026Payroll,
      'Nov 2026': initialJan2026Payroll.map((emp) => ({
        ...emp,
        leaveTaken: Math.max(0, emp.leaveTaken - 1),
        bucketAvailable: emp.bucketAvailable + 1,
        status: 'Processed',
        paymentDate: '30 Nov, 2026',
      })),
      'Oct 2026': initialJan2026Payroll.map((emp) => ({
        ...emp,
        status: 'Paid',
        paymentDate: '31 Oct, 2026',
      })),
      'Dec 2025': initialJan2026Payroll.map((emp) => ({
        ...emp,
        status: 'Paid',
        paymentDate: '31 Dec, 2025',
      })),
    };

    localStorage.setItem(PAYROLL_KEY, JSON.stringify(initialDirectory));
    return initialDirectory;
  },

  getMonthlyPayroll: (monthKey = 'Jan 2026') => {
    const all = financeService.getAllMonthlyPayrolls();
    const daysInMonth = getDaysInMonth(monthKey);

    // If month exists in store, return calculated rows
    if (all[monthKey] && Array.isArray(all[monthKey])) {
      return all[monthKey].map((row) => calculatePayrollRow(row, daysInMonth));
    }

    // Otherwise generate baseline from Jan 2026 with month adjustments
    const base = initialJan2026Payroll.map((emp) => {
      const row = {
        ...emp,
        id: `${emp.id}-${monthKey.replace(/\s+/g, '-')}`,
        status: monthKey.includes('2026') && monthKey.includes('Nov') ? 'Processed' : 'Paid',
        paymentDate: `28 ${monthKey}`,
      };
      return calculatePayrollRow(row, daysInMonth);
    });

    // Save newly generated month to cache
    all[monthKey] = base;
    localStorage.setItem(PAYROLL_KEY, JSON.stringify(all));
    return base;
  },

  updatePayrollEntry: (monthKey, employeeId, updates) => {
    const all = financeService.getAllMonthlyPayrolls();
    const daysInMonth = getDaysInMonth(monthKey);
    const monthList = all[monthKey] || financeService.getMonthlyPayroll(monthKey);

    const updatedList = monthList.map((row) => {
      if (row.id === employeeId || row.empCode === employeeId) {
        const merged = { ...row, ...updates };
        return calculatePayrollRow(merged, daysInMonth);
      }
      return row;
    });

    all[monthKey] = updatedList;
    localStorage.setItem(PAYROLL_KEY, JSON.stringify(all));
    return updatedList;
  },

  addPayrollEntry: (monthKey, entry) => {
    const all = financeService.getAllMonthlyPayrolls();
    const daysInMonth = getDaysInMonth(monthKey);
    const monthList = all[monthKey] || financeService.getMonthlyPayroll(monthKey);

    const calculated = calculatePayrollRow(entry, daysInMonth);
    const updatedList = [calculated, ...monthList];

    all[monthKey] = updatedList;
    localStorage.setItem(PAYROLL_KEY, JSON.stringify(all));
    return updatedList;
  },

  deletePayrollEntry: (monthKey, employeeId) => {
    const all = financeService.getAllMonthlyPayrolls();
    const monthList = all[monthKey] || financeService.getMonthlyPayroll(monthKey);
    const updatedList = monthList.filter((row) => row.id !== employeeId && row.empCode !== employeeId);

    all[monthKey] = updatedList;
    localStorage.setItem(PAYROLL_KEY, JSON.stringify(all));
    return updatedList;
  },
};
