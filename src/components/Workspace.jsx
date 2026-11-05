import { lazy, Suspense, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Folder, Lock } from 'lucide-react';
import { DIRS, DIR_PATHS } from '../data/filesystem.js';
import { progressOf } from '../lib/storage.js';
const IdentityPanel = lazy(() => import('./panels/IdentityPanel.jsx'));
const ArsenalPanel = lazy(() => import('./panels/ArsenalPanel.jsx'));
const ContactPanel = lazy(() => import('./panels/ContactPanel.jsx'));
const Chl = lazy(() => import('./challenges/ChallengesPanel.jsx').then((m) => ({ default: (p) => (p.id ? <m.ChallengeDetail {...p} /> : <m.ChallengeList {...p} />) })));
const Ops = lazy(() => import('./panels/OperationsPanel.jsx').then((m) => ({ default: (p) => (p.id ? <m.OperationDetail id={p.id} onBack={p.onBack} /> : <m.OperationList seen={p.seen} onSelect={p.onSelect} />) })));
const Rpts = lazy(() => import('./panels/IntelligencePanel.jsx').then((m) => ({ default: (p) => (p.id ? <m.ReportViewer id={p.id} onBack={p.onBack} /> : <m.ReportList seen={p.seen} onSelect={p.onSelect} />) })));

function Matrix({ onClose }) {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current, ctx = c.getContext('2d');
    c.width = c.offsetWidth; c.height = c.offsetHeight;
    const cols = Math.floor(c.width / 16), drops = Array(cols).fill(0).map(() => Math.random() * -40);
    const id = setInterval(() => {
      ctx.fillStyle = 'rgba(5,8,7,.12)'; ctx.fillRect(0, 0, c.width, c.height);
      ctx.fillStyle = '#00FF88'; ctx.font = '14px JetBrains Mono, monospace';
      drops.forEach((y, i) => { ctx.fillText(String.fromCharCode(0x30a0 + Math.random() * 60), i * 16, y * 16); drops[i] = y * 16 > c.height && Math.random() > .975 ? 0 : y + 1; });
    }, 60);
    const esc = () => onClose();
    window.addEventListener('keydown', esc);
    return () => { clearInterval(id); window.removeEventListener('keydown', esc); };
  }, [onClose]);
  return <canvas ref={ref} onClick={onClose} aria-label="Matrix animation. Click or press a key to close." className="h-full min-h-64 w-full cursor-pointer" />;
}

export default function Workspace({ view, recon, state, onCd, onCat, onCloseView, onOpen, onView, onSolve, onHint, onReplay }) {
  const key = view.type + (view.path || '') + (view.name || '') + (view.id || '');
  const seen = state.opened || [];
  const progress = progressOf(state);
  return (
    <section aria-label="Investigation workspace" tabIndex={0} className="thin-scroll h-full overflow-y-auto p-4 sm:p-6">
      <AnimatePresence mode="wait">
        <motion.div key={key} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
          {view.type === 'home' && (
            <div>
              <h2 className="font-mono text-lg text-term">/ archive index</h2>
              <p className="mt-2 max-w-prose text-sm text-dim">Seven directories. Select one here, in the explorer, or type <code className="font-mono text-ink">cd &lt;dir&gt;</code> in the terminal. Run <code className="font-mono text-ink">help</code> if you are unsure where to start.</p>
              <ul className="mt-6 grid gap-2 sm:grid-cols-2">
                {DIR_PATHS.map((p) => (
                  <li key={p}><button onClick={() => onCd(p)} className="flex w-full items-start gap-3 border border-line bg-panel p-3 text-left transition hover:border-muted">
                    {p === '/identity' ? <Lock size={16} className="mt-0.5 shrink-0 text-warn" aria-hidden="true" /> : <Folder size={16} className="mt-0.5 shrink-0 text-sage" aria-hidden="true" />}
                    <span><span className="block font-mono text-sm text-ink">{p}</span><span className="text-xs text-dim">{DIRS[p].desc}</span></span>
                  </button></li>
                ))}
              </ul>
            </div>
          )}
          {view.type === 'dir' && (
            <div>
              <h2 className="font-mono text-lg text-term">{view.path}</h2>
              <p className="mt-1 text-sm text-dim">{DIRS[view.path].desc}</p>
              <ul className="mt-6 space-y-2">
                {[...Object.keys(DIRS[view.path].files), ...(recon ? Object.keys(DIRS[view.path].hidden || {}) : [])].map((n) => (
                  <li key={n}><button onClick={() => onCat(view.path, n)} className="flex w-full items-center gap-3 border border-line bg-panel p-3 text-left font-mono text-sm hover:border-muted"><FileText size={15} className={n.startsWith('.') ? 'text-warn' : 'text-sage'} aria-hidden="true" />{n}{n.startsWith('.') && <span className="ml-auto text-xs text-warn">hidden</span>}</button></li>
                ))}
              </ul>
            </div>
          )}
          {view.type === 'file' && (
            <div>
              <div className="flex items-center gap-3 font-mono text-sm"><span className="text-term">{view.path}/{view.name}</span><button onClick={onCloseView} className="ml-auto border border-line px-2 py-1 text-xs text-dim hover:text-ink">close</button></div>
              <pre className="mt-4 whitespace-pre-wrap break-words border border-line bg-panel p-4 font-mono text-sm leading-6 text-ink">{view.text}</pre>
            </div>
          )}
          <Suspense fallback={<p className="font-mono text-sm text-dim">decrypting<span className="cursor" /></p>}>
            {view.type === 'panel' && view.path === '/identity' && <IdentityPanel progress={progress} finalDone={state.solved.includes('c7')} />}
            {view.type === 'panel' && view.path === '/arsenal' && <ArsenalPanel state={state} onOpen={onOpen} />}
            {view.type === 'panel' && view.path === '/contact' && <ContactPanel />}
            {view.type === 'panel' && view.path === '/operations' && <Ops seen={seen} onSelect={(id) => { onOpen(id); onView({ type: 'operation', id }); }} />}
            {view.type === 'operation' && <Ops id={view.id} onBack={() => onView({ type: 'panel', path: '/operations' })} />}
            {view.type === 'panel' && view.path === '/intelligence' && <Rpts seen={seen} onSelect={(id) => { onOpen(id); onView({ type: 'document', id }); }} />}
            {view.type === 'panel' && view.path === '/challenges' && <Chl solved={state.solved} onSelect={(id) => onView({ type: 'challenge', id })} onReplay={onReplay} />}
            {view.type === 'challenge' && <Chl id={view.id} state={state} onBack={() => onView({ type: 'panel', path: '/challenges' })} onSolve={onSolve} onHint={onHint} />}
            {view.type === 'document' && <Rpts id={view.id} onBack={() => onView({ type: 'panel', path: '/intelligence' })} />}
          </Suspense>
          {view.type === 'matrix' && <Matrix onClose={onCloseView} />}
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
