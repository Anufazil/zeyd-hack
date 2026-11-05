import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import DataWall from './DataWall.jsx';
import { HIDDEN_COUNT } from '../lib/collage.js';
import { SITE } from '../config/site.js';

export default function AccessScreen({ onEnter, onDirect, directUnlocked }) {
  const [found, setFound] = useState([]);
  const [hint, setHint] = useState(false);
  const panelRef = useRef(null);
  const granted = found.length >= HIDDEN_COUNT;
  const rows = [['SUBJECT', 'UNKNOWN'], ['STATUS', 'ACTIVE'], ['IDENTITY', 'ENCRYPTED'], ['ACCESS LEVEL', SITE.classification]];

  useEffect(() => { if (!granted) return; const t = setTimeout(onDirect, 1100); return () => clearTimeout(t); }, [granted, onDirect]);

  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-bg px-4 py-6 font-mono">
      <DataWall panelRef={panelRef} found={found} onFind={(i) => setFound((f) => (f.includes(i) ? f : [...f, i]))} />
      <motion.div ref={panelRef} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} className="relative z-10 w-full max-w-md border border-line bg-bg/90 px-5 py-6 text-center shadow-[0_0_60px_20px_#050807] sm:px-8 sm:py-8">
        <h1 className="glitch text-4xl font-bold tracking-[0.3em] text-term sm:text-6xl">{SITE.alias}</h1>
        <p className="mt-2 text-base tracking-[0.5em] text-ink sm:text-lg">{SITE.project}</p>
        <dl className="mx-auto mt-6 hidden max-w-xs grid-cols-[auto_1fr] gap-x-6 gap-y-1 border-y border-line py-4 text-left text-sm sm:mt-8 sm:grid">
          {rows.map(([k, v]) => (<div key={k} className="contents"><dt className="text-dim">{k}</dt><dd className={v === 'ENCRYPTED' ? 'text-warn' : 'text-ink'}>{v}</dd></div>))}
        </dl>
        <p className="mt-5 text-xs text-dim sm:hidden">SUBJECT UNKNOWN // STATUS ACTIVE // IDENTITY <span className="text-warn">ENCRYPTED</span></p>
        <p className="mt-5 font-sans text-sm italic text-dim sm:mt-6 sm:text-base">{SITE.tagline[0]}<br />{SITE.tagline[1]}</p>
        <button onClick={onEnter} className="mt-6 border border-term px-6 py-3 text-xs tracking-widest text-term transition hover:bg-term hover:text-bg sm:mt-8 sm:px-8 sm:text-sm">[ INITIATE INVESTIGATION ]</button>
        <div className="mt-3">
          <button onClick={() => (directUnlocked ? onDirect() : setHint((h) => !h))} aria-expanded={directUnlocked ? undefined : hint} className="py-2 text-xs text-sage underline-offset-4 hover:text-dim hover:underline">direct access</button>
        </div>
        {/* Fixed-height slot so the card never changes size (the wall is laid out around it). */}
        <div role="status" aria-live="polite" className="mx-auto h-10 max-w-xs text-xs">
          {granted ? <p className="text-term">ACCESS GRANTED.</p> : <>
            {found.length > 0 && <p className="text-term">TRACES FOUND {found.length}/{HIDDEN_COUNT}</p>}
            {hint && !directUnlocked && <p className="text-warn">LOCKED. {HIDDEN_COUNT} traces of ZEYDAC are hidden in the data. Find them all.</p>}
          </>}
        </div>
        <p className="mt-1 text-[11px] text-sage">{SITE.node} // SECURE ARCHIVE</p>
      </motion.div>
    </main>
  );
}
