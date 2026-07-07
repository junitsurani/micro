"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { useAnalytics } from "@/components/analytics/AnalyticsProvider";

type Status = "idle" | "sending" | "sent" | "error";

const FORM_ID = "access-form";
const FIELD_NAMES = ["access-name", "access-email", "access-message", "access-consent"] as const;

export default function AccessForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const { trackFormEvent, registerFormFields } = useAnalytics();
  const hasEngaged = useRef(false);

  useEffect(() => {
    registerFormFields(FORM_ID, FIELD_NAMES.length);
  }, [registerFormFields]);

  // Track form abandonment when the user leaves the page after engaging
  useEffect(() => {
    return () => {
      if (hasEngaged.current && status !== "sent") {
        trackFormEvent(FORM_ID, "abandon");
      }
    };
  }, [status, trackFormEvent]);

  const handleFocus = useCallback(
    (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      hasEngaged.current = true;
      trackFormEvent(FORM_ID, "focus", e.target.name);
    },
    [trackFormEvent],
  );

  const handleInput = useCallback(
    (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      trackFormEvent(FORM_ID, "input", (e.target as HTMLInputElement).name);
    },
    [trackFormEvent],
  );

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "sending") return;

    const form = formRef.current;
    if (!form) return;

    const data = {
      name: (form.elements.namedItem("access-name") as HTMLInputElement).value.trim(),
      email: (form.elements.namedItem("access-email") as HTMLInputElement).value.trim(),
      message: (form.elements.namedItem("access-message") as HTMLTextAreaElement).value.trim(),
      consent: (form.elements.namedItem("access-consent") as HTMLInputElement).checked,
      source: "access-page",
    };

    if (!data.name || !data.email || !data.consent) return;

    setStatus("sending");
    trackFormEvent(FORM_ID, "submit");

    try {
      const response = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        setStatus("error");
        return;
      }

      setStatus("sent");
      hasEngaged.current = false;
      form.reset();
    } catch {
      setStatus("error");
    }
  };

  return (
    <form ref={formRef} className="access-form" onSubmit={handleSubmit}>
      <div className="access-field">
        <label htmlFor="access-name">Name</label>
        <input
          id="access-name"
          name="access-name"
          type="text"
          placeholder="Your full name"
          autoComplete="name"
          required
          onFocus={handleFocus}
          onInput={handleInput}
        />
      </div>

      <div className="access-field">
        <label htmlFor="access-email">Email</label>
        <input
          id="access-email"
          name="access-email"
          type="email"
          placeholder="you@domain.com"
          autoComplete="email"
          required
          onFocus={handleFocus}
          onInput={handleInput}
        />
      </div>

      <div className="access-field">
        <label htmlFor="access-message">What drew you to MICRO?</label>
        <textarea
          id="access-message"
          name="access-message"
          placeholder="What drew you to MICRO?"
          rows={4}
          onFocus={handleFocus}
          onInput={handleInput}
        />
      </div>

      <label className="access-consent">
        <input
          id="access-consent"
          name="access-consent"
          type="checkbox"
          required
          onFocus={handleFocus}
          onChange={() => trackFormEvent(FORM_ID, "input", "access-consent")}
        />
        <span>
          I consent to MICRO storing my details and contacting me about news,
          membership and studio updates.
        </span>
      </label>

      <button type="submit" className="access-submit" disabled={status === "sending"}>
        <span className="btn-label">
          <span className="btn-line">
            {status === "sending" ? "Settling..." : "Request access"}
          </span>
          <span className="btn-line" aria-hidden="true">
            {status === "sending" ? "Settling..." : "Request access"}
          </span>
        </span>
      </button>

      {status === "sent" && (
        <p className="access-status">You’re in. We’ll be in touch quietly, and only when it matters.</p>
      )}
      {status === "error" && (
        <p className="access-status is-error">Something went wrong. Please try again.</p>
      )}
    </form>
  );
}
