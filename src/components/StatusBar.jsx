import { Menu, TerminalSquare } from 'lucide-react';
import { SITE } from '../config/site.js';

export default function StatusBar({ progress, cwd, onMenu, onToggleTerm, onDirect }) {
  return (
    <header className="flex flex-col border-b border-line bg-panel font-mono text-xs">
      <div className="flex items-center gap-3 px-3 py-2">
        <button onClick={onMenu} aria-label="Open file explorer" className="-m-1 p-2 text-dim hover:text-term md:hidden"><Menu size={18} /></button>
        <h1 className="text-xs font-bold text-term">{SITE.name} // SECURE ARCHIVE</h1>
        <span className="hidden text-dim lg:inline">SYSTEM STATUS: <span className="text-term">ONLINE</span></span>
        <span className="hidden text-dim lg:inline">IDENTITY: <span className="text-warn">CLASSIFIED</span></span>
        <span className="hidden text-dim sm:inline">ACCESS LEVEL: 01</span>
        {onDirect && <button onClick={onDirect} className="ml-auto hidden border border-line px-2 py-1 text-dim hover:border-muted hover:text-ink sm:block">direct access</button>}
        <span className="ml-auto text-dim sm:ml-2">PROGRESS <span className="text-term">{progress}%</span></span>
        <button onClick={onToggleTerm} aria-label="Toggle terminal" className="-m-1 p-2 text-dim hover:text-term md:hidden"><TerminalSquare size={18} /></button>
      </div>
      <div className="h-0.5 bg-line" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100} aria-label="Investigation progress">
        <div className="h-full bg-term transition-all duration-500" style={{ width: `${progress}%` }} />
      </div>
      <div className="px-3 py-1 text-sage">{cwd}</div>
    </header>
  );
}
