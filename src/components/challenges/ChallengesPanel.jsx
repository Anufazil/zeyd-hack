import { useState } from 'react';
import { ArrowLeft, CheckCircle2, Lock, Flag } from 'lucide-react';
import { CHALLENGES, fragmentOf, isUnlockedCh } from '../../data/challenges.js';
import { verifyFlag } from '../../lib/flags.js';
import { WIDGETS } from './widgets.jsx';

const DIFF = { Easy: 'text-term', Medium: 'text-warn', Hard: 'text-danger' };

export function ChallengeList({ solved, onSelect, onReplay }) {
  return (
    <div>
      <h2 className="font-mono text-lg text-term">/challenges // CTF</h2>
      <p className="mt-1 text-sm text-dim">{solved.length} of 7 solved. Each solved challenge unlocks the next. Flags look like <code className="font-mono text-ink">ZEYD&#123;...&#125;</code>.</p>
      <ul className="mt-6 space-y-2">
        {CHALLENGES.map((c) => {
          const done = solved.includes(c.id), open = isUnlockedCh(c, solved);
          const Icon = done ? CheckCircle2 : open ? Flag : Lock;
          return (
            <li key={c.id}><button disabled={!open} onClick={() => onSelect(c.id)} className={`flex w-full items-center gap-3 border p-3 text-left font-mono text-sm transition ${open ? 'border-line bg-panel hover:border-muted' : 'cursor-not-allowed border-line/50 opacity-50'}`}>
              <Icon size={16} className={done ? 'text-term' : open ? 'text-sage' : 'text-warn'} aria-hidden="true" />
              <span className="text-dim">{String(c.no).padStart(2, '0')}</span><span className="text-ink">{c.title}</span>
              <span className={`ml-auto text-xs ${DIFF[c.difficulty]}`}>{c.difficulty}</span>
            </button></li>
          );
        })}
      </ul>
      {solved.includes('c7') && <button onClick={onReplay} className="mt-6 border border-term px-4 py-2 font-mono text-xs text-term hover:bg-term hover:text-bg">replay final reveal</button>}
    </div>
  );
}

export function ChallengeDetail({ id, state, onBack, onSolve, onHint }) {
  const c = CHALLENGES.find((x) => x.id === id);
  const [val, setVal] = useState('');
  const [fb, setFb] = useState({ k: '', m: '' });
  const [busy, setBusy] = useState(false);
  if (!c) return null;
  const solved = state.solved.includes(id), W = WIDGETS[id], used = state.hintsUsed?.[id] || 0, fr = solved ? fragmentOf(id) : null;
  const submit = async (e) => {
    e.preventDefault(); if (!val.trim() || busy) return;
    setBusy(true); setFb({ k: '', m: '' });
    try {
      const r = await verifyFlag(id, val);
      if (!r.format) setFb({ k: 'err', m: 'Wrong format. A flag looks like ZEYD{...}.' });
      else if (r.ok) { setFb({ k: 'ok', m: 'FLAG ACCEPTED. Evidence verified.' }); onSolve(id); setVal(''); }
      else setFb({ k: 'err', m: 'INCORRECT. That flag does not match. Re-check your evidence or use a hint.' });
    } catch (x) { setFb({ k: 'err', m: x.message }); }
    setBusy(false);
  };
  return (
    <article>
      <button onClick={onBack} className="mb-3 flex items-center gap-1 font-mono text-xs text-dim hover:text-term"><ArrowLeft size={14} />back to challenges</button>
      <p className="font-mono text-xs text-dim">CHALLENGE {String(c.no).padStart(2, '0')} // <span className={DIFF[c.difficulty]}>{c.difficulty}</span>{solved && <span className="text-term"> // SOLVED</span>}</p>
      <h2 className="font-mono text-xl text-term">{c.title}</h2>
      <p className="mt-2 max-w-prose text-sm text-ink">{c.description}</p>
      <ul className="mt-3 list-inside list-disc text-sm text-dim">{c.instructions.map((i) => <li key={i}>{i}</li>)}</ul>
      <div className="mt-5"><W solved={state.solved} /></div>
      <form onSubmit={submit} className="mt-6 flex max-w-lg gap-2">
        <label htmlFor="flag" className="sr-only">Flag</label>
        <input id="flag" value={val} onChange={(e) => setVal(e.target.value)} placeholder="ZEYD{...}" autoComplete="off" spellCheck={false} maxLength={200} className="min-w-0 flex-1 border border-line bg-bg px-3 py-2 font-mono text-sm text-ink outline-none focus:border-term" />
        <button disabled={busy} className="border border-term px-4 font-mono text-sm text-term hover:bg-term hover:text-bg disabled:opacity-50">{busy ? '...' : 'Submit'}</button>
      </form>
      <p aria-live="polite" role="status" className={`mt-2 font-mono text-xs ${fb.k === 'ok' ? 'text-term' : 'text-danger'}`}>{fb.m}</p>
      {fr && <p className="mt-2 border border-term/40 p-2 font-mono text-xs text-term">EVIDENCE FRAGMENT: position {fr.pos} = {fr.txt}</p>}
      <div className="mt-6">
        <button onClick={() => onHint(id, Math.min(used + 1, c.hints.length))} disabled={used >= c.hints.length} className="border border-line px-3 py-1.5 font-mono text-xs text-dim hover:border-muted hover:text-ink disabled:opacity-40">{used >= c.hints.length ? 'no more hints' : `reveal hint ${used + 1} of ${c.hints.length}`}</button>
        <ol className="mt-2 space-y-1 font-mono text-xs text-warn">{c.hints.slice(0, used).map((h, i) => <li key={i}>HINT {i + 1}: {h}</li>)}</ol>
      </div>
    </article>
  );
}
