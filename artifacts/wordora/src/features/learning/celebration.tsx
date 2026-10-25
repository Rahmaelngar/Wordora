import { Link } from 'wouter';
import { Award, ChevronLeft, ListChecks } from 'lucide-react';
type Props = { score: number; total: number; firstCompletion: boolean; pointsEarned: number; nextHref: string | null; nextTitle?: string; dailyDone: boolean; onSummary: () => void };
export function QuizCelebration({ score, total, firstCompletion, pointsEarned, nextHref, nextTitle, dailyDone, onSummary }: Props) {
  const ratio = total ? score / total : 0;
  const headline = ratio === 1 ? 'إجابات كاملة.' : ratio >= .6 ? 'أكملت الدرس بثبات.' : 'أكملت الدرس، والمراجعة ستثبّته.';
  return <section className="panel cel" data-testid="section-quiz-celebration">
    <div className="cel-burst" aria-hidden="true">{Array.from({ length: 10 }, (_, i) => <i key={i} style={{ ['--i' as string]: i }}/>)}</div>
    <div className="rv-seal"><Award size={30}/></div>
    <h3>{headline}</h3>
    <p data-testid="text-quiz-score">إجابات صحيحة: {score} · إجابات غير صحيحة: {total - score}</p>
    <div className="cel-chips">
      <span data-testid="text-points-earned">{firstCompletion ? `+${pointsEarned} نقطة لأول إكمال` : 'إعادة: لا نقاط إضافية'}</span>
      {score > 0 && <span>{score} في خطة اليوم</span>}
      {dailyDone && <span className="gold">خطة اليوم مكتملة</span>}
    </div>
    <div className="rv-actions">
      {nextHref ? <Link href={nextHref} className="btn btn-primary" data-testid="link-completion-next">{nextTitle ? `التالي: ${nextTitle}` : 'الدرس التالي'} <ChevronLeft size={17}/></Link> : <Link href="/learn" className="btn btn-primary" data-testid="link-completion-lessons">تابع الدروس <ChevronLeft size={17}/></Link>}
      <button className="btn btn-outline" onClick={onSummary} data-testid="button-done-summary"><ListChecks size={16}/> الملخّص</button>
      <Link href="/progress" className="btn btn-quiet" data-testid="link-completion-progress">عرض إنجازي</Link>
    </div>
  </section>;
}
