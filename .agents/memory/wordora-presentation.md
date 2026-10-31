---
name: Wordora presentation opening
description: User-confirmed scope for the first slide of the Wordora presentation.
---

The opening must prominently show a faithful, clean vector Wordora logo together with transparent Replit and Nordpoints logos. Coordinated shapes and cartoon language companions are requested, but characters must not appear on slides 1, 7 or 10. Slides 1, 10 and 12 must be completely static; keep animations on the remaining slides.

**Why:** The user reinstated Replit and Nordpoints on the first slide, requested many shapes and cartoon language characters, and repeatedly rejected pixelated logos. They later explicitly removed animation from the first slide, slide 10 and the closing slide, then removed cartoon characters from slides 1, 7 and 10. These specific exclusions supersede the earlier general animation/character requests.

**How to apply:** Use actual SVG paths and gradients, not a bitmap wrapped inside an SVG or an enlarged phone screenshot. Visually compare regenerated vectors with the supplied artwork before adopting them: an SVG extension alone does not prove fidelity. Preserve transparent backgrounds and the logo's defining shapes and wording. Keep names on the closing slide unless asked otherwise. Use static character/logo assets on slides 1, 10 and 12; removing CSS movement alone does not stop animation inside an SVG image.

For local logo vectorization through QuiverAI, pass the raw image payload as `image: { base64: ... }`, without a data-URI prefix.

**Why:** The URL field accepts network HTTP/HTTPS images only. Data URIs and externally inaccessible development URLs returned opaque HTTP 400 errors; raw base64 avoids those fetch restrictions.

**How to apply:** Check the live schema at `https://api.quiver.ai/v1/openapi.json` when the connector's short reference does not cover a local-image input. Inspect the rendered vector against the original before replacing the presentation asset.
