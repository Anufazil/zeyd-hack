// Usage: PEPPER=<secret> node scripts/make-hashes.mjs
// Reads private/flags.json and writes backend/hashes.json (peppered SHA-256) for server-side verification.
import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
const pepper = process.env.PEPPER;
if (!pepper) { console.error('Set PEPPER to a long random secret first.'); process.exit(1); }
const flags = JSON.parse(readFileSync('private/flags.json', 'utf8'));
const out = Object.fromEntries(Object.entries(flags).map(([id, f]) => [id, createHash('sha256').update(`${pepper}:${id}:${f}`).digest('hex')]));
writeFileSync('backend/hashes.json', JSON.stringify(out, null, 2));
console.log('wrote backend/hashes.json');
