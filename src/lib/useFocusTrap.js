import { useEffect } from 'react';
// Traps Tab inside `ref` while active, closes on Escape, restores focus on close.
export default function useFocusTrap(ref, active, onClose) {
  useEffect(() => {
    if (!active || !ref.current) return;
    const prev = document.activeElement, node = ref.current;
    const sel = 'a[href],button:not([disabled]),input,textarea,select,[tabindex]:not([tabindex="-1"])';
    node.querySelector(sel)?.focus();
    const key = (e) => {
      if (e.key === 'Escape') { onClose(); return; }
      if (e.key !== 'Tab') return;
      const f = [...node.querySelectorAll(sel)]; if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', key);
    return () => { document.removeEventListener('keydown', key); prev?.focus?.(); };
  }, [active, ref, onClose]);
}
