import React, { useState, useMemo } from 'react';
import {
  Briefcase,
  Plus,
  Search,
  Filter,
  Users,
  Clock,
  Building,
  CheckCircle2,
  AlertTriangle,
  Flame,
  FileText,
  Share2,
  ChevronDown,
  Eye,
  Edit3,
  Trash2,
  X,
  ExternalLink,
  MapPin,
  DollarSign,
  Tag,
  Check,
  UserPlus,
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { SearchBar } from '../common/SearchBar';
import { hrmsService } from '../../services/hrmsService';
import { useToast } from '../../context/NotificationContext';

export const HiringPositionsView = ({ onNavigateToSourcing }) => {
  const { addToast } = useToast();
  const [positions, setPositions] = useState(() => hrmsService.getOpenPositions());

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [deptFilter, setDeptFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Modals
  const [selectedJd, setSelectedJd] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingPosition, setEditingPosition] = useState(null);
  const [positionToDelete, setPositionToDelete] = useState(null);

  // Form State
  const [form, setForm] = useState({
    title: '',
    department: 'Marketing',
    openings: 2,
    priority: 'Priority 1 (Urgent)',
    experience: '2 - 5 Years',
    salaryRange: '₹6,00,000 - ₹9,00,000 / Yr',
    location: 'Noida / Hybrid',
    type: 'Full Time',
    status: 'Active',
    keySkills: '',
    description: '',
  });

  const loadPositions = () => {
    setPositions(hrmsService.getOpenPositions());
  };

  // Filtered positions
  const filteredPositions = useMemo(() => {
    return positions.filter((pos) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        pos.title?.toLowerCase().includes(q) ||
        pos.department?.toLowerCase().includes(q) ||
        pos.description?.toLowerCase().includes(q) ||
        pos.keySkills?.some((s) => s.toLowerCase().includes(q));

      const matchesPriority =
        priorityFilter === 'All' ||
        (priorityFilter === 'P1' && pos.priority?.includes('Priority 1')) ||
        (priorityFilter === 'P2' && pos.priority?.includes('Priority 2')) ||
        (priorityFilter === 'P3' && pos.priority?.includes('Priority 3'));

      const matchesDept = deptFilter === 'All' || pos.department === deptFilter;
      const matchesStatus = statusFilter === 'All' || pos.status === statusFilter;

      return matchesSearch && matchesPriority && matchesDept && matchesStatus;
    });
  }, [positions, searchQuery, priorityFilter, deptFilter, statusFilter]);

  // Priority Badge Helper
  const getPriorityBadge = (priority) => {
    if (priority?.includes('1') || priority?.toLowerCase().includes('urgent')) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-rose-50 text-rose-700 border border-rose-200">
          <Flame className="w-3 h-3 text-rose-600 fill-rose-600/20" />
          <span>Priority 1 (Urgent)</span>
        </span>
      );
    }
    if (priority?.includes('2') || priority?.toLowerCase().includes('high')) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-amber-50 text-amber-700 border border-amber-200">
          <AlertTriangle className="w-3 h-3 text-amber-600" />
          <span>Priority 2 (High)</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-blue-50 text-[#2563EB] border border-blue-200">
        <Clock className="w-3 h-3 text-[#2563EB]" />
        <span>Priority 3 (Normal)</span>
      </span>
    );
  };

  // Open Create Modal
  const handleOpenCreate = () => {
    setForm({
      title: '',
      department: 'Marketing',
      openings: 2,
      priority: 'Priority 1 (Urgent)',
      experience: '2 - 5 Years',
      salaryRange: '₹6,00,000 - ₹9,00,000 / Yr',
      location: 'Noida / Hybrid',
      type: 'Full Time',
      status: 'Active',
      keySkills: 'SEO, Technical Audits, Analytics',
      description: '',
    });
    setEditingPosition(null);
    setShowCreateModal(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (pos) => {
    setEditingPosition(pos);
    setForm({
      title: pos.title,
      department: pos.department,
      openings: pos.openings,
      priority: pos.priority,
      experience: pos.experience,
      salaryRange: pos.salaryRange,
      location: pos.location,
      type: pos.type,
      status: pos.status,
      keySkills: Array.isArray(pos.keySkills) ? pos.keySkills.join(', ') : pos.keySkills,
      description: pos.description,
    });
    setShowCreateModal(true);
  };

  // Submit Position Form
  const handleSubmitPosition = (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      addToast({ title: 'Role Required', message: 'Please provide job position title.', type: 'warning' });
      return;
    }

    if (editingPosition) {
      hrmsService.updateOpenPosition(editingPosition.id, {
        ...form,
        openings: Number(form.openings) || 1,
        keySkills: String(form.keySkills).split(',').map((s) => s.trim()).filter(Boolean),
      });
      addToast({ title: 'Position Updated ✓', message: `${form.title} JD has been updated.`, type: 'success' });
    } else {
      hrmsService.addOpenPosition({
        ...form,
        openings: Number(form.openings) || 1,
        keySkills: String(form.keySkills).split(',').map((s) => s.trim()).filter(Boolean),
      });
      addToast({ title: 'Position Published ✓', message: `New opening for ${form.title} created.`, type: 'success' });
    }

    setShowCreateModal(false);
    loadPositions();
  };

  // Delete Position
  const handleDeletePosition = () => {
    if (!positionToDelete) return;
    hrmsService.deleteOpenPosition(positionToDelete.id);
    addToast({ title: 'Position Closed', message: `${positionToDelete.title} removed from open positions.`, type: 'info' });
    setPositionToDelete(null);
    loadPositions();
  };

  const totalOpenings = useMemo(() => {
    return positions.reduce((acc, p) => acc + (Number(p.openings) || 0), 0);
  }, [positions]);

  const p1Count = useMemo(() => {
    return positions.filter((p) => p.priority?.includes('1')).length;
  }, [positions]);

  return (
    <div className="space-y-6">
      {/* 1. Header Banner & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 text-white shadow-md border border-blue-950/40">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-500/30 text-blue-300 border border-blue-400/30">
              Open Positions & JDs
            </span>
            <span className="text-xs text-blue-200/80 font-medium">Workforce Expansion</span>
          </div>
          <h2 className="text-xl font-black mt-1.5 text-white tracking-tight">Hiring Positions & Job Descriptions</h2>
          <p className="text-xs text-slate-300 mt-0.5 max-w-2xl leading-relaxed">
            Manage active vacancies, set department priorities (SEO, SME, BDE, Design, Dev), define role requirements, and fast-track candidate sourcing.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-shrink-0">
          <button
            type="button"
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 px-4 h-10 text-xs font-bold rounded-xl bg-[#2563EB] hover:bg-blue-600 text-white shadow-md active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Post New Position</span>
          </button>
        </div>
      </div>

      {/* 2. Top Summary Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-[#E5EAF2] shadow-2xs">
          <span className="text-[11px] font-bold text-[#8292AD] uppercase tracking-wider">Total Active Roles</span>
          <div className="text-2xl font-black text-[#172033] mt-1">{positions.length} Positions</div>
          <div className="text-[11px] text-blue-600 font-semibold mt-0.5 flex items-center gap-1">
            <Briefcase className="w-3 h-3" />
            <span>Live on job portal</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#E5EAF2] shadow-2xs">
          <span className="text-[11px] font-bold text-[#8292AD] uppercase tracking-wider">Total Vacancies</span>
          <div className="text-2xl font-black text-emerald-700 mt-1">{totalOpenings} Openings</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-0.5 flex items-center gap-1">
            <Users className="w-3 h-3" />
            <span>Approved headcount</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#E5EAF2] shadow-2xs">
          <span className="text-[11px] font-bold text-[#8292AD] uppercase tracking-wider">Priority 1 (Urgent)</span>
          <div className="text-2xl font-black text-rose-700 mt-1">{p1Count} Roles</div>
          <div className="text-[11px] text-rose-600 font-semibold mt-0.5 flex items-center gap-1">
            <Flame className="w-3 h-3" />
            <span>Immediate fulfillment</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#E5EAF2] shadow-2xs">
          <span className="text-[11px] font-bold text-[#8292AD] uppercase tracking-wider">Quick Action</span>
          <button
            type="button"
            onClick={() => onNavigateToSourcing?.()}
            className="w-full mt-2 inline-flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl bg-teal-50 text-[#008080] border border-teal-200 hover:bg-teal-100 text-xs font-bold transition-colors cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Go to Sourcing Tab →</span>
          </button>
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
              placeholder="Search SEO, SME, BDE, Web Design..."
            />
          </div>

          {/* Priority Filter */}
          <div className="relative min-w-[155px]">
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full appearance-none pl-8 pr-8 h-9 text-xs font-semibold rounded-xl border border-[#E5EAF2] bg-white text-[#172033] hover:bg-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer shadow-2xs"
            >
              <option value="All">All Priorities</option>
              <option value="P1">Priority 1 (Urgent)</option>
              <option value="P2">Priority 2 (High)</option>
              <option value="P3">Priority 3 (Normal)</option>
            </select>
            <Flame className="w-3.5 h-3.5 text-rose-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <ChevronDown className="w-3.5 h-3.5 text-[#8292AD] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Department Filter */}
          <div className="relative min-w-[145px]">
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="w-full appearance-none pl-8 pr-8 h-9 text-xs font-semibold rounded-xl border border-[#E5EAF2] bg-white text-[#172033] hover:bg-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer shadow-2xs"
            >
              <option value="All">All Departments</option>
              <option value="Marketing">Marketing</option>
              <option value="Engineering">Engineering</option>
              <option value="Web Design">Web Design</option>
              <option value="Sales">Sales</option>
              <option value="Operations">Operations</option>
            </select>
            <Building className="w-3.5 h-3.5 text-[#2563EB] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <ChevronDown className="w-3.5 h-3.5 text-[#8292AD] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Status Filter */}
          <div className="relative min-w-[125px]">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full appearance-none pl-8 pr-8 h-9 text-xs font-semibold rounded-xl border border-[#E5EAF2] bg-white text-[#172033] hover:bg-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer shadow-2xs"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="On Hold">On Hold</option>
              <option value="Closed">Closed</option>
            </select>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <ChevronDown className="w-3.5 h-3.5 text-[#8292AD] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Clear Filters */}
          {(searchQuery || priorityFilter !== 'All' || deptFilter !== 'All' || statusFilter !== 'All') && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setPriorityFilter('All');
                setDeptFilter('All');
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
          Showing <strong>{filteredPositions.length}</strong> of {positions.length} positions
        </div>
      </div>

      {/* 4. Positions Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPositions.map((pos) => (
          <div
            key={pos.id}
            className="flex flex-col justify-between p-5 rounded-2xl bg-white border border-[#E5EAF2] hover:border-blue-300 hover:shadow-card transition-all duration-200 relative group"
          >
            {/* Top Bar: Title & Openings Badge */}
            <div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#8292AD]">
                    {pos.department} • {pos.id}
                  </span>
                  <h3 className="text-base font-extrabold text-[#172033] group-hover:text-[#2563EB] transition-colors mt-0.5">
                    {pos.title}
                  </h3>
                </div>

                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-black bg-blue-50 text-[#1D4ED8] border border-blue-200">
                    <Users className="w-3 h-3 text-[#2563EB]" />
                    <span>{pos.openings} {pos.openings === 1 ? 'Opening' : 'Openings'}</span>
                  </span>
                </div>
              </div>

              {/* Priority & Tags */}
              <div className="flex items-center gap-2 mt-3 flex-wrap">
                {getPriorityBadge(pos.priority)}
                <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
                  {pos.experience}
                </span>
                <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                  {pos.location}
                </span>
              </div>

              {/* Description preview */}
              <p className="text-xs text-[#526484] mt-3 line-clamp-3 leading-relaxed">
                {pos.description}
              </p>

              {/* Key Skills Tags */}
              {pos.keySkills && pos.keySkills.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-slate-100">
                  {pos.keySkills.slice(0, 4).map((skill, i) => (
                    <span
                      key={i}
                      className="text-[10px] font-bold text-slate-600 bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-200"
                    >
                      {skill}
                    </span>
                  ))}
                  {pos.keySkills.length > 4 && (
                    <span className="text-[10px] font-bold text-slate-400 self-center">
                      +{pos.keySkills.length - 4} more
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Bottom Actions Bar */}
            <div className="mt-5 pt-3 border-t border-[#E5EAF2] flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setSelectedJd(pos)}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold text-[#172033] hover:text-[#2563EB] hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                  title="View full Job Description"
                >
                  <Eye className="w-3.5 h-3.5 text-[#8292AD]" />
                  <span>View JD</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleOpenEdit(pos)}
                  className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                  title="Edit position specifications"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => setPositionToDelete(pos)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                  title="Delete position"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Source Candidate Button */}
              <button
                type="button"
                onClick={() => onNavigateToSourcing?.(pos.title)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-teal-50 text-[#008080] border border-teal-200 hover:bg-[#008080] hover:text-white transition-all shadow-2xs cursor-pointer"
                title={`Source candidates for ${pos.title}`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Source Candidates</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredPositions.length === 0 && (
        <div className="p-12 text-center bg-white rounded-2xl border border-[#E5EAF2]">
          <Briefcase className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h4 className="text-sm font-bold text-[#172033]">No open positions match your filters</h4>
          <p className="text-xs text-[#8292AD] mt-1">Try resetting the filters or create a new job position.</p>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: CREATE / EDIT POSITION MODAL                                    */}
      {/* ========================================================================= */}
      {showCreateModal && (
        <Modal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title={editingPosition ? `Edit Job Position: ${editingPosition.title}` : 'Post New Job Position (JD)'}
          subtitle="Configure role requirements, department priority, and opening count"
          maxWidth="max-w-2xl"
        >
          <form onSubmit={handleSubmitPosition} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-[#172033] mb-1">
                  Job Title / Role * (e.g. SEO Manager, SEO Executive, SME, BDE, Web Design)
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Senior SEO Manager"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#172033] mb-1">Department *</label>
                <select
                  value={form.department}
                  onChange={(e) => setForm({ ...form, department: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:border-[#2563EB] cursor-pointer"
                >
                  <option value="Marketing">Marketing (SEO & Growth)</option>
                  <option value="Engineering">Engineering (Dev & SME)</option>
                  <option value="Web Design">Web Design (UI/UX)</option>
                  <option value="Sales">Sales & BD (BDE)</option>
                  <option value="Quality Assurance">Quality Assurance</option>
                  <option value="Operations">Operations</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#172033] mb-1">Number of Openings *</label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  required
                  value={form.openings}
                  onChange={(e) => setForm({ ...form, openings: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#172033] mb-1">Job Priority *</label>
                <select
                  value={form.priority}
                  onChange={(e) => setForm({ ...form, priority: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:border-[#2563EB] cursor-pointer font-bold"
                >
                  <option value="Priority 1 (Urgent)">Priority 1 (Urgent Fulfillment)</option>
                  <option value="Priority 2 (High)">Priority 2 (High Priority)</option>
                  <option value="Priority 3 (Normal)">Priority 3 (Normal Routine)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#172033] mb-1">Experience Required</label>
                <input
                  type="text"
                  placeholder="e.g. 3 - 5 Years"
                  value={form.experience}
                  onChange={(e) => setForm({ ...form, experience: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#172033] mb-1">Salary Range / Budget</label>
                <input
                  type="text"
                  placeholder="e.g. ₹6,00,000 - ₹9,50,000 / Yr"
                  value={form.salaryRange}
                  onChange={(e) => setForm({ ...form, salaryRange: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#172033] mb-1">Work Location</label>
                <input
                  type="text"
                  placeholder="e.g. Noida / Hybrid"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-[#172033] mb-1">Key Skills (Comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Technical SEO, Screaming Frog, Keyword Mapping, GA4"
                  value={form.keySkills}
                  onChange={(e) => setForm({ ...form, keySkills: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-[#172033] mb-1">Job Description (JD Specifications) *</label>
                <textarea
                  rows="4"
                  required
                  placeholder="Detailed role summary, team responsibilities, and qualifications..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:border-[#2563EB] leading-relaxed"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2.5 pt-3 border-t border-[#E5EAF2]">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-xs font-semibold rounded-xl border border-[#E5EAF2] text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white shadow-sm cursor-pointer"
              >
                {editingPosition ? 'Save Changes' : 'Publish Position'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: VIEW FULL JD MODAL                                              */}
      {/* ========================================================================= */}
      {selectedJd && (
        <Modal
          isOpen={!!selectedJd}
          onClose={() => setSelectedJd(null)}
          title={selectedJd.title}
          subtitle={`${selectedJd.department} • Job ID: ${selectedJd.id} • Posted ${selectedJd.postedDate}`}
          maxWidth="max-w-2xl"
        >
          <div className="space-y-4 text-xs">
            {/* Header info badge pill */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-2">
                {getPriorityBadge(selectedJd.priority)}
                <span className="font-bold text-slate-800 text-xs">
                  {selectedJd.openings} Openings
                </span>
              </div>
              <span className="text-[11px] font-semibold text-slate-600">
                {selectedJd.location} • {selectedJd.type}
              </span>
            </div>

            {/* Compensation & Experience */}
            <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-blue-50/50 border border-blue-100">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#8292AD] block">Budget / CTC Range</span>
                <span className="text-xs font-extrabold text-slate-900">{selectedJd.salaryRange}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-[#8292AD] block">Experience Needed</span>
                <span className="text-xs font-extrabold text-slate-900">{selectedJd.experience}</span>
              </div>
            </div>

            {/* Description */}
            <div>
              <h4 className="font-bold text-[#172033] text-xs uppercase tracking-wider mb-1.5">Overview</h4>
              <p className="text-xs text-[#526484] leading-relaxed bg-white p-3 rounded-xl border border-slate-200">
                {selectedJd.description}
              </p>
            </div>

            {/* Key Skills */}
            {selectedJd.keySkills && selectedJd.keySkills.length > 0 && (
              <div>
                <h4 className="font-bold text-[#172033] text-xs uppercase tracking-wider mb-1.5">Core Skills Required</h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedJd.keySkills.map((skill, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Responsibilities list if available */}
            {selectedJd.responsibilities && (
              <div>
                <h4 className="font-bold text-[#172033] text-xs uppercase tracking-wider mb-1.5">Key Responsibilities</h4>
                <ul className="list-disc pl-5 space-y-1 text-slate-700">
                  {selectedJd.responsibilities.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex items-center justify-between pt-3 border-t border-[#E5EAF2]">
              <button
                type="button"
                onClick={() => setSelectedJd(null)}
                className="px-4 py-2 text-xs font-semibold rounded-xl border border-[#E5EAF2] text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Close
              </button>

              <button
                type="button"
                onClick={() => {
                  const role = selectedJd.title;
                  setSelectedJd(null);
                  onNavigateToSourcing?.(role);
                }}
                className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold rounded-xl bg-[#008080] hover:bg-teal-700 text-white shadow-sm cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Source Candidates for this Role →</span>
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: DELETE POSITION CONFIRMATION                                    */}
      {/* ========================================================================= */}
      {positionToDelete && (
        <Modal
          isOpen={!!positionToDelete}
          onClose={() => setPositionToDelete(null)}
          title="Delete Position Opening"
          maxWidth="max-w-md"
        >
          <div className="space-y-4 text-xs">
            <p className="text-slate-600 leading-relaxed">
              Are you sure you want to close and remove <strong className="text-slate-900">{positionToDelete.title}</strong> ({positionToDelete.id})? Active candidates linked to this position will remain in the pipeline.
            </p>
            <div className="flex justify-end gap-2.5 pt-3 border-t border-[#E5EAF2]">
              <button
                type="button"
                onClick={() => setPositionToDelete(null)}
                className="px-4 py-2 text-xs font-semibold rounded-xl border border-[#E5EAF2] text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeletePosition}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-rose-600 hover:bg-rose-700 text-white cursor-pointer"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
