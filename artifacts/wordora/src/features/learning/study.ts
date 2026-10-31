import { lessons, type LanguageId, type Lesson, type Level } from '../../data';
import type { LessonStudyState, WordoraProgress } from '@workspace/api-client-react';
import { mergeLessonStudy } from './study-persistence';

export type LessonStudy = LessonStudyState;

export const levelRules: { level: Level; title: string; required: number }[] = [
  { level: 'A1', title: 'البداية', required: 0 }, { level: 'A2', title: 'خطوات أوسع', required: 4 }, { level: 'B1', title: 'تحدّث بثقة', required: 2 },
  { level: 'B2', title: 'ناقش وعبّر', required: 4 },
  { level: 'C1', title: 'تواصل بدقّة', required: 5 },
  { level: 'C2', title: 'إتقان ومرونة', required: 6 },
];
export const finishedByLevel = (completed: string[], lang: LanguageId, level: Level) =>
  completed.filter(id => { const l = lessons.find(x => x.id === id); return l?.languageId === lang && l.level === level; }).length;
export function isLevelUnlocked(completed: string[], lang: LanguageId, level: Level) {
  const index = levelRules.findIndex(rule => rule.level === level);
  if (index === 0) return true;
  if (index < 0) return false;
  return finishedByLevel([...new Set(completed)], lang, levelRules[index - 1].level) >= levelRules[index].required;
}
export const isLessonUnlocked = (lesson: Lesson, completed: string[]) => isLevelUnlocked(completed, lesson.languageId, lesson.level);
export const requiredFor = (level: Level) => levelRules.find(r => r.level === level)?.required ?? 0;

/** Next lesson in the same language (data order). Never awards anything; caller just navigates. */
export function nextLessonFor(lesson: Lesson, completed: string[]): { next: Lesson | null; locked: boolean } {
  const list = lessons.filter(l => l.languageId === lesson.languageId);
  const next = list[list.findIndex(l => l.id === lesson.id) + 1] ?? null;
  return { next, locked: !!next && !isLessonUnlocked(next, completed) };
}

export const isGreetingLesson = (lesson: Lesson) => lesson.languageId !== 'turkish' && lesson.id === `${lesson.languageId}-1` && lesson.level === 'A1';

export function readStudy(progress: WordoraProgress, lesson: Lesson): LessonStudy | null {
  return mergeLessonStudy(progress.lessonStudy)[lesson.id] ?? null;
}

export function writeStudy<P extends WordoraProgress>(old: P, lessonId: string, study: Omit<LessonStudy, 'updatedAt'>): P {
  return { ...old, lessonStudy: { ...old.lessonStudy, [lessonId]: { ...study, updatedAt: new Date().toISOString() } } };
}
