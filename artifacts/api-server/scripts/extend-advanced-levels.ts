import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { openai } from "@workspace/integrations-openai-ai-server";
import { languages } from "../../wordora/src/data";

type AdvancedLevel = "B2" | "C1" | "C2";
type Entry = { text: string; meaning: string; pronunciation: string };
type Batch = { lessons: { topic: string; entries: Entry[] }[] };
const directory = resolve(import.meta.dirname, "../../wordora/src/curriculum");
const cache = resolve(import.meta.dirname, "../../../generated-artifacts/advanced-curriculum-cache");
await mkdir(cache, { recursive: true });
const topics = [
  "التعلّم المستقل", "التفاوض باحترام", "العمل الجماعي", "حل النزاعات", "المقابلات المهنية",
  "اتخاذ القرارات", "التواصل الرقمي", "التنوع الثقافي", "الحياة في مدينة جديدة", "السياحة المسؤولة",
  "الصحة النفسية والراحة", "التوازن بين العمل والحياة", "حماية البيئة", "الاستهلاك المسؤول", "الابتكار والتغيير",
  "قراءة الأخبار بوعي", "المقارنة بين البدائل", "تنظيم الحجج", "تفسير البيانات", "التخطيط للمستقبل",
  "التجارب والتأمل", "العلاقات الاجتماعية", "المشاركة المجتمعية", "التعبير عن المشاعر", "الفن والأدب",
  "الهوية والانتماء", "الأخلاق والمسؤولية", "البحث والنقاش الأكاديمي", "فهم المعاني الضمنية", "التكيّف مع الغموض",
  "الأسلوب الرسمي وغير الرسمي", "البلاغة والتعبير الدقيق", "النقد البنّاء", "السخرية والتلميح", "إعادة الصياغة والتلخيص",
];
const plans: { level: AdvancedLevel; count: number; guidance: string }[] = [
  { level: "B2", count: 250, guidance: "Upper-intermediate: natural multi-clause sentences, clear opinions with reasons, contrasting arguments, hypotheses and polite negotiation. More advanced than B1, but practical and not literary." },
  { level: "C1", count: 300, guidance: "Advanced: precise nuanced expressions, inference, register-sensitive professional/academic communication, concession and qualification. Meaningful complex syntax and natural idiomatic collocations, not merely long basic sentences." },
  { level: "C2", count: 350, guidance: "Proficient: subtle stance, implicit meaning, rhetorical contrast, sophisticated but authentic idioms, flexible formal/informal register. Choose useful natural language rather than obscure words; accurately convey nuance in Arabic." },
];
const normalize = (text: string) => text.normalize("NFD").replace(/\p{M}/gu, "").replace(/[^\p{L}\p{N}]/gu, "").toLowerCase();
const valid = (entry: Entry) => entry && typeof entry.text === "string" && entry.text.trim().length >= 20 && entry.text.length <= 230
  && [entry.meaning, entry.pronunciation].every(value => typeof value === "string" && value.trim() && /\p{Script=Arabic}/u.test(value));
const tasks = languages.flatMap(language => plans.flatMap(plan =>
  Array.from({ length: plan.count / 50 }, (_, batch) => ({ language, plan, batch, selected: topics.slice(batch * 5, batch * 5 + 5) }))));
const entrySchema = { type: "object", additionalProperties: false, required: ["text", "meaning", "pronunciation"],
  properties: { text: { type: "string" }, meaning: { type: "string" }, pronunciation: { type: "string" } } };
