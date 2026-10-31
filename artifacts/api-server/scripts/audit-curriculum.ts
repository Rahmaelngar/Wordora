import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { openai } from "@workspace/integrations-openai-ai-server";
import { languages, lessons } from "../../wordora/src/data";

// Read-only linguistic review: proposals are saved for human/agent inspection,
// never applied automatically to the curriculum or learner progress.
const output = resolve(import.meta.dirname, "../../../generated-artifacts/curriculum-audit");
await mkdir(output, { recursive: true });
const requested = process.argv.find(arg => arg.startsWith("--language="))?.split("=")[1];
const selectedLevels = process.argv.find(arg => arg.startsWith("--levels="))?.split("=")[1].split(",");
const queue = languages.filter(language => (!requested || language.id === requested) && lessons.some(lesson => lesson.languageId === language.id));
let cursor = 0;
async function worker() {
  while (cursor < queue.length) {
    const language = queue[cursor++];
    const entries = lessons.filter(lesson => lesson.languageId === language.id && (!selectedLevels || selectedLevels.includes(lesson.level))).flatMap(lesson => lesson.words.map(word =>
      [word.id, word.term, word.arabicMeaning, ...(word.example === word.term ? [] : [word.example, word.exampleArabic])]));
    const response = await openai.chat.completions.create({
      model: "gpt-5.4-mini", reasoning_effort: "low", max_completion_tokens: 4000,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: `Audit ${language.name} learning material for Arabic speakers. Input rows=[id,term,ArabicMeaning,example?,ArabicExampleMeaning?]. When example is omitted, term is the full example sentence. Report ONLY clear factual translation errors, missing negation, wrong language, or unmistakably ungrammatical target-language text. Do not report stylistic preferences, acceptable Arabic paraphrases, minor gender differences or CEFR opinions. Do not change identifiers. No pronunciation audit requested. Return JSON {"issues":[{"id":"...","field":"term|arabicMeaning|example|exampleArabic","current":"exact old string","replacement":"corrected string","reason":"brief Arabic reason"}]}. Empty issues if no definite errors. At most15 genuine highest-confidence errors; review every row, do not fabricate problems.` },
        { role: "user", content: JSON.stringify(entries) },
      ],
    }, { timeout: 240000 });
    const report = JSON.parse(response.choices[0]?.message.content ?? "");
    if (!Array.isArray(report.issues)) throw new Error("Invalid audit response");
    await writeFile(resolve(output, `${language.id}.json`), JSON.stringify(report, null, 2) + "\n");
    console.log(`${language.name}: reviewed ${entries.length} entries; ${report.issues.length} proposed corrections`);
  }
}
await Promise.all(Array.from({ length: 3 }, worker));
