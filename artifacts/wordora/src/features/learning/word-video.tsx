import { useEffect, useRef, useState } from 'react';
import { Film, Loader2, Play, RotateCcw } from 'lucide-react';
import { useCreateWordoraVideo } from '@workspace/api-client-react';
import type { LanguageId, Word } from '../../data';
import { langCode, soundOn, stopAllLearningAudio } from './audio';
import { LEARNING_AUDIO_EVENT } from './lesson-video';

const cache = new Map<string, { url: string; mp4Url: string }>();
const routed = (url: string) => `${import.meta.env.BASE_URL.replace(/\/$/, '')}${url}`;
export function WordVideo({ word, language }: { word: Word; language: LanguageId }) {
  const generate = useCreateWordoraVideo();
  const [media, setMedia] = useState(cache.get(word.id) ?? null);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(false);
  const [ready, setReady] = useState(false);
  const video = useRef<HTMLVideoElement>(null);
  const alive = useRef(true);
  useEffect(() => {
    const element = video.current;
    return () => { element?.pause(); };
  }, [open, media?.url]);
  useEffect(() => {
    alive.current = true;
    const stop = (event: Event) => {
      if ((event as CustomEvent).detail?.source !== video.current) video.current?.pause();
    };
    window.addEventListener(LEARNING_AUDIO_EVENT, stop);
    return () => { alive.current = false; video.current?.pause(); window.removeEventListener(LEARNING_AUDIO_EVENT, stop); };
  }, []);
  const prepare = async () => {
    if (generate.isPending) return;
    setOpen(true); setError(false);
    if (media) { setReady(false); video.current?.load(); return; }
    try {
      const result = await generate.mutateAsync({ data: { wordId: word.id } });
      cache.set(word.id, result);
      if (alive.current) setMedia(result);
    } catch { if (alive.current) setError(true); }
  };
  return <section className="lesson-video" data-testid="section-word-video">
    <div className="lesson-video-head"><span className="lesson-video-icon"><Film size={18}/></span><div>
      <strong>شاهد النطق والاستخدام</strong><small>فيديو تعليمي لهذه الكلمة: نص مرئي وصوت مُولّد بالذكاء الاصطناعي، وليس شخصًا حقيقيًا أو حركة شفاه.</small>
    </div></div>
    <button className="btn btn-outline btn-small" onClick={() => {
      if (open && !error) { video.current?.pause(); setOpen(false); } else void prepare();
    }} disabled={generate.isPending} data-testid="button-word-video">
      {generate.isPending ? <Loader2 className="spin" size={16}/> : error ? <RotateCcw size={16}/> : <Play size={16}/>}
      {generate.isPending ? 'جارٍ إعداد الفيديو، قد يستغرق دقيقة…' : error ? 'إعادة تجهيز الفيديو' : open ? 'إخفاء الفيديو' : 'شاهد فيديو الكلمة'}
    </button>
    {!media && <small className="pron-note">يُجهّز عند طلبه لأول مرة ويُحفظ لإعادة المشاهدة. التوليد يستخدم رصيد الذكاء الاصطناعي؛ لا يمنح نقاطًا.</small>}
    {error && <p role="alert" className="pron-note err" data-testid="status-word-video-error">تعذّر تجهيز أو تشغيل الفيديو. جرّب مجددًا أو استخدم الصوت والمثال المكتوب.</p>}
    {open && media && <div className="lesson-video-body">
      <video ref={video} key={media.url} controls playsInline preload="metadata" muted={!soundOn()} style={{ width: '100%', borderRadius: 14, background: '#20143b' }}
        onLoadedData={() => setReady(true)} onError={() => { setReady(false); setError(true); }}
        onPlay={() => { stopAllLearningAudio(); window.dispatchEvent(new CustomEvent(LEARNING_AUDIO_EVENT, { detail: { source: video.current } })); }}
        data-testid="video-word">
        <source src={routed(media.url)} type={'video/webm; codecs="vp9, opus"'}/>
        <source src={routed(media.mp4Url)} type="video/mp4"/>
      </video>
      {!ready && !error && <small role="status">جارٍ تحميل الفيديو…</small>}
      <div className="media-transcript"><strong>النص المنطوق وترجمته</strong>
        <b dir="ltr" lang={langCode[language]}>{word.term}</b><span lang="ar">{word.arabicMeaning}</span>
        <span dir="ltr" lang={langCode[language]}>{word.example}</span><span lang="ar">{word.exampleArabic}</span>
      </div>
    </div>}
  </section>;
}
