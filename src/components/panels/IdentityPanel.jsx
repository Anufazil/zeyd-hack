import { Lock, Unlock } from 'lucide-react';
import { DOSSIER, isUnlocked } from '../../data/identity.js';
import Decrypt from '../Decrypt.jsx';

export default function IdentityPanel({ progress, finalDone }) {
  const next = finalDone ? undefined : DOSSIER.filter((f) => typeof f.unlockAt === 'number' && progress < f.unlockAt).sort((a, b) => a.unlockAt - b.unlockAt)[0];
  return (
    <div>
      <h2 className="font-mono text-lg text-term">/identity // SUBJECT DOSSIER</h2>
      <p className="mt-1 text-sm text-warn">IDENTITY DATABASE FOUND. Authorization required.</p>
      <dl className="mt-6 divide-y divide-line border border-line bg-panel font-mono text-sm">
        {DOSSIER.map((f) => {
          const open = isUnlocked(f, progress, finalDone);
          return (
            <div key={f.key} className="grid gap-1 p-3 sm:grid-cols-[10rem_1fr]">
              <dt className="flex items-center gap-2 text-dim">{open ? <Unlock size={13} className="text-term" /> : <Lock size={13} className="text-warn" />}{f.key}</dt>
              <dd className={open ? 'text-ink' : 'text-warn'}>{open ? <Decrypt text={f.value} /> : '[CLASSIFIED]'}</dd>
            </div>
          );
        })}
      </dl>
      <p className="mt-4 max-w-prose font-sans text-sm text-dim">
        {next ? `Next field unlocks at ${next.unlockAt}% investigation progress (now ${progress}%). Explore directories, open case files and reports.` : finalDone ? 'DOSSIER COMPLETE. All evidence verified.' : 'All progress-based fields are open. The subject\u2019s name stays sealed until the final investigation is solved.'}
      </p>
    </div>
  );
}
