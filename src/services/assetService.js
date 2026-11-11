const ASSETS_KEY = 'pulse_assets_directory';
const TICKETS_KEY = 'pulse_asset_tickets';
const REQUESTS_KEY = 'pulse_take_home_requests';

export const initialCodefliesAssets = [
  {
    id: 'AST-1',
    code: 'Asset#1',
    name: 'Macbook Pro Touch Bar 13"',
    details: 'Macbook Pro Touch Bar 13"',
    type: 'Laptop',
    tag: 'CF-MAC-01',
    assignedTo: 'Codeflies',
    status: 'Active',
    condition: 'Excellent',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=150&q=80',
    serial: 'C02FX409MD6T',
    purchaseDate: '12 Jan, 2024',
  },
  {
    id: 'AST-2',
    code: 'Asset#2',
    name: 'Macbook Air 13"',
    details: 'Macbook Air 13"',
    type: 'Laptop',
    tag: 'CF-MAC-02',
    assignedTo: 'Codeflies',
    status: 'Maintenance',
    condition: 'Good',
    image: null,
    serial: 'C02GZ119K8LL',
    purchaseDate: '15 Mar, 2024',
  },
  {
    id: 'AST-3',
    code: 'Asset#3',
    name: 'Macbook Pro Touch Bar 13.3"',
    details: 'Macbook Pro Touch Bar 13.3"',
    type: 'Laptop',
    tag: 'CF-MAC-03',
    assignedTo: 'Neeraj Kumar',
    status: 'Active',
    condition: 'Brand New',
    image: null,
    serial: 'C02DK991PL12',
    purchaseDate: '02 Feb, 2024',
  },
  {
    id: 'AST-4',
    code: 'Asset#4',
    name: 'Macbook Pro Touch Bar 15.4"',
    details: 'Macbook Pro Touch Bar 15.4"',
    type: 'Laptop',
    tag: 'CF-MAC-04',
    assignedTo: 'Harsh Bhardwaj',
    status: 'Active',
    condition: 'Excellent',
    image: null,
    serial: 'C02HB7821MNP',
    purchaseDate: '10 May, 2024',
  },
  {
    id: 'AST-5',
    code: 'Asset#5',
    name: 'Macbook Pro Touch Bar 13.3"',
    details: 'Macbook Pro Touch Bar 13.3"',
    type: 'Laptop',
    tag: 'CF-MAC-05',
    assignedTo: 'Codeflies',
    status: 'Active',
    condition: 'Good',
    image: null,
    serial: 'C02AV99238LK',
    purchaseDate: '22 Jun, 2024',
  },
  {
    id: 'AST-6',
    code: 'Asset#6',
    name: 'Macbook Pro Touch Bar 13.3"',
    details: 'Macbook Pro Touch Bar 13.3"',
    type: 'Laptop',
    tag: 'CF-MAC-06',
    assignedTo: 'Akshat Verma',
    status: 'Active',
    condition: 'Brand New',
    image: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=150&q=80',
    serial: 'C02AV1293KLL',
    purchaseDate: '19 Aug, 2024',
  },
  {
    id: 'AST-7',
    code: 'Asset#7',
    name: 'Macbook Pro Touch Bar 13.3"',
    details: 'Macbook Pro Touch Bar 13.3"',
    type: 'Laptop',
    tag: 'CF-MAC-07',
    assignedTo: 'Manjeet Singh',
    status: 'Active',
    condition: 'Good',
    image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=150&q=80',
    serial: 'C02MS88299LK',
    purchaseDate: '11 Oct, 2024',
  },
  {
    id: 'AST-8',
    code: 'Asset#8',
    name: 'Macbook Pro Touch Bar 16"',
    details: 'Macbook Pro Touch Bar 16"',
    type: 'Laptop',
    tag: 'CF-MAC-08',
    assignedTo: 'Anmol Gupta',
    status: 'Active',
    condition: 'Excellent',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=150&q=80',
    serial: 'C02AG77199LP',
    purchaseDate: '01 Nov, 2024',
  },
  {
    id: 'AST-9',
    code: 'Asset#9',
    name: 'Macbook Pro Touch Bar 15.4"',
    details: 'Macbook Pro Touch Bar 15.4"',
    type: 'Laptop',
    tag: 'CF-MAC-09',
    assignedTo: 'Varun Sarpal',
    status: 'Active',
    condition: 'Good',
    image: null,
    serial: 'C02VS99112MP',
    purchaseDate: '14 Nov, 2024',
  },
  {
    id: 'AST-10',
    code: 'Asset#18',
    name: 'Macbook Pro Touch Bar 13.3"',
    details: 'Macbook Pro Touch Bar 13.3"',
    type: 'Laptop',
    tag: 'CF-MAC-18',
    assignedTo: 'Devendra kumar',
    status: 'Active',
    condition: 'Good',
    image: null,
    serial: 'C02DK88112LL',
    purchaseDate: '18 Nov, 2024',
  },
  {
    id: 'AST-11',
    code: 'Asset#97',
    name: 'MAC',
    details: 'Mac Charger Cable Not Working',
    type: 'Cable',
    tag: 'CF-C-08',
    assignedTo: 'Ajay Gond',
    status: 'Maintenance',
    condition: 'Fair',
    image: null,
    serial: 'CBL-MAC-08',
    purchaseDate: '05 Jan, 2025',
  },
  {
    id: 'AST-12',
    code: 'Asset#126',
    name: 'MAC - 87W',
    details: 'Mac 87W Power Adapter',
    type: 'Charger',
    tag: 'CF-CH-42',
    assignedTo: 'Chirag Verma',
    status: 'Active',
    condition: 'Good',
    image: null,
    serial: 'CHG-87W-42',
    purchaseDate: '12 Jan, 2025',
  },
  {
    id: 'AST-13',
    code: 'Asset#226',
    name: 'Mouse',
    details: 'Wireless Optical Mouse',
    type: 'Mouse',
    tag: 'CF-M-21',
    assignedTo: 'saurabh pal',
    status: 'Active',
    condition: 'Good',
    image: null,
    serial: 'MOU-CF-21',
    purchaseDate: '20 Jan, 2025',
  },
];

