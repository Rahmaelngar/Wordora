import type { WordoraProgress } from '@workspace/api-client-react';
import { lessons } from '../../data';

type StudyMap = NonNullable<WordoraProgress['lessonStudy']>;
const object = (value: unknown): value is Record<string, unknown> =>
  !!value && typeof value === 'object' && !Array.isArray(value);

/** Merge each lesson independently so a cloud checkpoint cannot erase a newer local one. */
export function mergeLessonStudy(...sources: unknown[]): StudyMap {
  const result: StudyMap = {};
  for (const source of sources) {
    if (!object(source)) continue;
    for (const [id, raw] of Object.entries(source)) {
      const lesson = lessons.find(item => item.id === id);
      if (!lesson || !lesson.words.length || !object(raw)) continue;
      const studied = new Set(Array.isArray(raw.studiedWordIds) ? raw.studiedWordIds : []);
      const studiedWordIds = lesson.words.filter(word => studied.has(word.id)).map(word => word.id);
      const timestamp = typeof raw.updatedAt === 'string' ? Date.parse(raw.updatedAt) : NaN;
      const updatedAt = Number.isFinite(timestamp) ? new Date(timestamp).toISOString() : new Date(0).toISOString();
      if (result[id] && Date.parse(result[id].updatedAt) > Date.parse(updatedAt)) continue;
      const firstNewWord = raw.stage === 'summary' && studiedWordIds.length < lesson.words.length
        ? lesson.words.findIndex(word => !studied.has(word.id)) : -1;
      result[id] = {
        wordIndex: firstNewWord >= 0 ? firstNewWord : typeof raw.wordIndex === 'number' && Number.isInteger(raw.wordIndex)
          ? Math.max(0, Math.min(raw.wordIndex, lesson.words.length - 1)) : 0,
        studiedWordIds,
        stage: raw.stage === 'summary' && studiedWordIds.length === lesson.words.length ? 'summary' : 'words',
        updatedAt,
      };
    }
  }
  return result;
}
