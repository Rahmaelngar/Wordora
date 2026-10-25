import { useEffect, useRef, useState } from 'react';
import { Mic, MicOff, TriangleAlert } from 'lucide-react';
import type { LanguageId } from '../../data';

export const bcp47: Record<LanguageId, string> = { english: 'en-US', french: 'fr-FR', spanish: 'es-ES', german: 'de-DE', italian: 'it-IT', turkish: 'tr-TR' };
type Rec = { lang: string; interimResults: boolean; maxAlternatives: number; continuous: boolean; start(): void; stop(): void; abort(): void;
  onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null; onerror: ((e: { error: string }) => void) | null; onend: (() => void) | null };
const getCtor = (): (new () => Rec) | null => { const w = window as unknown as Record<string, unknown>; return (w.SpeechRecognition || w.webkitSpeechRecognition || null) as (new () => Rec) | null; };
const norm = (s: string, locale: string) => s.toLocaleLowerCase(locale).normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^\p{L}\p{N}\s]/gu, ' ').split(/\s+/).filter(Boolean);

export function PronunciationPractice({ language, target, testId = 'pronunciation' }: { language: LanguageId; target: string; testId?: string }) {
  const Ctor = getCtor();
  const [status, setStatus] = useState<'idle' | 'listening' | 'done' | 'error'>('idle');
  const [heard, setHeard] = useState('');
  const [error, setError] = useState('');
  const recRef = useRef<Rec | null>(null);
  const timer = useRef<number | null>(null);
  const cleanup = () => { if (timer.current) window.clearTimeout(timer.current); timer.current = null; const r = recRef.current; recRef.current = null; if (r) { r.onresult = r.onerror = r.onend = null; try { r.abort(); } catch { /* noop */ } } };
  useEffect(() => { setHeard(''); setError(''); setStatus('idle'); return cleanup; }, [language, target]);
  const start = () => {
    if (!Ctor) return; cleanup(); setHeard(''); setError('');
    try {
      const r = new Ctor(); r.lang = bcp47[language]; r.interimResults = false; r.maxAlternatives = 1; r.continuous = false;
      r.onresult = (e) => { setHeard(e.results[0]?.[0]?.transcript ?? ''); setStatus('done'); };
      r.onerror = (e) => { const m: Record<string, string> = { 'not-allowed': 'لم يُسمح بالوصول إلى الميكروفون. اسمح به من إعدادات المتصفح.', 'service-not-allowed': 'خدمة التعرّف على الكلام غير متاحة في هذا المتصفح.', 'no-speech': 'لم نلتقط كلاماً. اقترب من الميكروفون وحاول مجدداً.', 'audio-capture': 'لم نجد ميكروفوناً متصلاً.', network: 'تعذّر الاتصال بخدمة التعرّف على الكلام.' }; setError(m[e.error] ?? 'حدث خطأ أثناء الاستماع.'); setStatus('error'); cleanup(); };
      r.onend = () => { setStatus(s => s === 'listening' ? 'idle' : s); cleanup(); };
      recRef.current = r; r.start(); setStatus('listening');
      timer.current = window.setTimeout(() => { setError('انتهت مهلة الاستماع (8 ثوانٍ). حاول مرة أخرى.'); setStatus('error'); cleanup(); }, 8000);
    } catch { setError('تعذّر بدء الاستماع.'); setStatus('error'); cleanup(); }
  };
  const stop = () => { const r = recRef.current; if (r) { try { r.stop(); } catch { cleanup(); } } };
  const t = norm(target, bcp47[language]), counts = new Map<string, number>();
  for (const word of norm(heard, bcp47[language])) counts.set(word, (counts.get(word) || 0) + 1);
  const matched = t.filter(word => { const count = counts.get(word) || 0; if (!count) return false; counts.set(word, count - 1); return true; }).length;
  return <section className="pron-card" data-testid={testId}>
    <div className="pron-head"><span className="pron-icon"><Mic size={17} /></span><div><strong>تدرّب على النطق</strong><small>قل العبارة بصوتك، وسنعرض الكلمات التي التقطها المتصفح.</small></div></div>
    <div className="pron-target" dir="ltr" lang={bcp47[language]}>{target}</div>
    {!Ctor ? <p className="pron-note" data-testid={`${testId}-unsupported`}><TriangleAlert size={15} /> متصفحك لا يدعم تحويل الكلام إلى نص. استمع للنطق وكرّره بصوت مسموع، فهذا تدريب مفيد أيضاً.</p> :
      <button type="button" className={`btn ${status === 'listening' ? 'btn-rec' : 'btn-outline'}`} onClick={status === 'listening' ? stop : start} data-testid={`${testId}-toggle`} aria-pressed={status === 'listening'}>
        {status === 'listening' ? <><MicOff size={17} /> إيقاف الاستماع</> : <><Mic size={17} /> ابدأ التحدث</>}
      </button>}
    <div aria-live="polite">
      {Ctor && <small className="pron-note">قد يرسل المتصفح صوتك لخدمة التعرّف على الكلام؛ لا تستخدم معلومات خاصة في التدريب.</small>}
      {status === 'listening' && <p className="pron-note"><span className="rec-dot" /> نستمع الآن…</p>}
      {error && <p className="pron-note err" role="alert" data-testid={`${testId}-error`}>{error}</p>}
      {status === 'done' && <div className="pron-result" data-testid={`${testId}-result`}>
        <div><small>ما التقطه المتصفح</small><b dir="ltr">{heard || '—'}</b></div>
        <p>تطابقت {matched} من {t.length} كلمات مكتوبة مع العبارة. هذه مقارنة للكلمات المتعرّف عليها فقط، وليست تقييماً معتمداً لجودة النطق.</p>
      </div>}
    </div>
  </section>;
}