export const initialCodefliesTickets = [
  {
    id: 'TCK-22',
    ticketNo: 'Ticket #22',
    issue: 'Key button issue',
    assetId: 'AST-10',
    assetCode: 'Asset#18',
    assetName: 'Macbook Pro Touch Bar 13.3"',
    assetTag: 'CF-MAC-18',
    assetType: 'Laptop',
    submittedBy: 'Devendra kumar',
    submittedByAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    date: '13/07/2026',
    status: 'Open',
    priority: 'Normal',
    description: 'The space bar and left shift key are frequently sticking or unresponsive during typing.',
  },
  {
    id: 'TCK-21',
    ticketNo: 'Ticket #21',
    issue: 'Auto shutdown',
    assetId: 'AST-7',
    assetCode: 'Asset#195',
    assetName: 'Macbook Pro Touch Bar 13.3"',
    assetTag: 'CF-MAC-33',
    assetType: 'Laptop',
    submittedBy: 'Manjeet Singh',
    submittedByAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    date: '30/06/2026',
    status: 'Open',
    priority: 'High',
    description: 'Device shuts down abruptly when running Docker containers or reaching 60% battery.',
  },
  {
    id: 'TCK-20',
    ticketNo: 'Ticket #20',
    issue: 'Mac Charger Cable Not Working',
    assetId: 'AST-11',
    assetCode: 'Asset#97',
    assetName: 'MAC',
    assetTag: 'CF-C-08',
    assetType: 'Cable',
    submittedBy: 'Ajay Gond',
    submittedByAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    date: '18/05/2026',
    status: 'Open',
    priority: 'Normal',
    description: 'Type-C charging cable has loose pin and disconnects power intermittently.',
  },
  {
    id: 'TCK-19',
    ticketNo: 'Ticket #19',
    issue: 'overheating, lagging and some keys not working',
    assetId: 'AST-4',
    assetCode: 'Asset#45',
    assetName: 'Macbook Pro Touch Bar 15.4"',
    assetTag: 'CF-MAC-28',
    assetType: 'Laptop',
    submittedBy: 'Kavyansh Shukla',
    submittedByAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80',
    date: '18/05/2026',
    status: 'Open',
    priority: 'High',
    description: 'Extreme thermal throttling during build times and trackpad lagging.',
  },
  {
    id: 'TCK-18',
    ticketNo: 'Ticket #18',
    issue: 'Battery issue',
    assetId: 'AST-3',
    assetCode: 'Asset#22',
    assetName: 'Macbook Pro Touch Bar 13.3"',
    assetTag: 'CF-MAC-22',
    assetType: 'Laptop',
    submittedBy: 'Pankaj Singh',
    submittedByAvatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=150&q=80',
    date: '13/05/2026',
    status: 'Open',
    priority: 'Normal',
    description: 'Battery drains from 100% to 15% in under 1.5 hours without heavy load.',
  },
  {
    id: 'TCK-17',
    ticketNo: 'Ticket #17',
    issue: 'Mac Changing cable issue',
    assetId: 'AST-11',
    assetCode: 'Asset#99',
    assetName: 'MAC',
    assetTag: 'CF-C-10',
    assetType: 'Cable',
    submittedBy: 'Devendra kumar',
    submittedByAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    date: '07/05/2026',
    status: 'Open',
    priority: 'Normal',
    description: 'Charging cable connector overheating when plugged in.',
  },
  {
    id: 'TCK-16',
    ticketNo: 'Ticket #16',
    issue: 'MacBook Performance Issues - Frequent Freezing, Lag, and Unexpected Restarts During Development',
    assetId: 'AST-11',
    assetCode: 'Asset#110',
    assetName: 'MAC',
    assetTag: 'CF-C-21',
    assetType: 'Cable',
    submittedBy: 'Deepak Kumar',
    submittedByAvatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=150&q=80',
    date: '04/05/2026',
    status: 'Open',
    priority: 'Urgent',
    description: 'Kernel panics occurring 3-4 times a day while compiling Vite / React projects.',
  },
  {
    id: 'TCK-15',
    ticketNo: 'Ticket #15',
    issue: 'Touch Display Flickering',
    assetId: 'AST-11',
    assetCode: 'Asset#110',
    assetName: 'MAC',
    assetTag: 'CF-C-21',
    assetType: 'Cable',
    submittedBy: 'Deepak Kumar',
    submittedByAvatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=150&q=80',
    date: '04/05/2026',
    status: 'Open',
    priority: 'Normal',
    description: 'Display backlight flickers intermittently when screen angle is adjusted.',
  },
  {
    id: 'TCK-13',
    ticketNo: 'Ticket #13',
    issue: 'Cable is not working',
    assetId: 'AST-11',
    assetCode: 'Asset#111',
    assetName: 'MAC',
    assetTag: 'CF-C-22',
    assetType: 'Cable',
    submittedBy: 'Deepak Kumar',
    submittedByAvatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=150&q=80',
    date: '02/05/2026',
    status: 'Open',
    priority: 'Normal',
    description: 'Charging cable damaged near adapter jack.',
  },
  {
    id: 'TCK-12',
    ticketNo: 'Ticket #12',
    issue: 'Not Working',
    assetId: 'AST-11',
    assetCode: 'Asset#96',
    assetName: 'MAC',
    assetTag: 'CF-C-07',
    assetType: 'Cable',
    submittedBy: 'Pankaj Singh',
    submittedByAvatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=150&q=80',
    date: '28/04/2026',
    status: 'Open',
    priority: 'Normal',
    description: 'Cable completely dead, no power transmission.',
  },
  {
    id: 'TCK-2',
    ticketNo: 'Ticket #2',
    issue: 'I want to take laptop that home',
    assetId: 'AST-5',
    assetCode: 'Asset#30',
    assetName: 'Dell Latitude 5480',
    assetTag: 'CF-WIN-03',
    assetType: 'Laptop',
    submittedBy: 'Deepak Kumar',
    submittedByAvatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=150&q=80',
    date: '10/01/2026',
    status: 'Resolved',
    priority: 'Normal',
    description: 'Verified asset condition and signed gate pass security release.',
  },
];

