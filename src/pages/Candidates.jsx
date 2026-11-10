import React, { useState, useEffect, useRef } from 'react';
import {
  UserPlus,
  Briefcase,
  Calendar,
  Calendar as CalendarIcon,
  Star,
  ExternalLink,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  MoreVertical,
  Check,
  X,
  Eye,
  Edit3,
  Trash2,
  Mail,
  Phone,
  Copy,
  Upload,
  Download,
  UserCheck,
  Building,
  RotateCcw,
  RotateCw,
  ChevronDown,
  FileText,
  Send,
  Paperclip,
} from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { StatsCard } from '../components/dashboard/StatsCard';
import { DataTable } from '../components/common/DataTable';
import { StatusBadge } from '../components/common/StatusBadge';
import { ActionDropdown } from '../components/common/ActionDropdown';
import { SearchBar } from '../components/common/SearchBar';
import { Modal } from '../components/common/Modal';
import { candidateService } from '../services/candidateService';
import { useToast } from '../context/NotificationContext';

const formatSalary = (val, fallback = '120,000') => {
  if (!val) return fallback;
  return String(val).replace(/^\$/, '').trim();
};

const parseCandidateDate = (dateStr) => {
  if (!dateStr) return null;
  const match = dateStr.match(/(\d{1,2})\s+([A-Za-z]+),?\s*(\d{4})?/);
  if (match) {
    const day = parseInt(match[1], 10);
    const monthStr = match[2];
    const year = match[3] ? parseInt(match[3], 10) : 2026;
    const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
    const monthIndex = months.findIndex((m) => monthStr.toLowerCase().startsWith(m));
    if (monthIndex >= 0) {
      return new Date(year, monthIndex, day);
    }
  }
  return null;
};

