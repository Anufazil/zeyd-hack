import { DIRS, DIR_PATHS, HINTS, isPanelDir } from '../data/filesystem.js';
import { SITE } from '../config/site.js';
import { progressOf } from './storage.js';

export const COMMANDS = ['help','whoami','ls','pwd','cd','cat','clear','scan','status','history','matrix','decode','hint','progress','recon','exit'];
const L = (kind, text) => ({ kind, text });

export function resolveDir(cwd, arg) {
  if (!arg || arg === '/') return '/';
  if (arg === '~') return '/';
  if (arg === '..') return '/';
  if (arg === '.') return cwd;
  const clean = arg.replace(/\/+$/, '');
  const abs = clean.startsWith('/') ? clean : '/' + clean;
  return DIRS[abs] ? abs : null;
}

export function listNames(cwd, state, all = false) {
  if (cwd === '/') return DIR_PATHS;
  const d = DIRS[cwd];
  const names = Object.keys(d.files);
  if (all || state.recon) names.push(...Object.keys(d.hidden || {}));
  return names;
}

function findFile(cwd, arg, state) {
  // supports `cat name`, `cat /dir/name`
  let dir = cwd, name = arg;
  if (arg.includes('/')) {
    const i = arg.lastIndexOf('/');
    dir = arg.slice(0, i) || '/';
    name = arg.slice(i + 1);
    if (!DIRS[dir]) return null;
  }
  const d = DIRS[dir];
  if (!d) return null;
  const raw = d.files[name] !== undefined ? d.files[name] : state.recon ? d.hidden?.[name] : undefined;
  if (raw === undefined) return null;
  const o = typeof raw === 'object' ? raw : { text: raw };
  return { dir, name, text: typeof o.text === 'function' ? o.text(state) : o.text, view: o.view, open: o.open, lockedBy: o.lockedBy };
}

