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
