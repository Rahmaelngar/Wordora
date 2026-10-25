import type { LegacyLanguageId, Lesson, Word } from './data';

type Phrase = [term: string, pronunciation: string, example: string];
type ExtraTopic = {
  meanings: [string, string];
  examplesArabic: [string, string];
  phrases: Record<LegacyLanguageId, [Phrase, Phrase]>;
};

// Append-only curriculum additions: existing word IDs and ordering stay stable.
const extraTopics: Record<string, ExtraTopic> = {
  '1': {
    meanings: ['إلى اللقاء', 'مساء الخير'],
    examplesArabic: ['إلى اللقاء، أراك غدًا.', 'مساء الخير للجميع.'],
    phrases: {
      english: [['Goodbye', 'غُد باي', 'Goodbye, see you tomorrow.'], ['Good evening', 'غُد إيفنينغ', 'Good evening, everyone.']],
      french: [['Au revoir', 'أو رُڤوار', 'Au revoir, à demain.'], ['Bonsoir', 'بونسوار', 'Bonsoir à tous.']],
      spanish: [['Adiós', 'أديوس', 'Adiós, hasta mañana.'], ['Buenas noches', 'بويناس نوتشيس', 'Buenas noches a todos.']],
      german: [['Auf Wiedersehen', 'أوف ڤيدرزيهن', 'Auf Wiedersehen, bis morgen.'], ['Guten Abend', 'غوتن آبِنت', 'Guten Abend zusammen.']],
      italian: [['Arrivederci', 'أرّيڤيديرتشي', 'Arrivederci, a domani.'], ['Buonasera', 'بونا سيرا', 'Buonasera a tutti.']],
    },
  },
  '2': {
    meanings: ['ثلاثة', 'أمس'],
    examplesArabic: ['لدي ثلاثة كتب.', 'وصلت أمس.'],
    phrases: {
      english: [['Three', 'ثري', 'I have three books.'], ['Yesterday', 'يِسترداي', 'I arrived yesterday.']],
      french: [['Trois', 'تروا', 'J’ai trois livres.'], ['Hier', 'يير', 'Je suis arrivé hier.']],
      spanish: [['Tres', 'تريس', 'Tengo tres libros.'], ['Ayer', 'أيير', 'Llegué ayer.']],
      german: [['Drei', 'دراي', 'Ich habe drei Bücher.'], ['Gestern', 'غِسترن', 'Ich bin gestern angekommen.']],
      italian: [['Tre', 'تري', 'Ho tre libri.'], ['Ieri', 'ييري', 'Sono arrivato ieri.']],
    },
  },
  '3': {
    meanings: ['أخضر', 'أبيض'],
    examplesArabic: ['الكتاب أخضر.', 'القميص أبيض.'],
    phrases: {
      english: [['Green', 'غرين', 'The book is green.'], ['White', 'وايت', 'The shirt is white.']],
      french: [['Vert', 'ڤير', 'Le livre est vert.'], ['Blanc', 'بلان', 'Le chemisier est blanc.']],
      spanish: [['Verde', 'بيردي', 'El libro es verde.'], ['Blanca', 'بلانكا', 'La camisa es blanca.']],
      german: [['Grün', 'غرون', 'Das Buch ist grün.'], ['Weiß', 'ڤايس', 'Das Hemd ist weiß.']],
      italian: [['Verde', 'ڤيردي', 'Il libro è verde.'], ['Bianca', 'بيانكا', 'La camicia è bianca.']],
    },
  },
  '4': {
    meanings: ['شاي', 'حليب'],
    examplesArabic: ['أشرب الشاي.', 'الحليب بارد.'],
    phrases: {
      english: [['Tea', 'تي', 'I drink tea.'], ['Milk', 'مِلك', 'The milk is cold.']],
      french: [['Thé', 'تيه', 'Je bois du thé.'], ['Lait', 'ليه', 'Le lait est froid.']],
      spanish: [['Té', 'تيه', 'Bebo té.'], ['Leche', 'ليتشي', 'La leche está fría.']],
      german: [['Tee', 'تيه', 'Ich trinke Tee.'], ['Milch', 'مِلش', 'Die Milch ist kalt.']],
      italian: [['Tè', 'تيه', 'Bevo tè.'], ['Latte', 'لاتّيه', 'Il latte è freddo.']],
    },
  },
  '5': {
    meanings: ['أبي', 'أختي'],
    examplesArabic: ['أبي في المنزل.', 'أختي هنا.'],
    phrases: {
      english: [['My father', 'ماي فاذر', 'My father is at home.'], ['My sister', 'ماي سيستر', 'My sister is here.']],
      french: [['Mon père', 'مون پير', 'Mon père est à la maison.'], ['Ma sœur', 'ما سور', 'Ma sœur est ici.']],
      spanish: [['Mi padre', 'مي پادري', 'Mi padre está en casa.'], ['Mi hermana', 'مي إرمانا', 'Mi hermana está aquí.']],
      german: [['Mein Vater', 'ماين فاتَر', 'Mein Vater ist zu Hause.'], ['Meine Schwester', 'ماينه شڤيستر', 'Meine Schwester ist hier.']],
      italian: [['Mio padre', 'ميو پادري', 'Mio padre è a casa.'], ['Mia sorella', 'ميا سوريلّا', 'Mia sorella è qui.']],
    },
  },
  '6': {
    meanings: ['غالي الثمن', 'أدفع بالبطاقة'],
    examplesArabic: ['هذا غالي الثمن.', 'أدفع بالبطاقة.'],
    phrases: {
      english: [['Expensive', 'إكسپِنسيڤ', 'This is expensive.'], ['I pay by card', 'آي پاي باي كارد', 'I pay by card.']],
      french: [['Cher', 'شير', 'C’est cher.'], ['Je paie par carte', 'جُ پي پار كارت', 'Je paie par carte.']],
      spanish: [['Caro', 'كارو', 'Esto es caro.'], ['Pago con tarjeta', 'پاغو كون تارخيتا', 'Pago con tarjeta.']],
      german: [['Teuer', 'تويَر', 'Das ist teuer.'], ['Ich zahle mit Karte', 'إش تساله مِت كارته', 'Ich zahle mit Karte.']],
      italian: [['Caro', 'كارو', 'Questo è caro.'], ['Pago con la carta', 'پاغو كون لا كارتا', 'Pago con la carta.']],
    },
  },
  '7': {
    meanings: ['قطار', 'مطار'],
    examplesArabic: ['القطار هنا.', 'المطار قريب.'],
    phrases: {
      english: [['Train', 'ترين', 'The train is here.'], ['Airport', 'إيرپورت', 'The airport is near.']],
      french: [['Train', 'تران', 'Le train est ici.'], ['Aéroport', 'أيروپور', 'L’aéroport est proche.']],
      spanish: [['Tren', 'ترين', 'El tren está aquí.'], ['Aeropuerto', 'أيروپويرتو', 'El aeropuerto está cerca.']],
      german: [['Zug', 'تسوغ', 'Der Zug ist hier.'], ['Flughafen', 'فلوغهافن', 'Der Flughafen ist in der Nähe.']],
      italian: [['Treno', 'ترينو', 'Il treno è qui.'], ['Aeroporto', 'أيروپورتو', 'L’aeroporto è vicino.']],
    },
  },
  '8': {
    meanings: ['عذرًا', 'لا أفهم'],
    examplesArabic: ['عذرًا، أين المحطة؟', 'لا أفهم السؤال.'],
    phrases: {
      english: [['Excuse me', 'إكسكيوز مي', 'Excuse me, where is the station?'], ['I do not understand', 'آي دو نوت أندرستاند', 'I do not understand the question.']],
      french: [['Excusez-moi', 'إكسكوزيه موا', 'Excusez-moi, où est la gare ?'], ['Je ne comprends pas', 'جُ نُ كومپرون پا', 'Je ne comprends pas la question.']],
      spanish: [['Disculpe', 'ديسكولپي', 'Disculpe, ¿dónde está la estación?'], ['No entiendo', 'نو إنتييندو', 'No entiendo la pregunta.']],
      german: [['Entschuldigung', 'إنتشولديغونغ', 'Entschuldigung, wo ist der Bahnhof?'], ['Ich verstehe nicht', 'إش فيرشتهه نِشت', 'Ich verstehe nicht die Frage.']],
      italian: [['Mi scusi', 'مي سكوزي', 'Mi scusi, dov’è la stazione?'], ['Non capisco', 'نون كاپيسكو', 'Non capisco la domanda.']],
    },
  },
  'b1-1': {
    meanings: ['لدي سؤال', 'أحتاج إلى مزيد من الوقت'],
    examplesArabic: ['لدي سؤال عن الدرس.', 'أحتاج إلى مزيد من الوقت لإنهاء هذا.'],
    phrases: {
      english: [['I have a question', 'آي هاڤ أ كويستشن', 'I have a question about the lesson.'], ['I need more time', 'آي نيد مور تايم', 'I need more time to finish this.']],
      french: [['J’ai une question', 'جي يون كيستيون', 'J’ai une question sur la leçon.'], ['J’ai besoin de plus de temps', 'جي بوزوان دُ پلُس دُ تون', 'J’ai besoin de plus de temps pour terminer ceci.']],
      spanish: [['Tengo una pregunta', 'تينغو أونا پريغونتا', 'Tengo una pregunta sobre la lección.'], ['Necesito más tiempo', 'نيسيسيتو ماس تييمپو', 'Necesito más tiempo para terminar esto.']],
      german: [['Ich habe eine Frage', 'إش هابه آينه فراغه', 'Ich habe eine Frage zur Lektion.'], ['Ich brauche mehr Zeit', 'إش براوخه مير تسايت', 'Ich brauche mehr Zeit, um das zu beenden.']],
      italian: [['Ho una domanda', 'أو أونا دوماندا', 'Ho una domanda sulla lezione.'], ['Ho bisogno di più tempo', 'أو بيزونيو دي پيو تيمپو', 'Ho bisogno di più tempo per finire questo.']],
    },
  },
  'b1-2': {
    meanings: ['من المهم', 'لست متأكدًا'],
    examplesArabic: ['من المهم أن تتدرب كل يوم.', 'لست متأكدًا مما إذا كان ذلك صحيحًا.'],
    phrases: {
      english: [['It is important', 'إت إز إمپورتنت', 'It is important to practise every day.'], ['I am not sure', 'آي آم نوت شور', 'I am not sure whether that is correct.']],
      french: [['C’est important', 'سي تانپورتون', 'C’est important de pratiquer chaque jour.'], ['Je ne suis pas sûr', 'جُ نُ سوي پا سور', 'Je ne suis pas sûr que ce soit correct.']],
      spanish: [['Es importante', 'إس إمپورتانتي', 'Es importante practicar cada día.'], ['No estoy seguro', 'نو إستوي سيغورو', 'No estoy seguro de que eso sea correcto.']],
      german: [['Es ist wichtig', 'إس إيست ڤِشتِش', 'Es ist wichtig, jeden Tag zu üben.'], ['Ich bin mir nicht sicher', 'إش بِن مير نِشت زِشَر', 'Ich bin mir nicht sicher, ob das richtig ist.']],
      italian: [['È importante', 'إيه إمپورتانتي', 'È importante fare pratica ogni giorno.'], ['Non sono sicuro', 'نون سونو سيكورو', 'Non sono sicuro che sia corretto.']],
    },
  },
  'b1-3': {
    meanings: ['نهاية هذا الأسبوع', 'في الصيف'],
    examplesArabic: ['سأسافر نهاية هذا الأسبوع.', 'أزور عائلتي في الصيف.'],
    phrases: {
      english: [['This weekend', 'ذِس ويك إند', 'I will travel this weekend.'], ['In the summer', 'إن ذَ سَمَر', 'I visit my family in the summer.']],
      french: [['Ce week-end', 'سُ ويك إند', 'Je voyagerai ce week-end.'], ['En été', 'أون إيتيه', 'Je rends visite à ma famille en été.']],
      spanish: [['Este fin de semana', 'إستي فين دي سيمانا', 'Viajaré este fin de semana.'], ['En verano', 'إن بيرانُو', 'Visito a mi familia en verano.']],
      german: [['Dieses Wochenende', 'ديزِس ڤوخِن إنده', 'Ich werde dieses Wochenende verreisen.'], ['Im Sommer', 'إم زومَر', 'Ich besuche meine Familie im Sommer.']],
      italian: [['Questo fine settimana', 'كويستو فيني سيتّيمانا', 'Viaggerò questo fine settimana.'], ['In estate', 'إن إستاتي', 'Visito la mia famiglia in estate.']],
    },
  },
};

export function additionalWords(lesson: Lesson): Word[] {
  if (lesson.languageId === 'turkish') return [];
  const topic = extraTopics[lesson.id.slice(lesson.languageId.length + 1)];
  if (!topic) return [];
  return topic.phrases[lesson.languageId].map(([term, pronunciation, example], index) => ({
    id: `${lesson.id}-${index + 5}`, term, pronunciation, example,
    arabicMeaning: topic.meanings[index], exampleArabic: topic.examplesArabic[index],
  }));
}
