---
name: Wordora presentation decisions
description: Brand, motion, cartoon exclusions and approved copy constraints for the Wordora deck.
---

The opening must prominently show a faithful, clean vector Wordora logo together with transparent Replit and Nordpoints logos. Coordinated shapes and cartoon language companions are requested, but characters must not appear on slides 1, 7, 10 or 12. Slide 10 must remain static. The first slide and closing slide must be animated.

**Why:** The user requested clean logos, coordinated shapes and language characters, then specified exclusions. Their latest instruction restores animation to the first and closing slides and removes cartoon characters from the closing slide. It does not change the earlier static-slide-10 rule or character exclusions on slides 1, 7 and 10.

**How to apply:** Use actual SVG paths and gradients, not a bitmap wrapped inside an SVG or an enlarged phone screenshot. Visually compare regenerated vectors with the supplied artwork before adopting them: an SVG extension alone does not prove fidelity. Preserve transparent backgrounds and the logo's defining shapes and wording. Keep names on the closing slide unless asked otherwise. Keep slide 10 free of animation, including animation embedded inside SVG assets. Use static fallbacks for allslides/PDF and reduced-motion preferences.

When polishing presentation copy, preserve user-approved curriculum counts, the GPT Ieon spelling, names, and the exact closing wording unless the user specifically changes them.

**Why:** These details were explicitly supplied or approved by the user; a general request for better text is not permission to change facts or replace the chosen ending.

**How to apply:** Improve clarity, concision and consistency of Arabic while keeping feature claims accurate. In particular, retain the distinction between signed-in cloud saving and temporary browser-local guest saving, and the AI assistant's possible errors.

For local logo vectorization through QuiverAI, pass the raw image payload as `image: { base64: ... }`, without a data-URI prefix.

**Why:** The URL field accepts network HTTP/HTTPS images only. Data URIs and externally inaccessible development URLs returned opaque HTTP 400 errors; raw base64 avoids those fetch restrictions.

**How to apply:** Check the live schema at `https://api.quiver.ai/v1/openapi.json` when the connector's short reference does not cover a local-image input. Inspect the rendered vector against the original before replacing the presentation asset.
