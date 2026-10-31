---
name: Learning video compatibility
description: Why Wordora needs multiple video formats and real playback verification.
---

Provide a WebM (VP9/Opus) option alongside MP4 (H.264/AAC) for learning videos. Treat actual playback advancing in a browser as the acceptance check, not merely a valid video file or successful HTTP/range response.

**Why:** The preview/testing Chromium reported no H.264 support and rejected valid MP4 files with media error 4 despite successful range requests. WebM played correctly in the same browser.

**How to apply:** Preserve both source formats when expanding the multimedia curriculum, and check playback and seeking in supported browsers rather than assuming HTTP delivery implies decoding support.

Tiny byte-range probes can also miss transport warnings that appear during full-sized asset streams.

**Why:** Full downloads reproduced listener-limit warnings in the storage transport's stream pipeline while repeated 100-byte reads did not.

**How to apply:** Diagnose streaming warnings with full-sized reads and warning traces. Do not treat a passing tiny range request as proof of a lifecycle fix, or suppress listener limits globally without finding the cause.

Media transcripts must match the published recording, not automatically include all current vocabulary.

**Why:** A lesson can gain new words while its existing video/WAV continues to narrate only the older phrases. Using the live word list as a transcript would falsely claim those additions are spoken.

**How to apply:** Update narration and its transcript together, invalidate old generation caches when changing the recording, and do not imply timestamp synchronization without real alignment data.

Per-word videos are real narrated instructional text clips, created on first request and reused by content hash. They are not human demonstrations or lip-motion videos.

**Why:** The expanded multilingual curriculum is too large to pre-generate every video responsibly; on-demand creation avoids unnecessary AI charges while supporting every learning entry.

**How to apply:** Keep the first-use cost/loading disclosure and honest media label, preserve native-language audio plus matching written translations, and invalidate cached media when its spoken content changes.

Verify downloaded brand assets by actual decoded format, not HTTP status or filename.

**Why:** A logo-search image URL returned a full HTML page with HTTP 200 and a `.jpeg` suffix. Embedding it would leave a broken logo despite a successful download.

**How to apply:** Inspect the downloaded file before embedding it. Source a real image if it is HTML; then check logo contrast against the chosen slide background.
