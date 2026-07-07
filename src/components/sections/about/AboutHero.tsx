"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";

export default function AboutHero() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const lines = section.querySelectorAll(".ab-hero-line");
    const title = section.querySelector(".ab-hero-title");
    const asset = section.querySelector(".ab-hero-asset");

    const ctx = gsap.context(() => {
      if (title) {
        gsap.fromTo(title, { autoAlpha: 0 }, { autoAlpha: 1, duration: 1, delay: 0.3 });
      }
      gsap.fromTo(
        lines,
        { yPercent: 100 },
        { yPercent: 0, stagger: 0.05, duration: 1, ease: "power3.out", delay: 0.5 },
      );
      if (asset) {
        gsap.fromTo(
          asset,
          { autoAlpha: 0, y: 40 },
          { autoAlpha: 1, y: 0, duration: 1.2, ease: "power3.out", delay: 0.8 },
        );
      }
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="ab-hero">
      <div className="ab-hero-container">
        <h2 className="ab-hero-title">The Experience</h2>
        <p className="ab-hero-heading">
          <span className="ab-hero-mask">
            <span className="ab-hero-line">The room begins</span>
          </span>
          <span className="ab-hero-mask">
            <span className="ab-hero-line">before you do.</span>
          </span>
        </p>
        <p className="ab-hero-subline">Experienced, not observed.</p>
      </div>

      <div className="ab-hero-asset">
        <Image
          src="/images/variants/experience-hero-abstract.png"
          alt="Abstract warm atmospheric light field"
          fill
          priority
          sizes="100vw"
          className="ab-hero-img"
        />
      </div>

      <svg
        className="ab-hero-ornament"
        viewBox="0 0 1239 1617"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <circle cx="619.5" cy="808.5" r="500" stroke="currentColor" strokeWidth="0.5" />
        <circle cx="619.5" cy="808.5" r="350" stroke="currentColor" strokeWidth="0.5" />
        <line x1="0" y1="808.5" x2="1239" y2="808.5" stroke="currentColor" strokeWidth="0.5" />
        <line x1="619.5" y1="0" x2="619.5" y2="1617" stroke="currentColor" strokeWidth="0.5" />
      </svg>
    </section>
  );
}
