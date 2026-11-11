import React, { useState, useEffect } from 'react';
import {
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
  Calendar,
  User,
  Star,
  MapPin,
  RotateCw,
  AlertCircle,
  CheckCircle2,
  Phone,
  UserCheck,
  ShieldCheck,
  CheckCircle,
  XCircle,
  FileText,
  Tag,
  Clock,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { StatsCard } from '../components/dashboard/StatsCard';
import { DataTable } from '../components/common/DataTable';
import { StatusBadge } from '../components/common/StatusBadge';
import { Modal } from '../components/common/Modal';
import { assetService } from '../services/assetService';
import { employeeService } from '../services/employeeService';
import { useToast } from '../context/NotificationContext';

export const Assets = () => {
  const { addToast } = useToast();
  const employees = employeeService.getEmployees();

  // Active view: 'assets' | 'tickets' | 'requests'
  const [activeView, setActiveView] = useState('assets');

  // Data states
  const [assets, setAssets] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [requests, setRequests] = useState([]);
  const [starredItems, setStarredItems] = useState(['AST-1', 'AST-3', 'TCK-22', 'REQ-86']);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Modals
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingAsset, setEditingAsset] = useState(null);
  const [deletingAsset, setDeletingAsset] = useState(null);

  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showNewTicketModal, setShowNewTicketModal] = useState(false);

  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showNewRequestModal, setShowNewRequestModal] = useState(false);

  // Forms
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
    purchaseDate: '12 Jan, 2024',
  });

  const [ticketForm, setTicketForm] = useState({
    issue: '',
    assetId: '',
    submittedBy: 'Devendra kumar',
    priority: 'Normal',
    description: '',
  });

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

  const toggleStar = (id) => {
    setStarredItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // --- FILTERING LOGIC ---
  const filteredAssets = assets.filter((item) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      item.name?.toLowerCase().includes(q) ||
      item.code?.toLowerCase().includes(q) ||
      item.tag?.toLowerCase().includes(q) ||
      item.assignedTo?.toLowerCase().includes(q) ||
      item.type?.toLowerCase().includes(q) ||
      item.serial?.toLowerCase().includes(q);

    const matchesType = typeFilter === 'All' || item.type === typeFilter;
    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  const filteredTickets = tickets.filter((item) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      item.ticketNo?.toLowerCase().includes(q) ||
      item.issue?.toLowerCase().includes(q) ||
      item.assetName?.toLowerCase().includes(q) ||
      item.assetTag?.toLowerCase().includes(q) ||
      item.submittedBy?.toLowerCase().includes(q);

    const matchesStatus = statusFilter === 'All' || item.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const filteredRequests = requests.filter((item) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      item.requestNo?.toLowerCase().includes(q) ||
      item.by?.toLowerCase().includes(q) ||
      item.assetName?.toLowerCase().includes(q) ||
      item.assetTag?.toLowerCase().includes(q) ||
      item.reason?.toLowerCase().includes(q);

    const matchesStatus = statusFilter === 'All' || item.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
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
      purchaseDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    });
    setShowAddModal(true);
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
      purchaseDate: asset.purchaseDate || '12 Jan, 2024',
    });
  };

  const handleSaveAsset = (e) => {
    e.preventDefault();
    if (!assetForm.name.trim()) {
      addToast({ title: 'Name Required', message: 'Please enter asset model name.', type: 'warning' });
      return;
    }

    if (editingAsset) {
      assetService.updateAsset(editingAsset.id, assetForm);
      addToast({
        title: 'Asset Updated',
        message: `${assetForm.name} (${assetForm.tag}) details saved.`,
        type: 'success',
      });
      setEditingAsset(null);
    } else {
      assetService.addAsset(assetForm);
      addToast({
        title: 'Asset Registered',
        message: `${assetForm.name} added to inventory.`,
        type: 'success',
      });
      setShowAddModal(false);
    }
    loadData();
  };

  const handleDeleteAssetConfirm = () => {
    if (!deletingAsset) return;
    assetService.deleteAsset(deletingAsset.id);
    addToast({
      title: 'Asset Deleted',
      message: `${deletingAsset.name} removed from inventory.`,
      type: 'info',
    });
    setDeletingAsset(null);
    loadData();
  };

  const handleStatusChange = (assetId, newStatus) => {
    assetService.updateAsset(assetId, { status: newStatus });
    addToast({
      title: 'Status Updated',
      message: `Asset status set to "${newStatus}".`,
      type: 'info',
    });
    loadData();
  };

  const handleExportCSV = () => {
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
    link.setAttribute('download', `codeflies_assets_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast({
      title: 'Export Complete',
      message: `Downloaded CSV with ${filteredAssets.length} asset records.`,
      type: 'success',
    });
  };

  // --- TICKET & REQUEST ACTIONS ---
  const handleSaveTicket = (e) => {
    e.preventDefault();
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
    addToast({ title: 'Ticket Created', message: `Support ticket filed for ${linkedAsset.name}.`, type: 'success' });
    setShowNewTicketModal(false);
    loadData();
  };

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
    addToast({ title: 'Gate Pass Requested', message: `Take-home request submitted.`, type: 'success' });
    setShowNewRequestModal(false);
    loadData();
  };

  const handleApproveRequest = (req) => {
    assetService.updateRequestStatus(req.id, 'Approved');
    addToast({ title: 'Request Approved ✓', message: `${req.by}'s gate pass for ${req.assetName} approved.`, type: 'success' });
    loadData();
  };

  const handleRejectRequest = (req) => {
    assetService.updateRequestStatus(req.id, 'Rejected');
    addToast({ title: 'Request Rejected', message: `Gate pass for ${req.assetName} declined.`, type: 'info' });
    loadData();
  };

  // --- FILTER BAR (MATCHING USER MANAGEMENT SCREENSHOT) ---
  const assetFilterBar = (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
      {/* Left side: View Dropdown + Search + Type & Status Dropdowns */}
      <div className="flex flex-wrap items-center gap-2 flex-1">
        {/* Blue View Pill Dropdown */}
        <div className="relative">
          <select
            value={activeView}
            onChange={(e) => {
              setActiveView(e.target.value);
              setSearchQuery('');
              setTypeFilter('All');
              setStatusFilter('All');
            }}
            className="appearance-none pl-3.5 pr-8 py-2 text-xs font-bold rounded-xl bg-blue-50 text-[#2563EB] border border-blue-200 hover:bg-blue-100/70 focus:outline-none cursor-pointer transition-colors shadow-2xs"
          >
            <option value="assets">All Assets ({assets.length})</option>
            <option value="tickets">Support Tickets ({tickets.length})</option>
            <option value="requests">Take-Home Requests ({requests.length})</option>
          </select>
          <span className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-xs text-[#2563EB]">
            ▾
          </span>
        </div>

        {/* Search Input */}
        <div className="relative min-w-[220px] flex-1 sm:flex-initial">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder={
              activeView === 'assets'
                ? 'Search asset, model, tag, employee...'
                : activeView === 'tickets'
                ? 'Search ticket, issue, reporter...'
                : 'Search request, employee, reason...'
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#E5EAF2] bg-white text-[#172033] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
          />
        </div>

        {/* Dropdown 1: All Types (only in Assets view) */}
        {activeView === 'assets' && (
          <div className="relative">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="appearance-none pl-3 pr-7 py-2 text-xs rounded-xl border border-[#E5EAF2] bg-white text-[#172033] font-semibold focus:outline-none focus:border-[#2563EB] cursor-pointer"
            >
              <option value="All">All Types</option>
              <option value="Laptop">Laptop</option>
              <option value="Charger">Charger</option>
              <option value="Cable">Cable</option>
              <option value="Mouse">Mouse</option>
              <option value="Monitors">Monitors</option>
              <option value="Mobile Devices">Mobile Devices</option>
            </select>
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-[10px] text-slate-400">
              ▾
            </span>
          </div>
        )}

        {/* Dropdown 2: All Statuses */}
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="appearance-none pl-3 pr-7 py-2 text-xs rounded-xl border border-[#E5EAF2] bg-white text-[#172033] font-semibold focus:outline-none focus:border-[#2563EB] cursor-pointer"
          >
            <option value="All">All Statuses</option>
            {activeView === 'assets' && (
              <>
                <option value="Active">Active</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Available">Available</option>
              </>
            )}
            {activeView === 'tickets' && (
              <>
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </>
            )}
            {activeView === 'requests' && (
              <>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </>
            )}
          </select>
          <span className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-[10px] text-slate-400">
            ▾
          </span>
        </div>
      </div>

      {/* Right side: Clear Button + Filter Counter + Refresh */}
      <div className="flex items-center gap-2.5 self-end lg:self-auto flex-shrink-0">
        {(searchQuery || typeFilter !== 'All' || statusFilter !== 'All') && (
          <button
            onClick={() => {
              setSearchQuery('');
              setTypeFilter('All');
              setStatusFilter('All');
            }}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-lg text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>
        )}

        <div className="h-6 w-px bg-[#E5EAF2] hidden sm:block mx-0.5" />

        <div className="text-xs text-[#8292AD] font-medium flex items-center gap-1.5 whitespace-nowrap select-none">
          <span>
            Filtered:{' '}
            {activeView === 'assets'
              ? `${filteredAssets.length} Shown of ${assets.length}`
              : activeView === 'tickets'
              ? `${filteredTickets.length} Shown of ${tickets.length}`
              : `${filteredRequests.length} Shown of ${requests.length}`}
          </span>
          <button
            onClick={loadData}
            title="Refresh Data"
            className="p-1 hover:bg-[#F8FAFC] rounded-lg transition-transform active:rotate-180 cursor-pointer"
          >
            <RotateCw className="w-3.5 h-3.5 text-[#8292AD] hover:text-[#2563EB] transition-colors" />
          </button>
        </div>
      </div>
    </div>
  );

  // --- ASSETS TABLE COLUMNS (EXACT MATCH TO USER MANAGEMENT) ---
  const assetColumns = [
    {
      header: 'TYPE / TAG',
      accessor: 'type',
      render: (row) => {
        const isStarred = starredItems.includes(row.id);
        const typeBadgeColor =
          row.type === 'Laptop'
            ? 'bg-blue-50 text-[#2563EB] border-blue-200'
            : row.type === 'Cable'
            ? 'bg-amber-50 text-amber-700 border-amber-200'
            : row.type === 'Charger'
            ? 'bg-purple-50 text-purple-700 border-purple-200'
            : 'bg-teal-50 text-teal-700 border-teal-200';

        return (
          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleStar(row.id)}
              className="focus:outline-none transition-transform hover:scale-110 cursor-pointer"
              title="Bookmark Asset"
            >
              <Star
                className={`w-3.5 h-3.5 ${
                  isStarred ? 'fill-amber-400 text-amber-400' : 'text-slate-300 hover:text-amber-400'
                }`}
              />
            </button>
            <span
              className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${typeBadgeColor}`}
            >
              <span>{row.type}</span>
              <span className="text-[9px] opacity-60">▾</span>
            </span>
          </div>
        );
      },
    },
    {
      header: 'HARDWARE & MODEL',
      accessor: 'name',
      render: (row) => (
        <div className="flex items-center gap-2.5">
          {row.image ? (
            <img
              src={row.image}
              alt={row.name}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-[#E5EAF2] flex-shrink-0"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 text-slate-500 flex items-center justify-center font-bold text-xs flex-shrink-0">
              <Laptop className="w-4 h-4 text-slate-400" />
            </div>
          )}
          <div className="min-w-0">
            <div
              className="font-bold text-[#172033] text-xs hover:text-[#2563EB] cursor-pointer truncate"
              onClick={() => setSelectedAsset(row)}
              title={`View ${row.code} details`}
            >
              {row.code} - {row.name}
            </div>
            <div className="text-[10px] text-[#8292AD] font-medium flex items-center gap-1 mt-0.5">
              <span>Tag: <strong className="text-slate-700">{row.tag}</strong></span>
              <span>•</span>
              <span>Serial: {row.serial}</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      header: 'SPECIFICATIONS',
      accessor: 'details',
      render: (row) => (
        <div className="text-xs font-bold text-[#172033] truncate max-w-[170px]" title={row.details}>
          {row.details || row.name}
        </div>
      ),
    },
    {
      header: 'ASSIGNED EMPLOYEE',
      accessor: 'assignedTo',
      render: (row) => (
        <span
          className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[#4E5D78] bg-[#F7F9FC] px-2.5 py-1 rounded-full border border-[#E5EAF2] max-w-[200px] truncate"
          title={row.assignedTo}
        >
          <User className="w-3 h-3 text-[#2563EB] flex-shrink-0" />
          <span className="truncate font-semibold">{row.assignedTo}</span>
        </span>
      ),
    },
    {
      header: 'PURCHASE & ASSIGNED',
      accessor: 'purchaseDate',
      render: (row) => (
        <div className="space-y-1 text-left whitespace-nowrap">
          <div className="text-[11px] font-medium text-[#1F2937] flex items-center gap-1.5">
            <Calendar className="w-3 h-3 text-[#2563EB] flex-shrink-0" />
            <span className="text-[#8292AD] font-bold text-[10px]">ASSIGNED:</span>
            <span className="font-semibold text-[#111827]">{row.purchaseDate || '15 Jan, 2024'}</span>
          </div>
          <div className="text-[11px] font-medium flex items-center gap-1.5">
            <Calendar className="w-3 h-3 text-slate-400 flex-shrink-0" />
            <span className="text-[#8292AD] font-bold text-[10px]">WARRANTY:</span>
            <span className="font-medium text-slate-500">2027</span>
          </div>
        </div>
      ),
    },
    {
      header: 'HEALTH / TICKETS',
      accessor: 'condition',
      render: (row) => {
        const hasOpenTicket = tickets.some((t) => t.assetId === row.id && t.status === 'Open');
        return hasOpenTicket ? (
          <span
            onClick={() => setActiveView('tickets')}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 whitespace-nowrap shadow-2xs cursor-pointer hover:bg-amber-100"
          >
            <AlertCircle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
            <span>Ticket Open</span>
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 whitespace-nowrap shadow-2xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
            <span>Operational</span>
          </span>
        );
      },
    },
    {
      header: 'STATUS',
      accessor: 'status',
      align: 'center',
      render: (row) => (
        <StatusBadge
          status={row.status}
          size="xs"
          showChevron={true}
          options={['Active', 'Maintenance', 'Available']}
          onStatusChange={(newStatus) => handleStatusChange(row.id, newStatus)}
        />
      ),
    },
  ];

  // --- TICKETS TABLE COLUMNS ---
  const ticketColumns = [
    {
      header: 'TICKET #',
      accessor: 'ticketNo',
      render: (row) => (
        <div className="flex items-center gap-2">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span className="font-bold text-[#2563EB] text-xs cursor-pointer hover:underline" onClick={() => setSelectedTicket(row)}>
            {row.ticketNo}
          </span>
        </div>
      ),
    },
    {
      header: 'ISSUE & DESCRIPTION',
      accessor: 'issue',
      render: (row) => (
        <div className="min-w-0 max-w-[280px]">
          <p className="font-bold text-xs text-[#172033] truncate hover:text-[#2563EB] cursor-pointer" onClick={() => setSelectedTicket(row)}>
            {row.issue}
          </p>
          <p className="text-[10.5px] text-[#8292AD] truncate mt-0.5">{row.description}</p>
        </div>
      ),
    },
    {
      header: 'AFFECTED HARDWARE',
      accessor: 'assetName',
      render: (row) => (
        <div>
          <p className="font-bold text-xs text-[#172033]">{row.assetCode} - {row.assetName}</p>
          <p className="text-[10px] text-[#8292AD] mt-0.5">Tag: {row.assetTag} • {row.assetType}</p>
        </div>
      ),
    },
    {
      header: 'SUBMITTED BY',
      accessor: 'submittedBy',
      render: (row) => (
        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#4E5D78] bg-[#F7F9FC] px-2.5 py-1 rounded-full border border-[#E5EAF2]">
          <User className="w-3 h-3 text-[#2563EB]" />
          <span>{row.submittedBy}</span>
        </span>
      ),
    },
    {
      header: 'DATE LOGGED',
      accessor: 'date',
      render: (row) => (
        <div className="text-[11px] font-semibold text-slate-600 flex items-center gap-1">
          <Calendar className="w-3 h-3 text-slate-400" />
          <span>{row.date}</span>
        </div>
      ),
    },
    {
      header: 'STATUS',
      accessor: 'status',
      align: 'center',
      render: (row) => (
        <StatusBadge
          status={row.status}
          size="xs"
          showChevron={true}
          options={['Open', 'In Progress', 'Resolved']}
          onStatusChange={(newStatus) => {
            assetService.updateTicketStatus(row.id, newStatus);
            addToast({ title: 'Status Updated', message: `Ticket status set to "${newStatus}".`, type: 'info' });
            loadData();
          }}
        />
      ),
    },
  ];

  // --- TAKE-HOME REQUESTS COLUMNS ---
  const requestColumns = [
    {
      header: 'REQUEST #',
      accessor: 'requestNo',
      render: (row) => (
        <div className="flex items-center gap-2">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span className="font-bold text-[#172033] text-xs">{row.requestNo}</span>
        </div>
      ),
    },
    {
      header: 'REQUESTED BY',
      accessor: 'by',
      render: (row) => (
        <div className="flex items-center gap-2">
          <img src={row.avatar} alt={row.by} className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200" />
          <span className="font-bold text-xs text-[#172033]">{row.by}</span>
        </div>
      ),
    },
    {
      header: 'ASSET DETAILS',
      accessor: 'assetName',
      render: (row) => (
        <div>
          <p className="font-bold text-xs text-[#2563EB]">{row.assetCode} - {row.assetName}</p>
          <p className="text-[10px] text-[#8292AD] mt-0.5">Tag: {row.assetTag} • {row.assetType}</p>
        </div>
      ),
    },
    {
      header: 'DURATION (DATES)',
      accessor: 'duration',
      render: (row) => (
        <div className="text-[11px] font-semibold text-slate-700 flex items-center gap-1.5 whitespace-nowrap">
          <Calendar className="w-3 h-3 text-[#2563EB]" />
          <span>{row.duration}</span>
        </div>
      ),
    },
    {
      header: 'REASON',
      accessor: 'reason',
      render: (row) => (
        <span className="text-xs text-slate-600 font-medium max-w-[200px] truncate block" title={row.reason}>
          {row.reason}
        </span>
      ),
    },
    {
      header: 'STATUS',
      accessor: 'status',
      align: 'center',
      render: (row) => (
        <StatusBadge
          status={row.status}
          size="xs"
          showChevron={true}
          options={['Pending', 'Approved', 'Rejected']}
          onStatusChange={(newStatus) => {
            assetService.updateRequestStatus(row.id, newStatus);
            addToast({ title: 'Status Updated', message: `Gate pass set to "${newStatus}".`, type: 'info' });
            loadData();
          }}
        />
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-12 w-full">
      {/* 1. Header (exact match to User Management PageHeader) */}
      <PageHeader
        title="Asset Management"
        badgeText="Hardware Inventory"
        subtitle="Manage company hardware inventory, employee allocations, support tickets, and take-home gate passes."
        breadcrumbs={[{ label: 'Home', link: '/' }, { label: 'Assets' }]}
        actions={
          <div className="flex items-center gap-2.5">
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 px-3.5 h-9 text-xs font-bold rounded-xl border border-[#E5EAF2] bg-white text-[#64748B] hover:text-[#172033] hover:bg-slate-50 transition-all shadow-2xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>

            {activeView === 'assets' && (
              <button
                onClick={handleOpenAddAsset}
                className="inline-flex items-center gap-1.5 px-4 h-9 text-xs font-bold rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white shadow-sm transition-all active:scale-95 shadow-blue-500/20 cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>Add Asset</span>
              </button>
            )}

            {activeView === 'tickets' && (
              <button
                onClick={() => setShowNewTicketModal(true)}
                className="inline-flex items-center gap-1.5 px-4 h-9 text-xs font-bold rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white shadow-sm transition-all active:scale-95 shadow-blue-500/20 cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>New Ticket</span>
              </button>
            )}

            {activeView === 'requests' && (
              <button
                onClick={() => setShowNewRequestModal(true)}
                className="inline-flex items-center gap-1.5 px-4 h-9 text-xs font-bold rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white shadow-sm transition-all active:scale-95 shadow-blue-500/20 cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>New Request</span>
              </button>
            )}
          </div>
        }
      />

      {/* 2. Stats Cards (4 Top Cards identical to Screenshot) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Inventory */}
        <div onClick={() => setActiveView('assets')} className="cursor-pointer">
          <StatsCard
            title="Total Inventory"
            value={234}
            subtext="Configured hardware assets"
            badgeText="Active"
            badgeType="success"
            icon={Laptop}
            iconBg="bg-blue-50 text-[#2563EB]"
          />
        </div>

        {/* Card 2: Active in Circulation */}
        <div onClick={() => setActiveView('assets')} className="cursor-pointer">
          <StatsCard
            title="Active Hardware"
            value={assets.filter((a) => a.status === 'Active').length || 11}
            subtext="In daily operational usage"
            badgeText="Operational"
            badgeType="success"
            icon={CheckCircle}
            iconBg="bg-emerald-50 text-emerald-600"
          />
        </div>

        {/* Card 3: Support Tickets */}
        <div onClick={() => setActiveView('tickets')} className="cursor-pointer">
          <StatsCard
            title="Support Tickets"
            value={17}
            subtext="Pending repair & inspection"
            badgeText="Open"
            badgeType="danger"
            icon={AlertCircle}
            iconBg="bg-amber-50 text-amber-600"
          />
        </div>

        {/* Card 4: Take-Home Gate Passes */}
        <div onClick={() => setActiveView('requests')} className="cursor-pointer">
          <StatsCard
            title="Take-Home Passes"
            value={11}
            subtext="Awaiting manager sign-off"
            badgeText="Gate Pass"
            badgeType="default"
            icon={Briefcase}
            iconBg="bg-purple-50 text-purple-600"
          />
        </div>
      </div>

      {/* 3. DataTable (matching User Management DataTable with 4 circular action buttons) */}
      {activeView === 'assets' && (
        <DataTable
          columns={assetColumns}
          data={filteredAssets}
          pageSize={7}
          filterBar={assetFilterBar}
          entityName="assets"
          emptyMessage="No assets found"
          emptySubtext="Try adjusting your status filter or clearing your search query."
          actions={(row) => (
            <div className="inline-flex items-center justify-end gap-1.5">
              {/* Eye View Button */}
              <button
                type="button"
                onClick={() => setSelectedAsset(row)}
                title={`View ${row.name} dossier`}
                className="w-7 h-7 rounded-full bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100 hover:scale-105 flex items-center justify-center transition-all shadow-2xs cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5 text-[#2563EB]" />
              </button>

              {/* Quick Status Toggle Button */}
              <button
                type="button"
                onClick={() => handleStatusChange(row.id, row.status === 'Active' ? 'Maintenance' : 'Active')}
                title="Toggle Active/Maintenance"
                className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-100 hover:scale-105 flex items-center justify-center transition-all shadow-2xs cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
              </button>

              {/* Edit Button */}
              <button
                type="button"
                onClick={() => handleOpenEditAsset(row)}
                title={`Edit ${row.name}`}
                className="w-7 h-7 rounded-full bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100 hover:scale-105 flex items-center justify-center transition-all shadow-2xs cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>

              {/* Delete Button */}
              <button
                type="button"
                onClick={() => setDeletingAsset(row)}
                title={`Delete ${row.name}`}
                className="w-7 h-7 rounded-full bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100 hover:scale-105 flex items-center justify-center transition-all shadow-2xs cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        />
      )}

      {/* Tickets View */}
      {activeView === 'tickets' && (
        <DataTable
          columns={ticketColumns}
          data={filteredTickets}
          pageSize={7}
          filterBar={assetFilterBar}
          entityName="support tickets"
          emptyMessage="No tickets found"
          emptySubtext="Try adjusting your status filter or clearing your search query."
          actions={(row) => (
            <div className="inline-flex items-center justify-end gap-1.5">
              <button
                type="button"
                onClick={() => setSelectedTicket(row)}
                title="View Ticket Details"
                className="w-7 h-7 rounded-full bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100 hover:scale-105 flex items-center justify-center transition-all shadow-2xs cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5 text-[#2563EB]" />
              </button>
              <button
                type="button"
                onClick={() => {
                  assetService.updateTicketStatus(row.id, 'Resolved');
                  addToast({ title: 'Ticket Resolved', message: `${row.ticketNo} marked resolved.`, type: 'success' });
                  loadData();
                }}
                title="Mark as Resolved"
                className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-100 hover:scale-105 flex items-center justify-center transition-all shadow-2xs cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => {
                  assetService.deleteTicket(row.id);
                  addToast({ title: 'Ticket Deleted', message: `${row.ticketNo} removed.`, type: 'info' });
                  loadData();
                }}
                title="Delete Ticket"
                className="w-7 h-7 rounded-full bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100 hover:scale-105 flex items-center justify-center transition-all shadow-2xs cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        />
      )}

      {/* Take-Home Requests View */}
      {activeView === 'requests' && (
        <DataTable
          columns={requestColumns}
          data={filteredRequests}
          pageSize={7}
          filterBar={assetFilterBar}
          entityName="take-home requests"
          emptyMessage="No requests found"
          emptySubtext="Try adjusting your status filter or clearing your search query."
          actions={(row) => (
            <div className="inline-flex items-center justify-end gap-1.5">
              <button
                type="button"
                onClick={() => handleApproveRequest(row)}
                title="Approve Gate Pass"
                className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-100 hover:scale-105 flex items-center justify-center transition-all shadow-2xs cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => handleRejectRequest(row)}
                title="Reject Gate Pass"
                className="w-7 h-7 rounded-full bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100 hover:scale-105 flex items-center justify-center transition-all shadow-2xs cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => {
                  assetService.deleteRequest(row.id);
                  addToast({ title: 'Request Removed', message: `${row.requestNo} deleted.`, type: 'info' });
                  loadData();
                }}
                title="Delete Request"
                className="w-7 h-7 rounded-full bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100 hover:scale-105 flex items-center justify-center transition-all shadow-2xs cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        />
      )}

      {/* ========================================================================= */}
      {/* MODALS SECTION                                                           */}
      {/* ========================================================================= */}

      {/* Modal 1: Complete Asset Dossier Modal (View Asset) */}
      {selectedAsset && (
        <Modal
          isOpen={!!selectedAsset}
          onClose={() => setSelectedAsset(null)}
          title={`Asset Dossier: ${selectedAsset.code}`}
          subtitle={`Hardware inventory record for ${selectedAsset.name} (Tag: ${selectedAsset.tag})`}
          maxWidth="max-w-2xl"
        >
          <div className="space-y-4 text-xs">
            {/* Top Identity Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50/70 via-indigo-50/30 to-slate-50 border border-blue-100 flex items-center gap-4">
              {selectedAsset.image ? (
                <img
                  src={selectedAsset.image}
                  alt={selectedAsset.name}
                  className="w-16 h-16 rounded-2xl object-cover ring-2 ring-white shadow-md flex-shrink-0"
                />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-white text-blue-600 border border-blue-100 flex items-center justify-center text-xl font-bold flex-shrink-0 shadow-xs">
                  <Laptop className="w-8 h-8 text-[#2563EB]" />
                </div>
              )}
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-base font-extrabold text-[#172033]">{selectedAsset.name}</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-[#1D4ED8]">
                    {selectedAsset.type}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {selectedAsset.status}
                  </span>
                </div>
                <p className="text-[11px] text-[#8292AD] mt-1 font-medium">
                  Tag Code: <strong className="text-slate-800">{selectedAsset.tag}</strong> • Serial Number: <strong className="text-slate-800">{selectedAsset.serial}</strong>
                </p>
                <p className="text-[11px] text-slate-600 mt-0.5 font-medium">
                  Assigned To: <strong className="text-indigo-700">{selectedAsset.assignedTo}</strong>
                </p>
              </div>
            </div>

            {/* Hardware Specs Grid */}
            <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-white border border-[#E5EAF2]">
              <div>
                <p className="text-[10px] font-bold text-[#8292AD] uppercase">Hardware Category</p>
                <p className="font-bold text-xs text-[#172033] mt-0.5">{selectedAsset.type}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-[#8292AD] uppercase">Current Condition</p>
                <p className="font-bold text-xs text-emerald-700 mt-0.5">{selectedAsset.condition || 'Excellent'}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-[#8292AD] uppercase">Purchase Date</p>
                <p className="font-bold text-xs text-[#172033] mt-0.5">{selectedAsset.purchaseDate || '12 Jan, 2024'}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-[#8292AD] uppercase">Warranty Status</p>
                <p className="font-bold text-xs text-[#172033] mt-0.5">Active (Expires Jan 2027)</p>
              </div>
            </div>

            <div className="flex justify-end gap-2.5 pt-2 border-t border-[#E5EAF2]">
              <button
                type="button"
                onClick={() => setSelectedAsset(null)}
                className="px-4 py-2 text-xs font-semibold rounded-xl border border-[#E5EAF2] text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Close Dossier
              </button>
              <button
                type="button"
                onClick={() => {
                  const asset = selectedAsset;
                  setSelectedAsset(null);
                  handleOpenEditAsset(asset);
                }}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white shadow-sm cursor-pointer"
              >
                Edit Asset Details
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal 2: Add / Edit Asset Modal */}
      {(showAddModal || editingAsset) && (
        <Modal
          isOpen={showAddModal || !!editingAsset}
          onClose={() => {
            setShowAddModal(false);
            setEditingAsset(null);
          }}
          title={editingAsset ? `Edit Asset: ${editingAsset.code}` : 'Register New Asset'}
          subtitle="Configure hardware specifications, tag ID and employee assignment"
          maxWidth="max-w-xl"
        >
          <form onSubmit={handleSaveAsset} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-[#172033] mb-1">Asset Model / Name *</label>
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
                  setShowAddModal(false);
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

      {/* Modal 3: Delete Asset Modal */}
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
                  Deleting <span className="font-bold">{deletingAsset.code} - {deletingAsset.name}</span> (Tag: {deletingAsset.tag}) will remove all historical records.
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

      {/* Modal 4: View Support Ticket */}
      {selectedTicket && (
        <Modal
          isOpen={!!selectedTicket}
          onClose={() => setSelectedTicket(null)}
          title={`${selectedTicket.ticketNo}: ${selectedTicket.issue}`}
          subtitle={`Reported by ${selectedTicket.submittedBy} on ${selectedTicket.date}`}
          maxWidth="max-w-lg"
        >
          <div className="space-y-4 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-[#E5EAF2] flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-[#8292AD] uppercase">Hardware Asset</p>
                <p className="font-extrabold text-sm text-[#172033] mt-0.5">{selectedTicket.assetCode} - {selectedTicket.assetName}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Tag: {selectedTicket.assetTag} • {selectedTicket.assetType}</p>
              </div>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                {selectedTicket.status}
              </span>
            </div>

            <div>
              <p className="font-bold text-[#172033] mb-1">Issue Description</p>
              <div className="p-3 rounded-xl border border-[#E5EAF2] bg-white text-slate-700 leading-relaxed">
                {selectedTicket.description}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#E5EAF2]">
              <button
                type="button"
                onClick={() => setSelectedTicket(null)}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal 5: New Support Ticket */}
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

      {/* Modal 6: New Take-Home Request */}
      {showNewRequestModal && (
        <Modal
          isOpen={showNewRequestModal}
          onClose={() => setShowNewRequestModal(false)}
          title="New Take-Home Gate Pass Request"
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
                Create Gate Pass
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
