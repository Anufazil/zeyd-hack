import { motion } from 'framer-motion';
import { ArrowLeft, FileText } from 'lucide-react';
import { REPORTS } from '../../data/intelligence.js';

export function ReportList({ seen, onSelect }) {
  return (
    <div>
      <h2 className="font-mono text-lg text-term">/intelligence // REPORTS</h2>
      <p className="mt-1 text-sm text-dim">Records are shown only where information has been supplied.</p>
      <ul className="mt-6 space-y-2">
        {REPORTS.map((r) => (
          <li key={r.id}><button onClick={() => onSelect(r.id)} className="flex w-full items-center gap-3 border border-line bg-panel p-3 text-left font-mono text-sm transition hover:border-muted">
            <FileText size={15} className={seen.includes(r.id) ? 'text-term' : 'text-sage'} aria-hidden="true" />{r.title}
            <span className={`ml-auto text-xs ${r.status.startsWith('NO') ? 'text-warn' : 'text-dim'}`}>{r.status}</span>
          </button></li>
        ))}
      </ul>
    </div>
  );
}

export function ReportViewer({ id, onBack }) {
  const r = REPORTS.find((x) => x.id === id);
  if (!r) return null;
  const lines = r.body.length ? r.body : ['No record has been supplied for this category.'];
  return (
    <div>
      <button onClick={onBack} className="mb-3 flex items-center gap-1 font-mono text-xs text-dim hover:text-term"><ArrowLeft size={14} />back to reports</button>
      <motion.div initial={{ opacity: 0, scaleY: 0.96 }} animate={{ opacity: 1, scaleY: 1 }} transition={{ duration: 0.25 }} className="border border-line bg-panel p-5 font-mono text-sm">
        <div className="flex justify-between text-xs text-warn"><span>RESTRICTED</span><span>NODE_001</span></div>
        <h2 className="mt-3 text-lg text-term">{r.title}</h2>
        <p className="mt-1 text-xs text-dim">STATUS: {r.status}</p>
        <div className="mt-5 space-y-2 border-t border-line pt-4">
          {lines.map((l, i) => <motion.p key={i} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 + i * 0.12 }} className="text-ink">{l}</motion.p>)}
        </div>
      </motion.div>
    </div>
  );
}
