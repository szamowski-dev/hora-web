import { logs } from "@opentelemetry/api-logs";
import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-http";
import { resourceFromAttributes } from "@opentelemetry/resources";
import { BatchLogRecordProcessor, LoggerProvider } from "@opentelemetry/sdk-logs";

const projectToken = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;

// Route handlers import this provider to flush batched records before Vercel
// freezes the serverless invocation.
export const loggerProvider = projectToken
  ? new LoggerProvider({
      resource: resourceFromAttributes({
        "service.name": "hora-web",
      }),
      processors: [
        new BatchLogRecordProcessor(
          {
            exporter: new OTLPLogExporter({
              url: "https://us.i.posthog.com/i/v1/logs",
              headers: {
                Authorization: `Bearer ${projectToken}`,
                "Content-Type": "application/json",
              },
            }),
          },
        ),
      ],
    })
  : undefined;

export function register() {
  if (process.env.NEXT_RUNTIME === "nodejs" && loggerProvider) {
    logs.setGlobalLoggerProvider(loggerProvider);
  }
}
