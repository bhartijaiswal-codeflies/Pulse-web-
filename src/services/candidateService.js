import { candidatesData } from '../data/mockData';

const CANDIDATES_KEY = 'pulse_candidates_v2';

export const candidateService = {
  getCandidates: () => {
    const saved = localStorage.getItem(CANDIDATES_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].ctc) {
          return parsed;
        }
      } catch (e) {
        console.error(e);
      }
    }
    localStorage.setItem(CANDIDATES_KEY, JSON.stringify(candidatesData));
    return candidatesData;
  },

  addCandidate: (candidate) => {
    const current = candidateService.getCandidates();
    const newCand = {
      ...candidate,
      id: `CAND-0${current.length + 1}`,
      avatar: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 100000000)}?auto=format&fit=crop&w=150&q=80`,
      ctc: candidate.ctc || '$110,000',
      ectc: candidate.ectc || '$135,000',
      recruiter: candidate.recruiter || candidate.interviewer || 'Saurabh H.',
      rating: candidate.rating || '4.5/5.0',
      stage: candidate.stage || 'Under Review',
    };
    const updated = [newCand, ...current];
    localStorage.setItem(CANDIDATES_KEY, JSON.stringify(updated));
    return newCand;
  },

  importCandidates: (newItems) => {
    const current = candidateService.getCandidates();
    const formatted = newItems.map((item, idx) => ({
      id: `CAND-0${current.length + idx + 1}`,
      avatar: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 100000000)}?auto=format&fit=crop&w=150&q=80`,
      name: item.name || 'Candidate',
      email: item.email || 'candidate@example.com',
      phone: item.phone || '+1 (555) 000-0000',
      role: item.role || 'Software Engineer',
      department: item.department || 'Engineering',
      experience: item.experience || '3 years',
      ctc: item.ctc || '$95,000',
      ectc: item.ectc || '$120,000',
      stage: item.stage || 'Under Review',
      interviewDate: item.interviewDate || 'Pending Schedule',
      interviewer: item.recruiter || 'Saurabh H.',
      recruiter: item.recruiter || 'Saurabh H.',
      resumeUrl: '#',
    }));
    const updated = [...formatted, ...current];
    localStorage.setItem(CANDIDATES_KEY, JSON.stringify(updated));
    return updated;
  },

  updateCandidateStage: (id, stage) => {
    const current = candidateService.getCandidates();
    const updated = current.map((c) => (c.id === id ? { ...c, stage } : c));
    localStorage.setItem(CANDIDATES_KEY, JSON.stringify(updated));
    return updated;
  },
};

