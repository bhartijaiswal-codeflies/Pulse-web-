import { candidatesData } from '../data/mockData';

const CANDIDATES_KEY = 'pulse_candidates';

export const candidateService = {
  getCandidates: () => {
    const saved = localStorage.getItem(CANDIDATES_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
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
      rating: candidate.rating || '4.5/5.0',
      stage: candidate.stage || 'Under Review',
    };
    const updated = [newCand, ...current];
    localStorage.setItem(CANDIDATES_KEY, JSON.stringify(updated));
    return newCand;
  },

  updateCandidateStage: (id, stage) => {
    const current = candidateService.getCandidates();
    const updated = current.map((c) => (c.id === id ? { ...c, stage } : c));
    localStorage.setItem(CANDIDATES_KEY, JSON.stringify(updated));
    return updated;
  },
};
