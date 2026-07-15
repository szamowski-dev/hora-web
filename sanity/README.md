# Hora blog on Sanity

Project: `tbqxupiq` (`hora Calendar`)
Dataset: `production`
Embedded Studio: `/studio/`

Sanity is the only source of truth for blog posts, categories, tags, authors, settings, and blog media. The repository contains the presentation layer and schema, but no duplicate article content.

## Local environment

Published content is readable from the public dataset without a token. Draft preview requires a Viewer token stored only on the server:

```dotenv
NEXT_PUBLIC_SANITY_PROJECT_ID=tbqxupiq
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_STUDIO_URL=/studio
NEXT_PUBLIC_SITE_URL=http://localhost:3000
SANITY_API_READ_TOKEN=
SANITY_REVALIDATE_SECRET=
```

Never expose either server-only value with a `NEXT_PUBLIC_` prefix. A write token is not required by the website and must not be added to Vercel.

## Commands

```bash
pnpm sanity:schema
pnpm sanity schemas deploy --workspace default
pnpm sanity:verify:blog
```

The verifier checks the published dataset independently of any local content snapshot. It validates required post fields, slugs, reading time, categories, the featured post, public document IDs, and every document and asset reference. It is safe to run after adding future posts.

## Legacy blog media

Historical `/assets/blog/*` URLs are preserved as permanent redirects to their archived copies on the Sanity CDN. The complete static mapping lives in `lib/legacy-blog-asset-redirects.ts`. Keep those archived Sanity assets even when they are no longer referenced by a post, because external sites may still link to the old public paths.

## Draft preview

The Presentation Tool opens the same-origin blog preview and enables Next.js Draft Mode through `/api/draft-mode/enable`. Draft requests use the `drafts` perspective, bypass the CDN, and enable click-to-edit source maps. Published requests continue to use the CDN with a ten-minute cache fallback.

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
{_id, _type, "slug": slug.current}
```

Use the filter below and leave draft triggers disabled:

```groq
_type in ["blogPost", "blogCategory", "blogTag", "author", "blogSettings"]
```

The endpoint validates Sanity's signature, invalidates the shared blog queries and the affected post query, then refreshes RSS and the sitemap. The existing ten-minute revalidation remains a fallback.
