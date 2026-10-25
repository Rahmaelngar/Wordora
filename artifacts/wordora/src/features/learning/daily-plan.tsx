import { useState } from 'react';
import { Link } from 'wouter';
import { BookOpen, Check, ChevronLeft, Flame, Repeat2, Target } from 'lucide-react';
import type { WordoraProgress } from '@workspace/api-client-react';
import type { LanguageId } from '../../data';
import { getDailyPlan } from './daily';
import { goalOptions, readPreferences, writePreferences } from './preferences';
import { ReviewChallenge } from './review-challenge';

const ar = (n: number) => n.toLocaleString('ar-EG');
type Props = { progress: WordoraProgress; language: LanguageId; updateProgress: (fn: (old: WordoraProgress) => WordoraProgress) => void };

export function DailyPlan({ progress, language, updateProgress }: Props) {
  const [minutes, setMinutes] = useState(() => readPreferences().dailyGoal);
  const [reviewOpen, setReviewOpen] = useState(false);
  const plan = getDailyPlan(progress, language, minutes);
  const rec = plan.recommendation;
  const pick = (m: number) => { setMinutes(m); writePreferences({ dailyGoal: m }); };
  const tasks = [
    { id: 'words', icon: Target, label: 'كلمات صحيحة اليوم', value: Math.min(plan.correctWords, plan.wordTarget), target: plan.wordTarget },
    { id: 'lesson', icon: BookOpen, label: 'درس مكتمل', value: Math.min(plan.lessonsDone, 1), target: 1 },
    { id: 'review', icon: Repeat2, label: 'مراجعة كلمات مختلفة', value: Math.min(plan.reviewsDone, plan.targetReviews), target: plan.targetReviews },
  ];
  const pct = Math.max(0, Math.min(100, plan.percent));
  return <section className={`dp ${plan.completed ? 'is-done' : ''}`} aria-labelledby="dp-title" data-testid="section-daily-plan">
    <div className="dp-main">
      <div className="dp-ring" style={{ ['--p' as string]: `${pct}` }} role="img" aria-label={`أنجزت ${pct}% من خطة اليوم`}>
        <div><strong data-testid="text-daily-percent">{ar(pct)}<small>%</small></strong><span>{plan.completed ? 'اكتملت' : 'خطة اليوم'}</span></div>
      </div>
      <div className="dp-copy">
        <span className="rv-kicker">خطتك لليوم</span>
        <h2 id="dp-title">{plan.completed ? 'أنجزت خطة اليوم بالكامل.' : plan.tasksDone > 0 ? 'بداية جيدة، أكمل ما تبقّى.' : 'ثلاث خطوات تكفي اليوم.'}</h2>
        <div className="dp-goal" role="radiogroup" aria-label="مدة الخطة التقديرية">
          {goalOptions.map(m => <button key={m} role="radio" aria-checked={minutes === m} className={minutes === m ? 'on' : ''} onClick={() => pick(m)} data-testid={`button-goal-${m}`}>{ar(m)} د</button>)}
        </div>
        <p className="dp-hint">مدة تقديرية للخطة، وليست وقتاً مُقاساً. الهدف: {ar(plan.wordTarget)} كلمات صحيحة.</p>
      </div>
    </div>
    <ul className="dp-tasks">{tasks.map(({ id, icon: Icon, label, value, target }) => { const ok = value >= target; return <li key={id} className={ok ? 'ok' : ''} data-testid={`task-daily-${id}`}>
      <span className="dp-ic">{ok ? <Check size={17}/> : <Icon size={17}/>}</span>
      <div><b>{label}</b><div className="dp-bar"><i style={{ transform: `scaleX(${target ? value / target : 0})` }}/></div></div>
      <em>{ar(value)}/{ar(target)}</em>
    </li>; })}</ul>
    <div className="dp-actions">
      {rec ? <Link href={`/lesson/${rec.id}`} className="btn btn-primary" data-testid="link-daily-next-lesson"><span className="dp-next"><small>الدرس المقترح · {rec.level}</small>{rec.topic}</span><ChevronLeft size={17}/></Link> : <span className="dp-hint">أكملت كل الدروس المتاحة حالياً في هذه اللغة.</span>}
      <button className="btn btn-outline" onClick={() => setReviewOpen(true)} data-testid="button-open-review"><Repeat2 size={17}/> تحدّي المراجعة</button>
    </div>
    <div className="dp-week" aria-label="نشاط الأسبوع">
      <div className="dp-streak" data-testid="text-daily-streak"><Flame size={16}/> {plan.streak > 0 ? `${ar(plan.streak)} ${plan.streak === 1 ? 'يوم' : 'أيام'} متتالية` : 'ابدأ سلسلة اليوم'}</div>
      <ol>{plan.week.map(d => <li key={d.date} className={`${d.active ? 'on' : ''} ${d.today ? 'today' : ''}`} title={d.date} data-testid={`day-week-${d.date}`}><span/>{d.label}</li>)}</ol>
    </div>
    {reviewOpen && <ReviewChallenge progress={progress} language={language} updateProgress={updateProgress} onClose={() => setReviewOpen(false)} nextHref={rec ? `/lesson/${rec.id}` : null} nextTitle={rec?.topic}/>}
  </section>;
}
