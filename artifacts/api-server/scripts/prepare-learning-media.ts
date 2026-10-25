import { mkdir, readFile, writeFile, access } from "node:fs/promises";
import { resolve } from "node:path";
import { execFileSync } from "node:child_process";
import { batchProcess } from "@workspace/integrations-openai-ai-server/batch";
import { generateLearningAudio, saveMedia } from "../src/lib/learning-ai";
import { languages } from "../../wordora/src/data";
import { greetingTranscript } from "../../wordora/src/features/learning/greeting-transcript";

const workspace = resolve(import.meta.dirname, "../../..");
const output = resolve(workspace, "generated-artifacts/wordora-learning");
await mkdir(output, { recursive: true });
for (const name of ["wordora-learning", "wordora-conversation"]) {
  await saveMedia(`${name}.jpg`, await readFile(resolve(workspace, `attached_assets/generated_images/${name}.jpg`)), "image/jpeg");
  console.log(`Uploaded ${name}`);
}
const font = execFileSync("fc-match", ["-f", "%{file}", "DejaVu Sans"], { encoding: "utf8" }).trim();
await batchProcess(languages.filter(language => greetingTranscript[language.id].length > 0), async language => {
  const transcript = greetingTranscript[language.id];
  const audioPath = resolve(output, `lesson-${language.id}.wav`);
  try { await access(audioPath); } catch {
    console.log(`Generating ${language.name} narration`);
    const audio = await generateLearningAudio(transcript.map(line => `${line.term}. ${line.sentence}`).join("\n"), language.id);
    await writeFile(audioPath, audio);
  }
  await saveMedia(`lesson-${language.id}.wav`, await readFile(audioPath), "audio/wav");
  const textPath = resolve(output, `${language.id}-phrases.txt`);
  await writeFile(textPath, transcript.map(line => line.term).join("\n\n"));
  const videoPath = resolve(output, `lesson-${language.id}.mp4`);
  const filter = [
    "scale=1280:720:force_original_aspect_ratio=increase,crop=1280:720",
    "drawbox=x=0:y=0:w=800:h=720:color=0x231642@0.87:t=fill",
    `drawtext=fontfile='${font}':text='Wordora  |  ${language.name}  A1':fontcolor=0xc5b4fa:fontsize=26:x=52:y=55`,
    `drawtext=fontfile='${font}':textfile='${textPath}':fontcolor=white:fontsize=39:line_spacing=12:x=52:y=150`,
    `drawtext=fontfile='${font}':text='Listen. Repeat. Open a new world.':fontcolor=0xd8d0e8:fontsize=23:x=52:y=645`,
  ].join(",");
  execFileSync("ffmpeg", [
    "-y", "-loglevel", "error", "-loop", "1",
    "-i", resolve(workspace, "attached_assets/generated_images/wordora-conversation.jpg"),
    "-i", audioPath, "-vf", filter, "-c:v", "libx264", "-preset", "veryfast",
    "-tune", "stillimage", "-r", "24", "-pix_fmt", "yuv420p", "-c:a", "aac",
    "-b:a", "128k", "-shortest", "-movflags", "+faststart", videoPath,
  ], { timeout: 180000 });
  await saveMedia(`lesson-${language.id}.mp4`, await readFile(videoPath), "video/mp4");
  const webmPath = resolve(output, `lesson-${language.id}.webm`);
  execFileSync("ffmpeg", [
    "-y", "-loglevel", "error", "-i", videoPath, "-c:v", "libvpx-vp9",
    "-crf", "36", "-b:v", "0", "-cpu-used", "5", "-row-mt", "1",
    "-c:a", "libopus", "-b:a", "64k", webmPath,
  ], { timeout: 180000 });
  await saveMedia(`lesson-${language.id}.webm`, await readFile(webmPath), "video/webm");
  console.log(`Uploaded ${language.name} video and audio`);
  return language.id;
}, { concurrency: 2, retries: 3 });
console.log("All five language lessons are ready.");
