import { useState } from 'react';
import { ARSENAL } from '../../data/arsenal.js';

export default function ArsenalPanel({ state, onOpen }) {
  const [sel, setSel] = useState(null);
  const seen = state.opened || [];
  return (
    <div>
      <h2 className="font-mono text-lg text-term">/arsenal // TECHNICAL MODULES</h2>
      <p className="mt-1 text-sm text-dim">Select a module to inspect it. Proficiency stays unrated until it can be verified.</p>
      <div className="mt-6 space-y-6">
        {ARSENAL.map((c) => (
          <section key={c.category} aria-label={c.category}>
            <h3 className="font-mono text-sm text-ink">{c.category}</h3>
            <ul className="mt-2 flex flex-wrap gap-2">
              {c.modules.map((x) => (
                <li key={x.id}><button onClick={() => { setSel(x); onOpen(`mod:${c.category}`); }} aria-pressed={sel?.id === x.id} className={`border px-3 py-1.5 font-mono text-xs transition ${sel?.id === x.id ? 'border-term text-term' : seen.includes(`mod:${c.category}`) ? 'border-muted text-ink' : 'border-line text-dim hover:border-muted'}`}>{x.name}</button></li>
              ))}
            </ul>
          </section>
        ))}
      </div>
      <div aria-live="polite" className="mt-6">
        {sel && (
          <div className="border border-line bg-panel p-4 font-mono text-sm">
            <div className="text-term">{sel.name} <span className="text-dim">// {sel.category}</span></div>
            <p className="mt-2 font-sans text-ink">{sel.description}</p>
            <p className="mt-3 text-dim">PRACTICAL APPLICATION: <span className="text-ink">{sel.applied || 'none documented yet'}</span></p>
            <p className="mt-1 text-dim">PROFICIENCY: <span className="text-warn">{sel.level || 'not yet verified'}</span></p>
          </div>
        )}
      </div>
    </div>
  );
}
