# Direct release: manual Sanity content manifest

Apply this manifest manually in Sanity only after the app, hora-web, worker,
and sandbox purchase/refund E2E checks pass. The implementation intentionally
does not write or publish Sanity while preparing these changes.

## Pricing page (`pricingPage`)

- Hero title: `Choose your Direct plan`
- Hero description: `Try hora free for 7 days without a payment card. Choose Monthly or Annual in the app when you are ready.`
- Keep exactly two Direct plans:
  - `Monthly` — `USD 2.99` — `/month`
  - `Annual` — `USD 29.99` — `/year`
- Remove the Lifetime plan from new-sale pricing. Do not delete or rename any
  underlying legacy product needed to recognize existing customers.
- Set the download label to `Download hora — choose a plan in the app`.
- Set `showDownload` to true and `showTerminalPrompt` to false. The deployed UI
  enforces one code-owned CTA beneath the Direct plan grid, but these values
  keep CMS truth aligned.
- Do not promise a fixed refund window or describe a web checkout/account
  portal. Plans are selected in the native app. The code-owned pricing page
  shows `Final currency and applicable taxes are confirmed in checkout.`

## Pricing FAQ (`pricingPage.faq`)

Use these answers verbatim where the corresponding questions exist:

- Free trial: `Yes. hora includes a 7-day cardless trial in the native app before you choose a Direct plan.`
- One-time purchase: `No new Lifetime plan is available. Direct currently offers Monthly and Annual subscriptions.`
- Cancellation: `You can cancel renewal before the next billing date. Your access continues until the end of the current billing period.`
- Refunds: `Direct refund requests are reviewed case by case. A refund and cancellation of automatic renewal are separate actions, so tell support which outcome you need.`
- Expiry: `When a subscription ends, choose Monthly or Annual in the app to continue using Direct access.`

Remove every remaining `14-day`, `14 day`, `24-hour`, and `24 hour` promise
from the pricing document.

## Refunds page (`refundsPage`)

Preserve the existing page layout and SEO fields, then replace conflicting
eligibility/window text with the following policy:

> Direct purchase refund requests are reviewed case by case. Send the email
> address from your Paddle receipt and the Paddle transaction ID when
> available. A refund and cancellation of automatic renewal are separate
> actions. Tell us whether you want a refund only or a refund plus cancellation
> of automatic renewal. Mac App Store refunds remain handled by Apple.

Remove every fixed 14-day or 24-hour eligibility promise. Do not state that a
full refund automatically cancels renewal.

## Support, FAQ, and structured data ownership

- `/support/` refund copy, FAQ, and required `refund only` versus `refund plus
  cancellation` choice are code-owned. There is no separate support-page
  Sanity document to edit.
- Visible pricing FAQ and its JSON-LD are code-owned from the same contract.
  Update `pricingPage.faq` anyway so CMS truth matches the rendered page.
- Homepage `SoftwareApplication` pricing JSON-LD is code-owned and now declares
  USD 2.99–29.99 with two offers. There is no Sanity field to edit for it.
- There is no web account portal. Do not add account-management links to Sanity.

## Privacy page (`privacyPage`)

Add a short Direct entitlement-notification section using this copy:

> Direct entitlement notifications. In the Direct edition, hora registers an
> Apple Push Notification service device token together with a pseudonymous
> billing ID derived from the verified Google identity. The raw Google token is
> not retained for this purpose. A Cloudflare Worker uses the registration only
> to send a silent wake-up notification through APNs so the app can request the
> current subscription status from RevenueCat. The notification contains no
> email address, product, or entitlement status. Device registrations expire
> after 60 days without refresh, and invalid APNs tokens are removed earlier.

Keep the existing privacy sections intact and update `lastUpdated` to the real
publication date.

## Read-only acceptance check after publication

1. Open production `/pricing/`, `/refunds/`, and `/support/`.
2. Confirm Monthly and Annual, the 7-day cardless trial, one Direct CTA beneath
   the plan grid, and the matching Direct action in navigation.
3. Confirm no new Lifetime offer and no 14-day/24-hour refund promise.
4. Inspect pricing FAQ JSON-LD and homepage `SoftwareApplication` JSON-LD.
5. Run `pnpm sanity:verify:site`; it now fails until the published documents
   satisfy this contract and includes `refundsPage` in its singleton/read tests.
