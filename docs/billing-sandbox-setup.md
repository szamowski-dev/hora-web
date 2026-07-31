# Direct web billing sandbox setup

This repository intentionally supports only the sandbox configuration. Do not
add these values to Vercel Production.

## 1. Vercel Marketplace Postgres

Install Neon for the `hora-web` Vercel project with these choices:

- environments: Preview and Development only
- database branches: Preview only
- environment-variable prefix: `DATABASE` (creates `DATABASE_URL`)
- sensitive: enabled

After connecting, run the SQL from
`db/migrations/20260731_billing_identities.sql` in the **Preview branch** SQL
editor. It creates the persistent mapping from the verified Google issuer and
subject to an opaque `usr_*` RevenueCat App User ID.

## 2. Preview environment variables

Add these only to Preview and Development:

```text
WEB_BILLING_ENVIRONMENT=sandbox
WEB_BILLING_PUBLIC_API_KEY=<RevenueCat Web public key for the Paddle sandbox config>
GOOGLE_OAUTH_CLIENT_ID=<Google web OAuth client ID>
```

`WEB_BILLING_PUBLIC_API_KEY` must be the Web Billing key, never an `appl_`
native key. `DATABASE_URL` is injected by the Neon integration.

The Google OAuth client must allow the preview URL and `http://localhost:3000`
in its Authorized JavaScript origins. The server verifies its ID-token audience
against the same `GOOGLE_OAUTH_CLIENT_ID`.

## 3. Paddle Sandbox / RevenueCat prerequisites

- The Paddle sandbox web config is connected to the sandbox Paddle account.
- The registered checkout domains include `pay.rev.cat` and the preview domain.
- The current RevenueCat Web offering is `pro` and exposes only `$rc_annual`
  and `$rc_lifetime`.
- Paddle's sandbox API key grants RevenueCat the customer-portal-session write
  permission so RevenueCat can return a management URL.

No production Paddle or RevenueCat setting is changed by this implementation.
