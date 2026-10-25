---
name: Wordora curriculum generation quality
description: Avoid costly full regeneration and duplicate learning items across overlapping topics.
---

Validate vocabulary uniqueness across an entire language/level, not just inside each topic, and repair only offending rows rather than repeatedly regenerating a whole valid level.

**Why:** School and occupation topics repeatedly generated the same German nouns despite explicit uniqueness prompts. Full-level retries wasted work and still produced different duplicates.

**How to apply:** Normalize case, accents and punctuation for distinctness checks, preserve stable IDs and valid material, and target replacements at the duplicate entries. B1 sentence cards need pronunciation and Arabic meaning for the complete sentence, not a single connective copied from its example.

Treat automatic linguistic audit results as proposals, not authoritative corrections. Preserve legitimate senses and inspect the target sentence before applying a change.

**Why:** An audit incorrectly treated French “Je suis un plan” as “I am a plan,” missing the correct present-tense sense “I follow a plan”; another proposed an incorrect Arabic fix. Large pronunciation batches can also return isolated non-Arabic items: repair only those indices instead of regenerating the entire level.

**How to apply:** Review proposed replacements, keep the original IDs, and validate Arabic script per pronunciation entry. Locale-aware lowercasing must precede accent removal for Turkish dotted/dotless I.

Keep pronunciation generation batches small and persist the text packet before
requesting phonetics.

**Why:** A full 200-sentence pronunciation request repeatedly produced invalid
entries and caused otherwise valid Turkish B1 text to be discarded.

**How to apply:** Generate phonetics in bounded groups, repair missing indices,
and reuse saved source text rather than regenerating the entire level.
