// Layout engine for the start-screen "data wall": a dense typographic collage of hacker-flavoured data,
// like a wall of text. Pure functions (no DOM), so it is testable. A new seed gives a new wall.
export const FAMS = { mono: '"JetBrains Mono", ui-monospace, monospace', sans: 'Inter, system-ui, sans-serif' };
export const HIDDEN_COUNT = 10;

export function rng(seed) {
  let a = seed >>> 0;
  return () => { a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
const pick = (r, a) => a[Math.floor(r() * a.length)];
const int = (r, a, b) => a + Math.floor(r() * (b - a + 1));

// Decorative text must never echo challenge answers or flag material.
const FORBIDDEN = ['203.0.113.77', '198.51.100.200', 'svc_backup', '10.0.0.23', '4444', 'violet', 'anvil', 'ZEYD{', 'ZEYDAC'];
const safe = (t) => !FORBIDDEN.some((f) => t.toLowerCase().includes(f.toLowerCase()));

const HEADLINES = ['ZERO TRUST', 'ENCRYPTION', 'FIREWALL', 'MALWARE', 'PHISHING', 'RANSOMWARE', 'THREAT INTEL', 'FORENSICS', 'SOC', 'SIEM', 'EXPLOIT', 'PAYLOAD', 'BOTNET', 'ROOTKIT', 'INCIDENT RESPONSE', 'ACCESS DENIED', 'CLASSIFIED', 'REDACTED', 'ENCRYPTED', 'NODE_001', 'TRACE', 'ASSUME BREACH', 'DEFENSE IN DEPTH', 'LEAST PRIVILEGE', 'PENTEST', 'HONEYPOT', 'SANDBOX', 'DECRYPT', 'ROOT', 'OVERFLOW', 'INJECTION', 'SPOOFING', 'HASH', 'CIPHER', 'THREAT HUNTING'];
const TERMS = ['SIEM', 'SOC', 'EDR', 'XDR', 'IOC', 'TTP', 'CVE', 'CVSS', 'OWASP', 'MITRE ATT&CK', 'KILL CHAIN', 'ZERO TRUST', 'THREAT HUNTING', 'INCIDENT RESPONSE', 'DIGITAL FORENSICS', 'MALWARE', 'RANSOMWARE', 'PHISHING', 'BOTNET', 'ROOTKIT', 'EXPLOIT', 'PAYLOAD', 'C2 BEACON', 'EXFILTRATION', 'LATERAL MOVEMENT', 'PRIVILEGE ESCALATION', 'PERSISTENCE', 'SANDBOX', 'HONEYPOT', 'FIREWALL', 'IDS', 'IPS', 'VPN', 'TLS 1.3', 'AES-256', 'RSA-2048', 'SHA-256', 'HMAC', 'PKI', 'MFA', 'SSO', 'OAUTH 2.0', 'JWT', 'XSS', 'CSRF', 'SQL INJECTION', 'SSRF', 'RCE', 'LFI', 'IDOR', 'BUFFER OVERFLOW', 'DDOS', 'MITM', 'PACKET CAPTURE', 'SOCIAL ENGINEERING', 'PENTEST', 'RED TEAM', 'BLUE TEAM', 'PURPLE TEAM', 'CTF', 'THREAT INTEL', 'LOG ANALYSIS', 'SYSLOG', 'SPLUNK', 'WIRESHARK', 'NMAP', 'BURP SUITE', 'METASPLOIT', 'SNORT', 'SURICATA', 'ZEEK', 'YARA', 'SIGMA RULES', 'HARDENING', 'PATCH MGMT', 'VULN SCAN', 'DMZ', 'NAT', 'DNS', 'ARP SPOOFING', 'PORT SCAN', 'BRUTE FORCE', 'CREDENTIAL STUFFING', 'ZERO DAY', 'APT', 'DFIR', 'SANITIZE INPUT', 'ENTROPY'];
const CMDS = ['nmap -sV -p- 192.0.2.0/24', 'tcpdump -i eth0 port 443', 'grep -i "failed password" auth.log', 'chmod 600 ~/.ssh/id_ed25519', 'sudo ufw enable', 'openssl enc -aes-256-cbc -salt', 'curl -I https://example.com', 'whoami && id', "cut -d: -f1 /etc/passwd", 'netstat -tulpn', 'ssh-keygen -t ed25519', 'john --wordlist=rockyou.txt hashes', 'hashcat -m 0 -a 0 hash.txt', 'journalctl -u sshd --since today', 'iptables -L -n -v', 'dig +short A example.com', 'ps aux | grep -v grep', 'base64 -d blob.b64', 'strings sample.bin | head', 'git log --oneline', 'tail -f /var/log/syslog', 'chown root:root /etc/shadow', 'find / -perm -4000 2>/dev/null', 'sha256sum -c checksums.txt', 'fail2ban-client status sshd', 'ss -ltn', 'last -n 20', 'zeek -r capture.pcap', 'yara -r rules.yar ./samples'];
const QUOTES = ['Every system leaves a trace.', 'Trust nothing. Verify everything.', 'Security is a process, not a product.', 'The weakest link is human.', 'Assume breach.', 'Defense in depth.', 'Least privilege.', 'Know thy enemy.', 'Patch early. Patch often.', "Logs don't lie.", 'Hack the planet.', 'Think like an attacker. Defend like a pro.', 'Encrypt everything.', 'Silence is not security.', 'Complexity is the enemy of security.', 'Detect. Contain. Eradicate. Recover.', 'Curiosity is a security skill.', 'Show me the logs.'];
const STATUS = ['[ OK ]', '[ !! ]', '[ FAIL ]', 'ACCESS DENIED', 'ACCESS GRANTED', 'ENCRYPTED', 'CLASSIFIED', 'REDACTED', 'UNKNOWN', 'TRACE', 'NODE_001', 'RESTRICTED', 'LOCKED', 'VERIFIED', 'ALERT', 'QUARANTINED', 'root@node:~#', '>>>', 'SIGNAL LOST', 'AUTH REQUIRED', 'CHECKSUM OK', 'TIMEOUT', 'HANDSHAKE', 'PACKET DROPPED'];
const CVES = ['CVE-2014-0160 Heartbleed', 'CVE-2017-0144 EternalBlue', 'CVE-2021-44228 Log4Shell', 'CVE-2014-6271 Shellshock', 'CVE-2016-5195 Dirty COW', 'CVE-2019-0708 BlueKeep', 'CVE-2020-1472 Zerologon', 'OWASP A01 Broken Access Control', 'OWASP A03 Injection', 'OWASP A07 Auth Failures'];
const FILLERS = ['::', '//', '>>', '--', '..', '0x', '[]', '{}', '<>', '|', '#', '~', '/*', '*/', '&&', '||', '=>'];
const LOGS = ['Failed password for admin from', 'Accepted publickey for deploy from', 'Connection closed by', 'Invalid user guest from', 'blocked inbound tcp from', 'ALERT outbound dns tunnel suspected', 'GET /login HTTP/1.1 200', 'POST /api/auth HTTP/1.1 401', 'GET /admin HTTP/1.1 403', 'TLS handshake failed with'];

const hex = (r, n) => Array.from({ length: n }, () => int(r, 0, 255).toString(16).padStart(2, '0')).join('');
function ip(r) {
  for (;;) {
    const v = pick(r, [`192.0.2.${int(r, 1, 254)}`, `198.51.100.${int(r, 1, 254)}`, `203.0.113.${int(r, 1, 254)}`, `10.${int(r, 0, 9)}.${int(r, 0, 9)}.${int(r, 2, 250)}`]);
    if (safe(v)) return v;
  }
}
function genText(r, kind) {
  switch (kind) {
    case 'term': return pick(r, TERMS);
    case 'cmd': return pick(r, CMDS);
    case 'quote': return pick(r, QUOTES);
    case 'status': return pick(r, STATUS);
    case 'cve': return pick(r, CVES);
    case 'hash': return hex(r, pick(r, [8, 12, 16]));
    case 'hex': return `0x${hex(r, 4)}  ${hex(r, 1)} ${hex(r, 1)} ${hex(r, 1)} ${hex(r, 1)} ${hex(r, 1)}`;
    case 'ip': return `${ip(r)}:${pick(r, [22, 53, 80, 443, 445, 3306, 3389, 8080, 8443])}`;
    case 'bin': return Array.from({ length: int(r, 2, 5) }, () => int(r, 0, 255).toString(2).padStart(8, '0')).join(' ');
    case 'log': return `${pick(r, LOGS)} ${ip(r)}`;
    default: return 'TRACE';
  }
}
const KINDS = {
  small: [['term', 18], ['cmd', 14], ['log', 16], ['hash', 8], ['hex', 8], ['ip', 10], ['quote', 6], ['status', 10], ['bin', 5], ['cve', 5]],
  mid: [['term', 35], ['quote', 20], ['status', 15], ['cmd', 15], ['cve', 10], ['ip', 5]],
};
function weighted(r, list) { let t = list.reduce((s, [, w]) => s + w, 0) * r(); for (const [k, w] of list) { if ((t -= w) < 0) return k; } return list[0][0]; }

const COLORS = [['#6FA98A', 0.55], ['#497D62', 0.95], ['#82948A', 0.5], ['#DCE5DF', 0.35], ['#00FF88', 0.55], ['#497D62', 0.6]];
export function styleFor(r, kind, size, plainOnly = false) {
  const [color, opacity] = pick(r, COLORS);
  const family = (kind === 'quote' || (kind === 'term' && r() < 0.3)) ? 'sans' : 'mono';
  const weight = r() < 0.22 ? 700 : 400;
  let mode = 'plain';
  if (!plainOnly) {
    const t = r();
    if (t < 0.06) mode = 'inverse'; else if (t < 0.1 && size >= 16) mode = 'outline';
    else if (kind === 'status' && t < 0.2) mode = r() < 0.5 ? 'warn' : 'danger';
  }
  return { color, opacity, family, weight, mode, flick: !plainOnly && r() < 0.04 };
}
export const padOf = (style) => (style.mode === 'inverse' ? 8 : 0);

function planRows(r, H) {
  const rows = []; let y = 0;
  while (y < H) {
    const t = r(); let type, size;
    if (t < 0.06) { type = 'head'; size = int(r, 26, 58); } else if (t < 0.3) { type = 'mid'; size = int(r, 17, 26); } else { type = 'small'; size = int(r, 11, 15); }
    const h = Math.round(size * 1.28);
    rows.push({ type, size, y, h, hide: false });
    y += h + (type === 'small' ? 1 : 3);
  }
  return rows;
}

export function buildWall({ W, H, panel, seed, measure }) {
  const r = rng(seed);
  const rows = planRows(r, H);
  const pad = panel ? { x0: panel.x - 14, x1: panel.x + panel.w + 14, y0: panel.y - 14, y1: panel.y + panel.h + 14 } : null;
  const hiddenSpec = chooseHiddenRows(r, rows, W, H, pad, measure);
  const items = [];

  const makeItem = (row, x, text, style, kind) => ({ x, y: row.y, w: 0, h: row.h, size: row.size, text, style, kind });
  const widthOf = (text, size, style) => measure(text, size, style.weight, style.family) + padOf(style);

  function fillSpan(row, x0, x1) {
    if (x1 - x0 < row.size * 1.5) return;
    const gap = Math.max(6, Math.round(row.size * 0.7));
    const span = []; let x = x0;
    for (let guard = 0; guard < 400; guard++) {
      let placed = false;
      for (let t = 0; t < 14 && !placed; t++) {
        let text, kind;
        if (row.type === 'head') { kind = r() < 0.75 ? 'head' : 'filler'; text = kind === 'head' ? pick(r, HEADLINES) : pick(r, FILLERS); } else { kind = weighted(r, KINDS[row.type]); text = genText(r, kind); }
        const sz = row.type === 'small' && r() < 0.15 ? Math.max(10, row.size - int(r, 1, 2)) : row.size;
        const style = styleFor(r, kind === 'head' ? 'term' : kind, sz);
        if (kind === 'head') { style.family = 'sans'; style.weight = 700; }
        if (!safe(text)) continue;
        const w = widthOf(text, sz, style);
        if (x + w <= x1) { const it = makeItem(row, x, text, style, kind); it.w = w; it.size = sz; span.push(it); x += w + gap; placed = true; }
      }
      if (!placed) break;
    }
    let end = x - gap;
    // fill remaining space with small filler tokens, then justify
    for (let g = 0; g < 12 && x1 - end > row.size * 2.2; g++) {
      const text = pick(r, FILLERS); const style = styleFor(r, 'status', row.size, true); const w = widthOf(text, row.size, style);
      if (end + gap + w > x1) break;
      const it = makeItem(row, span.length ? end + gap : x0, text, style, 'filler'); it.w = w; span.push(it); end = it.x + w;
    }
    const left = x1 - end;
    if (span.length > 1 && left > 0) { const add = Math.min(left / (span.length - 1), row.size * 1.6); span.forEach((it, i) => { it.x += add * i; }); }
    items.push(...span);
  }

  rows.forEach((row, i) => {
    const specs = (hiddenSpec.get(i) || []).sort((a, b) => a.x - b.x);
    const gap = Math.max(6, row.size * 0.7); let cursor = 0;
    specs.forEach((spec) => {
      fillSpan(row, cursor, spec.x - gap);
      items.push({ ...makeItem(row, spec.x, 'ZEYDAC', spec.style, 'hidden'), w: spec.w, hiddenIndex: -1 });
      cursor = spec.x + spec.w + gap;
    });
    fillSpan(row, cursor, W);
  });

  const hidden = items.filter((it) => it.kind === 'hidden').sort((a, b) => a.y - b.y || a.x - b.x);
  hidden.forEach((it, i) => { it.hiddenIndex = i; });
  return { items: items.filter((it) => it.kind !== 'hidden'), hidden };
}

function chooseHiddenRows(r, rows, W, H, pad, measure) {
  const cands = [];
  rows.forEach((row, i) => {
    if (row.type === 'head' || row.size < 11 || row.y < 2 || row.y + row.h > H - 2) return;
    const style = styleFor(r, 'term', row.size, true);
    const w = measure('ZEYDAC', row.size, style.weight, style.family) + 6;
    const m = 4; let ivs;
    const overlaps = pad && row.y + row.h > pad.y0 && row.y < pad.y1;
    if (!overlaps) ivs = [[m, W - w - m]];
    else ivs = [[m, pad.x0 - w - 4], [pad.x1 + 4, W - w - m]];
    ivs = ivs.filter(([a, b]) => b - a > 4);
    if (ivs.length) cands.push({ i, row, w, style: { ...style, mode: 'plain' }, ivs });
  });
  const chosen = []; const used = new Set();
  const bands = HIDDEN_COUNT;
  for (let b = 0; b < bands; b++) {
    const lo = (H * b) / bands, hi = (H * (b + 1)) / bands;
    const inBand = cands.filter((c) => !used.has(c.i) && c.row.y >= lo && c.row.y < hi);
    if (inBand.length) { const c = pick(r, inBand); used.add(c.i); chosen.push(c); }
  }
  for (let minDist = 40; chosen.length < HIDDEN_COUNT && minDist >= 0; minDist -= 20) {
    const pool = cands.filter((c) => !used.has(c.i) && chosen.every((o) => Math.abs(o.row.y - c.row.y) >= minDist));
    while (chosen.length < HIDDEN_COUNT && pool.length) { const c = pool.splice(int(r, 0, pool.length - 1), 1)[0]; if (chosen.every((o) => Math.abs(o.row.y - c.row.y) >= minDist)) { used.add(c.i); chosen.push(c); } }
  }
  const spec = new Map();
  const place = (c, spacing = 90) => {
    const existing = spec.get(c.i) || [];
    for (let t = 0; t < 30; t++) {
      const total = c.ivs.reduce((sum, [a, b]) => sum + (b - a), 0); let k = r() * total; let x = c.ivs[0][0];
      for (const [a, b] of c.ivs) { if (k <= b - a) { x = a + k; break; } k -= b - a; }
      if (existing.every((e) => Math.abs(e.x - x) >= Math.max(e.w, c.w) + spacing)) { spec.set(c.i, [...existing, { x: Math.round(x), w: c.w, style: c.style }]); return true; }
    }
    return false;
  };
  chosen.slice(0, HIDDEN_COUNT).forEach(place);
  let count = [...spec.values()].reduce((n, a) => n + a.length, 0);
  // small screens: the centre card leaves few free rows, so allow a second word in a row (spaced apart)
  for (const spacing of [90, 50, 14]) {
    for (let tries = 0; count < HIDDEN_COUNT && tries < 500 && cands.length; tries++) { if (place(pick(r, cands), spacing)) count++; }
  }
  return spec;
}