export const Candidates = () => {
  const [candidates, setCandidates] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [stageFilter, setStageFilter] = useState('All');
  const [showStageDropdown, setShowStageDropdown] = useState(false);
  const [periodFilter, setPeriodFilter] = useState('all');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  const fileInputRef = useRef(null);
  const stageDropdownRef = useRef(null);
  const { addToast } = useToast();

  const departments = [
    'All',
    'Engineering',
    'Product',
    'Design',
    'Marketing',
    'Finances',
    'HR & People',
    'Infrastructure',
    'Business Development',
  ];

  // New candidate form (no $ in salary)
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newRole, setNewRole] = useState('Senior Full Stack Engineer');
  const [newDept, setNewDept] = useState('Engineering');
  const [newExp, setNewExp] = useState('5 years');
  const [newRelevantExp, setNewRelevantExp] = useState('5 years');
  const [newNoticePeriod, setNewNoticePeriod] = useState('30 Days');
  const [newCtc, setNewCtc] = useState('120,000');
  const [newEctc, setNewEctc] = useState('145,000');
  const [newReasonForChange, setNewReasonForChange] = useState('Career Growth');
  const [newRecruiter, setNewRecruiter] = useState('Saurabh H.');
  const [newStage, setNewStage] = useState('Under Review');
  const [newInterviewDate, setNewInterviewDate] = useState('');
  const [newInterviewer, setNewInterviewer] = useState('Saurabh H.');
  const [newRound, setNewRound] = useState('Technical Round');
  const [newOffer, setNewOffer] = useState('');

  // Edit candidate modal state (all fields from screenshot)
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState(null);
  const [editName, setEditName] = useState('');
  const [editRole, setEditRole] = useState('');
  const [editDept, setEditDept] = useState('Engineering');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editExperience, setEditExperience] = useState('');
  const [editRelevantExperience, setEditRelevantExperience] = useState('');
  const [editNoticePeriod, setEditNoticePeriod] = useState('');
  const [editCtc, setEditCtc] = useState('');
  const [editEctc, setEditEctc] = useState('');
  const [editReasonForChange, setEditReasonForChange] = useState('');
  const [editRecruiter, setEditRecruiter] = useState('');
  const [editStage, setEditStage] = useState('Under Review');
  const [editInterviewDate, setEditInterviewDate] = useState('');
  const [editInterviewer, setEditInterviewer] = useState('');
  const [editRound, setEditRound] = useState('Technical Round');
  const [editRoundStatus, setEditRoundStatus] = useState('Pending');
  const [editOffer, setEditOffer] = useState('');

  // Delete candidate modal state
  const [candidateToDelete, setCandidateToDelete] = useState(null);

  // View modal interactive states (for comments & offer)
  const [viewOfferText, setViewOfferText] = useState('');
  const [viewCommentText, setViewCommentText] = useState('');

  const loadCandidates = () => {
    setCandidates(candidateService.getCandidates());
  };

  useEffect(() => {
    loadCandidates();
  }, []);

  // Sync view modal offer text when candidate opens
  useEffect(() => {
    if (selectedCandidate) {
      setViewOfferText(selectedCandidate.offer || '');
      setViewCommentText('');
    }
  }, [selectedCandidate]);

  // Open Edit modal with all fields populated
  const handleOpenEditModal = (cand) => {
    setEditingCandidate(cand);
    setEditName(cand.name || '');
    setEditRole(cand.role || '');
    setEditDept(cand.department || 'Engineering');
    setEditEmail(cand.email || '');
    setEditPhone(cand.phone || '');
    setEditExperience(cand.experience || '6 Yrs. 0 Months');
    setEditRelevantExperience(cand.relevantExperience || cand.experience || '6 Yrs. 0 Months');
    setEditNoticePeriod(cand.noticePeriod || '60 Days');
    setEditCtc(formatSalary(cand.ctc, '91,666'));
    setEditEctc(formatSalary(cand.ectc, '125,000'));
    setEditReasonForChange(cand.reasonForChange || 'Career Growth');
    setEditRecruiter(cand.recruiter || cand.interviewer || 'Komal Thapliyal');
    setEditStage(cand.stage || 'Under Review');
    setEditInterviewDate(cand.interviewDate || 'Wed, 04-Nov-26 02:30 PM');
    setEditInterviewer(cand.interviewer || 'Bhupinderjit Singh');
    setEditRound(cand.round || 'Technical Round');
    setEditRoundStatus(cand.roundStatus || 'Pending');
    setEditOffer(cand.offer || '');
    setShowEditModal(true);
  };

  // Save Edit candidate
  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editingCandidate) return;

    const updatedData = {
      name: editName.trim(),
      role: editRole.trim(),
      department: editDept,
      email: editEmail.trim(),
      phone: editPhone.trim(),
      experience: editExperience.trim(),
      relevantExperience: editRelevantExperience.trim(),
      noticePeriod: editNoticePeriod.trim(),
      ctc: formatSalary(editCtc),
      ectc: formatSalary(editEctc),
      reasonForChange: editReasonForChange.trim(),
      recruiter: editRecruiter.trim(),
      stage: editStage,
      interviewDate: editInterviewDate.trim(),
      interviewer: editInterviewer.trim(),
      round: editRound.trim(),
      roundStatus: editRoundStatus,
      offer: editOffer.trim(),
    };

    candidateService.updateCandidate(editingCandidate.id, updatedData);
    loadCandidates();

    if (selectedCandidate && selectedCandidate.id === editingCandidate.id) {
      setSelectedCandidate((prev) => ({ ...prev, ...updatedData }));
    }

    setShowEditModal(false);
    setEditingCandidate(null);
    addToast({
      title: 'Candidate Updated',
      message: `Profile for ${editName} updated successfully.`,
      type: 'success',
    });
  };

  // Delete candidate
  const handleConfirmDelete = (id) => {
    const cand = candidates.find((c) => c.id === id);
    const candName = cand?.name || 'Candidate';
    candidateService.deleteCandidate(id);
    loadCandidates();
    if (selectedCandidate?.id === id) {
      setSelectedCandidate(null);
    }
    setCandidateToDelete(null);
    addToast({
      title: 'Candidate Deleted',
      message: `${candName} has been removed from the candidate pipeline.`,
      type: 'danger',
    });
  };

  // View Modal: Update Candidate Offer
  const handleUpdateOffer = () => {
    if (!selectedCandidate) return;
    candidateService.updateCandidate(selectedCandidate.id, {
      offer: viewOfferText.trim(),
    });
    setSelectedCandidate((prev) => ({ ...prev, offer: viewOfferText.trim() }));
    loadCandidates();
    addToast({
      title: 'Candidate Offer Updated',
      message: 'Offer details saved successfully.',
      type: 'success',
    });
  };

  // View Modal: Submit Comment
  const handleAddComment = (e) => {
    e.preventDefault();
    if (!selectedCandidate || !viewCommentText.trim()) return;

    const newComment = {
      author: 'Codeflies',
      date: `Today, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      text: viewCommentText.trim(),
    };

    const updatedComments = [newComment, ...(selectedCandidate.comments || [])];
    candidateService.updateCandidate(selectedCandidate.id, {
      comments: updatedComments,
    });
    setSelectedCandidate((prev) => ({ ...prev, comments: updatedComments }));
    setViewCommentText('');
    loadCandidates();
    addToast({
      title: 'Comment Added',
      message: 'Your comment has been submitted.',
      type: 'success',
    });
  };

  // Close stage dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        stageDropdownRef.current &&
        !stageDropdownRef.current.contains(e.target)
      ) {
        setShowStageDropdown(false);
      }
    };
    if (showStageDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showStageDropdown]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setStageFilter('All');
    setPeriodFilter('all');
    setFromDate('');
    setToDate('');
    setDeptFilter('All');
    addToast({
      title: 'Filters Reset',
      message: 'All candidate filters have been cleared.',
      type: 'info',
    });
  };

  const handleApplyFilters = () => {
    addToast({
      title: 'Filters Applied',
      message: `Showing ${filteredCandidates.length} matching candidates.`,
      type: 'success',
    });
  };

  const handleCopyEmail = (e, email) => {
    e.stopPropagation();
    navigator.clipboard.writeText(email);
    addToast({
      title: 'Email Copied',
      message: `${email} copied to clipboard!`,
      type: 'success',
    });
  };

  const handleExportCSV = () => {
    const headers = [
      'ID',
      'Name',
      'Email',
      'Phone',
      'Role',
      'Department',
      'Experience',
      'CTC',
      'ECTC',
      'Interview Date',
      'Recruiter',
      'Stage',
    ];
    const rows = candidates.map((c) => [
      `"${c.id}"`,
      `"${c.name}"`,
      `"${c.email}"`,
      `"${c.phone}"`,
      `"${c.role}"`,
      `"${c.department}"`,
      `"${c.experience}"`,
      `"${c.ctc || ''}"`,
      `"${c.ectc || ''}"`,
      `"${c.interviewDate}"`,
      `"${c.recruiter || c.interviewer || ''}"`,
      `"${c.stage}"`,
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `candidates_pipeline_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    addToast({
      title: 'Candidates Exported',
      message: `Exported ${candidates.length} candidates as CSV.`,
      type: 'success',
    });
  };

  const handleImportFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result;
        const lines = text.split('\n').filter((l) => l.trim().length > 0);
        if (lines.length <= 1) {
          throw new Error('File is empty or contains only headers');
        }
        const newItems = [];
        for (let i = 1; i < lines.length; i++) {
          const parts = lines[i].split(',').map((p) => p.replace(/^"|"$/g, '').trim());
          if (parts.length >= 2 && parts[1]) {
            newItems.push({
              name: parts[1],
              email: parts[2] || `candidate${i}@example.com`,
              phone: parts[3] || '+1 (555) 000-0000',
              role: parts[4] || 'Software Engineer',
              department: parts[5] || 'Engineering',
              experience: parts[6] || '3 years',
              ctc: formatSalary(parts[7], '95,000'),
              ectc: formatSalary(parts[8], '120,000'),
              interviewDate: parts[9] || 'Pending Schedule',
              recruiter: parts[10] || 'Saurabh H.',
              stage: parts[11] || 'Under Review',
            });
          }
        }

        if (newItems.length > 0) {
          candidateService.importCandidates(newItems);
          loadCandidates();
          addToast({
            title: 'Candidates Imported',
            message: `Successfully imported ${newItems.length} candidate(s).`,
            type: 'success',
          });
        }
      } catch (err) {
        addToast({
          title: 'Import Failed',
          message: 'Could not parse the selected file. Please provide a valid CSV.',
          type: 'danger',
        });
      }
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.readAsText(file);
  };

  const handleCreateCandidate = (e) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim()) {
      addToast({
        title: 'Required fields missing',
        message: 'Please provide candidate name and email address.',
        type: 'warning',
      });
      return;
    }

    const created = candidateService.addCandidate({
      name: newName.trim(),
      email: newEmail.trim(),
      phone: newPhone.trim() || '+1 (555) 000-0000',
      role: newRole,
      department: newDept,
      experience: newExp,
      relevantExperience: newRelevantExp || newExp,
      noticePeriod: newNoticePeriod,
      ctc: formatSalary(newCtc, '120,000'),
      ectc: formatSalary(newEctc, '145,000'),
      reasonForChange: newReasonForChange,
      recruiter: newRecruiter.trim() || 'Saurabh H.',
      stage: newStage,
      interviewDate: newInterviewDate || 'Pending Schedule',
      interviewer: newInterviewer.trim() || newRecruiter.trim() || 'Saurabh H.',
      round: newRound || 'Technical Round',
      roundStatus: 'Pending',
      offer: newOffer.trim(),
    });

    addToast({
      title: 'Candidate Profile Created',
      message: `${created.name} added to ${newRole} pipeline.`,
      type: 'success',
    });

    loadCandidates();
    setShowAddModal(false);
    setNewName('');
    setNewEmail('');
    setNewPhone('');
  };

  const handleUpdateStage = (id, newStage) => {
    candidateService.updateCandidateStage(id, newStage);
    addToast({
      title: 'Stage Updated',
      message: `Candidate moved to ${newStage}.`,
      type: 'info',
    });
    loadCandidates();
    if (selectedCandidate) {
      setSelectedCandidate((prev) => ({ ...prev, stage: newStage }));
    }
  };

  const filteredCandidates = candidates.filter((c) => {
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      c.name.toLowerCase().includes(query) ||
      c.role.toLowerCase().includes(query) ||
      c.department.toLowerCase().includes(query) ||
      c.email.toLowerCase().includes(query) ||
      (c.phone && c.phone.toLowerCase().includes(query)) ||
      ((c.recruiter || c.interviewer) &&
        (c.recruiter || c.interviewer).toLowerCase().includes(query));

    const matchesStage =
      stageFilter === 'All' || c.stage.toLowerCase() === stageFilter.toLowerCase();

    const matchesDept =
      deptFilter === 'All' || c.department.toLowerCase() === deptFilter.toLowerCase();

    let matchesDate = true;
    if (periodFilter === 'today') {
      matchesDate =
        c.interviewDate?.toLowerCase().includes('today') ||
        c.interviewDate?.includes('10 Nov');
    } else if (periodFilter === 'this-week') {
      matchesDate =
        c.interviewDate?.includes('Nov, 2026') ||
        c.interviewDate?.includes('Joining');
    } else if (periodFilter === 'this-month') {
      matchesDate =
        c.interviewDate?.includes('Nov') ||
        c.interviewDate?.includes('Joining');
    } else if (periodFilter === 'custom' || fromDate || toDate) {
      const cDate = parseCandidateDate(c.interviewDate);
      if (cDate) {
        if (fromDate) {
          const from = new Date(fromDate);
          from.setHours(0, 0, 0, 0);
          if (cDate < from) matchesDate = false;
        }
        if (toDate) {
          const to = new Date(toDate);
          to.setHours(23, 59, 59, 999);
          if (cDate > to) matchesDate = false;
        }
      }
    }

    return matchesSearch && matchesStage && matchesDept && matchesDate;
  });

  const stageStatusConfig = {
    All: {
      label: 'All Pipeline',
      count: candidates.length,
      icon: <UserCheck className="w-3.5 h-3.5 text-[#2563EB] stroke-[2.2]" />,
      pillClass: 'bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE] hover:bg-blue-100/70',
      badgeClass: 'bg-[#DBEAFE] text-[#1D4ED8]',
    },
    'Under Review': {
      label: 'Under Review',
      count: candidates.filter((c) => c.stage === 'Under Review').length,
      icon: <Clock className="w-3.5 h-3.5 text-[#64748B] stroke-[2.2]" />,
      pillClass: 'bg-[#F8FAFC] text-[#475569] border-[#CBD5E1] hover:bg-slate-100',
      badgeClass: 'bg-[#E2E8F0] text-[#334155]',
    },
    'Interview Scheduled': {
      label: 'Interview Scheduled',
      count: candidates.filter((c) => c.stage === 'Interview Scheduled').length,
      icon: <Calendar className="w-3.5 h-3.5 text-[#2563EB] stroke-[2.2]" />,
      pillClass: 'bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE] hover:bg-blue-100/70',
      badgeClass: 'bg-[#DBEAFE] text-[#1D4ED8]',
    },
    Shortlisted: {
      label: 'Shortlisted',
      count: candidates.filter((c) => c.stage === 'Shortlisted').length,
      icon: <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />,
      pillClass: 'bg-[#FFFBEB] text-[#D97706] border-[#FDE68A] hover:bg-amber-100/70',
      badgeClass: 'bg-[#FEF3C7] text-[#B45309]',
    },
    'Offer Extended': {
      label: 'Offer Extended',
      count: candidates.filter((c) => c.stage === 'Offer Extended').length,
      icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 stroke-[2.2]" />,
      pillClass: 'bg-[#ECFDF5] text-[#059669] border-[#A7F3D0] hover:bg-emerald-100/70',
      badgeClass: 'bg-[#D1FAE5] text-[#047857]',
    },
    Hired: {
      label: 'Hired',
      count: candidates.filter((c) => c.stage === 'Hired').length,
      icon: <Check className="w-3.5 h-3.5 text-[#2563EB] stroke-[2.5]" />,
      pillClass: 'bg-[#EFF6FF] text-[#1D4ED8] border-[#93C5FD] hover:bg-blue-100',
      badgeClass: 'bg-[#BFDBFE] text-[#1E40AF]',
    },
  };

  const currentStageConfig = stageStatusConfig[stageFilter] || stageStatusConfig.All;

  // Single-Row Filter Bar matching Attendance design (media_1794304412388_6a1f2742.png)
  const candidateFilterBar = (
    <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3">
      {/* Left: All Filters in 1 Row */}
      <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-0">
        {/* 1. All Pipeline in 1 Styled Colored Dropdown */}
        <div className="relative flex-shrink-0" ref={stageDropdownRef}>
          <button
            type="button"
            onClick={() => setShowStageDropdown((prev) => !prev)}
            className={`inline-flex items-center gap-2 px-3.5 h-9 rounded-xl border text-xs font-bold transition-all shadow-2xs cursor-pointer select-none active:scale-95 ${currentStageConfig.pillClass}`}
          >
            <span className="flex-shrink-0">{currentStageConfig.icon}</span>
            <span>
              {currentStageConfig.label} ({currentStageConfig.count})
            </span>
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform duration-200 ${
                showStageDropdown ? 'rotate-180' : ''
              }`}
            />
          </button>

          {/* Stage Options Popover */}
          {showStageDropdown && (
            <div className="absolute left-0 top-full mt-2 z-50 bg-white rounded-2xl shadow-xl border border-[#E5EAF2] py-1.5 min-w-[220px] animate-fade-in text-left">
              <div className="px-3.5 py-1.5 text-[10px] font-bold text-[#8292AD] uppercase tracking-wider border-b border-[#F1F5F9] mb-1">
                Filter by Pipeline Stage
              </div>
              {Object.entries(stageStatusConfig).map(([key, cfg]) => {
                const isSelected = stageFilter === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => {
                      setStageFilter(key);
                      setShowStageDropdown(false);
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

        {/* 2. Search Candidate, Role, Recruiter */}
        <div className="w-56 sm:w-64 min-w-[210px] flex-shrink-0">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onClear={() => setSearchQuery('')}
            placeholder="Search candidate, role, recruiter..."
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
          <CalendarIcon className="w-3.5 h-3.5 text-[#2563EB] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <span className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-[10px] text-slate-400">
            ▼
          </span>
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

        {/* 5. Department Filter */}
        <div className="relative min-w-[145px] flex-shrink-0">
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="w-full appearance-none pl-8 pr-8 h-9 text-xs font-semibold rounded-xl border border-[#E5EAF2] bg-white text-[#172033] hover:bg-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer shadow-2xs transition-colors"
          >
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept === 'All' ? 'All Departments' : dept}
              </option>
            ))}
          </select>
          <Building className="w-3.5 h-3.5 text-[#2563EB] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <span className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-[10px] text-slate-400">
            ▼
          </span>
        </div>
      </div>

      {/* Right: Reset + Apply + Live Filter Counter + Refresh */}
      <div className="flex items-center gap-2 flex-shrink-0 ml-auto pt-1 xl:pt-0 border-t xl:border-t-0 border-[#F1F5F9]">
        {/* Reset Button */}
        <button
          type="button"
          onClick={handleResetFilters}
          title="Reset all filters"
          className="inline-flex items-center gap-1.5 px-3.5 h-9 text-xs font-bold rounded-xl text-[#DC2626] bg-[#FEF2F2] hover:bg-rose-100 border border-[#FECACA] transition-all cursor-pointer shadow-2xs whitespace-nowrap active:scale-95"
        >
          <RotateCcw className="w-3.5 h-3.5 text-[#DC2626]" />
          <span>Reset</span>
        </button>

        {/* Apply Button */}
        <button
          type="button"
          onClick={handleApplyFilters}
          title="Apply current filters"
          className="inline-flex items-center gap-1.5 px-4 h-9 text-xs font-bold rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white transition-all active:scale-95 shadow-sm shadow-blue-500/20 cursor-pointer whitespace-nowrap"
        >
          <Check className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Apply</span>
        </button>

        {/* Divider */}
        <div className="h-6 w-px bg-[#E5EAF2] hidden sm:block mx-0.5" />

        {/* Live Filter Counter + Refresh */}
        <div className="text-xs text-[#8292AD] font-medium flex items-center gap-1.5 whitespace-nowrap select-none">
          <span>
            Filtered: {filteredCandidates.length} Shown of {candidates.length}
          </span>
          <button
            onClick={() => loadCandidates()}
            title="Refresh Candidates"
            className="p-1 hover:bg-[#F8FAFC] rounded-lg transition-transform active:rotate-180 cursor-pointer"
          >
            <RotateCw className="w-3.5 h-3.5 text-[#8292AD] hover:text-[#2563EB] transition-colors" />
          </button>
        </div>
      </div>
    </div>
  );

  const columns = [
    {
      header: 'CANDIDATE',
      accessor: 'name',
      render: (row) => (
        <div className="flex items-start gap-3 py-1">
          <img
            src={row.avatar}
            alt={row.name}
            className="w-9 h-9 rounded-full object-cover ring-2 ring-[#E5EAF2] flex-shrink-0 mt-0.5"
          />
          <div className="min-w-0">
            <div
              className="font-bold text-[#111827] text-xs hover:text-[#2563EB] cursor-pointer transition-colors"
              onClick={() => setSelectedCandidate(row)}
              title="Click to view full profile"
            >
              {row.name}
            </div>

            {/* Email with copy action - clear & visible */}
            <button
              type="button"
              onClick={(e) => handleCopyEmail(e, row.email)}
              title="Click to copy email"
              className="group/email flex items-center gap-1.5 text-xs text-[#4B5563] hover:text-[#2563EB] transition-colors font-medium mt-1 text-left cursor-pointer"
            >
              <Mail className="w-3.5 h-3.5 text-[#6B7280] group-hover/email:text-[#2563EB] flex-shrink-0" />
              <span className="truncate max-w-[190px]">{row.email}</span>
              <Copy className="w-3 h-3 text-[#9CA3AF] opacity-0 group-hover/email:opacity-100 transition-opacity flex-shrink-0" />
            </button>

            {/* Phone with calling redirect - clear & visible */}
            <a
              href={`tel:${row.phone}`}
              onClick={(e) => e.stopPropagation()}
              title="Click to call candidate"
              className="group/phone flex items-center gap-1.5 text-xs text-[#4B5563] hover:text-emerald-600 transition-colors font-medium mt-0.5"
            >
              <Phone className="w-3.5 h-3.5 text-[#6B7280] group-hover/phone:text-emerald-600 flex-shrink-0" />
              <span>{row.phone}</span>
            </a>
          </div>
        </div>
      ),
    },
    {
      header: 'ROLE & DEPT',
      accessor: 'role',
      render: (row) => (
        <div className="space-y-1">
          <div className="text-xs font-bold text-[#111827]">{row.role}</div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-[#4B5563] font-medium">{row.department}</span>
            {/* Experience - highly visible badge */}
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
              <Briefcase className="w-3 h-3 text-slate-500" />
              {row.experience}
            </span>
          </div>
        </div>
      ),
    },
    {
      header: 'SALARY',
      accessor: 'ctc',
      render: (row) => (
        <div className="space-y-0.5 text-left">
          <div className="text-xs font-semibold text-[#1F2937]">
            <span className="text-[11px] font-bold text-[#6B7280]">CTC: </span>
            <span className="font-bold text-[#111827]">{formatSalary(row.ctc)}</span>
          </div>
          <div className="text-xs font-semibold text-emerald-700">
            <span className="text-[11px] font-bold text-[#6B7280]">ECTC: </span>
            <span className="font-bold text-emerald-600">{formatSalary(row.ectc)}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'INTERVIEW SCHEDULE',
      accessor: 'interviewDate',
      render: (row) => (
        <div className="text-xs text-[#4E5D78] flex items-center gap-1.5 font-medium">
          <Calendar className="w-3.5 h-3.5 text-[#2563EB]" />
          <span>{row.interviewDate}</span>
        </div>
      ),
    },
    {
      header: 'RECRUITER',
      accessor: 'recruiter',
      render: (row) => {
        const recruiterName = row.recruiter || row.interviewer || 'Saurabh H.';
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 whitespace-nowrap shadow-2xs">
            <UserCheck className="w-3.5 h-3.5 text-indigo-600" />
            <span>{recruiterName}</span>
          </span>
        );
      },
    },
    {
      header: 'STATUS',
      accessor: 'stage',
      align: 'center',
      render: (row) => (
        <StatusBadge
          status={row.stage}
          size="xs"
          showChevron={true}
          onStatusChange={(newStage) => handleUpdateStage(row.id, newStage)}
        />
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Page Header with Import, Export and Add Candidate Buttons - exact equal size as Attendance */}
      <PageHeader
        title="Candidate Management"
        badgeText="Recruitment Pipeline"
        subtitle="Manage job applicants, interview schedules, salaries and hiring offers."
        breadcrumbs={[{ label: 'Home', link: '/' }, { label: 'Candidates' }]}
        actions={
          <div className="flex items-center gap-2 flex-wrap">
            {/* Hidden file input for CSV Import */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImportFile}
              accept=".csv, .xlsx, .xls"
              className="hidden"
            />

            {/* Import Button - exact same size and shape as Attendance Export CSV */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl bg-white border border-[#E5EAF2] hover:bg-[#F7F9FC] text-[#172033] shadow-xs transition-colors cursor-pointer"
              title="Import candidates from CSV"
            >
              <Upload className="w-3.5 h-3.5 text-[#8292AD]" />
              <span>Import</span>
            </button>

            {/* Export CSV Button - exact same size and shape as Attendance Export CSV */}
            <button
              type="button"
              onClick={handleExportCSV}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl bg-white border border-[#E5EAF2] hover:bg-[#F7F9FC] text-[#172033] shadow-xs transition-colors cursor-pointer"
              title="Export candidate pipeline to CSV"
            >
              <Download className="w-3.5 h-3.5 text-[#8292AD]" />
              <span>Export CSV</span>
            </button>

            {/* Add Candidate Button - exact same size and shape as Attendance Create button */}
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white shadow-sm transition-all active:scale-95 shadow-blue-500/20 cursor-pointer"
            >
              <UserPlus className="w-4 h-4 stroke-[2.5]" />
              <span>Add Candidate</span>
            </button>
          </div>
        }
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Pipeline"
          value={candidates.length}
          subtext="Active applicants"
          badgeText="Active"
          badgeType="success"
          icon={Briefcase}
          iconBg="bg-blue-50 text-[#2563EB]"
        />
        <StatsCard
          title="Interview Scheduled"
          value={candidates.filter((c) => c.stage === 'Interview Scheduled').length}
          subtext="Coming up this week"
          badgeText="Next 3 days"
          badgeType="default"
          icon={Calendar}
          iconBg="bg-purple-50 text-purple-600"
        />
        <StatsCard
          title="Offers Extended"
          value={candidates.filter((c) => c.stage === 'Offer Extended').length}
          subtext="Awaiting candidate reply"
          badgeText="High Priority"
          badgeType="danger"
          icon={CheckCircle2}
          iconBg="bg-amber-50 text-amber-600"
        />
        <StatsCard
          title="Hired This Quarter"
          value={candidates.filter((c) => c.stage === 'Hired').length}
          subtext="Onboarding underway"
          badgeText="Target Met"
          badgeType="success"
          icon={CheckCircle2}
          iconBg="bg-emerald-50 text-emerald-600"
        />
      </div>

      {/* Table with Dedicated Fixed Filter Bar matching Attendance */}
      <DataTable
        columns={columns}
        data={filteredCandidates}
        pageSize={10}
        filterBar={candidateFilterBar}
        entityName="candidates"
        emptyMessage="No candidates match your criteria"
        emptySubtext="Try filtering by another stage or search query."
        actions={(row) => (
          <div className="inline-flex items-center justify-end gap-1.5">
            {/* View Button */}
            <button
              type="button"
              onClick={() => setSelectedCandidate(row)}
              title={`View candidate details for ${row.name}`}
              className="w-7 h-7 rounded-full bg-blue-50 text-[#2563EB] border border-blue-200 hover:bg-blue-100 hover:scale-105 flex items-center justify-center transition-all shadow-2xs cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>

            {/* Edit Button */}
            <button
              type="button"
              onClick={() => handleOpenEditModal(row)}
              title={`Edit candidate ${row.name}`}
              className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-100 hover:scale-105 flex items-center justify-center transition-all shadow-2xs cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>

            {/* Delete Button */}
            <button
              type="button"
              onClick={() => setCandidateToDelete(row)}
              title={`Delete candidate ${row.name}`}
              className="w-7 h-7 rounded-full bg-rose-50 text-rose-500 border border-rose-200 hover:bg-rose-100 hover:scale-105 flex items-center justify-center transition-all shadow-2xs cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      />

      {/* Add Candidate Modal */}
      {showAddModal && (
        <Modal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          title="Add New Job Candidate"
          subtitle="Record candidate contact info, salary expectations, recruiter and interview timing"
        >
          <form onSubmit={handleCreateCandidate} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#172033] mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Jessica Taylor"
                  className="w-full px-3.5 py-2 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#172033] mb-1.5">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="jessica@example.com"
                  className="w-full px-3.5 py-2 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#172033] mb-1.5">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="+1 (555) 019-2831"
                  className="w-full px-3.5 py-2 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#172033] mb-1.5">
                  Experience
                </label>
                <input
                  type="text"
                  value={newExp}
                  onChange={(e) => setNewExp(e.target.value)}
                  placeholder="e.g. 6 years"
                  className="w-full px-3.5 py-2 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#172033] mb-1.5">
                  Applied Role
                </label>
                <input
                  type="text"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#172033] mb-1.5">
                  Department
                </label>
                <select
                  value={newDept}
                  onChange={(e) => setNewDept(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 bg-white"
                >
                  <option value="Engineering">Engineering</option>
                  <option value="Product">Product</option>
                  <option value="Design">Design</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Finances">Finances</option>
                  <option value="HR & People">HR & People</option>
                  <option value="Infrastructure">Infrastructure</option>
                </select>
              </div>
            </div>

            {/* Salary: CTC & ECTC (No $) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#172033] mb-1.5">
                  Current Salary (CTC)
                </label>
                <input
                  type="text"
                  value={newCtc}
                  onChange={(e) => setNewCtc(e.target.value)}
                  placeholder="e.g. 120,000 or 15 LPA"
                  className="w-full px-3.5 py-2 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#172033] mb-1.5">
                  Expected Salary (ECTC)
                </label>
                <input
                  type="text"
                  value={newEctc}
                  onChange={(e) => setNewEctc(e.target.value)}
                  placeholder="e.g. 145,000 or 20 LPA"
                  className="w-full px-3.5 py-2 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#172033] mb-1.5">
                  Relevant Experience
                </label>
                <input
                  type="text"
                  value={newRelevantExp}
                  onChange={(e) => setNewRelevantExp(e.target.value)}
                  placeholder="e.g. 5 Yrs. 0 Months"
                  className="w-full px-3.5 py-2 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#172033] mb-1.5">
                  Notice Period
                </label>
                <select
                  value={newNoticePeriod}
                  onChange={(e) => setNewNoticePeriod(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 bg-white"
                >
                  <option value="Immediate">Immediate</option>
                  <option value="15 Days">15 Days</option>
                  <option value="30 Days">30 Days</option>
                  <option value="60 Days">60 Days</option>
                  <option value="90 Days">90 Days</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#172033] mb-1.5">
                  Recruiter
                </label>
                <select
                  value={newRecruiter}
                  onChange={(e) => setNewRecruiter(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 bg-white"
                >
                  <option value="Komal Thapliyal">Komal Thapliyal</option>
                  <option value="Saurabh H.">Saurabh H.</option>
                  <option value="Alexandre Roy">Alexandre Roy</option>
                  <option value="Devin Thorne">Devin Thorne</option>
                  <option value="Priya Sharma">Priya Sharma</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#172033] mb-1.5">
                  Pipeline Stage / Status
                </label>
                <select
                  value={newStage}
                  onChange={(e) => setNewStage(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 bg-white"
                >
                  <option value="Under Review">Under Review</option>
                  <option value="Interview Scheduled">Interview Scheduled</option>
                  <option value="Shortlisted">Shortlisted</option>
                  <option value="Offer Extended">Offer Extended</option>
                  <option value="Hired">Hired</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#172033] mb-1.5">
                  Reason for Change
                </label>
                <input
                  type="text"
                  value={newReasonForChange}
                  onChange={(e) => setNewReasonForChange(e.target.value)}
                  placeholder="e.g. Career Growth"
                  className="w-full px-3.5 py-2 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#172033] mb-1.5">
                  Interview Date / Time
                </label>
                <input
                  type="text"
                  value={newInterviewDate}
                  onChange={(e) => setNewInterviewDate(e.target.value)}
                  placeholder="e.g. Wed, 04-Nov-26 02:30 PM"
                  className="w-full px-3.5 py-2 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
                />
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
                Save Candidate
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Edit Candidate Modal (All fields from screenshot) */}
      {showEditModal && editingCandidate && (
        <Modal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setEditingCandidate(null);
          }}
          title="Edit Candidate Profile"
          subtitle={`Editing details for ${editingCandidate.name} (ID: ${editingCandidate.id})`}
          maxWidth="max-w-3xl"
        >
          <form onSubmit={handleSaveEdit} className="space-y-4">
            {/* 1. Name & Role */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#172033] mb-1.5">
                  Candidate Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="e.g. Sneh Parul"
                  className="w-full px-3.5 py-2 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 font-semibold text-[#172033]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#172033] mb-1.5">
                  Applied Role / Designation *
                </label>
                <input
                  type="text"
                  required
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value)}
                  placeholder="e.g. Business Development Executive"
                  className="w-full px-3.5 py-2 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 font-semibold text-[#172033]"
                />
              </div>
            </div>

            {/* 2. Email & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#172033] mb-1.5">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  placeholder="e.g. sneh.parul1499@gmail.com"
                  className="w-full px-3.5 py-2 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#172033] mb-1.5">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  placeholder="e.g. 8368049444"
                  className="w-full px-3.5 py-2 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
                />
              </div>
            </div>

            {/* 3. Department & Recruiter */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#172033] mb-1.5">
                  Department
                </label>
                <select
                  value={editDept}
                  onChange={(e) => setEditDept(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 bg-white"
                >
                  {departments.filter((d) => d !== 'All').map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#172033] mb-1.5">
                  Assigned Recruiter
                </label>
                <input
                  type="text"
                  value={editRecruiter}
                  onChange={(e) => setEditRecruiter(e.target.value)}
                  placeholder="e.g. Komal Thapliyal"
                  className="w-full px-3.5 py-2 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
                />
              </div>
            </div>

            {/* 4. Experience & Relevant Experience */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#172033] mb-1.5">
                  Total Experience
                </label>
                <input
                  type="text"
                  value={editExperience}
                  onChange={(e) => setEditExperience(e.target.value)}
                  placeholder="e.g. 6 Yrs. 0 Months"
                  className="w-full px-3.5 py-2 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#172033] mb-1.5">
                  Relevant Experience
                </label>
                <input
                  type="text"
                  value={editRelevantExperience}
                  onChange={(e) => setEditRelevantExperience(e.target.value)}
                  placeholder="e.g. 6 Yrs. 0 Months"
                  className="w-full px-3.5 py-2 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
                />
              </div>
            </div>

            {/* 5. Notice Period & Reason for Change */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#172033] mb-1.5">
                  Notice Period
                </label>
                <input
                  type="text"
                  value={editNoticePeriod}
                  onChange={(e) => setEditNoticePeriod(e.target.value)}
                  placeholder="e.g. 60 Days or Immediate"
                  className="w-full px-3.5 py-2 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#172033] mb-1.5">
                  Reason for Change
                </label>
                <input
                  type="text"
                  value={editReasonForChange}
                  onChange={(e) => setEditReasonForChange(e.target.value)}
                  placeholder="e.g. Career Growth"
                  className="w-full px-3.5 py-2 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
                />
              </div>
            </div>

            {/* 6. Current Salary & Expected Salary (No $) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#172033] mb-1.5">
                  Current Salary (CTC) <span className="text-[11px] font-normal text-[#8292AD]">(without $)</span>
                </label>
                <input
                  type="text"
                  value={editCtc}
                  onChange={(e) => setEditCtc(e.target.value)}
                  placeholder="e.g. 91,666"
                  className="w-full px-3.5 py-2 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 font-bold text-[#172033]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#172033] mb-1.5">
                  Expected Salary (ECTC) <span className="text-[11px] font-normal text-[#8292AD]">(without $)</span>
                </label>
                <input
                  type="text"
                  value={editEctc}
                  onChange={(e) => setEditEctc(e.target.value)}
                  placeholder="e.g. 125,000"
                  className="w-full px-3.5 py-2 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 font-bold text-emerald-600"
                />
              </div>
            </div>

            {/* 7. Status / Stage & Interview Schedule */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#172033] mb-1.5">
                  Candidate Status / Stage
                </label>
                <select
                  value={editStage}
                  onChange={(e) => setEditStage(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 bg-white font-semibold"
                >
                  <option value="Under Review">Under Review</option>
                  <option value="Interview Scheduled">Interview Scheduled</option>
                  <option value="Shortlisted">Shortlisted</option>
                  <option value="Offer Extended">Offer Extended</option>
                  <option value="Hired">Hired</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#172033] mb-1.5">
                  Interview Date / Schedule
                </label>
                <input
                  type="text"
                  value={editInterviewDate}
                  onChange={(e) => setEditInterviewDate(e.target.value)}
                  placeholder="e.g. Wed, 04-Nov-26 02:30 PM"
                  className="w-full px-3.5 py-2 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
                />
              </div>
            </div>

            {/* 8. Interviewer, Round & Round Status */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#172033] mb-1.5">
                  Interviewer
                </label>
                <input
                  type="text"
                  value={editInterviewer}
                  onChange={(e) => setEditInterviewer(e.target.value)}
                  placeholder="e.g. Bhupinderjit Singh"
                  className="w-full px-3.5 py-2 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#172033] mb-1.5">
                  Interview Round
                </label>
                <input
                  type="text"
                  value={editRound}
                  onChange={(e) => setEditRound(e.target.value)}
                  placeholder="e.g. Technical Round"
                  className="w-full px-3.5 py-2 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#172033] mb-1.5">
                  Round Status
                </label>
                <select
                  value={editRoundStatus}
                  onChange={(e) => setEditRoundStatus(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 bg-white"
                >
                  <option value="Pending">Pending</option>
                  <option value="Scheduled">Scheduled</option>
                  <option value="Completed">Completed</option>
                  <option value="Passed">Passed</option>
                  <option value="Failed">Failed</option>
                </select>
              </div>
            </div>

            {/* 9. Candidate Offer */}
            <div>
              <label className="block text-xs font-bold text-[#172033] mb-1.5">
                Candidate Offer Details
              </label>
              <textarea
                rows={2}
                value={editOffer}
                onChange={(e) => setEditOffer(e.target.value)}
                placeholder="Write offer details..."
                className="w-full px-3.5 py-2 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#E5EAF2]">
              <button
                type="button"
                onClick={() => {
                  setShowEditModal(false);
                  setEditingCandidate(null);
                }}
                className="px-4 py-2 text-xs font-medium rounded-xl border border-[#E5EAF2] text-[#8292AD] hover:bg-[#F7F9FC] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold rounded-xl bg-[#2563EB] text-white hover:bg-blue-700 shadow-sm cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Candidate Confirmation Modal */}
      {candidateToDelete && (
        <Modal
          isOpen={!!candidateToDelete}
          onClose={() => setCandidateToDelete(null)}
          title="Delete Candidate"
          subtitle="Are you sure you want to remove this candidate?"
        >
          <div className="space-y-4">
            <p className="text-xs text-[#4E5D78]">
              Are you sure you want to remove{' '}
              <strong className="text-[#172033]">{candidateToDelete.name}</strong> from the
              candidate recruitment pipeline? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2 pt-3 border-t border-[#E5EAF2]">
              <button
                type="button"
                onClick={() => setCandidateToDelete(null)}
                className="px-4 py-2 text-xs font-medium rounded-xl border border-[#E5EAF2] text-[#8292AD] hover:bg-[#F7F9FC] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleConfirmDelete(candidateToDelete.id)}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-rose-600 hover:bg-rose-700 text-white shadow-xs cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Candidate Details (Show / View) Modal - Exactly matching screenshots 1, 2, 3 */}
      {selectedCandidate && (
        <Modal
          isOpen={!!selectedCandidate}
          onClose={() => setSelectedCandidate(null)}
          title="Candidate Details"
          subtitle={`Dashboard > Candidates > Show > ${selectedCandidate.id}`}
          maxWidth="max-w-4xl"
        >
          <div className="space-y-6">
            {/* Top Bar: Name + Role, Status Dropdown, Resume Button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E5EAF2]">
              <div className="flex items-center gap-3">
                <img
                  src={selectedCandidate.avatar}
                  alt={selectedCandidate.name}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-[#E5EAF2] shadow-2xs"
                />
                <div>
                  <h3 className="text-base font-bold text-[#172033]">
                    {selectedCandidate.name}{' '}
                    <span className="font-normal text-[#8292AD]">
                      ({selectedCandidate.role})
                    </span>
                  </h3>
                  <p className="text-xs text-[#8292AD] mt-0.5">
                    Department: <span className="font-semibold text-[#172033]">{selectedCandidate.department}</span>
                  </p>
                </div>
              </div>

              {/* Status Selector + Resume Download Button */}
              <div className="flex items-center gap-2">
                <div className="relative">
                  <select
                    value={selectedCandidate.stage}
                    onChange={(e) => handleUpdateStage(selectedCandidate.id, e.target.value)}
                    className="text-xs font-bold px-3 py-1.5 rounded-lg border border-[#E5EAF2] bg-white cursor-pointer shadow-2xs"
                  >
                    <option value="Under Review">Under Review</option>
                    <option value="Interview Scheduled">Interview Scheduled</option>
                    <option value="Shortlisted">Shortlisted</option>
                    <option value="Offer Extended">Offer Extended</option>
                    <option value="Hired">Hired</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    addToast({
                      title: 'Resume Downloaded',
                      message: `Resume for ${selectedCandidate.name} opened.`,
                      type: 'info',
                    })
                  }
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#2563EB] hover:bg-blue-700 text-white transition-colors cursor-pointer shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Resume</span>
                </button>
              </div>
            </div>

            {/* Profile Overview Card (Two Columns matching Screenshot 1) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl bg-[#F8FAFC] border border-[#E5EAF2] text-xs">
              {/* Left Column: Contact, Exp, Notice, Interview */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[#4E5D78] flex-wrap">
                  <button
                    type="button"
                    onClick={(e) => handleCopyEmail(e, selectedCandidate.email)}
                    title="Click to copy email"
                    className="group inline-flex items-center gap-1 text-[#2563EB] hover:underline cursor-pointer font-medium"
                  >
                    <Mail className="w-3.5 h-3.5 text-[#2563EB]" />
                    <span>{selectedCandidate.email}</span>
                    <Copy className="w-3 h-3 text-[#9CA3AF] opacity-0 group-hover:opacity-100" />
                  </button>
                  <span>|</span>
                  <a
                    href={`tel:${selectedCandidate.phone}`}
                    className="inline-flex items-center gap-1 text-[#4E5D78] hover:text-emerald-600 font-medium"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#8292AD]" />
                    <span>{selectedCandidate.phone}</span>
                  </a>
                  <span>|</span>
                </div>

                <div className="text-[#4E5D78]">
                  <span>Experience </span>
                  <span className="font-bold text-[#172033]">{selectedCandidate.experience}</span>
                  <span> | Notice period: </span>
                  <span className="font-bold text-[#172033]">
                    {selectedCandidate.noticePeriod || '60 Days'}
                  </span>
                </div>

                <div className="text-[#4E5D78]">
                  <span>Interview on </span>
                  <span className="font-bold text-[#172033]">
                    {selectedCandidate.interviewDate || 'Wed, 04-Nov-26 02:30 PM'}
                  </span>
                  <span> by </span>
                  <span className="font-bold text-[#172033]">
                    {selectedCandidate.interviewer || selectedCandidate.recruiter || 'Bhupinderjit Singh'}
                  </span>
                </div>

                <div className="text-[#4E5D78]">
                  <span className="font-semibold text-[#172033]">
                    {selectedCandidate.round || 'Technical Round'}
                  </span>
                  <span> - </span>
                  <span className="font-bold text-amber-600">
                    {selectedCandidate.roundStatus || 'Pending'}
                  </span>
                </div>

                {/* Edit & Delete Action Buttons */}
                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => handleOpenEditModal(selectedCandidate)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-teal-600 hover:bg-teal-700 text-white transition-colors cursor-pointer shadow-2xs"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setCandidateToDelete(selectedCandidate);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-rose-600 hover:bg-rose-700 text-white transition-colors cursor-pointer shadow-2xs"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>

              {/* Right Column: Salary without $, Dates, Recruiter, Relevant Exp */}
              <div className="space-y-2 border-t md:border-t-0 md:border-l border-[#E5EAF2] md:pl-4">
                <div className="text-[#4E5D78]">
                  <span>Current Salary </span>
                  <span className="font-bold text-[#172033] underline">
                    {formatSalary(selectedCandidate.ctc, '91,666')}
                  </span>
                  <span> Expected </span>
                  <span className="font-bold text-[#172033] underline">
                    {formatSalary(selectedCandidate.ectc, '125,000')}
                  </span>
                </div>

                <div className="text-[#8292AD]">
                  <span>Added on </span>
                  <span className="font-semibold text-[#4E5D78]">
                    {selectedCandidate.addedOn || 'Wed, 04-Nov-26 01:40 pm'}
                  </span>
                  <span> by </span>
                  <span className="font-semibold text-[#4E5D78]">
                    {selectedCandidate.recruiter || 'Komal Thapliyal'}
                  </span>
                </div>

                <div className="text-[#8292AD]">
                  <span>Updated on </span>
                  <span className="font-semibold text-[#4E5D78]">
                    {selectedCandidate.updatedOn || 'Mon, 09-Nov-26 12:24 pm'}
                  </span>
                </div>

                <div className="text-[#4E5D78]">
                  <span>Recruiter </span>
                  <span className="font-semibold text-[#172033]">
                    {selectedCandidate.recruiter || 'Komal Thapliyal'}
                  </span>
                </div>

                <div className="text-[#4E5D78]">
                  <span>Relevant Exp </span>
                  <span className="font-semibold text-[#172033]">
                    {selectedCandidate.relevantExperience || selectedCandidate.experience || '6 Yrs. 0 Months'}
                  </span>
                </div>

                <div className="text-[#4E5D78]">
                  <span>Reason for Change </span>
                  <span className="font-semibold text-[#172033]">
                    {selectedCandidate.reasonForChange || 'Career Growth'}
                  </span>
                </div>
              </div>
            </div>

            {/* Section 1: Candidate Rounds (Screenshot 1) */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-[#172033] uppercase tracking-wider">
                  Candidate Rounds
                </h4>
                <button
                  type="button"
                  onClick={() => handleOpenEditModal(selectedCandidate)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-lg bg-teal-600 hover:bg-teal-700 text-white cursor-pointer shadow-2xs"
                >
                  <span>+ New Round</span>
                </button>
              </div>

              <div className="border border-[#E5EAF2] rounded-xl overflow-hidden bg-white shadow-2xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F8FAFC] border-b border-[#E5EAF2] text-[#8292AD] font-bold uppercase text-[10px]">
                    <tr>
                      <th className="px-3.5 py-2">Interviewer</th>
                      <th className="px-3.5 py-2">Interview At</th>
                      <th className="px-3.5 py-2">Round</th>
                      <th className="px-3.5 py-2">Status</th>
                      <th className="px-3.5 py-2">Last Updated</th>
                      <th className="px-3.5 py-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5EAF2] text-[#172033]">
                    {selectedCandidate.rounds && selectedCandidate.rounds.length > 0 ? (
                      selectedCandidate.rounds.map((rnd, idx) => (
                        <tr key={idx} className="hover:bg-[#F8FAFC]">
                          <td className="px-3.5 py-2 font-medium">{rnd.interviewer}</td>
                          <td className="px-3.5 py-2 text-[#4E5D78]">{rnd.interviewAt}</td>
                          <td className="px-3.5 py-2 font-semibold">{rnd.round}</td>
                          <td className="px-3.5 py-2">
                            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                              {rnd.status}
                            </span>
                          </td>
                          <td className="px-3.5 py-2 text-[#8292AD]">{rnd.lastUpdated}</td>
                          <td className="px-3.5 py-2 text-right">
                            <div className="inline-flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => handleOpenEditModal(selectedCandidate)}
                                className="p-1 rounded hover:bg-slate-100 text-teal-600"
                                title="Edit round"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  addToast({
                                    title: 'Round deleted',
                                    message: 'Interview round record removed.',
                                    type: 'info',
                                  })
                                }
                                className="p-1 rounded hover:bg-slate-100 text-rose-500"
                                title="Delete round"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr className="hover:bg-[#F8FAFC]">
                        <td className="px-3.5 py-2 font-medium">
                          {selectedCandidate.interviewer || 'Bhupinderjit Singh'}
                        </td>
                        <td className="px-3.5 py-2 text-[#4E5D78]">
                          {selectedCandidate.interviewDate || '04-Nov-26 02:30 PM'}
                        </td>
                        <td className="px-3.5 py-2 font-semibold">
                          {selectedCandidate.round || 'Technical Round'}
                        </td>
                        <td className="px-3.5 py-2">
                          <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            {selectedCandidate.roundStatus || 'Pending'}
                          </span>
                        </td>
                        <td className="px-3.5 py-2 text-[#8292AD]">04-Nov-26 01:41 PM</td>
                        <td className="px-3.5 py-2 text-right">
                          <div className="inline-flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleOpenEditModal(selectedCandidate)}
                              className="p-1 rounded hover:bg-slate-100 text-teal-600"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                addToast({
                                  title: 'Round deleted',
                                  message: 'Interview round removed.',
                                  type: 'info',
                                })
                              }
                              className="p-1 rounded hover:bg-slate-100 text-rose-500"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Section 2: Candidate Offer (Screenshot 2) */}
            <div className="space-y-2 p-4 rounded-xl border border-[#E5EAF2] bg-white">
              <h4 className="text-xs font-bold text-[#172033] uppercase tracking-wider">
                Candidate Offer
              </h4>
              <label className="block text-xs font-medium text-[#4E5D78]">
                Offer <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={2}
                value={viewOfferText}
                onChange={(e) => setViewOfferText(e.target.value)}
                placeholder="Write your offer"
                className="w-full px-3.5 py-2 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 text-[#172033]"
              />
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleUpdateOffer}
                  className="px-4 py-1.5 text-xs font-bold rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white cursor-pointer shadow-xs"
                >
                  Update
                </button>
              </div>
            </div>

            {/* Section 3: Candidate Comments (Screenshots 2 & 3) */}
            <div className="space-y-3 p-4 rounded-xl border border-[#E5EAF2] bg-white">
              <h4 className="text-xs font-bold text-[#172033] uppercase tracking-wider">
                Candidate Comments
              </h4>

              <form onSubmit={handleAddComment} className="space-y-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-[#4E5D78] mb-1">
                      Comment <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      rows={2}
                      value={viewCommentText}
                      onChange={(e) => setViewCommentText(e.target.value)}
                      placeholder="Write your comment"
                      className="w-full px-3.5 py-2 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 text-[#172033]"
                    />
                    <p className="text-[10px] text-[#8292AD] mt-0.5">
                      Markdown enabled, follow the cheatsheet.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#4E5D78] mb-1">
                      Attachments
                    </label>
                    <input
                      type="file"
                      className="w-full px-3 py-1.5 text-xs border border-[#E5EAF2] rounded-xl file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-[#172033] hover:file:bg-slate-200 cursor-pointer"
                    />
                    <p className="text-[10px] text-[#8292AD] mt-0.5">
                      You can choose upto 5 files.
                    </p>
                    <div className="flex justify-end mt-2">
                      <button
                        type="submit"
                        className="px-4 py-1.5 text-xs font-bold rounded-xl bg-[#172033] hover:bg-slate-800 text-white cursor-pointer shadow-xs"
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                </div>
              </form>

              {/* Comment Feed (matching Screenshot 3) */}
              <div className="pt-3 border-t border-[#E5EAF2] space-y-2 text-xs">
                {selectedCandidate.comments && selectedCandidate.comments.length > 0 ? (
                  selectedCandidate.comments.map((cmt, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E5EAF2]">
                      <p className="text-[#172033] leading-relaxed">{cmt.text}</p>
                      <p className="text-[11px] text-[#8292AD] mt-1.5 font-medium">
                        {cmt.author}: {cmt.date}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E5EAF2]">
                    <p className="text-[#172033] leading-relaxed">
                      relevant experience is 3-4 years only, and for that as well, her target was only 3k then 5k then 7k. at that low target, in 3 years, she got incentives only 4-5 times. that means she was not even achieving that as well.
                    </p>
                    <p className="text-[11px] text-[#8292AD] mt-1.5 font-medium">
                      Codeflies: Wed, 04-Nov-26 02:39 pm
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
