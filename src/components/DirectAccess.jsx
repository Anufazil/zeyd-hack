import { lazy, Suspense, useEffect, useState } from 'react';
import { ExternalLink, Terminal as TermIcon } from 'lucide-react';
import { SITE } from '../config/site.js';
import { ARSENAL } from '../data/arsenal.js';
import { OPERATIONS } from '../data/operations.js';
import { REPORTS } from '../data/intelligence.js';
import { DOSSIER } from '../data/identity.js';

const ContactPanel = lazy(() => import('./panels/ContactPanel.jsx'));
const NAV = [['about', 'About'], ['skills', 'Skills'], ['projects', 'Projects'], ['education', 'Education'], ['contact', 'Contact']];
const H = ({ id, children }) => <h2 id={id} className="scroll-mt-28 font-mono text-xl text-term">{children}</h2>;
const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export default function DirectAccess({ onInvestigate }) {
  const [active, setActive] = useState('about');
  // In-page navigation scrolls without touching the URL hash: the hash is reserved for the #direct route.
  const go = (id) => (e) => {
    e.preventDefault();
    const el = document.getElementById(id); if (!el) return;
    el.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth', block: 'start' });
    el.setAttribute('tabindex', '-1'); el.focus({ preventScroll: true }); setActive(id);
  };
  useEffect(() => {
    let raf = 0;
    const calc = () => {
      raf = 0;
      const bottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
      let cur = NAV[0][0];
      for (const [id] of NAV) { const el = document.getElementById(id); if (el && el.getBoundingClientRect().top <= 170) cur = id; }
      setActive(bottom ? NAV[NAV.length - 1][0] : cur);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(calc); };
    window.addEventListener('scroll', onScroll, { passive: true });
    calc();
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf); };
  }, []);
  const f = Object.fromEntries(DOSSIER.map((d) => [d.key, d.value]));
  const withRecords = REPORTS.filter((r) => r.body.length), without = REPORTS.filter((r) => !r.body.length);
  return (
    <div className="min-h-dvh bg-bg">
      <a href="#direct" onClick={go('about')} className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:bg-bg focus:p-2 focus:text-term">Skip to content</a>
      <header className="sticky top-0 z-40 border-b border-line bg-panel/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center gap-x-5 gap-y-1 px-4 py-2 font-mono text-xs">
          <span className="font-bold text-term">{SITE.name} // DIRECT ACCESS</span>
          <nav aria-label="Sections" className="flex flex-wrap gap-x-4 gap-y-1">{NAV.map(([id, l]) => <a key={id} href="#direct" onClick={go(id)} aria-current={active === id ? 'location' : undefined} className={`py-1.5 hover:text-term ${active === id ? 'text-term underline underline-offset-4' : 'text-dim'}`}>{l}</a>)}</nav>
          <button onClick={onInvestigate} className="ml-auto flex items-center gap-1.5 border border-line px-2.5 py-1.5 text-dim hover:border-muted hover:text-ink"><TermIcon size={13} aria-hidden="true" />Investigator mode</button>
        </div>
      </header>
      <main className="mx-auto max-w-4xl space-y-14 px-4 py-12">
        <section aria-labelledby="about">
          <p className="font-mono text-xs text-dim">{SITE.node} // {SITE.classification}</p>
          <h1 className="mt-2 font-mono text-4xl font-bold tracking-wide text-term">Anufazil</h1>
          <p className="mt-1 font-mono text-sm text-ink">alias {SITE.alias}</p>
          <H id="about">About</H>
          <p className="mt-3 max-w-prose text-base leading-7 text-ink">Computer Science graduate from {f.Education.split(', ')[1].replace(' (KTU)', '')}, APJ Abdul Kalam Technological University, based in {f.Location}. Currently in the TechByHeart cybersecurity program, with a focus on SOC operations, threat analysis and secure web development.</p>
          <dl className="mt-5 grid max-w-xl grid-cols-[auto_1fr] gap-x-6 gap-y-2 font-mono text-sm">
            {[['Location', f.Location], ['Education', f.Education], ['Current training', f['Current Mission']], ['Interests', 'Cybersecurity, SOC operations, threat analysis, secure web development']].map(([k, v]) => <div key={k} className="contents"><dt className="text-dim">{k}</dt><dd className="text-ink">{v}</dd></div>)}
          </dl>
        </section>
        <section aria-labelledby="skills" className="border-t border-line pt-10">
          <H id="skills">Skills</H>
          <div className="mt-5 space-y-5">
            {ARSENAL.map((c) => (
              <div key={c.category}><h3 className="font-mono text-sm text-ink">{c.category}</h3>
                <ul className="mt-2 flex flex-wrap gap-2">{c.modules.map((m) => <li key={m.id} title={m.description} className="border border-line px-2.5 py-1 font-mono text-xs text-ink">{m.name}</li>)}</ul></div>
            ))}
          </div>
        </section>
        <section aria-labelledby="projects" className="border-t border-line pt-10">
          <H id="projects">Projects</H>
          <ul className="mt-5 grid gap-4 sm:grid-cols-2">
            {OPERATIONS.map((o) => (
              <li key={o.id} className="flex flex-col border border-line bg-panel p-4">
                <p className="font-mono text-xs text-dim">{o.code}</p>
                <h3 className="font-mono text-base text-ink">{o.title}</h3>
                <p className="mt-2 text-sm text-ink">{o.summary} {o.overview}</p>
                {o.features && <ul className="mt-2 list-inside list-disc text-sm text-dim">{o.features.map((x) => <li key={x}>{x}</li>)}</ul>}
                <div className="mt-3 flex flex-wrap gap-1.5">{o.tech.map((t) => <span key={t} className="border border-line px-1.5 py-0.5 font-mono text-[11px] text-dim">{t}</span>)}</div>
                {(o.github || o.live) && <div className="mt-3 flex gap-4 font-mono text-xs">
                  {o.github && <a href={o.github} target="_blank" rel="noreferrer noopener" className="flex items-center gap-1 text-term hover:underline">GitHub <ExternalLink size={12} aria-hidden="true" /></a>}
                  {o.live && <a href={o.live} target="_blank" rel="noreferrer noopener" className="flex items-center gap-1 text-term hover:underline">Live <ExternalLink size={12} aria-hidden="true" /></a>}
                </div>}
              </li>
            ))}
          </ul>
        </section>
        <section aria-labelledby="education" className="border-t border-line pt-10">
          <H id="education">Education and training</H>
          <div className="mt-5 space-y-4">
            {withRecords.map((r) => <div key={r.id} className="border border-line bg-panel p-4 font-mono text-sm"><h3 className="text-ink">{r.title}</h3>{r.body.map((l) => <p key={l} className="mt-1 text-dim">{l}</p>)}</div>)}
            {without.length > 0 && <p className="font-mono text-sm text-dim">Not listed yet: {without.map((r) => r.title.toLowerCase()).join(', ')}.</p>}
          </div>
        </section>
        <section aria-labelledby="contact" className="border-t border-line pt-10">
          <H id="contact">Contact</H>
          <div className="mt-5"><Suspense fallback={<p className="font-mono text-sm text-dim">loading...</p>}><ContactPanel hideTitle /></Suspense></div>
        </section>
      </main>
      <footer className="border-t border-line px-4 py-6 text-center font-mono text-xs text-dim">{SITE.name} // {SITE.project} // {SITE.node}</footer>
    </div>
  );
}
