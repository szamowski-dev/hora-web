"use client";

import NextError from "next/error";
import posthog from "posthog-js";
import { useEffect } from "react";
import { track } from "@/lib/analytics";

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    posthog.captureException(error);
    track("global_error", {
      name: error.name,
      message: error.message.slice(0, 200),
    });
  }, [error]);

  return (
    <html lang="en">
      <body>
        {/* `NextError` is the default Next.js error page component. Its type
        definition requires a `statusCode` prop. However, since the App Router
        does not expose status codes for errors, we simply pass 0 to render a
        generic error message. */}
        <NextError statusCode={0} />
      </body>
    </html>
  );
}
