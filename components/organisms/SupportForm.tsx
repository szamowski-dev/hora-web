"use client";

import { type FormEvent, useState } from "react";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { Icon } from "@/components/atoms/Icon";

const categories = [
  { value: "bug", label: "Bug report" },
  { value: "sync", label: "Calendar sync" },
  { value: "account", label: "Account or login" },
  { value: "billing", label: "Billing" },
  { value: "feature", label: "Feature request" },
  { value: "other", label: "Other" },
] as const;

const fieldClassName =
  "rounded-md border-white/10 bg-bg/85 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] focus-visible:border-white/30 focus-visible:ring-white/20";

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

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setStatus({ type: "idle" });

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

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
      className="relative rounded-lg border border-white/10 bg-white/[0.035] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_34px_90px_-60px_rgba(255,56,60,0.7)] md:p-7"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-6 top-0 h-px bg-linear-to-r from-transparent via-white/30 to-transparent"
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Name">
          <Input
            name="name"
            autoComplete="name"
            required
            minLength={2}
            maxLength={80}
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
            className={fieldClassName}
          />
        </Field>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <Field label="Category">
          <span className="relative block">
            <select
              name="category"
              required
              defaultValue="bug"
              className="h-12 w-full appearance-none rounded-md border border-white/10 bg-bg/85 px-5 pr-14 text-sm text-text shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] outline-none transition-colors hover:border-white/18 focus-visible:border-white/30 focus-visible:ring-2 focus-visible:ring-white/20 focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
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

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <Field label="App version" hint="Optional, visible in hora's About window.">
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

      <div className="mt-4">
        <Field label="What happened?">
          <textarea
            name="details"
            required
            minLength={20}
            maxLength={4000}
            rows={7}
            className="w-full resize-y rounded-md border border-white/10 bg-bg/85 px-5 py-4 text-sm leading-6 text-text shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] placeholder:text-muted focus-visible:border-white/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
            placeholder="Tell us what you expected, what happened instead, and whether it blocks your calendar work."
          />
        </Field>
      </div>

      <div className="mt-4">
        <Field label="Steps tried or reproduction" hint="Optional, but very helpful for bugs.">
          <textarea
            name="steps"
            maxLength={2000}
            rows={4}
            className="w-full resize-y rounded-md border border-white/10 bg-bg/85 px-5 py-4 text-sm leading-6 text-text shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] placeholder:text-muted focus-visible:border-white/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
            placeholder={"1. Opened hora\n2. Changed calendar view\n3. Saw..."}
          />
        </Field>
      </div>

      <label className="hidden">
        Company
        <input name="honey" tabIndex={-1} autoComplete="off" />
      </label>

      <div className="mt-5 rounded-md border border-white/10 bg-white/[0.025] p-4 text-sm leading-6 text-muted">
        Please do not include passwords, API tokens, OAuth codes, or private calendar
        event details. Your email is included so we can follow up.
      </div>

      {status.type !== "idle" ? (
        <div
          className={
            status.type === "success"
              ? "mt-4 rounded-md border border-emerald-400/25 bg-emerald-400/10 p-4 text-sm leading-6 text-emerald-100"
              : "mt-4 rounded-md border border-accent/25 bg-accent/10 p-4 text-sm leading-6 text-text"
          }
          role="status"
        >
          {status.type === "success" ? (
            <>
              Message sent. For real-time bug reports, quick follow-ups, and
              known issues,{" "}
              <a
                href={discordUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-white underline decoration-white/40 underline-offset-4"
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

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button type="submit" size="lg" className="rounded-md" disabled={submitting}>
          <Icon name="mail" size={18} />
          {submitting ? "Sending..." : "Send support request"}
        </Button>
        <a
          href="mailto:hello@horacal.app"
          className="inline-flex min-h-12 items-center justify-center rounded-md px-4 text-sm font-medium text-muted transition-colors hover:text-text"
        >
          Or email hello@horacal.app
        </a>
      </div>
    </form>
  );
}
