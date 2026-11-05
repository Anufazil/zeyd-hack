import { useMemo, useState } from 'react';
import { C1_MSG, C2_TRACE, C3_HEX } from '../../data/generated.js';
import { buildLogs, buildPackets, FILES, PASSWORDS, COMMON_LIST } from '../../data/challengeData.js';
import { CHALLENGES, fragmentOf } from '../../data/challenges.js';

const box = 'border border-line bg-panel p-3 font-mono text-xs';
const btn = 'border border-line px-2 py-1 font-mono text-xs text-dim hover:border-muted hover:text-ink';

export function C1() {
  return <div className={box}><div className="text-dim">INTERCEPTED MESSAGE</div><p className="mt-2 select-all break-all text-term">{C1_MSG}</p></div>;
}

export function C2() {
  const [show, setShow] = useState(false);
  const source = `<main class="archive">\n  <h1>SOURCE HUNT</h1>\n  <p>Nothing to see here.</p>\n  <!-- trace is rotated by 13 -->\n  <div hidden data-trace="${C2_TRACE}"></div>\n</main>`;
  return (
    <div className={box}>
      <p className="text-dim">Nothing to see here.</p>
      {/* The real DOM carries the clue below: inspect it with DevTools. */}
      <div hidden data-trace={C2_TRACE} dangerouslySetInnerHTML={{ __html: '<!-- trace is rotated by 13 -->' }} />
      <button onClick={() => setShow((s) => !s)} className={`${btn} mt-3`} aria-expanded={show}>{show ? 'hide source viewer' : 'open source viewer'}</button>
      {show && <pre className="mt-3 overflow-x-auto whitespace-pre text-ink">{source}</pre>}
    </div>
  );
}

export function C3() {
  const [sel, setSel] = useState(null);
  const f = FILES.find((x) => x.name === sel);
  const meta = f && { ...f.meta, Comment: f.meta.Comment ?? C3_HEX };
  return (
    <div className="grid gap-3 sm:grid-cols-[14rem_1fr]">
      <ul className="space-y-1">{FILES.map((x) => <li key={x.name}><button onClick={() => setSel(x.name)} aria-pressed={sel === x.name} className={`w-full border px-2 py-1.5 text-left font-mono text-xs ${sel === x.name ? 'border-term text-term' : 'border-line text-ink hover:border-muted'}`}>{x.name}<span className="block text-dim">{x.size}</span></button></li>)}</ul>
      <div className={box} aria-live="polite">{meta ? <dl className="space-y-1">{Object.entries(meta).map(([k, v]) => <div key={k} className="grid grid-cols-[6rem_1fr] gap-2"><dt className="text-dim">{k}</dt><dd className="break-all text-ink">{v}</dd></div>)}</dl> : <span className="text-dim">Select a file to read its metadata.</span>}</div>
    </div>
  );
}

export function C4() {
  return (
    <div className="space-y-3">
      <div className={box}>
        <div className="text-term">PASSWORD POLICY</div>
        <ol className="mt-2 list-inside list-decimal space-y-1 text-ink"><li>At least 12 characters.</li><li>Must not appear (ignoring case) in the leaked list.</li><li>No keyboard walks (like asdf) and no run of 4 or more identical characters.</li></ol>
        <div className="mt-3 text-dim">LEAKED LIST: <span className="text-warn">{COMMON_LIST.join(', ')}</span></div>
      </div>
      <ul className="grid gap-2 sm:grid-cols-2">{PASSWORDS.map((p) => <li key={p.id} className={box}><span className="text-sage">{p.id}</span> <span className="select-all text-ink">{p.pw}</span></li>)}</ul>
    </div>
  );
}

