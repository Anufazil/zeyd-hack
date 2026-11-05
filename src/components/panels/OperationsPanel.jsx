import { ArrowLeft, ExternalLink, FolderLock } from 'lucide-react';
import { OPERATIONS } from '../../data/operations.js';

const Missing = ({ what }) => <span className="text-warn">[ {what} not yet supplied ]</span>;
const Sec = ({ title, children }) => (<section className="border-t border-line py-4"><h3 className="font-mono text-sm text-sage">{title}</h3><div className="mt-2 text-sm text-ink">{children}</div></section>);

export function OperationList({ seen, onSelect }) {
  return (
    <div>
      <h2 className="font-mono text-lg text-term">/operations // CASE FILES</h2>
      <p className="mt-1 text-sm text-dim">Six operations on record. Open a file to investigate it.</p>
      <ul className="mt-6 grid gap-2 sm:grid-cols-2">
        {OPERATIONS.map((o) => (
          <li key={o.id}><button onClick={() => onSelect(o.id)} className="flex h-full w-full items-start gap-3 border border-line bg-panel p-3 text-left transition hover:border-muted">
            <FolderLock size={16} className={`mt-0.5 shrink-0 ${seen.includes(o.id) ? 'text-term' : 'text-sage'}`} aria-hidden="true" />
            <span><span className="block font-mono text-xs text-dim">{o.code}</span><span className="block font-mono text-sm text-ink">{o.title}</span><span className="mt-1 block text-xs text-dim">{o.summary}</span></span>
          </button></li>
        ))}
      </ul>
    </div>
  );
}

export function OperationDetail({ id, onBack }) {
  const o = OPERATIONS.find((x) => x.id === id);
  if (!o) return null;
  return (
    <article>
      <button onClick={onBack} className="mb-3 flex items-center gap-1 font-mono text-xs text-dim hover:text-term"><ArrowLeft size={14} />back to case files</button>
      <p className="font-mono text-xs text-warn">{o.code} // CLASSIFICATION: RESTRICTED</p>
      <h2 className="font-mono text-xl text-term">{o.title}</h2>
      <div className="mt-4">
        <Sec title="Project overview">{o.overview}</Sec>
        <Sec title="Problem statement">{o.problem || <Missing what="problem statement" />}</Sec>
        <Sec title="Technical architecture"><ul className="list-inside list-disc text-dim">{o.architecture.map((a) => <li key={a}>{a}</li>)}</ul><p className="mt-1 font-mono text-xs text-sage">Derived from the declared stack.</p></Sec>
        <Sec title="Technologies"><div className="flex flex-wrap gap-2">{o.tech.map((t) => <span key={t} className="border border-line px-2 py-0.5 font-mono text-xs">{t}</span>)}</div></Sec>
        <Sec title="Features">{o.features ? <ul className="list-inside list-disc">{o.features.map((f) => <li key={f}>{f}</li>)}</ul> : <Missing what="feature list" />}</Sec>
        <Sec title="Development challenges">{o.challenges ? o.challenges : <Missing what="development notes" />}</Sec>
        <Sec title="Screenshots">{o.screenshots.length ? <div className="grid gap-2 sm:grid-cols-2">{o.screenshots.map((s) => <img key={s} src={s} alt={`${o.title} screenshot`} loading="lazy" className="border border-line" />)}</div> : <Missing what="screenshots" />}</Sec>
        <Sec title="Links"><div className="flex flex-wrap gap-4 font-mono text-xs">
          {o.github ? <a className="flex items-center gap-1 text-term hover:underline" href={o.github} target="_blank" rel="noreferrer noopener">GitHub <ExternalLink size={12} /></a> : <Missing what="GitHub link" />}
          {o.live ? <a className="flex items-center gap-1 text-term hover:underline" href={o.live} target="_blank" rel="noreferrer noopener">Live deployment <ExternalLink size={12} /></a> : <Missing what="live link" />}
        </div></Sec>
      </div>
    </article>
  );
}
