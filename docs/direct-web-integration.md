# Direct web integration

The website has three intentionally small responsibilities for the Direct app:
resolve its canonical billing identity, register its entitlement-push token,
and resolve the current signed installer.

RevenueCat Funnel owns checkout. The website does not load `purchases-js`,
fetch RevenueCat offerings, or keep a second product catalogue.

## Direct identity endpoint

`POST /api/direct/identity` accepts only a fresh Google ID token in the
`Authorization: Bearer` header. The server verifies the JWT signature against
Google JWKS and validates its issuer, native OAuth audience, expiry, issued-at
time, and subject.

The verified canonical Google issuer and subject are converted to an opaque,
stable RevenueCat App User ID using HMAC-SHA256:

```text
usr_direct_v1_<base64url digest>
```

The Google subject, email address, and raw token are never returned, sent to
RevenueCat, or logged. The server-only configuration is:

```text
GOOGLE_OAUTH_NATIVE_CLIENT_IDS=<comma-separated OAuth client IDs>
DIRECT_IDENTITY_HMAC_KEY_V1=<64 hex characters>
```

`DIRECT_IDENTITY_HMAC_KEY_V1` is part of the customer identity contract. Do not
replace it without migrating the existing RevenueCat identities.

Both Direct API routes use stable machine-readable failures:

```json
{"code":"identity_unavailable","retryable":true,"retry_after_seconds":30}
```

HTTP 429 and 503 responses that include `retry_after_seconds` also include the
matching `Retry-After` header. Clients must not parse human-readable messages.

## Direct entitlement push registration

`POST /api/direct/push/device` accepts the same fresh Google bearer ID token and
the strict JSON body below:

```json
{
  "action": "register",
  "apns_token": "<32–200 even-length hexadecimal characters>",
  "apns_environment": "production"
}
```

`action` can be `register` or `unregister`; `apns_environment` can be
`sandbox` or `production`. The APNs token is treated as opaque bytes encoded as
an even-length 32–200 character hex string; no current device-token length is
hardcoded. The route rejects unknown fields, including a client-supplied
`app_user_id`. It derives the canonical `usr_direct_v1_*` ID from the verified
Google identity and forwards the command to the private worker endpoint.

```text
DIRECT_PUSH_WORKER_URL=https://<private-worker-origin>
DIRECT_PUSH_WORKER_SECRET=<dedicated high-entropy secret>
```

The worker call is `POST /v1/direct/devices` with the dedicated secret in its
Bearer header. Do not reuse the legacy `DEVICE_REGISTRATION_SECRET`.

## Direct download endpoint

Buttons link to `GET /download/direct/`. The resolver fetches:

```text
https://downloads.horacal.app/direct/stable/latest.json
```

It validates the complete release metadata, exact HTTPS host, immutable release
path, version, build, file name and SHA-256 checksum file. Only then does it
return a temporary `307` redirect to the immutable ZIP exported and stapled by
Xcode Cloud.

website commit marker and is intentionally requested with `no-store` so a
rollback is visible on the next request.
`latest.zip` is never linked directly. `latest.json` is the release pipeline's
website commit marker and is intentionally requested with `no-store` so a
rollback is visible on the next request.
website commit marker and is intentionally requested with `no-store` so a
rollback is visible on the next request.

The optional server-only variable below must still resolve to the trusted
production origin. Other hosts, paths, ports and credentials are rejected.

```text
DIRECT_DOWNLOAD_BASE_URL=https://downloads.horacal.app
```

The canonical manifest schema and publication order are documented in
`hora-calendar/Docs/DirectRelease.md`.
