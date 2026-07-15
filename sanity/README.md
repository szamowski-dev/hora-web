# Hora content on Sanity

Project: `tbqxupiq` (`hora Calendar`)
Dataset: `production`
Embedded Studio: `/studio/`

Sanity is the only source of truth for the homepage, features, about and legal pages, plus blog posts, categories, tags, authors, settings, and media. The repository contains the presentation layer, schemas, and a standalone MDX Zoom guide, but no duplicate Sanity content.

## Local environment

Published content is readable from the public dataset without a token. Draft preview requires a Viewer token stored only on the server:

```dotenv
NEXT_PUBLIC_SANITY_PROJECT_ID=tbqxupiq
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_STUDIO_URL=/studio
SANITY_API_READ_TOKEN=
SANITY_REVALIDATE_SECRET=
```

Never expose either server-only value with a `NEXT_PUBLIC_` prefix. A write token is not required by the website and must not be added to Vercel.

## Commands

```bash
pnpm sanity:schema
pnpm sanity schemas deploy --workspace default
pnpm sanity:verify:blog
pnpm sanity:verify:site
```

The verifiers check the published dataset independently of any local content snapshot. The blog verifier validates required post fields, slugs, reading time, categories, the featured post, public document IDs, and every document and asset reference. The site verifier validates the singleton pages and their required content. They are safe to run after publishing content changes.

## Legacy blog media

Historical `/assets/blog/*` URLs are preserved as permanent redirects to their archived copies on the Sanity CDN. The complete static mapping lives in `lib/legacy-blog-asset-redirects.ts`. Keep those archived Sanity assets even when they are no longer referenced by a post, because external sites may still link to the old public paths.

## Draft preview

The Presentation Tool opens a same-origin site preview and enables Next.js Draft Mode through `/api/draft-mode/enable`. Draft requests use the `drafts` perspective, bypass the CDN, and enable click-to-edit source maps. Published requests continue to use the CDN with a ten-minute cache fallback.

Allowed CORS origins with credentials:

- `https://horacal.app`
- `http://localhost:3000`
- `http://127.0.0.1:3000`
- `http://localhost:3001`
- `http://127.0.0.1:3001`

## Publish revalidation

Create a Sanity webhook for document create, update, and delete events and point it to:

```text
https://horacal.app/api/revalidate-sanity
```

Use the same value for the webhook secret and `SANITY_REVALIDATE_SECRET`. The projection should be:

```groq
{_id, _type, kind, "slug": slug.current}
```

Use the filter below and leave draft triggers disabled:

```groq
_type in [
  "homePage",
  "featuresPage",
  "aboutPage",
  "legalPage",
  "blogPost",
  "blogCategory",
  "blogTag",
  "author",
  "blogSettings"
]
```

The endpoint validates Sanity's signature, skips draft and version documents, invalidates the affected site or blog queries, then refreshes the relevant routes, RSS, and sitemap. The existing ten-minute revalidation remains a fallback.
