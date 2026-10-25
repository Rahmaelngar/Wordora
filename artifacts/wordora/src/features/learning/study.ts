import { lessons, type LanguageId, type Lesson, type Level } from '../../data';
import type { LessonStudyState, WordoraProgress } from '@workspace/api-client-react';
import { mergeLessonStudy } from './study-persistence';

export type LessonStudy = LessonStudyState;

export const levelRules: { level: Level; title: string; required: number }[] = [
  { level: 'A1', title: 'البداية', required: 0 }, { level: 'A2', title: 'خطوات أوسع', required: 4 }, { level: 'B1', title: 'تحدّث بثقة', required: 2 },
];
export const finishedByLevel = (completed: string[], lang: LanguageId, level: Level) =>
  completed.filter(id => { const l = lessons.find(x => x.id === id); return l?.languageId === lang && l.level === level; }).length;
export function isLevelUnlocked(completed: string[], lang: LanguageId, level: Level) {
  if (level === 'A1') return true;
  if (level === 'A2') return finishedByLevel(completed, lang, 'A1') >= 4;
  return finishedByLevel(completed, lang, 'A2') >= 2;
}
export const isLessonUnlocked = (lesson: Lesson, completed: string[]) => isLevelUnlocked(completed, lesson.languageId, lesson.level);
export const requiredFor = (level: Level) => levelRules.find(r => r.level === level)?.required ?? 0;

/** Next lesson in the same language (data order). Never awards anything; caller just navigates. */
export function nextLessonFor(lesson: Lesson, completed: string[]): { next: Lesson | null; locked: boolean } {
  const list = lessons.filter(l => l.languageId === lesson.languageId);
  const next = list[list.findIndex(l => l.id === lesson.id) + 1] ?? null;
  return { next, locked: !!next && !isLessonUnlocked(next, completed) };
}

export const isGreetingLesson = (lesson: Lesson) => lesson.id === `${lesson.languageId}-1` && lesson.level === 'A1';

export function readStudy(progress: WordoraProgress, lesson: Lesson): LessonStudy | null {
  return mergeLessonStudy(progress.lessonStudy)[lesson.id] ?? null;
}

export function writeStudy<P extends WordoraProgress>(old: P, lessonId: string, study: Omit<LessonStudy, 'updatedAt'>): P {
  return { ...old, lessonStudy: { ...old.lessonStudy, [lessonId]: { ...study, updatedAt: new Date().toISOString() } } };
}
