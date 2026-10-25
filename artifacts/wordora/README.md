# Wordora

Arabic-first language learning for English, French, Spanish, German, and Italian.
Use the existing managed Replit workflows for the web app and API server.

## Local development

```sh
pnpm --filter @workspace/wordora run dev
pnpm --filter @workspace/api-server run dev
pnpm run typecheck
```

Managed workflows inject the correct ports and base path. Do not launch duplicate
development servers beside them.

## Learning features

- `src/data.ts`: vocabulary, Arabic meanings, examples, approximate pronunciation.
- `src/features/learning/chat.tsx`: GPT Ieon tutor and session-only history.
- `src/features/learning/media.tsx`: narrated greeting video/audio for each language.
- `src/features/learning/audio.tsx`: generated word/example audio and playback.
- `src/features/learning/pronunciation.tsx`: browser speech-to-text practice.
- `src/index.css`: responsive visual styling.

GPT Ieon is the assistant's product name, not a model identifier. Chat uses
Replit AI Integrations for OpenAI. No user-supplied API key is needed; usage is
billed to the project owner's credits. Keep the provisioned integration settings
in workspace Secrets, never in frontend code.

Chat history is separated by account and selected language in sessionStorage.
It is not a synchronized conversation archive. Existing lesson progress storage
and points are independent of chat and media; opening a video or sending a
message does not award points.

Pronunciation practice depends on browser speech recognition and microphone
permission. It compares recognized words, not acoustic pronunciation accuracy.
The browser's recognition service may process microphone audio. Unsupported
browsers still have listening/repetition practice.

## API and durable media

Contract: `lib/api-spec/openapi.yaml`. After a contract change:

```sh
pnpm --filter @workspace/api-spec run codegen
```

API implementation: `artifacts/api-server/src/routes/learning.ts`.
Tutor and audio POST requests are validated and rate-limited. AI pronunciation
audio is cached in App Storage by language/text hash. Public assets are served
with byte-range support for native audio/video seeking. Videos offer WebM
(VP9/Opus) first and MP4 (H.264/AAC) as a fallback for browser codec compatibility.

The initial multimedia course contains five short narrated **greeting** lessons,
not video coverage of every existing vocabulary topic. Photos and narration are
AI-generated; the MP4s combine the generated photography, lesson text and narration.
Full transcripts and Arabic translations remain visible next to the video.

To regenerate media during development, first provide the two generated source
photos under `attached_assets/generated_images/` (wordora-learning.jpg and
wordora-conversation.jpg), then run:

```sh
pnpm --filter @workspace/scripts exec tsx ../artifacts/api-server/scripts/prepare-learning-media.ts
```

This calls billed AI audio, renders MP4s with FFmpeg, and uploads them to the
provisioned App Storage public directory. Existing local WAVs are reused.
Generated working files are excluded from Git and deployment; durable assets
are served from App Storage.