export function C5() {
  const logs = useMemo(buildLogs, []);
  const [q, setQ] = useState('');
  const [tools, setTools] = useState(false);
  const rows = logs.filter((l) => l.toLowerCase().includes(q.toLowerCase()));
  const fails = useMemo(() => { const m = {}; logs.forEach((l) => { const x = l.match(/Failed password for (\S+) from (\S+)/); if (x) m[x[2]] = (m[x[2]] || 0) + 1; }); return Object.entries(m).sort((a, b) => b[1] - a[1]); }, [logs]);
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        <label htmlFor="logq" className="sr-only">Filter log</label>
        <input id="logq" value={q} onChange={(e) => setQ(e.target.value)} placeholder="filter: Failed, 203.0, sudo ..." className="min-w-0 flex-1 border border-line bg-bg px-2 py-1 font-mono text-xs text-ink outline-none focus:border-term" />
        {['Failed', 'Accepted', 'sudo'].map((k) => <button key={k} onClick={() => setQ(k)} className={btn}>{k}</button>)}
        <button onClick={() => setTools((t) => !t)} aria-expanded={tools} className={btn}>analyst tools</button>
      </div>
      {tools && <div className={box}><div className="text-dim">FAILED LOGINS BY SOURCE</div>{fails.map(([ip, n]) => <div key={ip} className="flex gap-4"><span className="w-32 text-ink">{ip}</span><span className="text-warn">{n}</span></div>)}</div>}
      <div tabIndex={0} role="region" aria-label="Log lines" className="thin-scroll max-h-72 overflow-auto border border-line bg-panel p-2"><pre className="whitespace-pre font-mono text-[11px] leading-5 text-ink">{rows.join('\n') || 'no matching lines'}</pre></div>
      <p className="font-mono text-xs text-dim">{rows.length} of {logs.length} lines</p>
    </div>
  );
}

export function C6() {
  const data = useMemo(buildPackets, []);
  const [q, setQ] = useState('');
  const [summary, setSummary] = useState(false);
  const rows = data.filter((r) => Object.values(r).join(' ').toLowerCase().includes(q.toLowerCase()));
  const groups = useMemo(() => { const m = {}; data.forEach((r) => { const k = `${r.src} > ${r.dst}:${r.port}`; m[k] = m[k] || { n: 0, b: 0 }; m[k].n++; m[k].b += r.bytes; }); return Object.entries(m).filter(([, v]) => v.n > 1).sort((a, b) => b[1].n - a[1].n).slice(0, 10); }, [data]);
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        <label htmlFor="pq" className="sr-only">Filter packets</label>
        <input id="pq" value={q} onChange={(e) => setQ(e.target.value)} placeholder="filter: 10.0.0.23, TCP, 4444 ..." className="min-w-0 flex-1 border border-line bg-bg px-2 py-1 font-mono text-xs text-ink outline-none focus:border-term" />
        <button onClick={() => setSummary((s) => !s)} aria-expanded={summary} className={btn}>summary by connection</button>
      </div>
      {summary && <div className={`${box} overflow-x-auto`}><div className="text-dim">REPEATED CONNECTIONS (top 10)</div><table className="mt-1 w-full text-left"><thead className="text-dim"><tr><th>connection</th><th>packets</th><th>bytes</th></tr></thead><tbody>{groups.map(([k, v]) => <tr key={k}><td className="pr-4 text-ink">{k}</td><td className="pr-4">{v.n}</td><td>{v.b.toLocaleString()}</td></tr>)}</tbody></table></div>}
      <div tabIndex={0} role="region" aria-label="Packet table" className="thin-scroll max-h-72 overflow-auto border border-line bg-panel">
        <table className="w-full min-w-[34rem] text-left font-mono text-[11px]"><thead className="sticky top-0 bg-panel text-dim"><tr><th className="p-1.5">t(s)</th><th>src</th><th>dst</th><th>proto</th><th>port</th><th>bytes</th></tr></thead>
          <tbody>{rows.map((r, i) => <tr key={i} className="border-t border-line/60 text-ink"><td className="p-1.5">{r.t}</td><td>{r.src}</td><td>{r.dst}</td><td>{r.proto}</td><td>{r.port}</td><td>{r.bytes.toLocaleString()}</td></tr>)}</tbody></table>
      </div>
      <p className="font-mono text-xs text-dim">{rows.length} of {data.length} packets</p>
    </div>
  );
}

export function C7({ solved }) {
  return (
    <div className={box}>
      <div className="text-term">EVIDENCE BOARD</div>
      <ul className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {CHALLENGES.slice(0, 6).map((c) => { const fr = solved.includes(c.id) ? fragmentOf(c.id) : null; return (
          <li key={c.id} className="border border-line p-2"><div className="text-dim">from challenge {c.no}</div>{fr ? <div className="text-ink">position {fr.pos}: <span className="text-term">{fr.txt}</span></div> : <div className="text-warn">locked</div>}</li>); })}
      </ul>
    </div>
  );
}

export const WIDGETS = { c1: C1, c2: C2, c3: C3, c4: C4, c5: C5, c6: C6, c7: C7 };
