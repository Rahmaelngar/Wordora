import { useEffect, useRef, useState } from 'react';
import { AlertCircle, Film, Headphones, Loader2, Play, RotateCcw, VideoOff, X } from 'lucide-react';
import type { LanguageId } from '../../data';
import { soundOn, stopAllLearningAudio } from './audio';
import { assetUrl } from './media';

export const LEARNING_AUDIO_EVENT = 'wordora:learning-audio-play';

/** Instructional greeting video for the first A1 greetings lesson only. */
export function GreetingVideo({ language, languageName, pauseKey }: { language: LanguageId; languageName: string; pauseKey: string | number }) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [attempt, setAttempt] = useState(0);
  const [audioError, setAudioError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const enabled = soundOn();
  const pauseAll = () => { videoRef.current?.pause(); audioRef.current?.pause(); };
  useEffect(() => { pauseAll(); }, [pauseKey]);
  useEffect(() => { const h = () => pauseAll(); window.addEventListener(LEARNING_AUDIO_EVENT, h); return () => { window.removeEventListener(LEARNING_AUDIO_EVENT, h); pauseAll(); }; }, []);
  const retry = () => { setStatus('loading'); setAttempt(a => a + 1); };
  return <section className="lesson-video" data-testid="section-lesson-video">
    <div className="lesson-video-head">
      <span className="lesson-video-icon"><Film size={18} /></span>
      <div><strong>فيديو تعليمي: التحية بال{languageName.replace(/^ال/, '')}</strong><small>فيديو مشترك لمجموعة التحية: صور ثابتة ونصوص مع سرد صوتي مُولّد بالذكاء الاصطناعي. ليس شخصاً حقيقياً يتحدث، ولا يعرض حركة الشفاه.</small></div>
      <button type="button" className={open ? 'btn btn-quiet btn-small' : 'btn btn-outline btn-small'} onClick={() => { if (open) pauseAll(); setOpen(o => !o); }} aria-expanded={open} data-testid="button-toggle-lesson-video">{open ? <><X size={16} /> إخفاء</> : <><Play size={16} /> شاهد الفيديو</>}</button>
    </div>
    {open && <div className="lesson-video-body">
      <div className="lesson-video-frame">
        <video key={attempt} ref={videoRef} controls muted={!enabled} preload="metadata" playsInline
          onLoadedData={() => setStatus('ready')} onCanPlay={() => setStatus('ready')} onError={() => setStatus('error')}
          onPlay={() => { audioRef.current?.pause(); stopAllLearningAudio(); }}
          data-testid={`video-lesson-${language}`} aria-label={`فيديو درس التحية باللغة ${languageName}`}>
          <source src={assetUrl(`lesson-${language}.webm`)} type='video/webm; codecs="vp9, opus"' />
          <source src={assetUrl(`lesson-${language}.mp4`)} type="video/mp4" onError={() => setStatus('error')} />
        </video>
        {status === 'loading' && <div className="lesson-video-overlay" aria-live="polite"><Loader2 size={22} className="spin" /><span>جارٍ تحميل الفيديو…</span></div>}
        {status === 'error' && <div className="lesson-video-overlay err" role="alert" data-testid="status-lesson-video-error"><AlertCircle size={22} /><span>تعذّر تحميل الفيديو.</span><button type="button" className="btn btn-outline btn-small" onClick={retry} data-testid="button-retry-lesson-video"><RotateCcw size={15} /> أعد المحاولة</button></div>}
      </div>
      <div className="lesson-video-actions">
        <button type="button" className="btn btn-quiet btn-small" disabled={status !== 'ready'} onClick={() => { const v = videoRef.current; if (v) { v.currentTime = 0; void v.play().catch(() => undefined); } }} data-testid="button-replay-lesson-video"><RotateCcw size={15} /> أعد من البداية</button>
        {!enabled && <small>الصوت مُعطّل من الإعدادات، لذلك يعمل الفيديو بلا صوت.</small>}
      </div>
      {enabled && <div className="audio-row"><Headphones size={17} /><span>الصوت فقط (اختياري)</span>
        <audio ref={audioRef} controls preload="none" onError={() => setAudioError(true)} onPlay={() => { videoRef.current?.pause(); stopAllLearningAudio(); }} src={assetUrl(`lesson-${language}.wav`)} data-testid={`audio-lesson-${language}`} />
      </div>}
      {audioError && <p className="pron-note err" role="alert">تعذّر تحميل الملف الصوتي.</p>}
    </div>}
  </section>;
}

export function VideoUnavailable() {
  return <div className="lesson-video unavailable" data-testid="status-lesson-video-unavailable">
    <div className="lesson-video-head"><span className="lesson-video-icon muted"><VideoOff size={18} /></span>
      <div><strong>لا يوجد فيديو لهذا الدرس</strong><small>استخدم زر الاستماع لسماع نطق الكلمة والمثال، ثم جرّب قولها بصوتك.</small></div></div>
  </div>;
}
