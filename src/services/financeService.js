import { financesData } from '../data/mockData';

const FINANCES_KEY = 'pulse_finances';

export const financeService = {
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
};
