import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import StatusBar from './StatusBar.jsx';
import Explorer from './Explorer.jsx';
import Workspace from './Workspace.jsx';
import Terminal from './Terminal.jsx';
import useFocusTrap from '../lib/useFocusTrap.js';
import RevealOverlay from './RevealOverlay.jsx';
import { SITE } from '../config/site.js';
import { execute } from '../lib/terminal.js';
import { isPanelDir } from '../data/filesystem.js';
import { progressOf } from '../lib/storage.js';

const WELCOME = [
  { kind: 'ok', text: `${SITE.name} // SECURE ARCHIVE  ::  NODE_001` },
  { kind: 'out', text: 'Identity: CLASSIFIED. Type `help` to begin.' },
  { kind: 'out', text: '' },
];

export default function Console({ state, setState, onExit, onDirect }) {
  const [cwd, setCwd] = useState('/');
  const [view, setView] = useState({ type: 'home' });
  const [lines, setLines] = useState(WELCOME);
  const [drawer, setDrawer] = useState(false);
  const [termOpen, setTermOpen] = useState(true);
  const [reveal, setReveal] = useState(false);
  const drawerRef = useRef(null);
  const closeDrawer = useCallback(() => setDrawer(false), []);
  useFocusTrap(drawerRef, drawer, closeDrawer);
  const [note, setNote] = useState('');
  useEffect(() => { setNote(view.type === 'panel' || view.type === 'dir' ? `Opened ${view.path}` : view.type === 'home' ? 'Archive index' : `Opened ${view.type}`); }, [view]);
  const solve = (id) => {
    setState((s) => (s.solved.includes(id) ? s : { ...s, solved: [...s.solved, id], revealed: s.revealed || id === 'c7' }));
    if (id === 'c7' && !state.revealed) setTimeout(() => setReveal(true), 900);
  };
  const hint = (id, n) => setState((s) => ({ ...s, hintsUsed: { ...s.hintsUsed, [id]: Math.max(n, s.hintsUsed?.[id] || 0) } }));

  const run = useCallback((raw, extra) => {
    if (raw === null && extra) { setLines((l) => [...l, ...extra]); return; }
    const res = execute(raw, { cwd, state });
    setLines((l) => (res.clear ? [] : [...l, { kind: 'cmd', text: `$ ${raw}` }, ...res.lines]));
    setState((s) => ({ ...s, ...res.patch, history: [...s.history, raw].slice(-100) }));
    setCwd(res.cwd);
    if (res.view) setView(res.view);
    if (res.exit) setTimeout(onExit, 600);
  }, [cwd, state, setState, onExit]);

  const nav = (p) => { run(`cd ${p}`); setDrawer(false); };
  const progress = progressOf(state);

  return (
    <div className="flex h-dvh flex-col bg-bg">
      <a href="#workspace" onClick={(e) => { e.preventDefault(); document.getElementById('workspace')?.focus(); }} className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-[70] focus:bg-bg focus:p-2 focus:text-term">Skip to workspace</a>
      <p className="sr-only" role="status" aria-live="polite">{note}</p>
      <StatusBar progress={progress} cwd={cwd} onMenu={() => setDrawer(true)} onToggleTerm={() => setTermOpen((o) => !o)} onDirect={onDirect} />
      <div className="flex min-h-0 flex-1">
        <aside className="hidden w-56 shrink-0 border-r border-line md:block"><Explorer cwd={cwd} visited={state.visited} onNavigate={nav} /></aside>
        <div className="flex min-w-0 flex-1 flex-col">
          <main id="workspace" tabIndex={-1} className="min-h-0 flex-1"><Workspace view={view} state={state} recon={state.recon} onOpen={(id) => setState((s) => (s.opened.includes(id) ? s : { ...s, opened: [...s.opened, id] }))} onView={setView} onSolve={solve} onHint={hint} onReplay={() => setReveal(true)} onCd={nav} onCat={(d, n) => run(`cat ${d}/${n}`)} onCloseView={() => setView(cwd === '/' ? { type: 'home' } : isPanelDir(cwd) ? { type: 'panel', path: cwd } : { type: 'dir', path: cwd })} /></main>
          <div className={`border-t border-line ${termOpen ? 'h-[42%] md:h-[38%]' : 'h-0 overflow-hidden border-0'}`}><Terminal lines={lines} cwd={cwd} state={state} onRun={run} /></div>
        </div>
      </div>
      {reveal && <RevealOverlay onClose={() => setReveal(false)} onGo={(p) => { setReveal(false); run(`cd ${p}`); }} />}
      <AnimatePresence>
        {drawer && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDrawer(false)} className="fixed inset-0 z-40 bg-black/70 md:hidden" />
            <motion.div initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: 'tween', duration: 0.2 }} ref={drawerRef} className="fixed inset-y-0 left-0 z-50 w-64 border-r border-line md:hidden" role="dialog" aria-modal="true" aria-label="File explorer">
              <button onClick={() => setDrawer(false)} aria-label="Close explorer" className="absolute right-2 top-2 z-10 p-1 text-dim hover:text-term"><X size={18} /></button>
              <Explorer cwd={cwd} visited={state.visited} onNavigate={nav} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
