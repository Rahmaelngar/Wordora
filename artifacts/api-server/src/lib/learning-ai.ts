import { createHash } from "node:crypto";
import { openai } from "@workspace/integrations-openai-ai-server";
import { objectStorageClient, ObjectStorageService } from "./objectStorage";

export const languageNames: Record<string, string> = {
  english: "English", french: "French", spanish: "Spanish", german: "German", italian: "Italian", turkish: "Turkish",
};
export function publicMediaFile(name: string) {
  const path = new ObjectStorageService().getPublicObjectSearchPaths()[0];
  if (!path) throw new Error("Public media storage is not configured");
  const [bucket, ...prefix] = path.replace(/^\/+/, "").split("/");
  return objectStorageClient.bucket(bucket).file([...prefix, "wordora", name].join("/"));
}
export async function saveMedia(name: string, bytes: Buffer, contentType: string) {
  await publicMediaFile(name).save(bytes, { resumable: false, contentType });
  return `/api/wordora/assets/${name}`;
}
export async function generateLearningAudio(text: string, language: string): Promise<Buffer> {
  const response = await openai.chat.completions.create({
    model: "gpt-audio-mini",
    modalities: ["text", "audio"],
    audio: { voice: "alloy", format: "wav" },
    max_completion_tokens: 8192,
    messages: [
      { role: "system", content: `You are a native ${languageNames[language]} language pronunciation teacher. Read ONLY the supplied text exactly, slowly and clearly with natural pauses. Do not add introductions, translations, or extra words.` },
      { role: "user", content: text },
    ],
  }, { timeout: 90000 });
  const audio = response.choices[0]?.message?.audio?.data;
  if (!audio) throw new Error("The audio provider returned no audio");
  return Buffer.from(audio, "base64");
}
const pending = new Map<string, Promise<string>>();
export async function pronunciationUrl(text: string, language: string) {
  const key = createHash("sha256").update(`v1:${language}:${text}`).digest("hex");
  const name = `pronunciation-${key}.wav`;
  if ((await publicMediaFile(name).exists())[0]) return `/api/wordora/assets/${name}`;
  const existing = pending.get(key);
  if (existing) return existing;
  if (pending.size >= 4) throw new Error("Audio generation is busy");
  const job = generateLearningAudio(text, language).then(bytes => saveMedia(name, bytes, "audio/wav"));
  pending.set(key, job);
  try { return await job; } finally { pending.delete(key); }
}
