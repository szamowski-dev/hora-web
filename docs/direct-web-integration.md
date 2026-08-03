# Direct web integration

The website has two intentionally small responsibilities for the Direct app:

1. map a verified Google identity to a stable opaque RevenueCat App User ID;
2. resolve the current signed Direct installer from the release manifest.

RevenueCat Funnel owns checkout. The website does not load `purchases-js`,
fetch RevenueCat offerings, or keep a second product catalogue.

## Identity endpoint

`POST /api/direct/identity` accepts a Google ID token in the standard bearer
header:

```text
Authorization: Bearer <google-id-token>
```

The request has no identity body. The server verifies the JWT signature,
issuer, expiry and audience, then reads `sub` from the verified payload. A
successful response contains only the stable opaque mapping:

```json
{ "app_user_id": "usr_..." }
```

Configure these server-side variables in Vercel:

```text
GOOGLE_OAUTH_NATIVE_CLIENT_IDS=<comma-separated native OAuth client IDs>
DATABASE_URL=<Neon connection string>
```

At least one Google audience must be configured. Each allowed native client ID
must be listed explicitly. Run `db/migrations/20260731_billing_identities.sql`
on the target Neon database before enabling the endpoint.

## Direct download endpoint

Buttons link to `GET /download/direct/`. The resolver fetches:

```text
https://downloads.horacal.app/direct/stable/latest.json
```

It validates the complete release metadata, exact HTTPS host, immutable release
path, version, build, file name and SHA-256 checksum file. Only then does it
return a temporary `307` redirect to the immutable DMG.

`latest.dmg` is never linked directly. `latest.json` is the release pipeline's
website commit marker and is intentionally requested with `no-store` so a
rollback is visible on the next request.

The optional server-only variable below must still resolve to the trusted
production origin. Other hosts, paths, ports and credentials are rejected.

```text
DIRECT_DOWNLOAD_BASE_URL=https://downloads.horacal.app
```

The canonical manifest schema and publication order are documented in
`hora-calendar/Docs/DirectRelease.md`.
