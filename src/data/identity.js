// Dossier fields unlock at investigation-progress thresholds. `final` unlocks in Stage 3.
export const DOSSIER = [
  { key: 'Name', value: 'Anu Fazil P', unlockAt: 'final' },
  { key: 'Alias', value: 'ZEYDAC', unlockAt: 0 },
  { key: 'Location', value: 'Kerala, India', unlockAt: 25 },
  { key: 'Education', value: 'Computer Science, KMCT College of Engineering (KTU)', unlockAt: 45 },
  { key: 'Specialization', value: 'Cybersecurity: SOC operations, threat analysis, secure web development', unlockAt: 65 },
  { key: 'Current Mission', value: 'TechByHeart cybersecurity diploma program', unlockAt: 85 },
];
// Finishing the final investigation unlocks the complete dossier.
export const isUnlocked = (f, progress, finalDone = false) => finalDone || (f.unlockAt !== 'final' && progress >= f.unlockAt);
