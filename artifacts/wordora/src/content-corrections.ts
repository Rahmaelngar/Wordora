import type { Word } from './data';

// Reviewed editorial corrections survive content regeneration and preserve IDs.
export const contentCorrections: Record<string, Partial<Omit<Word, 'id'>>> = {
  'turkish-b1-expand-6-6': { arabicMeaning: 'إذا أنهيت هذا التقرير اليوم فسأرتاح غدًا أكثر.', exampleArabic: 'إذا أنهيت هذا التقرير اليوم فسأرتاح غدًا أكثر.' },
  'turkish-b1-expand-11-5': { arabicMeaning: 'أحيانًا تكون تجربة طريق مختلف أكثر فاعلية.', exampleArabic: 'أحيانًا تكون تجربة طريق مختلف أكثر فاعلية.' },
  'turkish-b1-expand-12-7': { arabicMeaning: 'تعلمت أشياء كثيرة أثناء عيشي في تلك المدينة.', exampleArabic: 'تعلمت أشياء كثيرة أثناء عيشي في تلك المدينة.' },
  'english-a2-expand-3-2': { exampleArabic: 'تابع السير إلى الأمام مسافة مربعين سكنيين.' },
  'english-a2-expand-4-10': { arabicMeaning: 'أنا متفرغ بعد ظهر اليوم', exampleArabic: 'أنا متفرغ بعد ظهر اليوم.' },
  'french-4-1': { exampleArabic: 'ماء، من فضلك.' },
  'french-4-2': { exampleArabic: 'قهوة، من فضلك.' },
  'french-4-3': { exampleArabic: 'خبز، من فضلك.' },
  'french-6-4': { exampleArabic: 'إيصال، من فضلك.' },
  'french-7-2': { exampleArabic: 'تذكرة، من فضلك.' },
  'french-b1-expand-3-9': { arabicMeaning: 'هو هادئ مثل أخته.', exampleArabic: 'هو هادئ مثل أخته.' },
  'french-b1-expand-12-14': { arabicMeaning: 'لن أنسى هذه اللحظة أبدًا.', exampleArabic: 'لن أنسى هذه اللحظة أبدًا.' },
  'spanish-a2-expand-2-8': { arabicMeaning: 'المنشفة' },
  'spanish-b1-expand-3-2': { arabicMeaning: 'هذه القهوة أقل حلاوة من السابقة.', exampleArabic: 'هذه القهوة أقل حلاوة من السابقة.' },
  'spanish-b1-expand-7-7': { arabicMeaning: 'هناك قواعد تتغير بحسب المنطقة.', exampleArabic: 'هناك قواعد تتغير بحسب المنطقة.' },
  'italian-a1-expand-3-1': { exampleArabic: 'التيشيرت أبيض.' },
  'italian-b1-expand-12-14': { arabicMeaning: 'إجابته فاجأتني كثيرًا.', exampleArabic: 'إجابته فاجأتني كثيرًا.', pronunciation: 'لا سوا ريسبوستا مي ها سورپريزو مولتو.' },
};
