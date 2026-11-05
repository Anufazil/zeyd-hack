import { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import BootSequence from './components/BootSequence.jsx';
import AccessScreen from './components/AccessScreen.jsx';
import { loadState, saveState } from './lib/storage.js';

const Console = lazy(() => import('./components/Console.jsx'));
const DirectAccess = lazy(() => import('./components/DirectAccess.jsx'));
const wantsDirect = () => window.location.hash === '#direct';
const clearHash = () => history.replaceState(null, '', window.location.pathname + window.location.search);
const Loading = () => <p role="status" className="p-6 font-mono text-sm text-dim">loading<span className="cursor" /></p>;

export default function App() {
  const [state, setState] = useState(loadState);
  const [screen, setScreen] = useState(() => {
    const s = loadState();
    if (wantsDirect()) { if (s.directUnlocked) return 'direct'; clearHash(); }
    return s.bootSeen ? 'access' : 'boot';
  });
  useEffect(() => { saveState(state); }, [state]);
  useEffect(() => {
    const onHash = () => {
      if (wantsDirect()) { if (state.directUnlocked) setScreen('direct'); else { clearHash(); setScreen((s) => (s === 'direct' ? 'access' : s)); } }
      else setScreen((s) => (s === 'direct' ? 'access' : s));
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, [state.directUnlocked]);
  // Direct Access is earned on the start screen (hidden-glyph puzzle) and remembered afterwards.
  const goDirect = useCallback(() => {
    setState((s) => (s.directUnlocked ? s : { ...s, directUnlocked: true }));
    setScreen('direct'); history.pushState(null, '', '#direct');
  }, []);
  const leaveDirect = useCallback(() => { clearHash(); setScreen('access'); }, []);
  const bootDone = () => { setState((s) => ({ ...s, bootSeen: true })); setScreen('access'); };
  return (
    <div className="scanlines">
      <Suspense fallback={<Loading />}>
        {screen === 'boot' && <BootSequence onDone={bootDone} />}
        {screen === 'access' && <AccessScreen onEnter={() => setScreen('console')} onDirect={goDirect} directUnlocked={state.directUnlocked} />}
        {screen === 'console' && <Console state={state} setState={setState} onExit={() => setScreen('access')} onDirect={state.directUnlocked ? goDirect : null} />}
        {screen === 'direct' && <DirectAccess onInvestigate={leaveDirect} />}
      </Suspense>
    </div>
  );
}
