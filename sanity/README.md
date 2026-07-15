# Hora blog on Sanity

Project: `tbqxupiq` (`hora Calendar`)
Dataset: `production`
Embedded Studio: `/studio/`

Sanity is the source of truth for blog posts, categories, tags, authors, settings, and blog media. The files in `content/posts/` remain in Git as rollback material and as the deterministic input for the migration audit.

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

Never expose either token with a `NEXT_PUBLIC_` prefix. A write token is not required by the website and must not be added to Vercel.

## Commands

```bash
pnpm sanity:schema
pnpm sanity schemas deploy --workspace default
pnpm sanity:migrate:blog
pnpm sanity:migrate:blog:write
pnpm sanity:verify:blog
```

The migration is dry-run by default. The write command uploads assets and uses deterministic root document IDs without dots, such as `blog-post-{slug}`. Sanity treats IDs containing dots as private sub-path documents, even in a public dataset. Verification therefore rejects dots in public blog document IDs and references, compares all migrated metadata with MDX, and checks block counts plus every document and asset reference.

The write migration is intentionally write-once. It refuses to replace existing managed documents, protecting later Studio edits. `--force-overwrite` exists only for an intentional restore from the MDX rollback snapshot.

Migration writes authenticate with the user session provided by `sanity exec --with-user-token`. The website never needs a write token.

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

The endpoint validates Sanity's signature, invalidates the shared blog queries and the affected post query, then refreshes RSS and the sitemap. The existing ten-minute revalidation remains a fallback.
