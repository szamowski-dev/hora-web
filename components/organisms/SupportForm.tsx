"use client";

import { type ChangeEvent, type FormEvent, useState } from "react";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { Icon } from "@/components/atoms/Icon";

const categories = [
  { value: "bug", label: "Bug report" },
  { value: "sync", label: "Calendar sync" },
  { value: "account", label: "Account or login" },
  { value: "billing", label: "Billing" },
  { value: "refund", label: "Paddle refund (direct purchase)" },
  { value: "feature", label: "Feature request" },
  { value: "other", label: "Other" },
] as const;

const fieldClassName =
  "rounded-xl border-line bg-bg/70 shadow-none hover:border-line-strong focus-visible:border-white/20 focus-visible:ring-0";

type Status =
  | { type: "idle" }
  | { type: "success" }
  | { type: "error"; message: string };

const discordUrl = "https://discord.gg/8JFz4FfBGQ";

function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-text">{label}</span>
      <span className="mt-2 block">{children}</span>
      {hint ? <span className="mt-2 block text-xs leading-5 text-muted">{hint}</span> : null}
    </label>
  );
}

export function SupportForm() {
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<Status>({ type: "idle" });
  const [showRequestDetails, setShowRequestDetails] = useState(false);
  const [category, setCategory] = useState<(typeof categories)[number]["value"]>("bug");
  const [submittedCategory, setSubmittedCategory] = useState<(typeof categories)[number]["value"] | null>(null);

  function revealRequestDetails(event: ChangeEvent<HTMLInputElement>) {
    if (showRequestDetails) return;

    const form = event.currentTarget.form;
    const name = form?.elements.namedItem("name");
    const email = form?.elements.namedItem("email");

    if (
      name instanceof HTMLInputElement &&
      email instanceof HTMLInputElement &&
      name.value.trim().length >= 2 &&
      email.validity.valid
    ) {
      setShowRequestDetails(true);
    }
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setStatus({ type: "idle" });

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());
    const requestedCategory = payload.category;

    try {
      const res = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json().catch(() => null);

      if (!res.ok) {
        setStatus({
          type: "error",
          message:
            typeof json?.error === "string"
              ? json.error
              : "Could not send your request. Please try again.",
        });
        return;
      }

      form.reset();
      setShowRequestDetails(false);
      setCategory("bug");
      setSubmittedCategory(
        typeof requestedCategory === "string"
          ? categories.find((item) => item.value === requestedCategory)?.value ?? null
          : null,
      );
      setStatus({ type: "success" });
    } catch {
      setStatus({
        type: "error",
        message: "Network error. Please try again or email hello@horacal.app.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="relative overflow-hidden rounded-[28px] border border-line bg-panel/78 p-5 shadow-[inset_0_1px_0_var(--ui-highlight),0_32px_80px_-52px_var(--ui-shadow-neutral)] backdrop-blur-xl md:p-8 lg:p-10"
    >
      <div className="relative mb-8 flex items-center justify-between gap-4 border-b border-line pb-6">
        <div>
          <h2 className="text-2xl font-semibold tracking-[-0.03em] text-text sm:text-3xl">
            Send a support request
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            The details below go directly to the developer.
          </p>
        </div>
        <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-line bg-overlay text-label-blue">
          <Icon name="mail" size={19} />
        </span>
      </div>

      <div className="relative grid gap-4 sm:grid-cols-2">
        <Field label="Name">
          <Input
            name="name"
            autoComplete="name"
            required
            minLength={2}
            maxLength={80}
            onChange={revealRequestDetails}
            className={fieldClassName}
          />
        </Field>
        <Field label="Email">
          <Input
            name="email"
            type="email"
            autoComplete="email"
            required
            maxLength={254}
            onChange={revealRequestDetails}
            className={fieldClassName}
          />
        </Field>
      </div>

      {showRequestDetails ? (
        <div aria-label="Additional request details">
          <div className="relative mt-4 grid gap-4 sm:grid-cols-2">
            <Field label="Category">
              <span className="relative block">
                <select
                  name="category"
                  required
                  value={category}
                  onChange={(event) => setCategory(event.target.value as typeof category)}
                  className="h-12 w-full appearance-none rounded-xl border border-line bg-bg/70 px-5 pr-14 text-sm text-text outline-none transition-colors hover:border-line-strong focus-visible:border-white/20"
                >
                  {categories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
                <svg
                  aria-hidden
                  className="pointer-events-none absolute right-5 top-1/2 h-4 w-4 -translate-y-1/2 text-text/80"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </span>
            </Field>
            <Field label="Short summary">
              <Input
                name="summary"
                required
                minLength={8}
                maxLength={120}
                className={fieldClassName}
              />
            </Field>
          </div>

          {category === "refund" ? (
            <div className="relative mt-4">
              <Field
                label="Paddle transaction ID"
                hint="Optional, but it helps us find the purchase faster. You can find it in your Paddle receipt."
              >
                <Input
                  name="paddleTransactionId"
                  maxLength={100}
                  placeholder="txn_..."
                  className={fieldClassName}
                />
              </Field>
            </div>
          ) : null}

          <div className="relative mt-4 grid gap-4 sm:grid-cols-2">
            <Field
              label="App version"
              hint="Optional, visible in hora's About window."
            >
              <Input
                name="appVersion"
                maxLength={40}
                placeholder="0.6.0"
                className={fieldClassName}
              />
            </Field>
            <Field label="OS version" hint="Optional, for example macOS 26.">
              <Input
                name="osVersion"
                maxLength={80}
                placeholder="macOS 26.0"
                className={fieldClassName}
              />
            </Field>
          </div>
        </div>
      ) : null}

      <div className="relative mt-4">
        <Field label={category === "refund" ? "Why would you like a refund?" : "What happened?"}>
          <textarea
            name="details"
            required
            minLength={20}
            maxLength={4000}
            rows={5}
            className="w-full resize-y rounded-xl border border-line bg-bg/70 px-5 py-4 text-sm leading-6 text-text placeholder:text-muted focus-visible:border-white/20 focus-visible:outline-none"
            placeholder={
              category === "refund"
                ? "Please tell us why you are requesting a refund. Use the same email address as your Paddle purchase."
                : "Tell us what you expected, what happened instead, and whether it blocks your calendar work."
            }
          />
        </Field>
      </div>

      <details className="group relative mt-4 overflow-hidden rounded-xl border border-line bg-overlay">
        <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 px-4 py-3 text-sm font-medium text-text transition-colors hover:bg-overlay-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent [&::-webkit-details-marker]:hidden">
          <span>
            Add steps tried or reproduction
            <span className="ml-2 font-normal text-muted">Optional</span>
          </span>
          <span
            aria-hidden
            className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-line-strong bg-overlay text-lg font-light text-accent transition-transform group-open:rotate-45"
          >
            +
          </span>
        </summary>
        <div className="border-t border-line p-4">
          <label className="sr-only" htmlFor="support-steps">
            Steps tried or reproduction
          </label>
          <textarea
            id="support-steps"
            name="steps"
            maxLength={2000}
            rows={4}
            className="w-full resize-y rounded-xl border border-line bg-bg/70 px-5 py-4 text-sm leading-6 text-text placeholder:text-muted focus-visible:border-white/20 focus-visible:outline-none"
            placeholder={"1. Opened hora\n2. Changed calendar view\n3. Saw..."}
          />
          <p className="mt-2 text-xs leading-5 text-muted">
            Optional, but very helpful for bugs.
          </p>
        </div>
      </details>

      <label className="hidden">
        Company
        <input name="honey" tabIndex={-1} autoComplete="off" />
      </label>

      <div className="relative mt-5 rounded-xl border border-line bg-overlay p-4 text-sm leading-6 text-muted">
        Please do not include passwords, API tokens, OAuth codes, or private calendar
        event details. Your email is included so we can follow up.
      </div>

      {status.type !== "idle" ? (
        <div
          className={
            status.type === "success"
              ? "relative mt-4 rounded-md border border-success/25 bg-success/10 p-4 text-sm leading-6 text-text"
              : "mt-4 rounded-md border border-accent/25 bg-accent/10 p-4 text-sm leading-6 text-text"
          }
          role="status"
        >
          {status.type === "success" && submittedCategory === "refund" ? (
            <>Refund request sent. We will verify your Paddle purchase and reply by email.</>
          ) : status.type === "success" ? (
            <>
              Message sent. For real-time bug reports, quick follow-ups, and
              known issues,{" "}
              <a
                href={discordUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-text underline decoration-line-strong underline-offset-4"
              >
                join the hora Discord
              </a>
              .
            </>
          ) : (
            status.message
          )}
        </div>
      ) : null}

      <div className="relative mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button
          type="submit"
          variant="outline"
          size="lg"
          className="border-accent/50 bg-accent px-6 text-sm font-semibold text-text shadow-[0_14px_32px_-22px_oklch(0_0_0/0.94),inset_0_1px_0_oklch(0.9851_0_0/0.16)] transition-[background-color,filter] hover:bg-accent-hover hover:brightness-105 hover:saturate-110 hover:text-text"
          disabled={submitting}
        >
          <Icon name="mail" size={18} />
          {submitting ? "Sending..." : "Send support request"}
        </Button>
        <a
          href={discordUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="discord-cta-button inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-full [corner-shape:superellipse(1.6)] px-5 text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-discord-hover focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
        >
          <Icon name="discord" size={17} />
          Join hora Discord
        </a>
      </div>
    </form>
  );
}
