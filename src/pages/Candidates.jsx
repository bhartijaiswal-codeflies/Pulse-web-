import React, { useState, useEffect, useRef } from 'react';
import {
  UserPlus,
  Briefcase,
  Calendar,
  ExternalLink,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  MoreVertical,
  Check,
  X,
  Eye,
  Mail,
  Phone,
  Copy,
  Upload,
  Download,
  UserCheck,
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

export const Candidates = () => {
  const [candidates, setCandidates] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [stageFilter, setStageFilter] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const fileInputRef = useRef(null);
  const { addToast } = useToast();

  // New candidate form
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newRole, setNewRole] = useState('Senior Full Stack Engineer');
  const [newDept, setNewDept] = useState('Engineering');
  const [newExp, setNewExp] = useState('5 years');
  const [newCtc, setNewCtc] = useState('$120,000');
  const [newEctc, setNewEctc] = useState('$145,000');
  const [newRecruiter, setNewRecruiter] = useState('Saurabh H.');
  const [newStage, setNewStage] = useState('Under Review');
  const [newInterviewDate, setNewInterviewDate] = useState('');

  const loadCandidates = () => {
    setCandidates(candidateService.getCandidates());
  };

  useEffect(() => {
    loadCandidates();
  }, []);

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
              ctc: parts[7] || '$95,000',
              ectc: parts[8] || '$120,000',
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
      ctc: newCtc.trim() || '$120,000',
      ectc: newEctc.trim() || '$145,000',
      recruiter: newRecruiter.trim() || 'Saurabh H.',
      stage: newStage,
      interviewDate: newInterviewDate || 'Pending Schedule',
      interviewer: newRecruiter.trim() || 'Saurabh H.',
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
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.phone && c.phone.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (c.recruiter && c.recruiter.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStage =
      stageFilter === 'All' || c.stage.toLowerCase() === stageFilter.toLowerCase();

    return matchesSearch && matchesStage;
  });

  const candidateTabs = [
    { id: 'All', label: 'All Pipeline', count: candidates.length },
    {
      id: 'Under Review',
      label: 'Under Review',
      count: candidates.filter((c) => c.stage === 'Under Review').length,
      icon: <Clock className="w-3 h-3 text-[#64748B]" />,
    },
    {
      id: 'Interview Scheduled',
      label: 'Interview Scheduled',
      count: candidates.filter((c) => c.stage === 'Interview Scheduled').length,
      icon: <Calendar className="w-3 h-3 text-[#2563EB]" />,
    },
    {
      id: 'Shortlisted',
      label: 'Shortlisted',
      count: candidates.filter((c) => c.stage === 'Shortlisted').length,
      badgeColor: 'bg-amber-50 text-amber-700 border border-amber-200',
    },
    {
      id: 'Offer Extended',
      label: 'Offer Extended',
      count: candidates.filter((c) => c.stage === 'Offer Extended').length,
      badgeColor: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    },
    {
      id: 'Hired',
      label: 'Hired',
      count: candidates.filter((c) => c.stage === 'Hired').length,
      badgeColor: 'bg-blue-50 text-blue-700 border border-blue-200',
    },
  ];

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
            <span className="font-bold text-[#111827]">{row.ctc || '$120,000'}</span>
          </div>
          <div className="text-xs font-semibold text-emerald-700">
            <span className="text-[11px] font-bold text-[#6B7280]">ECTC: </span>
            <span className="font-bold text-emerald-600">{row.ectc || '$145,000'}</span>
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
      header: 'OPTIONS',
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
      {/* Page Header with Import, Export and Add Candidate Buttons */}
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

            {/* Import Button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-white border border-[#E5EAF2] hover:bg-[#F7F9FC] text-[#172033] shadow-xs transition-colors cursor-pointer"
              title="Import candidates from CSV"
            >
              <Upload className="w-3.5 h-3.5 text-[#8292AD]" />
              <span>Import</span>
            </button>

            {/* Export CSV Button */}
            <button
              type="button"
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-white border border-[#E5EAF2] hover:bg-[#F7F9FC] text-[#172033] shadow-xs transition-colors cursor-pointer"
              title="Export candidate pipeline to CSV"
            >
              <Download className="w-3.5 h-3.5 text-[#8292AD]" />
              <span>Export</span>
            </button>

            {/* Add Candidate Button */}
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white shadow-sm transition-all active:scale-95 shadow-blue-500/20 cursor-pointer"
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

      {/* Table with Tab Pills, Integrated Search & Circular Action Buttons */}
      <DataTable
        columns={columns}
        data={filteredCandidates}
        pageSize={10}
        tabs={candidateTabs}
        activeTab={stageFilter}
        onTabChange={setStageFilter}
        filterInfo={`Filtered: ${filteredCandidates.length} Shown of ${candidates.length}`}
        entityName="candidates"
        searchBar={
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onClear={() => setSearchQuery('')}
            placeholder="Search candidates, roles, recruiters..."
          />
        }
        emptyMessage="No candidates match your criteria"
        emptySubtext="Try filtering by another stage or search query."
        actions={(row) => (
          <div className="inline-flex items-center justify-end gap-1.5">
            <button
              type="button"
              onClick={() => setSelectedCandidate(row)}
              title={`View candidate details for ${row.name}`}
              className="w-7 h-7 rounded-full bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100 hover:scale-105 flex items-center justify-center transition-all shadow-2xs cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => handleUpdateStage(row.id, 'Hired')}
              title={`Hire candidate ${row.name}`}
              className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-100 hover:scale-105 flex items-center justify-center transition-all shadow-2xs cursor-pointer"
            >
              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
            <button
              type="button"
              onClick={() => handleUpdateStage(row.id, 'Interview Scheduled')}
              title={`Schedule interview for ${row.name}`}
              className="w-7 h-7 rounded-full bg-blue-50 text-[#2563EB] border border-blue-200 hover:bg-blue-100 hover:scale-105 flex items-center justify-center transition-all shadow-2xs cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => handleUpdateStage(row.id, 'Rejected')}
              title={`Reject applicant ${row.name}`}
              className="w-7 h-7 rounded-full bg-rose-50 text-rose-500 border border-rose-200 hover:bg-rose-100 hover:scale-105 flex items-center justify-center transition-all shadow-2xs cursor-pointer"
            >
              <X className="w-3.5 h-3.5 stroke-[2.5]" />
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

            {/* Salary: CTC & ECTC */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#172033] mb-1.5">
                  Current CTC (Salary)
                </label>
                <input
                  type="text"
                  value={newCtc}
                  onChange={(e) => setNewCtc(e.target.value)}
                  placeholder="e.g. $120,000 or 15 LPA"
                  className="w-full px-3.5 py-2 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#172033] mb-1.5">
                  Expected CTC (ECTC)
                </label>
                <input
                  type="text"
                  value={newEctc}
                  onChange={(e) => setNewEctc(e.target.value)}
                  placeholder="e.g. $145,000 or 20 LPA"
                  className="w-full px-3.5 py-2 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
                />
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
                  <option value="Saurabh H.">Saurabh H.</option>
                  <option value="Alexandre Roy">Alexandre Roy</option>
                  <option value="Devin Thorne">Devin Thorne</option>
                  <option value="Priya Sharma">Priya Sharma</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#172033] mb-1.5">
                  Pipeline Stage
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
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#172033] mb-1.5">
                Interview Date / Time
              </label>
              <input
                type="text"
                value={newInterviewDate}
                onChange={(e) => setNewInterviewDate(e.target.value)}
                placeholder="e.g. 14 Nov, 2026 - 03:00 PM"
                className="w-full px-3.5 py-2 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
              />
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

      {/* Candidate Details Modal */}
      {selectedCandidate && (
        <Modal
          isOpen={!!selectedCandidate}
          onClose={() => setSelectedCandidate(null)}
          title="Candidate Profile"
          subtitle={`Application ID: ${selectedCandidate.id}`}
          footer={
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#8292AD]">Move Stage:</span>
                <select
                  value={selectedCandidate.stage}
                  onChange={(e) => handleUpdateStage(selectedCandidate.id, e.target.value)}
                  className="text-xs border border-[#E5EAF2] rounded-lg px-2 py-1 bg-white font-medium"
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
                onClick={() => setSelectedCandidate(null)}
                className="px-4 py-1.5 text-xs font-medium rounded-xl border border-[#E5EAF2] text-[#172033] hover:bg-[#F7F9FC] cursor-pointer"
              >
                Done
              </button>
            </div>
          }
        >
          <div className="space-y-4">
            <div className="flex items-center gap-3.5 p-4 bg-[#F7F9FC] rounded-xl border border-[#E5EAF2]">
              <img
                src={selectedCandidate.avatar}
                alt={selectedCandidate.name}
                className="w-14 h-14 rounded-full object-cover ring-2 ring-white shadow-xs"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-bold text-[#172033]">{selectedCandidate.name}</h4>
                  <StatusBadge status={selectedCandidate.stage} size="sm" />
                </div>
                <p className="text-xs text-[#8292AD] font-medium">{selectedCandidate.role}</p>

                <div className="flex items-center gap-3 text-xs mt-1.5 flex-wrap">
                  {/* Click to copy email */}
                  <button
                    type="button"
                    onClick={(e) => handleCopyEmail(e, selectedCandidate.email)}
                    title="Click to copy email"
                    className="group flex items-center gap-1.5 text-xs text-[#4B5563] hover:text-[#2563EB] font-medium cursor-pointer"
                  >
                    <Mail className="w-3.5 h-3.5 text-[#6B7280] group-hover:text-[#2563EB]" />
                    <span>{selectedCandidate.email}</span>
                    <Copy className="w-3 h-3 text-[#9CA3AF] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>

                  <span>•</span>

                  {/* Click to call phone */}
                  <a
                    href={`tel:${selectedCandidate.phone}`}
                    title="Click to call candidate"
                    className="flex items-center gap-1.5 text-xs text-[#4B5563] hover:text-emerald-600 font-medium"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#6B7280]" />
                    <span>{selectedCandidate.phone}</span>
                  </a>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl border border-[#E5EAF2]">
                <span className="text-[#8292AD] block mb-0.5">Department</span>
                <span className="font-semibold text-[#172033]">{selectedCandidate.department}</span>
              </div>
              <div className="p-3 rounded-xl border border-[#E5EAF2]">
                <span className="text-[#8292AD] block mb-0.5">Experience</span>
                <span className="font-semibold text-[#172033]">{selectedCandidate.experience}</span>
              </div>
              <div className="p-3 rounded-xl border border-[#E5EAF2]">
                <span className="text-[#8292AD] block mb-0.5">Recruiter</span>
                <span className="inline-flex items-center gap-1 font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200 text-[11px] mt-0.5">
                  <UserCheck className="w-3 h-3 text-indigo-600" />
                  {selectedCandidate.recruiter || selectedCandidate.interviewer}
                </span>
              </div>
              <div className="p-3 rounded-xl border border-[#E5EAF2]">
                <span className="text-[#8292AD] block mb-0.5">Current CTC</span>
                <span className="font-bold text-[#111827]">{selectedCandidate.ctc || '$120,000'}</span>
              </div>
              <div className="p-3 rounded-xl border border-[#E5EAF2]">
                <span className="text-[#8292AD] block mb-0.5">Expected CTC</span>
                <span className="font-bold text-emerald-600">{selectedCandidate.ectc || '$145,000'}</span>
              </div>
              <div className="p-3 rounded-xl border border-[#E5EAF2]">
                <span className="text-[#8292AD] block mb-0.5">Interview Date</span>
                <span className="font-semibold text-[#172033]">{selectedCandidate.interviewDate}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-[#E5EAF2] bg-[#FCFDFE] flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-[#172033] block">Candidate Resume & Portfolio</span>
                <span className="text-[11px] text-[#8292AD]">PDF attachment verified & virus scanned</span>
              </div>
              <button
                type="button"
                onClick={() => addToast({ title: 'Resume Downloaded', message: `Resume for ${selectedCandidate.name} opened.`, type: 'info' })}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-50 text-[#2563EB] hover:bg-blue-100 border border-blue-200 transition-colors cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>View Resume</span>
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

