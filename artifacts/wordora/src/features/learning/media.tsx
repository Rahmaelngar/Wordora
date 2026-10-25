import { useEffect, useRef, useState } from 'react';
import { Film, Headphones } from 'lucide-react';
import { languages, type LanguageId } from '../../data';
import { greetingTranscript } from './greeting-transcript';
import { PronunciationPractice } from './pronunciation';
import { soundOn, stopAllLearningAudio } from './audio';

export const assetUrl = (file: string) => `${import.meta.env.BASE_URL.replace(/\/$/, '')}/api/wordora/assets/${file}`;

export function MediaLesson({ language }: { language: LanguageId }) {
  const transcript = greetingTranscript[language];
  const info = languages.find(l => l.id === language)!;
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [videoError, setVideoError] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const enabled = soundOn();
  useEffect(() => { for (const el of [videoRef.current, audioRef.current]) if (el) { el.pause(); el.currentTime = 0; el.load(); } }, [language]);
  return <section className="media-lesson" data-testid="section-media-lesson">
    <div className="media-head"><div><div className="hero-kicker">شاهد واستمع</div><h2>درس التحية المروي — {info.arabicName}</h2></div><span className="ai-label" data-testid="label-ai-media">وسائط مُولّدة بالذكاء الاصطناعي</span></div>
    <div className="media-grid">
      <div className="media-player">
        <video key={language} ref={videoRef} onError={() => setVideoError(true)} onPlay={() => { audioRef.current?.pause(); stopAllLearningAudio(); }} controls muted={!enabled} preload="metadata" playsInline poster={assetUrl('wordora-learning.jpg')} data-testid={`video-lesson-${language}`} aria-label={`فيديو درس التحية باللغة ${info.arabicName}`}>
          <source src={assetUrl(`lesson-${language}.webm`)} type='video/webm; codecs="vp9, opus"' />
          <source src={assetUrl(`lesson-${language}.mp4`)} type="video/mp4" onError={() => setVideoError(true)} />
          متصفحك لا يدعم تشغيل الفيديو.
        </video>
        {videoError && <p role="alert">تعذّر تحميل الفيديو. تحقّق من اتصالك وأعد تحميل الصفحة.</p>}
        <div className="audio-row"><Headphones size={17} /><span>الصوت فقط</span>
          {enabled ? <audio key={language} ref={audioRef} controls preload="metadata" onError={() => setAudioError(true)} onPlay={() => { videoRef.current?.pause(); stopAllLearningAudio(); }} src={assetUrl(`lesson-${language}.wav`)} data-testid={`audio-lesson-${language}`} /> : <small>الصوت مُعطّل من الإعدادات.</small>}
        </div>
        {audioError && <p role="alert">تعذّر تحميل الصوت. حاول مرة أخرى بعد التحقق من الاتصال.</p>}
        <PronunciationPractice language={language} target={transcript[0].sentence} testId="pronunciation-media" />
      </div>
      <ol className="transcript" aria-label="نص الدرس" data-testid="list-transcript">
        <li className="transcript-title"><Film size={15} /> النص والترجمة</li>
        {transcript.map(w => <li key={w.wordId}><b dir="ltr" lang={language}>{w.term}</b><span>{w.arabicMeaning}</span><em dir="ltr">{w.sentence}</em><span>{w.sentenceArabic}</span></li>)}
      </ol>
    </div>
  </section>;
}
