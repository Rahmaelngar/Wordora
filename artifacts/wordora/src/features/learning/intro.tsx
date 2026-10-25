import { useCallback, useEffect, useRef, useState } from 'react';

let shownThisLoad = false;

/** Root gate: true only on the first render of this page load until dismissed. Call unconditionally. */
export function useIntroGate() {
  const [visible, setVisible] = useState(() => !shownThisLoad);
  useEffect(() => { if (visible) shownThisLoad = true; }, [visible]);
  const dismiss = useCallback(() => setVisible(false), []);
  return { visible, dismiss };
}

/** Exact-logo cover shown once per app load; auto-dismisses after ~1.5s. */
export function IntroCover({ onDone }: { onDone: () => void }) {
  const btnRef = useRef<HTMLButtonElement>(null);
  const doneRef = useRef(onDone); doneRef.current = onDone;
  useEffect(() => {
    btnRef.current?.focus();
    const t = window.setTimeout(() => doneRef.current(), 1500);
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') doneRef.current(); };
    window.addEventListener('keydown', onKey);
    return () => { window.clearTimeout(t); window.removeEventListener('keydown', onKey); };
  }, []);
  return <div className="intro-cover" role="dialog" aria-modal="true" aria-label="Wordora" data-testid="intro-cover">
    <img src={`${import.meta.env.BASE_URL}wordora-logo.png`} alt="شعار Wordora: Words Open New Worlds" loading="eager" fetchPriority="high" decoding="async" onError={() => doneRef.current()} data-testid="img-intro-logo" />
    <button ref={btnRef} type="button" className="btn btn-quiet btn-small intro-skip" onClick={() => doneRef.current()} data-testid="button-intro-skip">متابعة</button>
  </div>;
}
