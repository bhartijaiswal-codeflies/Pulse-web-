import { candidatesData } from '../data/mockData';

const CANDIDATES_KEY = 'pulse_candidates_v3';

const cleanSalary = (val, fallback = '110,000') => {
  if (!val) return fallback;
  return String(val).replace(/^\$/, '').trim();
};

export const candidateService = {
  getCandidates: () => {
    const saved = localStorage.getItem(CANDIDATES_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((c) => ({
            ...c,
            ctc: cleanSalary(c.ctc, '110,000'),
            ectc: cleanSalary(c.ectc, '135,000'),
          }));
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
      avatar:
        candidate.avatar ||
        `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 100000000)}?auto=format&fit=crop&w=150&q=80`,
      ctc: cleanSalary(candidate.ctc, '110,000'),
      ectc: cleanSalary(candidate.ectc, '135,000'),
      recruiter: candidate.recruiter || candidate.interviewer || 'Saurabh H.',
      rating: candidate.rating || '4.5/5.0',
      stage: candidate.stage || 'Under Review',
      relevantExperience: candidate.relevantExperience || candidate.experience || '3 years',
      noticePeriod: candidate.noticePeriod || '30 Days',
      reasonForChange: candidate.reasonForChange || 'Career Growth',
      round: candidate.round || 'Technical Round',
      roundStatus: candidate.roundStatus || 'Pending',
      addedOn: candidate.addedOn || 'Today',
      updatedOn: candidate.updatedOn || 'Today',
      rounds: candidate.rounds || [],
      comments: candidate.comments || [],
      offer: candidate.offer || '',
    };
    const updated = [newCand, ...current];
    localStorage.setItem(CANDIDATES_KEY, JSON.stringify(updated));
    return newCand;
  },

  updateCandidate: (id, updatedFields) => {
    const current = candidateService.getCandidates();
    const updated = current.map((c) => {
      if (c.id === id) {
        return {
          ...c,
          ...updatedFields,
          ctc: cleanSalary(updatedFields.ctc !== undefined ? updatedFields.ctc : c.ctc),
          ectc: cleanSalary(updatedFields.ectc !== undefined ? updatedFields.ectc : c.ectc),
          updatedOn: 'Today',
        };
      }
      return c;
    });
    localStorage.setItem(CANDIDATES_KEY, JSON.stringify(updated));
    return updated;
  },

  deleteCandidate: (id) => {
    const current = candidateService.getCandidates();
    const updated = current.filter((c) => c.id !== id);
    localStorage.setItem(CANDIDATES_KEY, JSON.stringify(updated));
    return updated;
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
      relevantExperience: item.relevantExperience || item.experience || '3 years',
      noticePeriod: item.noticePeriod || '30 Days',
      reasonForChange: item.reasonForChange || 'Career Growth',
      ctc: cleanSalary(item.ctc, '95,000'),
      ectc: cleanSalary(item.ectc, '120,000'),
      stage: item.stage || 'Under Review',
      interviewDate: item.interviewDate || 'Pending Schedule',
      interviewer: item.recruiter || 'Saurabh H.',
      recruiter: item.recruiter || 'Saurabh H.',
      resumeUrl: '#',
      rounds: [],
      comments: [],
      offer: '',
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

