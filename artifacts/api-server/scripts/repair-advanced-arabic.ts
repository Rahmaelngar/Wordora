import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { openai } from "@workspace/integrations-openai-ai-server";
import { lessons } from "../../wordora/src/data";
const path = resolve(import.meta.dirname, "../../wordora/src/advanced-language-fixes.json");
const fixes = JSON.parse(await readFile(path, "utf8")) as Record<string, { pronunciation?: string; arabicMeaning?: string; exampleArabic?: string }>;
const isArabic = (value: string) => [...value].filter(letter => /\p{L}/u.test(letter)).every(letter => /\p{Script_Extensions=Arabic}/u.test(letter));
const bad = lessons.filter(lesson => ["B2", "C1", "C2"].includes(lesson.level))
  .flatMap(lesson => lesson.words.filter(word => !isArabic(word.pronunciation)).map(word => ({ id: word.id, language: lesson.languageId, text: word.term })));
const chunks = Array.from({ length: Math.ceil(bad.length / 15) }, (_, index) => bad.slice(index * 15, index * 15 + 15));
let cursor = 0;
let saving = Promise.resolve();
async function worker() {
  while (cursor < chunks.length) {
    let remaining = chunks[cursor++];
    for (let attempt = 0; remaining.length && attempt < 3; attempt++) {
      const response = await openai.chat.completions.create({
        model: "gpt-5.4-mini", reasoning_effort: "low", max_completion_tokens: 10000,
        response_format: { type: "json_object" },
        messages: [{ role: "system", content: "Write the COMPLETE phonetic pronunciation of each target sentence using ONLY Arabic-script letters (Arabic/Persian پ گ ڤ ژ permitted), spaces and punctuation. No Latin, Greek, Georgian, Cyrillic, Armenian, Hindi or Japanese letters, no IPA symbols. Use Arabic approximation: e.g Spanish ñ=ني and θ=ث, Turkish ğ=lengthening not Latin ğ; include ALL words. Return JSON {\"rows\":[{\"id\":\"exact supplied id\",\"pronunciation\":\"...\"}]}. Preserve IDs exactly. Do not translate." }, { role: "user", content: JSON.stringify(remaining) }],
      }, { timeout: 180000 });
      for (const item of JSON.parse(response.choices[0]?.message.content ?? "").rows) {
        if (!remaining.some(row => row.id === item.id) || typeof item.pronunciation !== "string" || !/\p{Script=Arabic}/u.test(item.pronunciation) || !isArabic(item.pronunciation)) continue;
        fixes[item.id] = { ...fixes[item.id], pronunciation: item.pronunciation };
      }
      remaining = remaining.filter(row => !fixes[row.id]?.pronunciation || !isArabic(fixes[row.id].pronunciation!));
      saving = saving.then(() => writeFile(path, JSON.stringify(fixes, null, 2) + "\n"));
      await saving;
    }
    if (remaining.length) throw new Error(`Unrepaired phonetics: ${remaining.map(row => row.id).join(",")}`);
  }
}
await Promise.all(Array.from({ length: 5 }, worker));
console.log(`Validated Arabic-only pronunciation repairs for ${bad.length} entries.`);
