import { useEffect, useState } from 'react';
import { BOOT_LINES } from '../config/site.js';

export default function BootSequence({ onDone }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (count >= BOOT_LINES.length) { const t = setTimeout(onDone, 500); return () => clearTimeout(t); }
    const t = setTimeout(() => setCount((c) => c + 1), 380);
    return () => clearTimeout(t);
  }, [count, onDone]);
  return (
    <main className="relative flex min-h-dvh items-center justify-center bg-bg p-6 font-mono">
      <div className="w-full max-w-xl text-sm leading-7" aria-live="polite">
        {BOOT_LINES.slice(0, count).map((l, i) => (
          <div key={i} className={i === 0 ? 'text-term font-bold' : l.includes('LOCKED') ? 'text-warn' : l.includes('READY') ? 'text-term' : 'text-dim'}>{l}</div>
        ))}
        {count < BOOT_LINES.length && <span className="cursor" />}
      </div>
      <button onClick={onDone} className="absolute bottom-6 right-6 border border-line px-3 py-1.5 font-mono text-xs text-dim hover:border-muted hover:text-ink">skip boot</button>
    </main>
  );
}
