# Direct web integration

The website has one intentionally small responsibility for the Direct app:
resolve the current signed Direct installer from the release manifest.

RevenueCat Funnel owns checkout and the Direct app supplies its own local App
User ID. The website does not load `purchases-js`, verify Google identity,
fetch RevenueCat offerings, or keep a second product catalogue.

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
