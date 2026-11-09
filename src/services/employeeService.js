import { employeesData, initialLeaveRequests, initialChecklist, recentActivities } from '../data/mockData';

const EMPLOYEES_KEY = 'pulse_employees';
const LEAVES_KEY = 'pulse_leave_requests';
const CHECKLIST_KEY = 'pulse_checklist';
const ACTIVITIES_KEY = 'pulse_activities';

export const employeeService = {
  getEmployees: () => {
    const saved = localStorage.getItem(EMPLOYEES_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    localStorage.setItem(EMPLOYEES_KEY, JSON.stringify(employeesData));
    return employeesData;
  },

  addEmployee: (employee) => {
    const current = employeeService.getEmployees();
    const newEmp = {
      ...employee,
      id: `PLS-${Math.floor(1000 + Math.random() * 9000)}`,
      status: employee.status || 'Active',
      avatar: employee.avatar || `https://images.unsplash.com/photo-${1534528741775 + Math.floor(Math.random() * 1000)}?auto=format&fit=crop&w=150&q=80`,
    };
    const updated = [newEmp, ...current];
    localStorage.setItem(EMPLOYEES_KEY, JSON.stringify(updated));
    return newEmp;
  },

  updateEmployee: (id, updates) => {
    const current = employeeService.getEmployees();
    const updated = current.map((emp) => (emp.id === id ? { ...emp, ...updates } : emp));
    localStorage.setItem(EMPLOYEES_KEY, JSON.stringify(updated));
    return updated.find((emp) => emp.id === id);
  },

  deleteEmployee: (id) => {
    const current = employeeService.getEmployees();
    const updated = current.filter((emp) => emp.id !== id);
    localStorage.setItem(EMPLOYEES_KEY, JSON.stringify(updated));
    return updated;
  },

  // Leave Requests
  getLeaveRequests: () => {
    const saved = localStorage.getItem(LEAVES_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    localStorage.setItem(LEAVES_KEY, JSON.stringify(initialLeaveRequests));
    return initialLeaveRequests;
  },

  updateLeaveStatus: (id, status) => {
    const current = employeeService.getLeaveRequests();
    const updated = current.map((req) => (req.id === id ? { ...req, status } : req));
    localStorage.setItem(LEAVES_KEY, JSON.stringify(updated));
    return updated;
  },

  addLeaveRequest: (reqData) => {
    const current = employeeService.getLeaveRequests();
    const newReq = {
      ...reqData,
      id: `LR-${Math.floor(100 + Math.random() * 900)}`,
      status: 'Pending',
      requestDate: 'Today',
    };
    const updated = [newReq, ...current];
    localStorage.setItem(LEAVES_KEY, JSON.stringify(updated));
    return newReq;
  },

  // Checklist
  getChecklist: () => {
    const saved = localStorage.getItem(CHECKLIST_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    localStorage.setItem(CHECKLIST_KEY, JSON.stringify(initialChecklist));
    return initialChecklist;
  },

  toggleChecklistTask: (id) => {
    const current = employeeService.getChecklist();
    const updated = current.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    localStorage.setItem(CHECKLIST_KEY, JSON.stringify(updated));
    return updated;
  },

  addChecklistTask: (task) => {
    const current = employeeService.getChecklist();
    const newTask = {
      ...task,
      id: `T-${Date.now().toString().slice(-4)}`,
      completed: false,
    };
    const updated = [newTask, ...current];
    localStorage.setItem(CHECKLIST_KEY, JSON.stringify(updated));
    return updated;
  },

  // Activities
  getActivities: () => {
    const saved = localStorage.getItem(ACTIVITIES_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    localStorage.setItem(ACTIVITIES_KEY, JSON.stringify(recentActivities));
    return recentActivities;
  },
};
