import { useEffect, useState } from 'react';
const CH = '01ABCDEF#$%&*+=<>';
// Scramble-to-reveal text. Shows final text immediately for reduced motion.
export default function Decrypt({ text, ms = 700 }) {
  const [out, setOut] = useState(text);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const t0 = performance.now(); let raf;
    const tick = (t) => {
      const k = Math.min(1, (t - t0) / ms), n = Math.floor(k * text.length);
      setOut(text.slice(0, n) + [...text.slice(n)].map((c) => (c === ' ' ? ' ' : CH[Math.floor(Math.random() * CH.length)])).join(''));
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [text, ms]);
  return <span aria-label={text}>{out}</span>;
}
