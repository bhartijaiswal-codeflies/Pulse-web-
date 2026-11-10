import React, { useState, useMemo } from 'react';
import {
  Users,
  Zap,
  Bell,
  Timer,
  Plus,
  RotateCw,
  Search,
  MessageSquare,
  Phone,
  CheckCircle2,
  XCircle,
  Skull,
  Star,
  ExternalLink,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Filter,
  Check,
  Building,
  Mail,
  DollarSign,
  Clock,
  Sparkles,
} from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { StatusBadge } from '../components/common/StatusBadge';
import { ActionDropdown } from '../components/common/ActionDropdown';
import { Modal } from '../components/common/Modal';
import { useToast } from '../context/NotificationContext';

const INITIAL_LEADS = [
  {
    id: 'lead-1',
    bde: 'cydpy',
    bdeRole: 'BDE',
    starred: false,
    date: '14 Aug',
    leadName: 'Cyrille MARTINA',
    flag: '🇫🇷',
    company: 'FlowApp Direct',
    email: 'cyrille@martinalogistics.fr',
    phone: '+33 6 11 05 33 90',
    amount: null,
    lastFollowUpDate: '17 Aug, 2026',
    lastFollowUpNote: 'Followup 2',
    isOverdue: false,
    emeName: 'Priya Sharma',
    emeEmail: 'priya.sharma@codeflies.com',
    status: 'Handled',
    action: 'not-qualified',
  },
  {
    id: 'lead-2',
    bde: 'Admin',
    bdeRole: 'Admin',
    starred: false,
    date: '14 Aug',
    leadName: 'SD Mission',
    flag: '🇦🇺',
    company: 'FlowApp Direct',
    email: 'mission.sd@sdmission.au',
    phone: '+61 0470202070',
    amount: 5200,
    lastFollowUpDate: '17 Aug, 2026',
    lastFollowUpNote: 'Followup 2',
    isOverdue: false,
    emeName: 'Rohan Verma',
    emeEmail: 'rohan.verma@codeflies.com',
    status: 'Cold',
    action: 'dead',
  },
  {
    id: 'lead-3',
    bde: 'GM Admin',
    bdeRole: 'GM Admin',
    starred: true,
    date: 'Today',
    dateHighlight: true,
    leadName: 'Novaran Medical Logistics',
    flag: '🇺🇸',
    company: 'FlowApp Direct',
    email: 'procurement@novaranmed.com',
    phone: '+1 (424) 295-3580',
    amount: 18500,
    lastFollowUpDate: 'Today Followup 1',
    lastFollowUpNote: 'Due in 25 m',
    isOverdue: true,
    emeName: 'Abhay Yadav',
    emeEmail: 'abhay.yadav@codeflies.com',
    status: 'Hot',
    action: 'qualified',
  },
  {
    id: 'lead-4',
    bde: 'New bde',
    bdeRole: 'BDE',
    starred: false,
    date: 'Today',
    dateHighlight: true,
    leadName: 'Chauffeurcaen',
    flag: '🇫🇷',
    company: 'FlowApp Direct',
    email: 'contact@chauffeurcaen.fr',
    phone: '+33 665084469',
    amount: null,
    lastFollowUpDate: 'Pending touch',
    lastFollowUpNote: '',
    isOverdue: false,
    emeName: 'Sneha Patel',
    emeEmail: 'sneha.patel@codeflies.com',
    status: 'Fresh Lead',
    action: 'not-qualified',
  },
  {
    id: 'lead-5',
    bde: 'Admin',
    bdeRole: 'Admin',
    starred: false,
    date: 'Today',
    dateHighlight: true,
    leadName: 'Mark Meyer',
    flag: '🇩🇪',
    company: 'Uranus Clean',
    email: 'mark.meyer@uranusclean.de',
    phone: '+49 15562 209336',
    amount: 4750,
    lastFollowUpDate: '--',
    lastFollowUpNote: '',
    isOverdue: false,
    emeName: 'Ankit Gupta',
    emeEmail: 'ankit.gupta@codeflies.com',
    status: 'Price Ghost',
    action: 'dead',
  },
  {
    id: 'lead-6',
    bde: 'posiqe',
    bdeRole: 'BDE',
    starred: false,
    date: 'Today',
    dateHighlight: true,
    leadName: 'Erin Hoover',
    flag: '🇺🇸',
    company: 'FlowApp Direct',
    email: 'ehoover@flowappdirect.com',
    phone: '+1 (303) 668-3625',
    amount: 3200,
    lastFollowUpDate: '--',
    lastFollowUpNote: '',
    isOverdue: false,
    emeName: 'Neha Singh',
    emeEmail: 'neha.singh@codeflies.com',
    status: 'Warm',
    action: 'qualified',
  },
  {
    id: 'lead-7',
    bde: 'Admin',
    bdeRole: 'Admin',
    starred: false,
    date: 'Today',
    dateHighlight: true,
    leadName: 'Marib Restaurant',
    flag: '🇺🇸',
    company: 'FlowApp Direct',
    email: 'marib.orders@maribfood.com',
    phone: '+1 (540) 870-9075',
    amount: 9000,
    lastFollowUpDate: '--',
    lastFollowUpNote: '',
    isOverdue: false,
    emeName: 'Rahul Mehta',
    emeEmail: 'rahul.mehta@codeflies.com',
    status: 'Fresh Lead',
    action: 'qualified',
  },
  {
    id: 'lead-8',
    bde: 'GM Admin',
    bdeRole: 'GM Admin',
    starred: true,
    date: 'Today',
    dateHighlight: true,
    leadName: 'Nexora Tech Corp',
    flag: '🇺🇸',
    company: 'FlowApp Direct',
    email: 'partners@nexoratech.com',
    phone: '+1 (415) 998-2310',
    amount: 14200,
    lastFollowUpDate: 'Today Followup 1',
    lastFollowUpNote: 'Due in 1 h',
    isOverdue: false,
    emeName: 'Pooja Joshi',
    emeEmail: 'pooja.joshi@codeflies.com',
    status: 'Warm',
    action: 'not-qualified',
  },
  {
    id: 'lead-9',
    bde: 'qibuforixo',
    bdeRole: 'BDE',
    starred: false,
    date: 'Yesterday',
    leadName: "L'Etoile Gastronomie",
    flag: '🇫🇷',
    company: 'FlowApp Direct',
    email: 'direction@letoile-gastro.fr',
    phone: '+33 1 40 55 22 99',
    amount: 6800,
    lastFollowUpDate: 'Yesterday',
    lastFollowUpNote: 'Followup 1',
    isOverdue: false,
    emeName: 'Abhay Yadav',
    emeEmail: 'abhay.yadav@codeflies.com',
    status: 'Handled',
    action: 'qualified',
  },
];

