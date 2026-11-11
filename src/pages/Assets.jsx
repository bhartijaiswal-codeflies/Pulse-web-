import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Laptop,
  Ticket,
  Briefcase,
  Search,
  Download,
  Plus,
  Check,
  X,
  Eye,
  Trash2,
  Edit2,
  Monitor,
  Clock,
  Calendar,
  User,
  ChevronRight,
  ChevronDown,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ExternalLink,
  RotateCw,
} from 'lucide-react';
import { Modal } from '../components/common/Modal';
import { assetService } from '../services/assetService';
import { employeeService } from '../services/employeeService';
import { useToast } from '../context/NotificationContext';

export const Assets = () => {
  const { addToast } = useToast();
  const employees = employeeService.getEmployees();

  // Active top tab: 'dashboard' | 'assets' | 'tickets' | 'requests'
  const [activeTab, setActiveTab] = useState('assets');

  // Data states
  const [assets, setAssets] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [requests, setRequests] = useState([]);

  // Assets Directory filters
  const [assetSearch, setAssetSearch] = useState('');
  const [assetTypeFilter, setAssetTypeFilter] = useState('All');
  const [assetStatusFilter, setAssetStatusFilter] = useState('All');

  // Support Tickets filters
  const [ticketStatusFilter, setTicketStatusFilter] = useState('All');

  // Take-Home Requests filters
  const [requestStatusFilter, setRequestStatusFilter] = useState('All');

  // Modals
  const [showAddAssetModal, setShowAddAssetModal] = useState(false);
  const [editingAsset, setEditingAsset] = useState(null);
  const [deletingAsset, setDeletingAsset] = useState(null);

  const [showNewTicketModal, setShowNewTicketModal] = useState(false);
  const [viewingTicket, setViewingTicket] = useState(null);

  const [showNewRequestModal, setShowNewRequestModal] = useState(false);

  // Add / Edit Asset Form State
  const [assetForm, setAssetForm] = useState({
    name: '',
    details: '',
    type: 'Laptop',
    tag: '',
    assignedTo: 'Codeflies',
    status: 'Active',
    condition: 'Excellent',
    image: '',
    serial: '',
  });

  // New Ticket Form State
  const [ticketForm, setTicketForm] = useState({
    issue: '',
    assetId: '',
    submittedBy: 'Devendra kumar',
    priority: 'Normal',
    description: '',
  });

  // New Request Form State
  const [requestForm, setRequestForm] = useState({
    by: 'Chirag Verma',
    assetId: '',
    startDate: '2026-11-15',
    endDate: '2026-11-20',
    reason: 'Work From Home',
  });

  const loadData = () => {
    setAssets(assetService.getAssets());
    setTickets(assetService.getTickets());
    setRequests(assetService.getRequests());
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filtered Assets
  const filteredAssets = assets.filter((item) => {
    const q = assetSearch.toLowerCase();
    const matchesSearch =
      !q ||
      item.name?.toLowerCase().includes(q) ||
      item.code?.toLowerCase().includes(q) ||
      item.tag?.toLowerCase().includes(q) ||
      item.assignedTo?.toLowerCase().includes(q) ||
      item.type?.toLowerCase().includes(q);

    const matchesType = assetTypeFilter === 'All' || item.type === assetTypeFilter;
    const matchesStatus = assetStatusFilter === 'All' || item.status === assetStatusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  // Filtered Tickets
  const filteredTickets = tickets.filter((t) => {
    if (ticketStatusFilter === 'All') return true;
    return t.status.toLowerCase() === ticketStatusFilter.toLowerCase();
  });

  // Filtered Requests
  const filteredRequests = requests.filter((r) => {
    if (requestStatusFilter === 'All') return true;
    return r.status.toLowerCase() === requestStatusFilter.toLowerCase();
  });

  // --- ASSET ACTIONS ---
  const handleOpenAddAsset = () => {
    setAssetForm({
      name: '',
      details: '',
      type: 'Laptop',
      tag: `CF-MAC-${String(assets.length + 1).padStart(2, '0')}`,
      assignedTo: 'Codeflies',
      status: 'Active',
      condition: 'Brand New',
      image: '',
      serial: '',
    });
    setShowAddAssetModal(true);
  };

  const handleOpenEditAsset = (asset) => {
    setEditingAsset(asset);
    setAssetForm({
      name: asset.name,
      details: asset.details || asset.name,
      type: asset.type,
      tag: asset.tag,
      assignedTo: asset.assignedTo,
      status: asset.status,
      condition: asset.condition || 'Good',
      image: asset.image || '',
      serial: asset.serial || '',
    });
  };

  const handleSaveAsset = (e) => {
    e.preventDefault();
    if (!assetForm.name.trim()) {
      addToast({ title: 'Name Required', message: 'Please enter an asset name/model.', type: 'warning' });
      return;
    }

    if (editingAsset) {
      assetService.updateAsset(editingAsset.id, assetForm);
      addToast({
        title: 'Asset Updated',
        message: `${assetForm.name} (${assetForm.tag}) has been updated.`,
        type: 'success',
      });
      setEditingAsset(null);
    } else {
      assetService.addAsset(assetForm);
      addToast({
        title: 'Asset Registered',
        message: `${assetForm.name} added to inventory successfully.`,
        type: 'success',
      });
      setShowAddAssetModal(false);
    }
    loadData();
  };

  const handleDeleteAssetConfirm = () => {
    if (!deletingAsset) return;
    assetService.deleteAsset(deletingAsset.id);
    addToast({
      title: 'Asset Removed',
      message: `${deletingAsset.name} was removed from the directory.`,
      type: 'info',
    });
    setDeletingAsset(null);
    loadData();
  };

  const handleExportAssets = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['Code,Name,Type,Tag,Assigned To,Status,Serial,Condition']
        .concat(
          filteredAssets.map(
            (a) =>
              `"${a.code}","${a.name}","${a.type}","${a.tag}","${a.assignedTo}","${a.status}","${a.serial}","${a.condition}"`
          )
        )
        .join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `codeflies_assets_directory_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast({
      title: 'Assets Exported',
      message: `Downloaded CSV with ${filteredAssets.length} asset records.`,
      type: 'success',
    });
  };

  // --- TICKET ACTIONS ---
  const handleSaveTicket = (e) => {
    e.preventDefault();
    if (!ticketForm.issue.trim()) {
      addToast({ title: 'Issue Required', message: 'Please enter issue title.', type: 'warning' });
      return;
    }

    const linkedAsset = assets.find((a) => a.id === ticketForm.assetId) || assets[0];

    assetService.addTicket({
      ...ticketForm,
      assetId: linkedAsset.id,
      assetCode: linkedAsset.code,
      assetName: linkedAsset.name,
      assetTag: linkedAsset.tag,
      assetType: linkedAsset.type,
      submittedByAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    });

    addToast({
      title: 'Ticket Submitted',
      message: `Support ticket created for ${linkedAsset.name}.`,
      type: 'success',
    });

    setShowNewTicketModal(false);
    loadData();
  };

  const handleUpdateTicketStatus = (ticketId, newStatus) => {
    assetService.updateTicketStatus(ticketId, newStatus);
    addToast({
      title: 'Status Updated',
      message: `Ticket status set to "${newStatus}".`,
      type: 'info',
    });
    if (viewingTicket && viewingTicket.id === ticketId) {
      setViewingTicket((prev) => ({ ...prev, status: newStatus }));
    }
    loadData();
  };

  // --- TAKE-HOME REQUEST ACTIONS ---
  const handleSaveRequest = (e) => {
    e.preventDefault();
    const linkedAsset = assets.find((a) => a.id === requestForm.assetId) || assets[0];

    assetService.addRequest({
      by: requestForm.by,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      assetCode: linkedAsset.code,
      assetName: linkedAsset.name,
      assetTag: linkedAsset.tag,
      assetType: linkedAsset.type,
      duration: `${requestForm.startDate.replace(/-/g, '/')} -> ${requestForm.endDate.replace(/-/g, '/')}`,
      startDate: requestForm.startDate,
      endDate: requestForm.endDate,
      reason: requestForm.reason,
      status: 'Pending',
    });

    addToast({
      title: 'Request Created',
      message: `Take-home request for ${linkedAsset.name} submitted.`,
      type: 'success',
    });

    setShowNewRequestModal(false);
    loadData();
  };

  const handleApproveRequest = (req) => {
    assetService.updateRequestStatus(req.id, 'Approved');
    addToast({
      title: 'Request Approved ✓',
      message: `${req.by}'s take-home request for ${req.assetName} approved.`,
      type: 'success',
    });
    loadData();
  };

  const handleRejectRequest = (req) => {
    assetService.updateRequestStatus(req.id, 'Rejected');
    addToast({
      title: 'Request Rejected',
      message: `Take-home request for ${req.assetName} marked as rejected.`,
      type: 'info',
    });
    loadData();
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'assets', label: 'Assets', icon: Laptop, badge: assets.length },
    { id: 'tickets', label: 'Tickets', icon: Ticket, badge: tickets.filter((t) => t.status === 'Open').length },
    { id: 'requests', label: 'Take-Home Requests', icon: Briefcase, badge: requests.filter((r) => r.status === 'Pending').length },
  ];

  return (
    <div className="space-y-5 animate-fade-in pb-12 w-full">
      {/* Top Assets Sub-Navigation Bar matching Screenshot */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3.5 pb-3 border-b border-[#E5EAF2]">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-lg text-[#172033] tracking-tight">Assets</span>
            <span className="text-[10px] font-bold text-[#8292AD] uppercase tracking-wider">By Codeflies</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-[#2563EB] border border-blue-200">
              V1.13.0
            </span>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1.5 ml-1 sm:ml-3 overflow-x-auto no-scrollbar">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-[#2563EB] text-white shadow-xs'
                      : 'text-[#64748B] hover:text-[#172033] hover:bg-slate-100 border border-transparent hover:border-[#E5EAF2]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                  {tab.badge !== undefined && tab.badge > 0 && (
                    <span
                      className={`text-[9.5px] px-1.5 py-0.2 rounded-full font-black ${
                        isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Admin Profile Snippet */}
        <div className="flex items-center gap-2.5 flex-shrink-0 self-end md:self-auto">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-[#172033]">Priyanka Rai</p>
            <p className="text-[10px] text-[#8292AD] font-medium">Admin</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs ring-2 ring-blue-300 shadow-2xs">
            P
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: DASHBOARD (OVERVIEW)                                              */}
      {/* ========================================================================= */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-[#172033] tracking-tight">Overview</h2>
          </div>

          {/* 3 Top KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {/* Card 1: Total Assets */}
            <div
              onClick={() => setActiveTab('assets')}
              className="bg-white border border-[#E5EAF2] rounded-2xl p-5 shadow-card hover:shadow-subtle transition-all cursor-pointer group flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#2563EB] flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform shadow-2xs">
                <Monitor className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#8292AD]">Total Assets</p>
                <p className="text-3xl font-black text-[#172033] tracking-tight mt-0.5">234</p>
              </div>
            </div>

            {/* Card 2: Total Open Tickets */}
            <div
              onClick={() => setActiveTab('tickets')}
              className="bg-white border border-[#E5EAF2] rounded-2xl p-5 shadow-card hover:shadow-subtle transition-all cursor-pointer group flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform shadow-2xs">
                <Ticket className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#8292AD]">Total Open Tickets</p>
                <p className="text-3xl font-black text-[#172033] tracking-tight mt-0.5">17</p>
              </div>
            </div>

            {/* Card 3: Pending Requests */}
            <div
              onClick={() => setActiveTab('requests')}
              className="bg-white border border-[#E5EAF2] rounded-2xl p-5 shadow-card hover:shadow-subtle transition-all cursor-pointer group flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform shadow-2xs">
                <Briefcase className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#8292AD]">Pending Requests</p>
                <p className="text-3xl font-black text-[#172033] tracking-tight mt-0.5">11</p>
              </div>
            </div>
          </div>

          {/* 2-Column Side-by-Side: Recent Tickets & Pending Take-Home Requests */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            {/* Recent Tickets */}
            <div className="bg-white border border-[#E5EAF2] rounded-2xl p-5 shadow-card space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#E5EAF2]">
                <h3 className="font-bold text-[#172033] text-sm">Recent Tickets</h3>
                <button
                  type="button"
                  onClick={() => setActiveTab('tickets')}
                  className="text-xs font-bold text-[#2563EB] hover:underline cursor-pointer flex items-center gap-0.5"
                >
                  <span>View All Tickets</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="divide-y divide-[#F1F5F9] -my-1">
                {tickets.slice(0, 5).map((t) => (
                  <div
                    key={t.id}
                    onClick={() => setViewingTicket(t)}
                    className="py-3 flex items-start justify-between gap-3 group cursor-pointer hover:bg-slate-50/60 px-2 rounded-xl transition-colors"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-[#2563EB] group-hover:underline truncate">
                        {t.ticketNo}: {t.issue}
                      </p>
                      <p className="text-[11px] text-[#8292AD] mt-0.5 truncate">
                        {t.assetCode} - {t.assetName} • Tag: {t.assetTag} &bull; {t.assetType}
                      </p>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${
                        t.status === 'Resolved'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {t.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pending Take-Home Requests */}
            <div className="bg-white border border-[#E5EAF2] rounded-2xl p-5 shadow-card space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#E5EAF2]">
                <h3 className="font-bold text-[#172033] text-sm">Pending Take-Home Requests</h3>
                <button
                  type="button"
                  onClick={() => setActiveTab('requests')}
                  className="text-xs font-bold text-[#2563EB] hover:underline cursor-pointer flex items-center gap-0.5"
                >
                  <span>View All Requests</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="divide-y divide-[#F1F5F9] -my-1">
                {requests
                  .filter((r) => r.status === 'Pending')
                  .slice(0, 5)
                  .map((r) => (
                    <div
                      key={r.id}
                      className="py-3 flex items-start justify-between gap-3 hover:bg-slate-50/60 px-2 rounded-xl transition-colors"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-[#2563EB]">{r.requestNo}</p>
                        <p className="text-[11px] text-[#8292AD] mt-0.5 truncate">
                          {r.assetCode} - {r.assetName} • Tag: {r.assetTag} &bull; {r.assetType}
                        </p>
                        <p className="text-[10px] text-slate-500 font-medium mt-0.5">By: {r.by}</p>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                          Pending
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleApproveRequest(r)}
                            className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                            title="Approve Request"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRejectRequest(r)}
                            className="w-6 h-6 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                            title="Reject Request"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: ASSETS (ASSETS DIRECTORY)                                         */}
      {/* ========================================================================= */}
      {activeTab === 'assets' && (
        <div className="space-y-4">
          {/* Header & Filter Controls Bar matching Screenshot 1 */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            <h2 className="text-xl font-extrabold text-[#172033] tracking-tight">Assets Directory</h2>

            <div className="flex flex-wrap items-center gap-2.5">
              {/* Search Assets Input */}
              <div className="relative min-w-[200px] flex-1 sm:flex-initial">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search assets..."
                  value={assetSearch}
                  onChange={(e) => setAssetSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-[#E5EAF2] bg-white text-[#172033] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
                />
              </div>

              {/* All Types Dropdown */}
              <select
                value={assetTypeFilter}
                onChange={(e) => setAssetTypeFilter(e.target.value)}
                className="px-3 py-1.5 text-xs rounded-xl border border-[#E5EAF2] bg-white text-[#172033] font-semibold focus:outline-none focus:border-[#2563EB] cursor-pointer"
              >
                <option value="All">All Types</option>
                <option value="Laptop">Laptop</option>
                <option value="Charger">Charger</option>
                <option value="Cable">Cable</option>
                <option value="Mouse">Mouse</option>
                <option value="Monitors">Monitors</option>
                <option value="Mobile Devices">Mobile Devices</option>
              </select>

              {/* All Statuses Dropdown */}
              <select
                value={assetStatusFilter}
                onChange={(e) => setAssetStatusFilter(e.target.value)}
                className="px-3 py-1.5 text-xs rounded-xl border border-[#E5EAF2] bg-white text-[#172033] font-semibold focus:outline-none focus:border-[#2563EB] cursor-pointer"
              >
                <option value="All">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Available">Available</option>
              </select>

              {/* Export Button */}
              <button
                type="button"
                onClick={handleExportAssets}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl border border-[#E5EAF2] bg-white text-[#64748B] hover:text-[#172033] hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export</span>
              </button>

              {/* + Add Asset Button */}
              <button
                type="button"
                onClick={handleOpenAddAsset}
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white shadow-sm transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Asset</span>
              </button>
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-white border border-[#E5EAF2] rounded-2xl shadow-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#E5EAF2] bg-[#F8FAFC] text-[11px] font-bold text-[#8292AD] uppercase tracking-wider">
                    <th className="py-3 px-4 w-16">Image</th>
                    <th className="py-3 px-4 w-28">Type</th>
                    <th className="py-3 px-4">Asset Details</th>
                    <th className="py-3 px-4">Assigned To</th>
                    <th className="py-3 px-4 w-28">Status</th>
                    <th className="py-3 px-4 w-28 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F5F9]">
                  {filteredAssets.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-400">
                        No assets found matching filters.
                      </td>
                    </tr>
                  ) : (
                    filteredAssets.map((asset) => (
                      <tr key={asset.id} className="hover:bg-[#FBFDFE] transition-colors">
                        {/* Image */}
                        <td className="py-3 px-4">
                          {asset.image ? (
                            <img
                              src={asset.image}
                              alt={asset.name}
                              className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-200"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 text-slate-400 flex items-center justify-center">
                              <ImageIcon className="w-4 h-4" />
                            </div>
                          )}
                        </td>

                        {/* Type */}
                        <td className="py-3 px-4 font-semibold text-[#172033]">{asset.type}</td>

                        {/* Asset Details */}
                        <td className="py-3 px-4">
                          <p
                            onClick={() => handleOpenEditAsset(asset)}
                            className="font-bold text-[#2563EB] hover:underline cursor-pointer"
                          >
                            {asset.code} - {asset.name}
                          </p>
                          <p className="text-[11px] text-[#8292AD] mt-0.5">
                            {asset.details} • Tag: {asset.tag}
                          </p>
                        </td>

                        {/* Assigned To */}
                        <td className="py-3 px-4 font-semibold text-[#172033]">{asset.assignedTo}</td>

                        {/* Status */}
                        <td className="py-3 px-4">
                          <span
                            className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full inline-block ${
                              asset.status === 'Active'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : asset.status === 'Maintenance'
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : 'bg-blue-50 text-blue-700 border border-blue-200'
                            }`}
                          >
                            {asset.status}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-3 font-semibold text-xs">
                            <button
                              type="button"
                              onClick={() => handleOpenEditAsset(asset)}
                              className="text-[#2563EB] hover:underline cursor-pointer"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeletingAsset(asset)}
                              className="text-rose-600 hover:underline cursor-pointer"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: TICKETS (SUPPORT TICKETS)                                         */}
      {/* ========================================================================= */}
      {activeTab === 'tickets' && (
        <div className="space-y-4">
          {/* Header & Filter Controls Bar matching Screenshot 2 */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 className="text-xl font-extrabold text-[#172033] tracking-tight">Support Tickets</h2>

            <div className="flex items-center gap-2.5">
              {/* Filter: All Tickets */}
              <select
                value={ticketStatusFilter}
                onChange={(e) => setTicketStatusFilter(e.target.value)}
                className="px-3 py-1.5 text-xs rounded-xl border border-[#E5EAF2] bg-white text-[#172033] font-semibold focus:outline-none focus:border-[#2563EB] cursor-pointer"
              >
                <option value="All">All Tickets</option>
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>

              {/* + New Ticket Button */}
              <button
                type="button"
                onClick={() => setShowNewTicketModal(true)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white shadow-sm transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Ticket</span>
              </button>
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-white border border-[#E5EAF2] rounded-2xl shadow-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#E5EAF2] bg-[#F8FAFC] text-[11px] font-bold text-[#8292AD] uppercase tracking-wider">
                    <th className="py-3 px-4">Issue</th>
                    <th className="py-3 px-4">Asset</th>
                    <th className="py-3 px-4">Submitted By</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4 w-28">Status</th>
                    <th className="py-3 px-4 w-24 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F5F9]">
                  {filteredTickets.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-400">
                        No support tickets found.
                      </td>
                    </tr>
                  ) : (
                    filteredTickets.map((ticket) => (
                      <tr key={ticket.id} className="hover:bg-[#FBFDFE] transition-colors">
                        {/* Issue */}
                        <td className="py-3 px-4">
                          <p
                            onClick={() => setViewingTicket(ticket)}
                            className="font-bold text-[#2563EB] hover:underline cursor-pointer"
                          >
                            {ticket.ticketNo}
                          </p>
                          <p className="text-[11px] text-[#172033] mt-0.5 max-w-[280px] truncate">{ticket.issue}</p>
                        </td>

                        {/* Asset */}
                        <td className="py-3 px-4">
                          <p className="font-bold text-[#172033]">
                            {ticket.assetCode} - {ticket.assetName}
                          </p>
                          <p className="text-[11px] text-[#8292AD] mt-0.5">
                            Tag: {ticket.assetTag} • {ticket.assetType}
                          </p>
                        </td>

                        {/* Submitted By */}
                        <td className="py-3 px-4 font-semibold text-[#172033]">{ticket.submittedBy}</td>

                        {/* Date */}
                        <td className="py-3 px-4 font-medium text-slate-500">{ticket.date}</td>

                        {/* Status */}
                        <td className="py-3 px-4">
                          <span
                            className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full inline-block ${
                              ticket.status === 'Resolved'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : ticket.status === 'In Progress'
                                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}
                          >
                            {ticket.status}
                          </span>
                        </td>

                        {/* Action */}
                        <td className="py-3 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => setViewingTicket(ticket)}
                            className="text-[#2563EB] hover:underline font-bold text-xs inline-flex items-center gap-0.5 cursor-pointer"
                          >
                            <span>View</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: TAKE-HOME REQUESTS                                                */}
      {/* ========================================================================= */}
      {activeTab === 'requests' && (
        <div className="space-y-4">
          {/* Header & Filter Controls Bar matching Screenshot 3 */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 className="text-xl font-extrabold text-[#172033] tracking-tight">Take-Home Requests</h2>

            <div className="flex items-center gap-2.5">
              {/* Filter: All Requests */}
              <select
                value={requestStatusFilter}
                onChange={(e) => setRequestStatusFilter(e.target.value)}
                className="px-3 py-1.5 text-xs rounded-xl border border-[#E5EAF2] bg-white text-[#172033] font-semibold focus:outline-none focus:border-[#2563EB] cursor-pointer"
              >
                <option value="All">All Requests</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>

              {/* + New Request Button */}
              <button
                type="button"
                onClick={() => setShowNewRequestModal(true)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white shadow-sm transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Request</span>
              </button>
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-white border border-[#E5EAF2] rounded-2xl shadow-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#E5EAF2] bg-[#F8FAFC] text-[11px] font-bold text-[#8292AD] uppercase tracking-wider">
                    <th className="py-3 px-4">Request Info</th>
                    <th className="py-3 px-4">Asset Details</th>
                    <th className="py-3 px-4">Duration</th>
                    <th className="py-3 px-4">Reason</th>
                    <th className="py-3 px-4 w-24">Status</th>
                    <th className="py-3 px-4 w-24 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F5F9]">
                  {filteredRequests.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-400">
                        No take-home requests found.
                      </td>
                    </tr>
                  ) : (
                    filteredRequests.map((req) => (
                      <tr key={req.id} className="hover:bg-[#FBFDFE] transition-colors">
                        {/* Request Info */}
                        <td className="py-3 px-4">
                          <p className="font-bold text-[#172033]">{req.requestNo}</p>
                          <p className="text-[11px] text-[#8292AD] mt-0.5">By: {req.by}</p>
                        </td>

                        {/* Asset Details */}
                        <td className="py-3 px-4">
                          <p className="font-bold text-[#2563EB]">
                            {req.assetCode} - {req.assetName}
                          </p>
                          <p className="text-[11px] text-[#8292AD] mt-0.5">
                            Tag: {req.assetTag} • {req.assetType}
                          </p>
                        </td>

                        {/* Duration */}
                        <td className="py-3 px-4 font-semibold text-slate-600 whitespace-nowrap">
                          {req.duration}
                        </td>

                        {/* Reason */}
                        <td className="py-3 px-4 text-slate-700 font-medium max-w-[200px] truncate">
                          {req.reason}
                        </td>

                        {/* Status */}
                        <td className="py-3 px-4">
                          <span
                            className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full inline-block ${
                              req.status === 'Approved'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : req.status === 'Rejected'
                                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}
                          >
                            {req.status}
                          </span>
                        </td>

                        {/* Actions: Green Check and Red Cross */}
                        <td className="py-3 px-4 text-center">
                          {req.status === 'Pending' ? (
                            <div className="flex items-center justify-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleApproveRequest(req)}
                                className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
                                title="Approve Request"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRejectRequest(req)}
                                className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
                                title="Reject Request"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <span className="text-slate-400 text-xs font-semibold">Done</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODALS SECTION                                                           */}
      {/* ========================================================================= */}

      {/* Modal 1: Add / Edit Asset Modal */}
      {(showAddAssetModal || editingAsset) && (
        <Modal
          isOpen={showAddAssetModal || !!editingAsset}
          onClose={() => {
            setShowAddAssetModal(false);
            setEditingAsset(null);
          }}
          title={editingAsset ? `Edit Asset: ${editingAsset.code}` : 'Register New Asset'}
          subtitle="Configure hardware specifications, tag ID and employee assignment"
          maxWidth="max-w-xl"
        >
          <form onSubmit={handleSaveAsset} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-[#172033] mb-1">
                  Asset Model / Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Macbook Pro Touch Bar 13.3&quot;"
                  value={assetForm.name}
                  onChange={(e) => setAssetForm({ ...assetForm, name: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#E5EAF2] text-[#172033] focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#172033] mb-1">Asset Type</label>
                <select
                  value={assetForm.type}
                  onChange={(e) => setAssetForm({ ...assetForm, type: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#E5EAF2] text-[#172033] focus:outline-none focus:border-[#2563EB] cursor-pointer"
                >
                  <option value="Laptop">Laptop</option>
                  <option value="Charger">Charger</option>
                  <option value="Cable">Cable</option>
                  <option value="Mouse">Mouse</option>
                  <option value="Monitors">Monitors</option>
                  <option value="Mobile Devices">Mobile Devices</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#172033] mb-1">Tag Code</label>
                <input
                  type="text"
                  value={assetForm.tag}
                  onChange={(e) => setAssetForm({ ...assetForm, tag: e.target.value })}
                  placeholder="e.g. CF-MAC-01"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#E5EAF2] text-[#172033] focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#172033] mb-1">Assigned To</label>
                <select
                  value={assetForm.assignedTo}
                  onChange={(e) => setAssetForm({ ...assetForm, assignedTo: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#E5EAF2] text-[#172033] focus:outline-none focus:border-[#2563EB] cursor-pointer"
                >
                  <option value="Codeflies">Codeflies (Inventory)</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.name}>
                      {emp.name} ({emp.id})
                    </option>
                  ))}
                  <option value="Neeraj Kumar">Neeraj Kumar</option>
                  <option value="Harsh Bhardwaj">Harsh Bhardwaj</option>
                  <option value="Akshat Verma">Akshat Verma</option>
                  <option value="Manjeet Singh">Manjeet Singh</option>
                  <option value="Anmol Gupta">Anmol Gupta</option>
                  <option value="Varun Sarpal">Varun Sarpal</option>
                  <option value="Chirag Verma">Chirag Verma</option>
                  <option value="saurabh pal">saurabh pal</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#172033] mb-1">Status</label>
                <select
                  value={assetForm.status}
                  onChange={(e) => setAssetForm({ ...assetForm, status: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#E5EAF2] text-[#172033] focus:outline-none focus:border-[#2563EB] cursor-pointer"
                >
                  <option value="Active">Active</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Available">Available</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#172033] mb-1">Serial Number</label>
                <input
                  type="text"
                  placeholder="e.g. C02FX409MD6T"
                  value={assetForm.serial}
                  onChange={(e) => setAssetForm({ ...assetForm, serial: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#E5EAF2] text-[#172033] focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#172033] mb-1">Image URL (Optional)</label>
                <input
                  type="text"
                  placeholder="https://images.unsplash..."
                  value={assetForm.image || ''}
                  onChange={(e) => setAssetForm({ ...assetForm, image: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#E5EAF2] text-[#172033] focus:outline-none focus:border-[#2563EB]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2.5 pt-3 border-t border-[#E5EAF2]">
              <button
                type="button"
                onClick={() => {
                  setShowAddAssetModal(false);
                  setEditingAsset(null);
                }}
                className="px-4 py-2 text-xs font-semibold rounded-xl border border-[#E5EAF2] text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-bold rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white shadow-sm cursor-pointer"
              >
                {editingAsset ? 'Save Changes' : 'Register Asset'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Modal 2: Delete Asset Confirmation */}
      {deletingAsset && (
        <Modal
          isOpen={!!deletingAsset}
          onClose={() => setDeletingAsset(null)}
          title="Delete Asset Record"
          subtitle="Are you sure you want to delete this hardware from inventory?"
          maxWidth="max-w-md"
        >
          <div className="space-y-4">
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-rose-800">
                <p className="font-bold">Permanent Deletion</p>
                <p className="mt-0.5">
                  Deleting <span className="font-bold">{deletingAsset.code} - {deletingAsset.name}</span> (Tag: {deletingAsset.tag}) will remove all historical assignments and logs.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2.5 pt-2 border-t border-[#E5EAF2]">
              <button
                type="button"
                onClick={() => setDeletingAsset(null)}
                className="px-4 py-2 text-xs font-semibold rounded-xl border border-[#E5EAF2] text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteAssetConfirm}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-rose-600 hover:bg-rose-700 text-white shadow-sm cursor-pointer"
              >
                Delete Record
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal 3: View Support Ticket Modal */}
      {viewingTicket && (
        <Modal
          isOpen={!!viewingTicket}
          onClose={() => setViewingTicket(null)}
          title={`${viewingTicket.ticketNo}: ${viewingTicket.issue}`}
          subtitle={`Hardware Support Ticket • Submitted by ${viewingTicket.submittedBy} on ${viewingTicket.date}`}
          maxWidth="max-w-lg"
        >
          <div className="space-y-4 text-xs">
            {/* Asset Info Card */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-[#E5EAF2] flex items-center justify-between">
              <div>
                <p className="text-[11px] text-[#8292AD] font-semibold uppercase">Affected Asset</p>
                <p className="font-extrabold text-sm text-[#172033] mt-0.5">
                  {viewingTicket.assetCode} - {viewingTicket.assetName}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Tag: <strong className="text-slate-800">{viewingTicket.assetTag}</strong> • Category: {viewingTicket.assetType}
                </p>
              </div>

              <span
                className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                  viewingTicket.status === 'Resolved'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : viewingTicket.status === 'In Progress'
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}
              >
                {viewingTicket.status}
              </span>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="font-bold text-[#172033]">Problem Description</label>
              <div className="p-3 rounded-xl border border-[#E5EAF2] bg-white text-slate-700 leading-relaxed">
                {viewingTicket.description || 'No additional technical notes provided.'}
              </div>
            </div>

            {/* Status Switcher Actions */}
            <div className="space-y-1.5 pt-2 border-t border-[#E5EAF2]">
              <label className="font-bold text-[#172033]">Update Ticket Status</label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleUpdateTicketStatus(viewingTicket.id, 'Open')}
                  className={`px-3 py-1.5 rounded-xl font-bold cursor-pointer transition-colors ${
                    viewingTicket.status === 'Open'
                      ? 'bg-amber-500 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Open
                </button>
                <button
                  type="button"
                  onClick={() => handleUpdateTicketStatus(viewingTicket.id, 'In Progress')}
                  className={`px-3 py-1.5 rounded-xl font-bold cursor-pointer transition-colors ${
                    viewingTicket.status === 'In Progress'
                      ? 'bg-[#2563EB] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  In Progress
                </button>
                <button
                  type="button"
                  onClick={() => handleUpdateTicketStatus(viewingTicket.id, 'Resolved')}
                  className={`px-3 py-1.5 rounded-xl font-bold cursor-pointer transition-colors ${
                    viewingTicket.status === 'Resolved'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Resolved
                </button>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-[#E5EAF2]">
              <button
                type="button"
                onClick={() => setViewingTicket(null)}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 cursor-pointer"
              >
                Close View
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal 4: New Support Ticket Modal */}
      {showNewTicketModal && (
        <Modal
          isOpen={showNewTicketModal}
          onClose={() => setShowNewTicketModal(false)}
          title="Create Support Ticket"
          subtitle="Report hardware damage, software malfunction, or missing accessories"
          maxWidth="max-w-lg"
        >
          <form onSubmit={handleSaveTicket} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#172033] mb-1">Issue Headline *</label>
              <input
                type="text"
                required
                placeholder="e.g. Battery draining quickly / Screen flickering"
                value={ticketForm.issue}
                onChange={(e) => setTicketForm({ ...ticketForm, issue: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#E5EAF2] text-[#172033] focus:outline-none focus:border-[#2563EB]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-[#172033] mb-1">Associated Asset</label>
                <select
                  value={ticketForm.assetId}
                  onChange={(e) => setTicketForm({ ...ticketForm, assetId: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#E5EAF2] text-[#172033] focus:outline-none focus:border-[#2563EB] cursor-pointer"
                >
                  {assets.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.code} - {a.name} ({a.tag})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#172033] mb-1">Submitted By</label>
                <select
                  value={ticketForm.submittedBy}
                  onChange={(e) => setTicketForm({ ...ticketForm, submittedBy: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#E5EAF2] text-[#172033] focus:outline-none focus:border-[#2563EB] cursor-pointer"
                >
                  <option value="Devendra kumar">Devendra kumar</option>
                  <option value="Manjeet Singh">Manjeet Singh</option>
                  <option value="Deepak Kumar">Deepak Kumar</option>
                  <option value="Ajay Gond">Ajay Gond</option>
                  <option value="Pankaj Singh">Pankaj Singh</option>
                  <option value="Kavyansh Shukla">Kavyansh Shukla</option>
                  {employees.map((e) => (
                    <option key={e.id} value={e.name}>
                      {e.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#172033] mb-1">Detailed Technical Description</label>
              <textarea
                rows={3}
                placeholder="Describe what steps reproduce the issue..."
                value={ticketForm.description}
                onChange={(e) => setTicketForm({ ...ticketForm, description: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#E5EAF2] text-[#172033] focus:outline-none focus:border-[#2563EB]"
              />
            </div>

            <div className="flex justify-end gap-2.5 pt-3 border-t border-[#E5EAF2]">
              <button
                type="button"
                onClick={() => setShowNewTicketModal(false)}
                className="px-4 py-2 text-xs font-semibold rounded-xl border border-[#E5EAF2] text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-bold rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white shadow-sm cursor-pointer"
              >
                Submit Ticket
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Modal 5: New Take-Home Request Modal */}
      {showNewRequestModal && (
        <Modal
          isOpen={showNewRequestModal}
          onClose={() => setShowNewRequestModal(false)}
          title="New Take-Home Request"
          subtitle="Request authorization to take company hardware off-premises"
          maxWidth="max-w-lg"
        >
          <form onSubmit={handleSaveRequest} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-[#172033] mb-1">Requested By</label>
                <select
                  value={requestForm.by}
                  onChange={(e) => setRequestForm({ ...requestForm, by: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#E5EAF2] text-[#172033] focus:outline-none focus:border-[#2563EB] cursor-pointer"
                >
                  <option value="Chirag Verma">Chirag Verma</option>
                  <option value="Kartikey Tripathi">Kartikey Tripathi</option>
                  <option value="simran kaur">simran kaur</option>
                  <option value="Neeraj Kumar">Neeraj Kumar</option>
                  <option value="saurabh pal">saurabh pal</option>
                  {employees.map((e) => (
                    <option key={e.id} value={e.name}>
                      {e.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#172033] mb-1">Select Hardware Asset</label>
                <select
                  value={requestForm.assetId}
                  onChange={(e) => setRequestForm({ ...requestForm, assetId: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#E5EAF2] text-[#172033] focus:outline-none focus:border-[#2563EB] cursor-pointer"
                >
                  {assets.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.code} - {a.name} ({a.tag})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#172033] mb-1">Start Date</label>
                <input
                  type="date"
                  required
                  value={requestForm.startDate}
                  onChange={(e) => setRequestForm({ ...requestForm, startDate: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#E5EAF2] text-[#172033] focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#172033] mb-1">End Date</label>
                <input
                  type="date"
                  required
                  value={requestForm.endDate}
                  onChange={(e) => setRequestForm({ ...requestForm, endDate: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#E5EAF2] text-[#172033] focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-[#172033] mb-1">Business Reason</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Work From Home / Client Visit / Traveling"
                  value={requestForm.reason}
                  onChange={(e) => setRequestForm({ ...requestForm, reason: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#E5EAF2] text-[#172033] focus:outline-none focus:border-[#2563EB]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2.5 pt-3 border-t border-[#E5EAF2]">
              <button
                type="button"
                onClick={() => setShowNewRequestModal(false)}
                className="px-4 py-2 text-xs font-semibold rounded-xl border border-[#E5EAF2] text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-bold rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white shadow-sm cursor-pointer"
              >
                Create Request
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
