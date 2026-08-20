import posthog, { type PostHog } from "posthog-js";

import type { ConversationsClient } from "@/lib/support-request";

// The main analytics instance intentionally runs in cookieless mode. PostHog
// does not load Conversations for that mode, so Support uses a separate,
// quiet instance whose only job is to load the Conversations API and persist
// its ticket state.
let supportPostHog: PostHog | null = null;

const unavailableClient: ConversationsClient = {
  isAvailable: () => false,
  getCurrentTicketId: () => null,
  getMessages: async () => null,
  sendMessage: async () => null,
};

export function getSupportConversations(): ConversationsClient {
  if (typeof window === "undefined") return unavailableClient;
  if (supportPostHog) return supportPostHog.conversations;

  const projectToken = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;
  if (!projectToken || !host) return unavailableClient;

  try {
    supportPostHog = posthog.init(
      projectToken,
      {
        api_host: host,
        ui_host: "https://us.posthog.com",
        defaults: "2026-05-30",
        autocapture: false,
        capture_pageview: false,
        capture_pageleave: false,
        capture_exceptions: false,
        disable_session_recording: true,
        disable_surveys: true,
        disable_web_experiments: true,
        persistence: "localStorage",
        person_profiles: "identified_only",
      },
      "hora-support",
    );
    return supportPostHog.conversations;
  } catch {
    supportPostHog = null;
    return unavailableClient;
  }
}
