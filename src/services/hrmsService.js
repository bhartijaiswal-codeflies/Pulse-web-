import { candidateService } from './candidateService';

const POSITIONS_KEY = 'pulse_hrms_open_positions_v1';
const SOURCING_KEY = 'pulse_hrms_sourced_candidates_v1';

// Initial baseline Open Positions matching user requirements
export const initialOpenPositions = [
  {
    id: 'JD-01',
    title: 'SEO Manager',
    department: 'Marketing',
    openings: 3,
    priority: 'Priority 1 (Urgent)',
    priorityLevel: 1,
    experience: '4 - 7 Years',
    salaryRange: '₹7,50,000 - ₹11,00,000 / Yr',
    location: 'Noida / Hybrid',
    type: 'Full Time',
    postedDate: '02 Nov, 2026',
    status: 'Active',
    keySkills: ['Technical SEO', 'SEMrush', 'Core Web Vitals', 'Backlink Outreach', 'GA4 Analytics'],
    description:
      'We are looking for an experienced SEO Manager to lead organic search growth across global web properties. You will formulate comprehensive content strategies, direct high-impact link acquisition, oversee technical website audits, and lead a team of SEO specialists.',
    responsibilities: [
      'Conduct regular deep technical SEO audits, site speed optimization, and crawlability fixes.',
      'Formulate organic keyword cluster strategy aligned with commercial business objectives.',
      'Supervise content production teams to ensure rankable, high-intent landing pages.',
      'Monitor GA4 traffic metrics, conversion paths, and organic attribution reports.',
    ],
    requirements: [
      '4+ years of hands-on experience in competitive SEO and link acquisition.',
      'Expert proficiency with Ahrefs, SEMrush, Screaming Frog, and Google Search Console.',
      'Strong understanding of HTML, CSS, JavaScript rendering, and Schema markup.',
    ],
  },
  {
    id: 'JD-02',
    title: 'Subject Matter Expert (SME)',
    department: 'Engineering',
    openings: 2,
    priority: 'Priority 2 (High)',
    priorityLevel: 2,
    experience: '5 - 8 Years',
    salaryRange: '₹9,00,000 - ₹14,00,000 / Yr',
    location: 'Noida / On-site',
    type: 'Full Time',
    postedDate: '04 Nov, 2026',
    status: 'Active',
    keySkills: ['Domain Architecture', 'Code Review', 'Technical Leadership', 'System Design', 'Mentorship'],
    description:
      'Seeking a Subject Matter Expert (SME) to guide our core product engineering teams. The SME will bridge high-level system requirements with robust software architecture, resolve complex edge cases, and ensure enterprise compliance.',
    responsibilities: [
      'Provide authoritative technical guidance on architecture, scalability, and code standards.',
      'Review complex pull requests and architect resilient microservice integrations.',
      'Conduct technical masterclasses and mentor senior engineers across product pods.',
    ],
    requirements: [
      '5+ years deep technical domain expertise in enterprise web applications.',
      'Demonstrated experience with high-load database schema design and cloud deployments.',
    ],
  },
  {
    id: 'JD-03',
    title: 'Business Development Executive (BDE)',
    department: 'Sales',
    openings: 4,
    priority: 'Priority 3 (Normal)',
    priorityLevel: 3,
    experience: '2 - 4 Years',
    salaryRange: '₹4,50,000 - ₹7,00,000 / Yr + Incentives',
    location: 'Noida / Hybrid',
    type: 'Full Time',
    postedDate: '06 Nov, 2026',
    status: 'Active',
    keySkills: ['B2B Sales', 'Lead Generation', 'Cold Calling', 'Client Pitching', 'CRM Management'],
    description:
      'We are expanding our international business development group. The BDE will generate enterprise leads, run discovery calls, schedule demonstrations with North American and European prospects, and close high-value annual contracts.',
    responsibilities: [
      'Source qualified prospect lists via LinkedIn Sales Navigator, ZoomInfo, and Apollo.',
      'Conduct outbound cold outreach via email sequences, phone calls, and video pitches.',
      'Manage pipeline forecasting and deal progression inside the corporate CRM.',
    ],
    requirements: [
      '2+ years in outbound B2B SaaS or IT services sales.',
      'Exceptional English verbal and written communication skills.',
    ],
  },
  {
    id: 'JD-04',
    title: 'Web Designer (UI/UX)',
    department: 'Web Design',
    openings: 2,
    priority: 'Priority 1 (Urgent)',
    priorityLevel: 1,
    experience: '3 - 5 Years',
    salaryRange: '₹6,00,000 - ₹9,00,000 / Yr',
    location: 'Noida / Hybrid',
    type: 'Full Time',
    postedDate: '08 Nov, 2026',
    status: 'Active',
    keySkills: ['Figma', 'Responsive UI', 'Design Systems', 'Tailwind CSS', 'Prototyping'],
    description:
      'Talented Web Designer wanted to craft high-conversion landing pages, micro-interactions, responsive dashboard interfaces, and modern marketing collaterals.',
    responsibilities: [
      'Build end-to-end design flows, wireframes, and production-ready component libraries in Figma.',
      'Collaborate closely with frontend developers to ensure pixel-perfect CSS implementations.',
      'Conduct usability tests and iterate designs based on live user telemetry.',
    ],
    requirements: [
      'Proven portfolio showcasing responsive web interfaces and design systems.',
      'Mastery of Figma, modern auto-layout, typography, and interactive components.',
    ],
  },
  {
    id: 'JD-05',
    title: 'App Developer (React Native / Flutter)',
    department: 'Engineering',
    openings: 3,
    priority: 'Priority 2 (High)',
    priorityLevel: 2,
    experience: '3 - 6 Years',
    salaryRange: '₹8,00,000 - ₹12,50,000 / Yr',
    location: 'Noida / Remote Available',
    type: 'Full Time',
    postedDate: '10 Nov, 2026',
    status: 'Active',
    keySkills: ['React Native', 'Flutter', 'iOS / Android SDK', 'State Management', 'Offline Sync'],
    description:
      'Seeking a versatile Mobile App Developer to build responsive, cross-platform Android and iOS applications with seamless offline caching, push notifications, and biometric authentication.',
    responsibilities: [
      'Develop cross-platform mobile features in React Native and Flutter with native bridge modules.',
      'Optimize app startup time, bundle size, and 60fps gesture animations.',
      'Manage automated App Store and Google Play deployment workflows.',
    ],
    requirements: [
      '3+ years shipping commercial apps on the Google Play Store and Apple App Store.',
      'Solid command of TypeScript, Redux/Zustand, and REST/WebSocket protocols.',
    ],
  },
  {
    id: 'JD-06',
    title: 'SEO Executive',
    department: 'Marketing',
    openings: 2,
    priority: 'Priority 2 (High)',
    priorityLevel: 2,
    experience: '1 - 3 Years',
    salaryRange: '₹3,50,000 - ₹5,00,000 / Yr',
    location: 'Noida / On-site',
    type: 'Full Time',
    postedDate: '11 Nov, 2026',
    status: 'Active',
    keySkills: ['On-Page SEO', 'Keyword Research', 'Meta Tagging', 'Google Search Console', 'Content Audits'],
    description:
      'Seeking an energetic SEO Executive to execute on-page optimization, meta tagging, internal linking structure, and local business listing citations.',
    responsibilities: [
      'Perform keyword research and search intent mapping for upcoming blog topics.',
      'Audit existing articles for missing alt tags, broken redirects, and header hierarchy.',
      'Coordinate outreach emails for quality digital PR citations and brand mentions.',
    ],
    requirements: [
      '1+ years working hands-on with WordPress, Yoast, and Google Search Console.',
      'Good understanding of search ranking fundamentals and content hygiene.',
    ],
  },
];