let cursor = 0;
let failed = false;
async function call(prompt: string, schema: object) {
  const response = await openai.chat.completions.create({
    model: "gpt-5.4-mini", reasoning_effort: "low", max_completion_tokens: 16000,
    response_format: { type: "json_schema", json_schema: { name: "advanced_curriculum", strict: true, schema } },
    messages: [{ role: "system", content: "You are an expert native-language CEFR curriculum author and Arabic translator. Return exact structured data, never placeholders or numbered near-duplicates. Phonetic pronunciation must use Arabic letters and cover the COMPLETE target sentence, not its meaning." }, { role: "user", content: prompt }],
  }, { timeout: 240000 });
  return JSON.parse(response.choices[0]?.message.content ?? "");
}
async function worker() {
  while (cursor < tasks.length) {
    const task = tasks[cursor++], { language, plan, batch, selected } = task;
    const path = resolve(cache, `${language.id}-${plan.level}-${batch}.json`);
    try {
      let packet: Batch;
      try { packet = JSON.parse(await readFile(path, "utf8")); }
      catch {
        packet = await call(`Language=${language.name}; CEFR=${plan.level}. ${plan.guidance}
Create exactly5 lessons in this exact topic order: ${JSON.stringify(selected)}. Exactly10 DISTINCT complete sentences per lesson. Every sentence20–230 characters and naturally illustrates its topic. All50 must have different communicative content, not template substitutions. Include an accurate complete Arabic translation and approximate complete Arabic-script pronunciation. No English text unless English is the target. Avoid sensitive personal disclosures, discriminatory claims or unverified medical advice.`, {
          type: "object", additionalProperties: false, required: ["lessons"],
          properties: { lessons: { type: "array", minItems: 5, maxItems: 5, items: {
            type: "object", additionalProperties: false, required: ["topic", "entries"], properties: {
              topic: { type: "string" }, entries: { type: "array", minItems: 10, maxItems: 10, items: entrySchema },
            },
          } } },
        });
        await writeFile(path, JSON.stringify(packet, null, 2) + "\n");
      }
      if (packet.lessons.length !== 5 || packet.lessons.some(lesson => lesson.entries.length !== 10)) throw new Error("Incorrect lesson/entry count");
      packet.lessons.forEach((lesson, index) => { lesson.topic = selected[index]; });
      const rows = packet.lessons.flatMap(lesson => lesson.entries);
      for (let attempt = 0; attempt < 3; attempt++) {
        const seen = new Set<string>();
        const bad = rows.map((entry, index) => ({ entry, index, topic: selected[Math.floor(index / 10)] }))
          .filter(({ entry }) => { const duplicate = seen.has(normalize(entry.text ?? "")); seen.add(normalize(entry.text ?? "")); return !valid(entry) || duplicate; });
        if (!bad.length) break;
        const result = await call(`Fix ONLY these invalid or duplicate ${language.name} ${plan.level} entries. Preserve index, use different natural full sentences20–230 chars where duplicate, and provide complete Arabic translation AND full Arabic-script phonetic pronunciation. Every meaning and pronunciation must include Arabic letters. ${plan.guidance}\nBad=${JSON.stringify(bad)}\nExcluded=${JSON.stringify(rows.map(row => row.text))}`, {
          type: "object", additionalProperties: false, required: ["repairs"], properties: { repairs: { type: "array", items: {
            type: "object", additionalProperties: false, required: ["index", "entry"],
            properties: { index: { type: "integer" }, entry: entrySchema },
          } } },
        });
        for (const repair of result.repairs) if (rows[repair.index]) Object.assign(rows[repair.index], repair.entry);
        await writeFile(path, JSON.stringify(packet, null, 2) + "\n");
      }
      if (rows.some(entry => !valid(entry)) || new Set(rows.map(entry => normalize(entry.text))).size !== 50) throw new Error("Invalid entries after targeted repairs");
      await writeFile(path, JSON.stringify(packet, null, 2) + "\n");
      console.log(`READY ${language.id} ${plan.level} batch${batch + 1}:50`);
    } catch (error) { failed = true; console.error(`FAILED ${language.id}/${plan.level}/${batch}: ${error instanceof Error ? error.message : error}`); }
  }
}
await Promise.all(Array.from({ length: 10 }, worker));
if (failed) throw new Error("Some batches failed. Cached text preserved; rerun to resume.");
for (const language of languages) for (const plan of plans) {
  const chapters = [];
  for (let batch = 0; batch < plan.count / 50; batch++) {
    const packet: Batch = JSON.parse(await readFile(resolve(cache, `${language.id}-${plan.level}-${batch}.json`), "utf8"));
    chapters.push(...packet.lessons.map(lesson => ({ topic: lesson.topic, words: lesson.entries.map(entry =>
      [entry.text, entry.meaning, entry.pronunciation, entry.text, entry.meaning]) })));
  }
  const entries = chapters.flatMap(chapter => chapter.words);
  if (entries.length !== plan.count) throw new Error(`Invalid count: ${language.id}/${plan.level}`);
  for (let attempt = 0; attempt < 3; attempt++) {
    const seen = new Set<string>();
    const duplicates = entries.map((row, index) => ({ index, text: row[0], topic: chapters[Math.floor(index / 10)].topic }))
      .filter(item => { const duplicate = seen.has(normalize(item.text)); seen.add(normalize(item.text)); return duplicate; });
    if (!duplicates.length) break;
    const replacement = await call(`Replace ONLY these duplicate ${language.name}/${plan.level} full sentences with distinct natural sentences about their existing topics. Include full Arabic meaning and full Arabic-script pronunciation. Preserve indices;20–230chars. ${plan.guidance}\nDuplicates=${JSON.stringify(duplicates)}\nExcluded=${JSON.stringify(entries.map(row => row[0]))}`, {
      type: "object", additionalProperties: false, required: ["repairs"], properties: { repairs: { type: "array", items: {
        type: "object", additionalProperties: false, required: ["index", "entry"],
        properties: { index: { type: "integer" }, entry: entrySchema },
      } } },
    });
    for (const repair of replacement.repairs) {
      if (!entries[repair.index] || !valid(repair.entry)) throw new Error("Invalid targeted repair");
      const entry: Entry = repair.entry;
      entries[repair.index].splice(0, 5, entry.text, entry.meaning, entry.pronunciation, entry.text, entry.meaning);
    }
  }
  if (new Set(entries.map(row => normalize(row[0]))).size !== plan.count) throw new Error(`Unresolved duplicates: ${language.id}/${plan.level}`);
  // Cache final editorial state so a later resume never reintroduces duplicates.
  for (let batch = 0; batch < plan.count / 50; batch++) {
    const packet: Batch = { lessons: chapters.slice(batch * 5, batch * 5 + 5).map(chapter => ({
      topic: chapter.topic, entries: chapter.words.map(row => ({ text: row[0], meaning: row[1], pronunciation: row[2] })),
    })) };
    await writeFile(resolve(cache, `${language.id}-${plan.level}-${batch}.json`), JSON.stringify(packet, null, 2) + "\n");
  }
  await writeFile(resolve(directory, `${language.id}-${plan.level}.json`), JSON.stringify({ lessons: chapters, fullSentences: true }, null, 2) + "\n");
  console.log(`COMPLETE ${language.id} ${plan.level}: ${plan.count}`);
}
console.log("COMPLETE:5400 new advanced sentences; existing2700 preserved.");
