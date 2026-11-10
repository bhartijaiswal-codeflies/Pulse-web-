import { employeesData, initialLeaveRequests, initialChecklist, recentActivities } from '../data/mockData';

const EMPLOYEES_KEY = 'pulse_employees';
const LEAVES_KEY = 'pulse_leave_requests';
const CHECKLIST_KEY = 'pulse_checklist';
const ACTIVITIES_KEY = 'pulse_activities';

export const employeeService = {
  getEmployees: () => {
    const defaultDocs = [
      { id: 'DOC-101', name: 'National ID & Aadhar Proof.pdf', type: 'PDF', size: '2.4 MB', uploadDate: '15 Jan, 2022', status: 'Verified' },
      { id: 'DOC-102', name: 'Master of Human Resources Degree.pdf', type: 'PDF', size: '3.6 MB', uploadDate: '10 Jan, 2022', status: 'Verified' },
      { id: 'DOC-103', name: 'Signed Employment Agreement.pdf', type: 'PDF', size: '1.5 MB', uploadDate: '12 Jan, 2022', status: 'Signed' },
      { id: 'DOC-104', name: 'Previous Experience & Relieving Letter.pdf', type: 'PDF', size: '1.2 MB', uploadDate: '08 Jan, 2022', status: 'Verified' },
      { id: 'DOC-105', name: 'Bank Passbook & Cancelled Cheque.pdf', type: 'PDF', size: '890 KB', uploadDate: '15 Jan, 2022', status: 'Approved' },
    ];

    const normalize = (emp) => ({
      ...emp,
      status: emp.status === 'Inactive' ? 'Inactive' : 'Active',
      address: emp.address || emp.location || '742 Evergreen Terrace, San Francisco, CA',
      location: emp.address || emp.location || '742 Evergreen Terrace, San Francisco, CA',
      joiningDate: emp.joiningDate || '15 Jan, 2022',
      exitDate: emp.exitDate || (emp.status === 'Inactive' ? '30 Oct, 2026' : '—'),
      reportTo: emp.reportTo || (emp.role === 'HR Admin' ? 'Executive Board' : 'Saurabh H. (HR Admin)'),
      mother: emp.mother || 'Sunita Sharma',
      father: emp.father || 'Rajesh Sharma',
      occupation: emp.occupation || emp.designation || 'Engineering & Operations',
      bloodGroup: emp.bloodGroup || 'O+',
      documents: emp.documents && emp.documents.length > 0 ? emp.documents : defaultDocs,
    });

    const saved = localStorage.getItem(EMPLOYEES_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const normalized = parsed.map(normalize);
          return normalized;
        }
      } catch (e) {
        console.error(e);
      }
    }
    const initialNormalized = employeesData.map(normalize);
    localStorage.setItem(EMPLOYEES_KEY, JSON.stringify(initialNormalized));
    return initialNormalized;
  },

  addEmployee: (employee) => {
    const current = employeeService.getEmployees();
    const newEmp = {
      ...employee,
      id: `PLS-${Math.floor(1000 + Math.random() * 9000)}`,
      status: employee.status === 'Inactive' ? 'Inactive' : 'Active',
      address: employee.address || employee.location || 'San Francisco, CA',
      location: employee.address || employee.location || 'San Francisco, CA',
      joiningDate: employee.joiningDate || 'Today',
      exitDate: employee.exitDate || (employee.status === 'Inactive' ? 'Today' : '—'),
      reportTo: employee.reportTo || 'Saurabh H. (HR Admin)',
      mother: employee.mother || 'Mrs. Sunita Sharma',
      father: employee.father || 'Mr. Rajesh Sharma',
      occupation: employee.occupation || employee.designation || 'Software Engineering',
      bloodGroup: employee.bloodGroup || 'O+',
      avatar: employee.avatar || `https://images.unsplash.com/photo-${1534528741775 + Math.floor(Math.random() * 1000)}?auto=format&fit=crop&w=150&q=80`,
      documents: employee.documents || [
        { id: `DOC-${Date.now()}-1`, name: 'Government ID & Identity Proof.pdf', type: 'PDF', size: '2.1 MB', uploadDate: 'Today', status: 'Verified' },
        { id: `DOC-${Date.now()}-2`, name: 'Educational Transcripts & Degree.pdf', type: 'PDF', size: '3.4 MB', uploadDate: 'Today', status: 'Verified' },
        { id: `DOC-${Date.now()}-3`, name: 'Signed Offer & Contract.pdf', type: 'PDF', size: '1.5 MB', uploadDate: 'Today', status: 'Signed' },
      ],
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