// Initial baseline Sourced Candidates matching handwritten notes
export const initialSourcedCandidates = [
  {
    id: 'SRC-01',
    name: 'Kavita Sharma',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
    email: 'kavita.sharma@example.com',
    phone: '+91 98765 43210',
    role: 'SEO Manager',
    department: 'Marketing',
    experience: '5 Years',
    currentCompany: 'GrowthX Media',
    location: 'Noida, UP',
    noticePeriod: '30 Days',
    currentCtc: '₹8,00,000',
    expectedCtc: '₹10,50,000',
    sourceChannel: 'LinkedIn Recruiter',
    sourcedDate: '12 Nov, 2026',
    status: 'Sourced',
    description:
      '5+ years leading organic search initiatives. Successfully increased organic traffic 4x for SaaS clients. Certified in Google Analytics & SEMrush. Strong technical audit skills.',
    resumeUrl: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'SRC-02',
    name: 'Rohan Verma',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    email: 'rohan.v@example.com',
    phone: '+91 98112 34567',
    role: 'SEO Executive',
    department: 'Marketing',
    experience: '2 Years',
    currentCompany: 'Infotech Digital',
    location: 'Delhi NCR',
    noticePeriod: '15 Days',
    currentCtc: '₹3,50,000',
    expectedCtc: '₹4,80,000',
    sourceChannel: 'Referral (Marketing Team)',
    sourcedDate: '12 Nov, 2026',
    status: 'Sourced',
    description:
      'Passionate about technical and on-page optimization. Well versed in Google Search Console, Ahrefs, and Screaming Frog. Ready to join immediately.',
    resumeUrl: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'SRC-03',
    name: 'Pooja Nair',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    email: 'pooja.nair@example.com',
    phone: '+91 99201 88765',
    role: 'Web Designer',
    department: 'Web Design',
    experience: '3.5 Years',
    currentCompany: 'PixelCraft Studio',
    location: 'Gurugram, HR',
    noticePeriod: '45 Days',
    currentCtc: '₹6,00,000',
    expectedCtc: '₹8,50,000',
    sourceChannel: 'Behance Portfolio / Inbound',
    sourcedDate: '11 Nov, 2026',
    status: 'Sourced',
    description:
      'Specializes in responsive landing page design, modern SaaS dashboards, and Tailwind CSS design systems. Live portfolio at poojanair.design with top design awards.',
    resumeUrl: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'SRC-04',
    name: 'Arjun Mehta',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    email: 'arjun.mehta@example.com',
    phone: '+91 97654 32109',
    role: 'App Developer',
    department: 'Engineering',
    experience: '4 Years',
    currentCompany: 'AppMorph Technologies',
    location: 'Noida, UP',
    noticePeriod: '30 Days',
    currentCtc: '₹8,50,000',
    expectedCtc: '₹12,00,000',
    sourceChannel: 'Naukri.com',
    sourcedDate: '10 Nov, 2026',
    status: 'Sourced',
    description:
      'Cross-platform mobile developer with 4 commercial apps on Google Play & App Store. Deep proficiency in React Native, Redux Toolkit, biometric auth, and push notification pipelines.',
    resumeUrl: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'SRC-05',
    name: 'Sneha Sengupta',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    email: 'sneha.s@example.com',
    phone: '+91 98220 11984',
    role: 'BDE',
    department: 'Sales',
    experience: '3 Years',
    currentCompany: 'Vanguard Global',
    location: 'Noida, UP',
    noticePeriod: 'Immediate',
    currentCtc: '₹4,80,000',
    expectedCtc: '₹6,50,000',
    sourceChannel: 'LinkedIn Direct Outreach',
    sourcedDate: '09 Nov, 2026',
    status: 'Approved',
    movedToCandidateId: 'CAND-01',
    description:
      'Proven record of exceeding B2B software sales quota by 130%. Conducts effective discovery calls and negotiates annual contracts with US clients. Promoted to Candidate Pipeline.',
    resumeUrl: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=800&q=80',
  },
];

