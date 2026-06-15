import { analyticsAttrs } from "@/lib/analyticsAttrs";
import { site } from "@/content/site";

export function OneMoreThing({
  tweetUrl = "https://twitter.com/intent/tweet?text=I%E2%80%99ve%20been%20using%20a%20new%20native%20Google%20Calendar%20app%20for%20macOS%2C%20and%20I%20think%20it%20is%E2%80%A6&url=https%3A%2F%2Fhoracal.app%2F%3Futm_source%3Dblog%26utm_medium%3Ddevlog%26utm_campaign%3Dmac_launch%26utm_content%3Done_more_thing_tweet",
  linkedInUrl = "https://www.linkedin.com/sharing/share-offsite/?url=https%3A%2F%2Fhoracal.app%2F%3Futm_source%3Dblog%26utm_medium%3Ddevlog%26utm_campaign%3Dmac_launch%26utm_content%3Done_more_thing_li",
  productHuntUrl = "https://www.producthunt.com/@szamski",
  appUrl = site.cta.primary.href,
}: {
  tweetUrl?: string;
  linkedInUrl?: string;
  productHuntUrl?: string;
  appUrl?: string;
}) {
  return (
    <div className="not-prose my-12">
      <div
        className="relative overflow-hidden rounded-3xl px-6 py-10 sm:px-10 sm:py-12"
        style={{
          border: "1px solid rgba(255,56,60,0.24)",
          background:
            "radial-gradient(ellipse 600px 300px at 50% 0%, rgba(255,56,60,0.22), rgba(255,56,60,0.04) 70%), #140a0a",
        }}
      >
        <p
          className="m-0 mb-3 text-[11px] font-bold uppercase"
          style={{ color: "#ff736e", letterSpacing: "1.6px" }}
        >
          <span aria-hidden>🙏</span>&nbsp;&nbsp;One more thing
        </p>
        <h3
          className="m-0 mb-5 text-2xl font-bold tracking-tight text-white sm:text-3xl"
          style={{ lineHeight: 1.15 }}
        >
          Small things that move the needle
        </h3>
        <p
          className="m-0 mb-5 text-[15px]"
          style={{ color: "#c9c9c9", lineHeight: 1.7 }}
        >
          I&rsquo;m building hora solo &mdash; no team, no ads, no VC clock. If
          the app clicks with you, a few small things help more than
          you&rsquo;d guess:
        </p>
        <ul
          className="m-0 mb-7 list-disc pl-5 text-[15px]"
          style={{ color: "#c9c9c9", lineHeight: 1.8 }}
        >
          <li className="mb-1">
            <strong className="text-white">Post a screenshot</strong> on X,
            LinkedIn, or Threads. Even a one-liner helps.
          </li>
          <li className="mb-1">
            <strong className="text-white">Tell one friend</strong> who
            complains about Google Calendar on their Mac and send them to{" "}
            <a
              href={appUrl}
              target="_blank"
              rel="noopener noreferrer"
              {...analyticsAttrs("app_store_cta_click", {
                placement: "blog_one_more_thing_inline",
                destination: "mac_app_store",
              })}
              style={{
                color: "#ff736e",
                textDecoration: "none",
                fontWeight: 600,
                borderBottom: "1px solid rgba(255,115,110,0.4)",
              }}
            >
              the Mac App Store
            </a>{" "}
            &mdash; worth more than a hundred impressions.
          </li>
          <li>
            <strong className="text-white">Follow on Product Hunt</strong>{" "}
            &mdash; early follows make a huge difference when 1.0.0 launches
            there.
          </li>
        </ul>
        <div className="flex flex-wrap gap-2">
          <a
            href={tweetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block font-bold text-white no-underline transition hover:brightness-110"
            style={{
              background: "#0f0f0f",
              border: "1px solid rgba(255,255,255,0.12)",
              padding: "12px 20px",
              borderRadius: "999px",
              fontSize: "13px",
              letterSpacing: "0.2px",
            }}
          >
            𝕏&nbsp;&nbsp;Share on X
          </a>
          <a
            href={linkedInUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block font-bold text-white no-underline transition hover:brightness-110"
            style={{
              background: "#0a66c2",
              border: "1px solid rgba(255,255,255,0.12)",
              padding: "12px 20px",
              borderRadius: "999px",
              fontSize: "13px",
              letterSpacing: "0.2px",
            }}
          >
            in&nbsp;&nbsp;Share on LinkedIn
          </a>
          <a
            href={productHuntUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block font-bold text-white no-underline transition hover:brightness-110"
            style={{
              background: "#da552f",
              border: "1px solid rgba(255,255,255,0.15)",
              padding: "12px 20px",
              borderRadius: "999px",
              fontSize: "13px",
              letterSpacing: "0.2px",
            }}
          >
            ▲&nbsp;&nbsp;Follow on Product Hunt
          </a>
        </div>
        <p
          className="m-0 mt-6 text-[14px]"
          style={{ color: "#c9c9c9", lineHeight: 1.65 }}
        >
          You&rsquo;re getting in early. That means your voice is literally
          shaping what hora becomes &mdash; and who hears about it next.
        </p>
      </div>
    </div>
  );
}
