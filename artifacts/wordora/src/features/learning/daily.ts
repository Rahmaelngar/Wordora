import type { WordoraProgress } from '@workspace/api-client-react';
import { languages, lessons, type LanguageId } from '../../data';
import { isLessonUnlocked } from './study';

type ActivityMap = NonNullable<WordoraProgress['dailyActivity']>;
const wordIndex = new Map(lessons.flatMap(lesson => lesson.words.map(word => [word.id, { lesson, word }] as const)));
const lessonIndex = new Map(lessons.map(lesson => [lesson.id, lesson]));
export const dailyDate = (date = new Date()) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
const validDate = (key: string) => /^\d{4}-\d{2}-\d{2}$/.test(key) && !Number.isNaN(Date.parse(key)) && new Date(`${key}T12:00:00Z`).toISOString().slice(0, 10) === key;
const validIds = (raw: unknown, index: Map<string, unknown>) => Array.isArray(raw) ? raw.filter((id): id is string => typeof id === 'string' && index.has(id)) : [];

export function mergeDailyActivity(...sources: unknown[]): ActivityMap {
  const result: ActivityMap = {};
  for (const source of sources) {
    if (!source || typeof source !== 'object' || Array.isArray(source)) continue;
    for (const [date, raw] of Object.entries(source)) {
      if (!validDate(date) || !raw || typeof raw !== 'object' || Array.isArray(raw)) continue;
      const value = raw as Record<string, unknown>;
      const before = result[date];
      result[date] = {
        correctWordIds: [...new Set([...(before?.correctWordIds ?? []), ...validIds(value.correctWordIds, wordIndex)])],
        completedLessonIds: [...new Set([...(before?.completedLessonIds ?? []), ...validIds(value.completedLessonIds, lessonIndex)])],
        reviewedWordIds: [...new Set([...(before?.reviewedWordIds ?? []), ...validIds(value.reviewedWordIds, wordIndex)])],
      };
    }
  }
  return result;
}

export function recordDailyActivity<P extends WordoraProgress>(old: P, delta: {
  correctWordIds?: string[]; completedLessonId?: string; reviewedWordId?: string;
}, now = new Date()): P {
  const date = dailyDate(now);
  const next = mergeDailyActivity(old.dailyActivity, {
    [date]: {
      correctWordIds: [...(delta.correctWordIds ?? []), ...(delta.reviewedWordId ? [delta.reviewedWordId] : [])],
      completedLessonIds: delta.completedLessonId ? [delta.completedLessonId] : [],
      reviewedWordIds: delta.reviewedWordId ? [delta.reviewedWordId] : [],
    },
  });
  const activity = next[date];
  if (!activity || !activity.correctWordIds.length && !activity.completedLessonIds.length) return old;
  const yesterday = new Date(now); yesterday.setDate(yesterday.getDate() - 1);
  const streak = old.lastActiveDate === date ? old.streak : old.lastActiveDate === dailyDate(yesterday) ? old.streak + 1 : 1;
  return { ...old, dailyActivity: next, streak: Math.max(1, streak), lastActiveDate: date };
}

export function getDailyPlan(progress: WordoraProgress, language: LanguageId, minutes = 10, now = new Date()) {
  const date = dailyDate(now);
  const activity = mergeDailyActivity(progress.dailyActivity);
  const current = activity[date];
  const wordTarget = minutes <= 5 ? 3 : minutes <= 10 ? 5 : minutes <= 15 ? 8 : 10;
  const belongs = (id: string) => wordIndex.get(id)?.lesson.languageId === language;
  const correctWords = current?.correctWordIds.filter(belongs).length ?? 0;
  const reviewsDone = current?.reviewedWordIds.filter(belongs).length ?? 0;
  const lessonsDone = current?.completedLessonIds.filter(id => lessonIndex.get(id)?.languageId === language).length ?? 0;
  const tasksDone = Number(correctWords >= wordTarget) + Number(lessonsDone >= 1) + Number(reviewsDone >= 3);
  const available = lessons.filter(lesson => lesson.languageId === language && isLessonUnlocked(lesson, progress.completedLessons));
  const unfinished = available.filter(lesson => !progress.completedLessons.includes(lesson.id));
  const inProgress = unfinished.filter(lesson => progress.lessonStudy?.[lesson.id]?.wordIndex || progress.lessonStudy?.[lesson.id]?.stage === 'summary')
    .sort((a, b) => (progress.lessonStudy?.[b.id]?.updatedAt ?? '').localeCompare(progress.lessonStudy?.[a.id]?.updatedAt ?? ''));
  const recommendation = inProgress[0] ?? unfinished[0] ?? available[0] ?? null;
  const week = Array.from({ length: 7 }, (_, index) => {
    const d = new Date(now); d.setDate(d.getDate() - (6 - index));
    const key = dailyDate(d);
    const a = activity[key];
    return { date: key, label: new Intl.DateTimeFormat('ar', { weekday: 'short' }).format(d),
      today: key === date, active: !!a && (a.correctWordIds.some(belongs) || a.completedLessonIds.some(id => lessonIndex.get(id)?.languageId === language)) };
  });
  const yesterday = new Date(now); yesterday.setDate(yesterday.getDate() - 1);
  const streak = progress.lastActiveDate === date || progress.lastActiveDate === dailyDate(yesterday) ? progress.streak : 0;
  return { date, wordTarget, correctWords, lessonsDone, reviewsDone, targetReviews: 3, tasksDone,
    percent: Math.round(tasksDone / 3 * 100), completed: tasksDone === 3, recommendation, week, streak };
}

export function getReviewPool(progress: WordoraProgress, language: LanguageId) {
  if (!languages.some(item => item.id === language)) return [];
  const ids = new Set([...progress.savedWords,
    ...Object.values(progress.lessonStudy ?? {}).flatMap(study => study.studiedWordIds),
    ...lessons.filter(lesson => lesson.languageId === language && progress.completedLessons.includes(lesson.id)).flatMap(lesson => lesson.words.map(word => word.id))]);
  const pool = [...ids].map(id => wordIndex.get(id)).filter((item): item is NonNullable<typeof item> => !!item && item.lesson.languageId === language);
  return pool.length >= 3 ? pool : [...new Map([...pool, ...lessons.filter(lesson => lesson.languageId === language && lesson.level === 'A1').slice(0, 1).flatMap(lesson => lesson.words.map(word => ({ lesson, word })))].map(item => [item.word.id, item])).values()];
}
