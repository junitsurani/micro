"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function AccessAnimations() {
  useEffect(() => {
    const ctx = gsap.context(() => {
      const sections = document.querySelectorAll<HTMLElement>(
        ".access-capture, .access-location, .access-private, .access-faq"
      );

      sections.forEach((section) => {
        const targets = section.querySelectorAll(
          "h1, h2:not(#access-faq-title), .access-kicker, .access-capture-panel, .access-detail-block, .access-field, .access-submit, .access-map, .access-private-copy p, .access-private-rule, .access-faq-kicker, .access-faq-list"
        );
        const revealLines = section.querySelectorAll<HTMLElement>(".access-reveal-line");

        if (targets.length > 0) {
          gsap.fromTo(
            targets,
            { autoAlpha: 0, y: 30 },
            {
              autoAlpha: 1,
              y: 0,
              stagger: 0.08,
              duration: 0.8,
              ease: "power3.out",
              scrollTrigger: { trigger: section, start: "top 80%" },
            },
          );
        }

        if (revealLines.length > 0) {
          gsap.fromTo(
            revealLines,
            { yPercent: 100 },
            {
              yPercent: 0,
              stagger: 0.04,
              duration: 0.8,
              ease: "power3.out",
              scrollTrigger: { trigger: section, start: "top 80%" },
            },
          );
        }
      });
    });

    return () => ctx.revert();
  }, []);

  return null;
}
