import assert from 'node:assert/strict';
import { languages, lessons } from '../artifacts/wordora/src/data';
import { getDailyPlan, getReviewPool, mergeDailyActivity, recordDailyActivity } from '../artifacts/wordora/src/features/learning/daily';
import { mergeLessonStudy } from '../artifacts/wordora/src/features/learning/study-persistence';
import { greetingTranscript } from '../artifacts/wordora/src/features/learning/greeting-transcript';
import { getClozeTarget, maskCloze } from '../artifacts/wordora/src/features/learning/quiz-cloze';
import { normalizeLearningAnswer } from '../artifacts/wordora/src/features/learning/answer-normalization';
import { isLevelUnlocked } from '../artifacts/wordora/src/features/learning/study';
import { learningLevels, levelEntryTargets } from '../artifacts/wordora/src/curriculum-levels';
import { SaveWordoraProgressBody } from '../lib/api-zod/src/generated/api';
import type { WordoraProgress } from '../lib/api-client-react/src/index';

const normalize = (value: string) => value.normalize('NFD').replace(/\p{M}/gu, '').replace(/[^\p{L}\p{N}]/gu, '').toLowerCase();
const ids = new Set<string>();
const now = new Date(2026, 9, 25, 12);
const empty = (): WordoraProgress => ({
  selectedLanguage: null, completedLessons: [], savedWords: [], points: 77, streak: 0,
  lastActiveDate: null, quizAttempts: {}, lessonStudy: {}, dailyActivity: {},
});
assert.equal(languages.length, 6);
assert.equal(lessons.length, 795);
assert.equal(normalizeLearningAnswer('IŞIK', 'turkish'), normalizeLearningAnswer('ışık', 'turkish'));
assert.equal(normalizeLearningAnswer('İYİ', 'turkish'), normalizeLearningAnswer('iyi', 'turkish'));
assert.notEqual(normalizeLearningAnswer('I', 'turkish'), normalizeLearningAnswer('İ', 'turkish'));
assert.equal(normalizeLearningAnswer('STRASSE', 'german'), normalizeLearningAnswer('Straße', 'german'));
assert.equal(normalizeLearningAnswer('  good   morning ', 'english'), 'good morning');
for (const language of languages) {
  const languageLessons = lessons.filter(lesson => lesson.languageId === language.id);
  const levelOrder = languageLessons.map(lesson => learningLevels.indexOf(lesson.level));
  assert.deepEqual(levelOrder, [...levelOrder].sort((a, b) => a - b));
  const a1 = languageLessons.filter(lesson => lesson.level === 'A1').slice(0, 4).map(lesson => lesson.id);
  const a2 = languageLessons.filter(lesson => lesson.level === 'A2').slice(0, 2).map(lesson => lesson.id);
  assert.ok(isLevelUnlocked([], language.id, 'A1'));
  assert.ok(!isLevelUnlocked(a1.slice(0, 3), language.id, 'A2'));
  assert.ok(isLevelUnlocked(a1, language.id, 'A2'));
  assert.ok(!isLevelUnlocked(a1, language.id, 'B1'));
  assert.ok(isLevelUnlocked([...a1, ...a2], language.id, 'B1'));
  const foreignIds = lessons.filter(lesson => lesson.languageId !== language.id).map(lesson => lesson.id);
  assert.ok(!isLevelUnlocked(foreignIds, language.id, 'A2'));
  assert.ok(!isLevelUnlocked(foreignIds, language.id, 'B1'));
  for (const [level, previous, required] of [['B2','B1',4],['C1','B2',5],['C2','C1',6]] as const) {
    const prior = languageLessons.filter(lesson => lesson.level === previous).slice(0, required).map(lesson => lesson.id);
    assert.equal(prior.length, required);
    assert.ok(!isLevelUnlocked(prior.slice(0, -1), language.id, level), `${language.id}/${level} opens too soon`);
    assert.ok(isLevelUnlocked(prior, language.id, level), `${language.id}/${level} should open`);
    assert.ok(!isLevelUnlocked(Array(required).fill(prior[0]), language.id, level), 'Duplicate completions cannot unlock a level');
    assert.ok(!isLevelUnlocked(foreignIds, language.id, level), 'Other languages cannot unlock this level');
  }
  for (const [level, target] of learningLevels.map(level => [level, levelEntryTargets[level]] as const)) {
    const words = lessons.filter(lesson => lesson.languageId === language.id && lesson.level === level).flatMap(lesson => lesson.words);
    assert.equal(words.length, target, `${language.id}/${level}`);
    assert.equal(new Set(words.map(word => normalize(word.term))).size, target, `${language.id}/${level} duplicate terms`);
    for (const word of words) {
      assert.ok(!ids.has(word.id), `Duplicate ID ${word.id}`); ids.add(word.id);
      assert.ok([word.term, word.arabicMeaning, word.pronunciation, word.example, word.exampleArabic].every(text => text.trim()));
      assert.ok(word.example.length <= 400 && word.term.length <= 400, `Audio length ${word.id}`);
      assert.ok(maskCloze(word.example, getClozeTarget(word)).includes('______'), `Missing cloze gap ${word.id}`);
      if (['B1','B2','C1','C2'].includes(level) && word.id.includes('-expand-')) {
        assert.equal(word.term, word.example);
        if (['B2','C1','C2'].includes(level)) {
          assert.ok([...word.pronunciation].filter(letter=>/\p{L}/u.test(letter)).every(letter=>/\p{Script_Extensions=Arabic}/u.test(letter)), `Mixed-script pronunciation ${word.id}`);
          assert.ok(word.term.length>=20, `Advanced entry is a complete sentence: ${word.id}`);
        }
        assert.equal(word.arabicMeaning, word.exampleArabic);
      }
    }
  }
  // Every original lesson and its six IDs remains addressable.
  const original = lessons.filter(lesson => lesson.languageId === language.id && language.id !== 'turkish' && !lesson.id.includes('-expand-'));
  assert.equal(original.length, language.id === 'turkish' ? 0 : 11);
  for (const lesson of original) {
    assert.equal(lesson.words.length, 6);
    for (let i = 1; i <= 6; i++) assert.equal(lesson.words[i - 1].id, `${lesson.id}-${i}`);
    const old = { wordIndex: 3, studiedWordIds: lesson.words.slice(0, 4).map(word => word.id), stage: 'summary', updatedAt: '2026-10-25T10:00:00Z' };
    const restored = mergeLessonStudy({ [lesson.id]: old })[lesson.id];
    assert.equal(restored.wordIndex, 4); assert.equal(restored.stage, 'words');
    assert.deepEqual(restored.studiedWordIds, old.studiedWordIds);
  }
  const starter = lessons.find(lesson => lesson.id === `${language.id}-1`)!;
  for (const line of greetingTranscript[language.id]) {
    const word = starter.words.find(word => word.id === line.wordId)!;
    assert.equal(line.term, word.term); assert.equal(line.sentence, word.example);
  }
  let progress = empty();
  assert.equal(getDailyPlan(progress, language.id, 10, now).percent, 0);
  const pool = getReviewPool(progress, language.id);
  assert.ok(pool.length >= 3 && pool.every(item => item.lesson.languageId === language.id));
  progress = recordDailyActivity(progress, { completedLessonId: starter.id, correctWordIds: starter.words.slice(0, 5).map(word => word.id) }, now);
  for (const word of starter.words.slice(0, 3)) progress = recordDailyActivity(progress, { reviewedWordId: word.id }, now);
  const plan = getDailyPlan(progress, language.id, 10, now);
  assert.equal(plan.completed, true); assert.equal(plan.percent, 100);
  assert.equal(plan.reviewsDone, 3); assert.equal(plan.correctWords, 5); assert.equal(progress.points, 77);
  const duplicate = recordDailyActivity(progress, { reviewedWordId: starter.words[0].id, completedLessonId: starter.id }, now);
  assert.equal(getDailyPlan(duplicate, language.id, 10, now).reviewsDone, 3);
  assert.equal(getDailyPlan(duplicate, language.id, 10, now).lessonsDone, 1);
  assert.equal(duplicate.streak, 1);
  const tomorrow = new Date(2026, 9, 26, 12);
  const next = recordDailyActivity(duplicate, { reviewedWordId: starter.words[0].id }, tomorrow);
  assert.equal(next.streak, 2);
  assert.equal(getDailyPlan(next, language.id, 10, new Date(2026, 9, 29, 12)).streak, 0);
  assert.equal(recordDailyActivity(next, { reviewedWordId: starter.words[0].id }, new Date(2026, 9, 29, 12)).streak, 1);
  assert.equal(getDailyPlan(progress, languages.find(item => item.id !== language.id)!.id, 10, now).percent, 0);
  const merged = mergeDailyActivity(progress.dailyActivity, duplicate.dailyActivity);
  assert.equal(merged['2026-10-25'].reviewedWordIds.length, 3);
}
assert.equal(ids.size, 8100);
const fullProgress = empty();
fullProgress.completedLessons = lessons.map(lesson => lesson.id);
fullProgress.savedWords = [...ids];
fullProgress.lessonStudy = Object.fromEntries(lessons.map(lesson => [lesson.id, {
  wordIndex: lesson.words.length - 1, studiedWordIds: lesson.words.map(word => word.id),
  stage: 'summary', updatedAt: '2026-10-29T12:00:00Z',
}]));
fullProgress.dailyActivity = { '2026-10-29': {
  correctWordIds: [...ids], completedLessonIds: [...fullProgress.completedLessons], reviewedWordIds: [...ids],
} };
assert.ok(JSON.stringify(fullProgress).length > 100_000, 'Full progress exercises the expanded JSON body limit');
SaveWordoraProgressBody.parse(fullProgress);
assert.deepEqual(mergeDailyActivity({ invalid: {}, '2026-02-31': {} }), {});
for (const [minutes, words] of [[5, 3], [10, 5], [15, 8], [20, 10]]) assert.equal(getDailyPlan(empty(), 'english', minutes, now).wordTarget, words);
console.log('PASS:8100 entries/795 lessons; exact100/150/200/250/300/350 per language; six ordered levels, all cloze gaps, complete-progress API payload, original IDs/checkpoints, Turkish casing, daily activity/reviews/streaks and no replay rewards.');
