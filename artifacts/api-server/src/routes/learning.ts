import { Router, type IRouter } from "express";
import { openai } from "@workspace/integrations-openai-ai-server";
import { SendWordoraChatBody, CreateWordoraAudioBody } from "@workspace/api-zod";
import { languageNames, pronunciationUrl, publicMediaFile } from "../lib/learning-ai";

const router: IRouter = Router();
const windows = new Map<string, { count: number; expires: number }>();
let activeChats = 0;
router.use("/wordora", (req, res, next) => {
  if (req.method !== "POST") return next();
  const now = Date.now();
  for (const [key, value] of windows) if (value.expires < now) windows.delete(key);
  const key = `${req.ip}:${req.path}`;
  const entry = windows.get(key) ?? { count: 0, expires: now + 60000 };
  if (++entry.count > 15) {
    res.setHeader("Retry-After", "60");
    res.status(429).json({ error: "طلبات كثيرة. انتظر دقيقة ثم حاول مجدداً." });
    return;
  }
  windows.set(key, entry);
  next();
});
router.post("/wordora/chat", async (req, res) => {
  const input = SendWordoraChatBody.safeParse(req.body);
  if (!input.success || input.data.messages.at(-1)?.role !== "user") {
    res.status(400).json({ error: "أرسل رسالة صالحة واختر لغة التعلّم." }); return;
  }
  if (activeChats >= 4) { res.status(429).json({ error: "المساعد مشغول، حاول بعد قليل." }); return; }
  activeChats++;
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-5.4-mini",
      max_completion_tokens: 8192,
      messages: [
        { role: "system", content: `You are GPT Ieon, Wordora's friendly language tutor for Arabic-speaking beginners. The selected language is ${languageNames[input.data.language]}. Explain in clear Arabic, demonstrate phrases in the selected language with Arabic translation and approximate pronunciation when helpful. Keep replies concise (usually under 150 words), ask one simple practice question at a time, kindly correct errors, never claim to award points or save progress. Do not claim to assess spoken pronunciation from text. Stay focused on safe language learning; politely redirect unrelated requests. The name GPT Ieon is the app assistant's display name, not a claim about a model.` },
        ...input.data.messages,
      ],
    }, { timeout: 60000 });
    const reply = response.choices[0]?.message?.content?.trim();
    if (!reply) throw new Error("Empty tutor response");
    res.json({ reply });
  } catch (error) {
    req.log.error({ error: error instanceof Error ? error.message : "unknown" }, "Tutor request failed");
    res.status(502).json({ error: "تعذّر الاتصال بالمساعد الآن. حاول مرة أخرى." });
  } finally { activeChats--; }
});
router.post("/wordora/audio", async (req, res) => {
  const input = CreateWordoraAudioBody.safeParse(req.body);
  if (!input.success) { res.status(400).json({ error: "النص أو اللغة غير صالحين." }); return; }
  try {
    res.json({ url: await pronunciationUrl(input.data.text, input.data.language) });
  } catch (error) {
    req.log.error({ error: error instanceof Error ? error.message : "unknown" }, "Audio request failed");
    res.status(502).json({ error: "تعذّر تجهيز الصوت. حاول بعد قليل." });
  }
});
router.get("/wordora/assets/:file", async (req, res) => {
  if (!/^[a-zA-Z0-9_-]+\.(wav|mp4|webm|jpg|png)$/.test(req.params.file)) {
    res.status(404).end(); return;
  }
  try {
    const file = publicMediaFile(req.params.file);
    const [exists] = await file.exists();
    if (!exists) { res.status(404).end(); return; }
    const [metadata] = await file.getMetadata();
    const size = Number(metadata.size);
    res.set({ "Content-Type": metadata.contentType || "application/octet-stream", "Accept-Ranges": "bytes", "Cache-Control": "public, max-age=86400", "X-Content-Type-Options": "nosniff" });
    let start = 0, end = size - 1;
    if (req.headers.range) {
      const match = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range);
      if (!match || (!match[1] && !match[2])) { res.status(416).set("Content-Range", `bytes */${size}`).end(); return; }
      if (!match[1]) start = Math.max(0, size - Number(match[2]));
      else { start = Number(match[1]); if (match[2]) end = Math.min(Number(match[2]), size - 1); }
      if (start > end || start >= size) { res.status(416).set("Content-Range", `bytes */${size}`).end(); return; }
      res.status(206).set("Content-Range", `bytes ${start}-${end}/${size}`);
    }
    res.set("Content-Length", String(end - start + 1));
    if (req.method === "HEAD") { res.end(); return; }
    file.createReadStream({ start, end }).on("error", () => { if (!res.headersSent) res.status(502).end(); else res.destroy(); }).pipe(res);
  } catch { if (!res.headersSent) res.status(502).end(); }
});
export default router;
