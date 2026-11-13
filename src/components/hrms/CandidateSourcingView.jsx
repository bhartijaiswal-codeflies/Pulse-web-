import React, { useState, useMemo } from 'react';
import {
  UserPlus,
  Search,
  Filter,
  Check,
  X,
  Mail,
  Phone,
  Copy,
  ExternalLink,
  ChevronDown,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Briefcase,
  Building,
  Edit3,
  Trash2,
  ArrowRight,
  Eye,
  UserCheck,
  Camera,
  Upload,
  Image as ImageIcon,
  ImagePlus,
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { SearchBar } from '../common/SearchBar';
import { hrmsService } from '../../services/hrmsService';
import { useToast } from '../../context/NotificationContext';

export const CandidateSourcingView = ({ prefillRole, onCandidateApproved }) => {
  const { addToast } = useToast();
  const [sourcedList, setSourcedList] = useState(() => hrmsService.getSourcedCandidates());

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState(prefillRole || 'All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Modals
  const [showAddModal, setShowAddModal] = useState(!!prefillRole);
  const [viewingCandidate, setViewingCandidate] = useState(null);
  const [editingCandidate, setEditingCandidate] = useState(null);
  const [candidateToDelete, setCandidateToDelete] = useState(null);
  const [approvingCandidate, setApprovingCandidate] = useState(null);

  // Form State matching handwritten note: Email, name, phone, description, experience, Role
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    avatar: '',
    role: prefillRole || 'SEO Manager',
    department: 'Marketing',
    experience: '3 Years',
    currentCompany: '',
    location: 'Noida, UP',
    noticePeriod: '30 Days',
    expectedCtc: '₹8,00,000',
    description: '',
    resumeUrl: '',
    sourceChannel: 'LinkedIn Sourcing',
  });

  const loadData = () => {
    setSourcedList(hrmsService.getSourcedCandidates());
  };

  // Filtered List
  const filteredList = useMemo(() => {
    return sourcedList.filter((item) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.name?.toLowerCase().includes(q) ||
        item.email?.toLowerCase().includes(q) ||
        item.phone?.toLowerCase().includes(q) ||
        item.role?.toLowerCase().includes(q) ||
        item.description?.toLowerCase().includes(q);

      const matchesRole = roleFilter === 'All' || item.role === roleFilter;
      const matchesStatus = statusFilter === 'All' || item.status === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [sourcedList, searchQuery, roleFilter, statusFilter]);

  // Copy to clipboard
  const handleCopy = (text, label) => {
    navigator.clipboard.writeText(text);
    addToast({ title: 'Copied ✓', message: `${label} copied to clipboard.`, type: 'info' });
  };

  // Open Add Modal
  const handleOpenAdd = () => {
    setForm({
      name: '',
      email: '',
      phone: '',
      avatar: '',
      role: prefillRole || 'SEO Manager',
      department: 'Marketing',
      experience: '3 Years',
      currentCompany: '',
      location: 'Noida, UP',
      noticePeriod: '30 Days',
      expectedCtc: '₹8,00,000',
      description: '',
      resumeUrl: '',
      sourceChannel: 'LinkedIn Sourcing',
    });
    setEditingCandidate(null);
    setShowAddModal(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (cand) => {
    setEditingCandidate(cand);
    setForm({
      name: cand.name,
      email: cand.email,
      phone: cand.phone,
      avatar: cand.avatar || '',
      role: cand.role,
      department: cand.department || 'Marketing',
      experience: cand.experience,
      currentCompany: cand.currentCompany || '',
      location: cand.location || '',
      noticePeriod: cand.noticePeriod || '30 Days',
      expectedCtc: cand.expectedCtc || '',
      description: cand.description || '',
      resumeUrl: cand.resumeUrl || '',
      sourceChannel: cand.sourceChannel || 'LinkedIn Sourcing',
    });
    setShowAddModal(true);
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      addToast({
        title: 'Invalid File',
        message: 'Please choose an image file (PNG, JPG, JPEG, WEBP).',
        type: 'warning',
      });
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      setForm((prev) => ({ ...prev, avatar: event.target.result }));
      addToast({
        title: 'Photo Uploaded',
        message: 'Candidate photo ready.',
        type: 'success',
      });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Submit Candidate Form
  const handleSubmitCandidate = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.role.trim()) {
      addToast({ title: 'Missing Fields', message: 'Name, email, and target role are required.', type: 'warning' });
      return;
    }

    if (editingCandidate) {
      hrmsService.updateSourcedCandidate(editingCandidate.id, form);
      addToast({ title: 'Candidate Updated ✓', message: `${form.name}'s profile has been updated.`, type: 'success' });
    } else {
      hrmsService.addSourcedCandidate(form);
      addToast({
        title: 'Candidate Sourced ✓',
        message: `${form.name} added to Sourcing intake pipeline.`,
        type: 'success',
      });
    }

    setShowAddModal(false);
    loadData();
  };

  // Approve Candidate and Move to Active Candidates List (Core Workflow)
  const handleConfirmApproval = () => {
    if (!approvingCandidate) return;

    const result = hrmsService.approveAndMoveToCandidates(approvingCandidate.id);
    if (result) {
      addToast({
        title: 'Candidate Approved! 🎉',
        message: `${approvingCandidate.name} has been moved to the active Candidates tab ready for interview rounds.`,
        type: 'success',
      });
      setApprovingCandidate(null);
      loadData();
      onCandidateApproved?.(result.newCandidate);
    }
  };

  // Delete Candidate
  const handleDeleteCandidate = () => {
    if (!candidateToDelete) return;
    hrmsService.deleteSourcedCandidate(candidateToDelete.id);
    addToast({ title: 'Record Removed', message: `${candidateToDelete.name} removed from sourcing intake.`, type: 'info' });
    setCandidateToDelete(null);
    loadData();
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Banner & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-teal-900 via-emerald-950 to-slate-900 text-white shadow-md border border-teal-950/40">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-teal-500/30 text-teal-300 border border-teal-400/30">
              Talent Sourcing Intake
            </span>
            <span className="text-xs text-teal-200/80 font-medium">Stage 1: Pre-Screening</span>
          </div>
          <h2 className="text-xl font-black mt-1.5 text-white tracking-tight">Candidate Sourcing & Screening Pool</h2>
          <p className="text-xs text-slate-300 mt-0.5 max-w-2xl leading-relaxed">
            All prospective candidate applications enter here first. Review credentials, qualifications, and portfolio notes. Once vetted, click <strong>"Approve & Move to Candidates"</strong> to promote the candidate into the active interview pipeline.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-shrink-0">
          <button
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-4 h-10 text-xs font-bold rounded-xl bg-teal-600 hover:bg-teal-500 text-white shadow-md active:scale-95 transition-all cursor-pointer"
          >
            <UserPlus className="w-4 h-4 stroke-[2.5]" />
            <span>+ Source Candidate</span>
          </button>
        </div>
      </div>

      {/* 2. Top Summary Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-[#E5EAF2] shadow-2xs">
          <span className="text-[11px] font-bold text-[#8292AD] uppercase tracking-wider">Total Sourced Profiles</span>
          <div className="text-2xl font-black text-[#172033] mt-1">{sourcedList.length} Candidates</div>
          <div className="text-[11px] text-teal-600 font-semibold mt-0.5 flex items-center gap-1">
            <UserPlus className="w-3 h-3" />
            <span>Top-of-funnel intake</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#E5EAF2] shadow-2xs">
          <span className="text-[11px] font-bold text-[#8292AD] uppercase tracking-wider">Under Screening</span>
          <div className="text-2xl font-black text-amber-600 mt-1">
            {sourcedList.filter((c) => c.status === 'Sourced').length} Pending
          </div>
          <div className="text-[11px] text-amber-600 font-semibold mt-0.5 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>Awaiting approval</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#E5EAF2] shadow-2xs">
          <span className="text-[11px] font-bold text-[#8292AD] uppercase tracking-wider">Approved & Moved</span>
          <div className="text-2xl font-black text-emerald-700 mt-1">
            {sourcedList.filter((c) => c.status === 'Approved').length} Candidates
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-0.5 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>In Candidate Tab</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#E5EAF2] shadow-2xs">
          <span className="text-[11px] font-bold text-[#8292AD] uppercase tracking-wider">Fast Sourcing</span>
          <div className="text-xs font-bold text-slate-700 mt-2">
            Target Roles: SEO, SME, BDE, Web Design, App Dev
          </div>
          <div className="text-[10px] text-[#8292AD] mt-0.5">Automated screening promotion</div>
        </div>
      </div>

      {/* 3. Filter Bar */}
      <div className="p-3.5 rounded-2xl bg-white border border-[#E5EAF2] shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto flex-1">
          {/* Search */}
          <div className="w-full sm:w-64 min-w-[220px]">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              onClear={() => setSearchQuery('')}
              placeholder="Search candidate name, email, role..."
            />
          </div>

          {/* Role Filter */}
          <div className="relative min-w-[155px]">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full appearance-none pl-8 pr-8 h-9 text-xs font-semibold rounded-xl border border-[#E5EAF2] bg-white text-[#172033] hover:bg-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer shadow-2xs"
            >
              <option value="All">All Roles</option>
              <option value="SEO Manager">SEO Manager</option>
              <option value="SEO Executive">SEO Executive</option>
              <option value="Web Designer">Web Designer</option>
              <option value="App Developer">App Developer</option>
              <option value="BDE">BDE (Business Development)</option>
              <option value="Subject Matter Expert (SME)">Subject Matter Expert (SME)</option>
            </select>
            <Briefcase className="w-3.5 h-3.5 text-teal-600 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <ChevronDown className="w-3.5 h-3.5 text-[#8292AD] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Status Filter */}
          <div className="relative min-w-[130px]">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full appearance-none pl-8 pr-8 h-9 text-xs font-semibold rounded-xl border border-[#E5EAF2] bg-white text-[#172033] hover:bg-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer shadow-2xs"
            >
              <option value="All">All Statuses</option>
              <option value="Sourced">Sourced (Pending)</option>
              <option value="Approved">Approved (In Pipeline)</option>
              <option value="Rejected">Rejected</option>
            </select>
            <Filter className="w-3.5 h-3.5 text-[#2563EB] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <ChevronDown className="w-3.5 h-3.5 text-[#8292AD] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Clear Filters */}
          {(searchQuery || roleFilter !== 'All' || statusFilter !== 'All') && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setRoleFilter('All');
                setStatusFilter('All');
              }}
              className="inline-flex items-center gap-1.5 px-3 h-9 text-xs font-semibold rounded-xl border border-rose-200 bg-rose-50/70 text-rose-700 hover:bg-rose-100 transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          )}
        </div>

        <div className="text-xs text-[#8292AD] font-medium flex-shrink-0">
          Showing <strong>{filteredList.length}</strong> of {sourcedList.length} sourced records
        </div>
      </div>

      {/* 4. Sourced Candidates Table */}
      <div className="bg-white rounded-2xl border border-[#E5EAF2] shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E5EAF2] text-[#8292AD] font-bold uppercase text-[10.5px] tracking-wider">
                <th className="py-3 px-4 min-w-[180px]">Candidate Profile</th>
                <th className="py-3 px-4 min-w-[190px]">Contact Info</th>
                <th className="py-3 px-4 min-w-[140px]">Target Role</th>
                <th className="py-3 px-4 min-w-[100px]">Experience</th>
                <th className="py-3 px-4 min-w-[240px]">Sourcing Description & Notes</th>
                <th className="py-3 px-4 min-w-[120px]">Status</th>
                <th className="py-3 px-4 min-w-[190px] text-right">Approval & Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5EAF2]">
              {filteredList.map((cand) => {
                const isApproved = cand.status === 'Approved';

                return (
                  <tr
                    key={cand.id}
                    className="hover:bg-slate-50/70 transition-colors group cursor-pointer"
                    onClick={() => setViewingCandidate(cand)}
                  >
                    {/* 1. Candidate Profile */}
                    <td className="py-3.5 px-4">
                      <div className="min-w-0">
                        <div className="font-bold text-[#172033] hover:text-[#2563EB] transition-colors truncate">
                          {cand.name}
                        </div>
                        <div className="text-[10px] text-[#8292AD] font-medium flex items-center gap-1 mt-0.5">
                          <span className="font-mono text-slate-600">{cand.id}</span>
                          <span>•</span>
                          <span>{cand.sourceChannel}</span>
                        </div>
                      </div>
                    </td>

                    {/* 2. Contact Info */}
                    <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-slate-700">
                          <Mail className="w-3 h-3 text-[#8292AD] flex-shrink-0" />
                          <a
                            href={`mailto:${cand.email}`}
                            className="hover:text-[#2563EB] hover:underline truncate max-w-[150px]"
                            title={cand.email}
                          >
                            {cand.email}
                          </a>
                          <button
                            type="button"
                            onClick={() => handleCopy(cand.email, 'Email')}
                            className="text-slate-400 hover:text-slate-700 cursor-pointer"
                            title="Copy email"
                          >
                            <Copy className="w-2.5 h-2.5" />
                          </button>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-600">
                          <Phone className="w-3 h-3 text-[#8292AD] flex-shrink-0" />
                          <a href={`tel:${cand.phone}`} className="hover:text-[#2563EB] hover:underline font-mono text-[11px]">
                            {cand.phone}
                          </a>
                        </div>
                      </div>
                    </td>

                    {/* 3. Target Role */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-[#172033]">{cand.role}</span>
                        <span className="text-[10px] text-[#8292AD]">{cand.department || 'Talent Pool'}</span>
                      </div>
                    </td>

                    {/* 4. Experience */}
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                        {cand.experience}
                      </span>
                    </td>

                    {/* 5. Description & Notes */}
                    <td className="py-3.5 px-4">
                      <div className="max-w-xs">
                        <p className="text-xs text-[#526484] line-clamp-2 leading-relaxed" title={cand.description}>
                          {cand.description || 'No notes entered.'}
                        </p>
                        {cand.expectedCtc && (
                          <span className="text-[10px] text-emerald-700 font-semibold block mt-0.5">
                            Expected: {cand.expectedCtc} • Notice: {cand.noticePeriod || '30 Days'}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* 6. Status */}
                    <td className="py-3.5 px-4">
                      {isApproved ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Approved ✓</span>
                        </span>
                      ) : cand.status === 'Rejected' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-rose-50 text-rose-700 border border-rose-200">
                          <X className="w-3 h-3 text-rose-600" />
                          <span>Rejected</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-amber-50 text-amber-700 border border-amber-200">
                          <Clock className="w-3 h-3 text-amber-600" />
                          <span>Sourced</span>
                        </span>
                      )}
                    </td>

                    {/* 7. Approval & Actions */}
                    <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="inline-flex items-center justify-end gap-1.5">
                        {/* Primary Workflow Button: Approve & Move to Candidates */}
                        {!isApproved ? (
                          <button
                            type="button"
                            onClick={() => setApprovingCandidate(cand)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs active:scale-95 transition-all cursor-pointer"
                            title="Approve candidate and move to active Candidates pipeline table"
                          >
                            <UserCheck className="w-3 h-3" />
                            <span>Approve & Move</span>
                          </button>
                        ) : (
                          <span className="text-[10px] text-emerald-700 font-bold px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-200">
                            Moved to Candidates
                          </span>
                        )}

                        {/* View Button */}
                        <button
                          type="button"
                          onClick={() => setViewingCandidate(cand)}
                          className="w-7 h-7 rounded-full bg-blue-50 text-[#2563EB] border border-blue-200 hover:bg-blue-100 flex items-center justify-center transition-colors cursor-pointer"
                          title="View Sourced Profile"
                        >
                          <Eye className="w-3 h-3" />
                        </button>

                        {/* Edit Button */}
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(cand)}
                          className="w-7 h-7 rounded-full bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200 flex items-center justify-center transition-colors cursor-pointer"
                          title="Edit Sourced Info"
                        >
                          <Edit3 className="w-3 h-3" />
                        </button>

                        {/* Delete Button */}
                        <button
                          type="button"
                          onClick={() => setCandidateToDelete(cand)}
                          className="w-7 h-7 rounded-full bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100 flex items-center justify-center transition-colors cursor-pointer"
                          title="Remove Sourced Record"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredList.length === 0 && (
          <div className="p-12 text-center">
            <UserPlus className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h4 className="text-sm font-bold text-[#172033]">No sourced candidates found</h4>
            <p className="text-xs text-[#8292AD] mt-1">Add candidate profiles to begin the pre-screening intake.</p>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: ADD / EDIT SOURCED CANDIDATE                                    */}
      {/* ========================================================================= */}
      {showAddModal && (
        <Modal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          title={editingCandidate ? `Edit Sourced Profile: ${editingCandidate.name}` : 'Source New Candidate'}
          subtitle="Pre-screening candidate data entry (Promotes to Candidates tab upon approval)"
          maxWidth="max-w-2xl"
        >
          <form onSubmit={handleSubmitCandidate} className="space-y-4 text-xs">
            {/* Candidate Photo Upload Section */}
            <div className="bg-[#F8FAFC] p-3.5 rounded-xl border border-[#E5EAF2]">
              <div className="flex items-center justify-between mb-2">
                <div className="text-[11px] font-bold text-[#8292AD] uppercase tracking-wider flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5 text-[#2563EB]" />
                  <span>Candidate Photo (Optional)</span>
                </div>
                {form.avatar && (
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, avatar: '' })}
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
                  {form.avatar ? (
                    <img
                      src={form.avatar}
                      alt="Avatar preview"
                      className="w-16 h-16 rounded-2xl object-cover ring-2 ring-white shadow-sm border border-[#E5EAF2]"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-50 to-emerald-100 border border-teal-200/60 text-[#008080] flex flex-col items-center justify-center font-bold text-xs shadow-2xs">
                      <Camera className="w-5 h-5 text-[#008080]/70 mb-0.5" />
                      <span className="text-[9px] text-slate-500 font-medium">No Photo</span>
                    </div>
                  )}

                  <label
                    htmlFor="sourcing-avatar-upload"
                    className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover/avatar:opacity-100 flex flex-col items-center justify-center transition-opacity text-white text-[9px] font-bold cursor-pointer backdrop-blur-2xs"
                    title="Upload photo from device"
                  >
                    <Upload className="w-3.5 h-3.5 mb-0.5" />
                    <span>Upload</span>
                  </label>
                  <input
                    id="sourcing-avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />
                </div>

                {/* Upload Controls */}
                <div className="flex-1 min-w-0 w-full space-y-2">
                  <div className="flex items-center gap-2">
                    <label
                      htmlFor="sourcing-avatar-upload"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-white text-[#008080] border border-[#008080]/30 hover:bg-teal-50/70 transition-colors cursor-pointer shadow-2xs"
                    >
                      <Upload className="w-3.5 h-3.5 text-[#008080]" />
                      <span>Upload Device Photo</span>
                    </label>
                    <span className="text-[11px] text-slate-400">or paste image link</span>
                  </div>

                  <div className="relative">
                    <input
                      type="url"
                      value={form.avatar || ''}
                      onChange={(e) => setForm({ ...form, avatar: e.target.value })}
                      placeholder="Paste image URL (https://images.unsplash.com/...)"
                      className="w-full pl-3 pr-8 py-1.5 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#008080]/20 bg-white placeholder:text-slate-400"
                    />
                    {form.avatar && (
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, avatar: '' })}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                        title="Clear photo link"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-[#172033] mb-1">Candidate Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kavita Sharma"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#172033] mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="kavita.sharma@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#172033] mb-1">Phone Number *</label>
                <input
                  type="text"
                  required
                  placeholder="+91 98765 43210"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#172033] mb-1">Target Role * (from Open JDs)</label>
                <select
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:border-[#2563EB] cursor-pointer font-semibold text-[#172033]"
                >
                  <option value="SEO Manager">SEO Manager</option>
                  <option value="SEO Executive">SEO Executive</option>
                  <option value="Web Designer">Web Designer</option>
                  <option value="App Developer">App Developer</option>
                  <option value="BDE">BDE (Business Development)</option>
                  <option value="Subject Matter Expert (SME)">Subject Matter Expert (SME)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#172033] mb-1">Experience *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 4.5 Years"
                  value={form.experience}
                  onChange={(e) => setForm({ ...form, experience: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#172033] mb-1">Current Organization / Company</label>
                <input
                  type="text"
                  placeholder="e.g. GrowthX Media"
                  value={form.currentCompany}
                  onChange={(e) => setForm({ ...form, currentCompany: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#172033] mb-1">Expected Salary (CTC)</label>
                <input
                  type="text"
                  placeholder="e.g. ₹9,50,000 / Yr"
                  value={form.expectedCtc}
                  onChange={(e) => setForm({ ...form, expectedCtc: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#172033] mb-1">Sourcing Channel / Origin</label>
                <select
                  value={form.sourceChannel}
                  onChange={(e) => setForm({ ...form, sourceChannel: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:border-[#2563EB] cursor-pointer"
                >
                  <option value="LinkedIn Recruiter">LinkedIn Recruiter</option>
                  <option value="Employee Referral">Employee Referral</option>
                  <option value="Naukri.com">Naukri.com</option>
                  <option value="Direct Inbound Application">Direct Inbound Application</option>
                  <option value="Agency Partner">Agency Partner</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-[#172033] mb-1">
                  Description & Candidate Profile Notes * (Qualifications, achievements, screening remarks)
                </label>
                <textarea
                  rows="3"
                  required
                  placeholder="Enter candidate summary, skills background, and reasons for sourcing..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:border-[#2563EB] leading-relaxed"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2.5 pt-3 border-t border-[#E5EAF2]">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-xs font-semibold rounded-xl border border-[#E5EAF2] text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold rounded-xl bg-teal-600 hover:bg-teal-700 text-white shadow-sm cursor-pointer"
              >
                {editingCandidate ? 'Update Profile' : 'Save Sourced Candidate'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: CONFIRM APPROVE AND MOVE TO CANDIDATES                           */}
      {/* ========================================================================= */}
      {approvingCandidate && (
        <Modal
          isOpen={!!approvingCandidate}
          onClose={() => setApprovingCandidate(null)}
          title="Approve & Move to Candidates Pipeline"
          maxWidth="max-w-md"
        >
          <div className="space-y-4 text-xs">
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200">
              <div className="flex items-center gap-3">
                {approvingCandidate.avatar && (
                  <img
                    src={approvingCandidate.avatar}
                    alt={approvingCandidate.name}
                    className="w-11 h-11 rounded-2xl object-cover ring-2 ring-white shadow-2xs flex-shrink-0"
                  />
                )}
                <div>
                  <h4 className="font-extrabold text-[#172033] text-sm">{approvingCandidate.name}</h4>
                  <p className="text-[11px] text-emerald-800 font-semibold mt-0.5">
                    Role: {approvingCandidate.role} • {approvingCandidate.experience}
                  </p>
                </div>
              </div>
            </div>

            <p className="text-slate-600 leading-relaxed">
              Moving this candidate will promote them from <strong>Sourcing</strong> directly into the active <strong>Candidates</strong> tab list, creating an active recruitment profile ready for interview scheduling and rounds.
            </p>

            <div className="flex justify-end gap-2.5 pt-3 border-t border-[#E5EAF2]">
              <button
                type="button"
                onClick={() => setApprovingCandidate(null)}
                className="px-4 py-2 text-xs font-semibold rounded-xl border border-[#E5EAF2] text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmApproval}
                className="px-5 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm cursor-pointer flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Confirm & Promote</span>
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: VIEW SOURCED CANDIDATE DETAILS                                   */}
      {/* ========================================================================= */}
      {viewingCandidate && (
        <Modal
          isOpen={!!viewingCandidate}
          onClose={() => setViewingCandidate(null)}
          title={`Sourced Profile: ${viewingCandidate.name}`}
          subtitle={`Intake ID: ${viewingCandidate.id} • Target Role: ${viewingCandidate.role}`}
          maxWidth="max-w-lg"
        >
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {viewingCandidate.avatar && (
                  <img
                    src={viewingCandidate.avatar}
                    alt={viewingCandidate.name}
                    className="w-12 h-12 rounded-2xl object-cover ring-2 ring-white shadow-2xs flex-shrink-0"
                  />
                )}
                <div>
                  <h3 className="text-base font-extrabold text-[#172033]">{viewingCandidate.name}</h3>
                  <p className="text-[11px] text-slate-600 font-medium mt-0.5">
                    {viewingCandidate.currentCompany ? `${viewingCandidate.currentCompany} • ` : ''}
                    {viewingCandidate.location}
                  </p>
                </div>
              </div>

              <span
                className={`px-2.5 py-1 rounded-full text-xs font-extrabold ${
                  viewingCandidate.status === 'Approved'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}
              >
                {viewingCandidate.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-white border border-slate-200">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#8292AD] block">Email Address</span>
                <span className="text-xs font-semibold text-slate-900 select-all">{viewingCandidate.email}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-[#8292AD] block">Phone Number</span>
                <span className="text-xs font-semibold text-slate-900 select-all">{viewingCandidate.phone}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-[#8292AD] block">Total Experience</span>
                <span className="text-xs font-semibold text-slate-900">{viewingCandidate.experience}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-[#8292AD] block">Expected CTC</span>
                <span className="text-xs font-semibold text-emerald-700">{viewingCandidate.expectedCtc || 'Not specified'}</span>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-[#172033] text-xs uppercase tracking-wider mb-1">Sourcing Notes & Summary</h4>
              <p className="text-xs text-[#526484] leading-relaxed p-3 rounded-xl bg-slate-50 border border-slate-200">
                {viewingCandidate.description}
              </p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[#E5EAF2]">
              <button
                type="button"
                onClick={() => setViewingCandidate(null)}
                className="px-4 py-2 text-xs font-semibold rounded-xl border border-[#E5EAF2] text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Close
              </button>

              {viewingCandidate.status !== 'Approved' && (
                <button
                  type="button"
                  onClick={() => {
                    const c = viewingCandidate;
                    setViewingCandidate(null);
                    setApprovingCandidate(c);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm cursor-pointer"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Approve & Move to Candidates →</span>
                </button>
              )}
            </div>
          </div>
        </Modal>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: DELETE CONFIRMATION                                              */}
      {/* ========================================================================= */}
      {candidateToDelete && (
        <Modal
          isOpen={!!candidateToDelete}
          onClose={() => setCandidateToDelete(null)}
          title="Remove Sourced Record"
          maxWidth="max-w-md"
        >
          <div className="space-y-4 text-xs">
            <p className="text-slate-600 leading-relaxed">
              Are you sure you want to remove <strong className="text-slate-900">{candidateToDelete.name}</strong> from the sourcing intake list?
            </p>
            <div className="flex justify-end gap-2.5 pt-3 border-t border-[#E5EAF2]">
              <button
                type="button"
                onClick={() => setCandidateToDelete(null)}
                className="px-4 py-2 text-xs font-semibold rounded-xl border border-[#E5EAF2] text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteCandidate}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-rose-600 hover:bg-rose-700 text-white cursor-pointer"
              >
                Yes, Remove
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
