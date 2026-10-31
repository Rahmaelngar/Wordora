import { additionalWords } from './extra-vocabulary';
import { expandedCurriculum } from './expanded-curriculum';
import { advancedCurriculum } from './advanced-curriculum';
import { contentCorrections } from './content-corrections';
import { learningLevels, type CurriculumLevel } from './curriculum-levels';

export type LanguageId = 'english' | 'french' | 'spanish' | 'german' | 'italian' | 'turkish';
export type LegacyLanguageId = Exclude<LanguageId, 'turkish'>;
export type Level = CurriculumLevel;
export type Word = { id: string; term: string; arabicMeaning: string; pronunciation: string; example: string; exampleArabic: string };
export type Lesson = { id: string; languageId: LanguageId; level: Level; topic: string; words: Word[] };
export type Language = { id: LanguageId; name: string; arabicName: string; code: string; flag: string };
export const languages: Language[] = [
  { id: 'english', name: 'English', arabicName: 'الإنجليزية', code: 'EN', flag: 'GB' },
  { id: 'french', name: 'French', arabicName: 'الفرنسية', code: 'FR', flag: 'FR' },
  { id: 'spanish', name: 'Spanish', arabicName: 'الإسبانية', code: 'ES', flag: 'ES' },
  { id: 'german', name: 'German', arabicName: 'الألمانية', code: 'DE', flag: 'DE' },
  { id: 'italian', name: 'Italian', arabicName: 'الإيطالية', code: 'IT', flag: 'IT' },
  { id: 'turkish', name: 'Türkçe', arabicName: 'التركية', code: 'TR', flag: 'TR' },
];
const legacyLanguages = languages.filter((language): language is Language & { id: LegacyLanguageId } => language.id !== 'turkish');
type TopicData = { title: string; group: string; phrases: Record<LegacyLanguageId, [string, string, string, string]> };
const topics: TopicData[] = [
  { title: 'التحية والتعارف', group: 'Greetings', phrases: {
    english: ['Hello', 'Good morning', 'How are you?', 'My name is…'], french: ['Bonjour', 'Salut', 'Comment ça va ?', 'Je m’appelle…'],
    spanish: ['Hola', 'Buenos días', '¿Cómo estás?', 'Me llamo…'], german: ['Hallo', 'Guten Morgen', 'Wie geht es dir?', 'Ich heiße…'],
    italian: ['Ciao', 'Buongiorno', 'Come stai?', 'Mi chiamo…'],
  } },
  { title: 'الأرقام والأيام', group: 'Numbers & days', phrases: {
    english: ['One', 'Two', 'Today', 'Tomorrow'], french: ['Un', 'Deux', 'Aujourd’hui', 'Demain'],
    spanish: ['Uno', 'Dos', 'Hoy', 'Mañana'], german: ['Eins', 'Zwei', 'Heute', 'Morgen'], italian: ['Uno', 'Due', 'Oggi', 'Domani'],
  } },
  { title: 'الألوان والأشياء', group: 'Colors & things', phrases: {
    english: ['Red', 'Blue', 'A book', 'A bag'], french: ['Rouge', 'Bleu', 'Un livre', 'Un sac'],
    spanish: ['Rojo', 'Azul', 'Un libro', 'Una bolsa'], german: ['Rot', 'Blau', 'Ein Buch', 'Eine Tasche'], italian: ['Rosso', 'Blu', 'Un libro', 'Una borsa'],
  } },
  { title: 'الطعام والشراب', group: 'Food & drinks', phrases: {
    english: ['Water', 'Coffee', 'Bread', 'I am hungry'], french: ['De l’eau', 'Un café', 'Du pain', 'J’ai faim'],
    spanish: ['Agua', 'Un café', 'Pan', 'Tengo hambre'], german: ['Wasser', 'Kaffee', 'Brot', 'Ich habe Hunger'], italian: ['Acqua', 'Un caffè', 'Pane', 'Ho fame'],
  } },
  { title: 'العائلة والأصدقاء', group: 'Family & friends', phrases: {
    english: ['My family', 'A friend', 'My mother', 'My brother'], french: ['Ma famille', 'Un ami', 'Ma mère', 'Mon frère'],
    spanish: ['Mi familia', 'Un amigo', 'Mi madre', 'Mi hermano'], german: ['Meine Familie', 'Ein Freund', 'Meine Mutter', 'Mein Bruder'], italian: ['La mia famiglia', 'Un amico', 'Mia madre', 'Mio fratello'],
  } },
  { title: 'التسوق والأسعار', group: 'Shopping', phrases: {
    english: ['How much?', 'It is cheap', 'I would like this', 'A receipt'], french: ['Combien ?', 'C’est pas cher', 'Je voudrais ceci', 'Un reçu'],
    spanish: ['¿Cuánto cuesta?', 'Es barato', 'Quisiera esto', 'Un recibo'], german: ['Wie viel kostet es?', 'Es ist günstig', 'Ich möchte das', 'Eine Quittung'], italian: ['Quanto costa?', 'È economico', 'Vorrei questo', 'Una ricevuta'],
  } },
  { title: 'السفر والمواصلات', group: 'Travel & transport', phrases: {
    english: ['The station', 'A ticket', 'Where is the bus?', 'Turn left'], french: ['La gare', 'Un billet', 'Où est le bus ?', 'Tournez à gauche'],
    spanish: ['La estación', 'Un billete', '¿Dónde está el autobús?', 'Gire a la izquierda'], german: ['Der Bahnhof', 'Eine Fahrkarte', 'Wo ist der Bus?', 'Biegen Sie links ab'], italian: ['La stazione', 'Un biglietto', 'Dov’è l’autobus?', 'Giri a sinistra'],
  } },
  { title: 'محادثات يومية', group: 'Everyday conversation', phrases: {
    english: ['Please', 'Thank you', 'I understand', 'Could you help me?'], french: ['S’il vous plaît', 'Merci', 'Je comprends', 'Pouvez-vous m’aider ?'],
    spanish: ['Por favor', 'Gracias', 'Entiendo', '¿Puede ayudarme?'], german: ['Bitte', 'Danke', 'Ich verstehe', 'Können Sie mir helfen?'], italian: ['Per favore', 'Grazie', 'Capisco', 'Può aiutarmi?'],
  } },
];
const meanings: Record<string, string[]> = {
  Greetings: ['مرحباً', 'صباح الخير', 'كيف حالك؟', 'اسمي…'],
  'Numbers & days': ['واحد', 'اثنان', 'اليوم', 'غداً'],
  'Colors & things': ['أحمر', 'أزرق', 'كتاب', 'حقيبة'],
  'Food & drinks': ['ماء', 'قهوة', 'خبز', 'أنا جائع'],
  'Family & friends': ['عائلتي', 'صديق', 'أمي', 'أخي'],
  Shopping: ['بكم هذا؟', 'إنه رخيص', 'أريد هذا', 'إيصال'],
  'Travel & transport': ['المحطة', 'تذكرة', 'أين الحافلة؟', 'انعطف يساراً'],
  'Everyday conversation': ['من فضلك', 'شكراً', 'أنا أفهم', 'هل يمكنك مساعدتي؟'],
};
const pronunciation: Record<LegacyLanguageId, string[]> = {
  english: ['هِلّو', 'جُد مورنينغ', 'هاو آر يو؟', 'ماي نيم إز'],
  french: ['بونجور', 'سالو', 'كومون تا ڤا؟', 'جُ مابيل'],
  spanish: ['أولا', 'بوينوس دياس', 'كومو إستاس؟', 'مي يامو'],
  german: ['هالو', 'غوتن مورغن', 'ڤي غيت إس دير؟', 'إش هايسه'],
  italian: ['تشاو', 'بونجورنو', 'كومه ستاي؟', 'مي كيامو'],
};
const pronunciationHints: Record<LegacyLanguageId, Record<string, [string, string, string, string]>> = {
  english: {
    'Numbers & days':['وَن','تو','تُداي','تُمورو'],'Colors & things':['رِد','بلو','أ بُك','ماي باگ'],
    'Food & drinks':['ووتر','كوفي','بريد','آي آم هَنجري'],'Family & friends':['ماي فاميلي','أ فرِند','ماي مَذَر','ماي برَذَر'],
    Shopping:['هاو مَتش؟','ذِس إز تشيب','آي وُد لايك ذِس','أ رِسيت'],'Travel & transport':['ذَ ستيشن','أ تِكت','وِير إز ذَ بَس؟','تِرن لِفت'],
    'Everyday conversation':['بليز','ثانك يو','آي أندرستاند','كُد يو هِلب مي؟'],
  },
  french: {
    'Numbers & days':['أَن','دو','أوجوردوي','دومان'],'Colors & things':['لا بوم إيه روج','لُ سييل إيه بلو','أَن ليفر','مون ساك'],
    'Food & drinks':['دُ لو','أَن كافيه','دو بان','جي فان'],'Family & friends':['ما فامي','أَن أمي','ما مير','مون فرير'],
    Shopping:['كومبيان؟','سي بو مارشيه','جُ فودري سُسي','أَن ريسو'],'Travel & transport':['لا غار','أَن بييه','أو إيه لُ بوس؟','تورنيه آ غوش'],
    'Everyday conversation':['سيل فو بليه','ميرسي','جُ كومبرون','بوفيه فو ميديه؟'],
  },
  spanish: {
    'Numbers & days':['أونو','دوس','أوي','مانْيانا'],'Colors & things':['لا مانثانا إس روخا','إل ثييلو إس أثول','أون ليبرو','مي بولسا'],
    'Food & drinks':['أغوا','كافيه','بان','تينغو أمبري'],'Family & friends':['مي فاميليا','أون أميغو','مي مادري','مي إيرمانو'],
    Shopping:['كوانتو كوستا؟','إس باراطو','كيريا إستى','أون ريثيبو'],'Travel & transport':['لا إستانثيون','أون بيييتي','دوندي إستا إل أوتوبوس؟','خيرى آ لا إكثيردا'],
    'Everyday conversation':['بور فابور','غراسياس','إنتيندو','بويدي أيودارمي؟'],
  },
  german: {
    'Numbers & days':['آينس','تسفاي','هويته','مورغن'],'Colors & things':['دير أبفل إيست روت','دير هيمِل إيست بلاو','آين بوخ','ماينه تاشه'],
    'Food & drinks':['فاسر','كافيه','بروت','إش هابه هونغر'],'Family & friends':['ماينه فاميليه','آين فرويند','ماينه موتر','ماين برودر'],
    Shopping:['في فيل كوستت داس؟','داس إيست غونستش','إش موخته داس','آينه كفيتونغ'],'Travel & transport':['دير بانهوف','آينه فاركارتِ','فو إيست دير بوس؟','بيغن زي لينكس آب'],
    'Everyday conversation':['بيته','دانكه','إش فيرشتهه','كونن زي مير هلفن؟'],
  },
  italian: {
    'Numbers & days':['أونو','دوي','أوجي','دوماني'],'Colors & things':['لا ميلا إيه روسّا','إل تشيلو إيه بلو','أون ليبرو','لا ميا بورسا'],
    'Food & drinks':['أكوا','كافّيه','بانِه','أو فامي'],'Family & friends':['لا ميا فاميليا','أون أميكو','ميا مادرِه','ميو فراتيلّو'],
    Shopping:['كوانتو كوستا؟','إي إكونوميكو','ڤورّي كوِستو','أونا ريتشيڤوتا'],'Travel & transport':['لا ستاتسيوني','أون بيلييتو','دوڤي لآوتوبوس؟','جيري آ سينيسترا'],
    'Everyday conversation':['بير فاڤوري','غراتسيه','كاپيسكو','پووي آيوتارمي؟'],
  },
};
const examples: Record<LegacyLanguageId, string[]> = {
  english: ['Hello, welcome!', 'Good morning, Sara.', 'I am doing well, thank you.', 'My name is Lina.'],
  french: ['Bonjour, bienvenue !', 'Salut, Sara.', 'Je vais bien, merci.', 'Je m’appelle Lina.'],
  spanish: ['¡Hola, bienvenida!', 'Buenos días, Sara.', 'Estoy bien, gracias.', 'Me llamo Lina.'],
  german: ['Hallo, willkommen!', 'Guten Morgen, Sara.', 'Mir geht es gut, danke.', 'Ich heiße Lina.'],
  italian: ['Ciao, benvenuta!', 'Buongiorno, Sara.', 'Sto bene, grazie.', 'Mi chiamo Lina.'],
};
const examplesAr = ['مرحباً، أهلاً بك!', 'صباح الخير يا سارة.', 'أنا بخير، شكراً لك.', 'اسمي لينا.'];
const exampleSentences: Record<LegacyLanguageId, Record<string, [string, string, string, string]>> = {
  english: {
    'Numbers & days': ['One apple, please.', 'Two tickets, please.', 'Today is sunny.', 'We travel tomorrow.'],
    'Colors & things': ['The apple is red.', 'The sky is blue.', 'A book is on the table.', 'My bag is here.'],
    'Food & drinks': ['I drink water.', 'I like coffee.', 'I eat bread.', 'I am hungry.'],
    'Family & friends': ['My family is kind.', 'A friend is here.', 'My mother is at home.', 'My brother is happy.'],
    Shopping: ['How much is this?', 'This is cheap.', 'I would like this.', 'Please give me a receipt.'],
    'Travel & transport': ['The station is near.', 'I have a ticket.', 'Where is the bus?', 'Turn left here.'],
    'Everyday conversation': ['Please come in.', 'Thank you for your help.', 'I understand the question.', 'Could you help me?'],
  },
  french: {
    'Numbers & days': ['Une pomme, s’il vous plaît.', 'Deux billets, s’il vous plaît.', 'Il fait beau aujourd’hui.', 'Nous voyageons demain.'],
    'Colors & things': ['La pomme est rouge.', 'Le ciel est bleu.', 'Un livre est sur la table.', 'Mon sac est ici.'],
    'Food & drinks': ['De l’eau, s’il vous plaît.', 'Un café, s’il vous plaît.', 'Du pain, s’il vous plaît.', 'J’ai faim.'],
    'Family & friends': ['Ma famille est gentille.', 'Un ami est ici.', 'Ma mère est à la maison.', 'Mon frère est content.'],
    Shopping: ['Combien coûte ceci ?', 'C’est bon marché.', 'Je voudrais ceci.', 'Un reçu, s’il vous plaît.'],
    'Travel & transport': ['La gare est près d’ici.', 'Un billet, s’il vous plaît.', 'Où est le bus ?', 'Tournez à gauche ici.'],
    'Everyday conversation': ['Entrez, s’il vous plaît.', 'Merci pour votre aide.', 'Je comprends la question.', 'Pouvez-vous m’aider ?'],
  },
  spanish: {
    'Numbers & days': ['Una manzana, por favor.', 'Dos billetes, por favor.', 'Hoy hace sol.', 'Viajamos mañana.'],
    'Colors & things': ['La manzana es roja.', 'El cielo es azul.', 'Un libro está sobre la mesa.', 'Mi bolsa está aquí.'],
    'Food & drinks': ['Bebo agua.', 'Me gusta el café.', 'Como pan.', 'Tengo hambre.'],
    'Family & friends': ['Mi familia es amable.', 'Un amigo está aquí.', 'Mi madre está en casa.', 'Mi hermano está contento.'],
    Shopping: ['¿Cuánto cuesta?', 'Es barato.', 'Quisiera esto.', 'Por favor, deme un recibo.'],
    'Travel & transport': ['La estación está cerca.', 'Tengo un billete.', '¿Dónde está el autobús?', 'Gire a la izquierda aquí.'],
    'Everyday conversation': ['Por favor, pasa.', 'Gracias por tu ayuda.', 'Entiendo la pregunta.', '¿Puedes ayudarme?'],
  },
  german: {
    'Numbers & days': ['Einen Apfel, bitte.', 'Zwei Fahrkarten, bitte.', 'Heute ist es sonnig.', 'Morgen reisen wir.'],
    'Colors & things': ['Der Apfel ist rot.', 'Der Himmel ist blau.', 'Ein Buch liegt auf dem Tisch.', 'Meine Tasche ist hier.'],
    'Food & drinks': ['Ich trinke Wasser.', 'Ich mag Kaffee.', 'Ich esse Brot.', 'Ich habe Hunger.'],
    'Family & friends': ['Meine Familie ist freundlich.', 'Ein Freund ist hier.', 'Meine Mutter ist zu Hause.', 'Mein Bruder ist glücklich.'],
    Shopping: ['Wie viel kostet das?', 'Das ist günstig.', 'Ich möchte das.', 'Bitte geben Sie mir eine Quittung.'],
    'Travel & transport': ['Der Bahnhof ist in der Nähe.', 'Ich habe eine Fahrkarte.', 'Wo ist der Bus?', 'Biegen Sie hier links ab.'],
    'Everyday conversation': ['Bitte kommen Sie herein.', 'Danke für Ihre Hilfe.', 'Ich verstehe die Frage.', 'Können Sie mir helfen?'],
  },
  italian: {
    'Numbers & days': ['Una mela, per favore.', 'Due biglietti, per favore.', 'Oggi c’è il sole.', 'Domani viaggiamo.'],
    'Colors & things': ['La mela è rossa.', 'Il cielo è blu.', 'Un libro è sul tavolo.', 'La mia borsa è qui.'],
    'Food & drinks': ['Bevo acqua.', 'Mi piace il caffè.', 'Mangio il pane.', 'Ho fame.'],
    'Family & friends': ['La mia famiglia è gentile.', 'Un amico è qui.', 'Mia madre è a casa.', 'Mio fratello è felice.'],
    Shopping: ['Quanto costa?', 'È economico.', 'Vorrei questo.', 'Per favore, mi dà una ricevuta?'],
    'Travel & transport': ['La stazione è vicina.', 'Ho un biglietto.', 'Dov’è l’autobus?', 'Giri a sinistra qui.'],
    'Everyday conversation': ['Per favore, entra.', 'Grazie per il tuo aiuto.', 'Capisco la domanda.', 'Puoi aiutarmi?'],
  },
};
const exampleTranslations: Record<string, [string, string, string, string]> = {
  'Numbers & days': ['تفاحة واحدة، من فضلك.', 'تذكرتان، من فضلك.', 'الجو مشمس اليوم.', 'سنسافر غدًا.'],
  'Colors & things': ['التفاحة حمراء.', 'السماء زرقاء.', 'يوجد كتاب على الطاولة.', 'حقيبتي هنا.'],
  'Food & drinks': ['أشرب الماء.', 'أحب القهوة.', 'آكل الخبز.', 'أنا جائع.'],
  'Family & friends': ['عائلتي لطيفة.', 'صديق هنا.', 'أمي في المنزل.', 'أخي سعيد.'],
  Shopping: ['بكم هذا؟', 'هذا رخيص.', 'أريد هذا.', 'أعطني إيصالًا من فضلك.'],
  'Travel & transport': ['المحطة قريبة.', 'لدي تذكرة.', 'أين الحافلة؟', 'انعطف يسارًا هنا.'],
  'Everyday conversation': ['تفضل بالدخول.', 'شكرًا على مساعدتك.', 'أفهم السؤال.', 'هل يمكنك مساعدتي؟'],
};
const starterLessons: Lesson[] = legacyLanguages.flatMap((language) => topics.map((topic, topicIndex) => ({
  id: `${language.id}-${topicIndex + 1}`, languageId: language.id, level: topicIndex < 5 ? 'A1' : 'A2',
  topic: topic.title,
  words: topic.phrases[language.id].map((term, wordIndex) => ({
    id: `${language.id}-${topicIndex + 1}-${wordIndex + 1}`, term,
    arabicMeaning: language.id === 'french' && topicIndex === 0 && wordIndex === 1 ? 'أهلًا (غير رسمي)' : meanings[topic.group][wordIndex],
    pronunciation: topicIndex === 0 ? pronunciation[language.id][wordIndex] : pronunciationHints[language.id][topic.group][wordIndex],
    example: topicIndex === 0 ? examples[language.id][wordIndex] : exampleSentences[language.id][topic.group][wordIndex],
    exampleArabic: language.id === 'french' && topicIndex === 0 && wordIndex === 1 ? 'أهلًا يا سارة.' : topicIndex === 0 ? examplesAr[wordIndex] : exampleTranslations[topic.group][wordIndex],
  })),
})));
type Four = [string, string, string, string];
type AdvancedTopic = {
  title: string;
  phrases: Record<LegacyLanguageId, Four>;
  meanings: Four;
  examples: Record<LegacyLanguageId, Four>;
  pronunciations: Record<LegacyLanguageId, Four>;
  examplesArabic: Four;
};
const advancedTopics: AdvancedTopic[] = [
  {
    title: 'مواقف جديدة',
    phrases: {
      english: ['Could you repeat that?', 'I made a mistake.', 'I need more information.', 'There is a problem.'],
      french: ['Pouvez-vous répéter ?', 'J’ai fait une erreur.', 'J’ai besoin de plus d’informations.', 'Il y a un problème.'],
      spanish: ['¿Puede repetirlo?', 'Me equivoqué.', 'Necesito más información.', 'Hay un problema.'],
      german: ['Können Sie das wiederholen?', 'Ich habe einen Fehler gemacht.', 'Ich brauche mehr Informationen.', 'Es gibt ein Problem.'],
      italian: ['Può ripetere?', 'Ho fatto un errore.', 'Ho bisogno di più informazioni.', 'C’è un problema.'],
    },
    meanings: ['هل يمكنك تكرار ذلك؟', 'لقد ارتكبت خطأً.', 'أحتاج إلى مزيد من المعلومات.', 'هناك مشكلة.'],
    examples: {
      english: ['Could you repeat that more slowly, please?', 'I made a mistake in the address.', 'I need more information about the course.', 'There is a problem with my reservation.'],
      french: ['Pouvez-vous répéter ? Plus lentement, s’il vous plaît.', 'J’ai fait une erreur dans l’adresse.', 'J’ai besoin de plus d’informations sur le cours.', 'Il y a un problème avec ma réservation.'],
      spanish: ['¿Puede repetirlo más despacio, por favor?', 'Me equivoqué en la dirección.', 'Necesito más información sobre el curso.', 'Hay un problema con mi reserva.'],
      german: ['Können Sie das wiederholen? Bitte etwas langsamer.', 'Ich habe einen Fehler in der Adresse gemacht.', 'Ich brauche mehr Informationen über den Kurs.', 'Es gibt ein Problem mit meiner Reservierung.'],
      italian: ['Può ripetere? Più lentamente, per favore.', 'Ho fatto un errore nell’indirizzo.', 'Ho bisogno di più informazioni sul corso.', 'C’è un problema con la mia prenotazione.'],
    },
    pronunciations: {
      english: ['كُد يو رِبيت ذَت؟', 'آي مِيد أ مِستيك', 'آي نيد مور إنفورميشن', 'ذير إز أ برُبلم'],
      french: ['بوفيه ڤو ريپيتيه؟', 'جي في أَن إيغور', 'جي بوزوان دُ پلُس دانفورماسيون', 'إيل يا أَن بروبليم'],
      spanish: ['بويدي ريبيتيرلو؟', 'مي إكيوڤوكيه', 'نيسيسيتو ماس إنفورماسيون', 'آي أون بروبليما'],
      german: ['كونن زي داس ڤيدرهولن؟', 'إش هابه آينن فيلر گِماخت', 'إش براوخه مور إنفورماتسيونن', 'إس گيبت آين بروبليم'],
      italian: ['پو رپيتيِره؟', 'أو فاتّو أون إيرّوري', 'أو بيسونيو دي پيو إنفورماتسيوني', 'تشيه أون بروبليما'],
    },
    examplesArabic: ['هل يمكنك تكرار ذلك ببطء أكثر، من فضلك؟', 'ارتكبت خطأً في العنوان.', 'أحتاج إلى معلومات أكثر عن الدورة.', 'هناك مشكلة في حجزي.'],
  },
  {
    title: 'التعبير عن الرأي',
    phrases: {
      english: ['In my opinion', 'I agree with you.', 'I disagree.', 'I prefer this one.'],
      french: ['À mon avis', 'Je suis d’accord avec vous.', 'Je ne suis pas d’accord.', 'Je préfère celui-ci.'],
      spanish: ['En mi opinión', 'Estoy de acuerdo contigo.', 'No estoy de acuerdo.', 'Prefiero este.'],
      german: ['Meiner Meinung nach', 'Ich stimme Ihnen zu.', 'Ich bin nicht einverstanden.', 'Das hier gefällt mir besser.'],
      italian: ['Secondo me', 'Sono d’accordo con te.', 'Non sono d’accordo.', 'Preferisco questo.'],
    },
    meanings: ['في رأيي', 'أتفق معك.', 'أنا لا أوافق.', 'أفضل هذا الخيار.'],
    examples: {
      english: ['In my opinion, this is a good idea.', 'I agree with you about the plan.', 'I disagree with that decision.', 'I prefer this one because it is simple.'],
      french: ['À mon avis, c’est une bonne idée.', 'Je suis d’accord avec vous sur le plan.', 'Je ne suis pas d’accord avec cette décision.', 'Je préfère celui-ci parce qu’il est simple.'],
      spanish: ['En mi opinión, es una buena idea.', 'Estoy de acuerdo contigo sobre el plan.', 'No estoy de acuerdo con esa decisión.', 'Prefiero este porque es sencillo.'],
      german: ['Meiner Meinung nach ist das eine gute Idee.', 'Ich stimme Ihnen bei diesem Plan zu.', 'Ich bin mit dieser Entscheidung nicht einverstanden.', 'Das hier gefällt mir besser, weil es einfach ist.'],
      italian: ['Secondo me, è una buona idea.', 'Sono d’accordo con te sul piano.', 'Non sono d’accordo con questa decisione.', 'Preferisco questo perché è semplice.'],
    },
    pronunciations: {
      english: ['إن ماي أپينيَن', 'آي أغري وِذ يو', 'آي دِسَغري', 'آي پريفِر ذِس وَن'],
      french: ['آ مون أڤي', 'جُ سوي داكورك ڤو', 'جُ نُ سوي پا داكور', 'جُ پريڤير سُسي'],
      spanish: ['إن مي أپينيون', 'إستوي دي أكويردو كونتيغو', 'نو إستوي دي أكويردو', 'پريفيرو إستي'],
      german: ['ماينر ماينونغ ناخ', 'إش شتيمه إينن تسو', 'إش بين نيشت آينڤرشتاندن', 'داس هير گِفيلت مير بِسَر'],
      italian: ['سِكوندو مي', 'سونو داكّوردو كون تي', 'نون سونو داكّوردو', 'پريفيريسكو كويستو'],
    },
    examplesArabic: ['برأيي، هذه فكرة جيدة.', 'أتفق معك بخصوص الخطة.', 'لا أوافق على هذا القرار.', 'أفضل هذا الخيار لأنه بسيط.'],
  },
  {
    title: 'خططك القادمة',
    phrases: {
      english: ['I plan to visit', 'Next week', 'I would like to learn', 'Let’s meet tomorrow.'],
      french: ['Je prévois de visiter', 'La semaine prochaine', 'J’aimerais apprendre', 'Retrouvons-nous demain.'],
      spanish: ['Planeo visitar', 'La próxima semana', 'Me gustaría aprender', 'Quedemos mañana.'],
      german: ['Ich plane, ... zu besuchen', 'Nächste Woche', 'Ich möchte ... lernen', 'Treffen wir uns morgen.'],
      italian: ['Ho intenzione di visitare', 'La prossima settimana', 'Vorrei imparare', 'Incontriamoci domani.'],
    },
    meanings: ['أخطط لزيارة', 'الأسبوع القادم', 'أود أن أتعلم', 'لنلتقِ غدًا.'],
    examples: {
      english: ['I plan to visit Rome next year.', 'Next week, I have more time.', 'I would like to learn a new language.', 'Let’s meet tomorrow after work.'],
      french: ['Je prévois de visiter Rome l’année prochaine.', 'La semaine prochaine, j’ai plus de temps.', 'J’aimerais apprendre une nouvelle langue.', 'Retrouvons-nous demain après le travail.'],
      spanish: ['Planeo visitar Roma el próximo año.', 'La próxima semana tengo más tiempo.', 'Me gustaría aprender un idioma nuevo.', 'Quedemos mañana después del trabajo.'],
      german: ['Ich plane, nächstes Jahr Rom zu besuchen.', 'Nächste Woche habe ich mehr Zeit.', 'Ich möchte eine neue Sprache lernen.', 'Treffen wir uns morgen nach der Arbeit.'],
      italian: ['Ho intenzione di visitare Roma l’anno prossimo.', 'La prossima settimana ho più tempo.', 'Vorrei imparare una nuova lingua.', 'Incontriamoci domani dopo il lavoro.'],
    },
    pronunciations: {
      english: ['آي پلَان تو ڤيزِت', 'نِكست ويك', 'آي وُد لايك تو لِرن', 'لِتس ميت تُمورو'],
      french: ['جُ پريڤوا دُ ڤيزيتيه', 'لا سُمين پروشين', 'جيمري أپروندر', 'رُتروڤون نو دومان'],
      spanish: ['پلانيو ڤيسيتار', 'لا پروكسيما سيمانا', 'مي گوستاريا أپريندير', 'كيديموس مانْيانا'],
      german: ['إش پلانه تسو بزوخن', 'نيكسته ڤوخه', 'إش موخته ليرنن', 'تريفن ڤير أونس مورغن'],
      italian: ['أو إنتينتسيوني دي ڤيزيتاره', 'لا پروسيما سيتّيمانا', 'ڤورّي إيمپاراره', 'إنكونترِياموتشي دوماني'],
    },
    examplesArabic: ['أخطط لزيارة روما العام القادم.', 'الأسبوع القادم لدي وقت أكثر.', 'أود أن أتعلم لغة جديدة.', 'لنلتقِ غدًا بعد العمل.'],
  },
];
const advancedLessons: Lesson[] = legacyLanguages.flatMap((language) => advancedTopics.map((topic, topicIndex) => ({
  id: `${language.id}-b1-${topicIndex+1}`,
  languageId: language.id,
  level: 'B1' as Level,
  topic: topic.title,
  words: topic.phrases[language.id].map((term, wordIndex) => ({
    id: `${language.id}-b1-${topicIndex+1}-${wordIndex+1}`,
    term,
    arabicMeaning: topic.meanings[wordIndex],
    pronunciation: topic.pronunciations[language.id][wordIndex],
    example: topic.examples[language.id][wordIndex],
    exampleArabic: topic.examplesArabic[wordIndex],
  })),
})));
const originalLessons: Lesson[] = [...starterLessons, ...advancedLessons].map(lesson => ({
  ...lesson, words: [...lesson.words, ...additionalWords(lesson)],
}));
export const lessons: Lesson[] = [...originalLessons, ...expandedCurriculum, ...advancedCurriculum].map(lesson => ({
  ...lesson, words: lesson.words.map(word => ({ ...word, ...contentCorrections[word.id] })),
})).sort((a, b) =>
  languages.findIndex(language => language.id === a.languageId) - languages.findIndex(language => language.id === b.languageId)
  || learningLevels.indexOf(a.level) - learningLevels.indexOf(b.level),
);
export const lessonById = (id: string) => lessons.find((lesson) => lesson.id === id);