export const initialTakeHomeRequests = [
  {
    id: 'REQ-86',
    requestNo: 'Request #86',
    by: 'Kartikey Tripathi',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    assetCode: 'Asset#79',
    assetName: 'Macbook Pro Touch Bar 15"',
    assetTag: 'CF-MAC-29',
    assetType: 'Laptop',
    duration: '19/10/2026 -> 21/10/2026',
    startDate: '2026-10-19',
    endDate: '2026-10-21',
    reason: 'for dusherra',
    status: 'Pending',
  },
  {
    id: 'REQ-85',
    requestNo: 'Request #85',
    by: 'Chirag Verma',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    assetCode: 'Asset#234',
    assetName: 'Mac_Cable',
    assetTag: 'CF-C-37',
    assetType: 'Cable',
    duration: '20/10/2026 -> 20/10/2026',
    startDate: '2026-10-20',
    endDate: '2026-10-20',
    reason: 'Work From Home',
    status: 'Pending',
  },
  {
    id: 'REQ-84',
    requestNo: 'Request #84',
    by: 'Chirag Verma',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    assetCode: 'Asset#125',
    assetName: 'Macbook Pro Touch Bar 16"',
    assetTag: 'CF-MAC-30',
    assetType: 'Laptop',
    duration: '20/10/2026 -> 20/10/2026',
    startDate: '2026-10-20',
    endDate: '2026-10-20',
    reason: 'Work From Home',
    status: 'Pending',
  },
  {
    id: 'REQ-83',
    requestNo: 'Request #83',
    by: 'Chirag Verma',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    assetCode: 'Asset#126',
    assetName: 'MAC - 87W',
    assetTag: 'CF-CH-42',
    assetType: 'Charger',
    duration: '20/10/2026 -> 20/10/2026',
    startDate: '2026-10-20',
    endDate: '2026-10-20',
    reason: 'Work From Home',
    status: 'Pending',
  },
  {
    id: 'REQ-82',
    requestNo: 'Request #82',
    by: 'simran kaur',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    assetCode: 'Asset#120',
    assetName: 'HP',
    assetTag: 'CF-CH-41',
    assetType: 'Charger',
    duration: '19/10/2026 -> 19/10/2026',
    startDate: '2026-10-19',
    endDate: '2026-10-19',
    reason: 'Working from home on T...',
    status: 'Pending',
  },
  {
    id: 'REQ-81',
    requestNo: 'Request #81',
    by: 'simran kaur',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    assetCode: 'Asset#119',
    assetName: 'HP EliteBook 840 G6',
    assetTag: 'CF-WIN-18',
    assetType: 'Laptop',
    duration: '19/10/2026 -> 19/10/2026',
    startDate: '2026-10-19',
    endDate: '2026-10-19',
    reason: 'Working from home on T...',
    status: 'Pending',
  },
  {
    id: 'REQ-80',
    requestNo: 'Request #80',
    by: 'Neeraj Kumar',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80',
    assetCode: 'Asset#229',
    assetName: 'Mac _Portronics_65W',
    assetTag: 'CF-CH-70',
    assetType: 'Charger',
    duration: '20/10/2026 -> 20/10/2026',
    startDate: '2026-10-20',
    endDate: '2026-10-20',
    reason: 'WFH',
    status: 'Pending',
  },
  {
    id: 'REQ-79',
    requestNo: 'Request #79',
    by: 'Neeraj Kumar',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80',
    assetCode: 'Asset#228',
    assetName: 'Mac Cable',
    assetTag: 'CF-C-35',
    assetType: 'Cable',
    duration: '20/10/2026 -> 20/10/2026',
    startDate: '2026-10-20',
    endDate: '2026-10-20',
    reason: 'WFH',
    status: 'Pending',
  },
  {
    id: 'REQ-78',
    requestNo: 'Request #78',
    by: 'Neeraj Kumar',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80',
    assetCode: 'Asset#6',
    assetName: 'Macbook Pro Touch Bar 13.3"',
    assetTag: 'CF-MAC-06',
    assetType: 'Laptop',
    duration: '20/10/2026 -> 20/10/2026',
    startDate: '2026-10-20',
    endDate: '2026-10-20',
    reason: 'WFH',
    status: 'Pending',
  },
  {
    id: 'REQ-77',
    requestNo: 'Request #77',
    by: 'saurabh pal',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    assetCode: 'Asset#225',
    assetName: 'Dell',
    assetTag: 'CF-CH-69',
    assetType: 'Charger',
    duration: '04/09/2026 -> 31/12/2026',
    startDate: '2026-09-04',
    endDate: '2026-12-31',
    reason: 'WFH',
    status: 'Pending',
  },
  {
    id: 'REQ-76',
    requestNo: 'Request #76',
    by: 'saurabh pal',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    assetCode: 'Asset#226',
    assetName: 'Mouse',
    assetTag: 'CF-M-21',
    assetType: 'Mouse',
    duration: '04/09/2026 -> 31/12/2026',
    startDate: '2026-09-04',
    endDate: '2026-12-31',
    reason: 'WFH',
    status: 'Pending',
  },
];

