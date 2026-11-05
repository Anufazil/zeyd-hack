import { useEffect, useRef, useState } from 'react';
import { complete } from '../lib/terminal.js';

const COLORS = { cmd: 'text-term', out: 'text-ink', ok: 'text-term', warn: 'text-warn', err: 'text-danger' };

export default function Terminal({ lines, cwd, state, onRun }) {
  const [input, setInput] = useState('');
  const [idx, setIdx] = useState(-1);
  const endRef = useRef(null), inputRef = useRef(null);
  useEffect(() => { endRef.current?.scrollIntoView({ block: 'end' }); }, [lines]);

  const submit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    onRun(input); setInput(''); setIdx(-1);
  };
  const onKey = (e) => {
    const h = state.history;
    if (e.key === 'ArrowUp') { e.preventDefault(); if (!h.length) return; const n = idx === -1 ? h.length - 1 : Math.max(0, idx - 1); setIdx(n); setInput(h[n]); }
    else if (e.key === 'ArrowDown') { e.preventDefault(); if (idx === -1) return; const n = idx + 1; if (n >= h.length) { setIdx(-1); setInput(''); } else { setIdx(n); setInput(h[n]); } }
    else if (e.key === 'Tab') { e.preventDefault(); const r = complete(input, cwd, state); setInput(r.text); if (r.options.length > 1) onRun(null, [{ kind: 'out', text: r.options.join('   ') }]); }
  };
  return (
    <section aria-label="Terminal" onClick={() => inputRef.current?.focus()} className="flex h-full flex-col bg-bg font-mono text-[13px]">
      <div className="thin-scroll flex-1 overflow-y-auto px-3 py-2 leading-6" role="log" aria-label="Terminal output" tabIndex={0} aria-live="polite">
        {lines.map((l, i) => <div key={i} className={`whitespace-pre-wrap break-words ${COLORS[l.kind]}`}>{l.text || '\u00A0'}</div>)}
        <div ref={endRef} />
      </div>
      <div className="flex gap-1.5 overflow-x-auto border-t border-line px-3 py-1.5 md:hidden" role="group" aria-label="Quick commands">
        {['help', 'ls', 'recon', 'hint', 'progress', 'clear'].map((c) => <button key={c} type="button" onClick={() => onRun(c)} className="min-h-9 shrink-0 border border-line px-3 font-mono text-xs text-dim active:border-term active:text-term">{c}</button>)}
      </div>
      <form onSubmit={submit} className="flex items-center gap-2 border-t border-line px-3 py-2">
        <label htmlFor="term-input" className="shrink-0 text-term"><span className="hidden sm:inline">zeydac@node001:</span>{cwd}$</label>
        <input id="term-input" ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={onKey} autoComplete="off" autoCapitalize="none" autoCorrect="off" spellCheck={false} className="min-w-0 flex-1 bg-transparent text-ink caret-term outline-none" />
      </form>
    </section>
  );
}
