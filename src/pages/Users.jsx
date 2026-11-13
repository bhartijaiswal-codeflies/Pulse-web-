import React, { useState, useEffect, useRef } from 'react';
import {
  Users as UsersIcon,
  UserPlus,
  ShieldCheck,
  CheckCircle,
  XCircle,
  Edit2,
  Trash2,
  Search,
  Filter,
  Mail,
  Phone,
  Building,
  Star,
  Check,
  X,
  Eye,
  Calendar,
  UserCheck,
  FileText,
  Download,
  ExternalLink,
  Briefcase,
  Heart,
  Upload,
  Shield,
  ChevronDown,
  RotateCw,
  Clock,
  Home,
  MapPin,
  Copy,
  PhoneCall,
  AlertTriangle,
  Plus,
  Info,
  DollarSign,
  Coffee,
  CalendarCheck,
  AlertCircle,
  Layers,
  Wallet,
  Sparkles,
  TrendingUp,
  History,
  ArrowUpRight,
  Camera,
  Image as ImageIcon,
  ImagePlus,
} from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { StatsCard } from '../components/dashboard/StatsCard';
import { DataTable } from '../components/common/DataTable';
import { StatusBadge } from '../components/common/StatusBadge';
import { SearchBar } from '../components/common/SearchBar';
import { Modal } from '../components/common/Modal';
import { employeeService } from '../services/employeeService';
import { useToast } from '../context/NotificationContext';

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80',
];

