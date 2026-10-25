import type { Word } from '../../data';

const normalize = (text: string) => text.replace(/[^\p{L}\p{N}]/gu, '').toLocaleLowerCase();
const escape = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const pattern = (target: string) => new RegExp(`(?<![\\p{L}\\p{N}])${escape(target)}(?![\\p{L}\\p{N}])`, 'iu');
export function getClozeTarget(word: Word): string {
  const term = word.term.replace(/[.…!?]+$/u, '').trim();
  if (normalize(term) !== normalize(word.example) && term && pattern(term).test(word.example)) return term;
  // A full B1 sentence or an inflected/non-verbatim example needs a genuine
  // missing word, never an empty entire sentence or a question with no gap.
  return word.example.match(/[\p{L}]+(?:['’][\p{L}]+)?/gu)?.at(-1) ?? word.term;
}
export function maskCloze(sentence: string, target: string) {
  return sentence.replace(pattern(target), '______');
}
