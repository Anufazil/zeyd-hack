import { memo, useEffect, useRef, useState } from 'react';
import { buildWall, FAMS, padOf } from '../lib/collage.js';

const base = (it) => ({ position: 'absolute', left: it.x, top: it.y, height: it.h, lineHeight: `${it.h}px`, fontSize: it.size, fontFamily: FAMS[it.style.family], fontWeight: it.style.weight, whiteSpace: 'nowrap' });
function textStyle(it) {
  const st = it.style, s = base(it);
  if (st.mode === 'inverse') return { ...s, background: st.color, color: '#050807', fontWeight: 700, padding: '0 4px', opacity: Math.min(1, st.opacity + 0.15) };
  if (st.mode === 'outline') return { ...s, color: 'transparent', WebkitTextStroke: `1px ${st.color}`, opacity: st.opacity };
  if (st.mode === 'warn') return { ...s, color: '#FFB000', opacity: 0.7 };
  if (st.mode === 'danger') return { ...s, color: '#FF4444', opacity: 0.7 };
  return { ...s, color: st.color, opacity: st.opacity };
}

// Decorative layer: hidden from assistive tech, never re-rendered when a trace is found.
const Decor = memo(function Decor({ items }) {
  return (
    <div aria-hidden="true" className="absolute inset-0 select-none overflow-hidden">
      {items.map((it, i) => <span key={i} className={it.style.flick ? 'wall-flick' : undefined} style={{ ...textStyle(it), '--o': it.style.opacity, animationDelay: it.style.flick ? `${(i % 9) * 0.7}s` : undefined }}>{it.text}</span>)}
    </div>
  );
});

// A dense wall of hacker-flavoured data. Every page load builds a new wall (random seed).
// Ten of the fragments are the word ZEYDAC, camouflaged in the style of their neighbours.
export default function DataWall({ panelRef, found, onFind }) {
  const box = useRef(null);
  const seed = useRef(((Math.random() * 4294967296) ^ Date.now()) >>> 0);
  const [wall, setWall] = useState(null);

  useEffect(() => {
    const ctx = document.createElement('canvas').getContext('2d');
    const measure = (text, size, weight, family) => { ctx.font = `${weight} ${size}px ${FAMS[family]}`; return ctx.measureText(text).width; };
    let last = { w: 0, h: 0 }, timer;
    const layout = () => {
      const el = box.current; if (!el) return;
      const W = el.clientWidth, H = el.clientHeight, b = el.getBoundingClientRect(), pr = panelRef.current?.getBoundingClientRect();
      const panel = pr ? { x: pr.left - b.left, y: pr.top - b.top, w: pr.width, h: pr.height } : null;
      setWall(buildWall({ W, H, panel, seed: seed.current, measure })); last = { w: W, h: H };
    };
    layout();
    document.fonts?.ready.then(layout);
    // Re-layout on real size changes only (ignores small mobile address-bar height jitter).
    const onResize = () => { clearTimeout(timer); timer = setTimeout(() => { const el = box.current; if (el && (el.clientWidth !== last.w || Math.abs(el.clientHeight - last.h) > 100)) layout(); }, 250); };
    window.addEventListener('resize', onResize);
    return () => { clearTimeout(timer); window.removeEventListener('resize', onResize); };
  }, [panelRef]);

  return (
    <div ref={box} className="absolute inset-0 overflow-hidden">
      {wall && <Decor items={wall.items} />}
      <div className="wall-sweep" aria-hidden="true" />
      {wall && wall.hidden.map((it) => {
        const done = found.includes(it.hiddenIndex);
        return (
          <button key={it.hiddenIndex} type="button" data-trace={it.hiddenIndex} aria-label={done ? 'ZEYDAC trace, found' : 'Hidden ZEYDAC trace'} onClick={() => onFind(it.hiddenIndex)}
            className="wall-hit" style={{ ...base(it), width: it.w, padding: '0 3px', textAlign: 'left', color: done ? '#050807' : it.style.color, background: done ? '#00FF88' : 'transparent', opacity: done ? 1 : it.style.opacity, fontWeight: done ? 700 : it.style.weight, boxShadow: done ? '0 0 12px #00FF88aa' : 'none' }}>ZEYDAC</button>
        );
      })}
    </div>
  );
}
