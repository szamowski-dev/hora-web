"use client";

import { useEffect } from "react";
import { GOOGLE_ADS_ID, REDDIT_PIXEL_ID } from "@/lib/analytics";

const TIKTOK_PIXEL_ID = "D9ORLKJC77U1C011QNB0";

function appendScript(id: string, src: string) {
  if (document.getElementById(id)) return;

  const script = document.createElement("script");
  script.id = id;
  script.src = src;
  script.async = true;
  document.head.appendChild(script);
}

function appendTikTokBootstrap() {
  if (document.getElementById("tiktok-pixel-bootstrap")) return;

  const script = document.createElement("script");
  script.id = "tiktok-pixel-bootstrap";
  script.text = `!function(w,d,t){w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};n=document.createElement("script"),n.type="text/javascript",n.async=!0,n.src=r+"?sdkid="+e+"&lib="+t,e=document.getElementsByTagName("script")[0],e.parentNode.insertBefore(n,e)};ttq.load('${TIKTOK_PIXEL_ID}');ttq.page()}(window,document,'ttq');`;
  document.head.appendChild(script);
}

export function MarketingTracking() {
  useEffect(() => {
    let activated = false;

    const activate = () => {
      if (activated || !window.Cookiebot?.consent?.marketing) return;
      activated = true;

      const configureGoogleAds = () => {
        if (window.Cookiebot?.consent?.marketing) {
          window.gtag?.("config", GOOGLE_ADS_ID);
        }
      };
      if (window.horaGtagReady) {
        configureGoogleAds();
      } else {
        window.addEventListener("hora-gtag-ready", configureGoogleAds, {
          once: true,
        });
      }

      let rdt = window.rdt;
      if (!rdt) {
        const callQueue: unknown[][] = [];
        const queuedRdt = Object.assign(
          (...args: unknown[]) => callQueue.push(args),
          { callQueue },
        );
        rdt = queuedRdt;
        window.rdt = rdt;
        appendScript(
          "reddit-pixel-library",
          `https://www.redditstatic.com/ads/pixel.js?pixel_id=${REDDIT_PIXEL_ID}`,
        );
      }
      rdt("init", REDDIT_PIXEL_ID);
      rdt("track", "PageVisit");

      appendTikTokBootstrap();
    };

    window.addEventListener("CookiebotOnConsentReady", activate);
    window.addEventListener("CookiebotOnAccept", activate);
    activate();

    return () => {
      window.removeEventListener("CookiebotOnConsentReady", activate);
      window.removeEventListener("CookiebotOnAccept", activate);
    };
  }, []);

  return null;
}
