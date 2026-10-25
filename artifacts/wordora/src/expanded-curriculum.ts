import type { LanguageId, Lesson, Level } from './data';
import englishA1 from './curriculum/english-A1.json';
import englishA2 from './curriculum/english-A2.json';
import englishB1 from './curriculum/english-B1.json';
import frenchA1 from './curriculum/french-A1.json';
import frenchA2 from './curriculum/french-A2.json';
import frenchB1 from './curriculum/french-B1.json';
import spanishA1 from './curriculum/spanish-A1.json';
import spanishA2 from './curriculum/spanish-A2.json';
import spanishB1 from './curriculum/spanish-B1.json';
import germanA1 from './curriculum/german-A1.json';
import germanA2 from './curriculum/german-A2.json';
import germanB1 from './curriculum/german-B1.json';
import italianA1 from './curriculum/italian-A1.json';
import italianA2 from './curriculum/italian-A2.json';
import italianB1 from './curriculum/italian-B1.json';

const packets: Record<LanguageId, Record<Level, typeof englishA1>> = {
  english: { A1: englishA1, A2: englishA2, B1: englishB1 },
  french: { A1: frenchA1, A2: frenchA2, B1: frenchB1 },
  spanish: { A1: spanishA1, A2: spanishA2, B1: spanishB1 },
  german: { A1: germanA1, A2: germanA2, B1: germanB1 },
  italian: { A1: italianA1, A2: italianA2, B1: italianB1 },
};

export const expandedCurriculum: Lesson[] = Object.entries(packets).flatMap(([language, levels]) =>
  (['A1', 'A2', 'B1'] as const).flatMap(level => levels[level].lessons.map((chapter, index) => {
    const id = `${language}-${level.toLowerCase()}-expand-${index + 1}`;
    return {
      id, languageId: language as LanguageId, level, topic: chapter.topic,
      words: chapter.words.map(([term, arabicMeaning, pronunciation, example, exampleArabic], wordIndex) => ({
        id: `${id}-${wordIndex + 1}`, term, arabicMeaning, pronunciation, example, exampleArabic,
      })),
    };
  })),
);
