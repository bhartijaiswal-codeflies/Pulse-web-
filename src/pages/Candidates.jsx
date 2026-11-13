import React, { useState, useEffect, useRef, useMemo } from 'react';
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
  Users,
  Building,
  RotateCcw,
  RotateCw,
  ChevronDown,
  FileText,
  Send,
  Paperclip,
  Plus,
  Video,
} from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { StatsCard } from '../components/dashboard/StatsCard';
import { DataTable } from '../components/common/DataTable';
import { StatusBadge } from '../components/common/StatusBadge';
import { ActionDropdown } from '../components/common/ActionDropdown';
import { SearchBar } from '../components/common/SearchBar';
import { Modal } from '../components/common/Modal';
import { candidateService } from '../services/candidateService';
import { employeeService } from '../services/employeeService';
import { hrmsService } from '../services/hrmsService';
import { HiringPositionsView } from '../components/hrms/HiringPositionsView';
import { CandidateSourcingView } from '../components/hrms/CandidateSourcingView';
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

const MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

const MONTH_MAP = {
  jan: '01', feb: '02', mar: '03', apr: '04', may: '05', jun: '06',
  jul: '07', aug: '08', sep: '09', oct: '10', nov: '11', dec: '12',
};

const parseDateTimeParts = (dateTimeStr) => {
  if (!dateTimeStr) {
    const today = new Date().toISOString().split('T')[0];
    return { date: today, time: '11:00' };
  }

  let dateVal = '';
  let timeVal = '11:00';

  const isoMatch = dateTimeStr.match(/(\d{4})-(\d{2})-(\d{2})/);
  if (isoMatch) {
    dateVal = `${isoMatch[1]}-${isoMatch[2]}-${isoMatch[3]}`;
  } else {
    const dmMatch = dateTimeStr.match(/(\d{1,2})[- ]+([A-Za-z]{3})[, -]+(\d{2,4})/);
    if (dmMatch) {
      const day = dmMatch[1].padStart(2, '0');
      const monthKey = dmMatch[2].toLowerCase().substring(0, 3);
      const month = MONTH_MAP[monthKey] || '11';
      let year = dmMatch[3];
      if (year.length === 2) year = `20${year}`;
      dateVal = `${year}-${month}-${day}`;
    }
  }

  if (!dateVal) {
    dateVal = '2026-11-14';
  }

  const timeMatch = dateTimeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM|am|pm)?/i);
  if (timeMatch) {
    let hours = parseInt(timeMatch[1], 10);
    const minutes = timeMatch[2];
    const ampm = timeMatch[3]?.toUpperCase();

    if (ampm === 'PM' && hours < 12) hours += 12;
    if (ampm === 'AM' && hours === 12) hours = 0;

    timeVal = `${String(hours).padStart(2, '0')}:${minutes}`;
  }

  return { date: dateVal, time: timeVal };
};

