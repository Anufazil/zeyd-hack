// Deterministic simulated datasets. All addresses are documentation ranges (RFC 5737/1918): nothing real is involved.
function rng(seed) { let s = seed; return () => ((s = (s * 1664525 + 1013904223) % 4294967296) / 4294967296); }

export function buildLogs() {
  const r = rng(7), out = [];
  const pad = (n) => String(n).padStart(2, '0');
  let t = 3 * 3600;
  const ts = () => { t += 1 + Math.floor(r() * 40); return `2026-10-14 ${pad(Math.floor(t / 3600) % 24)}:${pad(Math.floor(t / 60) % 60)}:${pad(t % 60)}`; };
  const pid = () => 1000 + Math.floor(r() * 8000);
  const port = () => 40000 + Math.floor(r() * 20000);
  const ok = (u, ip) => out.push(`${ts()} sshd[${pid()}]: Accepted password for ${u} from ${ip} port ${port()} ssh2`);
  const bad = (u, ip) => out.push(`${ts()} sshd[${pid()}]: Failed password for ${u} from ${ip} port ${port()} ssh2`);
  ok('alice', '198.51.100.14'); ok('bob', '198.51.100.31');
  bad('bob', '198.51.100.31'); bad('bob', '198.51.100.31'); ok('bob', '198.51.100.31');
  ok('dana', '198.51.100.22');
  ['carol', 'carol', 'carol', 'carol', 'carol', 'carol'].forEach((u) => bad(u, '192.0.2.9'));
  ok('alice', '198.51.100.14');
  const names = ['admin', 'root', 'test', 'ubuntu', 'oracle', 'guest', 'postgres', 'deploy', 'git', 'backup', 'svc_backup', 'user'];
  for (let i = 0; i < 22; i++) bad(names[i % names.length], '203.0.113.77');
  out.push(`${ts()} sshd[${pid()}]: Accepted password for svc_backup from 203.0.113.77 port ${port()} ssh2`);
  out.push(`${ts()} sshd[${pid()}]: pam_unix(sshd:session): session opened for user svc_backup`);
  out.push(`${ts()} sudo: svc_backup : TTY=pts/0 ; COMMAND=/bin/cat /etc/shadow`);
  ok('dana', '198.51.100.22'); ok('alice', '198.51.100.14');
  return out;
}

export function buildPackets() {
  const r = rng(11), rows = [];
  const pubs = ['203.0.113.9', '203.0.113.40', '192.0.2.50', '192.0.2.77', '198.51.100.8'];
  for (let i = 0; i < 90; i++) {
    const src = `10.0.0.${5 + Math.floor(r() * 35)}`;
    if (src === '10.0.0.23') continue;
    const k = r();
    if (k < 0.45) rows.push([Math.floor(r() * 640), src, '10.0.0.2', 'UDP', 53, 70 + Math.floor(r() * 60)]);
    else if (k < 0.9) rows.push([Math.floor(r() * 640), src, pubs[Math.floor(r() * pubs.length)], 'TCP', 443, 400 + Math.floor(r() * 6000)]);
    else rows.push([Math.floor(r() * 640), src, `10.0.0.${5 + Math.floor(r() * 35)}`, 'TCP', 22, 300 + Math.floor(r() * 2000)]);
  }
  for (let i = 0; i < 10; i++) rows.push([30 + i * 300, '10.0.0.17', '192.0.2.50', 'TCP', 443, 512]); // legitimate update check
  rows.push([200, '10.0.0.31', '203.0.113.9', 'TCP', 443, 48200000]); // one big legitimate download
  for (let i = 0; i < 10; i++) rows.push([12 + i * 60, '10.0.0.23', '198.51.100.200', 'TCP', 4444, 64]); // beacon
  rows.push([640, '10.0.0.23', '198.51.100.200', 'TCP', 4444, 2400000]); // exfil burst
  rows.push([95, '10.0.0.23', '10.0.0.2', 'UDP', 53, 90]);
  return rows.sort((a, b) => a[0] - b[0]).map(([t, src, dst, proto, port, bytes]) => ({ t, src, dst, proto, port, bytes }));
}

export const FILES = [
  { name: 'team_photo.jpg', size: '2.1 MB', meta: { Author: 'Reception Desk', Software: 'Adobe Lightroom 12', Created: '2026-03-02', Comment: 'Annual team meetup' } },
  { name: 'logo_draft.png', size: '340 KB', meta: { Author: 'Design Team', Software: 'GIMP 2.10', Created: '2026-05-19', Comment: 'Draft v3, needs review' } },
  { name: 'notes_scan_0417.png', size: '88 KB', meta: { Author: 'unknown', Software: 'ZTrace Exporter 0.9', Created: '2026-04-17', Comment: null } },
  { name: 'diagram.png', size: '120 KB', meta: { Author: 'N. Admin', Software: 'Microsoft Paint', Created: '2026-01-11', Comment: 'network sketch' } },
  { name: 'wallpaper.jpg', size: '4.8 MB', meta: { Author: 'Stock Library', Software: 'Adobe Photoshop 24', Created: '2025-12-30', Comment: 'free to use' } },
];

export const PASSWORDS = [
  { id: 'A', pw: 'Password@12345' }, { id: 'B', pw: 'asdfghjkl1234!' }, { id: 'C', pw: 'Summer2024!' },
  { id: 'D', pw: 'violet-anvil-9-drift' }, { id: 'E', pw: 'aaaa1111bbbb2222' },
];
export const COMMON_LIST = ['123456', 'password', 'password@12345', 'qwerty123', 'letmein', 'welcome1', 'admin123', 'iloveyou'];
