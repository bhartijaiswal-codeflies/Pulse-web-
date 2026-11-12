import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Calendar,
  Shield,
  Key,
  Bell,
  Lock,
  Edit2,
  Check,
  Building,
  Camera,
  Copy,
  ExternalLink,
  Download,
  Share2,
  Clock,
  Smartphone,
  Laptop,
  Ticket,
  FileText,
  CheckCircle2,
  AlertCircle,
  Trash2,
  Plus,
  Eye,
  Layers,
  Wallet,
  CalendarCheck,
  ArrowUpRight,
  HardDrive,
  ShieldCheck,
  AlertTriangle,
  Upload,
  X,
  CreditCard,
  Users as UsersIcon,
  Award,
  Sparkles,
  Heart,
  Globe,
  Monitor,
  RefreshCw,
} from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { StatusBadge } from '../components/common/StatusBadge';
import { Modal } from '../components/common/Modal';
import { currentUser as defaultUser } from '../data/mockData';
import { employeeService } from '../services/employeeService';
import { assetService } from '../services/assetService';
import { useToast } from '../context/NotificationContext';

const PROFILE_STORAGE_KEY = 'pulse_user_profile_data';

export const Profile = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToast } = useToast();

  // Tab mapping
  const paramTab = searchParams.get('tab');
  const validTabs = ['overview', 'attendance', 'employment', 'assets', 'documents', 'settings'];
  const initialTab = validTabs.includes(paramTab) ? paramTab : 'overview';

  const [activeTab, setActiveTab] = useState(initialTab);

  // Sync tab with URL
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setSearchParams({ tab: tabId });
  };

  // Base profile data from employeeService or mock
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }

    const employees = employeeService.getEmployees();
    const found = employees.find((e) => e.id === 'PLS-10024' || e.name === 'Saurabh H.');

    return {
      ...defaultUser,
      empCode: found?.empCode || 'CFT0010024',
      name: found?.name || 'Saurabh H.',
      designation: found?.designation || 'Senior HR Manager',
      role: 'HR Admin',
      department: found?.department || 'People Operations',
      email: found?.email || 'saurabh.h@pulsehr.com',
      personalEmail: 'saurabh.personal@gmail.com',
      phone: found?.phone || '+1 (555) 234-5678',
      altPhone: found?.altPhone || '+1 (555) 887-2190',
      location: found?.address || 'San Francisco, CA (HQ)',
      residentialAddress: 'Flat no - 209, East Sapphire, Block A, San Francisco, CA 94105',
      permanentAddress: '742 Evergreen Terrace, San Francisco, CA 94107',
      employeeId: found?.id || 'PLS-10024',
      avatar: found?.avatar || defaultUser.avatar,
      joiningDate: found?.joiningDate || '15 Jan, 2022',
      confirmationDate: '15 Jul, 2022',
      dob: found?.dob || 'Thu, 02-Nov-1996',
      gender: 'Male',
      bloodGroup: found?.bloodGroup || 'O+',
      maritalStatus: 'Married',
      citizenship: 'United States',
      languages: 'English (Fluent), Spanish, Hindi',
      reportingTo: found?.reportingTo || 'Vivek Kumar Singh (VP Operations & HR)',
      workMode: 'Hybrid (3 Days In-Office)',
      shiftTiming: '09:30 AM - 06:30 PM PST',
      status: 'Active',
      emergencyContact: found?.emergencyContact || '+91 98765 43210 (Father / Family)',
      father: found?.father || 'Shyam Sunder',
      fatherProfession: found?.fatherProfession || 'Business Executive',
      mother: found?.mother || 'Kalpana',
      motherProfession: found?.motherProfession || 'Educator / Housewife',
      spouseName: 'Elena H.',
      spousePhone: '+1 (555) 991-0022',
      spouseProfession: 'Senior Software Engineer',
      salary: found?.currentSalary || '₹ 40,000.00',
      bankName: 'HDFC Bank Ltd.',
      bankAccount: '•••• •••• •••• 8841',
      ifsc: 'HDFC0001234',
      panNumber: 'ABCPS1234F',
      aadharNumber: '•••• •••• 4029',
      pfUan: '100984712093',
      leaveStats: found?.leaveStats || { leaves: 1, absents: 3, sandwiches: 2, bucket: 0 },
      salaryHistory: found?.salaryHistory || [
        { amount: '₹ 35,000.00', date: 'Wed, 13-Nov-24 12:05 pm', note: 'Annual Performance Appraisal' },
        { amount: '₹ 40,000.00', date: 'Fri, 22-May-26 03:47 pm', note: 'Promotion to Senior HR Manager' },
      ],
    };
  });

  // Save changes to localStorage
  const saveUserData = (updated) => {
    setUser(updated);
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(updated));
  };

  // Documents state
  const [documents, setDocuments] = useState([
    { id: 'DOC-101', name: 'National ID & Aadhar Proof.pdf', type: 'PDF', size: '2.4 MB', uploadDate: '15 Jan, 2024', status: 'Verified' },
    { id: 'DOC-102', name: 'PAN Card Verification.pdf', type: 'PDF', size: '1.1 MB', uploadDate: '15 Jan, 2024', status: 'Verified' },
    { id: 'DOC-103', name: 'Bachelor Degree Transcripts.pdf', type: 'PDF', size: '3.6 MB', uploadDate: '10 Jan, 2024', status: 'Verified' },
    { id: 'DOC-104', name: 'Signed Employment Agreement.pdf', type: 'PDF', size: '1.5 MB', uploadDate: '12 Jan, 2024', status: 'Signed' },
    { id: 'DOC-105', name: 'Previous Experience & Relieving.pdf', type: 'PDF', size: '1.2 MB', uploadDate: '08 Jan, 2024', status: 'Verified' },
    { id: 'DOC-106', name: 'Bank Passbook & Cancelled Cheque.pdf', type: 'PDF', size: '890 KB', uploadDate: '15 Jan, 2024', status: 'Approved' },
  ]);

  // Hardware assets assigned to this employee
  const [assignedAssets, setAssignedAssets] = useState([]);
  const loadAssets = () => {
    const all = assetService.getAssets();
    // Match either Codeflies or Saurabh
    const userAssets = all.filter(
      (a) =>
        a.assignedTo?.toLowerCase().includes('saurabh') ||
        a.assignedTo === 'Codeflies' ||
        a.id === 'AST-1' ||
        a.id === 'AST-2'
    );
    setAssignedAssets(userAssets.slice(0, 3));
  };

  useEffect(() => {
    loadAssets();
  }, []);

  // Modals
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [showDocUploadModal, setShowDocUploadModal] = useState(false);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [showGatePassModal, setShowGatePassModal] = useState(false);
  const [selectedAssetForTicket, setSelectedAssetForTicket] = useState(null);

  // Edit form state
  const [editForm, setEditForm] = useState({ ...user });

  // Photo form state
  const [photoUrl, setPhotoUrl] = useState(user.avatar);

  // Document upload state
  const [docUploadForm, setDocUploadForm] = useState({
    title: '',
    type: 'Identity Proof',
    size: '1.8 MB',
  });

  // Ticket form state
  const [ticketForm, setTicketForm] = useState({
    issue: '',
    priority: 'Normal',
    description: '',
  });

  // Gate pass form state
  const [gatePassForm, setGatePassForm] = useState({
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
    reason: 'Working From Home',
  });

  // Settings states
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [desktopNotifs, setDesktopNotifs] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ current: '', next: '', confirm: '' });

  // Copy helper
  const [copiedKey, setCopiedKey] = useState('');
  const handleCopy = (text, keyName) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(keyName);
    addToast({
      title: 'Copied to Clipboard',
      message: `${text} copied successfully.`,
      type: 'info',
    });
    setTimeout(() => setCopiedKey(''), 2000);
  };

  // Handle Edit Profile Save
  const handleSaveProfile = (e) => {
    e.preventDefault();
    saveUserData(editForm);
    addToast({
      title: 'Profile Updated ✓',
      message: 'Your personal employee details have been successfully saved.',
      type: 'success',
    });
    setShowEditModal(false);
  };

  // Handle Photo Save
  const handleSavePhoto = (e) => {
    e.preventDefault();
    if (!photoUrl.trim()) return;
    saveUserData({ ...user, avatar: photoUrl });
    addToast({
      title: 'Avatar Updated',
      message: 'Your profile picture has been updated.',
      type: 'success',
    });
    setShowPhotoModal(false);
  };

  // Handle Upload Document
  const handleUploadDocument = (e) => {
    e.preventDefault();
    if (!docUploadForm.title.trim()) {
      addToast({ title: 'Title Required', message: 'Please enter a document title.', type: 'warning' });
      return;
    }
    const newDoc = {
      id: `DOC-${Date.now()}`,
      name: `${docUploadForm.title}.pdf`,
      type: 'PDF',
      size: docUploadForm.size || '1.5 MB',
      uploadDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      status: 'Verified',
    };
    setDocuments([newDoc, ...documents]);
    addToast({
      title: 'Document Uploaded',
      message: `${newDoc.name} submitted for verified records.`,
      type: 'success',
    });
    setShowDocUploadModal(false);
    setDocUploadForm({ title: '', type: 'Identity Proof', size: '1.8 MB' });
  };

  // Handle Delete Document
  const handleDeleteDocument = (id, name) => {
    setDocuments(documents.filter((d) => d.id !== id));
    addToast({
      title: 'Document Removed',
      message: `${name} has been deleted.`,
      type: 'info',
    });
  };

  // Handle Password Update
  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (!passwordForm.next || passwordForm.next.length < 8) {
      addToast({ title: 'Weak Password', message: 'Password must be at least 8 characters.', type: 'warning' });
      return;
    }
    if (passwordForm.next !== passwordForm.confirm) {
      addToast({ title: 'Password Mismatch', message: 'New passwords do not match.', type: 'error' });
      return;
    }
    addToast({
      title: 'Security Password Updated',
      message: 'Your portal login password has been changed successfully.',
      type: 'success',
    });
    setPasswordForm({ current: '', next: '', confirm: '' });
  };

  // Handle Ticket Submit
  const handleRaiseTicketSubmit = (e) => {
    e.preventDefault();
    if (!ticketForm.issue.trim()) return;
    assetService.addTicket({
      issue: ticketForm.issue,
      assetId: selectedAssetForTicket?.id || 'AST-1',
      assetName: selectedAssetForTicket?.name || 'MacBook Pro Touch Bar 13.3"',
      assetTag: selectedAssetForTicket?.tag || 'CF-MAC-01',
      submittedBy: user.name,
      priority: ticketForm.priority,
      description: ticketForm.description,
    });
    addToast({
      title: 'Ticket Raised ✓',
      message: `Technical ticket raised for ${selectedAssetForTicket?.name || 'hardware'}.`,
      type: 'success',
    });
    setShowTicketModal(false);
    setTicketForm({ issue: '', priority: 'Normal', description: '' });
  };

  // Handle Gate Pass Submit
  const handleGatePassSubmit = (e) => {
    e.preventDefault();
    assetService.addRequest({
      by: user.name,
      assetId: selectedAssetForTicket?.id || 'AST-1',
      assetName: selectedAssetForTicket?.name || 'MacBook Pro Touch Bar 13.3"',
      assetTag: selectedAssetForTicket?.tag || 'CF-MAC-01',
      startDate: gatePassForm.startDate,
      endDate: gatePassForm.endDate,
      reason: gatePassForm.reason,
    });
    addToast({
      title: 'Gate Pass Requested ✓',
      message: `Take-home pass submitted for IT authorization.`,
      type: 'success',
    });
    setShowGatePassModal(false);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* 1. Page Header */}
      <PageHeader
        title="Admin Profile"
        badgeText="Super Administrator"
        subtitle="Manage personal employee record, organizational credentials, verified documents & security."
        breadcrumbs={[{ label: 'Home', link: '/' }, { label: 'Admin Profile' }]}
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setEditForm({ ...user });
                setShowEditModal(true);
              }}
              className="inline-flex items-center gap-1.5 px-4 h-9 text-xs font-bold rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white shadow-sm transition-all active:scale-95 shadow-blue-500/20 cursor-pointer"
            >
              <Edit2 className="w-3.5 h-3.5 stroke-[2.4]" />
              <span>Edit Profile</span>
            </button>
            <button
              onClick={() => {
                addToast({
                  title: 'Dossier Downloaded',
                  message: `Employee Dossier for ${user.name} (${user.empCode}) generated as PDF.`,
                  type: 'success',
                });
              }}
              className="inline-flex items-center gap-1.5 px-3.5 h-9 text-xs font-bold rounded-xl bg-white border border-[#E5EAF2] text-[#172033] hover:bg-slate-50 shadow-2xs transition-all cursor-pointer"
              title="Download verified HR dossier PDF"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Export PDF</span>
            </button>
          </div>
        }
      />

      {/* 2. Executive Hero Banner Card */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-blue-700 via-indigo-700 to-sky-700 text-white p-6 sm:p-8 shadow-xl border border-blue-500/20">
        {/* Ambient background blur elements */}
        <div className="absolute -right-16 -top-16 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-12 -bottom-12 w-64 h-64 bg-sky-400/15 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Left: Avatar + Identity */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            {/* Avatar with Camera Overlay */}
            <div className="relative group flex-shrink-0">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover ring-4 ring-white/90 shadow-2xl transition-transform group-hover:scale-[1.02]"
              />
              <button
                type="button"
                onClick={() => {
                  setPhotoUrl(user.avatar);
                  setShowPhotoModal(true);
                }}
                className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity text-white text-[10px] font-bold cursor-pointer backdrop-blur-2xs"
                title="Change profile photo"
              >
                <Camera className="w-5 h-5 mb-0.5" />
                <span>Update</span>
              </button>
              {/* Online Green Indicator */}
              <span
                className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-400 ring-3 ring-white shadow-md flex items-center justify-center"
                title="Status: Active"
              >
                <span className="w-2 h-2 rounded-full bg-white" />
              </span>
            </div>

            {/* Profile Bio Details */}
            <div className="min-w-0">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">{user.name}</h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-white/20 text-white backdrop-blur-sm border border-white/25">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                  <span>{user.role}</span>
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-bold bg-emerald-500/25 text-emerald-200 border border-emerald-400/40">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{user.status}</span>
                </span>
              </div>

              <p className="text-sm font-semibold text-blue-100 mt-1 flex items-center gap-2">
                <span>{user.designation}</span>
                <span>•</span>
                <span className="text-blue-200">{user.department}</span>
              </p>

              {/* Meta details strip with 1-click copy */}
              <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-blue-100/90 mt-3 font-medium">
                <button
                  type="button"
                  onClick={() => handleCopy(user.empCode, 'code')}
                  className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
                  title="Click to copy employee code"
                >
                  <span className="font-mono font-bold text-white">{user.empCode}</span>
                  {copiedKey === 'code' ? (
                    <Check className="w-3 h-3 text-emerald-300" />
                  ) : (
                    <Copy className="w-3 h-3 opacity-70" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => handleCopy(user.email, 'email')}
                  className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
                  title="Click to copy work email"
                >
                  <Mail className="w-3.5 h-3.5 text-blue-200" />
                  <span>{user.email}</span>
                </button>

                <a
                  href={`tel:${user.phone}`}
                  className="flex items-center gap-1.5 hover:text-white transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-blue-200" />
                  <span>{user.phone}</span>
                </a>

                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-blue-200" />
                  <span>{user.location}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Right: Quick Highlights / Reporting To */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end justify-between gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-white/20">
            <div className="text-left lg:text-right">
              <span className="text-[11px] font-semibold text-blue-200 uppercase tracking-wider block">
                Reporting Manager
              </span>
              <span className="text-sm font-extrabold text-white mt-0.5 block">{user.reportingTo}</span>
              <span className="text-[11px] text-blue-200 block mt-0.5">
                Work Mode: <strong className="text-white">{user.workMode}</strong>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  addToast({ title: 'Profile Link Copied', message: 'Direct URL to profile copied.', type: 'info' });
                }}
                className="px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold transition-all border border-white/20 flex items-center gap-1.5 cursor-pointer backdrop-blur-xs"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Metrics Pill Bar */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-5 mt-6 border-t border-white/15 text-xs">
          <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-xs border border-white/15">
            <span className="text-[10px] font-semibold text-blue-200 uppercase block">Tenure at Pulse</span>
            <span className="text-sm font-black text-white mt-0.5 block">4 Yrs, 10 Mos</span>
            <span className="text-[10px] text-blue-200">Joined {user.joiningDate}</span>
          </div>

          <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-xs border border-white/15">
            <span className="text-[10px] font-semibold text-blue-200 uppercase block">Leave Balance</span>
            <span className="text-sm font-black text-white mt-0.5 block">14.5 Days</span>
            <span className="text-[10px] text-emerald-300">Paid Leave Bucket</span>
          </div>

          <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-xs border border-white/15">
            <span className="text-[10px] font-semibold text-blue-200 uppercase block">Quarter Attendance</span>
            <span className="text-sm font-black text-white mt-0.5 block">96.8%</span>
            <span className="text-[10px] text-blue-200">On-Time Punch Record</span>
          </div>

          <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-xs border border-white/15">
            <span className="text-[10px] font-semibold text-blue-200 uppercase block">Assigned Hardware</span>
            <span className="text-sm font-black text-white mt-0.5 block">
              {assignedAssets.length > 0 ? `${assignedAssets.length} Units` : '2 Units'}
            </span>
            <span className="text-[10px] text-blue-200">MacBook & Accessories</span>
          </div>
        </div>
      </div>

      {/* 3. High-Precision Navigation Tabs Bar */}
      <div className="flex items-center gap-1.5 border-b border-[#E5EAF2] pb-1 overflow-x-auto select-none no-scrollbar">
        {[
          { id: 'overview', label: 'Overview & Bio', icon: User },
          { id: 'attendance', label: 'Attendance & Leaves', icon: Calendar, badge: 'Live Month' },
          { id: 'employment', label: 'Job & Compensation', icon: Briefcase, badge: user.salary },
          { id: 'assets', label: 'Hardware Assets', icon: Laptop, badge: `${assignedAssets.length}` },
          { id: 'documents', label: 'Verified Documents', icon: FileText, badge: `${documents.length}` },
          { id: 'settings', label: 'Security & Access', icon: Shield, badge: '2FA On' },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-2xl whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#2563EB] text-white shadow-md shadow-blue-500/25 scale-[1.02]'
                  : 'text-[#8292AD] hover:text-[#172033] hover:bg-white border border-transparent hover:border-[#E5EAF2]'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-[#8292AD]'}`} />
              <span>{tab.label}</span>
              {tab.badge && (
                <span
                  className={`text-[9.5px] font-extrabold px-1.5 py-0.2 rounded-full leading-tight ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* TAB CONTENT SECTIONS                                                      */}
      {/* ========================================================================= */}

      {/* TAB 1: OVERVIEW & PERSONAL BIO */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Column 1: Personal Demographic Details */}
          <div className="bg-white border border-[#E5EAF2] rounded-2xl p-5 shadow-card space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5EAF2]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center font-bold">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-extrabold text-[#172033] uppercase tracking-wider">Demographic Profile</h3>
                  <p className="text-[10px] text-[#8292AD]">Verified personal employee identity</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEditForm({ ...user });
                  setShowEditModal(true);
                }}
                className="text-[#2563EB] hover:text-blue-700 text-xs font-bold flex items-center gap-1 cursor-pointer"
              >
                <Edit2 className="w-3 h-3" />
                <span>Edit</span>
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-[#F7F9FC]">
                <span className="text-[#8292AD] font-medium">Full Legal Name</span>
                <span className="font-bold text-[#172033]">{user.name}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#F7F9FC]">
                <span className="text-[#8292AD] font-medium">Employee Code</span>
                <span className="font-mono font-bold text-[#2563EB]">{user.empCode}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#F7F9FC]">
                <span className="text-[#8292AD] font-medium">Date of Birth</span>
                <span className="font-semibold text-[#172033]">{user.dob}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#F7F9FC]">
                <span className="text-[#8292AD] font-medium">Gender</span>
                <span className="font-semibold text-[#172033]">{user.gender}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#F7F9FC]">
                <span className="text-[#8292AD] font-medium">Blood Group</span>
                <span className="font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-100">
                  {user.bloodGroup}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#F7F9FC]">
                <span className="text-[#8292AD] font-medium">Marital Status</span>
                <span className="font-semibold text-[#172033]">{user.maritalStatus}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#F7F9FC]">
                <span className="text-[#8292AD] font-medium">Citizenship</span>
                <span className="font-semibold text-[#172033]">{user.citizenship}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-[#8292AD] font-medium">Spoken Languages</span>
                <span className="font-semibold text-[#172033] text-right">{user.languages}</span>
              </div>
            </div>
          </div>

          {/* Column 2: Contact & Addresses */}
          <div className="bg-white border border-[#E5EAF2] rounded-2xl p-5 shadow-card space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5EAF2]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-extrabold text-[#172033] uppercase tracking-wider">Contact & Location</h3>
                  <p className="text-[10px] text-[#8292AD]">Direct communication channels</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEditForm({ ...user });
                  setShowEditModal(true);
                }}
                className="text-[#2563EB] hover:text-blue-700 text-xs font-bold flex items-center gap-1 cursor-pointer"
              >
                <Edit2 className="w-3 h-3" />
                <span>Edit</span>
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-[#F7F9FC]">
                <span className="text-[#8292AD] font-medium">Work Email</span>
                <button
                  type="button"
                  onClick={() => handleCopy(user.email, 'work-email')}
                  className="font-semibold text-[#2563EB] hover:underline flex items-center gap-1"
                >
                  <span>{user.email}</span>
                  <Copy className="w-3 h-3 opacity-60" />
                </button>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#F7F9FC]">
                <span className="text-[#8292AD] font-medium">Personal Email</span>
                <span className="font-semibold text-[#172033]">{user.personalEmail}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#F7F9FC]">
                <span className="text-[#8292AD] font-medium">Primary Mobile</span>
                <span className="font-semibold text-[#172033]">{user.phone}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#F7F9FC]">
                <span className="text-[#8292AD] font-medium">Alternate Phone</span>
                <span className="font-semibold text-[#172033]">{user.altPhone}</span>
              </div>
              <div className="py-1.5 border-b border-[#F7F9FC]">
                <span className="text-[#8292AD] font-medium block mb-1">Residential Address</span>
                <span className="font-semibold text-[#172033] block leading-relaxed">{user.residentialAddress}</span>
              </div>
              <div className="py-1.5">
                <span className="text-[#8292AD] font-medium block mb-1">Permanent Home Address</span>
                <span className="font-semibold text-[#172033] block leading-relaxed">{user.permanentAddress}</span>
              </div>
            </div>
          </div>

          {/* Column 3: Family & Emergency Contact */}
          <div className="bg-white border border-[#E5EAF2] rounded-2xl p-5 shadow-card space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5EAF2]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                  <Heart className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-extrabold text-[#172033] uppercase tracking-wider">Family & Emergency</h3>
                  <p className="text-[10px] text-[#8292AD]">Emergency kin & family records</p>
                </div>
              </div>
            </div>

            {/* Emergency Contact Highlight Card */}
            <div className="p-3.5 rounded-xl bg-gradient-to-br from-rose-50 to-amber-50/50 border border-rose-200/80">
              <span className="text-[10px] font-bold text-rose-800 uppercase tracking-wider block">
                Primary Emergency Contact
              </span>
              <p className="text-sm font-extrabold text-[#172033] mt-1 flex items-center justify-between">
                <span>{user.emergencyContact}</span>
                <a
                  href={`tel:${user.emergencyContact.replace(/\D/g, '')}`}
                  className="px-2 py-1 rounded-lg bg-rose-600 text-white text-[10px] font-bold hover:bg-rose-700 shadow-2xs"
                >
                  Call
                </a>
              </p>
              <p className="text-[10px] text-rose-700 mt-1">Authorized for urgent medical & safety notifications</p>
            </div>

            <div className="space-y-3 text-xs pt-1">
              <div className="flex justify-between py-1.5 border-b border-[#F7F9FC]">
                <span className="text-[#8292AD] font-medium">Father's Name</span>
                <span className="font-semibold text-[#172033]">{user.father}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#F7F9FC]">
                <span className="text-[#8292AD] font-medium">Father's Profession</span>
                <span className="font-semibold text-[#172033]">{user.fatherProfession}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#F7F9FC]">
                <span className="text-[#8292AD] font-medium">Mother's Name</span>
                <span className="font-semibold text-[#172033]">{user.mother}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#F7F9FC]">
                <span className="text-[#8292AD] font-medium">Mother's Profession</span>
                <span className="font-semibold text-[#172033]">{user.motherProfession}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-[#8292AD] font-medium">Spouse Details</span>
                <span className="font-semibold text-[#172033] text-right">
                  {user.spouseName} ({user.spouseProfession})
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ATTENDANCE & LEAVES */}
      {activeTab === 'attendance' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Card 1: The Iconic 2x2 Live Month Summary Grid */}
            <div className="lg:col-span-2 p-5 rounded-2xl border border-[#E5EAF2] bg-white shadow-card space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9]">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-200/70 text-[#008080] flex items-center justify-center shadow-2xs">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold text-[#172033] tracking-tight">
                      Current Month Leave & Attendance Summary
                    </h4>
                    <p className="text-[10px] text-[#8292AD] font-medium flex items-center gap-1.5 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span>Active Cycle • {new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' })}</span>
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10.5px] font-extrabold bg-teal-50 text-[#008080] border border-teal-200 shadow-2xs">
                  Live Summary
                </span>
              </div>

              {/* 4 Modern Executive Metric Cards (2x2 Grid) */}
              <div className="grid grid-cols-2 gap-3.5">
                {/* Leaves Taken */}
                <div className="group rounded-2xl bg-slate-50/80 hover:bg-white border border-slate-200/90 hover:border-blue-400 p-4 transition-all duration-200 hover:shadow-sm flex flex-col justify-between h-[104px]">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 group-hover:text-blue-600 transition-colors">
                      Leaves Taken
                    </span>
                    <div className="w-6 h-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                      <CalendarCheck className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <div className="text-3xl font-black text-[#172033] tracking-tight leading-none my-1">
                    {user.leaveStats?.leaves ?? 1}
                  </div>
                  <div className="flex items-center gap-1 text-[10px] font-bold text-blue-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    <span>Approved By HR</span>
                  </div>
                </div>

                {/* Absents */}
                <div className="group rounded-2xl bg-slate-50/80 hover:bg-white border border-slate-200/90 hover:border-rose-400 p-4 transition-all duration-200 hover:shadow-sm flex flex-col justify-between h-[104px]">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 group-hover:text-rose-600 transition-colors">
                      Absents
                    </span>
                    <div className="w-6 h-6 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                      <AlertCircle className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <div className="text-3xl font-black text-[#172033] tracking-tight leading-none my-1">
                    {user.leaveStats?.absents ?? 3}
                  </div>
                  <div className="flex items-center gap-1 text-[10px] font-bold text-rose-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                    <span>Loss of Pay</span>
                  </div>
                </div>

                {/* Sandwiches */}
                <div className="group rounded-2xl bg-slate-50/80 hover:bg-white border border-slate-200/90 hover:border-purple-400 p-4 transition-all duration-200 hover:shadow-sm flex flex-col justify-between h-[104px]">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 group-hover:text-purple-600 transition-colors">
                      Sandwiches
                    </span>
                    <div className="w-6 h-6 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                      <Layers className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <div className="text-3xl font-black text-[#172033] tracking-tight leading-none my-1">
                    {user.leaveStats?.sandwiches ?? 2}
                  </div>
                  <div className="flex items-center gap-1 text-[10px] font-bold text-purple-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                    <span>Bridge Days</span>
                  </div>
                </div>

                {/* Leave Bucket */}
                <div className="group rounded-2xl bg-gradient-to-br from-teal-50 to-emerald-50/60 hover:from-teal-100/70 hover:to-emerald-100/80 border border-teal-200 hover:border-teal-400 p-4 transition-all duration-200 hover:shadow-sm flex flex-col justify-between h-[104px]">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-teal-900">Leave Bucket</span>
                    <div className="w-6 h-6 rounded-lg bg-[#008080] text-white flex items-center justify-center shadow-xs">
                      <Wallet className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <div className="text-3xl font-black text-teal-950 tracking-tight leading-none my-1">
                    {user.leaveStats?.bucket ?? 0}
                  </div>
                  <div className="flex items-center gap-1 text-[10px] font-extrabold text-[#008080]">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-600" />
                    <span>Paid Balance Available</span>
                  </div>
                </div>
              </div>

              {/* Accrual Policy Note */}
              <div className="p-3.5 bg-teal-50/60 border border-teal-100 rounded-xl flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-[#008080] flex-shrink-0 mt-0.5" />
                <p className="text-[11px] text-teal-900 font-medium leading-relaxed">
                  <strong className="font-bold">Accrual Policy:</strong> 1 Paid leave is automatically credited to the employee bucket on the 1st of every month. Unused paid leaves carry forward into the subsequent calendar year up to 30 days maximum.
                </p>
              </div>
            </div>

            {/* Card 2: Annual Leave Balances */}
            <div className="p-5 rounded-2xl border border-[#E5EAF2] bg-white shadow-card space-y-4">
              <div className="pb-3 border-b border-[#F1F5F9]">
                <h4 className="text-xs font-extrabold text-[#172033] uppercase tracking-wider">
                  Annual Entitlements
                </h4>
                <p className="text-[10px] text-[#8292AD]">Fiscal Year 2026 Quota</p>
              </div>

              <div className="space-y-3.5 text-xs">
                <div>
                  <div className="flex justify-between text-xs mb-1 font-semibold">
                    <span className="text-slate-700">Casual Leave (CL)</span>
                    <span className="font-bold text-[#172033]">6 / 8 Days</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full" style={{ width: '75%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1 font-semibold">
                    <span className="text-slate-700">Sick Leave (SL)</span>
                    <span className="font-bold text-[#172033]">8 / 10 Days</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: '80%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1 font-semibold">
                    <span className="text-slate-700">Privilege Leave (PL)</span>
                    <span className="font-bold text-[#172033]">12 / 15 Days</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full bg-purple-600 rounded-full" style={{ width: '80%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1 font-semibold">
                    <span className="text-slate-700">Floating Festival Holiday</span>
                    <span className="font-bold text-[#172033]">1 / 2 Days</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: '50%' }} />
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href="/attendance"
                  className="w-full py-2 px-3 rounded-xl bg-slate-50 hover:bg-blue-50 text-[#2563EB] text-xs font-bold text-center block transition-colors border border-slate-200/80"
                >
                  View Full Attendance Dashboard →
                </a>
              </div>
            </div>
          </div>

          {/* Recent 5-Day Attendance Log Table */}
          <div className="bg-white border border-[#E5EAF2] rounded-2xl p-5 shadow-card space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#E5EAF2]">
              <h3 className="text-xs font-extrabold text-[#172033] uppercase tracking-wider">
                Recent 5-Day Clock-In & Shift Log
              </h3>
              <span className="text-[11px] text-[#8292AD]">Standard Hours: 09:30 AM - 06:30 PM</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-[#E5EAF2] text-[#8292AD] text-[10.5px] uppercase">
                    <th className="py-2.5 text-left font-bold">Date</th>
                    <th className="py-2.5 text-left font-bold">Check In</th>
                    <th className="py-2.5 text-left font-bold">Check Out</th>
                    <th className="py-2.5 text-left font-bold">Total Work</th>
                    <th className="py-2.5 text-left font-bold">Location</th>
                    <th className="py-2.5 text-right font-bold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F7F9FC]">
                  {[
                    { date: 'Today, 12 Nov', in: '09:28 AM', out: 'In Progress', hours: '7h 15m', loc: 'San Francisco HQ', status: 'On Time', badge: 'bg-emerald-50 text-emerald-700' },
                    { date: 'Tue, 11 Nov', in: '09:24 AM', out: '06:35 PM', hours: '9h 11m', loc: 'San Francisco HQ', status: 'On Time', badge: 'bg-emerald-50 text-emerald-700' },
                    { date: 'Mon, 10 Nov', in: '09:32 AM', out: '06:30 PM', hours: '8h 58m', loc: 'Remote (Home)', status: 'Remote Work', badge: 'bg-blue-50 text-blue-700' },
                    { date: 'Fri, 07 Nov', in: '09:20 AM', out: '06:40 PM', hours: '9h 20m', loc: 'San Francisco HQ', status: 'On Time', badge: 'bg-emerald-50 text-emerald-700' },
                    { date: 'Thu, 06 Nov', in: '09:45 AM', out: '06:30 PM', hours: '8h 45m', loc: 'San Francisco HQ', status: 'Late Punch', badge: 'bg-amber-50 text-amber-700' },
                  ].map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="py-2.5 font-bold text-[#172033]">{row.date}</td>
                      <td className="py-2.5 text-slate-700 font-semibold">{row.in}</td>
                      <td className="py-2.5 text-slate-700 font-semibold">{row.out}</td>
                      <td className="py-2.5 font-bold text-slate-800">{row.hours}</td>
                      <td className="py-2.5 text-[#8292AD]">{row.loc}</td>
                      <td className="py-2.5 text-right">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${row.badge}`}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: JOB & COMPENSATION */}
      {activeTab === 'employment' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Organizational Placement */}
            <div className="bg-white border border-[#E5EAF2] rounded-2xl p-5 shadow-card space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-[#E5EAF2]">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center font-bold">
                  <Building className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-extrabold text-[#172033] uppercase tracking-wider">
                    Organizational Placement
                  </h3>
                  <p className="text-[10px] text-[#8292AD]">Corporate title and department hierarchy</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl border border-[#E5EAF2] bg-[#FBFDFE]">
                  <span className="text-[#8292AD] text-[10.5px] block font-medium">Assigned Department</span>
                  <span className="text-sm font-bold text-[#172033] mt-0.5 block">{user.department}</span>
                </div>
                <div className="p-3 rounded-xl border border-[#E5EAF2] bg-[#FBFDFE]">
                  <span className="text-[#8292AD] text-[10.5px] block font-medium">Corporate Designation</span>
                  <span className="text-sm font-bold text-[#172033] mt-0.5 block">{user.designation}</span>
                </div>
                <div className="p-3 rounded-xl border border-[#E5EAF2] bg-[#FBFDFE]">
                  <span className="text-[#8292AD] text-[10.5px] block font-medium">Access Role Tier</span>
                  <span className="text-sm font-bold text-[#2563EB] mt-0.5 block">{user.role}</span>
                </div>
                <div className="p-3 rounded-xl border border-[#E5EAF2] bg-[#FBFDFE]">
                  <span className="text-[#8292AD] text-[10.5px] block font-medium">Employment Type</span>
                  <span className="text-sm font-bold text-[#172033] mt-0.5 block">Full-Time Permanent (W-2)</span>
                </div>
                <div className="p-3 rounded-xl border border-[#E5EAF2] bg-[#FBFDFE]">
                  <span className="text-[#8292AD] text-[10.5px] block font-medium">Work Mode</span>
                  <span className="text-sm font-bold text-[#172033] mt-0.5 block">{user.workMode}</span>
                </div>
                <div className="p-3 rounded-xl border border-[#E5EAF2] bg-[#FBFDFE]">
                  <span className="text-[#8292AD] text-[10.5px] block font-medium">Probation Status</span>
                  <span className="text-sm font-bold text-emerald-600 mt-0.5 block">Confirmed (Completed)</span>
                </div>
              </div>
            </div>

            {/* Reporting Hierarchy */}
            <div className="bg-white border border-[#E5EAF2] rounded-2xl p-5 shadow-card space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-[#E5EAF2]">
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                  <UsersIcon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-extrabold text-[#172033] uppercase tracking-wider">
                    Reporting Chain & Leadership
                  </h3>
                  <p className="text-[10px] text-[#8292AD]">Direct reporting manager & administrative lines</p>
                </div>
              </div>

              {/* Manager Card */}
              <div className="p-4 rounded-xl border border-purple-200 bg-purple-50/40 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-purple-600 text-white font-bold flex items-center justify-center text-sm shadow-sm">
                    VS
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-purple-800 uppercase tracking-wider">
                      Reporting Manager
                    </span>
                    <h4 className="text-sm font-black text-[#172033]">{user.reportingTo}</h4>
                    <p className="text-[11px] text-slate-500">VP of People Operations • vivek@codeflies.com</p>
                  </div>
                </div>
                <a
                  href="mailto:vivek@codeflies.com"
                  className="px-3 py-1.5 rounded-lg bg-white border border-purple-200 text-purple-700 hover:bg-purple-100 text-xs font-bold transition-colors"
                >
                  Message
                </a>
              </div>

              <div className="space-y-2 text-xs pt-1">
                <div className="flex justify-between py-1.5 border-b border-[#F7F9FC]">
                  <span className="text-[#8292AD]">Official Shift Timings</span>
                  <span className="font-semibold text-[#172033]">{user.shiftTiming}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#F7F9FC]">
                  <span className="text-[#8292AD]">Date of Joining</span>
                  <span className="font-semibold text-[#172033]">{user.joiningDate}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#F7F9FC]">
                  <span className="text-[#8292AD]">Confirmation Date</span>
                  <span className="font-semibold text-[#172033]">{user.confirmationDate}</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-[#8292AD]">Direct Team Size</span>
                  <span className="font-bold text-[#2563EB]">6 Team Members</span>
                </div>
              </div>
            </div>
          </div>

          {/* Salaries & Compensation Section */}
          <div className="bg-white border border-[#E5EAF2] rounded-2xl p-5 shadow-card space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5EAF2]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-extrabold text-[#172033] uppercase tracking-wider">
                    Compensation & Payroll Record
                  </h3>
                  <p className="text-[10px] text-[#8292AD]">Active monthly salary & revision history</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Direct Deposit Active
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Active Salary Box */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50/60 border border-emerald-200 flex flex-col justify-between">
                <div>
                  <span className="text-[10.5px] font-bold text-emerald-800 uppercase tracking-wider">
                    Current Monthly Active Salary
                  </span>
                  <div className="text-2xl font-black text-emerald-950 mt-1">{user.salary}</div>
                  <p className="text-[11px] text-emerald-800 mt-1">Disbursed on 1st of every calendar month</p>
                </div>
                <div className="pt-3 border-t border-emerald-200/70 mt-3 text-[11px] text-emerald-900">
                  <span>Bank: <strong>{user.bankName}</strong> ({user.bankAccount})</span>
                </div>
              </div>

              {/* Revision History 1 */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                <div>
                  <span className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider">
                    Latest Revision • Promotion
                  </span>
                  <div className="text-xl font-extrabold text-[#172033] mt-1">₹ 40,000.00</div>
                  <p className="text-[11px] text-slate-600 mt-1">Fri, 22-May-26 03:47 pm</p>
                </div>
                <span className="text-[10px] font-bold text-blue-600 mt-3">Promoted to Senior HR Manager</span>
              </div>

              {/* Revision History 2 */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                <div>
                  <span className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider">
                    Initial Base • Joining
                  </span>
                  <div className="text-xl font-extrabold text-[#172033] mt-1">₹ 35,000.00</div>
                  <p className="text-[11px] text-slate-600 mt-1">Wed, 13-Nov-24 12:05 pm</p>
                </div>
                <span className="text-[10px] font-semibold text-slate-500 mt-3">Standard Joining Package</span>
              </div>
            </div>

            {/* Statutory Details Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
              <div className="p-2.5 rounded-xl border border-[#E5EAF2] bg-[#FCFDFE]">
                <span className="text-[#8292AD] text-[10px] block">PAN Number</span>
                <span className="font-mono font-bold text-[#172033]">{user.panNumber}</span>
              </div>
              <div className="p-2.5 rounded-xl border border-[#E5EAF2] bg-[#FCFDFE]">
                <span className="text-[#8292AD] text-[10px] block">PF / UAN Number</span>
                <span className="font-mono font-bold text-[#172033]">{user.pfUan}</span>
              </div>
              <div className="p-2.5 rounded-xl border border-[#E5EAF2] bg-[#FCFDFE]">
                <span className="text-[#8292AD] text-[10px] block">Tax Regime</span>
                <span className="font-bold text-emerald-700">New Regime (FY 26-27)</span>
              </div>
              <div className="p-2.5 rounded-xl border border-[#E5EAF2] bg-[#FCFDFE]">
                <span className="text-[#8292AD] text-[10px] block">Medical Insurance</span>
                <span className="font-bold text-[#2563EB]">₹ 5,00,000 Covered</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: HARDWARE & ASSETS */}
      {activeTab === 'assets' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-extrabold text-[#172033]">Assigned Hardware & IT Assets</h3>
              <p className="text-xs text-[#8292AD]">Laptops, accessories and company devices issued to this account</p>
            </div>
            <a
              href="/assets"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-slate-100 hover:bg-slate-200 text-[#172033] transition-colors"
            >
              <span>View Full Assets Directory</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {assignedAssets.map((asset) => {
              const displayImg = asset.images?.[0] || asset.image;
              return (
                <div
                  key={asset.id}
                  className="bg-white border border-[#E5EAF2] rounded-2xl overflow-hidden shadow-card flex flex-col justify-between"
                >
                  <div>
                    {/* Image / Thumbnail Container */}
                    <div className="h-44 w-full bg-slate-100 relative overflow-hidden flex items-center justify-center">
                      {displayImg ? (
                        <img
                          src={displayImg}
                          alt={asset.name}
                          className="w-full h-full object-cover transition-transform hover:scale-105"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center text-slate-400">
                          <Laptop className="w-10 h-10 mb-1" />
                          <span className="text-[10px]">No Photo</span>
                        </div>
                      )}
                      <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-600 text-white shadow-sm">
                        {asset.type}
                      </span>
                      <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/90 backdrop-blur-xs text-emerald-700 shadow-2xs border border-emerald-200">
                        {asset.status}
                      </span>
                    </div>

                    {/* Asset Details */}
                    <div className="p-4 space-y-2.5">
                      <div>
                        <h4 className="text-sm font-bold text-[#172033] truncate">{asset.name}</h4>
                        <p className="text-[11px] text-[#8292AD] font-medium">Tag: <strong className="text-slate-800">{asset.tag}</strong></p>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-[#F7F9FC]">
                        <div>
                          <span className="text-[10px] text-[#8292AD] block">Serial Number</span>
                          <span className="font-mono font-bold text-slate-800 text-[11px]">{asset.serial}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-[#8292AD] block">Condition</span>
                          <span className="font-bold text-emerald-700">{asset.condition || 'Excellent'}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="p-3 bg-slate-50 border-t border-[#E5EAF2] flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedAssetForTicket(asset);
                        setShowTicketModal(true);
                      }}
                      className="flex-1 py-1.5 px-2 text-[11px] font-bold rounded-xl border border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100 flex items-center justify-center gap-1 transition-colors cursor-pointer"
                    >
                      <Ticket className="w-3 h-3 text-amber-600" />
                      <span>Raise Ticket</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedAssetForTicket(asset);
                        setShowGatePassModal(true);
                      }}
                      className="flex-1 py-1.5 px-2 text-[11px] font-bold rounded-xl border border-purple-200 bg-purple-50 text-purple-800 hover:bg-purple-100 flex items-center justify-center gap-1 transition-colors cursor-pointer"
                    >
                      <Briefcase className="w-3 h-3 text-purple-600" />
                      <span>Gate Pass</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 5: VERIFIED DOCUMENTS */}
      {activeTab === 'documents' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-extrabold text-[#172033]">Verified Employee Records & Proofs</h3>
              <p className="text-xs text-[#8292AD]">Authenticated government identification, degrees and contracts</p>
            </div>
            <button
              type="button"
              onClick={() => setShowDocUploadModal(true)}
              className="inline-flex items-center gap-1.5 px-4 h-9 text-xs font-bold rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white shadow-sm cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Document</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="bg-white border border-[#E5EAF2] rounded-2xl p-4 shadow-card flex items-center justify-between gap-3 hover:border-blue-300 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-xs flex-shrink-0 border border-rose-100">
                    PDF
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-[#172033] truncate" title={doc.name}>
                      {doc.name}
                    </h4>
                    <p className="text-[10px] text-[#8292AD] mt-0.5">
                      <span>{doc.size}</span> • <span>Uploaded {doc.uploadDate}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {doc.status}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      addToast({
                        title: 'Downloading Document',
                        message: `Initiated download for ${doc.name}.`,
                        type: 'info',
                      });
                    }}
                    title="Download document"
                    className="p-1.5 rounded-lg border border-[#E5EAF2] text-slate-600 hover:bg-slate-50 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteDocument(doc.id, doc.name)}
                    title="Remove document"
                    className="p-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: SECURITY & ACCESS SETTINGS */}
      {activeTab === 'settings' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Change Password Card */}
          <div className="bg-white border border-[#E5EAF2] rounded-2xl p-6 shadow-card space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-[#E5EAF2]">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center font-bold">
                <Key className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-extrabold text-[#172033] uppercase tracking-wider">
                  Update Portal Password
                </h3>
                <p className="text-[10px] text-[#8292AD]">Enhance account security with a strong passphrase</p>
              </div>
            </div>

            <form onSubmit={handlePasswordChange} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-xs font-bold text-[#172033] mb-1">Current Password *</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={passwordForm.current}
                  onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#172033] mb-1">New Secure Password *</label>
                <input
                  type="password"
                  required
                  placeholder="Min 8 characters, letters & symbols"
                  value={passwordForm.next}
                  onChange={(e) => setPasswordForm({ ...passwordForm, next: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#172033] mb-1">Confirm New Password *</label>
                <input
                  type="password"
                  required
                  placeholder="Repeat new password"
                  value={passwordForm.confirm}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-xl text-[11px] text-slate-600 space-y-1 border border-slate-200/70">
                <span className="font-bold text-slate-800 block">Password Guidelines:</span>
                <p>• At least 8 characters in length</p>
                <p>• Includes uppercase, lowercase letters and 1 numeric digit</p>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 text-xs font-bold rounded-xl bg-[#2563EB] text-white hover:bg-blue-700 shadow-sm cursor-pointer transition-all"
              >
                Save New Password
              </button>
            </form>
          </div>

          {/* Preferences & 2FA */}
          <div className="space-y-6">
            {/* 2FA Card */}
            <div className="bg-white border border-[#E5EAF2] rounded-2xl p-6 shadow-card space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-[#E5EAF2]">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-extrabold text-[#172033] uppercase tracking-wider">
                    Two-Factor Authentication (2FA)
                  </h3>
                  <p className="text-[10px] text-[#8292AD]">Require authentication code on enterprise login</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/50">
                <div>
                  <span className="font-bold text-[#172033] text-xs block">Authenticator App (TOTP)</span>
                  <span className="text-[11px] text-emerald-800">Google Authenticator or Microsoft Authenticator</span>
                </div>
                <input
                  type="checkbox"
                  checked={twoFactorEnabled}
                  onChange={(e) => {
                    setTwoFactorEnabled(e.target.checked);
                    addToast({
                      title: '2FA Updated',
                      message: `Two-factor authentication is now ${e.target.checked ? 'Enabled' : 'Disabled'}.`,
                      type: 'info',
                    });
                  }}
                  className="w-4 h-4 text-[#2563EB] rounded cursor-pointer"
                />
              </div>

              <div className="space-y-3 text-xs pt-1">
                <div className="flex items-center justify-between p-3 rounded-xl border border-[#E5EAF2]">
                  <div>
                    <span className="font-bold text-[#172033] block">Email Approvals & Notifications</span>
                    <span className="text-[#8292AD] text-[11px]">Instant alerts on leave approvals & payroll receipts</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={emailAlerts}
                    onChange={(e) => setEmailAlerts(e.target.checked)}
                    className="w-4 h-4 text-[#2563EB] rounded cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl border border-[#E5EAF2]">
                  <div>
                    <span className="font-bold text-[#172033] block">Browser Desktop Notifications</span>
                    <span className="text-[#8292AD] text-[11px]">Push notifications for urgent tickets and chats</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={desktopNotifs}
                    onChange={(e) => setDesktopNotifs(e.target.checked)}
                    className="w-4 h-4 text-[#2563EB] rounded cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Active Sessions Card */}
            <div className="bg-white border border-[#E5EAF2] rounded-2xl p-6 shadow-card space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#E5EAF2]">
                <h3 className="text-xs font-extrabold text-[#172033] uppercase tracking-wider">
                  Active Logged In Devices
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    addToast({
                      title: 'Sessions Terminated',
                      message: 'All other browser sessions have been logged out.',
                      type: 'info',
                    });
                  }}
                  className="text-xs text-rose-600 hover:underline font-bold cursor-pointer"
                >
                  Revoke Others
                </button>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="p-3 rounded-xl border border-emerald-200 bg-emerald-50/40 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Laptop className="w-4 h-4 text-emerald-700" />
                    <div>
                      <span className="font-bold text-[#172033] block">Apple MacBook Pro (Chrome 128.0)</span>
                      <span className="text-[10px] text-emerald-800">San Francisco, CA • IP: 192.168.1.42 • Active Now</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[9.5px] font-extrabold bg-emerald-600 text-white">
                    This Device
                  </span>
                </div>

                <div className="p-3 rounded-xl border border-[#E5EAF2] bg-[#FBFDFE] flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Smartphone className="w-4 h-4 text-slate-500" />
                    <div>
                      <span className="font-bold text-[#172033] block">Apple iPhone 15 Pro (Safari Mobile)</span>
                      <span className="text-[10px] text-[#8292AD]">San Francisco, CA • Last active 2 hours ago</span>
                    </div>
                  </div>
                  <span className="text-[10.5px] text-[#8292AD]">Mobile App</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODALS SECTION                                                           */}
      {/* ========================================================================= */}

      {/* 1. Edit Profile Information Modal */}
      {showEditModal && (
        <Modal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          title="Edit Profile Information"
          subtitle="Update personal employee details, emergency contact & residential address"
          maxWidth="max-w-xl"
        >
          <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-[#172033] mb-1">Full Legal Name *</label>
                <input
                  type="text"
                  required
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#172033] mb-1">Corporate Designation</label>
                <input
                  type="text"
                  value={editForm.designation}
                  onChange={(e) => setEditForm({ ...editForm, designation: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#172033] mb-1">Department</label>
                <input
                  type="text"
                  value={editForm.department}
                  onChange={(e) => setEditForm({ ...editForm, department: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#172033] mb-1">Primary Phone</label>
                <input
                  type="text"
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#172033] mb-1">Alternate Phone</label>
                <input
                  type="text"
                  value={editForm.altPhone}
                  onChange={(e) => setEditForm({ ...editForm, altPhone: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#172033] mb-1">Personal Email</label>
                <input
                  type="email"
                  value={editForm.personalEmail}
                  onChange={(e) => setEditForm({ ...editForm, personalEmail: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#172033] mb-1">Emergency Contact</label>
                <input
                  type="text"
                  value={editForm.emergencyContact}
                  onChange={(e) => setEditForm({ ...editForm, emergencyContact: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-[#172033] mb-1">Current Residential Address</label>
                <input
                  type="text"
                  value={editForm.residentialAddress}
                  onChange={(e) => setEditForm({ ...editForm, residentialAddress: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-[#172033] mb-1">Permanent Home Address</label>
                <input
                  type="text"
                  value={editForm.permanentAddress}
                  onChange={(e) => setEditForm({ ...editForm, permanentAddress: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:border-[#2563EB]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2.5 pt-3 border-t border-[#E5EAF2]">
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 text-xs font-semibold rounded-xl border border-[#E5EAF2] text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white shadow-sm cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* 2. Change Avatar / Profile Photo Modal */}
      {showPhotoModal && (
        <Modal
          isOpen={showPhotoModal}
          onClose={() => setShowPhotoModal(false)}
          title="Update Profile Photo"
          subtitle="Paste a new image link or choose an executive avatar"
          maxWidth="max-w-md"
        >
          <form onSubmit={handleSavePhoto} className="space-y-4 text-xs">
            <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <img
                src={photoUrl || user.avatar}
                alt="Preview"
                className="w-24 h-24 rounded-2xl object-cover ring-4 ring-white shadow-md mb-2"
                onError={(e) => {
                  e.target.src = user.avatar;
                }}
              />
              <span className="text-[11px] text-slate-500">Live Avatar Preview</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#172033] mb-1">Image URL</label>
              <input
                type="url"
                required
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3 py-2 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:border-[#2563EB]"
              />
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Quick Select Avatar Presets:
              </span>
              <div className="flex items-center gap-2">
                {[
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
                  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
                  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80',
                  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80',
                ].map((preset, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setPhotoUrl(preset)}
                    className="w-10 h-10 rounded-xl overflow-hidden border-2 border-transparent hover:border-[#2563EB] cursor-pointer"
                  >
                    <img src={preset} alt={`preset ${i}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2.5 pt-3 border-t border-[#E5EAF2]">
              <button
                type="button"
                onClick={() => setShowPhotoModal(false)}
                className="px-4 py-2 text-xs font-semibold rounded-xl border border-[#E5EAF2] text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white shadow-sm cursor-pointer"
              >
                Save Photo
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* 3. Upload Verified Document Modal */}
      {showDocUploadModal && (
        <Modal
          isOpen={showDocUploadModal}
          onClose={() => setShowDocUploadModal(false)}
          title="Upload Verified Document"
          subtitle="Submit official identity, educational certificate or tax compliance PDF"
          maxWidth="max-w-md"
        >
          <form onSubmit={handleUploadDocument} className="space-y-4 text-xs">
            <div>
              <label className="block text-xs font-bold text-[#172033] mb-1">Document Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Master of Business Administration Degree"
                value={docUploadForm.title}
                onChange={(e) => setDocUploadForm({ ...docUploadForm, title: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:border-[#2563EB]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#172033] mb-1">Document Category</label>
              <select
                value={docUploadForm.type}
                onChange={(e) => setDocUploadForm({ ...docUploadForm, type: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:border-[#2563EB] cursor-pointer"
              >
                <option value="Identity Proof">Identity Proof (Aadhar / Passport)</option>
                <option value="Academic Certificate">Academic Certificate / Degree</option>
                <option value="Employment Contract">Employment Contract & Offer</option>
                <option value="Experience Letter">Experience & Relieving Letter</option>
                <option value="Banking & Tax">Banking & Tax Documents</option>
              </select>
            </div>

            {/* Dropzone mock */}
            <div className="border-2 border-dashed border-[#CBD5E1] rounded-2xl p-5 text-center bg-[#F8FAFC] hover:bg-blue-50/40 transition-colors cursor-pointer">
              <Upload className="w-7 h-7 text-[#2563EB] mx-auto mb-1 stroke-[1.8]" />
              <p className="text-xs font-bold text-[#172033]">Click or drag & drop document file</p>
              <p className="text-[10px] text-[#8292AD] mt-0.5">PDF, PNG, JPG up to 10MB</p>
            </div>

            <div className="flex justify-end gap-2.5 pt-3 border-t border-[#E5EAF2]">
              <button
                type="button"
                onClick={() => setShowDocUploadModal(false)}
                className="px-4 py-2 text-xs font-semibold rounded-xl border border-[#E5EAF2] text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white shadow-sm cursor-pointer"
              >
                Submit Document
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* 4. Raise Support Ticket Modal for Hardware */}
      {showTicketModal && (
        <Modal
          isOpen={showTicketModal}
          onClose={() => setShowTicketModal(false)}
          title={`Raise Ticket: ${selectedAssetForTicket?.name || 'Hardware'}`}
          subtitle={`Submit technical incident or maintenance request (Tag: ${selectedAssetForTicket?.tag || ''})`}
          maxWidth="max-w-md"
        >
          <form onSubmit={handleRaiseTicketSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-xs font-bold text-[#172033] mb-1">Issue Summary *</label>
              <input
                type="text"
                required
                placeholder="e.g. Battery drain / keyboard key sticking"
                value={ticketForm.issue}
                onChange={(e) => setTicketForm({ ...ticketForm, issue: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:border-[#2563EB]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#172033] mb-1">Urgency Priority</label>
              <select
                value={ticketForm.priority}
                onChange={(e) => setTicketForm({ ...ticketForm, priority: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:border-[#2563EB] cursor-pointer"
              >
                <option value="Normal">Normal Priority</option>
                <option value="High">High - Impeding Work</option>
                <option value="Urgent">Urgent - Complete Device Malfunction</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#172033] mb-1">Detailed Description</label>
              <textarea
                rows={3}
                placeholder="Describe how the problem occurred..."
                value={ticketForm.description}
                onChange={(e) => setTicketForm({ ...ticketForm, description: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:border-[#2563EB]"
              />
            </div>

            <div className="flex justify-end gap-2.5 pt-3 border-t border-[#E5EAF2]">
              <button
                type="button"
                onClick={() => setShowTicketModal(false)}
                className="px-4 py-2 text-xs font-semibold rounded-xl border border-[#E5EAF2] text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white shadow-sm cursor-pointer"
              >
                Submit Ticket
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* 5. Request Gate Pass Modal for Hardware */}
      {showGatePassModal && (
        <Modal
          isOpen={showGatePassModal}
          onClose={() => setShowGatePassModal(false)}
          title={`Take-Home Gate Pass: ${selectedAssetForTicket?.name || 'Hardware'}`}
          subtitle="Request authorization to transport company hardware off company premises"
          maxWidth="max-w-md"
        >
          <form onSubmit={handleGatePassSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#172033] mb-1">Start Date</label>
                <input
                  type="date"
                  required
                  value={gatePassForm.startDate}
                  onChange={(e) => setGatePassForm({ ...gatePassForm, startDate: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#172033] mb-1">Expected Return Date</label>
                <input
                  type="date"
                  required
                  value={gatePassForm.endDate}
                  onChange={(e) => setGatePassForm({ ...gatePassForm, endDate: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:border-[#2563EB]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#172033] mb-1">Reason for Gate Pass</label>
              <select
                value={gatePassForm.reason}
                onChange={(e) => setGatePassForm({ ...gatePassForm, reason: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:border-[#2563EB] cursor-pointer"
              >
                <option value="Working From Home">Working From Home (WFH)</option>
                <option value="Client Site Visit">Client Site Visit & Onsite Demo</option>
                <option value="Official Business Travel">Official Business Travel</option>
                <option value="Hardware Servicing">Hardware Servicing / Authorized Service Center</option>
              </select>
            </div>

            <div className="flex justify-end gap-2.5 pt-3 border-t border-[#E5EAF2]">
              <button
                type="button"
                onClick={() => setShowGatePassModal(false)}
                className="px-4 py-2 text-xs font-semibold rounded-xl border border-[#E5EAF2] text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold rounded-xl bg-purple-600 hover:bg-purple-700 text-white shadow-sm cursor-pointer"
              >
                Request Authorization
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
