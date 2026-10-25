import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'wouter';
import { Check, ChevronLeft, RotateCcw, X } from 'lucide-react';
import type { WordoraProgress } from '@workspace/api-client-react';
import { lessons, type LanguageId, type Lesson, type Word } from '../../data';
import { dailyDate, getReviewPool, recordDailyActivity } from './daily';
import { AudioButton } from './audio';

type Item = { lesson: Lesson; word: Word };
type Props = { progress: WordoraProgress; language: LanguageId; updateProgress: (fn: (old: WordoraProgress) => WordoraProgress) => void; onClose: () => void; nextHref: string | null; nextTitle?: string };
const TARGET = 3;
const shuffle = <T,>(a: T[]) => [...a].sort(() => Math.random() - .5);

export function ReviewChallenge({ progress, language, updateProgress, onClose, nextHref, nextTitle }: Props) {
  const [setup] = useState(() => {
    const pool = getReviewPool(progress, language) as Item[];
    const reviewedToday = new Set(progress.dailyActivity?.[dailyDate()]?.reviewedWordIds ?? []);
    const unique = [...new Map(pool.map(i => [i.word.id, i])).values()];
    const fresh = shuffle(unique.filter(i => !reviewedToday.has(i.word.id)));
    const again = shuffle(unique.filter(i => reviewedToday.has(i.word.id)));
    const practice = !lessons.some(l => l.languageId === language && (progress.completedLessons.includes(l.id) || !!progress.lessonStudy?.[l.id] || l.words.some(w => progress.savedWords.includes(w.id))));
    return { queue: [...fresh, ...again], practice, meanings: [...new Set(lessons.filter(l => l.languageId === language).flatMap(l => l.words.map(w => w.arabicMeaning)))] };
  });
  const [queue, setQueue] = useState<Item[]>(setup.queue);
  const [correctIds, setCorrectIds] = useState<string[]>([]);
  const [picked, setPicked] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);
  const item = queue[0];
  const goal = Math.min(TARGET, setup.queue.length);
  const done = correctIds.length >= goal || !item;
  const choices = useMemo(() => {
    if (!item) return [];
    const others = shuffle(setup.meanings.filter(m => m !== item.word.arabicMeaning)).slice(0, 3);
    return shuffle([item.word.arabicMeaning, ...others]);
  }, [item?.word.id, attempts]); // eslint-disable-line react-hooks/exhaustive-deps
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLElement>(null);
  const closeAction = useRef(onClose); closeAction.current = onClose;
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden'; closeRef.current?.focus();
    const k = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeAction.current();
      if (event.key !== 'Tab') return;
      const controls = dialogRef.current?.querySelectorAll<HTMLElement>('button:not([disabled]),a[href],input:not([disabled]),select:not([disabled])');
      const first = controls?.[0], last = controls?.[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    window.addEventListener('keydown', k);
    return () => { document.body.style.overflow = overflow; window.removeEventListener('keydown', k); previous?.focus(); };
  }, []);
  const isRight = picked === item?.word.arabicMeaning;
  const choose = (c: string) => {
    if (picked || !item) return;
    setPicked(c);
    if (c === item.word.arabicMeaning && !correctIds.includes(item.word.id)) {
      const id = item.word.id;
      setCorrectIds(ids => [...ids, id]);
      updateProgress(old => recordDailyActivity(old, { reviewedWordId: id }));
    }
  };
  const advance = () => {
    setQueue(q => { const [head, ...rest] = q; if (!head) return q; return isRight ? rest : [...rest, head]; });
    setPicked(null); setAttempts(a => a + 1);
  };
  return <div className="rv-backdrop" role="presentation" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
    <section ref={dialogRef} className="rv-dialog" role="dialog" aria-modal="true" aria-labelledby="rv-title" data-testid="dialog-review">
      <header className="rv-head">
        <div><span className="rv-kicker">{setup.practice ? 'تمرين تمهيدي' : 'مراجعة قصيرة'}</span><h2 id="rv-title">{setup.practice ? 'جرّب أولى كلمات A1' : 'هل ما زلت تتذكّرها؟'}</h2></div>
        <button ref={closeRef} className="btn btn-quiet btn-small" onClick={onClose} aria-label="إغلاق المراجعة" data-testid="button-close-review"><X size={18}/></button>
      </header>
      {setup.practice && <p className="rv-note" data-testid="text-review-practice">هذه كلمات تمهيدية من أول درس، وليست كلمات حفظتها من قبل.</p>}
      <div className="rv-dots" aria-label={`${correctIds.length} من ${goal} صحيحة`}>{Array.from({ length: goal }, (_, i) => <span key={i} className={i < correctIds.length ? 'on' : ''}/>)}</div>
      {goal === 0 ? <p className="rv-note">لا توجد كلمات للمراجعة في هذه اللغة بعد.</p> : done ? <div className="rv-done" data-testid="status-review-complete">
        <div className="rv-seal"><Check size={30}/></div>
        <h3>أنهيت المراجعة</h3>
        <p>{correctIds.length} {correctIds.length === 1 ? 'كلمة مختلفة' : 'كلمات مختلفة'} أجبت عنها بشكل صحيح وسُجّلت في خطة اليوم.</p>
        <div className="rv-actions">
          {nextHref && <Link href={nextHref} className="btn btn-primary" data-testid="link-review-next-lesson">{nextTitle ? `الدرس التالي: ${nextTitle}` : 'الدرس التالي'} <ChevronLeft size={16}/></Link>}
          <button className="btn btn-outline" onClick={onClose} data-testid="button-review-back-plan">العودة إلى الخطة</button>
        </div>
      </div> : <div className="rv-body" key={`${item.word.id}-${attempts}`}>
        <div className="rv-word"><b dir="ltr" lang={language} data-testid="text-review-word">{item.word.term}</b><AudioButton compact language={language} text={item.word.term} translation={item.word.arabicMeaning} label="استمع إلى الكلمة" testId="button-review-audio"/></div>
        <small className="rv-src">{item.lesson.level} · {item.lesson.topic}</small>
        <div className="rv-choices">{choices.map((c, i) => <button key={c} className={`quiz-option ${picked && c === item.word.arabicMeaning ? 'correct' : ''} ${picked === c && !isRight ? 'wrong' : ''}`} disabled={!!picked} onClick={() => choose(c)} data-testid={`button-review-choice-${i}`}>{c}</button>)}</div>
        {picked && <div className={`feedback ${isRight ? 'ok' : 'no'}`} role="status" data-testid="status-review-feedback">
          {isRight ? 'صحيح.' : <>ليس هذا المعنى. الصحيح: <strong>{item.word.arabicMeaning}</strong>. ستعود هذه الكلمة بعد قليل.</>}
          <div className="rv-example"><span dir="ltr" lang={language}>{item.word.example}</span><small>{item.word.exampleArabic}</small></div>
        </div>}
        {picked && <button className="btn btn-primary rv-next" onClick={advance} data-testid="button-review-next">{isRight ? 'التالي' : <><RotateCcw size={15}/> تابع</>} <ChevronLeft size={16}/></button>}
      </div>}
    </section>
  </div>;
}
