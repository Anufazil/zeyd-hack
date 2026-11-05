import { HASHES, SALT } from '../data/generated.js';
const BASE = import.meta.env?.VITE_API_URL || '';
const hex = (buf) => [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');

// Verifies on the server when VITE_API_URL is set; otherwise compares salted hashes locally (MVP).
export async function verifyFlag(id, input) {
  const flag = String(input || '').trim().slice(0, 200);
  if (!/^ZEYD\{.+\}$/.test(flag)) return { ok: false, format: false };
  if (BASE) {
    const r = await fetch(`${BASE}/api/verify`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, flag }) });
    if (r.status === 429) throw new Error('Too many attempts. Wait a minute and try again.');
    if (!r.ok) throw new Error('Verification service error. Try again shortly.');
    return { ok: !!(await r.json()).ok, format: true };
  }
  if (!globalThis.crypto?.subtle) throw new Error('Secure context required for verification (use https or localhost).');
  const d = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(`${SALT}:${id}:${flag}`));
  return { ok: hex(d) === HASHES[id], format: true };
}
