import type { LanguageId, Lesson } from './data';
import englishB2 from './curriculum/english-B2.json';
import englishC1 from './curriculum/english-C1.json';
import englishC2 from './curriculum/english-C2.json';
import frenchB2 from './curriculum/french-B2.json';
import frenchC1 from './curriculum/french-C1.json';
import frenchC2 from './curriculum/french-C2.json';
import spanishB2 from './curriculum/spanish-B2.json';
import spanishC1 from './curriculum/spanish-C1.json';
import spanishC2 from './curriculum/spanish-C2.json';
import germanB2 from './curriculum/german-B2.json';
import germanC1 from './curriculum/german-C1.json';
import germanC2 from './curriculum/german-C2.json';
import italianB2 from './curriculum/italian-B2.json';
import italianC1 from './curriculum/italian-C1.json';
import italianC2 from './curriculum/italian-C2.json';
import turkishB2 from './curriculum/turkish-B2.json';
import turkishC1 from './curriculum/turkish-C1.json';
import turkishC2 from './curriculum/turkish-C2.json';

const levels = ['B2', 'C1', 'C2'] as const;
const packets: Record<LanguageId, Record<typeof levels[number], typeof englishB2>> = {
  english: { B2: englishB2, C1: englishC1, C2: englishC2 },
  french: { B2: frenchB2, C1: frenchC1, C2: frenchC2 },
  spanish: { B2: spanishB2, C1: spanishC1, C2: spanishC2 },
  german: { B2: germanB2, C1: germanC1, C2: germanC2 },
  italian: { B2: italianB2, C1: italianC1, C2: italianC2 },
  turkish: { B2: turkishB2, C1: turkishC1, C2: turkishC2 },
};

export const advancedCurriculum: Lesson[] = Object.entries(packets).flatMap(([language, packets]) =>
  levels.flatMap(level => packets[level].lessons.map((chapter, index) => {
    const id = `${language}-${level.toLowerCase()}-expand-${index + 1}`;
    return {
      id, languageId: language as LanguageId, level, topic: chapter.topic,
      words: chapter.words.map(([term, arabicMeaning, pronunciation, example, exampleArabic], index) => ({
        id: `${id}-${index + 1}`, term, arabicMeaning, pronunciation, example, exampleArabic,
      })),
    };
  })),
);
