import type { LanguageId } from '../../data';

const locales: Record<LanguageId, string> = {
  english: 'en', french: 'fr', spanish: 'es', german: 'de', italian: 'it', turkish: 'tr',
};
export function normalizeLearningAnswer(value: string, language: LanguageId) {
  // Turkish I/İ must be lowercased BEFORE stripping combining marks.
  let normalized = value.toLocaleLowerCase(locales[language]);
  if (language === 'german') normalized = normalized.replace(/ß/g, 'ss');
  return normalized.normalize('NFD').replace(/\p{M}/gu, '')
    .replace(/[^\p{L}\p{N}\s]/gu, '').replace(/\s+/g, ' ').trim();
}