export const Leads = () => {
  const [leads, setLeads] = useState(INITIAL_LEADS);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newLead, setNewLead] = useState({
    leadName: '',
    company: '',
    email: '',
    phone: '',
    amount: '',
    status: 'Fresh Lead',
    bde: 'Admin',
    emeName: 'Abhay Yadav',
  });

  const { addToast } = useToast();

  const handleToggleStar = (id) => {
    setLeads((prev) =>
      prev.map((lead) =>
        lead.id === id ? { ...lead, starred: !lead.starred } : lead
      )
    );
  };

  const handleStatusChange = (leadId, newStatus) => {
    setLeads((prev) =>
      prev.map((lead) =>
        lead.id === leadId ? { ...lead, status: newStatus } : lead
      )
    );
    addToast({
      title: 'Status Updated',
      message: `Lead status updated to "${newStatus}"`,
      type: 'info',
    });
  };

  const handleActionChange = (leadId, actionId) => {
    setLeads((prev) =>
      prev.map((lead) =>
        lead.id === leadId ? { ...lead, action: actionId } : lead
      )
    );
    const labelMap = {
      qualified: 'Qualified',
      dead: 'Dead',
      'not-qualified': 'Not Qualified',
    };
    addToast({
      title: 'Action Applied',
      message: `Lead marked as ${labelMap[actionId] || actionId}.`,
      type: actionId === 'qualified' ? 'success' : actionId === 'dead' ? 'warning' : 'info',
    });
  };

  // Filter tabs definition matching Reference Image
  const tabs = [
    { id: 'all', label: 'All Leads', count: 142 },
    {
      id: 'fresh',
      label: 'Fresh Leads',
      count: 11,
      dotColor: 'bg-[#2563EB]',
    },
    {
      id: 'follow-up',
      label: 'In Follow-up',
      count: 36,
      icon: <Clock className="w-3.5 h-3.5 text-[#64748B]" />,
    },
    {
      id: 'handled',
      label: 'Handled',
      count: 78,
      icon: <Check className="w-3.5 h-3.5 text-[#059669]" />,
    },
    {
      id: 're-opened',
      label: 'Re-Opened',
      count: 17,
      icon: <RotateCw className="w-3.5 h-3.5 text-[#64748B]" />,
    },
    {
      id: 'dead',
      label: 'Dead Leads',
      count: '10,022',
      badgeColor: 'bg-rose-50 text-rose-600 border border-rose-200',
      icon: <Skull className="w-3.5 h-3.5 text-rose-600" />,
    },
  ];

  // Filtering logic
  const filteredLeads = useMemo(() => {
    return leads.filter((item) => {
      // Tab matching
      if (activeTab === 'fresh' && item.status !== 'Fresh Lead') return false;
      if (activeTab === 'handled' && item.status !== 'Handled') return false;
      if (activeTab === 'follow-up' && !['Warm', 'Hot', 'Cold'].includes(item.status)) return false;
      if (activeTab === 're-opened' && item.status !== 'Re Open') return false;
      if (activeTab === 'dead' && item.action !== 'dead') return false;

      // Search matching
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = item.leadName.toLowerCase().includes(q);
        const matchesCompany = item.company.toLowerCase().includes(q);
        const matchesEmail = item.email.toLowerCase().includes(q);
        const matchesBde = item.bde.toLowerCase().includes(q);
        const matchesEme = item.emeName.toLowerCase().includes(q);
        if (!matchesName && !matchesCompany && !matchesEmail && !matchesBde && !matchesEme) {
          return false;
        }
      }

      return true;
    });
  }, [leads, activeTab, searchQuery]);

  const pageSize = 10;
  const totalPages = Math.max(1, Math.ceil(filteredLeads.length / pageSize));
  const paginatedLeads = filteredLeads.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleCreateLead = (e) => {
    e.preventDefault();
    if (!newLead.leadName) return;

    const created = {
      id: `lead-${Date.now()}`,
      bde: newLead.bde || 'Admin',
      bdeRole: 'BDE',
      starred: false,
      date: 'Today',
      dateHighlight: true,
      leadName: newLead.leadName,
      flag: '🌐',
      company: newLead.company || 'Direct Inquiry',
      email: newLead.email || 'lead@example.com',
      phone: newLead.phone || '+1 555-0192',
      amount: newLead.amount ? parseFloat(newLead.amount) : null,
      lastFollowUpDate: 'Today',
      lastFollowUpNote: 'New Inquiry',
      isOverdue: false,
      emeName: newLead.emeName || 'Abhay Yadav',
      emeEmail: 'support@codeflies.com',
      status: newLead.status || 'Fresh Lead',
      action: 'dead',
    };

    setLeads([created, ...leads]);
    setShowAddModal(false);
    setNewLead({
      leadName: '',
      company: '',
      email: '',
      phone: '',
      amount: '',
      status: 'Fresh Lead',
      bde: 'Admin',
      emeName: 'Abhay Yadav',
    });

    addToast({
      title: 'Lead Created',
      message: `Lead for ${created.leadName} has been recorded into the live pipeline.`,
      type: 'success',
    });
  };

  return (
    <div className="space-y-5 animate-fade-in pb-16">
      {/* Top Header matching Reference Image 1 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h1 className="text-xl sm:text-2xl font-bold text-[#172033] tracking-tight">
            Active Leads Live Feed
          </h1>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-[#2563EB] border border-blue-200">
            EME Real-Time Sync
          </span>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#2563EB] hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all active:scale-95 shadow-blue-500/20"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>+ Lead</span>
        </button>
      </div>

      {/* Top 4 KPI Cards matching Reference Image 1 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* TOTAL ACTIVE */}
        <div className="bg-white border border-[#E5EAF2] rounded-2xl p-4 shadow-card flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-[#8292AD] uppercase tracking-wider">
              TOTAL ACTIVE
            </p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-extrabold text-[#172033]">142</span>
              <span className="text-xs font-semibold text-emerald-600">+14 this week</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
        </div>

        {/* FRESH LEADS */}
        <div className="bg-white border border-[#E5EAF2] rounded-2xl p-4 shadow-card flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <p className="text-[10px] font-bold text-[#8292AD] uppercase tracking-wider">
                FRESH LEADS
              </p>
              <span className="text-[9px] font-bold text-rose-600 bg-rose-50 border border-rose-200 px-1.5 py-0.2 rounded">
                ACTION NEEDED
              </span>
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-extrabold text-[#2563EB]">11</span>
              <span className="text-xs text-[#8292AD] font-medium">queued &lt; 2h</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#2563EB] text-white flex items-center justify-center shadow-sm">
            <Zap className="w-5 h-5 fill-white" />
          </div>
        </div>

        {/* TODAY FOLLOW-UPS */}
        <div className="bg-white border border-[#E5EAF2] rounded-2xl p-4 shadow-card flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-[#8292AD] uppercase tracking-wider">
              TODAY FOLLOW-UPS
            </p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-extrabold text-[#172033]">4</span>
              <span className="text-xs font-semibold text-rose-600">1 overdue</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Bell className="w-5 h-5" />
          </div>
        </div>

        {/* AVG RESPONSE TIME */}
        <div className="bg-white border border-[#E5EAF2] rounded-2xl p-4 shadow-card flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-[#8292AD] uppercase tracking-wider">
              AVG RESPONSE TIME
            </p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-extrabold text-emerald-600">18m</span>
              <span className="text-xs text-[#8292AD] font-medium">⚡ top 5% rep SLA</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Timer className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter Tabs Card (Red Box 1 from Reference Image) */}
      <div className="bg-white border border-[#E5EAF2] rounded-2xl p-3.5 shadow-card flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Left: Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full lg:w-auto pb-1 lg:pb-0">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setCurrentPage(1);
                }}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-[#2563EB] text-white shadow-xs'
                    : 'bg-white text-[#4E5D78] hover:text-[#172033] hover:bg-[#F8FAFC] border border-[#E5EAF2]'
                }`}
              >
                {tab.dotColor && (
                  <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-white' : tab.dotColor}`} />
                )}
                {tab.icon && <span className="flex-shrink-0">{tab.icon}</span>}
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full transition-colors ml-0.5 ${
                    isActive
                      ? 'bg-[#1D4ED8] text-white'
                      : tab.badgeColor || 'bg-[#F1F5F9] text-[#64748B]'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Right: Search & Live Counter */}
        <div className="flex items-center justify-between lg:justify-end gap-3 flex-shrink-0">
          <div className="relative w-full sm:w-60">
            <Search className="w-3.5 h-3.5 text-[#8292AD] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search leads, BDE..."
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-[#E5EAF2] bg-[#F8FAFC] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 text-[#172033] placeholder:text-[#8292AD]"
            />
          </div>

          <div className="text-xs text-[#8292AD] font-medium flex items-center gap-1.5 whitespace-nowrap select-none">
            <span>Filtered: 24 Shown of 142</span>
            <button
              onClick={() => {
                setLeads(INITIAL_LEADS);
                setSearchQuery('');
                setActiveTab('all');
                addToast({
                  title: 'Feed Refreshed',
                  message: 'Active lead pipeline refreshed with real-time EME sync.',
                  type: 'info',
                });
              }}
              title="Refresh Leads Data"
              className="p-1 hover:bg-[#F8FAFC] rounded-lg transition-transform active:rotate-180 cursor-pointer"
            >
              <RotateCw className="w-3.5 h-3.5 text-[#8292AD] hover:text-[#2563EB] transition-colors" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white border border-[#E5EAF2] rounded-2xl shadow-card overflow-visible">
        <div className="overflow-x-auto min-h-[460px] pb-32">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E5EAF2] bg-white">
                <th className="py-3 px-4 text-[10.5px] font-bold text-[#8292AD] uppercase tracking-wider">
                  BDE NAME
                </th>
                <th className="py-3 px-3 text-[10.5px] font-bold text-[#8292AD] uppercase tracking-wider">
                  DATE
                </th>
                <th className="py-3 px-4 text-[10.5px] font-bold text-[#8292AD] uppercase tracking-wider">
                  LEAD & COMPANY
                </th>
                <th className="py-3 px-4 text-[10.5px] font-bold text-[#8292AD] uppercase tracking-wider">
                  EMAIL / PHONE / CONV.
                </th>
                <th className="py-3 px-3 text-[10.5px] font-bold text-[#8292AD] uppercase tracking-wider">
                  AMOUNT
                </th>
                <th className="py-3 px-3 text-[10.5px] font-bold text-[#8292AD] uppercase tracking-wider">
                  LAST FOLLOW-UP
                </th>
                <th className="py-3 px-4 text-[10.5px] font-bold text-[#8292AD] uppercase tracking-wider">
                  EME NAME
                </th>
                <th className="py-3 px-3 text-[10.5px] font-bold text-[#8292AD] uppercase tracking-wider text-center">
                  OPTIONS
                </th>
                <th className="py-3 px-4 text-[10.5px] font-bold text-[#8292AD] uppercase tracking-wider text-center">
                  ACTIONS
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9] text-xs text-[#172033]">
              {paginatedLeads.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-[#F8FAFC] transition-colors group"
                >
                  {/* BDE Name with Star Favorite */}
                  <td className="py-3 px-4 align-middle whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleToggleStar(item.id)}
                        className="text-[#8292AD] hover:text-amber-500 transition-colors focus:outline-none cursor-pointer"
                        title={item.starred ? 'Starred Lead' : 'Star this lead'}
                      >
                        <Star
                          className={`w-3.5 h-3.5 ${
                            item.starred
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-slate-300 hover:text-amber-400'
                          }`}
                        />
                      </button>

                      {/* BDE Pill with Chevron */}
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE]">
                        <span>{item.bde}</span>
                        <ChevronDown className="w-3 h-3 text-[#2563EB] opacity-70" />
                      </span>
                    </div>
                  </td>

                  {/* Date */}
                  <td className="py-3 px-3 align-middle whitespace-nowrap">
                    <span
                      className={`text-xs ${
                        item.dateHighlight
                          ? 'font-bold text-[#2563EB]'
                          : 'font-medium text-[#4E5D78]'
                      }`}
                    >
                      {item.date}
                    </span>
                  </td>

                  {/* Lead & Company */}
                  <td className="py-3 px-4 align-middle">
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 font-bold text-[#172033] text-xs leading-snug">
                        <span className="truncate">{item.leadName}</span>
                        <span className="text-sm flex-shrink-0">{item.flag}</span>
                      </div>
                      <p className="text-[10px] text-[#8292AD] truncate mt-0.5">
                        {item.company}
                      </p>
                    </div>
                  </td>

                  {/* Email / Phone / Conv. */}
                  <td className="py-3 px-4 align-middle whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {/* Icons */}
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button
                          type="button"
                          title="Open Conversation"
                          className="w-6 h-6 rounded-lg bg-slate-50 text-[#8292AD] border border-slate-200 flex items-center justify-center hover:bg-slate-100 transition-colors cursor-pointer"
                        >
                          <MessageSquare className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          title="WhatsApp Message"
                          className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center hover:bg-emerald-100 transition-colors cursor-pointer"
                        >
                          <Phone className="w-3 h-3 stroke-[2.2]" />
                        </button>
                      </div>

                      {/* Contact Info */}
                      <div className="min-w-0 leading-tight">
                        <p className="text-[11px] font-medium text-[#172033] truncate">
                          {item.email}
                        </p>
                        <p className="text-[10px] text-[#8292AD] truncate mt-0.5">
                          {item.phone}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Amount */}
                  <td className="py-3 px-3 align-middle whitespace-nowrap">
                    {item.amount ? (
                      <span className="text-xs font-bold text-[#172033]">
                        ${item.amount.toLocaleString()}
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          const val = window.prompt(`Enter amount for ${item.leadName}:`, '5000');
                          if (val && !isNaN(val)) {
                            setLeads((prev) =>
                              prev.map((l) => (l.id === item.id ? { ...l, amount: parseFloat(val) } : l))
                            );
                            addToast({
                              title: 'Amount Added',
                              message: `Lead budget set to $${parseFloat(val).toLocaleString()}`,
                              type: 'success',
                            });
                          }
                        }}
                        className="text-xs font-semibold text-[#2563EB] hover:underline cursor-pointer"
                      >
                        + Add
                      </button>
                    )}
                  </td>

                  {/* Last Follow-up */}
                  <td className="py-3 px-3 align-middle whitespace-nowrap">
                    <div>
                      <p className="text-[11px] font-medium text-[#172033] leading-none">
                        {item.lastFollowUpDate}
                      </p>
                      {item.lastFollowUpNote && (
                        <p
                          className={`text-[10px] mt-1 leading-none ${
                            item.isOverdue
                              ? 'text-rose-600 font-bold'
                              : 'text-[#8292AD]'
                          }`}
                        >
                          {item.lastFollowUpNote}
                        </p>
                      )}
                    </div>
                  </td>

                  {/* EME Name & Email */}
                  <td className="py-3 px-4 align-middle whitespace-nowrap">
                    <div className="min-w-0 leading-tight">
                      <p className="text-xs font-bold text-[#172033] truncate">
                        {item.emeName}
                      </p>
                      <p className="text-[10px] text-[#8292AD] truncate mt-0.5">
                        {item.emeEmail}
                      </p>
                    </div>
                  </td>

                  {/* OPTIONS Dropdown Column (matching Reference Image 2 & 4) */}
                  <td className="py-3 px-3 align-middle text-center whitespace-nowrap">
                    <StatusBadge
                      status={item.status}
                      size="xs"
                      showChevron={true}
                      onStatusChange={(newStatus) =>
                        handleStatusChange(item.id, newStatus)
                      }
                    />
                  </td>

                  {/* ACTIONS Dropdown Column (matching Reference Image 1 & 3) */}
                  <td className="py-3 px-4 align-middle text-center whitespace-nowrap">
                    <ActionDropdown
                      currentAction={item.action}
                      onActionChange={(newAction) =>
                        handleActionChange(item.id, newAction)
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Boxed Pagination Container (Red Box 2 from Reference Image) */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-2">
        <div className="text-xs text-[#8292AD] font-medium">
          Showing <span className="font-bold text-[#172033]">{paginatedLeads.length}</span> active leads (Page {currentPage} of {totalPages} • Total {filteredLeads.length})
        </div>

        <div className="inline-flex items-center gap-1.5 p-1 rounded-full border border-[#E5EAF2] bg-white shadow-2xs">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 text-xs font-semibold text-[#64748B] hover:text-[#172033] rounded-full hover:bg-[#F8FAFC] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center transition-all ${
                currentPage === page
                  ? 'bg-[#2563EB] text-white shadow-xs'
                  : 'text-[#4E5D78] hover:bg-[#F8FAFC]'
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 text-xs font-semibold text-[#64748B] hover:text-[#172033] rounded-full hover:bg-[#F8FAFC] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      </div>

      {/* Add Lead Modal */}
      {showAddModal && (
        <Modal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          title="Create New Active Lead"
        >
          <form onSubmit={handleCreateLead} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#4E5D78] mb-1">
                  Lead / Contact Person *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cyrille MARTINA"
                  value={newLead.leadName}
                  onChange={(e) =>
                    setNewLead({ ...newLead, leadName: e.target.value })
                  }
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#E5EAF2] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4E5D78] mb-1">
                  Company / Organization
                </label>
                <input
                  type="text"
                  placeholder="e.g. FlowApp Direct"
                  value={newLead.company}
                  onChange={(e) =>
                    setNewLead({ ...newLead, company: e.target.value })
                  }
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#E5EAF2] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4E5D78] mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="e.g. contact@flowappdirect.com"
                  value={newLead.email}
                  onChange={(e) =>
                    setNewLead({ ...newLead, email: e.target.value })
                  }
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#E5EAF2] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4E5D78] mb-1">
                  Phone / WhatsApp
                </label>
                <input
                  type="text"
                  placeholder="e.g. +1 (415) 555-0199"
                  value={newLead.phone}
                  onChange={(e) =>
                    setNewLead({ ...newLead, phone: e.target.value })
                  }
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#E5EAF2] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4E5D78] mb-1">
                  Budget / Amount ($)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 8500"
                  value={newLead.amount}
                  onChange={(e) =>
                    setNewLead({ ...newLead, amount: e.target.value })
                  }
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#E5EAF2] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4E5D78] mb-1">
                  Initial Status
                </label>
                <select
                  value={newLead.status}
                  onChange={(e) =>
                    setNewLead({ ...newLead, status: e.target.value })
                  }
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#E5EAF2] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 bg-white"
                >
                  <option value="Fresh Lead">Fresh Lead</option>
                  <option value="Handled">Handled</option>
                  <option value="Warm">Warm</option>
                  <option value="Hot">Hot</option>
                  <option value="Cold">Cold</option>
                  <option value="Price Ghost">Price Ghost</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#E5EAF2]">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-xs font-semibold text-[#64748B] hover:text-[#172033] rounded-xl hover:bg-[#F8FAFC]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold bg-[#2563EB] hover:bg-blue-700 text-white rounded-xl shadow-sm transition-all"
              >
                Add Lead to Feed
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