export const hrmsService = {
  // --- OPEN POSITIONS (HIRING / JDs) ---
  getOpenPositions: () => {
    const saved = localStorage.getItem(POSITIONS_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error('Error parsing open positions:', e);
      }
    }
    localStorage.setItem(POSITIONS_KEY, JSON.stringify(initialOpenPositions));
    return initialOpenPositions;
  },

  addOpenPosition: (position) => {
    const current = hrmsService.getOpenPositions();
    const newPos = {
      ...position,
      id: `JD-0${current.length + 1}`,
      postedDate: 'Today',
      status: position.status || 'Active',
      openings: Number(position.openings) || 1,
      keySkills: Array.isArray(position.keySkills)
        ? position.keySkills
        : String(position.keySkills || '')
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean),
    };
    const updated = [newPos, ...current];
    localStorage.setItem(POSITIONS_KEY, JSON.stringify(updated));
    return newPos;
  },

  updateOpenPosition: (id, updates) => {
    const current = hrmsService.getOpenPositions();
    const updated = current.map((p) => {
      if (p.id === id) {
        return {
          ...p,
          ...updates,
          openings: updates.openings !== undefined ? Number(updates.openings) : p.openings,
        };
      }
      return p;
    });
    localStorage.setItem(POSITIONS_KEY, JSON.stringify(updated));
    return updated;
  },

  deleteOpenPosition: (id) => {
    const current = hrmsService.getOpenPositions();
    const updated = current.filter((p) => p.id !== id);
    localStorage.setItem(POSITIONS_KEY, JSON.stringify(updated));
    return updated;
  },

  // --- CANDIDATE SOURCING ---
  getSourcedCandidates: () => {
    const saved = localStorage.getItem(SOURCING_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error('Error parsing sourced candidates:', e);
      }
    }
    localStorage.setItem(SOURCING_KEY, JSON.stringify(initialSourcedCandidates));
    return initialSourcedCandidates;
  },

  addSourcedCandidate: (candidate) => {
    const current = hrmsService.getSourcedCandidates();
    const newEntry = {
      ...candidate,
      id: `SRC-0${current.length + 1}`,
      avatar:
        candidate.avatar ||
        `https://images.unsplash.com/photo-${1530000000000 + Math.floor(Math.random() * 100000000)}?auto=format&fit=crop&w=150&q=80`,
      sourcedDate: 'Today',
      status: candidate.status || 'Sourced',
    };
    const updated = [newEntry, ...current];
    localStorage.setItem(SOURCING_KEY, JSON.stringify(updated));
    return newEntry;
  },

  updateSourcedCandidate: (id, updates) => {
    const current = hrmsService.getSourcedCandidates();
    const updated = current.map((c) => (c.id === id ? { ...c, ...updates } : c));
    localStorage.setItem(SOURCING_KEY, JSON.stringify(updated));
    return updated;
  },

  deleteSourcedCandidate: (id) => {
    const current = hrmsService.getSourcedCandidates();
    const updated = current.filter((c) => c.id !== id);
    localStorage.setItem(SOURCING_KEY, JSON.stringify(updated));
    return updated;
  },

  // --- WORKFLOW: APPROVE SOURCED CANDIDATE AND MOVE TO CANDIDATE TAB ---
  approveAndMoveToCandidates: (sourcedId) => {
    const sourcedList = hrmsService.getSourcedCandidates();
    const target = sourcedList.find((c) => c.id === sourcedId);
    if (!target) return null;

    // 1. Add to active candidate service pipeline
    const candidateData = {
      name: target.name,
      avatar: target.avatar,
      email: target.email,
      phone: target.phone,
      role: target.role,
      department: target.department || 'Operations',
      experience: target.experience,
      relevantExperience: target.experience,
      noticePeriod: target.noticePeriod || '30 Days',
      ctc: target.currentCtc || '75,000',
      ectc: target.expectedCtc || '95,000',
      stage: 'Under Review',
      round: 'HR Screening',
      roundStatus: 'Pending',
      recruiter: 'Saurabh H.',
      reasonForChange: 'Sourced from ' + (target.sourceChannel || 'Talent Pool'),
      comments: [
        {
          id: `COMM-${Date.now()}`,
          author: 'HR Recruiter',
          text: `Candidate approved from Sourcing Intake: ${target.description || 'Verified credentials and qualifications.'}`,
          date: 'Just now',
        },
      ],
      rounds: [
        {
          id: 'R1',
          roundNumber: 1,
          roundName: 'HR Screening',
          interviewer: 'HR (Komal Thapliyal)',
          interviewAt: 'Scheduled soon',
          status: 'Pending',
          feedback: 'Sourced profile approved for screening interview.',
          updatedAt: 'Just now',
        },
      ],
    };

    const newCandidate = candidateService.addCandidate(candidateData);

    // 2. Mark sourced candidate as Approved
    const updatedSourcedList = sourcedList.map((c) => {
      if (c.id === sourcedId) {
        return {
          ...c,
          status: 'Approved',
          movedToCandidateId: newCandidate.id,
          approvedAt: 'Today',
        };
      }
      return c;
    });

    localStorage.setItem(SOURCING_KEY, JSON.stringify(updatedSourcedList));

    return {
      newCandidate,
      updatedSourced: updatedSourcedList.find((c) => c.id === sourcedId),
    };
  },
};
