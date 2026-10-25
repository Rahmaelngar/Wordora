import { useCallback, useEffect, useRef, useState } from 'react';
import { useCreateWordoraAudio } from '@workspace/api-client-react';
import { Loader2, RotateCcw, Square, Volume2 } from 'lucide-react';
import type { LanguageId } from '../../data';

const urlCache = new Map<string, string>();
export const soundOn = () => { try { const raw = localStorage.getItem('wordora-preferences-v1'); if (!raw) return true; const p = JSON.parse(raw); return p.sound !== false; } catch { return true; } };
let activeAudio: HTMLAudioElement | null = null;
export function stopAllLearningAudio() { if (activeAudio) { activeAudio.pause(); activeAudio = null; } }

type State = 'idle' | 'loading' | 'playing' | 'blocked' | 'error';
export function useLearningAudio(language: LanguageId, text: string) {
  const create = useCreateWordoraAudio();
  const createRef = useRef(create.mutateAsync); createRef.current = create.mutateAsync;
  const [state, setState] = useState<State>('idle');
  const [url, setUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const token = useRef(0);
  const cancel = useCallback(() => {
    token.current++;
    if (audioRef.current) { audioRef.current.pause(); if (activeAudio === audioRef.current) activeAudio = null; audioRef.current = null; }
    setState('idle');
  }, []);
  useEffect(() => { setUrl(null); return () => { token.current++; if (audioRef.current) { audioRef.current.pause(); if (activeAudio === audioRef.current) activeAudio = null; audioRef.current = null; } }; }, [language, text]);
  const play = useCallback(async () => {
    if (!soundOn()) return;
    cancel();
    const my = ++token.current;
    const key = `${language}::${text}`;
    try {
      let u = urlCache.get(key);
      if (!u) { setState('loading'); const res = await createRef.current({ data: { language, text: text.slice(0, 400) } }); u = `${import.meta.env.BASE_URL.replace(/\/$/, '')}${res.url}`; urlCache.set(key, u); }
      if (my !== token.current) return;
      setUrl(u);
      stopAllLearningAudio();
      window.dispatchEvent(new Event('wordora:learning-audio-play'));
      const a = new Audio(u); audioRef.current = a; activeAudio = a;
      a.onended = () => { if (my === token.current) setState('idle'); };
      a.onpause = () => { if (my === token.current) setState(s => s === 'playing' ? 'idle' : s); };
      a.onerror = () => { if (my === token.current) setState('error'); };
      setState('playing');
      try { await a.play(); } catch (e) { if (my === token.current) setState((e as Error)?.name === 'NotAllowedError' ? 'blocked' : 'error'); }
    } catch { if (my === token.current) setState('error'); }
  }, [language, text, cancel]);
  return { state, url, play, cancel };
}

export function AudioButton({ language, text, label, testId, compact, className }: { language: LanguageId; text: string; label: string; testId: string; compact?: boolean; className?: string }) {
  const { state, url, play, cancel } = useLearningAudio(language, text);
  const enabled = soundOn();
  const busy = state === 'loading' || state === 'playing';
  return <span className="audio-control" aria-live="polite">
    <button type="button" className={className ?? (compact ? 'btn btn-quiet' : 'btn btn-outline')} onClick={() => busy ? cancel() : play()} disabled={!enabled}
      aria-label={!enabled ? 'الصوت مُعطّل من الإعدادات' : busy ? 'إيقاف الصوت' : label} title={!enabled ? 'فعّل الصوت من الإعدادات' : label} data-testid={testId}>
      {state === 'loading' ? <Loader2 size={18} className="spin" /> : state === 'playing' ? <Square size={16} /> : state === 'error' ? <RotateCcw size={17} /> : <Volume2 size={18} />}
      {!compact && <span>{state === 'loading' ? 'جارٍ تجهيز الصوت…' : state === 'playing' ? 'إيقاف' : state === 'error' ? 'أعد المحاولة' : label}</span>}
    </button>
    {state === 'error' && <small className="audio-msg err" role="alert" data-testid={`${testId}-error`}>تعذّر تشغيل الصوت. حاول مرة أخرى.</small>}
    {state === 'blocked' && url && <span className="audio-msg"><small>المتصفح منع التشغيل التلقائي، شغّله يدوياً:</small><audio controls preload="none" src={url} data-testid={`${testId}-fallback`} /></span>}
  </span>;
}
