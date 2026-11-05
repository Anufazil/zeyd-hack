// API abstraction. Set VITE_API_URL in .env when the backend exists (Stage 3/4).
const BASE = import.meta.env?.VITE_API_URL || '';
const clean = (v, max) => String(v || '').replace(/[\u0000-\u001f\u007f]/g, ' ').replace(/[<>]/g, '').trim().slice(0, max);

export function validateContact(f) {
  const e = {};
  if (clean(f.name, 80).length < 2) e.name = 'Enter your name (2+ characters).';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(clean(f.email, 120))) e.email = 'Enter a valid email address.';
  if (clean(f.subject, 120).length < 3) e.subject = 'Enter a subject (3+ characters).';
  if (clean(f.message, 2000).length < 10) e.message = 'Write a message (10+ characters).';
  return e;
}

export async function submitContact(f) {
  if (!BASE) throw new Error('The contact backend is not connected yet. Use the direct links below.');
  const body = { name: clean(f.name, 80), email: clean(f.email, 120), subject: clean(f.subject, 120), message: clean(f.message, 2000) };
  const res = await fetch(`${BASE}/api/contact`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  if (!res.ok) throw new Error(res.status === 429 ? 'Too many messages. Try again later.' : 'The server rejected the message. Try again shortly.');
  return res.json();
}
