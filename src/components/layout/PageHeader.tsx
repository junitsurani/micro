"use client";

import TransitionLink from "@/components/ui/TransitionLink";

function WordmarkSVG() {
  return (
    <span className="wordmark-text">MICRO by The Fix</span>
  );
}

interface PageHeaderProps {
  variant?: "white" | "black" | "taupe";
}

export default function PageHeader({ variant = "black" }: PageHeaderProps) {
  return (
    <section className={`page-header is-${variant}`}>
      <TransitionLink href="/" aria-label="Studio" className="logo">
        <WordmarkSVG />
      </TransitionLink>
      <h1>MICRO by The Fix</h1>
      <TransitionLink href="/access" className="base-button is-alpha ph-btn" data-track="header-request-access">
        <svg viewBox="0 0 14 11" fill="none" xmlns="http://www.w3.org/2000/svg" className="arrow-svg">
          <path d="M0.600006 0V6H13.1" stroke="currentColor" strokeWidth="1.2" />
          <rect x="9.18887" y="2.2251" width="5.56065" height="5.56065" transform="rotate(45 9.18887 2.2251)" stroke="currentColor" strokeWidth="1.2" />
        </svg>
        <div className="label">
          <span className="line" aria-hidden="true">Request access</span>
          <span className="line">Request access</span>
        </div>
      </TransitionLink>
    </section>
  );
}