const formatDateTimeParts = (dateStr, timeStr) => {
  if (!dateStr) return 'Pending Schedule';

  const parts = dateStr.split('-');
  let dateFormatted = dateStr;
  if (parts.length === 3) {
    const year = parts[0].slice(-2);
    const monthIdx = parseInt(parts[1], 10) - 1;
    const monthName = MONTH_NAMES[monthIdx] || 'Nov';
    const day = parts[2].padStart(2, '0');
    dateFormatted = `${day}-${monthName}-${year}`;
  }

  if (!timeStr) return dateFormatted;

  const [hStr, mStr] = timeStr.split(':');
  let h = parseInt(hStr || '11', 10);
  const m = mStr || '00';
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12;
  if (h === 0) h = 12;
  const timeFormatted = `${String(h).padStart(2, '0')}:${m} ${ampm}`;

  return `${dateFormatted} ${timeFormatted}`;
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
  const [roleFilter, setRoleFilter] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  // HRMS Tabs & Sourcing state
  const [activeHrmsTab, setActiveHrmsTab] = useState('candidates');
  const [sourcingPrefillRole, setSourcingPrefillRole] = useState(null);
  const [openPositionsCount, setOpenPositionsCount] = useState(() => hrmsService.getOpenPositions().length);
  const [sourcedCount, setSourcedCount] = useState(() => hrmsService.getSourcedCandidates().length);

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
  const [newInterviewDate, setNewInterviewDate] = useState('14-Nov-26 02:30 PM');
  const [newInterviewDateVal, setNewInterviewDateVal] = useState('2026-11-14');
  const [newInterviewTimeVal, setNewInterviewTimeVal] = useState('14:30');
  const [newInterviewer, setNewInterviewer] = useState('Saurabh H.');
  const [newRound, setNewRound] = useState('Technical Round');
  const [newOffer, setNewOffer] = useState('');
  const [newRounds, setNewRounds] = useState([
    {
      id: 'RND-1',
      round: 'HR Screening',
      interviewer: 'HR',
      interviewDate: '2026-11-12',
      interviewTime: '11:00',
      interviewAt: '12-Nov-26 11:00 AM',
      status: 'Scheduled',
    },
    {
      id: 'RND-2',
      round: 'Technical Round 1',
      interviewer: 'Vivek Sir',
      interviewDate: '2026-11-13',
      interviewTime: '15:00',
      interviewAt: '13-Nov-26 03:00 PM',
      status: 'Scheduled',
    },
    {
      id: 'RND-3',
      round: 'Technical Round 2',
      interviewer: 'Someone',
      interviewDate: '2026-11-14',
      interviewTime: '11:30',
      interviewAt: '14-Nov-26 11:30 AM',
      status: 'Scheduled',
    },
    {
      id: 'RND-4',
      round: 'Final Round',
      interviewer: 'Bhupender Singh',
      interviewDate: '2026-11-14',
      interviewTime: '14:30',
      interviewAt: '14-Nov-26 02:30 PM',
      status: 'Pending',
    },
  ]);

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
  const [editInterviewDateVal, setEditInterviewDateVal] = useState('2026-11-04');
  const [editInterviewTimeVal, setEditInterviewTimeVal] = useState('14:30');
  const [editInterviewer, setEditInterviewer] = useState('');
  const [editRound, setEditRound] = useState('Technical Round');
  const [editRoundStatus, setEditRoundStatus] = useState('Pending');
  const [editOffer, setEditOffer] = useState('');
  const [editRounds, setEditRounds] = useState([]);

  // Delete candidate modal state
  const [candidateToDelete, setCandidateToDelete] = useState(null);

  // View modal interactive states (for comments & offer)
  const [viewOfferText, setViewOfferText] = useState('');
  const [viewCommentText, setViewCommentText] = useState('');

  // Quick Round Add/Edit Modal (from View Candidate popup)
  const [showRoundModal, setShowRoundModal] = useState(false);
  const [roundModalIndex, setRoundModalIndex] = useState(null);
  const [roundModalName, setRoundModalName] = useState('Technical Round');
  const [roundModalInterviewer, setRoundModalInterviewer] = useState('Vivek Sir');
  const [roundModalDate, setRoundModalDate] = useState('2026-11-14');
  const [roundModalTime, setRoundModalTime] = useState('14:30');
  const [roundModalStatus, setRoundModalStatus] = useState('Scheduled');

  // Google Meet modal state
  const [meetingCandidate, setMeetingCandidate] = useState(null);
  const [copiedMeetLink, setCopiedMeetLink] = useState(false);

  // All Users list for interviewer dropdown
  const [allUsers, setAllUsers] = useState([]);

  const loadCandidates = () => {
    setCandidates(candidateService.getCandidates());
  };

  useEffect(() => {
    loadCandidates();
    try {
      const emps = employeeService.getEmployees();
      if (Array.isArray(emps)) {
        setAllUsers(emps);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const interviewerOptions = useMemo(() => {
    const defaultInterviewers = [
      'HR (Komal Thapliyal)',
      'Vivek Sir',
      'Someone (Technical Lead)',
      'Bhupender Singh',
      'HR',
      'Komal Thapliyal',
      'Saurabh H.',
      'Elena Rostova',
      'Marcus Vance',
      'Aisha Al-Mansoor',
      'David Chen',
      'Sarah Connor',
      'Liam Gallagher',
      'Priya Sharma',
      'Alexandre Roy',
      'Devin Thorne',
    ];
    const employeeNames = allUsers.map((u) => u.name);
    return Array.from(new Set([...defaultInterviewers, ...employeeNames])).filter(Boolean);
  }, [allUsers]);

  const generateMeetLink = (cand, roundName = 'round') => {
    if (!cand) return 'https://meet.google.com/qwa-rtyu-iop';
    const code = (cand.id || 'cnd').toLowerCase().replace(/[^a-z0-9]/g, '');
    const rndCode = (roundName || 'int').toLowerCase().substring(0, 3);
    return `https://meet.google.com/pls-${code}-${rndCode}`;
  };

  const handleSendMeetingLink = (cand, round = null) => {
    const roundTitle = round?.round || cand.round || 'Interview Round';
    const meetLink = generateMeetLink(cand, roundTitle);
    setMeetingCandidate(cand);
    setCopiedMeetLink(false);

    try {
      navigator.clipboard?.writeText(meetLink);
      setCopiedMeetLink(true);
    } catch (e) {
      console.error(e);
    }

    addToast({
      title: 'Google Meet Link Ready',
      message: `Meeting link copied to clipboard & invite ready for ${cand.name} (${cand.email}).`,
      type: 'success',
    });
  };

  // Sync view modal offer text when candidate opens
  useEffect(() => {
    if (selectedCandidate) {
      setViewOfferText(selectedCandidate.offer || '');
      setViewCommentText('');
    }
  }, [selectedCandidate]);

  // Round management helpers for Create modal
  const handleAddNewRoundItem = () => {
    const nextNum = newRounds.length + 1;
    const defaultInterviewer =
      nextNum === 1
        ? 'HR'
        : nextNum === 2
          ? 'Vivek Sir'
          : nextNum === 3
            ? 'Someone'
            : 'Bhupender Singh';
    const defaultTitle =
      nextNum === 1
        ? 'HR Screening'
        : nextNum === 2
          ? 'Technical Round 1'
          : nextNum === 3
            ? 'Technical Round 2'
            : 'Final Round';
    const date = '2026-11-14';
    const time = '14:30';
    setNewRounds([
      ...newRounds,
      {
        id: `RND-${Date.now()}`,
        round: defaultTitle,
        interviewer: defaultInterviewer,
        interviewDate: date,
        interviewTime: time,
        interviewAt: formatDateTimeParts(date, time),
        status: 'Scheduled',
      },
    ]);
  };

  const handleUpdateNewRoundItem = (index, field, value) => {
    setNewRounds((prev) =>
      prev.map((r, i) => {
        if (i !== index) return r;
        const updated = { ...r, [field]: value };
        if (field === 'interviewDate' || field === 'interviewTime') {
          const d = field === 'interviewDate' ? value : (r.interviewDate || '2026-11-14');
          const t = field === 'interviewTime' ? value : (r.interviewTime || '14:30');
          updated.interviewAt = formatDateTimeParts(d, t);
        }
        return updated;
      })
    );
  };

  const handleRemoveNewRoundItem = (index) => {
    setNewRounds((prev) => prev.filter((_, i) => i !== index));
  };

  // Round management helpers for Edit modal
  const handleAddEditRound = () => {
    const nextNum = editRounds.length + 1;
    const defaultInterviewer =
      nextNum === 1
        ? 'HR'
        : nextNum === 2
          ? 'Vivek Sir'
          : nextNum === 3
            ? 'Someone'
            : 'Bhupender Singh';
    const defaultTitle =
      nextNum === 1
        ? 'HR Round'
        : nextNum === 2
          ? 'Technical Round 1'
          : nextNum === 3
            ? 'Technical Round 2'
            : 'Final Round';
    const date = '2026-11-14';
    const time = '14:30';
    setEditRounds([
      ...editRounds,
      {
        id: `RND-${Date.now()}`,
        round: defaultTitle,
        interviewer: defaultInterviewer,
        interviewDate: date,
        interviewTime: time,
        interviewAt: formatDateTimeParts(date, time),
        status: 'Scheduled',
        lastUpdated: 'Just now',
      },
    ]);
  };

  const handleUpdateEditRound = (index, field, value) => {
    setEditRounds((prev) =>
      prev.map((r, i) => {
        if (i !== index) return r;
        const updated = { ...r, [field]: value, lastUpdated: 'Just now' };
        if (field === 'interviewDate' || field === 'interviewTime') {
          const d = field === 'interviewDate' ? value : (r.interviewDate || '2026-11-14');
          const t = field === 'interviewTime' ? value : (r.interviewTime || '14:30');
          updated.interviewAt = formatDateTimeParts(d, t);
        }
        return updated;
      })
    );
  };

  const handleRemoveEditRound = (index) => {
    setEditRounds((prev) => prev.filter((_, i) => i !== index));
  };

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

    const { date: candDate, time: candTime } = parseDateTimeParts(cand.interviewDate);
    setEditInterviewDateVal(candDate);
    setEditInterviewTimeVal(candTime);
    setEditInterviewDate(cand.interviewDate || formatDateTimeParts(candDate, candTime));

    setEditInterviewer(cand.interviewer || 'Bhupinderjit Singh');
    setEditRound(cand.round || 'Technical Round');
    setEditRoundStatus(cand.roundStatus || 'Pending');
    setEditOffer(cand.offer || '');

    // Populate multi-round list
    const candidateRounds =
      cand.rounds && cand.rounds.length > 0
        ? cand.rounds.map((r, i) => {
          const { date, time } = parseDateTimeParts(r.interviewAt);
          return {
            id: r.id || `RND-${i + 1}`,
            round: r.round || `Round ${i + 1}`,
            interviewer: r.interviewer || 'Interviewer',
            interviewDate: date,
            interviewTime: time,
            interviewAt: r.interviewAt || formatDateTimeParts(date, time),
            status: r.status || 'Pending',
            lastUpdated: r.lastUpdated || 'Today',
          };
        })
        : [
          {
            id: 'RND-1',
            round: 'HR Screening',
            interviewer: 'HR (Komal Thapliyal)',
            interviewDate: '2026-11-02',
            interviewTime: '11:30',
            interviewAt: '02-Nov-26 11:30 AM',
            status: 'Passed',
            lastUpdated: '02-Nov-26 12:15 PM',
          },
          {
            id: 'RND-2',
            round: 'Technical Round 1',
            interviewer: 'Vivek Sir',
            interviewDate: '2026-11-03',
            interviewTime: '15:00',
            interviewAt: '03-Nov-26 03:00 PM',
            status: 'Passed',
            lastUpdated: '03-Nov-26 03:50 PM',
          },
          {
            id: 'RND-3',
            round: 'Technical Round 2',
            interviewer: 'Someone (Technical Lead)',
            interviewDate: '2026-11-04',
            interviewTime: '11:00',
            interviewAt: '04-Nov-26 11:00 AM',
            status: 'Passed',
            lastUpdated: '04-Nov-26 11:45 AM',
          },
          {
            id: 'RND-4',
            round: 'Final Round',
            interviewer: 'Bhupender Singh',
            interviewDate: '2026-11-04',
            interviewTime: '14:30',
            interviewAt: '04-Nov-26 02:30 PM',
            status: 'Pending',
            lastUpdated: '04-Nov-26 01:41 PM',
          },
        ];
    setEditRounds(candidateRounds);
    setShowEditModal(true);
  };

  // Save Edit candidate (including multi-rounds)
  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editingCandidate) return;

    const latestRound = editRounds.length > 0 ? editRounds[editRounds.length - 1] : null;

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
      interviewDate: latestRound?.interviewAt || editInterviewDate.trim(),
      interviewer: latestRound?.interviewer || editInterviewer.trim(),
      round: latestRound?.round || editRound.trim(),
      roundStatus: latestRound?.status || editRoundStatus,
      rounds: editRounds,
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
      message: `Profile and interview rounds for ${editName} updated successfully.`,
      type: 'success',
    });
  };

  // Quick Round Modal (Add / Edit) for View Candidate popup
  const handleOpenAddRound = () => {
    setRoundModalIndex(null);
    const nextNum = (selectedCandidate?.rounds?.length || 0) + 1;
    const defaultInterviewer =
      nextNum === 1
        ? 'HR'
        : nextNum === 2
          ? 'Vivek Sir'
          : nextNum === 3
            ? 'Someone'
            : 'Bhupender Singh';
    const defaultTitle =
      nextNum === 1
        ? 'HR Screening'
        : nextNum === 2
          ? 'Technical Round 1'
          : nextNum === 3
            ? 'Technical Round 2'
            : 'Final Round';
    setRoundModalName(defaultTitle);
    setRoundModalInterviewer(defaultInterviewer);
    setRoundModalDate('14 Nov, 2026 - 02:30 PM');
    setRoundModalStatus('Scheduled');
    setShowRoundModal(true);
  };

  const handleOpenEditRound = (rnd, index) => {
    setRoundModalIndex(index);
    setRoundModalName(rnd.round || '');
    setRoundModalInterviewer(rnd.interviewer || '');
    setRoundModalDate(rnd.interviewAt || '');
    setRoundModalStatus(rnd.status || 'Pending');
    setShowRoundModal(true);
  };

  const handleSaveRoundModal = (e) => {
    e.preventDefault();
    if (!selectedCandidate) return;

    const currentRounds = [...(selectedCandidate.rounds || [])];
    const roundItem = {
      id:
        roundModalIndex !== null
          ? currentRounds[roundModalIndex]?.id || `RND-${Date.now()}`
          : `RND-${Date.now()}`,
      round: roundModalName.trim() || 'Interview Round',
      interviewer: roundModalInterviewer.trim() || 'Interviewer',
      interviewAt: roundModalDate.trim() || 'Pending Schedule',
      status: roundModalStatus,
      lastUpdated: 'Just now',
    };

    let updatedRounds;
    if (roundModalIndex !== null) {
      updatedRounds = currentRounds.map((r, i) => (i === roundModalIndex ? roundItem : r));
    } else {
      updatedRounds = [...currentRounds, roundItem];
    }

    const latestRound = updatedRounds[updatedRounds.length - 1];

    candidateService.updateCandidate(selectedCandidate.id, {
      rounds: updatedRounds,
      round: latestRound.round,
      interviewer: latestRound.interviewer,
      interviewDate: latestRound.interviewAt,
      roundStatus: latestRound.status,
    });

    setSelectedCandidate((prev) => ({
      ...prev,
      rounds: updatedRounds,
      round: latestRound.round,
      interviewer: latestRound.interviewer,
      interviewDate: latestRound.interviewAt,
      roundStatus: latestRound.status,
    }));
    loadCandidates();
    setShowRoundModal(false);
    addToast({
      title: roundModalIndex !== null ? 'Round Updated' : 'Round Added',
      message: `${roundModalName} with ${roundModalInterviewer} saved.`,
      type: 'success',
    });
  };

  const handleDeleteRound = (index) => {
    if (!selectedCandidate) return;
    const currentRounds = [...(selectedCandidate.rounds || [])];
    const removedName = currentRounds[index]?.round || 'Round';
    const updatedRounds = currentRounds.filter((_, i) => i !== index);

    const latestRound = updatedRounds.length > 0 ? updatedRounds[updatedRounds.length - 1] : null;

    candidateService.updateCandidate(selectedCandidate.id, {
      rounds: updatedRounds,
      round: latestRound ? latestRound.round : 'Pending Schedule',
      interviewer: latestRound ? latestRound.interviewer : selectedCandidate.recruiter,
      interviewDate: latestRound ? latestRound.interviewAt : 'Pending',
      roundStatus: latestRound ? latestRound.status : 'Pending',
    });

    setSelectedCandidate((prev) => ({
      ...prev,
      rounds: updatedRounds,
      round: latestRound ? latestRound.round : 'Pending Schedule',
      interviewer: latestRound ? latestRound.interviewer : selectedCandidate.recruiter,
      interviewDate: latestRound ? latestRound.interviewAt : 'Pending',
      roundStatus: latestRound ? latestRound.status : 'Pending',
    }));
    loadCandidates();
    addToast({
      title: 'Round Deleted',
      message: `${removedName} removed from interview schedule.`,
      type: 'info',
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
    setRoleFilter('All');
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
      'ETC',
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

    const latestRound = newRounds.length > 0 ? newRounds[newRounds.length - 1] : null;

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
      interviewDate: latestRound?.interviewAt || newInterviewDate || 'Pending Schedule',
      interviewer: latestRound?.interviewer || newInterviewer.trim() || newRecruiter.trim() || 'Saurabh H.',
      round: latestRound?.round || newRound || 'Technical Round',
      roundStatus: latestRound?.status || 'Pending',
      rounds: newRounds,
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

    return matchesSearch && matchesStage && matchesDept && matchesDate && (roleFilter === 'All' || c.role.toLowerCase().includes(roleFilter.toLowerCase()));
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
              className={`w-3.5 h-3.5 transition-transform duration-200 ${showStageDropdown ? 'rotate-180' : ''
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
                    className={`w-full px-3.5 py-2 text-xs flex items-center justify-between gap-3 transition-colors cursor-pointer ${isSelected
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
      header: 'ROLE & EXP',
      accessor: 'role',
      render: (row) => (
        <div className="space-y-1">
          <div className="text-xs font-bold text-[#111827]">{row.role}</div>
          <div className="flex items-center gap-2 flex-wrap">
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
        <div className="space-y-0.5 text-left whitespace-nowrap">
          <div className="text-[11px] font-medium text-[#1F2937]">
            <span className="text-[#6B7280] font-bold">CTC: </span>
            <span className="font-bold text-[#111827]">{formatSalary(row.ctc)}</span>
          </div>
          <div className="text-[11px] font-medium text-emerald-700">
            <span className="text-[#6B7280] font-bold">ETC: </span>
            <span className="font-bold text-emerald-600">{formatSalary(row.ectc)}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'INTERVIEW SCHEDULE',
      accessor: 'interviewDate',
      render: (row) => (
        <div className="text-[11px] text-[#4E5D78] flex items-center gap-1.5 font-medium whitespace-nowrap">
          <Calendar className="w-3.5 h-3.5 text-[#2563EB] flex-shrink-0" />
          <span className="whitespace-nowrap">{row.interviewDate}</span>
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
      {/* 1. Page Header (HRMS) */}
      <PageHeader
        title="HRMS"
        badgeText="Recruitment & Talent Hub"
        subtitle="Manage job descriptions & open positions, talent sourcing intake, interview rounds, and candidate offers."
        breadcrumbs={[{ label: 'Home', link: '/' }, { label: 'HRMS' }]}
        actions={
          activeHrmsTab === 'candidates' ? (
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
                className="inline-flex items-center gap-2 px-3.5 h-9 text-xs font-semibold rounded-xl bg-white border border-[#E5EAF2] hover:bg-[#F7F9FC] text-[#172033] shadow-xs transition-colors cursor-pointer"
                title="Import candidates from CSV"
              >
                <Upload className="w-3.5 h-3.5 text-[#8292AD]" />
                <span>Import</span>
              </button>

              {/* Export CSV Button */}
              <button
                type="button"
                onClick={handleExportCSV}
                className="inline-flex items-center gap-2 px-3.5 h-9 text-xs font-semibold rounded-xl bg-white border border-[#E5EAF2] hover:bg-[#F7F9FC] text-[#172033] shadow-xs transition-colors cursor-pointer"
                title="Export candidate pipeline to CSV"
              >
                <Download className="w-3.5 h-3.5 text-[#8292AD]" />
                <span>Export CSV</span>
              </button>

              {/* Add Candidate Button */}
              <button
                type="button"
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center gap-1.5 px-4 h-9 text-xs font-bold rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white shadow-sm transition-all active:scale-95 shadow-blue-500/20 cursor-pointer"
              >
                <UserPlus className="w-4 h-4 stroke-[2.5]" />
                <span>Add Candidate</span>
              </button>
            </div>
          ) : activeHrmsTab === 'hiring' ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setSourcingPrefillRole(null);
                  setActiveHrmsTab('sourcing');
                  setSourcedCount(hrmsService.getSourcedCandidates().length);
                }}
                className="inline-flex items-center gap-1.5 px-3.5 h-9 text-xs font-bold rounded-xl bg-teal-50 text-[#008080] border border-teal-200 hover:bg-teal-100 transition-colors cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Go to Candidate Sourcing →</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setActiveHrmsTab('candidates');
                }}
                className="inline-flex items-center gap-1.5 px-3.5 h-9 text-xs font-bold rounded-xl bg-blue-50 text-[#2563EB] border border-blue-200 hover:bg-blue-100 transition-colors cursor-pointer"
              >
                <Users className="w-3.5 h-3.5" />
                <span>Go to Active Candidates →</span>
              </button>
            </div>
          )
        }
      />

      {/* 2. HRMS 3-Tab Switcher Bar (Candidates, Hiring/Open Positions, Candidate Sourcing) */}
      <div className="flex items-center gap-2 border-b border-[#E5EAF2] pb-1 overflow-x-auto no-scrollbar">
        {[
          { id: 'candidates', label: 'Candidates', count: candidates.length, icon: Users },
          { id: 'hiring', label: 'Hiring (Open Positions)', count: openPositionsCount, icon: Briefcase },
          { id: 'sourcing', label: 'Candidate Sourcing', count: sourcedCount, icon: UserPlus },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeHrmsTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveHrmsTab(tab.id);
                setOpenPositionsCount(hrmsService.getOpenPositions().length);
                setSourcedCount(hrmsService.getSourcedCandidates().length);
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-[#2563EB] text-white shadow-sm shadow-blue-500/20'
                  : 'bg-white text-[#8292AD] hover:text-[#172033] hover:bg-slate-50 border border-[#E5EAF2]'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-[#8292AD]'}`} />
              <span>{tab.label}</span>
              <span
                className={`text-[9.5px] font-extrabold px-1.5 py-0.2 rounded-full leading-tight ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* 3. TAB 1: CANDIDATES PIPELINE TABLE */}
      {activeHrmsTab === 'candidates' && (
        <>
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
      {/* Role Filter Chips (Hiring open positions) */}
      {(() => {
        const roleTags = [
          { label: 'All Roles', value: 'All' },
          { label: 'SEO Manager', value: 'SEO Manager' },
          { label: 'SME, BPO', value: 'BPO' },
          { label: 'Web Design', value: 'Web Design' },
          { label: 'App Developer', value: 'App Developer' },
          { label: '350 Executive', value: '350 Executive' },
        ];
        return (
          <div className="flex flex-wrap items-center gap-2 px-1">
            {roleTags.map(({ label, value }) => {
              const count = value === 'All'
                ? candidates.length
                : candidates.filter((c) => c.role.toLowerCase().includes(value.toLowerCase())).length;
              const isActive = roleFilter === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setRoleFilter(value)}
                  className={`inline-flex items-center gap-1.5 px-3 h-8 rounded-full text-xs font-semibold border transition-all cursor-pointer whitespace-nowrap active:scale-95 ${
                    isActive
                      ? 'bg-[#2563EB] text-white border-[#2563EB] shadow-sm'
                      : 'bg-white text-[#475569] border-[#E5EAF2] hover:bg-[#EFF6FF] hover:text-[#2563EB] hover:border-[#BFDBFE]'
                  }`}
                >
                  <span>{label}</span>
                  <span className={`inline-flex items-center justify-center min-w-[18px] h-[18px] rounded-full text-[10px] font-bold px-1 ${
                    isActive ? 'bg-white/25 text-white' : 'bg-[#EFF6FF] text-[#2563EB]'
                  }`}>{count}</span>
                </button>
              );
            })}
          </div>
        );
      })()}

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

            {/* Google Meet Link Button (Before Delete button) */}
            <button
              type="button"
              onClick={() => handleSendMeetingLink(row)}
              title={`Send Google Meet interview link to ${row.name}`}
              className="w-7 h-7 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-200 hover:bg-indigo-100 hover:scale-105 flex items-center justify-center transition-all shadow-2xs cursor-pointer"
            >
              <Video className="w-3.5 h-3.5" />
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
        </>
      )}

      {/* 4. TAB 2: HIRING (OPEN POSITIONS & JDs) */}
      {activeHrmsTab === 'hiring' && (
        <HiringPositionsView
          onNavigateToSourcing={(role) => {
            setSourcingPrefillRole(role);
            setActiveHrmsTab('sourcing');
            setSourcedCount(hrmsService.getSourcedCandidates().length);
          }}
        />
      )}

      {/* 5. TAB 3: CANDIDATE SOURCING INTAKE */}
      {activeHrmsTab === 'sourcing' && (
        <CandidateSourcingView
          prefillRole={sourcingPrefillRole}
          onCandidateApproved={(newCand) => {
            setCandidates(candidateService.getCandidates());
            setOpenPositionsCount(hrmsService.getOpenPositions().length);
            setSourcedCount(hrmsService.getSourcedCandidates().length);
            setActiveHrmsTab('candidates');
            if (newCand) {
              setSelectedCandidate(newCand);
            }
          }}
        />
      )}

      {/* Add Candidate Modal */}
      {showAddModal && (
        <Modal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          title="Add New Job Candidate"
          subtitle="Record candidate contact info, salary expectations, recruiter and interview rounds"
          maxWidth="max-w-3xl"
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
                <label className="block text-xs font-bold text-[#172033] mb-1.5 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#2563EB]" />
                    <span>Interview Schedule (Date & Time)</span>
                  </span>
                  <span className="text-[11px] font-semibold text-[#2563EB]">
                    {newInterviewDate || formatDateTimeParts(newInterviewDateVal, newInterviewTimeVal)}
                  </span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="date"
                    value={newInterviewDateVal}
                    onChange={(e) => {
                      const val = e.target.value;
                      setNewInterviewDateVal(val);
                      setNewInterviewDate(formatDateTimeParts(val, newInterviewTimeVal));
                    }}
                    onClick={(e) => e.target.showPicker?.()}
                    className="w-full px-2.5 py-2 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 bg-white font-medium text-[#172033] cursor-pointer"
                  />
                  <input
                    type="time"
                    value={newInterviewTimeVal}
                    onChange={(e) => {
                      const val = e.target.value;
                      setNewInterviewTimeVal(val);
                      setNewInterviewDate(formatDateTimeParts(newInterviewDateVal, val));
                    }}
                    onClick={(e) => e.target.showPicker?.()}
                    className="w-full px-2.5 py-2 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 bg-white font-medium text-[#172033] cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Multi-round interview setup for new candidate */}
            <div className="space-y-3 p-3.5 rounded-xl border border-[#E5EAF2] bg-[#F8FAFC]">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-[#172033] uppercase tracking-wider flex items-center gap-2">
                    <span>Interview Rounds</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-[#2563EB]">
                      {newRounds.length} {newRounds.length === 1 ? 'Round' : 'Rounds'}
                    </span>
                  </h4>
                  <p className="text-[11px] text-[#8292AD] mt-0.5">
                    Configure rounds (e.g. 1st HR, 2nd Vivek Sir, 3rd Someone, Final Bhupender Singh)
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddNewRoundItem}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-[#2563EB] hover:bg-blue-700 text-white cursor-pointer shadow-2xs transition-colors"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Add Round</span>
                </button>
              </div>

              <div className="space-y-2.5">
                {newRounds.map((rnd, idx) => (
                  <div
                    key={rnd.id || idx}
                    className="p-3 bg-white rounded-xl border border-[#E5EAF2] shadow-2xs space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-[#172033] border border-slate-200">
                        Round {idx + 1} {idx === newRounds.length - 1 && newRounds.length > 1 ? '(Final)' : ''}
                      </span>
                      {newRounds.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveNewRoundItem(idx)}
                          className="text-rose-500 hover:text-rose-700 p-1 rounded hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Remove round"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
                      <div>
                        <label className="block text-[10px] font-bold text-[#8292AD] uppercase tracking-wider mb-1">
                          Round Name
                        </label>
                        <input
                          type="text"
                          value={rnd.round}
                          onChange={(e) => handleUpdateNewRoundItem(idx, 'round', e.target.value)}
                          placeholder="e.g. HR Screening, Technical Round"
                          className="w-full px-2.5 py-1.5 text-xs border border-[#E5EAF2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 font-semibold"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-[#8292AD] uppercase tracking-wider mb-1">
                          Interviewer
                        </label>
                        <select
                          value={rnd.interviewer}
                          onChange={(e) => handleUpdateNewRoundItem(idx, 'interviewer', e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs border border-[#E5EAF2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 bg-white font-medium cursor-pointer"
                        >
                          {interviewerOptions.map((name) => (
                            <option key={name} value={name}>
                              {name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-[#8292AD] uppercase tracking-wider mb-1 flex items-center gap-1">
                          <Calendar className="w-2.5 h-2.5 text-[#2563EB]" />
                          <span>Date</span>
                        </label>
                        <input
                          type="date"
                          value={rnd.interviewDate || parseDateTimeParts(rnd.interviewAt).date}
                          onChange={(e) => handleUpdateNewRoundItem(idx, 'interviewDate', e.target.value)}
                          onClick={(e) => e.target.showPicker?.()}
                          className="w-full px-2 py-1.5 text-xs border border-[#E5EAF2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 bg-white font-medium cursor-pointer"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-[#8292AD] uppercase tracking-wider mb-1 flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5 text-[#2563EB]" />
                          <span>Time</span>
                        </label>
                        <input
                          type="time"
                          value={rnd.interviewTime || parseDateTimeParts(rnd.interviewAt).time}
                          onChange={(e) => handleUpdateNewRoundItem(idx, 'interviewTime', e.target.value)}
                          onClick={(e) => e.target.showPicker?.()}
                          className="w-full px-2 py-1.5 text-xs border border-[#E5EAF2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 bg-white font-medium cursor-pointer"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-[#8292AD] uppercase tracking-wider mb-1">
                          Status
                        </label>
                        <select
                          value={rnd.status}
                          onChange={(e) => handleUpdateNewRoundItem(idx, 'status', e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs border border-[#E5EAF2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 bg-white font-medium cursor-pointer"
                        >
                          <option value="Scheduled">Scheduled</option>
                          <option value="Pending">Pending</option>
                          <option value="Passed">Passed</option>
                          <option value="Failed">Failed</option>
                          <option value="Completed">Completed</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
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
                <label className="block text-xs font-bold text-[#172033] mb-1.5 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#2563EB]" />
                    <span>Interview Schedule (Date & Time)</span>
                  </span>
                  <span className="text-[11px] font-semibold text-[#2563EB]">
                    {editInterviewDate || formatDateTimeParts(editInterviewDateVal, editInterviewTimeVal)}
                  </span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="date"
                    value={editInterviewDateVal}
                    onChange={(e) => {
                      const val = e.target.value;
                      setEditInterviewDateVal(val);
                      setEditInterviewDate(formatDateTimeParts(val, editInterviewTimeVal));
                    }}
                    onClick={(e) => e.target.showPicker?.()}
                    className="w-full px-2.5 py-2 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 bg-white font-medium text-[#172033] cursor-pointer"
                  />
                  <input
                    type="time"
                    value={editInterviewTimeVal}
                    onChange={(e) => {
                      const val = e.target.value;
                      setEditInterviewTimeVal(val);
                      setEditInterviewDate(formatDateTimeParts(editInterviewDateVal, val));
                    }}
                    onClick={(e) => e.target.showPicker?.()}
                    className="w-full px-2.5 py-2 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 bg-white font-medium text-[#172033] cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* 8. Dynamic Interview Rounds (e.g. 1st HR, 2nd Vivek Sir, 3rd Someone, Final Bhupender Singh) */}
            <div className="space-y-3 p-3.5 rounded-xl border border-[#E5EAF2] bg-[#F8FAFC]">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-[#172033] uppercase tracking-wider flex items-center gap-2">
                    <span>Interview Rounds</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-[#2563EB]">
                      {editRounds.length} {editRounds.length === 1 ? 'Round' : 'Rounds'}
                    </span>
                  </h4>
                  <p className="text-[11px] text-[#8292AD] mt-0.5">
                    Configure rounds (e.g. 1st HR, 2nd Vivek Sir, 3rd Someone, Final Bhupender Singh)
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddEditRound}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-[#2563EB] hover:bg-blue-700 text-white cursor-pointer shadow-2xs transition-colors"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Add Round</span>
                </button>
              </div>

              <div className="space-y-2.5">
                {editRounds.map((rnd, idx) => (
                  <div
                    key={rnd.id || idx}
                    className="p-3 bg-white rounded-xl border border-[#E5EAF2] shadow-2xs space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-[#172033] border border-slate-200">
                        Round {idx + 1} {idx === editRounds.length - 1 && editRounds.length > 1 ? '(Final)' : ''}
                      </span>
                      {editRounds.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveEditRound(idx)}
                          className="text-rose-500 hover:text-rose-700 p-1 rounded hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Remove round"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
                      <div>
                        <label className="block text-[10px] font-bold text-[#8292AD] uppercase tracking-wider mb-1">
                          Round Name
                        </label>
                        <input
                          type="text"
                          value={rnd.round}
                          onChange={(e) => handleUpdateEditRound(idx, 'round', e.target.value)}
                          placeholder="e.g. HR Round, Technical Round"
                          className="w-full px-2.5 py-1.5 text-xs border border-[#E5EAF2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 font-semibold"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-[#8292AD] uppercase tracking-wider mb-1">
                          Interviewer
                        </label>
                        <select
                          value={rnd.interviewer}
                          onChange={(e) => handleUpdateEditRound(idx, 'interviewer', e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs border border-[#E5EAF2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 bg-white font-medium cursor-pointer"
                        >
                          {interviewerOptions.map((name) => (
                            <option key={name} value={name}>
                              {name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-[#8292AD] uppercase tracking-wider mb-1 flex items-center gap-1">
                          <Calendar className="w-2.5 h-2.5 text-[#2563EB]" />
                          <span>Date</span>
                        </label>
                        <input
                          type="date"
                          value={rnd.interviewDate || parseDateTimeParts(rnd.interviewAt).date}
                          onChange={(e) => handleUpdateEditRound(idx, 'interviewDate', e.target.value)}
                          onClick={(e) => e.target.showPicker?.()}
                          className="w-full px-2 py-1.5 text-xs border border-[#E5EAF2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 bg-white font-medium cursor-pointer"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-[#8292AD] uppercase tracking-wider mb-1 flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5 text-[#2563EB]" />
                          <span>Time</span>
                        </label>
                        <input
                          type="time"
                          value={rnd.interviewTime || parseDateTimeParts(rnd.interviewAt).time}
                          onChange={(e) => handleUpdateEditRound(idx, 'interviewTime', e.target.value)}
                          onClick={(e) => e.target.showPicker?.()}
                          className="w-full px-2 py-1.5 text-xs border border-[#E5EAF2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 bg-white font-medium cursor-pointer"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-[#8292AD] uppercase tracking-wider mb-1">
                          Status
                        </label>
                        <select
                          value={rnd.status}
                          onChange={(e) => handleUpdateEditRound(idx, 'status', e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs border border-[#E5EAF2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 bg-white font-medium cursor-pointer"
                        >
                          <option value="Scheduled">Scheduled</option>
                          <option value="Pending">Pending</option>
                          <option value="Passed">Passed</option>
                          <option value="Failed">Failed</option>
                          <option value="Completed">Completed</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
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

      {/* Google Meet Link Modal */}
      {meetingCandidate && (
        <Modal
          isOpen={!!meetingCandidate}
          onClose={() => setMeetingCandidate(null)}
          title="Send Google Meet Interview Link"
          subtitle={`Candidate: ${meetingCandidate.name} (${meetingCandidate.role})`}
          maxWidth="max-w-lg"
          zIndex="z-50"
        >
          <div className="space-y-4">
            <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                  <Video className="w-4 h-4 text-[#2563EB]" />
                  <span>Google Meet Video Interview</span>
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                  Active Link
                </span>
              </div>
              <div className="text-xs text-[#4E5D78]">
                Interview link for <strong className="text-[#172033]">{meetingCandidate.name}</strong> ({meetingCandidate.email}) with interviewer <strong className="text-[#172033]">{meetingCandidate.interviewer || 'Interviewer'}</strong>.
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#172033] mb-1.5">
                Google Meet URL
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={generateMeetLink(meetingCandidate, meetingCandidate.round)}
                  className="w-full px-3 py-2 text-xs border border-[#E5EAF2] rounded-xl bg-[#F8FAFC] font-semibold text-[#172033] select-all"
                />
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard?.writeText(generateMeetLink(meetingCandidate, meetingCandidate.round));
                    setCopiedMeetLink(true);
                    addToast({
                      title: 'Copied',
                      message: 'Google Meet link copied to clipboard.',
                      type: 'info',
                    });
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl bg-white border border-[#E5EAF2] hover:bg-[#F8FAFC] text-[#172033] cursor-pointer shadow-2xs whitespace-nowrap"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedMeetLink ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-[#F8FAFC] border border-[#E5EAF2] text-xs">
              <div>
                <span className="text-[#8292AD] text-[11px] block">Scheduled Time</span>
                <span className="font-bold text-[#172033]">
                  {meetingCandidate.interviewDate || 'Pending Schedule'}
                </span>
              </div>
              <div>
                <span className="text-[#8292AD] text-[11px] block">Current Round</span>
                <span className="font-bold text-[#172033]">
                  {meetingCandidate.round || 'Technical Round'}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[#E5EAF2]">
              <a
                href={generateMeetLink(meetingCandidate, meetingCandidate.round)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2563EB] hover:underline"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Join Meeting Now</span>
              </a>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setMeetingCandidate(null)}
                  className="px-4 py-2 text-xs font-medium rounded-xl border border-[#E5EAF2] text-[#8292AD] hover:bg-[#F7F9FC] cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    addToast({
                      title: 'Invitation Sent',
                      message: `Google Meet invite emailed to ${meetingCandidate.email}.`,
                      type: 'success',
                    });
                    setMeetingCandidate(null);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white cursor-pointer shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Invite Email</span>
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Quick Add / Edit Round Modal (Opens from View Candidate popup) */}
      {showRoundModal && (
        <Modal
          isOpen={showRoundModal}
          onClose={() => setShowRoundModal(false)}
          title={roundModalIndex !== null ? 'Edit Interview Round' : 'Add New Interview Round'}
          subtitle={
            selectedCandidate
              ? `Candidate: ${selectedCandidate.name} (Round ${roundModalIndex !== null
                ? roundModalIndex + 1
                : (selectedCandidate.rounds?.length || 0) + 1
              })`
              : 'Configure interview schedule'
          }
          maxWidth="max-w-md"
          zIndex="z-50"
        >
          <form onSubmit={handleSaveRoundModal} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#172033] mb-1.5">
                Round Title / Name *
              </label>
              <input
                type="text"
                required
                value={roundModalName}
                onChange={(e) => setRoundModalName(e.target.value)}
                placeholder="e.g. HR Screening, Technical Round 1, Final Round"
                className="w-full px-3.5 py-2 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 font-semibold"
              />
              <div className="flex flex-wrap gap-1.5 mt-2">
                {['HR Screening', 'Technical Round 1', 'Technical Round 2', 'Final Round'].map(
                  (rName) => (
                    <button
                      key={rName}
                      type="button"
                      onClick={() => setRoundModalName(rName)}
                      className={`text-[11px] px-2 py-0.5 rounded-md border transition-colors cursor-pointer ${roundModalName === rName
                        ? 'bg-[#2563EB] text-white border-[#2563EB]'
                        : 'bg-slate-50 text-[#4E5D78] border-[#E5EAF2] hover:bg-slate-100'
                        }`}
                    >
                      {rName}
                    </button>
                  )
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#172033] mb-1.5 flex items-center justify-between">
                <span>Interviewer Name *</span>
                <span className="text-[11px] font-semibold text-[#2563EB]">All Users Dropdown</span>
              </label>
              <select
                value={roundModalInterviewer}
                onChange={(e) => setRoundModalInterviewer(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 bg-white font-semibold text-[#172033] cursor-pointer shadow-2xs"
              >
                {interviewerOptions.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {['HR', 'Vivek Sir', 'Someone', 'Bhupender Singh'].map((interviewer) => (
                  <button
                    key={interviewer}
                    type="button"
                    onClick={() => setRoundModalInterviewer(interviewer)}
                    className={`text-[11px] px-2 py-0.5 rounded-md border transition-colors cursor-pointer ${
                      roundModalInterviewer === interviewer || roundModalInterviewer.includes(interviewer)
                        ? 'bg-[#2563EB] text-white border-[#2563EB]'
                        : 'bg-slate-50 text-[#4E5D78] border-[#E5EAF2] hover:bg-slate-100'
                    }`}
                  >
                    {interviewer}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#172033] mb-1.5 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#2563EB]" />
                  <span>Interview Date *</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    required
                    value={roundModalDate}
                    onChange={(e) => setRoundModalDate(e.target.value)}
                    onClick={(e) => e.target.showPicker?.()}
                    className="w-full px-3 py-2 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 bg-white font-semibold text-[#172033] cursor-pointer shadow-2xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#172033] mb-1.5 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#2563EB]" />
                  <span>Interview Time *</span>
                </label>
                <div className="relative">
                  <input
                    type="time"
                    required
                    value={roundModalTime}
                    onChange={(e) => setRoundModalTime(e.target.value)}
                    onClick={(e) => e.target.showPicker?.()}
                    className="w-full px-3 py-2 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 bg-white font-semibold text-[#172033] cursor-pointer shadow-2xs"
                  />
                </div>
              </div>
            </div>

            {/* Live Schedule Preview */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-blue-50/70 border border-blue-100 text-xs">
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-[#2563EB] flex-shrink-0" />
                <span className="text-[#1E40AF] font-medium">Scheduled:</span>
                <span className="font-bold text-[#1D4ED8]">
                  {formatDateTimeParts(roundModalDate, roundModalTime)}
                </span>
              </div>
              <span className="text-[10px] text-blue-600 font-semibold bg-blue-100/70 px-2 py-0.5 rounded-md">
                Live Preview
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#172033] mb-1.5">
                Round Status
              </label>
              <select
                value={roundModalStatus}
                onChange={(e) => setRoundModalStatus(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-[#E5EAF2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 bg-white font-semibold cursor-pointer"
              >
                <option value="Scheduled">Scheduled</option>
                <option value="Pending">Pending</option>
                <option value="Passed">Passed</option>
                <option value="Failed">Failed</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#E5EAF2]">
              <button
                type="button"
                onClick={() => setShowRoundModal(false)}
                className="px-4 py-2 text-xs font-medium rounded-xl border border-[#E5EAF2] text-[#8292AD] hover:bg-[#F7F9FC] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold rounded-xl bg-[#2563EB] text-white hover:bg-blue-700 shadow-sm cursor-pointer"
              >
                {roundModalIndex !== null ? 'Save Changes' : 'Add Round'}
              </button>
            </div>
          </form>
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

                {/* Edit, Meet Link & Delete Action Buttons */}
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
                    onClick={() => handleSendMeetingLink(selectedCandidate)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors cursor-pointer shadow-2xs"
                    title="Generate and send Google Meet link"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Meet Link</span>
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
                  onClick={handleOpenAddRound}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-teal-600 hover:bg-teal-700 text-white cursor-pointer shadow-2xs transition-colors"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>New Round</span>
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
                      selectedCandidate.rounds.map((rnd, idx) => {
                        const statusBadgeClass =
                          rnd.status === 'Passed'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : rnd.status === 'Failed'
                              ? 'bg-rose-50 text-rose-700 border-rose-200'
                              : rnd.status === 'Scheduled'
                                ? 'bg-blue-50 text-blue-700 border-blue-200'
                                : rnd.status === 'Completed'
                                  ? 'bg-purple-50 text-purple-700 border-purple-200'
                                  : 'bg-amber-50 text-amber-700 border-amber-200';

                        return (
                          <tr key={rnd.id || idx} className="hover:bg-[#F8FAFC]">
                            <td className="px-3.5 py-2 font-medium text-[#172033]">{rnd.interviewer}</td>
                            <td className="px-3.5 py-2 text-[#4E5D78]">{rnd.interviewAt}</td>
                            <td className="px-3.5 py-2 font-semibold text-[#172033]">{rnd.round}</td>
                            <td className="px-3.5 py-2">
                              <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold border ${statusBadgeClass}`}>
                                {rnd.status}
                              </span>
                            </td>
                            <td className="px-3.5 py-2 text-[#8292AD]">{rnd.lastUpdated || 'Today'}</td>
                            <td className="px-3.5 py-2 text-right">
                              <div className="inline-flex items-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => handleOpenEditRound(rnd, idx)}
                                  className="p-1 rounded hover:bg-slate-100 text-teal-600 cursor-pointer"
                                  title="Edit round"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleSendMeetingLink(selectedCandidate, rnd)}
                                  className="p-1 rounded hover:bg-slate-100 text-indigo-600 cursor-pointer"
                                  title="Send Google Meet link"
                                >
                                  <Video className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteRound(idx)}
                                  className="p-1 rounded hover:bg-slate-100 text-rose-500 cursor-pointer"
                                  title="Delete round"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
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
                              onClick={() =>
                                handleOpenEditRound(
                                  {
                                    round: selectedCandidate.round || 'Technical Round',
                                    interviewer: selectedCandidate.interviewer || 'Bhupinderjit Singh',
                                    interviewAt: selectedCandidate.interviewDate || '04-Nov-26 02:30 PM',
                                    status: selectedCandidate.roundStatus || 'Pending',
                                  },
                                  0
                                )
                              }
                              className="p-1 rounded hover:bg-slate-100 text-teal-600 cursor-pointer"
                              title="Edit round"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleSendMeetingLink(selectedCandidate)}
                              className="p-1 rounded hover:bg-slate-100 text-indigo-600 cursor-pointer"
                              title="Send Google Meet link"
                            >
                              <Video className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteRound(0)}
                              className="p-1 rounded hover:bg-slate-100 text-rose-500 cursor-pointer"
                              title="Delete round"
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
