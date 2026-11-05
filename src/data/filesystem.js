import { ARSENAL } from './arsenal.js';
import { OPERATIONS } from './operations.js';
import { REPORTS } from './intelligence.js';
import { DOSSIER, isUnlocked } from './identity.js';
import { CHALLENGES } from './challenges.js';
import { progressOf } from '../lib/storage.js';
import { SITE } from '../config/site.js';

// File values: string | (state)=>string | { text, view?, open? }.  `open` is an id that counts toward progress.
const PANELS = ['/identity', '/arsenal', '/operations', '/intelligence', '/contact', '/challenges'];
export const isPanelDir = (p) => PANELS.includes(p);

const arsenalFiles = Object.fromEntries(ARSENAL.map((c) => [
  `${c.category.toLowerCase()}.mod`,
  { text: `${c.category.toUpperCase()} MODULES\n\n` + c.modules.map((x) => `- ${x.name}: ${x.description}${x.applied ? `\n    applied: ${x.applied}` : ''}\n    proficiency: not yet verified`).join('\n'), open: `mod:${c.category}`, view: { type: 'panel', path: '/arsenal' } },
]));
const opFiles = Object.fromEntries(OPERATIONS.map((o) => [
  `${o.slug}.case`,
  { text: `${o.code} // ${o.title}\n${o.summary}\n\nTech: ${o.tech.join(', ')}\nGitHub: ${o.github || '[not yet supplied]'}\nLive: ${o.live || '[not yet supplied]'}`, open: o.id, view: { type: 'operation', id: o.id } },
]));
const rptFiles = Object.fromEntries(REPORTS.map((r) => [
  `${r.slug}.rpt`,
  { text: `${r.title}\nSTATUS: ${r.status}\n\n${r.body.length ? r.body.join('\n') : 'No record has been supplied for this category.'}`, open: r.id, view: { type: 'document', id: r.id } },
]));
const chlFiles = Object.fromEntries(CHALLENGES.map((c) => [
  `${c.slug}.chl`,
  { text: `CHALLENGE ${String(c.no).padStart(2, '0')} // ${c.title}\nDifficulty: ${c.difficulty}\n\n${c.description}\n\n${c.instructions.join('\n')}`, view: { type: 'challenge', id: c.id }, lockedBy: c.requires },
]));
const dossier = (state) => {
  const p = progressOf(state);
  return 'SUBJECT INFORMATION\n\n' + DOSSIER.map((f) => `${(f.key + ':').padEnd(17)}${isUnlocked(f, p, (state.solved || []).includes('c7')) ? f.value : '[CLASSIFIED]'}`).join('\n') + '\n\nAUTHORIZATION: ' + (DOSSIER.some((f) => !isUnlocked(f, p, (state.solved || []).includes('c7'))) ? 'PARTIAL. Keep investigating.' : 'COMPLETE');
};

// Data-driven virtual file system. Stage 2/3 content plugs in here.
export const DIRS = {
  '/root': {
    desc: 'System core and entry notes.',
    files: {
      'README.txt': SITE.name + ' // SECURE ARCHIVE\nNODE_001 - classification RESTRICTED.\n\nThis archive holds traces of one subject.\nExplore each directory. Run `recon` to look for what is not listed.\nType `help` for commands.',
      'boot.log': '[ok] kernel secure-mode\n[ok] modules loaded: 7\n[ok] identity.db mounted read-only\n[!!] identity.db: encrypted\n[ok] investigation shell ready',
    },
    hidden: {
      '.trace': 'TRACE FRAGMENT 01\n\nFragments are scattered across the archive.\nEach solved challenge adds one to your evidence.\nChallenges are waiting in /challenges.',
    },
  },
  '/identity': {
    desc: 'Subject dossier. Authorization required.',
    files: {
      'dossier.enc': { text: dossier, view: { type: 'panel', path: '/identity' } },
    },
  },
  '/arsenal': {
    desc: 'Technical modules. ',
    files: arsenalFiles,
  },
  '/operations': {
    desc: 'Project case files. ',
    files: opFiles,
  },
  '/intelligence': {
    desc: 'Reports and records. ',
    files: rptFiles,
  },
  '/challenges': {
    desc: 'Seven CTF challenges. Each solved one unlocks the next.',
    files: { 'status.txt': { text: (st) => `CHALLENGE ENGINE: ONLINE\n${(st.solved || []).length} of 7 solved.\nFlag format: ZEYD{...}`, view: { type: 'panel', path: '/challenges' } }, ...chlFiles },
  },
  '/contact': {
    desc: 'Secure channel to the subject.',
    files: { 'channel.txt': { text: 'SECURE CHANNEL: OPEN\nUse the form in the workspace to send a message.', view: { type: 'panel', path: '/contact' } } },
  },
};

export const DIR_PATHS = Object.keys(DIRS);

export const HINTS = [
  'Begin with reconnaissance: run `recon`.',
  'Hidden files do not show in `ls`. Look for what recon finds.',
  'Read files with `cat <file>`. Enter directories with `cd <dir>`.',
  'Try `decode base64 <text>` on any encoded string you find.',
  'Visit every directory. Progress counts each one.',
];
