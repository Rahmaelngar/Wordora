import type { LanguageId } from '../../data';

type TranscriptLine = { wordId: string; term: string; arabicMeaning: string; sentence: string; sentenceArabic: string };
// Frozen to the published four-phrase narration. Appending vocabulary must NOT
// imply that the unchanged video/WAV already teaches the additional words.
export const greetingTranscript: Record<LanguageId, TranscriptLine[]> = {
  english: [
    { wordId: 'english-1-1', term: 'Hello', arabicMeaning: 'مرحبًا', sentence: 'Hello, welcome!', sentenceArabic: 'مرحبًا، أهلًا بك!' },
    { wordId: 'english-1-2', term: 'Good morning', arabicMeaning: 'صباح الخير', sentence: 'Good morning, Sara.', sentenceArabic: 'صباح الخير يا سارة.' },
    { wordId: 'english-1-3', term: 'How are you?', arabicMeaning: 'كيف حالك؟', sentence: 'I am doing well, thank you.', sentenceArabic: 'أنا بخير، شكرًا لك.' },
    { wordId: 'english-1-4', term: 'My name is…', arabicMeaning: 'اسمي…', sentence: 'My name is Lina.', sentenceArabic: 'اسمي لينا.' },
  ],
  french: [
    { wordId: 'french-1-1', term: 'Bonjour', arabicMeaning: 'مرحبًا', sentence: 'Bonjour, bienvenue !', sentenceArabic: 'مرحبًا، أهلًا بك!' },
    { wordId: 'french-1-2', term: 'Salut', arabicMeaning: 'أهلًا (غير رسمي)', sentence: 'Salut, Sara.', sentenceArabic: 'أهلًا يا سارة.' },
    { wordId: 'french-1-3', term: 'Comment ça va ?', arabicMeaning: 'كيف حالك؟', sentence: 'Je vais bien, merci.', sentenceArabic: 'أنا بخير، شكرًا لك.' },
    { wordId: 'french-1-4', term: 'Je m’appelle…', arabicMeaning: 'اسمي…', sentence: 'Je m’appelle Lina.', sentenceArabic: 'اسمي لينا.' },
  ],
  spanish: [
    { wordId: 'spanish-1-1', term: 'Hola', arabicMeaning: 'مرحبًا', sentence: '¡Hola, bienvenida!', sentenceArabic: 'مرحبًا، أهلًا بك!' },
    { wordId: 'spanish-1-2', term: 'Buenos días', arabicMeaning: 'صباح الخير', sentence: 'Buenos días, Sara.', sentenceArabic: 'صباح الخير يا سارة.' },
    { wordId: 'spanish-1-3', term: '¿Cómo estás?', arabicMeaning: 'كيف حالك؟', sentence: 'Estoy bien, gracias.', sentenceArabic: 'أنا بخير، شكرًا لك.' },
    { wordId: 'spanish-1-4', term: 'Me llamo…', arabicMeaning: 'اسمي…', sentence: 'Me llamo Lina.', sentenceArabic: 'اسمي لينا.' },
  ],
  german: [
    { wordId: 'german-1-1', term: 'Hallo', arabicMeaning: 'مرحبًا', sentence: 'Hallo, willkommen!', sentenceArabic: 'مرحبًا، أهلًا بك!' },
    { wordId: 'german-1-2', term: 'Guten Morgen', arabicMeaning: 'صباح الخير', sentence: 'Guten Morgen, Sara.', sentenceArabic: 'صباح الخير يا سارة.' },
    { wordId: 'german-1-3', term: 'Wie geht es dir?', arabicMeaning: 'كيف حالك؟', sentence: 'Mir geht es gut, danke.', sentenceArabic: 'أنا بخير، شكرًا لك.' },
    { wordId: 'german-1-4', term: 'Ich heiße…', arabicMeaning: 'اسمي…', sentence: 'Ich heiße Lina.', sentenceArabic: 'اسمي لينا.' },
  ],
  italian: [
    { wordId: 'italian-1-1', term: 'Ciao', arabicMeaning: 'مرحبًا', sentence: 'Ciao, benvenuta!', sentenceArabic: 'مرحبًا، أهلًا بك!' },
    { wordId: 'italian-1-2', term: 'Buongiorno', arabicMeaning: 'صباح الخير', sentence: 'Buongiorno, Sara.', sentenceArabic: 'صباح الخير يا سارة.' },
    { wordId: 'italian-1-3', term: 'Come stai?', arabicMeaning: 'كيف حالك؟', sentence: 'Sto bene, grazie.', sentenceArabic: 'أنا بخير، شكرًا لك.' },
    { wordId: 'italian-1-4', term: 'Mi chiamo…', arabicMeaning: 'اسمي…', sentence: 'Mi chiamo Lina.', sentenceArabic: 'اسمي لينا.' },
  ],
};
