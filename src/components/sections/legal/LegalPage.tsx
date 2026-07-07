"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface LegalSection {
  heading: string;
  body: string[];
}

interface LegalPageProps {
  label: string;
  title: string;
  lastUpdated: string;
  sections: LegalSection[];
}

export default function LegalPage({ label, title, lastUpdated, sections }: LegalPageProps) {
  const heroRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    const lines = hero.querySelectorAll(".ct-heading-line");
    const ctx = gsap.context(() => {
      gsap.fromTo(
        lines,
        { yPercent: 100 },
        { yPercent: 0, stagger: 0.05, duration: 1, ease: "power3.out", delay: 0.3 },
      );
    }, hero);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const content = contentRef.current;
    if (!content) return;

    const blocks = content.querySelectorAll(".legal-block");
    const ctx = gsap.context(() => {
      blocks.forEach((block) => {
        gsap.fromTo(
          block,
          { autoAlpha: 0, y: 30 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: { trigger: block, start: "top 88%" },
          },
        );
      });
    }, content);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <section ref={heroRef} className="ct-heading">
        <p className="ct-heading-label">{label}</p>
        <h2 className="ct-heading-text">
          <span className="ct-heading-mask">
            <span className="ct-heading-line">{title}</span>
          </span>
        </h2>
        <p className="legal-updated">Last updated: {lastUpdated}</p>
      </section>

      <section ref={contentRef} className="legal-content">
        <div className="legal-container">
          {sections.map((section, i) => (
            <div key={i} className="legal-block">
              <h3 className="legal-heading">{section.heading}</h3>
              {section.body.map((paragraph, j) => (
                <p key={j} className="legal-text">{paragraph}</p>
              ))}
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
