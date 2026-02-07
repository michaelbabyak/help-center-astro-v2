# Help Center QA Fixes — Spec

## Overview
QA feedback from Michael on the Help Center Astro site. 7 issues to fix across venue pages, directory, and content.

**Repo:** `/root/clawd/repos/help-center-astro-v2`
**Live site:** https://poppy-help-center-astro.vercel.app
**Framework:** Astro + Tailwind CSS + MDX content collections

---

## Issue 1: Sources Need Hyperlinks (SEO)

**Problem:** External references (venue websites, authority sites) in venue content are plain text, not linked.

**Fix:**
- In all venue `.mdx` files, add actual hyperlinks to external references (venue website, Google Maps, etc.)
- Add a "Sources & Links" section at the bottom of each venue page with:
  - Official venue website
  - Google Maps link
  - Any other relevant high-authority external links
- In `[...slug].astro`, add a styled "Useful Links" or "Resources" section that renders source links from frontmatter
- Add to venue schema in `content.config.ts`:
  ```
  sources: z.array(z.object({
    label: z.string(),
    url: z.string().url(),
  })).default([]),
  website: z.string().url().optional(),
  ```
- Render these links in the venue detail page template

---

## Issue 2: Venue Detail Cards Incomplete

**Problem:** Only "venue type" tag shows at the top of venue pages. The original template had multiple info cards with emoji indicators (capacity, setting, style, etc.).

**Fix:**
- Expand the Quick Info section in `src/pages/venues/[...slug].astro` to show ALL available data as cards:
  - 🏛️ **Venue Type** (already showing)
  - 👥 **Capacity** (already exists but in separate section — move to cards)
  - 📍 **Location** (already in header — also show as card)
  - 🌸 **Recommended Flowers** (already exists but in separate section — consolidate)
  - 🌿 **Setting** — Add to schema: `setting` (e.g., "Indoor/Outdoor", "Indoor", "Outdoor", "Covered Outdoor")
  - 💍 **Style** — Add to schema: `style` (e.g., "Rustic Elegant", "Modern Luxury", "Garden Romantic")
  - 🗓️ **Best Seasons** — Add to schema: `bestSeasons` array
- Each card should be a compact pill/badge or small info card with emoji + label + value
- Show them in a horizontal flex-wrap row at the top of the venue page, below the header
- Update the barn-at-edgewood.mdx with these new fields

---

## Issue 3: FAQ Should Be Accordion/Collapsible

**Problem:** FAQ sections render as plain H2 + body text. Should be expandable/collapsible toggles.

**Fix:**
- Create a new `AccordionFAQ.astro` component (or a client-side React/Preact component if needed for toggle state)
- Style: question as clickable row with +/- or chevron toggle icon, answer slides open/closed
- Use `<details>/<summary>` for zero-JS accordion, or a lightweight Preact component for smooth animation
- Apply this to any page that has FAQ content
- If venue MDX files have FAQ-like sections (H2 questions), consider adding `faqItems` to venue schema similar to articles:
  ```
  faqItems: z.array(z.object({
    question: z.string(),
    answer: z.string(),
  })).optional(),
  ```
- Render FAQ items using the accordion component in the venue template

---

## Issue 4: Hero Section Text Is Broken

**Problem:** The first section header text literally says "Hero Section" and the actual heading ("Wedding Flowers at [Venue]") appears as body text above it. Content placement is inverted.

**Fix:**
- This is likely in the MDX content being rendered by `<Content />` — the MDX body starts with something like "## About The Barn at Edgewood" which should be the first visible section AFTER the hero
- Check if the hero is supposed to come from frontmatter (name + description) — it already does in the template header
- The MDX content likely has markdown that renders "Hero Section" as an H2. Remove or restructure the MDX so:
  - The page template renders the hero from frontmatter (name, description) — ✅ already does this
  - The MDX `<Content />` starts cleanly with the first real content section
  - NO heading in the MDX should say "Hero Section"
- Audit ALL venue MDX files for this pattern and fix them

---

## Issue 5: Directory Filter Consolidation

**Problem:** The /venues directory page filter contains every specific venue type tag and there's too much overlap. Too granular for filtering.

