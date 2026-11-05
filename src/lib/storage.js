import { STORAGE_KEY } from '../config/site.js';
export const DEFAULT_STATE = { bootSeen: false, visited: [], recon: false, scanned: false, traceRead: false, hintIdx: 0, history: [], opened: [], solved: [], hintsUsed: {}, revealed: false, directUnlocked: false };
export function loadState() {
  try { return { ...DEFAULT_STATE, ...JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') }; }
  catch { return { ...DEFAULT_STATE }; }
}
export function saveState(s) { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); } catch { /* storage unavailable */ } }
// 7 dirs + recon + scan + trace + 3 operations + 2 reports + 1 module + 7 challenges = 23 steps
export function progressOf(s) {
  const n = (p) => (s.opened || []).filter((i) => i.startsWith(p)).length;
  const steps = s.visited.length + (s.recon ? 1 : 0) + (s.scanned ? 1 : 0) + (s.traceRead ? 1 : 0) + Math.min(n('op:'), 3) + Math.min(n('rpt:'), 2) + Math.min(n('mod:'), 1) + Math.min((s.solved || []).length, 7);
  return Math.round((steps / 23) * 100);
}
