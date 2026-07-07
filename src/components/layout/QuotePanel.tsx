"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { CONTACT_INFO } from "@/lib/constants";

interface AccessPanelContextValue {
  isOpen: boolean;
  openPanel: () => void;
  closePanel: () => void;
}

const AccessPanelContext = createContext<AccessPanelContextValue>({
  isOpen: false,
  openPanel: () => {},
  closePanel: () => {},
});

export function useAccessPanel() {
  return useContext(AccessPanelContext);
}

export function AccessPanelProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const openPanel = useCallback(() => setIsOpen(true), []);
  const closePanel = useCallback(() => setIsOpen(false), []);

  return (
    <AccessPanelContext.Provider value={{ isOpen, openPanel, closePanel }}>
      <div className={`qp-scene ${isOpen ? "is-open" : ""}`}>
        <div className="qp-content">
          {children}
        </div>
        <AccessPanel />
      </div>
    </AccessPanelContext.Provider>
  );
}

function AccessPanel() {
  const { isOpen, closePanel } = useAccessPanel();
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setStatus("idle");
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) closePanel();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, closePanel]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "sending") return;

    const form = formRef.current;
    if (!form) return;

    const data = {
      name: (form.elements.namedItem("qp-name") as HTMLInputElement).value.trim(),
      email: (form.elements.namedItem("qp-email") as HTMLInputElement).value.trim(),
      phone: (form.elements.namedItem("qp-phone") as HTMLInputElement).value.trim(),
      message: (form.elements.namedItem("qp-message") as HTMLTextAreaElement).value.trim(),
      source: "access-panel",
    };

    if (!data.name || !data.email) return;

    setStatus("sending");

    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setStatus("sent");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <>
      <div
        className="qp-overlay"
        onClick={closePanel}
        aria-hidden={!isOpen}
      />
      <div className="qp-panel" aria-hidden={!isOpen}>
        <div className="qp-header">
          <h2 className="qp-title">Request access</h2>
          <button
            className="qp-close"
            onClick={closePanel}
            aria-label="Close panel"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18" stroke="currentColor" strokeWidth="1.5" />
              <path d="M6 6L18 18" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </button>
        </div>

        <div className="qp-body">
          {status === "sent" ? (
            <div className="qp-success">
              <p className="qp-success-heading">Received</p>
              <p className="qp-success-text">
                You’re in. We’ll be in touch quietly, and only when it matters.
              </p>
              <button type="button" onClick={closePanel} className="qp-submit" style={{ marginTop: "2rem" }}>
                <span className="btn-label">
                  <span className="btn-line">Close</span>
                  <span className="btn-line" aria-hidden="true">Close</span>
                </span>
              </button>
            </div>
          ) : (
            <>
              <p className="qp-intro">
                Sixty founding memberships. By invitation only.
              </p>

              <form ref={formRef} className="qp-form" onSubmit={handleSubmit}>
                <div className="qp-field">
                  <label className="qp-label" htmlFor="qp-name">Name</label>
                  <input
                    className="qp-input"
                    id="qp-name"
                    name="qp-name"
                    type="text"
                    placeholder="Your full name"
                    autoComplete="name"
                    required
                  />
                </div>

                <div className="qp-field">
                  <label className="qp-label" htmlFor="qp-email">Email</label>
                  <input
                    className="qp-input"
                    id="qp-email"
                    name="qp-email"
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    required
                  />
                </div>

                <div className="qp-field">
                  <label className="qp-label" htmlFor="qp-phone">Phone <span aria-hidden="true">(optional)</span></label>
                  <input
                    className="qp-input"
                    id="qp-phone"
                    name="qp-phone"
                    type="tel"
                    placeholder="Your phone number"
                    autoComplete="tel"
                  />
                </div>

                <div className="qp-field">
                  <label className="qp-label" htmlFor="qp-message">What drew you to MICRO?</label>
                  <textarea
                    className="qp-input qp-textarea"
                    id="qp-message"
                    name="qp-message"
                    placeholder="What drew you to MICRO?"
                    rows={5}
                  />
                </div>

                <button type="submit" className="qp-submit" disabled={status === "sending"}>
                  <svg viewBox="0 0 14 11" fill="none" className="qp-submit-arrow">
                    <path d="M0.600006 0V6H13.1" stroke="currentColor" strokeWidth="1.2" />
                    <rect x="9.18887" y="2.2251" width="5.56065" height="5.56065" transform="rotate(45 9.18887 2.2251)" stroke="currentColor" strokeWidth="1.2" />
                  </svg>
                  <span className="btn-label">
                    <span className="btn-line">{status === "sending" ? "Settling..." : "Request access"}</span>
                    <span className="btn-line" aria-hidden="true">{status === "sending" ? "Settling..." : "Request access"}</span>
                  </span>
                </button>

                {status === "error" && (
                  <p className="qp-error">Something went wrong. Please try again or contact us directly.</p>
                )}
              </form>

              <div className="qp-contact">
                <p className="qp-contact-label">Or reach us directly</p>
                <a href={CONTACT_INFO.phone.href} className="qp-contact-link">
                  {CONTACT_INFO.phone.display}
                </a>
                <a href={CONTACT_INFO.email.href} className="qp-contact-link">
                  {CONTACT_INFO.email.display}
                </a>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default AccessPanel;