**Note:** Currently there's no directory page with filters — the venues are only linked from the homepage. We need to BUILD the /venues/ directory page properly.

**Fix:**
- The current `venueType` enum in the schema is: `barn, garden, ballroom, beach, vineyard, estate, rooftop, other`
- This is actually already a reasonable consolidated list (8 types)
- Build a proper `/venues/index.astro` directory page with:
  - Grid of venue preview cards
  - Filter bar at top with the 8 venue type categories as clickable pills/buttons
  - Client-side filtering (show/hide cards based on selected type)
  - Each venue card shows: image (placeholder for now), name, location, venue type tag, brief description
- Keep specific/granular tags on the individual venue cards (like "rustic barn" vs just "barn") but the FILTER only uses the consolidated enum values

---

## Issue 6: Venue Type Capitalization Inconsistent

**Problem:** Venue type tags mix title case and lowercase.

**Fix:**
- Add a CSS `capitalize` class or a utility function that title-cases venue type display
- Already has `capitalize` class on the tag in `[...slug].astro` — verify it works
- Also apply to the directory page filter pills and venue cards
- If venue types in the MDX frontmatter are lowercase (e.g., "barn"), the display should show "Barn"
- Create a `formatVenueType` helper: `(type: string) => type.split(/[-_\s]/).map(w => w[0].toUpperCase() + w.slice(1)).join(' ')`
- Use this helper everywhere venue types are displayed

---

## Issue 7: Google Images — AI-Curated (SEPARATE TASK — DO NOT IMPLEMENT)

**Note:** This will be handled separately by Botster using the Google Places API + vision model analysis. The agent team should:
- Add an `heroImage` field to the venue schema: `heroImage: z.string().optional()`
- Add an `images` array field: `images: z.array(z.string()).default([])`
- Render the heroImage if present in the venue detail page header and in directory cards
- Use a placeholder/gradient when no image is set
- **DO NOT** try to fetch or generate images — just build the rendering infrastructure

---

## Architecture Notes

### File Structure
```
src/
  content.config.ts          # Schema definitions — MODIFY
  content/
    venues/
      the-barn-at-edgewood.mdx  # Only venue currently — UPDATE
  components/
    AccordionFAQ.astro       # NEW — collapsible FAQ component
    VenueCard.astro          # NEW — card for directory grid
    VenueFilters.astro       # NEW — filter pills for directory (needs client JS)
  pages/
    venues/
      [...slug].astro        # Venue detail — MODIFY
      index.astro            # NEW — venue directory page
  lib/
    format.ts                # NEW — formatVenueType and other display helpers
```

### Content Schema Changes (content.config.ts)
Add to venues schema:
```typescript
setting: z.string().optional(),           // "Indoor/Outdoor", "Indoor", etc.
style: z.string().optional(),             // "Rustic Elegant", "Modern Luxury", etc.
bestSeasons: z.array(z.enum(['spring', 'summer', 'fall', 'winter'])).default([]),
heroImage: z.string().optional(),         // URL for hero/card image
images: z.array(z.string()).default([]),  // Additional image URLs
website: z.string().url().optional(),     // Official venue website
sources: z.array(z.object({
  label: z.string(),
  url: z.string().url(),
})).default([]),
faqItems: z.array(z.object({
  question: z.string(),
  answer: z.string(),
})).optional(),
```

### Build Verification
```bash
cd /root/clawd/repos/help-center-astro-v2
npm run build
```
Build must complete with zero errors. Check `dist/` output for generated pages.

---

## Constraints
- Keep existing Tailwind brand colors (brand-green, brand-sage, brand-cream, brand-blush, brand-gold, brand-charcoal)
- Keep existing font stack (Playfair Display + Inter)
- Keep existing design language (rounded cards, subtle shadows, clean whitespace)
- Use `<details>/<summary>` for accordion to minimize JS — OR lightweight Preact if animation is needed
- All venue type display must go through the `formatVenueType` helper for consistent casing
- Do NOT modify articles, categories, playbooks, or flowers content/pages
- Do NOT add new npm dependencies unless absolutely necessary (prefer native HTML/CSS/Astro)
