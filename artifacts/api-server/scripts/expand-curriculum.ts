import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { openai } from "@workspace/integrations-openai-ai-server";
import { languages, lessons } from "../../wordora/src/data";

const directory = resolve(import.meta.dirname, "../../wordora/src/curriculum");
const baseLessons = lessons.filter(lesson => !lesson.id.includes("-expand-"));
await mkdir(directory, { recursive: true });
const plans = [
  { level: "A1", size: 10, topics: ["المنزل والأثاث", "الجسم والصحة", "الملابس والأغراض", "المدرسة والتعلم", "المهن وأماكن العمل", "الطبيعة والحيوانات", "الهوايات والرياضة"] },
  { level: "A2", size: 12, topics: ["طلب الطعام في المطعم", "الإقامة في الفندق", "السؤال عن الاتجاهات", "الوقت والمواعيد", "زيارة الطبيب", "التواصل في العمل", "الهاتف والرسائل", "الأنشطة في وقت الفراغ", "الخدمات في المدينة", "الدفع والمصروفات", "الطلبات والاقتراحات المهذبة"] },
  { level: "B1", size: 14, topics: ["شرح الأسباب والنتائج", "الشرط والاحتمالات", "المقارنة والتباين", "التجارب الشخصية", "اختيار طريقة التعلم", "اتخاذ قرارات العمل", "الثقافة والمجتمع", "التكنولوجيا في حياتنا", "البيئة والعادات اليومية", "الأهداف والتطور الشخصي", "حل المشكلات", "حكاية موقف من الماضي", "التعاون وتبادل الاقتراحات"] },
] as const;
const normalize = (s: string) => s.normalize("NFD").replace(/\p{M}/gu, "").replace(/[^\p{L}\p{N}]/gu, "").toLowerCase();
type Chapter = { topic: string; words: [string, string, string, string, string][] };
type Packet = { lessons: Chapter[]; fullSentences?: boolean };
async function upgradeB1(packet: Packet, language: typeof languages[number]) {
  if (packet.fullSentences) return;
  const rows = packet.lessons.flatMap(chapter => chapter.words);
  const response = await openai.chat.completions.create({
    model: "gpt-5.4-mini", reasoning_effort: "low", max_completion_tokens: 16000,
    response_format: { type: "json_schema", json_schema: { name: "pronunciation", strict: true, schema: {
      type: "object", additionalProperties: false, required: ["pronunciations"],
      properties: { pronunciations: { type: "array", minItems: rows.length, maxItems: rows.length, items: { type: "string" } } },
    } } },
    messages: [
      { role: "system", content: `Write simplified Arabic-script phonetic approximations for these complete ${language.name} sentences. Exactly one pronunciation for EACH input sentence, same order. Transcribe the ENTIRE sentence, not just its first word. Do NOT translate the sentences into Arabic meanings. Help Arabic-speaking students pronounce native ${language.name}. Return JSON only.` },
      { role: "user", content: JSON.stringify(rows.map(row => row[3])) },
    ],
  }, { timeout: 300000 });
  const { pronunciations } = JSON.parse(response.choices[0]?.message.content ?? "") as { pronunciations: string[] };
  if (pronunciations.length !== rows.length || pronunciations.some(s => !s || !/\p{Script=Arabic}/u.test(s))) throw new Error("Invalid complete sentence pronunciation");
  rows.forEach((row, index) => { row[0] = row[3]; row[1] = row[4]; row[2] = pronunciations[index]; });
  packet.fullSentences = true;
}
async function repairDuplicates(packet: Packet, language: typeof languages[number], level: string) {
  for (let pass = 0; pass < 2; pass++) {
    const seen = new Set(baseLessons.filter(l => l.languageId === language.id).flatMap(l => l.words.map(w => normalize(w.term))));
    const replacements: { chapter: number; index: number; topic: string; row: string[] }[] = [];
    packet.lessons.forEach((chapter, ci) => chapter.words.forEach((row, index) => {
      if (seen.has(normalize(row[0]))) replacements.push({ chapter: ci, index, topic: chapter.topic, row });
      seen.add(normalize(row[0]));
    }));
    if (!replacements.length) return;
    const response = await openai.chat.completions.create({
      model: "gpt-5.4-mini", reasoning_effort: "low", max_completion_tokens: 7000,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: `You are a native ${language.name} curriculum editor for Arabic-speaking ${level} learners. Replace ONLY duplicate rows with DIFFERENT appropriate vocabulary/phrases for the given topic. Return JSON {"replacements":[{"chapter":number,"index":number,"row":["target term","Arabic meaning","Arabic-script approximate pronunciation","target example containing term","Arabic example translation"]}]}. Preserve chapter/index. Five nonempty strings per row. All new terms must be distinct and absent from the excluded set. Do not use article/case/punctuation variations of an excluded word.` },
        { role: "user", content: JSON.stringify({ replace: replacements, excluded: [...seen] }) },
      ],
    }, { timeout: 180000 });
    const value = JSON.parse(response.choices[0]?.message.content ?? "") as { replacements: typeof replacements };
    for (const item of value.replacements) {
      if (!replacements.some(r => r.chapter === item.chapter && r.index === item.index) || item.row.length !== 5) throw new Error("Invalid replacement");
      packet.lessons[item.chapter].words[item.index] = item.row as Chapter["words"][number];
    }
  }
}
function check(packet: Packet, plan: typeof plans[number], language: string) {
  if (packet.lessons?.length !== plan.topics.length) throw new Error("Incorrect lesson count");
  const terms = new Set(baseLessons.filter(l => l.languageId === language).flatMap(l => l.words.map(w => normalize(w.term))));
  const topics = new Set<string>();
  for (const chapter of packet.lessons) {
    if (!plan.topics.includes(chapter.topic as never) || topics.has(chapter.topic)) throw new Error("Invalid/repeated topic");
    topics.add(chapter.topic);
    if (chapter.words.length !== plan.size) throw new Error("Incorrect entry count");
    for (const row of chapter.words) {
      if (row.length !== 5 || row.some(s => typeof s !== "string" || !s.trim())) throw new Error("Empty content");
      const [term, meaning, pronunciation, example, translation] = row;
      if (term.length > 250 || example.length > 350) throw new Error("Audio input too long");
      if (![meaning, pronunciation, translation].every(s => /\p{Script=Arabic}/u.test(s))) throw new Error("Missing Arabic content");
      if (terms.has(normalize(term))) throw new Error(`Repeated term: ${term}`);
      terms.add(normalize(term));
    }
  }
}
const tasks = languages.flatMap(language => plans.map(plan => ({ language, plan })));
let cursor = 0;
async function worker() {
  while (cursor < tasks.length) {
    const { language, plan } = tasks[cursor++];
    const path = resolve(directory, `${language.id}-${plan.level}.json`);
    try {
      const cached = JSON.parse(await readFile(path, "utf8")) as Packet;
      if (plan.level === "B1" && !cached.fullSentences) {
        await upgradeB1(cached, language);
        check(cached, plan, language.id);
        await writeFile(path, JSON.stringify(cached, null, 2) + "\n");
      }
      check(cached, plan, language.id);
      console.log(`Cached ${language.name} ${plan.level}`);
      continue;
    } catch { /* Generate only absent or invalid content. */ }
    const excluded = baseLessons.filter(l => l.languageId === language.id).flatMap(l => l.words.map(w => w.term));
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const response = await openai.chat.completions.create({
          model: "gpt-5.4-mini", reasoning_effort: "low", max_completion_tokens: 32000,
          response_format: { type: "json_schema", json_schema: { name: "curriculum", strict: true, schema: {
            type: "object", additionalProperties: false, required: ["lessons"], properties: {
              lessons: { type: "array", minItems: plan.topics.length, maxItems: plan.topics.length, items: {
                type: "object", additionalProperties: false, required: ["topic", "words"], properties: {
                  topic: { type: "string", enum: [...plan.topics] },
                  words: { type: "array", minItems: plan.size, maxItems: plan.size, items: {
                    type: "array", minItems: 5, maxItems: 5, items: { type: "string" },
                  } },
                },
              } },
            },
          } } },
          messages: [
            { role: "system", content: `You are a careful native ${language.name} language curriculum editor for Arabic-speaking learners. Produce accurate, natural ${plan.level} educational content, not filler or duplicates. Every row has EXACTLY five strings: [target-language term, accurate Arabic meaning, simplified Arabic-script pronunciation of the target term, target-language example sentence, accurate Arabic translation of that example]. Arabic pronunciation is approximate but must be pronounceable, not a Latin transcription or an instruction. Use Arabic translations that match the actual sentence, including pronouns/tense/negation. Use natural grammar and punctuation. A1 terms should be distinct basic vocabulary (mostly single words). A2 terms must be useful short phrases with concrete everyday situations. B1 terms must be complete varied sentences using reasons, conditions, past experiences, intentions, comparisons and connected speech appropriate to B1. Examples must illustrate the exact term; A1/A2 examples must contain it verbatim ignoring case, and B1 examples can be the full sentence itself. Do not translate everything into English; only the target fields use ${language.name}. No English contamination in French, Spanish, German or Italian. No invented facts, insults, offensive content, marketing, or placeholder text. All terms must be unique throughout this response, ignoring accents/case/punctuation; do not repeat the same phrase with only punctuation differences.` },
            { role: "user", content: `Create exactly these ${plan.topics.length} topics in this order, each with exactly ${plan.size} distinct entries: ${JSON.stringify(plan.topics)}. Target ${language.name}, level ${plan.level}. Do NOT reuse any of these existing terms: ${JSON.stringify(excluded)}. Return complete JSON, no commentary. Revision attempt ${attempt + 1}; triple-check counts, distinctness and Arabic sentence translations.` },
          ],
        }, { timeout: 300000 });
        const packet = JSON.parse(response.choices[0]?.message.content ?? "") as Packet;
        await repairDuplicates(packet, language, plan.level);
        if (plan.level === "B1") await upgradeB1(packet, language);
        check(packet, plan, language.id);
        packet.lessons.sort((a, b) => plan.topics.indexOf(a.topic as never) - plan.topics.indexOf(b.topic as never));
        await writeFile(path, JSON.stringify(packet, null, 2) + "\n");
        console.log(`READY ${language.name} ${plan.level}: ${plan.topics.length * plan.size} new entries`);
        break;
      } catch (error) {
        console.warn(`${language.name} ${plan.level} attempt ${attempt + 1}: ${error instanceof Error ? error.message.slice(0, 240) : "failed"}`);
        if (attempt === 2) throw new Error(`Could not complete ${language.name} ${plan.level}`);
      }
    }
  }
}
const results = await Promise.allSettled(Array.from({ length: 5 }, worker));
if (results.some(result => result.status === "rejected")) throw new Error("Some curriculum packets failed; rerun to resume valid cached packets.");
console.log("All 15 language/level content packets validated.");
