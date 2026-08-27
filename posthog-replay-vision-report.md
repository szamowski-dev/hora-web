# PostHog Replay Vision — Run Report

## Session Recording

Session replay was already enabled for this project. The server-side toggle is on, and there is no `disable_session_recording` flag in the client initialization. Recordings are flowing now — no action required.

## Scanners Created

### 1. Pricing page and download failures
- **Type:** Breakage monitor
- **What it watches:** Sessions where the URL contains `/pricing` — visitors reviewing subscription plans and the download CTA
- **What it flags:** Plan cards with missing prices or features, download button doing nothing or routing to an error, the direct download redirect returning "temporarily unavailable", broken page layout, app store badge links failing, FAQ section not rendering
- **Query scope:** Filtered to `/pricing` sessions, 50% sampling rate
- **Estimated monthly cost:** ~0 credits currently (early-stage traffic); cost scales with traffic
- **Scanner ID:** `01a043bd-92bb-7e93-8817-ba4d729ec4e9`

> Note: hora Calendar's subscription purchase happens inside the native macOS app after download — there is no browser-side checkout flow. The pricing page is the highest-value in-browser step and is what this scanner watches.

---

### 2. hora site rage clicks
- **Type:** Frustration monitor
- **What it watches:** Sessions containing at least one rage click (`$rageclick` event) anywhere on the site
- **What it flags:** Repeated rapid clicks indicating user frustration — stuck UI, unresponsive buttons, silent form validation errors, confusing navigation
- **Query scope:** Site-wide, 100% sampling of rage-click sessions
- **Estimated monthly cost:** ~0 credits currently; scales with rage-click events recorded
- **Scanner ID:** `01a043bd-b2cc-78de-a6ea-f2e2c95ee82f`

---

### 3. hora website session summaries
- **Type:** Session summarizer
- **What it watches:** A random 10% sample of all sessions across the entire site
- **What it produces:** Plain-language summaries of each session — what the visitor did, where they went, and whether they found what they were looking for
- **Query scope:** Unscoped (all sessions), 10% sampling rate
- **Estimated monthly cost:** ~15 credits/month
- **Scanner ID:** `01a043bd-2f25-7f21-953e-c1cfcc212fee`

---

## Nothing Skipped

All three scanner types ran successfully. No steps were deferred.

## Where to See Results

Open **[Replay Vision](https://us.posthog.com/project/562222/replay/vision)** in PostHog. Scanners begin producing observations as new recordings complete — the first results appear within hours of real user traffic hitting the site.

Your current quota is 7,500 credits/month. Combined estimated spend is ~15 credits/month at current traffic levels, leaving substantial headroom.
