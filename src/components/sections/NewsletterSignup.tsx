"use client";

import { useRef, useEffect, useState, type FormEvent } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Status = "idle" | "sending" | "sent" | "error";

export default function NewsletterSignup() {
  const sectionRef = useRef<HTMLElement>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<Status>("idle");

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        section.querySelectorAll(".nl-animate"),
        { autoAlpha: 0, y: 30 },
        {
          autoAlpha: 1,
          y: 0,
          stagger: 0.1,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: section, start: "top 80%" },
        },
      );
    }, section);

    return () => ctx.revert();
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !consent || status === "sending") return;

    setStatus("sending");

    try {
      const response = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          message,
          consent,
          source: "homepage-founding-list",
        }),
      });

      if (!response.ok) {
        setStatus("error");
        return;
      }

      setStatus("sent");
      setName("");
      setEmail("");
      setMessage("");
      setConsent(false);
    } catch {
      setStatus("error");
    }
  }

  return (
    <section ref={sectionRef} className="newsletter-signup">
      <div className="nl-container">
        <div className="nl-inner">
          <div className="nl-left">
            <span className="nl-label nl-animate">Founding access</span>
            <h2 className="nl-heading nl-animate">
              Be part of the first circle, before the doors open.
            </h2>
          </div>

          <div className="nl-right nl-animate">
            <p className="nl-text">
              Sixty founding memberships. By invitation only.
            </p>
          </div>
        </div>

        <div className="nl-newsletter nl-animate">
          {status === "sent" ? (
            <p className="nl-success">
              You&apos;re in. We&apos;ll be in touch quietly, and only when it matters.
            </p>
          ) : (
            <form className="nl-form" onSubmit={handleSubmit}>
              <span className="nl-form-label">Request access</span>
              <input
                type="text"
                required
                placeholder="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="nl-input"
                aria-label="Full name"
                autoComplete="name"
              />
              <input
                type="email"
                required
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="nl-input"
                aria-label="Email address"
                autoComplete="email"
              />
              <input
                type="text"
                placeholder="What drew you to MICRO?"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="nl-input"
                aria-label="What drew you to MICRO?"
              />
              <label className="nl-consent">
                <input
                  type="checkbox"
                  required
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                />
                <span>
                  I consent to MICRO storing my details and contacting me about
                  news, membership and studio updates.
                </span>
              </label>
              <button type="submit" className="nl-submit" disabled={status === "sending"}>
                <span className="btn-label">
                  <span className="btn-line">{status === "sending" ? "Sending" : "Request access"}</span>
                  <span className="btn-line" aria-hidden="true">{status === "sending" ? "Sending" : "Request access"}</span>
                </span>
              </button>
              {status === "error" && (
                <p className="nl-success is-error">
                  Something went wrong. Please try again.
                </p>
              )}
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