export const assetService = {
  // --- ASSETS CRUD ---
  getAssets: () => {
    const saved = localStorage.getItem(ASSETS_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error(e);
      }
    }
    localStorage.setItem(ASSETS_KEY, JSON.stringify(initialCodefliesAssets));
    return initialCodefliesAssets;
  },

  addAsset: (asset) => {
    const current = assetService.getAssets();
    const count = current.length + 1;
    const newAsset = {
      ...asset,
      id: `AST-${Date.now()}`,
      code: asset.code || `Asset#${count}`,
      name: asset.name,
      details: asset.details || asset.name,
      type: asset.type || 'Laptop',
      tag: asset.tag || `CF-${(asset.type || 'EQP').slice(0, 3).toUpperCase()}-${String(count).padStart(2, '0')}`,
      assignedTo: asset.assignedTo || 'Codeflies',
      status: asset.status || 'Active',
      condition: asset.condition || 'Brand New',
      image: asset.image || null,
      serial: asset.serial || `SER-${Math.floor(100000 + Math.random() * 900000)}`,
      purchaseDate: asset.purchaseDate || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    };
    const updated = [newAsset, ...current];
    localStorage.setItem(ASSETS_KEY, JSON.stringify(updated));
    return newAsset;
  },

  updateAsset: (id, updates) => {
    const current = assetService.getAssets();
    const updated = current.map((a) => (a.id === id ? { ...a, ...updates } : a));
    localStorage.setItem(ASSETS_KEY, JSON.stringify(updated));
    return updated.find((a) => a.id === id);
  },

  deleteAsset: (id) => {
    const current = assetService.getAssets();
    const updated = current.filter((a) => a.id !== id);
    localStorage.setItem(ASSETS_KEY, JSON.stringify(updated));
    return updated;
  },

  // --- SUPPORT TICKETS CRUD ---
  getTickets: () => {
    const saved = localStorage.getItem(TICKETS_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error(e);
      }
    }
    localStorage.setItem(TICKETS_KEY, JSON.stringify(initialCodefliesTickets));
    return initialCodefliesTickets;
  },

  addTicket: (ticket) => {
    const current = assetService.getTickets();
    const nextNum = current.length + 1;
    const newTicket = {
      ...ticket,
      id: `TCK-${Date.now()}`,
      ticketNo: `Ticket #${nextNum}`,
      status: ticket.status || 'Open',
      date: new Date().toLocaleDateString('en-GB'),
    };
    const updated = [newTicket, ...current];
    localStorage.setItem(TICKETS_KEY, JSON.stringify(updated));
    return newTicket;
  },

  updateTicketStatus: (id, newStatus) => {
    const current = assetService.getTickets();
    const updated = current.map((t) => (t.id === id ? { ...t, status: newStatus } : t));
    localStorage.setItem(TICKETS_KEY, JSON.stringify(updated));
    return updated.find((t) => t.id === id);
  },

  deleteTicket: (id) => {
    const current = assetService.getTickets();
    const updated = current.filter((t) => t.id !== id);
    localStorage.setItem(TICKETS_KEY, JSON.stringify(updated));
    return updated;
  },

  // --- TAKE-HOME REQUESTS CRUD ---
  getRequests: () => {
    const saved = localStorage.getItem(REQUESTS_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error(e);
      }
    }
    localStorage.setItem(REQUESTS_KEY, JSON.stringify(initialTakeHomeRequests));
    return initialTakeHomeRequests;
  },

  addRequest: (req) => {
    const current = assetService.getRequests();
    const nextNum = current.length + 80;
    const newReq = {
      ...req,
      id: `REQ-${Date.now()}`,
      requestNo: `Request #${nextNum}`,
      status: req.status || 'Pending',
    };
    const updated = [newReq, ...current];
    localStorage.setItem(REQUESTS_KEY, JSON.stringify(updated));
    return newReq;
  },

  updateRequestStatus: (id, newStatus) => {
    const current = assetService.getRequests();
    const updated = current.map((r) => (r.id === id ? { ...r, status: newStatus } : r));
    localStorage.setItem(REQUESTS_KEY, JSON.stringify(updated));
    return updated.find((r) => r.id === id);
  },

  deleteRequest: (id) => {
    const current = assetService.getRequests();
    const updated = current.filter((r) => r.id !== id);
    localStorage.setItem(REQUESTS_KEY, JSON.stringify(updated));
    return updated;
  },

  // --- OVERVIEW / STATS ---
  getOverviewStats: () => {
    const assets = assetService.getAssets();
    const tickets = assetService.getTickets();
    const requests = assetService.getRequests();

    const openTickets = tickets.filter((t) => t.status === 'Open');
    const pendingRequests = requests.filter((r) => r.status === 'Pending');

    return {
      totalAssets: 234, // or assets.length
      totalAssetsCount: assets.length,
      openTicketsCount: 17, // or openTickets.length
      pendingRequestsCount: 11, // or pendingRequests.length
      recentTickets: tickets.slice(0, 6),
      pendingRequests: pendingRequests.slice(0, 6),
    };
  },
};
