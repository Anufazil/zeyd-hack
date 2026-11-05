import { Folder, FolderOpen, Lock } from 'lucide-react';
import { DIR_PATHS } from '../data/filesystem.js';

export default function Explorer({ cwd, visited, onNavigate }) {
  return (
    <nav aria-label="File explorer" className="flex h-full flex-col bg-panel font-mono text-sm">
      <div className="border-b border-line px-4 py-3 text-xs text-dim">EXPLORER</div>
      <ul className="thin-scroll flex-1 overflow-y-auto p-2">
        <li><button onClick={() => onNavigate('/')} className={`flex w-full items-center gap-2 px-2 py-2 text-left hover:bg-line/50 ${cwd === '/' ? 'text-term' : 'text-ink'}`}>~ /</button></li>
        {DIR_PATHS.map((p) => {
          const active = cwd === p, seen = visited.includes(p);
          const Icon = active ? FolderOpen : Folder;
          return (
            <li key={p}>
              <button onClick={() => onNavigate(p)} aria-current={active ? 'page' : undefined} className={`flex w-full items-center gap-2 border-l-2 px-2 py-2.5 text-left hover:bg-line/50 ${active ? 'border-term bg-line/40 text-term' : 'border-transparent'} ${seen && !active ? 'text-ink' : !active ? 'text-dim' : ''}`}>
                <Icon size={15} aria-hidden="true" />{p}
                {p === '/identity' && <Lock size={12} className="ml-auto text-warn" aria-label="locked" />}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
