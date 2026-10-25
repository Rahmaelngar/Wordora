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
- `src/extra-vocabulary.ts`: append-only additions, keeping existing word IDs stable.
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

## Single-word study and resuming

Each lesson shows one word at a time. Next/Previous replace the card; finishing
the words opens a vocabulary/example summary before the existing quiz.
Reviewing, navigation, audio and video do not award points or complete a lesson.
The next-lesson action respects the same level locks as the lesson list.

The optional `lessonStudy` progress map stores a checkpoint per lesson:
current index, studied word IDs, words/summary stage, and an ISO update time.
It uses the existing local progress store for guests and account-scoped local
storage plus the existing PostgreSQL JSON progress API for signed-in learners.
No database schema migration is needed. Missing checkpoints remain compatible
with older progress. Interrupted quizzes return to the words summary.

Cloud/local checkpoints merge per lesson using their latest update time.
Cloud writes are serialized/coalesced so rapid navigation cannot finish with an
older request overwriting a newer checkpoint. Account query caches are scoped
by identity. If storage or cloud sync fails, show the learner the actual status.

`features/learning/study.ts` defines level locks and study helpers;
`study-persistence.ts` normalizes and merges checkpoints; `lesson-video.tsx`
provides the matched greetings-group video. `word-video.tsx` provides an actual
content-matched narrated clip for every entry, generated on first request.
`intro.tsx` shows the original logo briefly at each app load, with a skip button,
without replaying the introduction on in-app navigation.

The curriculum has 210 short lessons and 2250 learning entries across five languages:
100 A1, 150 A2 and 200 B1 entries per language. The original 55 lessons/IDs remain
intact. `src/curriculum/*.json` contains the additions; B1 additions use complete
sentences with matching full-sentence Arabic meanings and approximate pronunciation.
When a four-word summary checkpoint is loaded after this expansion, the learner
resumes at the first new word; saved words, points and completed-lesson IDs stay
unchanged. Completion rewards are not granted again for previously completed lessons.

`features/learning/daily.ts` records distinct correct answers, completed quizzes
and correctly reviewed words by local calendar day. Activity is language-specific,
saved in the existing cloud JSON progress, and available locally for guests.
Estimated daily plans (5/10/15/20 minutes) are not measured usage time.
Opening a lesson, navigating words, replaying a quiz or watching media never
earns additional completion points. Review requires actual correct answers.
`daily-plan.tsx`, `review-challenge.tsx` and `celebration.tsx` implement the plan,
three-word review, weekly activity and encouragement based on actual results.

After activating example audio, its written sentence and Arabic translation stay
visible beside the control. The existing word card already supplies the word and
meaning beside compact pronunciation buttons. The opened greeting video/WAV also
offers a show/hide transcript. This is readable text, not time-synchronized subtitles.
The frozen recording text is `features/learning/greeting-transcript.ts`: it covers
only the four phrases actually spoken by those existing recordings, not the two
appended words. Media generation uses this same snapshot so a cached older WAV
cannot silently be paired with a longer displayed transcript.

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

## Expanded curriculum and per-entry video

`POST /api/wordora/video` accepts a known `wordId`, generates a narrated text clip
using that exact word/example in its language, and returns WebM/MP4 asset URLs.
It caches by content hash, limits simultaneous rendering and cleans up temporary
files. These are AI-narrated teaching cards, not real humans or lip-motion footage.
The first-use cost/time notice is visible before generation. System dependencies
`ffmpeg`, `fontconfig`, and `dejavu_fonts` are configured for runtime rendering.
The API build derives its minimal video catalog from the same curriculum source;
rebuild/restart the API as well as the frontend after changing learning content.

Run curriculum/progress regression checks without AI charges:

```sh
pnpm --filter @workspace/scripts exec tsx ./check-wordora.ts
```

`artifacts/api-server/scripts/expand-curriculum.ts` is an optional resumable,
billed AI content-authoring script, not needed to start the app. Do not rerun
generation to merely launch or test the application.
