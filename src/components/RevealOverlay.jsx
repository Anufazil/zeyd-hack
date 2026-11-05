import { useEffect, useRef, useState } from 'react';
import useFocusTrap from '../lib/useFocusTrap.js';
import { motion } from 'framer-motion';

const SEQ = ['INVESTIGATION COMPLETE', 'ALL EVIDENCE VERIFIED.', 'SUBJECT IDENTIFIED.'];
export default function RevealOverlay({ onClose, onGo }) {
  const [step, setStep] = useState(0);
  useEffect(() => { if (step < 5) { const t = setTimeout(() => setStep((s) => s + 1), step < 3 ? 1100 : 1400); return () => clearTimeout(t); } }, [step]);
  const ref = useRef(null);
  useFocusTrap(ref, true, onClose);
  return (
    <div ref={ref} role="dialog" aria-modal="true" aria-label="Investigation complete" className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-bg/95 p-6 font-mono">
      <div className="w-full max-w-lg text-center">
        {SEQ.slice(0, Math.min(step, 3)).map((l, i) => <motion.p key={l} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={i === 0 ? 'glitch text-xl font-bold text-term' : 'mt-3 text-ink'}>{l}</motion.p>)}
        {step >= 3 && <motion.dl initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mx-auto mt-6 grid max-w-xs grid-cols-[auto_1fr] gap-x-4 gap-y-1 border-y border-line py-4 text-left text-sm">
          <dt className="text-dim">ALIAS</dt><dd>ZEYDAC</dd><dt className="text-dim">IDENTITY</dt><dd className="text-term">ANUFAZIL</dd><dt className="text-dim">CLASSIFICATION</dt><dd>CYBERSECURITY ENTHUSIAST</dd></motion.dl>}
        {step >= 4 && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 font-sans text-sm italic text-dim">You followed the traces.<br />You uncovered the evidence.<br />Now you know who is behind ZEYDAC.</motion.p>}
        {step >= 5 && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8 flex flex-col gap-2 sm:flex-row sm:justify-center">
          {[['[ VIEW COMPLETE DOSSIER ]', '/identity'], ['[ EXPLORE OPERATIONS ]', '/operations'], ['[ ESTABLISH CONTACT ]', '/contact']].map(([l, p]) => <button key={p} onClick={() => onGo(p)} className="border border-term px-3 py-2 text-xs text-term hover:bg-term hover:text-bg">{l}</button>)}
        </motion.div>}
        <button onClick={onClose} className="mt-8 text-xs text-sage hover:text-dim">{step >= 5 ? 'close' : 'skip'}</button>
      </div>
    </div>
  );
}
