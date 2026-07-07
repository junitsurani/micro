"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const BELIEFS = [
  { heading: "Ground", label: "Settle before you move" },
  { heading: "Ignite", label: "Strength through precision" },
  { heading: "Restore", label: "Change that holds" },
];

export default function AboutBeliefs() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const headings = section.querySelectorAll<HTMLElement>(".ab-bl-block-text");
    const pills = section.querySelectorAll<HTMLElement>(".ab-bl-block-pill");

    const ctx = gsap.context(() => {
      headings.forEach((heading, i) => {
        gsap.fromTo(
          heading,
          { yPercent: 100 },
          {
            yPercent: 0,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: { trigger: heading.parentElement, start: "top 85%" },
            delay: i * 0.1,
          },
        );
      });

      pills.forEach((pill) => {
        gsap.fromTo(
          pill,
          { autoAlpha: 0, y: 10 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.6,
            ease: "power3.out",
            scrollTrigger: { trigger: pill, start: "top 90%" },
          },
        );
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="ab-beliefs">
      <h2 className="ab-bl-title">Ground · Ignite · Restore</h2>
      <p className="ab-bl-brief">
        A three-part method for strength, regulation and long-term transformation.
      </p>
      <p className="ab-bl-summary">
        Settle the system. Build with precision. Leave restored.
      </p>

      <div className="ab-bl-container">
        {BELIEFS.map((b, i) => (
          <div key={b.heading} className={`ab-bl-block ab-bl-block-${i + 1}`}>
            <div className="ab-bl-block-heading">
              <span className="ab-bl-block-text">{b.heading}</span>
            </div>
            <span className="ab-bl-block-pill">{b.label}</span>
          </div>
        ))}

        <svg
          className="ab-bl-ornament"
          viewBox="0 0 1600 1000"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <circle cx="800" cy="500" r="400" stroke="currentColor" strokeWidth="0.5" opacity="0.1" />
          <circle cx="800" cy="500" r="300" stroke="currentColor" strokeWidth="0.5" opacity="0.06" />
        </svg>
      </div>
    </section>
  );
}
