import { FRAGMENTS } from './generated.js';

export const CHALLENGES = [
  { id: 'c1', no: 1, slug: 'c01-encoded-identity', title: 'ENCODED IDENTITY', difficulty: 'Easy', requires: [],
    description: 'An intercepted message arrived at the archive. It is not meant to be read as is.',
    instructions: ['Decode the message.', 'Submit the flag it contains. Flags look like ZEYD{...}.', 'Tip: the terminal has a `decode` command.'],
    hints: ['The message ends with an equals sign. That is common in one encoding.', 'It is Base64.', 'Run `decode base64 <message>` in the terminal.'] },
  { id: 'c2', no: 2, slug: 'c02-source-hunt', title: 'SOURCE HUNT', difficulty: 'Easy', requires: ['c1'],
    description: 'This page shows only part of what it contains. Real investigators read what the browser does not display.',
    instructions: ['Inspect this page\u2019s HTML source (browser DevTools), or use the in-app source viewer.', 'Find the hidden trace and decode it.', 'Submit the flag.'],
    hints: ['Look for a comment and a data attribute.', 'The comment names the cipher that was used.', 'ROT13 shifts each letter by 13. `decode rot13 <text>` works in the terminal.'] },
  { id: 'c3', no: 3, slug: 'c03-digital-footprint', title: 'DIGITAL FOOTPRINT', difficulty: 'Medium', requires: ['c2'],
    description: 'Five files were recovered. One of them was produced by a tool nobody else on the team uses.',
    instructions: ['Open each file and read its metadata.', 'Find the odd one out and extract its hidden data.', 'Submit the flag.'],
    hints: ['Compare the Software field across files.', 'The suspicious file has a hex value hidden in its metadata.', 'Select the file, then run `decode hex <value>` in the terminal.'] },
  { id: 'c4', no: 4, slug: 'c04-password-puzzle', title: 'PASSWORD PUZZLE', difficulty: 'Medium', requires: ['c3'],
    description: 'A new password policy was published. Exactly one of five candidates satisfies every rule.',
    instructions: ['Check each candidate against all rules.', 'Submit the flag as ZEYD{<the valid password>}.'],
    hints: ['Rule 2 uses the leaked list shown on screen. Compare ignoring upper and lower case.', 'Keyboard walks are adjacent keys in a row. Count length carefully.', 'Look for a character repeated four or more times in a row.'] },
  { id: 'c5', no: 5, slug: 'c05-log-analysis', title: 'LOG ANALYSIS', difficulty: 'Medium', requires: ['c4'],
    description: 'The authentication log of a server was exported after an alert. Someone got in who should not have.',
    instructions: ['Analyze the simulated SSH log.', 'Find the source that failed many times and then succeeded.', 'Submit ZEYD{<ip>_<username>} for that source and the account it compromised.'],
    hints: ['Filter for "Failed" and look at which address dominates.', 'Several sources fail. Only one fails many times and then logs in.', 'The analyst tools show failures by source. Check what that source did after the success.'] },
  { id: 'c6', no: 6, slug: 'c06-network-investigation', title: 'NETWORK INVESTIGATION', difficulty: 'Hard', requires: ['c5'],
    description: 'A traffic capture from an internal network shows one host behaving like malware: regular check-ins, then a large upload.',
    instructions: ['Analyze the simulated traffic dataset.', 'Separate the legitimate patterns from the suspicious one.', 'Submit ZEYD{<internal-host>_<external-ip>_<port>}.'],
    hints: ['Look for small packets of identical size at regular intervals.', 'Legitimate traffic mostly uses well-known ports. Check the unusual one.', 'Use the summary by connection, then find the one that ends in a huge upload.'] },
  { id: 'c7', no: 7, slug: 'c07-final-investigation', title: 'FINAL INVESTIGATION', difficulty: 'Hard', requires: ['c1', 'c2', 'c3', 'c4', 'c5', 'c6'],
    description: 'Every solved challenge left a fragment of the subject\u2019s identity. Combine the evidence.',
    instructions: ['Collect the fragments from the evidence board. Each one has a position.', 'Join them in position order to form the subject\u2019s name.', 'Submit ZEYD{<name in lowercase>}.'],
    hints: ['Order fragments by their position number.', 'Fragments are one to two letters each.', 'Six fragments make up a single first name.'] },
];

export const fragmentOf = (id) => { try { const [pos, txt] = atob(FRAGMENTS[id]).split(':'); return { pos: Number(pos), txt }; } catch { return null; } };
export const isUnlockedCh = (c, solved) => c.requires.every((r) => solved.includes(r));
