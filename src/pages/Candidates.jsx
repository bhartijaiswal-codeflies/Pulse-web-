import React, { useState, useEffect } from 'react';
import {
  UserPlus,
  Briefcase,
  Calendar,
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
} from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { StatsCard } from '../components/dashboard/StatsCard';
import { DataTable } from '../components/common/DataTable';
import { StatusBadge } from '../components/common/StatusBadge';
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
  const { addToast } = useToast();

  // New candidate form
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newRole, setNewRole] = useState('Senior Full Stack Engineer');
  const [newDept, setNewDept] = useState('Engineering');
  const [newExp, setNewExp] = useState('5 years');
  const [newStage, setNewStage] = useState('Under Review');
  const [newInterviewDate, setNewInterviewDate] = useState('');

  const loadCandidates = () => {
    setCandidates(candidateService.getCandidates());
  };

  useEffect(() => {
    loadCandidates();
  }, []);

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
      stage: newStage,
      interviewDate: newInterviewDate || 'Pending Schedule',
      interviewer: 'Saurabh H.',
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
      c.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStage =
      stageFilter === 'All' || c.stage.toLowerCase() === stageFilter.toLowerCase();

    return matchesSearch && matchesStage;
  });

  const candidateTabs = [
    { id: 'All', label: 'All Pipeline', count: candidates.length },
    { id: 'Under Review', label: 'Under Review', count: candidates.filter((c) => c.stage === 'Under Review').length },
    { id: 'Interview Scheduled', label: 'Interview Scheduled', count: candidates.filter((c) => c.stage === 'Interview Scheduled').length },
    { id: 'Shortlisted', label: 'Shortlisted', count: candidates.filter((c) => c.stage === 'Shortlisted').length },
    { id: 'Offer Extended', label: 'Offer Extended', count: candidates.filter((c) => c.stage === 'Offer Extended').length, badgeColor: 'bg-emerald-50 text-emerald-700' },
    { id: 'Hired', label: 'Hired', count: candidates.filter((c) => c.stage === 'Hired').length, badgeColor: 'bg-blue-50 text-blue-700' },
  ];

  const columns = [
    {
      header: 'CANDIDATE',
      accessor: 'name',
      render: (row) => (
        <div className="flex items-center gap-2.5">
          <img
            src={row.avatar}
            alt={row.name}
            className="w-8 h-8 rounded-full object-cover ring-2 ring-[#E5EAF2]"
          />
          <div>
            <div
              className="font-bold text-[#172033] text-xs hover:text-[#2563EB] cursor-pointer"
              onClick={() => setSelectedCandidate(row)}
            >
              {row.name}
            </div>
            <div className="text-[10px] text-[#8292AD] font-medium">{row.email}</div>
          </div>
        </div>
      ),
    },
    {
      header: 'ROLE & DEPT',
      accessor: 'role',
      render: (row) => (
        <div>
          <div className="text-xs font-bold text-[#172033]">{row.role}</div>
          <div className="text-[10px] text-[#8292AD] font-medium">{row.department} • {row.experience}</div>
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
      header: 'RATING',
      accessor: 'rating',
      render: (row) => (
        <div className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
          <span>{row.rating}</span>
        </div>
      ),
    },
    {
      header: 'OPTIONS',
      accessor: 'stage',
      align: 'center',
      render: (row) => <StatusBadge status={row.stage} size="xs" showChevron={true} />,
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Page Header */}
      <PageHeader
        title="Candidate Management"
        badgeText="Recruitment Pipeline"
        subtitle="Manage job applicants, interview schedules, ratings and hiring offers."
        breadcrumbs={[{ label: 'Home', link: '/' }, { label: 'Candidates' }]}
        actions={
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white shadow-sm transition-all active:scale-95 shadow-blue-500/20"
          >
            <UserPlus className="w-4 h-4 stroke-[2.5]" />
            <span>Add Candidate</span>
          </button>
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
          icon={Star}
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

      {/* Search Header */}
      <div className="flex justify-end">
        <div className="w-full sm:w-72">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onClear={() => setSearchQuery('')}
            placeholder="Search candidates, roles, emails..."
          />
        </div>
      </div>

      {/* Table with Tab Pills & Circular Action Buttons matching Reference Image */}
      <DataTable
        columns={columns}
        data={filteredCandidates}
        pageSize={6}
        tabs={candidateTabs}
        activeTab={stageFilter}
        onTabChange={setStageFilter}
        filterInfo={`Filtered: ${filteredCandidates.length} Shown of ${candidates.length}`}
        emptyMessage="No candidates match your criteria"
        emptySubtext="Try filtering by another stage or search query."
        actions={(row) => (
          <div className="inline-flex items-center justify-end gap-1.5">
            <button
              onClick={() => handleUpdateStage(row.id, 'Hired')}
              title="Hire Candidate"
              className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center hover:bg-emerald-100 hover:scale-105 transition-all shadow-2xs"
            >
              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
            <button
              onClick={() => handleUpdateStage(row.id, 'Under Review')}
              title="Hold / Review"
              className="w-6 h-6 rounded-full bg-rose-50 text-rose-500 border border-rose-200 flex items-center justify-center hover:bg-rose-100 hover:scale-105 transition-all shadow-2xs"
            >
              <X className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
            <button
              onClick={() => setSelectedCandidate(row)}
              title="View Profile Details"
              className="w-6 h-6 rounded-full bg-slate-50 text-slate-500 border border-slate-200 flex items-center justify-center hover:bg-slate-100 hover:scale-105 transition-all shadow-2xs"
            >
              <Eye className="w-3.5 h-3.5" />
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
          subtitle="Record candidate contact info, applied role, and interview timing"
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
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#E5EAF2]">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-xs rounded-xl border border-[#E5EAF2] text-[#8292AD] hover:bg-[#F7F9FC]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-semibold rounded-xl bg-[#2563EB] text-white hover:bg-blue-700 shadow-sm"
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
                </select>
              </div>
              <button
                onClick={() => setSelectedCandidate(null)}
                className="px-4 py-1.5 text-xs font-medium rounded-xl border border-[#E5EAF2] text-[#172033] hover:bg-[#F7F9FC]"
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
                <div className="flex items-center gap-3 text-xs text-[#8292AD] mt-1">
                  <span>{selectedCandidate.email}</span>
                  <span>•</span>
                  <span>{selectedCandidate.phone}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl border border-[#E5EAF2]">
                <span className="text-[#8292AD] block mb-0.5">Department</span>
                <span className="font-semibold text-[#172033]">{selectedCandidate.department}</span>
              </div>
              <div className="p-3 rounded-xl border border-[#E5EAF2]">
                <span className="text-[#8292AD] block mb-0.5">Experience</span>
                <span className="font-semibold text-[#172033]">{selectedCandidate.experience}</span>
              </div>
              <div className="p-3 rounded-xl border border-[#E5EAF2]">
                <span className="text-[#8292AD] block mb-0.5">Interviewer</span>
                <span className="font-semibold text-[#172033]">{selectedCandidate.interviewer}</span>
              </div>
              <div className="p-3 rounded-xl border border-[#E5EAF2]">
                <span className="text-[#8292AD] block mb-0.5">Rating</span>
                <span className="font-semibold text-amber-600 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  {selectedCandidate.rating}
                </span>
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
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-50 text-[#2563EB] hover:bg-blue-100 border border-blue-200 transition-colors"
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

