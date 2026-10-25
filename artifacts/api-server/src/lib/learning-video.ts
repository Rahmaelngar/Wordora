import { createHash } from "node:crypto";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { languageNames, pronunciationUrl, publicMediaFile, saveMedia } from "./learning-ai";

declare const __WORDORA_VIDEO_CATALOG__: {
  languageId: string; level: string; word: { id: string; term: string; example: string };
}[];
const exec = promisify(execFile);
const pending = new Map<string, Promise<{ url: string; mp4Url: string }>>();
const vocabulary = new Map(__WORDORA_VIDEO_CATALOG__.map(item => [item.word.id, { lesson: item, word: item.word }]));
export const hasVideoWord = (id: string) => vocabulary.has(id);
function wrap(text: string, width: number) {
  const lines: string[] = []; let line = "";
  for (const word of text.split(/\s+/)) {
    if (line && line.length + word.length + 1 > width) { lines.push(line); line = ""; }
    line += `${line ? " " : ""}${word}`;
  }
  if (line) lines.push(line);
  return lines.join("\n");
}

export async function learningVideo(wordId: string) {
  const item = vocabulary.get(wordId);
  if (!item) throw new Error("Unknown learning word");
  const { lesson, word } = item;
  const hash = createHash("sha256").update(`v1:${lesson.languageId}:${word.term}:${word.example}`).digest("hex").slice(0, 32);
  const base = `word-video-${hash}`;
  const result = { url: `/api/wordora/assets/${base}.webm`, mp4Url: `/api/wordora/assets/${base}.mp4` };
  const existing = pending.get(hash);
  if (existing) return existing;
  if ((await publicMediaFile(`${base}.webm`).exists())[0] && (await publicMediaFile(`${base}.mp4`).exists())[0]) return result;
  const startedWhileCheckingStorage = pending.get(hash);
  if (startedWhileCheckingStorage) return startedWhileCheckingStorage;
  if (pending.size >= 2) throw new Error("VIDEO_BUSY");
  const task = (async () => {
    const directory = await mkdtemp(join(tmpdir(), "wordora-video-"));
    try {
      const narrated = word.term === word.example ? word.term : `${word.term}.\n${word.example}`;
      const audioUrl = await pronunciationUrl(narrated, lesson.languageId);
      const audioPath = join(directory, "audio.wav");
      await publicMediaFile(audioUrl.split("/").at(-1)!).download({ destination: audioPath });
      const { stdout } = await exec("fc-match", ["-f", "%{file}", "DejaVu Sans"], { timeout: 10000 });
      const font = stdout.trim();
      if (!font || !font.startsWith("/")) throw new Error("Video font unavailable");
      const size = word.term.length > 75 ? 28 : 44;
      await writeFile(join(directory, "word.txt"), wrap(word.term, Math.floor(820 / size * 1.65)));
      await writeFile(join(directory, "example.txt"), word.term === word.example ? "" : wrap(word.example, 65));
      const filter = [
        "drawbox=x=32:y=32:w=896:h=476:color=0x36256e:t=fill",
        `drawtext=fontfile='${font}':text='WORDORA   /   ${languageNames[lesson.languageId]} ${lesson.level}':fontcolor=0xcbbcff:fontsize=22:x=64:y=65`,
        `drawtext=fontfile='${font}':textfile='${join(directory, "word.txt")}':expansion=none:fontcolor=white:fontsize=${size}:line_spacing=10:x=64:y=132`,
        `drawtext=fontfile='${font}':textfile='${join(directory, "example.txt")}':expansion=none:fontcolor=0xbdebd9:fontsize=23:line_spacing=8:x=64:y=335`,
        `drawtext=fontfile='${font}':text='Listen. Repeat. Try it yourself.':fontcolor=0xf3d48a:fontsize=18:x=64:y=465`,
        "fade=t=in:st=0:d=0.3",
      ].join(",");
      const mp4 = join(directory, "lesson.mp4"), webm = join(directory, "lesson.webm");
      await exec("ffmpeg", ["-y", "-loglevel", "error", "-f", "lavfi", "-i", "color=c=0x20143b:s=960x540:r=15", "-i", audioPath,
        "-vf", filter, "-c:v", "libx264", "-preset", "ultrafast", "-crf", "28", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "96k",
        "-shortest", "-t", "90", "-movflags", "+faststart", mp4], { timeout: 90000, maxBuffer: 1024 * 1024 });
      await exec("ffmpeg", ["-y", "-loglevel", "error", "-i", mp4, "-c:v", "libvpx-vp9", "-cpu-used", "8", "-crf", "40", "-b:v", "0",
        "-c:a", "libopus", "-b:a", "64k", webm], { timeout: 90000, maxBuffer: 1024 * 1024 });
      await Promise.all([
        saveMedia(`${base}.mp4`, await readFile(mp4), "video/mp4"),
        saveMedia(`${base}.webm`, await readFile(webm), "video/webm"),
      ]);
      return result;
    } finally { await rm(directory, { recursive: true, force: true }); }
  })();
  pending.set(hash, task);
  try { return await task; } finally { pending.delete(hash); }
}
