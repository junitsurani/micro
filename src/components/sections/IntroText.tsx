"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import TransitionLink from "@/components/ui/TransitionLink";

gsap.registerPlugin(ScrollTrigger);

const BODY_LINES = [
  "Architected to settle the",
  "nervous system before",
  "the body moves",
];

export default function IntroText() {
  const linesRef = useRef<(HTMLDivElement | null)[]>([]);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const lines = linesRef.current.filter(Boolean) as HTMLDivElement[];
    if (!section || lines.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.set(lines, { yPercent: 0 });
      gsap.fromTo(
        section.querySelectorAll(".tc-base-title, .tc-base-heading, .tc-supporting-line, .base-btn"),
        { autoAlpha: 0, y: 24 },
        {
          autoAlpha: 1,
          y: 0,
          stagger: 0.08,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 78%",
          },
        },
      );

      ScrollTrigger.refresh();
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} data-section-about className="text-cta">
      <div className="tc-container">
        <h2 className="tc-base-title">About MICRO</h2>

        <p
          className="tc-base-heading"
          aria-label="Architected to settle the nervous system before the body moves."
        >
          {BODY_LINES.map((line, i) => (
            <span key={i} className="line-mask" aria-hidden="true">
              <span
                ref={(el) => { linesRef.current[i] = el as HTMLDivElement; }}
                className="line"
              >
                {line}
              </span>
            </span>
          ))}
        </p>

        <p className="tc-supporting-line">
          Felt before it is understood, where the experience forms part of the method.
        </p>

        <TransitionLink href="/access" className="base-btn is-waitlist" data-track="intro-join-waitlist">
          <span className="btn-label">
            <span className="btn-line">Come closer</span>
            <span className="btn-line" aria-hidden="true">Come closer</span>
          </span>
        </TransitionLink>
      </div>
    </section>
  );
}