export const Users = () => {
  const [employees, setEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All'); // All, Active, Inactive
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const statusDropdownRef = useRef(null);

  // Period / Date Filters
  const [periodFilter, setPeriodFilter] = useState('all');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  // Role Filter
  const [roleFilter, setRoleFilter] = useState('All');

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleteEmployee, setDeleteEmployee] = useState(null);
  const [showDocUploadModal, setShowDocUploadModal] = useState(false);
  const [newDocName, setNewDocName] = useState('');
  const [newDocType, setNewDocType] = useState('Identity Proof');

  // Salary Management Modal State
  const [showSalaryModal, setShowSalaryModal] = useState(false);
  const [salaryCurrentAmount, setSalaryCurrentAmount] = useState('');
  const [newSalaryRevisionAmount, setNewSalaryRevisionAmount] = useState('');
  const [newSalaryRevisionDate, setNewSalaryRevisionDate] = useState('');
  const [newSalaryRevisionReason, setNewSalaryRevisionReason] = useState('Annual Appraisal');
  const [salaryHistoryList, setSalaryHistoryList] = useState([]);

  const { addToast } = useToast();

  // Add / Edit Form State
  const [avatar, setAvatar] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [designation, setDesignation] = useState('');
  const [role, setRole] = useState('Employee');
  const [address, setAddress] = useState('742 Evergreen Terrace, San Francisco, CA');
  const [status, setStatus] = useState('Active');
  const [joiningDate, setJoiningDate] = useState('Today');
  const [exitDate, setExitDate] = useState('—');
  const [reportTo, setReportTo] = useState('Saurabh H. (HR Admin)');
  const [mother, setMother] = useState('Kalpana');
  const [father, setFather] = useState('Shyam Sunder');
  const [occupation, setOccupation] = useState('Web Designer');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [spouseName, setSpouseName] = useState('—');
  const [spousePhone, setSpousePhone] = useState('—');
  const [emergencyContact, setEmergencyContact] = useState('+91 98765 43210');

  const [starredUsers, setStarredUsers] = useState(['PLS-10024', 'PLS-1049']);

  const loadEmployees = () => {
    setEmployees(employeeService.getEmployees());
  };

  useEffect(() => {
    loadEmployees();
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

  const toggleStar = (id) => {
    setStarredUsers((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleStatusChange = (id, newStatus) => {
    const updated = employeeService.updateEmployee(id, {
      status: newStatus,
      exitDate: newStatus === 'Inactive' ? '30 Oct, 2026' : '—',
    });
    addToast({
      title: 'Status Updated',
      message: `${updated.name}'s status is now marked as "${newStatus}".`,
      type: newStatus === 'Active' ? 'success' : 'warning',
    });
    loadEmployees();
    if (selectedUser && selectedUser.id === id) {
      setSelectedUser(updated);
    }
  };

  const handleToggleStatus = (employee) => {
    const newStatus = employee.status === 'Active' ? 'Inactive' : 'Active';
    handleStatusChange(employee.id, newStatus);
  };

  const resetForm = () => {
    setAvatar('');
    setName('');
    setEmail('');
    setPhone('');
    setDesignation('');
    setRole('Employee');
    setAddress('742 Evergreen Terrace, San Francisco, CA');
    setStatus('Active');
    setJoiningDate('Today');
    setExitDate('—');
    setReportTo('Saurabh H. (HR Admin)');
    setMother('Kalpana');
    setFather('Shyam Sunder');
    setOccupation('Web Designer');
    setBloodGroup('O+');
    setSpouseName('—');
    setSpousePhone('—');
    setEmergencyContact('+91 98765 43210');
    setEditingEmployee(null);
  };

  const handleAvatarFileUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      addToast({
        title: 'Invalid File',
        message: 'Please choose an image file (PNG, JPG, JPEG, WEBP, GIF).',
        type: 'warning',
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      addToast({
        title: 'File Too Large',
        message: 'Image size should be less than 5MB.',
        type: 'warning',
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setAvatar(event.target.result);
      addToast({
        title: 'Photo Uploaded',
        message: 'Profile image preview loaded.',
        type: 'success',
      });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleOpenAddModal = () => {
    resetForm();
    setShowAddModal(true);
  };

  const handleOpenEditModal = (emp) => {
    setEditingEmployee(emp);
    setAvatar(emp.avatar || '');
    setName(emp.name || '');
    setEmail(emp.email || '');
    setPhone(emp.phone || '');
    setDesignation(emp.designation || '');
    setRole(emp.role || 'Employee');
    setAddress(emp.address || emp.location || 'San Francisco, CA');
    setStatus(emp.status === 'Inactive' ? 'Inactive' : 'Active');
    setJoiningDate(emp.joiningDate || '15 Jan, 2022');
    setExitDate(emp.exitDate || (emp.status === 'Inactive' ? '30 Oct, 2026' : '—'));
    setReportTo(emp.reportTo || 'Saurabh H. (HR Admin)');
    setMother(emp.mother || 'Kalpana');
    setFather(emp.father || 'Shyam Sunder');
    setOccupation(emp.occupation || emp.designation || 'Web Designer');
    setBloodGroup(emp.bloodGroup || 'O+');
    setSpouseName(emp.spouseName || '—');
    setSpousePhone(emp.spousePhone || '—');
    setEmergencyContact(emp.emergencyContact || '+91 98765 43210');
    setShowAddModal(true);
  };

  const handleSaveEmployee = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      addToast({
        title: 'Validation error',
        message: 'Name and email are required fields.',
        type: 'warning',
      });
      return;
    }

    const payload = {
      name: name.trim(),
      email: email.trim(),
      avatar: avatar.trim() || (editingEmployee?.avatar ? editingEmployee.avatar : undefined),
      phone: phone.trim() || '+1 (555) 000-0000',
      designation: designation.trim() || 'Software Engineer',
      role,
      address: address.trim() || 'San Francisco, CA',
      location: address.trim() || 'San Francisco, CA',
      status: status === 'Inactive' ? 'Inactive' : 'Active',
      joiningDate: joiningDate.trim() || 'Today',
      exitDate: status === 'Inactive' ? (exitDate.trim() || 'Today') : '—',
      reportTo: reportTo.trim() || 'Saurabh H. (HR Admin)',
      mother: mother.trim() || 'Kalpana',
      father: father.trim() || 'Shyam Sunder',
      occupation: occupation.trim() || designation.trim() || 'Web Designer',
      bloodGroup: bloodGroup.trim() || 'O+',
      spouseName: spouseName.trim() || '—',
      spousePhone: spousePhone.trim() || '—',
      emergencyContact: emergencyContact.trim() || '+91 98765 43210',
    };

    if (editingEmployee) {
      const updated = employeeService.updateEmployee(editingEmployee.id, payload);
      addToast({
        title: 'Employee Updated',
        message: `Profile details for ${updated.name} have been updated.`,
        type: 'success',
      });
      if (selectedUser && selectedUser.id === editingEmployee.id) {
        setSelectedUser(updated);
      }
    } else {
      const created = employeeService.addEmployee(payload);
      addToast({
        title: 'Employee Provisioned',
        message: `${created.name} (${created.id}) has been added to user directory.`,
        type: 'success',
      });
    }

    loadEmployees();
    setShowAddModal(false);
    resetForm();
  };

  const handleDeleteEmployee = (emp) => {
    employeeService.deleteEmployee(emp.id);
    addToast({
      title: 'Employee Removed',
      message: `${emp.name} (${emp.id}) has been deleted from records.`,
      type: 'info',
    });
    setDeleteEmployee(null);
    if (selectedUser && selectedUser.id === emp.id) {
      setSelectedUser(null);
    }
    loadEmployees();
  };

  // Add Document to User Dossier
  const handleAddDocument = (e) => {
    e.preventDefault();
    if (!newDocName.trim() || !selectedUser) return;

    const newDoc = {
      id: `DOC-${Date.now()}`,
      name: newDocName.trim().endsWith('.pdf') ? newDocName.trim() : `${newDocName.trim()}.pdf`,
      type: 'PDF',
      size: `${(Math.random() * 2 + 1).toFixed(1)} MB`,
      uploadDate: 'Today',
      status: 'Verified',
    };

    const currentDocs = selectedUser.documents || [];
    const updatedDocs = [newDoc, ...currentDocs];
    const updatedUser = employeeService.updateEmployee(selectedUser.id, {
      documents: updatedDocs,
    });

    setSelectedUser(updatedUser);
    loadEmployees();
    setNewDocName('');
    setShowDocUploadModal(false);
    addToast({
      title: 'Document Added',
      message: `${newDoc.name} uploaded to ${updatedUser.name}'s bio records.`,
      type: 'success',
    });
  };

  const handleDownloadDoc = (doc) => {
    addToast({
      title: 'Downloading Document',
      message: `Initiated secure download for "${doc.name}" (${doc.size}).`,
      type: 'info',
    });
  };

  const handleRemoveDoc = (docId) => {
    if (!selectedUser) return;
    const currentDocs = selectedUser.documents || [];
    const updatedDocs = currentDocs.filter((d) => d.id !== docId && d.name !== docId);
    const updatedUser = employeeService.updateEmployee(selectedUser.id, {
      documents: updatedDocs,
    });
    setSelectedUser(updatedUser);
    loadEmployees();
    addToast({
      title: 'Document Removed',
      message: 'The selected document has been deleted from employee records.',
      type: 'info',
    });
  };

  // Salary Management Handlers
  const handleOpenSalaryModal = (user) => {
    if (!user) return;
    const rawSalary = user.currentSalary ? String(user.currentSalary).replace(/[^\d.]/g, '') : '40000';
    setSalaryCurrentAmount(rawSalary);
    setNewSalaryRevisionAmount('');
    const now = new Date();
    const formattedDate = `${now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' })} ${now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}`;
    setNewSalaryRevisionDate(formattedDate);
    setNewSalaryRevisionReason('Annual Appraisal Revision');
    setSalaryHistoryList(
      user.salaryHistory && user.salaryHistory.length > 0
        ? [...user.salaryHistory]
        : [
            { amount: '₹ 35,000.00', date: 'Wed, 13-Nov-24 12:05 pm', reason: 'Initial Joining' },
            { amount: '₹ 40,000.00', date: 'Fri, 22-May-26 03:47 pm', reason: 'Annual Appraisal' },
          ]
    );
    setShowSalaryModal(true);
  };

  const handleAddRevisionInModal = () => {
    if (!newSalaryRevisionAmount.trim()) {
      addToast({
        title: 'Amount Required',
        message: 'Please enter a revised salary amount.',
        type: 'warning',
      });
      return;
    }
    const numAmount = parseFloat(newSalaryRevisionAmount.replace(/,/g, ''));
    if (isNaN(numAmount) || numAmount <= 0) {
      addToast({
        title: 'Invalid Amount',
        message: 'Please enter a valid positive numerical amount.',
        type: 'warning',
      });
      return;
    }
    const formattedAmount = `₹ ${numAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    const revisionDate = newSalaryRevisionDate.trim() || new Date().toLocaleString('en-GB', { day: '2-digit', month: 'short', year: '2-digit', hour: '2-digit', minute: '2-digit', hour12: true });
    const newRevision = {
      amount: formattedAmount,
      date: revisionDate,
      reason: newSalaryRevisionReason.trim() || 'Salary Revision',
    };
    setSalaryHistoryList((prev) => [...prev, newRevision]);
    setSalaryCurrentAmount(String(numAmount));
    setNewSalaryRevisionAmount('');
    setNewSalaryRevisionReason('Appraisal Revision');
    addToast({
      title: 'Revision Staged',
      message: `${formattedAmount} staged in history. Click "Save Compensation" to apply.`,
      type: 'info',
    });
  };

  const handleSaveSalary = (e) => {
    e.preventDefault();
    if (!selectedUser) return;

    let updatedHistory = [...salaryHistoryList];

    // Auto include revision if filled in without clicking stage button
    if (newSalaryRevisionAmount.trim()) {
      const numAmount = parseFloat(newSalaryRevisionAmount.replace(/,/g, ''));
      if (!isNaN(numAmount) && numAmount > 0) {
        const formattedAmount = `₹ ${numAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        const revisionDate = newSalaryRevisionDate.trim() || new Date().toLocaleString('en-GB', { day: '2-digit', month: 'short', year: '2-digit', hour: '2-digit', minute: '2-digit', hour12: true });
        const newRevision = {
          amount: formattedAmount,
          date: revisionDate,
          reason: newSalaryRevisionReason.trim() || 'Salary Revision',
        };
        updatedHistory = [...updatedHistory, newRevision];
      }
    }

    // Determine current salary
    let formattedCurrentSalary = selectedUser.currentSalary;
    if (salaryCurrentAmount.trim()) {
      const numCurr = parseFloat(salaryCurrentAmount.replace(/,/g, ''));
      if (!isNaN(numCurr) && numCurr > 0) {
        formattedCurrentSalary = `₹ ${numCurr.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      }
    } else if (updatedHistory.length > 0) {
      formattedCurrentSalary = updatedHistory[updatedHistory.length - 1].amount;
    }

    const updatedUser = employeeService.updateEmployee(selectedUser.id, {
      currentSalary: formattedCurrentSalary,
      salaryHistory: updatedHistory,
    });

    setSelectedUser(updatedUser);
    loadEmployees();
    setShowSalaryModal(false);
    addToast({
      title: 'Compensation Updated',
      message: `${selectedUser.name}'s salary is now set to ${formattedCurrentSalary}.`,
      type: 'success',
    });
  };

  const handleDeleteSalaryRevision = (index) => {
    if (!selectedUser) return;
    const currentHistory =
      selectedUser.salaryHistory && selectedUser.salaryHistory.length > 0
        ? selectedUser.salaryHistory
        : [
            { amount: '₹ 35,000.00', date: 'Wed, 13-Nov-24 12:05 pm', reason: 'Initial Joining' },
            { amount: '₹ 40,000.00', date: 'Fri, 22-May-26 03:47 pm', reason: 'Annual Appraisal' },
          ];
    const updatedHistory = currentHistory.filter((_, idx) => idx !== index);
    const newCurrent =
      updatedHistory.length > 0
        ? updatedHistory[updatedHistory.length - 1].amount
        : selectedUser.currentSalary;

    const updatedUser = employeeService.updateEmployee(selectedUser.id, {
      salaryHistory: updatedHistory,
      currentSalary: newCurrent,
    });

    setSelectedUser(updatedUser);
    setSalaryHistoryList(updatedHistory);
    loadEmployees();
    addToast({
      title: 'Revision Removed',
      message: 'The revision record has been deleted from history.',
      type: 'info',
    });
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('All');
    setPeriodFilter('all');
    setFromDate('');
    setToDate('');
    setRoleFilter('All');
    addToast({
      title: 'Filters Cleared',
      message: 'Restored all user records.',
      type: 'info',
    });
  };

  // Filtering Logic
  const filteredEmployees = employees.filter((emp) => {
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      emp.name.toLowerCase().includes(query) ||
      emp.email.toLowerCase().includes(query) ||
      emp.id.toLowerCase().includes(query) ||
      (emp.designation && emp.designation.toLowerCase().includes(query)) ||
      (emp.role && emp.role.toLowerCase().includes(query)) ||
      (emp.address && emp.address.toLowerCase().includes(query)) ||
      (emp.reportTo && emp.reportTo.toLowerCase().includes(query)) ||
      (emp.mother && emp.mother.toLowerCase().includes(query)) ||
      (emp.father && emp.father.toLowerCase().includes(query)) ||
      (emp.bloodGroup && emp.bloodGroup.toLowerCase().includes(query));

    const matchesStatus =
      statusFilter === 'All' || emp.status === statusFilter;

    const matchesRole =
      roleFilter === 'All' || emp.role.toLowerCase() === roleFilter.toLowerCase();

    let matchesDate = true;
    if (periodFilter !== 'all') {
      const empDate = new Date(emp.joiningDate);
      const now = new Date();
      if (!isNaN(empDate.getTime())) {
        if (periodFilter === 'today') {
          matchesDate = empDate.toDateString() === now.toDateString();
        } else if (periodFilter === 'this-week') {
          const oneWeekAgo = new Date();
          oneWeekAgo.setDate(now.getDate() - 7);
          matchesDate = empDate >= oneWeekAgo && empDate <= now;
        } else if (periodFilter === 'this-month') {
          matchesDate =
            empDate.getMonth() === now.getMonth() &&
            empDate.getFullYear() === now.getFullYear();
        } else if (periodFilter === 'custom') {
          if (fromDate) {
            const from = new Date(fromDate);
            from.setHours(0, 0, 0, 0);
            if (empDate < from) matchesDate = false;
          }
          if (toDate) {
            const to = new Date(toDate);
            to.setHours(23, 59, 59, 999);
            if (empDate > to) matchesDate = false;
          }
        }
      }
    }

    return matchesSearch && matchesStatus && matchesRole && matchesDate;
  });

  // Status Filter Pill Dropdown Configuration (Only Active / Inactive)
  const statusFilterConfig = {
    All: {
      label: 'All Users',
      count: employees.length,
      icon: <UsersIcon className="w-3.5 h-3.5 text-[#2563EB] stroke-[2.2]" />,
      pillClass: 'bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE] hover:bg-blue-100/70',
      badgeClass: 'bg-[#DBEAFE] text-[#1D4ED8]',
    },
    Active: {
      label: 'Active',
      count: employees.filter((e) => e.status === 'Active').length,
      icon: <Check className="w-3.5 h-3.5 text-[#059669] stroke-[2.5]" />,
      pillClass: 'bg-[#ECFDF5] text-[#059669] border-[#A7F3D0] hover:bg-emerald-100/70',
      badgeClass: 'bg-[#D1FAE5] text-[#047857]',
    },
    Inactive: {
      label: 'Inactive',
      count: employees.filter((e) => e.status === 'Inactive').length,
      icon: <X className="w-3.5 h-3.5 text-[#DC2626] stroke-[2.5]" />,
      pillClass: 'bg-[#FEF2F2] text-[#DC2626] border-[#FECACA] hover:bg-rose-100/70',
      badgeClass: 'bg-[#FEE2E2] text-[#B91C1C]',
    },
  };

  const currentStatusConfig = statusFilterConfig[statusFilter] || statusFilterConfig.All;

  // Single-Row Filter Bar matching Candidates design exactly
  const userFilterBar = (
    <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3">
      {/* Left: All Filters in 1 Row */}
      <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-0">
        {/* 1. Status Dropdown Pill (Only Active / Inactive) */}
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
            <div className="absolute left-0 top-full mt-2 z-50 bg-white rounded-2xl shadow-xl border border-[#E5EAF2] py-1.5 min-w-[210px] animate-fade-in text-left">
              <div className="px-3.5 py-1.5 text-[10px] font-bold text-[#8292AD] uppercase tracking-wider border-b border-[#F1F5F9] mb-1">
                Filter by User Status
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

        {/* 2. Search User, Role, Address, ID */}
        <div className="w-56 sm:w-64 min-w-[210px] flex-shrink-0">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onClear={() => setSearchQuery('')}
            placeholder="Search user, role, address, ID..."
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

        {/* 5. Role Filter Dropdown */}
        <div className="relative min-w-[145px] flex-shrink-0">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full appearance-none pl-8 pr-8 h-9 text-xs font-semibold rounded-xl border border-[#E5EAF2] bg-white text-[#172033] hover:bg-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer shadow-2xs transition-colors"
          >
            <option value="All">All Roles</option>
            <option value="Employee">Employee</option>
            <option value="Team Lead">Team Lead</option>
            <option value="Manager">Manager</option>
            <option value="Director">Director</option>
            <option value="HR Admin">HR Admin</option>
          </select>
          <Shield className="w-3.5 h-3.5 text-[#2563EB] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <ChevronDown className="w-3.5 h-3.5 text-[#8292AD] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
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
            Filtered: {filteredEmployees.length} Shown of {employees.length}
          </span>
          <button
            onClick={() => loadEmployees()}
            title="Refresh Employees"
            className="p-1 hover:bg-[#F8FAFC] rounded-lg transition-transform active:rotate-180 cursor-pointer"
          >
            <RotateCw className="w-3.5 h-3.5 text-[#8292AD] hover:text-[#2563EB] transition-colors" />
          </button>
        </div>
      </div>
    </div>
  );

  // Table Columns
  const columns = [
    {
      header: 'USER / ROLE',
      accessor: 'role',
      render: (row) => {
        const isStarred = starredUsers.includes(row.id);
        return (
          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleStar(row.id)}
              className="focus:outline-none transition-transform hover:scale-110 cursor-pointer"
              title="Toggle Bookmark"
            >
              <Star
                className={`w-3.5 h-3.5 ${
                  isStarred
                    ? 'fill-amber-400 text-amber-400'
                    : 'text-slate-300 hover:text-amber-400'
                }`}
              />
            </button>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#2563EB] bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100 hover:bg-blue-100/60 transition-colors">
              <span>{row.role}</span>
              <span className="text-[9px] opacity-60">▾</span>
            </span>
          </div>
        );
      },
    },
    {
      header: 'EMPLOYEE & CONTACT',
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
              className="font-bold text-[#172033] text-xs hover:text-[#2563EB] cursor-pointer truncate"
              onClick={() => setSelectedUser(row)}
              title={`View ${row.name}'s complete bio`}
            >
              {row.name}
            </div>
            <div className="text-[10px] text-[#8292AD] font-medium truncate flex items-center gap-1.5 mt-0.5">
              <span>{row.id}</span>
              <span>•</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  navigator.clipboard.writeText(row.email);
                  addToast({
                    title: 'Email Copied',
                    message: `${row.email} copied to clipboard.`,
                    type: 'success',
                  });
                }}
                className="hover:text-[#2563EB] transition-colors truncate"
                title="Click to copy email"
              >
                {row.email}
              </button>
            </div>
            {/* Phone with clickable tel redirect */}
            <a
              href={`tel:${row.phone}`}
              onClick={(e) => e.stopPropagation()}
              title="Click to call employee"
              className="group/phone flex items-center gap-1 text-[10.5px] text-[#4B5563] hover:text-emerald-600 transition-colors font-medium mt-0.5"
            >
              <Phone className="w-3 h-3 text-[#6B7280] group-hover/phone:text-emerald-600 flex-shrink-0" />
              <span>{row.phone}</span>
            </a>
          </div>
        </div>
      ),
    },
    {
      header: 'DESIGNATION',
      accessor: 'designation',
      render: (row) => (
        <div className="text-xs font-bold text-[#172033]">
          {row.designation}
        </div>
      ),
    },
    {
      header: 'ADDRESS',
      accessor: 'address',
      render: (row) => (
        <span
          className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[#4E5D78] bg-[#F7F9FC] px-2.5 py-1 rounded-full border border-[#E5EAF2] max-w-[210px] truncate"
          title={row.address || row.location}
        >
          <MapPin className="w-3 h-3 text-[#2563EB] flex-shrink-0" />
          <span className="truncate">{row.address || row.location}</span>
        </span>
      ),
    },
    {
      header: 'JOIN & EXIT DATE',
      accessor: 'joiningDate',
      render: (row) => (
        <div className="space-y-1 text-left whitespace-nowrap">
          <div className="text-[11px] font-medium text-[#1F2937] flex items-center gap-1.5">
            <Calendar className="w-3 h-3 text-[#2563EB] flex-shrink-0" />
            <span className="text-[#8292AD] font-bold text-[10px]">JOIN:</span>
            <span className="font-semibold text-[#111827]">
              {row.joiningDate || '15 Jan, 2022'}
            </span>
          </div>
          <div className="text-[11px] font-medium flex items-center gap-1.5">
            <Calendar className="w-3 h-3 text-slate-400 flex-shrink-0" />
            <span className="text-[#8292AD] font-bold text-[10px]">EXIT:</span>
            <span
              className={
                row.status === 'Inactive' || (row.exitDate && row.exitDate !== '—')
                  ? 'font-semibold text-rose-600'
                  : 'text-slate-400 font-medium'
              }
            >
              {row.exitDate || (row.status === 'Inactive' ? '30 Oct, 2026' : '—')}
            </span>
          </div>
        </div>
      ),
    },
    {
      header: 'REPORT TO',
      accessor: 'reportTo',
      render: (row) => (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 whitespace-nowrap shadow-2xs">
          <UserCheck className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0" />
          <span>{row.reportTo || 'Saurabh H. (HR Admin)'}</span>
        </span>
      ),
    },
    {
      header: 'STATUS',
      accessor: 'status',
      align: 'center',
      render: (row) => (
        <StatusBadge
          status={row.status === 'Inactive' ? 'Inactive' : 'Active'}
          size="xs"
          showChevron={true}
          options={['Active', 'Inactive']}
          onStatusChange={(newStatus) => handleStatusChange(row.id, newStatus)}
        />
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <PageHeader
        title="User Management"
        badgeText="Employee Directory"
        subtitle="Manage active company workforce, permission tiers, bio details and reporting lines."
        breadcrumbs={[{ label: 'Home', link: '/' }, { label: 'Users' }]}
        actions={
          <button
            onClick={handleOpenAddModal}
            className="inline-flex items-center gap-1.5 px-4 h-9 text-xs font-bold rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white shadow-sm transition-all active:scale-95 shadow-blue-500/20 cursor-pointer"
          >
            <UserPlus className="w-4 h-4 stroke-[2.5]" />
            <span>Add Employee</span>
          </button>
        }
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Workforce"
          value={employees.length}
          subtext="Configured user accounts"
          badgeText="Active"
          badgeType="success"
          icon={UsersIcon}
          iconBg="bg-blue-50 text-[#2563EB]"
        />
        <StatsCard
          title="Active Headcount"
          value={employees.filter((e) => e.status === 'Active').length}
          subtext="Full system access"
          badgeText="Operational"
          badgeType="success"
          icon={CheckCircle}
          iconBg="bg-emerald-50 text-emerald-600"
        />
        <StatsCard
          title="Inactive Accounts"
          value={employees.filter((e) => e.status === 'Inactive').length}
          subtext="Offboarded / Resigned"
          badgeText="Archived"
          badgeType="default"
          icon={XCircle}
          iconBg="bg-rose-50 text-rose-600"
        />
        <StatsCard
          title="Admin & Managers"
          value={
            employees.filter((e) =>
              ['HR Admin', 'Manager', 'Director', 'Team Lead'].includes(e.role)
            ).length
          }
          subtext="Privileged permissions"
          badgeText="Tier 1-2"
          badgeType="default"
          icon={ShieldCheck}
          iconBg="bg-purple-50 text-purple-600"
        />
      </div>

      {/* Table with Filter Bar matching Candidates design */}
      <DataTable
        columns={columns}
        data={filteredEmployees}
        pageSize={6}
        filterBar={userFilterBar}
        entityName="employees"
        emptyMessage="No employees found"
        emptySubtext="Try adjusting your status filter or clearing search query."
        actions={(row) => (
          <div className="inline-flex items-center justify-end gap-1.5">
            {/* View Full Bio Profile Button */}
            <button
              type="button"
              onClick={() => setSelectedUser(row)}
              title={`View complete bio for ${row.name}`}
              className="w-7 h-7 rounded-full bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100 hover:scale-105 flex items-center justify-center transition-all shadow-2xs cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>

            {/* Toggle Status Button (Active / Inactive) */}
            <button
              type="button"
              onClick={() => handleToggleStatus(row)}
              title={
                row.status === 'Active'
                  ? `Deactivate ${row.name}`
                  : `Activate ${row.name}`
              }
              className={`w-7 h-7 rounded-full border flex items-center justify-center hover:scale-105 transition-all shadow-2xs cursor-pointer ${
                row.status === 'Active'
                  ? 'bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100'
                  : 'bg-rose-50 text-rose-500 border-rose-200 hover:bg-rose-100'
              }`}
            >
              {row.status === 'Active' ? (
                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
              ) : (
                <X className="w-3.5 h-3.5 stroke-[2.5]" />
              )}
            </button>

            {/* Edit Button */}
            <button
              type="button"
              onClick={() => handleOpenEditModal(row)}
              title={`Edit details for ${row.name}`}
              className="w-7 h-7 rounded-full bg-blue-50 text-[#2563EB] border border-blue-200 hover:bg-blue-100 hover:scale-105 flex items-center justify-center transition-all shadow-2xs cursor-pointer"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>

            {/* Delete Button */}
            <button
              type="button"
              onClick={() => setDeleteEmployee(row)}
              title={`Delete ${row.name}`}
              className="w-7 h-7 rounded-full bg-rose-50 text-rose-500 border border-rose-200 hover:bg-rose-100 hover:scale-105 flex items-center justify-center transition-all shadow-2xs cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      />

      {/* Add / Edit Employee Modal with Comprehensive Bio Fields */}
      {showAddModal && (
        <Modal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          title={editingEmployee ? 'Edit Employee Profile' : 'Onboard New Employee'}
          subtitle={
            editingEmployee
              ? `Updating record for ${editingEmployee.name} (${editingEmployee.id})`
              : 'Provision new employee profile, address, reporting line and bio details'
          }
          maxWidth="max-w-2xl"
        >
          <form onSubmit={handleSaveEmployee} className="space-y-4">
            {/* Section 0: Profile Photo Upload */}
            <div className="bg-[#F8FAFC] p-3.5 rounded-xl border border-[#E5EAF2]">
              <div className="flex items-center justify-between mb-2">
                <div className="text-[11px] font-bold text-[#8292AD] uppercase tracking-wider flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5 text-[#2563EB]" />
                  <span>Profile Photo</span>
                </div>
                {avatar && (
                  <button
                    type="button"
                    onClick={() => setAvatar('')}
                    className="text-[11px] font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Remove Photo</span>
                  </button>
                )}
              </div>

              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3.5">
                {/* Live Avatar Preview */}
                <div className="relative group/avatar flex-shrink-0">
                  {avatar ? (
                    <img
                      src={avatar}
                      alt="Avatar preview"
                      className="w-16 h-16 rounded-2xl object-cover ring-2 ring-white shadow-sm border border-[#E5EAF2]"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-100 border border-blue-200/60 text-[#2563EB] flex flex-col items-center justify-center font-bold text-xs shadow-2xs">
                      <Camera className="w-5 h-5 text-[#2563EB]/70 mb-0.5" />
                      <span className="text-[9px] text-slate-500 font-medium">No Photo</span>
                    </div>
                  )}

                  <label
                    htmlFor="employee-avatar-upload"
                    className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover/avatar:opacity-100 flex flex-col items-center justify-center transition-opacity text-white text-[9px] font-bold cursor-pointer backdrop-blur-2xs"
                    title="Upload photo from device"
                  >
                    <Upload className="w-3.5 h-3.5 mb-0.5" />
                    <span>Change</span>
                  </label>
                  <input
                    id="employee-avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarFileUpload}
                    className="hidden"
                  />
                </div>

                {/* Upload Controls */}
                <div className="flex-1 min-w-0 w-full space-y-2">
                  <div className="flex items-center gap-2">
                    <label
                      htmlFor="employee-avatar-upload"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-white text-[#2563EB] border border-[#2563EB]/30 hover:bg-blue-50/70 transition-colors cursor-pointer shadow-2xs"
                    >
                      <Upload className="w-3.5 h-3.5 text-[#2563EB]" />
                      <span>Upload Device Photo</span>
                    </label>
                    <span className="text-[11px] text-slate-400">or paste image link</span>
                  </div>

                  <div className="relative">
                    <input
                      type="url"
                      value={avatar}
                      onChange={(e) => setAvatar(e.target.value)}
                      placeholder="Paste image URL (https://images.unsplash.com/...)"
                      className="w-full pl-3 pr-8 py-1.5 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 bg-white placeholder:text-slate-400"
                    />
                    {avatar && (
                      <button
                        type="button"
                        onClick={() => setAvatar('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                        title="Clear photo link"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Preset Avatar Chips */}
                  <div className="flex items-center gap-1.5 pt-0.5 overflow-x-auto no-scrollbar">
                    <span className="text-[10px] text-slate-500 font-semibold flex-shrink-0">Presets:</span>
                    {PRESET_AVATARS.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setAvatar(preset)}
                        className={`w-6 h-6 rounded-full overflow-hidden border transition-transform flex-shrink-0 cursor-pointer ${
                          avatar === preset ? 'ring-2 ring-[#2563EB] scale-110 border-white' : 'border-slate-300 opacity-70 hover:opacity-100 hover:scale-105'
                        }`}
                        title={`Select preset avatar #${idx + 1}`}
                      >
                        <img src={preset} alt={`preset ${idx + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Section 1: Basic Identity */}
            <div className="bg-[#F8FAFC] p-3.5 rounded-xl border border-[#E5EAF2] space-y-3">
              <div className="text-[11px] font-bold text-[#8292AD] uppercase tracking-wider">
                Basic Credentials & Role
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#172033] mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Rachel Adams"
                    className="w-full px-3 py-1.5 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#172033] mb-1">
                    Work Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="rachel.a@pulsehr.com"
                    className="w-full px-3 py-1.5 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#172033] mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 234-5678"
                    className="w-full px-3 py-1.5 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#172033] mb-1">
                    Designation / Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    placeholder="e.g. Lead Backend Architect"
                    className="w-full px-3 py-1.5 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#172033] mb-1">
                    Role / Access Tier
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 bg-white font-medium"
                  >
                    <option value="Employee">Employee (Standard)</option>
                    <option value="Team Lead">Team Lead</option>
                    <option value="Manager">Manager</option>
                    <option value="Director">Director</option>
                    <option value="HR Admin">HR Admin (Full Access)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#172033] mb-1">
                    Account Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 bg-white font-medium"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section 2: Address, Reporting & Dates */}
            <div className="bg-[#F8FAFC] p-3.5 rounded-xl border border-[#E5EAF2] space-y-3">
              <div className="text-[11px] font-bold text-[#8292AD] uppercase tracking-wider">
                Address & Reporting Line
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-[#172033] mb-1">
                    Address *
                  </label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. 742 Evergreen Terrace, San Francisco, CA"
                    className="w-full px-3 py-1.5 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#172033] mb-1">
                    Report To (Manager)
                  </label>
                  <input
                    type="text"
                    value={reportTo}
                    onChange={(e) => setReportTo(e.target.value)}
                    placeholder="e.g. Saurabh H. (HR Admin)"
                    className="w-full px-3 py-1.5 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#172033] mb-1">
                    Joining Date
                  </label>
                  <input
                    type="text"
                    value={joiningDate}
                    onChange={(e) => setJoiningDate(e.target.value)}
                    placeholder="e.g. 15 Jan, 2022"
                    className="w-full px-3 py-1.5 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 bg-white"
                  />
                </div>

                {status === 'Inactive' && (
                  <div>
                    <label className="block text-xs font-bold text-[#DC2626] mb-1">
                      Exit Date
                    </label>
                    <input
                      type="text"
                      value={exitDate}
                      onChange={(e) => setExitDate(e.target.value)}
                      placeholder="e.g. 30 Oct, 2026"
                      className="w-full px-3 py-1.5 text-xs border border-rose-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 bg-rose-50/40 text-rose-900 font-semibold"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Section 3: Bio & Family Details */}
            <div className="bg-[#F8FAFC] p-3.5 rounded-xl border border-[#E5EAF2] space-y-3">
              <div className="text-[11px] font-bold text-[#8292AD] uppercase tracking-wider">
                Bio & Family Background
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#172033] mb-1">
                    Mother's Name
                  </label>
                  <input
                    type="text"
                    value={mother}
                    onChange={(e) => setMother(e.target.value)}
                    placeholder="e.g. Sunita Sharma"
                    className="w-full px-3 py-1.5 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#172033] mb-1">
                    Father's Name
                  </label>
                  <input
                    type="text"
                    value={father}
                    onChange={(e) => setFather(e.target.value)}
                    placeholder="e.g. Rajesh Sharma"
                    className="w-full px-3 py-1.5 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#172033] mb-1">
                    Spouse / Husband Name
                  </label>
                  <input
                    type="text"
                    value={spouseName}
                    onChange={(e) => setSpouseName(e.target.value)}
                    placeholder="e.g. Amit Sharma"
                    className="w-full px-3 py-1.5 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#172033] mb-1">
                    Spouse Contact Number
                  </label>
                  <input
                    type="text"
                    value={spousePhone}
                    onChange={(e) => setSpousePhone(e.target.value)}
                    placeholder="e.g. +91 98101 22334"
                    className="w-full px-3 py-1.5 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 bg-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-[#172033] mb-1">
                    Emergency Contact & Relation
                  </label>
                  <input
                    type="text"
                    value={emergencyContact}
                    onChange={(e) => setEmergencyContact(e.target.value)}
                    placeholder="e.g. +91 98765 43210 (Father / Family)"
                    className="w-full px-3 py-1.5 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#172033] mb-1">
                    Blood Group
                  </label>
                  <select
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 bg-white font-medium"
                  >
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>
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
                {editingEmployee ? 'Save Changes' : 'Provision Employee'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Complete Information Bio Modal (View User) - 3 Column Layout with Widescreen Width */}
      {selectedUser && (
        <Modal
          isOpen={!!selectedUser}
          onClose={() => setSelectedUser(null)}
          title="Employee Dossier & Profile Record"
          subtitle={`pulse.codeflies.com/admin/employees • Comprehensive organizational, personal & verified document records for ${selectedUser.name}`}
          maxWidth="max-w-[1360px]"
        >
          <div className="space-y-4">
            {/* Top Identity & Action Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-gradient-to-r from-blue-50/70 via-indigo-50/30 to-slate-50 rounded-2xl border border-blue-100">
              <div className="flex items-center gap-3.5">
                <img
                  src={selectedUser.avatar}
                  alt={selectedUser.name}
                  className="w-16 h-16 rounded-full object-cover ring-3 ring-white shadow-md flex-shrink-0"
                />
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-lg font-black text-[#111827]">
                      {selectedUser.name}
                    </h3>
                    <span className="text-xs font-black px-2 py-0.5 rounded bg-[#008080] text-white">
                      {selectedUser.empCode || `CFT00${String(selectedUser.id).replace(/\D/g, '').padStart(3, '0') || '342'}`}
                    </span>
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-[#1D4ED8] border border-blue-200">
                      {selectedUser.role}
                    </span>
                    <StatusBadge
                      status={selectedUser.status}
                      size="xs"
                      showChevron={false}
                    />
                  </div>
                  <p className="text-xs font-bold text-[#2563EB] mt-0.5">
                    {selectedUser.designation || 'Web Designer'}
                  </p>
                  <p className="text-[11px] text-[#64748B] flex items-center gap-2 mt-0.5 flex-wrap">
                    <span>ID: <strong className="text-slate-800">{selectedUser.id}</strong></span>
                    <span>•</span>
                    <span>Email: <strong className="text-slate-800">{selectedUser.email}</strong></span>
                    <span>•</span>
                    <span>Reporting to: <strong className="text-indigo-700">{selectedUser.reportingTo || selectedUser.reportTo || 'Vivek Kumar Singh'}</strong></span>
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 self-start sm:self-center">
                <button
                  type="button"
                  onClick={() => handleOpenEditModal(selectedUser)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-white border border-[#CBD5E1] text-[#1E293B] hover:bg-[#F8FAFC] transition-colors shadow-2xs cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5 text-[#2563EB]" />
                  <span>Edit Profile</span>
                </button>
              </div>
            </div>

            {/* 3-Column Detailed Data Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
              {/* COLUMN 1: Personal & Family Details (Employee Details) */}
              <div className="p-4 rounded-2xl border border-[#E5EAF2] bg-white shadow-2xs space-y-3">
                <div className="flex items-center justify-between pb-2.5 border-b border-[#F1F5F9]">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-xs font-black bg-[#008080] text-white">
                      {selectedUser.empCode || `CFT00${String(selectedUser.id).replace(/\D/g, '').padStart(3, '0') || '342'}`}
                    </span>
                    <h4 className="text-xs font-bold text-[#172033] uppercase tracking-wider">
                      Employee Details
                    </h4>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleOpenEditModal(selectedUser)}
                    className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-bold rounded-lg text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-200 cursor-pointer"
                  >
                    <Edit2 className="w-3 h-3 text-[#008080]" />
                    <span>Edit</span>
                  </button>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between items-center py-1.5 border-b border-[#F8FAFC]">
                    <span className="text-[#8292AD] font-medium">Name:</span>
                    <span className="font-bold text-[#2563EB]">{selectedUser.name}</span>
                  </div>

                  <div className="flex justify-between items-center py-1.5 border-b border-[#F8FAFC]">
                    <span className="text-[#8292AD] font-medium">Email:</span>
                    <div className="flex items-center gap-1.5 font-bold text-[#172033]">
                      <span className="truncate max-w-[180px]">{selectedUser.email}</span>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(selectedUser.email);
                          addToast({
                            title: 'Email Copied',
                            message: `${selectedUser.email} copied.`,
                            type: 'success',
                          });
                        }}
                        className="text-[#8292AD] hover:text-[#2563EB]"
                        title="Copy email"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-between items-center py-1.5 border-b border-[#F8FAFC]">
                    <span className="text-[#8292AD] font-medium">Mobile:</span>
                    <a
                      href={`tel:${selectedUser.phone}`}
                      className="font-bold text-emerald-700 hover:underline flex items-center gap-1"
                    >
                      <Phone className="w-3 h-3 text-emerald-600" />
                      <span>{selectedUser.phone}</span>
                    </a>
                  </div>

                  <div className="flex justify-between items-center py-1.5 border-b border-[#F8FAFC]">
                    <span className="text-[#8292AD] font-medium">Date Of Birth:</span>
                    <span className="font-bold text-[#172033]">{selectedUser.dob || 'Thu, 02-Nov-00'}</span>
                  </div>

                  <div className="flex justify-between items-center py-1.5 border-b border-[#F8FAFC]">
                    <span className="text-[#8292AD] font-medium">Roles:</span>
                    <span className="font-bold text-[#172033]">{selectedUser.role}</span>
                  </div>

                  <div className="flex justify-between items-center py-1.5 border-b border-[#F8FAFC]">
                    <span className="text-[#8292AD] font-medium">Status:</span>
                    <StatusBadge status={selectedUser.status} size="xs" />
                  </div>

                  <div className="flex justify-between items-center py-1.5 border-b border-[#F8FAFC]">
                    <span className="text-[#8292AD] font-medium">Created At:</span>
                    <span className="font-bold text-[#172033]">{selectedUser.createdAt || 'Wed, 13-Nov-24 12:05 pm'}</span>
                  </div>

                  <div className="flex justify-between items-center py-1.5 border-b border-[#F8FAFC]">
                    <span className="text-[#8292AD] font-medium">Alternate Mobile:</span>
                    <span className="font-bold text-[#172033]">{selectedUser.altPhone || '—'}</span>
                  </div>

                  <div className="flex justify-between items-center py-1.5 border-b border-[#F8FAFC]">
                    <span className="text-[#8292AD] font-medium">Emergency Contact:</span>
                    {selectedUser.emergencyContact && selectedUser.emergencyContact !== '—' ? (
                      <a
                        href={`tel:${String(selectedUser.emergencyContact).replace(/[^+\d]/g, '')}`}
                        className="font-bold text-rose-700 hover:underline flex items-center gap-1"
                      >
                        <Phone className="w-3 h-3 text-rose-600" />
                        <span>{selectedUser.emergencyContact}</span>
                      </a>
                    ) : (
                      <span className="font-bold text-[#172033]">—</span>
                    )}
                  </div>

                  <div className="flex justify-between items-center py-1.5 border-b border-[#F8FAFC]">
                    <span className="text-[#8292AD] font-medium">Father's Name:</span>
                    <span className="font-bold text-[#172033]">{selectedUser.father || 'Shyam Sunder'}</span>
                  </div>

                  <div className="flex justify-between items-center py-1.5 border-b border-[#F8FAFC]">
                    <span className="text-[#8292AD] font-medium">Father's Profession:</span>
                    <span className="font-bold text-[#172033]">{selectedUser.fatherProfession || 'Business'}</span>
                  </div>

                  <div className="flex justify-between items-center py-1.5 border-b border-[#F8FAFC]">
                    <span className="text-[#8292AD] font-medium">Mother Name:</span>
                    <span className="font-bold text-[#172033]">{selectedUser.mother || 'Kalpana'}</span>
                  </div>

                  <div className="flex justify-between items-center py-1.5 border-b border-[#F8FAFC]">
                    <span className="text-[#8292AD] font-medium">Mother Profession:</span>
                    <span className="font-bold text-[#172033]">{selectedUser.motherProfession || 'Housewife'}</span>
                  </div>

                  <div className="flex justify-between items-center py-1.5 border-b border-[#F8FAFC]">
                    <span className="text-[#8292AD] font-medium">Spouse / Husband Name:</span>
                    <span className="font-bold text-[#172033]">{selectedUser.spouseName || '—'}</span>
                  </div>

                  <div className="flex justify-between items-center py-1.5 border-b border-[#F8FAFC]">
                    <span className="text-[#8292AD] font-medium">Spouse Contact Number:</span>
                    {selectedUser.spousePhone && selectedUser.spousePhone !== '—' ? (
                      <a
                        href={`tel:${String(selectedUser.spousePhone).replace(/[^+\d]/g, '')}`}
                        className="font-bold text-indigo-700 hover:underline flex items-center gap-1"
                      >
                        <Phone className="w-3 h-3 text-indigo-600" />
                        <span>{selectedUser.spousePhone}</span>
                      </a>
                    ) : (
                      <span className="font-bold text-[#172033]">—</span>
                    )}
                  </div>

                  <div className="flex justify-between items-center py-1.5 border-b border-[#F8FAFC]">
                    <span className="text-[#8292AD] font-medium">Spouse Profession:</span>
                    <span className="font-bold text-[#172033]">{selectedUser.spouseProfession || '—'}</span>
                  </div>

                  <div className="flex justify-between items-center py-1.5 border-b border-[#F8FAFC]">
                    <span className="text-[#8292AD] font-medium">Blood Group:</span>
                    <span className="inline-flex items-center gap-1 font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                      <Heart className="w-3 h-3 fill-rose-500 text-rose-500" />
                      <span>{selectedUser.bloodGroup || 'O+'}</span>
                    </span>
                  </div>

                  <div className="py-1.5 border-b border-[#F8FAFC]">
                    <span className="text-[#8292AD] font-medium block mb-1">Permanent Address:</span>
                    <div className="font-bold text-[#172033] bg-[#F8FAFC] p-2 rounded-xl border border-[#E5EAF2] flex items-start gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#2563EB] flex-shrink-0 mt-0.5" />
                      <span>{selectedUser.permanentAddress || selectedUser.address}</span>
                    </div>
                  </div>

                  <div className="py-1.5">
                    <span className="text-[#8292AD] font-medium block mb-1">Temporary Address:</span>
                    <div className="font-bold text-[#172033] bg-[#F8FAFC] p-2 rounded-xl border border-[#E5EAF2] flex items-start gap-1.5">
                      <Home className="w-3.5 h-3.5 text-slate-500 flex-shrink-0 mt-0.5" />
                      <span>{selectedUser.temporaryAddress || selectedUser.address}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* COLUMN 2: Employment, Organization, Leaves & Salary Records */}
              <div className="space-y-4">
                {/* 1st POSITION: Current Month Leave & Attendance Overview */}
                <div className="p-4 rounded-2xl border border-[#E5EAF2] bg-white shadow-2xs space-y-3.5">
                  <div className="flex items-center justify-between pb-2.5 border-b border-[#F1F5F9]">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-teal-50 border border-teal-200/70 text-[#008080] flex items-center justify-center shadow-2xs">
                        <Calendar className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-extrabold text-[#172033] tracking-tight">
                          Current Month: {selectedUser.name}
                        </h4>
                        <p className="text-[10px] text-[#8292AD] font-medium flex items-center gap-1.5 mt-0.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          <span>Active Cycle • {new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' })}</span>
                        </p>
                      </div>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-[#008080] border border-teal-200 shadow-2xs">
                      Live Summary
                    </span>
                  </div>

                  {/* 4 Modern Executive Metric Cards (2 boxes in 1 row: 2x2 grid) */}
                  <div className="grid grid-cols-2 gap-3">
                    {/* Leaves */}
                    <div className="group rounded-xl bg-slate-50/70 hover:bg-white border border-slate-200/80 hover:border-blue-400 p-3 transition-all duration-200 hover:shadow-xs flex flex-col justify-between h-[96px]">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-slate-600 group-hover:text-blue-600 transition-colors">
                          Leaves Taken
                        </span>
                        <div className="w-5 h-5 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center">
                          <CalendarCheck className="w-3 h-3" />
                        </div>
                      </div>
                      <div className="text-2xl font-black text-[#172033] tracking-tight leading-none my-1">
                        {selectedUser.leaveStats?.leaves ?? 1}
                      </div>
                      <div className="flex items-center gap-1 text-[9.5px] font-semibold text-blue-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                        <span>Approved</span>
                      </div>
                    </div>

                    {/* Absents */}
                    <div className="group rounded-xl bg-slate-50/70 hover:bg-white border border-slate-200/80 hover:border-rose-400 p-3 transition-all duration-200 hover:shadow-xs flex flex-col justify-between h-[96px]">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-slate-600 group-hover:text-rose-600 transition-colors">
                          Absents
                        </span>
                        <div className="w-5 h-5 rounded-md bg-rose-50 text-rose-600 flex items-center justify-center">
                          <AlertCircle className="w-3 h-3" />
                        </div>
                      </div>
                      <div className="text-2xl font-black text-[#172033] tracking-tight leading-none my-1">
                        {selectedUser.leaveStats?.absents ?? 3}
                      </div>
                      <div className="flex items-center gap-1 text-[9.5px] font-semibold text-rose-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                        <span>Loss of Pay</span>
                      </div>
                    </div>

                    {/* Sandwiches */}
                    <div className="group rounded-xl bg-slate-50/70 hover:bg-white border border-slate-200/80 hover:border-purple-400 p-3 transition-all duration-200 hover:shadow-xs flex flex-col justify-between h-[96px]">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-slate-600 group-hover:text-purple-600 transition-colors">
                          Sandwiches
                        </span>
                        <div className="w-5 h-5 rounded-md bg-purple-50 text-purple-600 flex items-center justify-center">
                          <Layers className="w-3 h-3" />
                        </div>
                      </div>
                      <div className="text-2xl font-black text-[#172033] tracking-tight leading-none my-1">
                        {selectedUser.leaveStats?.sandwiches ?? 2}
                      </div>
                      <div className="flex items-center gap-1 text-[9.5px] font-semibold text-purple-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                        <span>Bridge Days</span>
                      </div>
                    </div>

                    {/* Bucket */}
                    <div className="group rounded-xl bg-gradient-to-br from-teal-50 to-emerald-50/50 hover:from-teal-100/60 hover:to-emerald-100/70 border border-teal-200 hover:border-teal-400 p-3 transition-all duration-200 hover:shadow-xs flex flex-col justify-between h-[96px]">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-teal-900">
                          Leave Bucket
                        </span>
                        <div className="w-5 h-5 rounded-md bg-[#008080] text-white flex items-center justify-center shadow-2xs">
                          <Wallet className="w-3 h-3" />
                        </div>
                      </div>
                      <div className="text-2xl font-black text-teal-950 tracking-tight leading-none my-1">
                        {selectedUser.leaveStats?.bucket ?? 0}
                      </div>
                      <div className="flex items-center gap-1 text-[9.5px] font-bold text-[#008080]">
                        <span className="w-1.5 h-1.5 rounded-full bg-teal-600" />
                        <span>Paid Balance</span>
                      </div>
                    </div>
                  </div>

                  {/* Accrual Policy Note */}
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-teal-50/60 border border-teal-200/70 text-teal-900">
                    <div className="w-5 h-5 rounded-md bg-[#008080] text-white flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-3 h-3" />
                    </div>
                    <p className="text-[11px] font-medium leading-tight">
                      <span className="font-bold text-teal-950">Accrual Policy:</span> 1 Paid leave is automatically credited to the employee bucket on the 1st of every month.
                    </p>
                  </div>
                </div>

                {/* 2nd POSITION: Employment & Organizational Info */}
                <div className="p-4 rounded-2xl border border-[#E5EAF2] bg-white shadow-2xs space-y-3">
                  <div className="flex items-center gap-2 pb-2 border-b border-[#F1F5F9]">
                    <Briefcase className="w-4 h-4 text-[#2563EB]" />
                    <h4 className="text-xs font-bold text-[#172033] uppercase tracking-wider">
                      Employment & Organizational Info
                    </h4>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between items-center py-1.5 border-b border-[#F8FAFC]">
                      <span className="text-[#8292AD] font-medium">Designation:</span>
                      <span className="font-bold text-[#172033]">{selectedUser.designation || 'Web Designer'}</span>
                    </div>

                    <div className="flex justify-between items-center py-1.5 border-b border-[#F8FAFC]">
                      <span className="text-[#8292AD] font-medium">Joining Date:</span>
                      <span className="font-bold text-[#172033]">{selectedUser.joiningDate || 'Wed, 13-Nov-24'}</span>
                    </div>

                    <div className="flex justify-between items-center py-1.5 border-b border-[#F8FAFC]">
                      <span className="text-[#8292AD] font-medium">Exit Date:</span>
                      <span className={`font-bold ${selectedUser.exitDate && selectedUser.exitDate !== '—' ? 'text-rose-600' : 'text-[#172033]'}`}>
                        {selectedUser.exitDate || '—'}
                      </span>
                    </div>

                    <div className="flex justify-between items-center py-1.5 border-b border-[#F8FAFC]">
                      <span className="text-[#8292AD] font-medium">Exit Reason:</span>
                      <span className="font-bold text-[#172033]">{selectedUser.exitReason || '—'}</span>
                    </div>

                    <div className="flex justify-between items-center py-1.5 border-b border-[#F8FAFC]">
                      <span className="text-[#8292AD] font-medium">Full N' Final:</span>
                      <span className="font-bold text-[#172033]">{selectedUser.fullAndFinal || 'No'}</span>
                    </div>

                    <div className="flex justify-between items-center py-1.5 border-b border-[#F8FAFC]">
                      <span className="text-[#8292AD] font-medium">PF Percent:</span>
                      <span className="font-bold text-[#172033]">{selectedUser.pfPercent || '%'}</span>
                    </div>

                    <div className="flex justify-between items-center py-1.5 border-b border-[#F8FAFC]">
                      <span className="text-[#8292AD] font-medium">Reporting To:</span>
                      <span className="font-bold text-indigo-700">{selectedUser.reportingTo || selectedUser.reportTo || 'Vivek Kumar Singh'}</span>
                    </div>

                    {/* Managers list */}
                    <div className="pt-2">
                      <span className="text-[#8292AD] font-medium block mb-1">Managers:</span>
                      <div className="space-y-1.5 bg-[#F8FAFC] p-2.5 rounded-xl border border-[#E5EAF2]">
                        {(selectedUser.managers || [
                          { name: 'Vivek Kumar Singh', email: 'vivek@codeflies.com' },
                          { name: 'Anurag Tyagi', email: 'anurag@codeflies.com' },
                          { name: 'Bhupinderjit Singh', email: 'bhupinder@codeflies.com' },
                          { name: 'Dharmesh Kumar', email: 'dharmesh@codeflies.com' },
                        ]).map((mgr) => (
                          <div key={mgr.email} className="flex justify-between items-center text-[11px]">
                            <span className="font-bold text-[#172033]">{mgr.name}</span>
                            <span className="text-slate-500 font-medium">{mgr.email}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* COLUMN 3: Salaries & Verified Documents Dossier */}
              <div className="space-y-4">
                {/* Salaries Section */}
                <div className="p-4 rounded-2xl border border-[#E5EAF2] bg-white shadow-2xs space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-[#F1F5F9]">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-emerald-600" />
                      <h4 className="text-xs font-bold text-[#172033] uppercase tracking-wider">Salaries</h4>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleOpenSalaryModal(selectedUser)}
                      className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-lg text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-200 cursor-pointer transition-colors shadow-2xs"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-[#008080]" />
                      <span>Edit / Add</span>
                    </button>
                  </div>

                  {/* Current Active Salary Card */}
                  <div className="p-3 bg-gradient-to-r from-blue-50/90 to-indigo-50/90 border border-blue-200/90 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-[#2563EB] text-white flex items-center justify-center font-black text-sm shadow-2xs">
                        ₹
                      </div>
                      <div>
                        <div className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">
                          Current Active Salary
                        </div>
                        <div className="text-sm font-black text-blue-950">
                          {selectedUser.currentSalary || '₹ 40,000.00'}
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleOpenSalaryModal(selectedUser)}
                      className="px-2.5 py-1 text-[11px] font-bold text-[#2563EB] bg-white hover:bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                    >
                      <span>Update</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Revision History */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-bold text-[#8292AD] uppercase tracking-wider flex items-center gap-1.5">
                        <History className="w-3.5 h-3.5 text-slate-400" />
                        <span>Revision History</span>
                      </span>
                      <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                        {(selectedUser.salaryHistory || []).length} Records
                      </span>
                    </div>

                    <div className="space-y-2">
                      {(selectedUser.salaryHistory && selectedUser.salaryHistory.length > 0 ? selectedUser.salaryHistory : [
                        { amount: '₹ 35,000.00', date: 'Wed, 13-Nov-24 12:05 pm', reason: 'Initial Compensation' },
                        { amount: '₹ 40,000.00', date: 'Fri, 22-May-26 03:47 pm', reason: 'Annual Appraisal' },
                      ]).map((sal, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-2.5 bg-[#F8FAFC] border border-[#E5EAF2] hover:border-blue-200 rounded-xl text-xs transition-colors group"
                        >
                          <div className="min-w-0 flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center font-bold text-xs flex-shrink-0">
                              ₹
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-black text-[#172033] text-sm">{sal.amount}</span>
                                {sal.reason && (
                                  <span className="text-[9.5px] font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 truncate">
                                    {sal.reason}
                                  </span>
                                )}
                              </div>
                              <div className="text-[10px] text-[#8292AD] font-medium mt-0.5">{sal.date}</div>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleDeleteSalaryRevision(idx)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-rose-500 transition-colors cursor-pointer"
                            title="Delete Salary Revision"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* All Verified Documents Dossier */}
                <div className="p-4 rounded-2xl border border-[#E5EAF2] bg-white shadow-2xs space-y-3">
                  <div className="flex items-center justify-between pb-2.5 border-b border-[#F1F5F9]">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#2563EB]" />
                      <h4 className="text-xs font-bold text-[#172033] uppercase tracking-wider">
                        Documents ({selectedUser.documents?.length || 0})
                      </h4>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowDocUploadModal(true)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-[#008080] hover:bg-[#006666] text-white shadow-xs transition-colors cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit / Upload</span>
                    </button>
                  </div>

                {selectedUser.documents && selectedUser.documents.length > 0 ? (
                  <div className="space-y-2.5">
                    {selectedUser.documents.map((doc) => (
                      <div
                        key={doc.id || doc.name}
                        className="flex items-center justify-between p-3 rounded-xl border border-[#E5EAF2] hover:border-blue-200 hover:bg-[#F8FAFC] transition-all bg-white group"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center flex-shrink-0 font-black text-[11px] border border-red-100">
                            PDF
                          </div>
                          <div className="min-w-0">
                            <div
                              className="font-bold text-xs text-[#172033] truncate group-hover:text-[#2563EB] cursor-pointer"
                              title={doc.name}
                              onClick={() => handleDownloadDoc(doc)}
                            >
                              {doc.name}
                            </div>
                            <div className="text-[10px] text-[#8292AD] font-medium flex items-center gap-1.5 mt-0.5">
                              <span>{doc.size || '2.1 MB'}</span>
                              <span>•</span>
                              <span>{doc.uploadDate || 'Verified'}</span>
                              <span>•</span>
                              <span className="text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                                {doc.status || 'Verified'}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 flex-shrink-0">
                          <button
                            type="button"
                            onClick={() => handleDownloadDoc(doc)}
                            title="Download file"
                            className="p-1.5 rounded-lg text-[#64748B] hover:text-[#2563EB] hover:bg-slate-100 transition-colors cursor-pointer"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveDoc(doc.id)}
                            title="Delete file"
                            className="p-1.5 rounded-lg text-[#64748B] hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  /* Empty state matching media_1794377794800_36777d94.jpg */
                  <div className="py-14 px-4 text-center border-2 border-dashed border-red-200 rounded-2xl bg-red-50/30 flex flex-col items-center justify-center">
                    <FileText className="w-10 h-10 text-red-400 mb-3" />
                    <h5 className="text-lg font-black text-[#DC2626] tracking-tight">
                      No Documents Uploaded
                    </h5>
                    <p className="text-xs text-slate-500 mt-1 max-w-xs">
                      No official credentials or agreements attached for this employee yet.
                    </p>
                    <button
                      type="button"
                      onClick={() => setShowDocUploadModal(true)}
                      className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-[#008080] hover:bg-[#006666] text-white shadow-xs cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Upload Documents Now</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Modal>
      )}

      {/* Edit / Add Salary Modal */}
      {showSalaryModal && selectedUser && (
        <Modal
          isOpen={showSalaryModal}
          onClose={() => setShowSalaryModal(false)}
          title="Manage Salary & Compensation"
          subtitle={`Update active salary and revision history for ${selectedUser.name}`}
          maxWidth="max-w-lg"
        >
          <form onSubmit={handleSaveSalary} className="space-y-4">
            {/* Current Base Salary */}
            <div className="p-3.5 bg-gradient-to-br from-blue-50/80 to-indigo-50/80 border border-blue-200 rounded-2xl space-y-1.5">
              <label className="block text-xs font-bold text-blue-950">
                Active Monthly Salary *
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-black text-[#2563EB]">
                  ₹
                </span>
                <input
                  type="text"
                  required
                  value={salaryCurrentAmount}
                  onChange={(e) => setSalaryCurrentAmount(e.target.value)}
                  placeholder="e.g. 40000"
                  className="w-full pl-8 pr-3 py-2 text-sm font-black text-slate-900 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 bg-white shadow-2xs"
                />
              </div>
              <p className="text-[10.5px] text-blue-700 font-medium">
                This amount will be displayed as the primary active CTC in directory & payslips.
              </p>
            </div>

            {/* Add New Salary Revision (Appraisal / Increment) */}
            <div className="p-3.5 border border-[#E5EAF2] rounded-2xl bg-[#F8FAFC] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#172033] flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                  <span>Log New Salary Revision / Appraisal</span>
                </span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  Optional
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-bold text-[#64748B] mb-1">
                    Revised Amount (₹)
                  </label>
                  <input
                    type="text"
                    value={newSalaryRevisionAmount}
                    onChange={(e) => setNewSalaryRevisionAmount(e.target.value)}
                    placeholder="e.g. 45000"
                    className="w-full px-3 py-1.5 text-xs border border-[#CBD5E1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#64748B] mb-1">
                    Effective Date & Time
                  </label>
                  <input
                    type="text"
                    value={newSalaryRevisionDate}
                    onChange={(e) => setNewSalaryRevisionDate(e.target.value)}
                    placeholder="e.g. 11 Nov, 2026 12:00 pm"
                    className="w-full px-3 py-1.5 text-xs border border-[#CBD5E1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#64748B] mb-1">
                  Reason / Revision Note
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSalaryRevisionReason}
                    onChange={(e) => setNewSalaryRevisionReason(e.target.value)}
                    placeholder="e.g. Annual Appraisal / Promotion"
                    className="flex-1 px-3 py-1.5 text-xs border border-[#CBD5E1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 bg-white"
                  />
                  <button
                    type="button"
                    onClick={handleAddRevisionInModal}
                    className="px-3 py-1.5 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs transition-colors cursor-pointer flex-shrink-0"
                  >
                    + Add to Timeline
                  </button>
                </div>
              </div>
            </div>

            {/* Existing Timeline */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-[#172033]">
                <span className="flex items-center gap-1.5">
                  <History className="w-3.5 h-3.5 text-slate-400" />
                  <span>Salary History Timeline</span>
                </span>
                <span className="text-[10px] text-slate-500 font-bold bg-slate-100 px-2 py-0.5 rounded-full">
                  {salaryHistoryList.length} Record{salaryHistoryList.length === 1 ? '' : 's'}
                </span>
              </div>

              <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1">
                {salaryHistoryList.length > 0 ? (
                  salaryHistoryList.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2.5 rounded-xl border border-[#E5EAF2] hover:border-blue-200 bg-white text-xs transition-colors"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center font-bold text-[11px] flex-shrink-0">
                          ₹
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="font-black text-slate-900">{item.amount}</span>
                            {item.reason && (
                              <span className="text-[9.5px] font-bold text-slate-600 bg-slate-100 px-1.5 py-0.2 rounded truncate">
                                {item.reason}
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-[#8292AD] font-medium">{item.date}</div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSalaryHistoryList((prev) => prev.filter((_, i) => i !== idx))}
                        className="text-slate-400 hover:text-rose-600 p-1 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Remove revision"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 italic text-center py-3 bg-[#F8FAFC] rounded-xl border border-dashed border-[#E5EAF2]">
                    No historical revisions found. Add a new revision above.
                  </p>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-2 pt-3 border-t border-[#E5EAF2]">
              <button
                type="button"
                onClick={() => setShowSalaryModal(false)}
                className="px-4 py-2 text-xs font-semibold rounded-xl border border-[#E5EAF2] text-[#64748B] hover:bg-[#F8FAFC] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold rounded-xl bg-[#008080] hover:bg-[#006666] text-white shadow-xs cursor-pointer transition-colors"
              >
                Save Compensation Details
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Upload Document Modal */}
      {showDocUploadModal && (
        <Modal
          isOpen={showDocUploadModal}
          onClose={() => setShowDocUploadModal(false)}
          title="Upload Bio Document"
          subtitle={`Attach official credential or agreement to ${selectedUser?.name}'s dossier`}
          maxWidth="max-w-md"
        >
          <form onSubmit={handleAddDocument} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#172033] mb-1">
                Document Title *
              </label>
              <input
                type="text"
                required
                value={newDocName}
                onChange={(e) => setNewDocName(e.target.value)}
                placeholder="e.g. Passport ID Proof.pdf"
                className="w-full px-3 py-2 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#172033] mb-1">
                Document Category
              </label>
              <select
                value={newDocType}
                onChange={(e) => setNewDocType(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 bg-white"
              >
                <option value="Identity Proof">Identity Proof (Aadhar/Passport)</option>
                <option value="Academic Certificate">Academic Certificate / Degree</option>
                <option value="Employment Contract">Employment Contract & Offer</option>
                <option value="Experience Letter">Experience & Relieving Letter</option>
                <option value="Banking & Tax">Banking & Tax Documents</option>
              </select>
            </div>

            {/* Dropzone mockup */}
            <div className="border-2 border-dashed border-[#CBD5E1] rounded-2xl p-4 text-center bg-[#F8FAFC] hover:bg-blue-50/50 transition-colors cursor-pointer">
              <Upload className="w-6 h-6 text-[#2563EB] mx-auto mb-1 stroke-[1.8]" />
              <p className="text-xs font-bold text-[#172033]">
                Click or drag & drop document file
              </p>
              <p className="text-[10px] text-[#8292AD] mt-0.5">
                PDF, PNG, JPG up to 10MB
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#E5EAF2]">
              <button
                type="button"
                onClick={() => setShowDocUploadModal(false)}
                className="px-4 py-1.5 text-xs rounded-xl border border-[#E5EAF2] text-[#8292AD] hover:bg-[#F7F9FC] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-semibold rounded-xl bg-[#2563EB] text-white hover:bg-blue-700 shadow-sm cursor-pointer"
              >
                Save Document
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {deleteEmployee && (
        <Modal
          isOpen={!!deleteEmployee}
          onClose={() => setDeleteEmployee(null)}
          title="Delete Employee Record"
          subtitle="Are you sure you want to permanently delete this user?"
          maxWidth="max-w-md"
        >
          <div className="space-y-4">
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-rose-800">
                <p className="font-bold">Permanent Deletion Warning</p>
                <p className="mt-0.5">
                  Deleting <span className="font-bold">{deleteEmployee.name}</span> ({deleteEmployee.id}) will remove their account, profile data, and access permissions.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#E5EAF2]">
              <button
                type="button"
                onClick={() => setDeleteEmployee(null)}
                className="px-4 py-1.5 text-xs rounded-xl border border-[#E5EAF2] text-[#8292AD] hover:bg-[#F7F9FC] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDeleteEmployee(deleteEmployee)}
                className="px-4 py-1.5 text-xs font-semibold rounded-xl bg-rose-600 text-white hover:bg-rose-700 shadow-sm cursor-pointer"
              >
                Delete Record
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
