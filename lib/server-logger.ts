import { SeverityNumber } from "@opentelemetry/api-logs";
import { after } from "next/server";
import { loggerProvider } from "@/instrumentation";

type ServerRoute = "/api/subscribe" | "/api/support" | "/unsubscribe";

type ServerErrorOperation =
  | "resend_configuration"
  | "resend_contact_create"
  | "resend_event_send"
  | "resend_contact_remove"
  | "posthog_support_configuration"
  | "posthog_support_metadata_update"
  | "posthog_support_metadata_rejected";

type ServerErrorLog = {
  route: ServerRoute;
  operation: ServerErrorOperation;
  statusCode?: number;
};

export function serverErrorLogAttributes({
  route,
  operation,
  statusCode,
}: ServerErrorLog) {
  return {
    "http.route": route,
    "error.operation": operation,
    ...(statusCode === undefined ? {} : { "http.response.status_code": statusCode }),
  };
}

export function logServerError(error: ServerErrorLog) {
  const provider = loggerProvider;
  if (!provider) return;

  provider.getLogger("hora-web").emit({
    body: "Server request failed",
    severityNumber: SeverityNumber.ERROR,
    attributes: serverErrorLogAttributes(error),
  });

  after(async () => {
    try {
      await provider.forceFlush();
    } catch {
      // Logging must never alter the request outcome.
    }
  });
}