// Returns { lines, patch (state changes), cwd, view, clear, exit }
export function execute(raw, ctx) {
  const { cwd, state } = ctx;
  const [cmd, ...args] = raw.trim().split(/\s+/);
  const arg = args.join(' ');
  const out = { lines: [], patch: {}, cwd, view: null, clear: false, exit: false };
  const say = (kind, text) => out.lines.push(L(kind, text));

  switch (cmd.toLowerCase()) {
    case 'help':
      say('out', 'AVAILABLE COMMANDS');
      [['help','list commands'],['whoami','identify the subject'],['ls [-a]','list directory'],['pwd','print location'],['cd <dir>','change directory'],['cat <file>','read a file'],['scan','sweep the network'],['recon','reconnaissance'],['decode <type> <text>','base64 | hex | rot13'],['hint','request a hint'],['status / progress','system and investigation state'],['history','command history'],['matrix','visual diversion'],['clear','clear terminal'],['exit','return to access screen']]
        .forEach(([c, d]) => say('out', `  ${c.padEnd(22)}${d}`));
      break;
    case 'whoami':
      if ((state.solved || []).includes('c7')) { say('ok', 'ALIAS: ZEYDAC'); say('ok', 'IDENTITY: ANUFAZIL'); say('out', 'CLASSIFICATION: CYBERSECURITY ENTHUSIAST'); break; }
      if (state.recon) { say('err', 'ACCESS DENIED.'); say('out', 'Identity information is encrypted.'); say('warn', 'Collect more evidence. Solve the challenges in /challenges.'); }
      else { say('err', 'ACCESS DENIED.'); say('out', 'Identity information is encrypted.'); say('warn', 'Hint: Begin with reconnaissance.'); }
      break;
    case 'pwd': say('out', cwd); break;
    case 'ls': {
      const all = args.includes('-a');
      listNames(cwd, state, all).forEach((n) => say('out', n));
      if (cwd !== '/') out.view = isPanelDir(cwd) ? { type: 'panel', path: cwd } : { type: 'dir', path: cwd };
      break;
    }
    case 'cd': {
      const target = resolveDir(cwd, arg);
      if (target === null) { say('err', `cd: no such directory: ${arg}`); break; }
      out.cwd = target;
      out.view = target === '/' ? { type: 'home' } : isPanelDir(target) ? { type: 'panel', path: target } : { type: 'dir', path: target };
      if (target === '/identity') { say('warn', 'IDENTITY DATABASE FOUND.'); say('out', ''); say('err', 'Authorization required.'); }
      else if (target !== '/') say('ok', `${target}: ${DIRS[target].desc}`);
      if (target !== '/' && !state.visited.includes(target)) out.patch.visited = [...state.visited, target];
      break;
    }
    case 'cat': {
      if (!arg) { say('err', 'cat: missing file name. Try `ls` first.'); break; }
      const f = findFile(cwd, arg, state);
      if (!f) { say('err', `cat: ${arg}: no such file`); break; }
      if (f.lockedBy && !f.lockedBy.every((r) => (state.solved || []).includes(r))) { say('err', 'LOCKED. Solve the previous challenge first.'); break; }
      f.text.split('\n').forEach((t) => say('out', t));
      out.view = f.view || { type: 'file', path: f.dir, name: f.name, text: f.text };
      if (f.open && !(state.opened || []).includes(f.open)) out.patch.opened = [...(state.opened || []), f.open];
      if (f.name === '.trace') out.patch.traceRead = true;
      break;
    }
    case 'clear': out.clear = true; break;
    case 'scan':
      say('ok', 'Scanning NODE_001 ...');
      [['22/tcp','CLOSED'],['80/tcp','OPEN   portfolio-gateway'],['443/tcp','OPEN   tls-archive'],['8080/tcp','FILTERED'],['31337/tcp','OPEN   ???  (not routable)']].forEach(([p, s]) => say('out', `  ${p.padEnd(10)}${s}`));
      say('warn', 'Simulated environment. No real hosts were contacted.');
      out.patch.scanned = true;
      break;
    case 'recon':
      say('ok', 'Running reconnaissance...');
      say('out', '  identity.db   encrypted, read-only');
      say('out', '  directories   7 mapped');
      say('out', '  hidden files  1 found: /root/.trace');
      say('warn', 'Try: cat /root/.trace');
      out.patch.recon = true;
      break;
    case 'status':
      say('out', `SYSTEM STATUS    ONLINE`);
      say('out', `NODE             ${SITE.node}`);
      say('out', `IDENTITY         CLASSIFIED`);
      say('out', `ACCESS LEVEL     01`);
      say('out', `CLASSIFICATION   ${SITE.classification}`);
      break;
    case 'progress': {
      const p = progressOf({ ...state, ...out.patch });
      say('out', `INVESTIGATION PROGRESS: ${p}%`);
      say('out', `  directories ${state.visited.length}/7   opened ${(state.opened || []).length}   solved ${(state.solved || []).length}/7   recon ${state.recon ? 'yes' : 'no'}   scan ${state.scanned ? 'yes' : 'no'}   trace ${state.traceRead ? 'yes' : 'no'}`);
      break;
    }
    case 'history':
      if (!state.history.length) say('out', 'No commands yet.');
      state.history.forEach((h, i) => say('out', `${String(i + 1).padStart(3)}  ${h}`));
      break;
    case 'hint': {
      const i = Math.min(state.hintIdx, HINTS.length - 1);
      say('warn', `HINT ${i + 1}/${HINTS.length}: ${HINTS[i]}`);
      out.patch.hintIdx = Math.min(state.hintIdx + 1, HINTS.length - 1);
      break;
    }
    case 'decode': {
      const [type, ...rest] = args; const text = rest.join(' ');
      if (!type || !text) { say('err', 'usage: decode <base64|hex|rot13> <text>'); break; }
      try {
        let res;
        if (type === 'base64') res = new TextDecoder().decode(Uint8Array.from(atob(text), (c) => c.charCodeAt(0)));
        else if (type === 'hex') res = text.replace(/\s/g, '').match(/../g).map((h) => String.fromCharCode(parseInt(h, 16))).join('');
        else if (type === 'rot13') res = text.replace(/[a-z]/gi, (c) => String.fromCharCode((c <= 'Z' ? 90 : 122) >= (c = c.charCodeAt(0) + 13) ? c : c - 26));
        else { say('err', `decode: unknown type '${type}'. Use base64, hex or rot13.`); break; }
        say('ok', `DECODED: ${res}`);
      } catch { say('err', 'decode: input is not valid for that encoding.'); }
      break;
    }
    case 'matrix': out.view = { type: 'matrix' }; say('ok', 'Entering the matrix. Press any key or click to leave.'); break;
    case 'exit': out.exit = true; say('out', 'Closing session...'); break;
    default:
      say('err', `${cmd}: command not found. Type \`help\` for the list.`);
  }
  return out;
}

export function complete(input, cwd, state) {
  const parts = input.split(/\s+/);
  const last = parts[parts.length - 1];
  const pool = parts.length === 1 ? COMMANDS
    : ['cd'].includes(parts[0]) ? DIR_PATHS.map((p) => (cwd === '/' ? p.slice(1) : p))
    : parts[0] === 'cat' ? listNames(cwd, state) : parts[0] === 'decode' ? ['base64', 'hex', 'rot13'] : [];
  const m = pool.filter((p) => p.startsWith(last));
  if (m.length === 1) return { text: [...parts.slice(0, -1), m[0]].join(' '), options: [] };
  return { text: input, options: m };
}
