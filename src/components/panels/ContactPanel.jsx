import { useState } from 'react';
import { Github, Linkedin, Mail } from 'lucide-react';
import { SITE } from '../../config/site.js';
import { submitContact, validateContact } from '../../lib/api.js';

const EMPTY = { name: '', email: '', subject: '', message: '' };
const Field = ({ id, label, error, children }) => (<div><label htmlFor={id} className="block font-mono text-xs text-dim">{label}</label>{children}{error && <p id={`${id}-err`} role="alert" className="mt-1 text-xs text-danger">{error}</p>}</div>);
const cls = 'mt-1 w-full border border-line bg-bg px-3 py-2 font-mono text-sm text-ink outline-none focus:border-term';

export default function ContactPanel({ hideTitle = false }) {
  const [f, setF] = useState(EMPTY);
  const [err, setErr] = useState({});
  const [status, setStatus] = useState({ s: 'idle', msg: '' });
  const set = (k) => (e) => setF((v) => ({ ...v, [k]: e.target.value }));
  const submit = async (e) => {
    e.preventDefault();
    const v = validateContact(f); setErr(v);
    if (Object.keys(v).length) return;
    setStatus({ s: 'sending', msg: '' });
    try { await submitContact(f); setStatus({ s: 'ok', msg: 'Message delivered.' }); setF(EMPTY); }
    catch (x) { setStatus({ s: 'error', msg: x.message }); }
  };
  const { email, github, linkedin } = SITE.contact;
  return (
    <div>
      {!hideTitle && <h2 className="font-mono text-lg text-term">/contact // SECURE CHANNEL</h2>}
      <p className="mt-2 font-mono text-xs leading-5 text-dim">CONNECTION: <span className="text-term">READY</span><br />CHANNEL: <span className="text-term">OPEN</span></p>
      <p className="mt-4 max-w-prose font-sans text-sm text-ink">Interested in collaborating, discussing cybersecurity or building something together?</p>
      <form onSubmit={submit} noValidate className="mt-5 max-w-lg space-y-4">
        <Field id="c-name" label="Name" error={err.name}><input id="c-name" className={cls} value={f.name} onChange={set('name')} maxLength={80} autoComplete="name" aria-describedby={err.name ? 'c-name-err' : undefined} aria-invalid={!!err.name} /></Field>
        <Field id="c-email" label="Email" error={err.email}><input id="c-email" type="email" className={cls} value={f.email} onChange={set('email')} maxLength={120} autoComplete="email" aria-describedby={err.email ? 'c-email-err' : undefined} aria-invalid={!!err.email} /></Field>
        <Field id="c-subject" label="Subject" error={err.subject}><input id="c-subject" className={cls} value={f.subject} onChange={set('subject')} maxLength={120} aria-describedby={err.subject ? 'c-subject-err' : undefined} aria-invalid={!!err.subject} /></Field>
        <Field id="c-message" label="Message" error={err.message}><textarea id="c-message" rows={5} className={cls} value={f.message} onChange={set('message')} maxLength={2000} aria-describedby={err.message ? 'c-message-err' : undefined} aria-invalid={!!err.message} /></Field>
        <button disabled={status.s === 'sending'} className="border border-term px-6 py-2 font-mono text-sm text-term transition hover:bg-term hover:text-bg disabled:opacity-50">{status.s === 'sending' ? 'Sending...' : 'Send message'}</button>
        <p aria-live="polite" className={`font-mono text-xs ${status.s === 'ok' ? 'text-term' : 'text-danger'}`}>{status.msg}</p>
        <p className="font-sans text-xs text-sage">Messages are sent over HTTPS once the backend is deployed. Do not include passwords or secrets.</p>
      </form>
      <div className="mt-6 flex flex-wrap gap-4 border-t border-line pt-4 font-mono text-xs">
        {[[Mail, 'Email', email && `mailto:${email}`], [Github, 'GitHub', github], [Linkedin, 'LinkedIn', linkedin]].map(([I, l, h]) => h
          ? <a key={l} href={h} target={l === 'Email' ? undefined : '_blank'} rel="noreferrer noopener" className="flex items-center gap-2 text-term hover:underline"><I size={14} />{l}</a>
          : <span key={l} className="flex items-center gap-2 text-warn"><I size={14} />{l}: not yet configured</span>)}
      </div>
    </div>
  );
}
