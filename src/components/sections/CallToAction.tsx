"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function CallToAction() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        section.querySelectorAll(".cta-animate"),
        { autoAlpha: 0, y: 40 },
        {
          autoAlpha: 1,
          y: 0,
          stagger: 0.1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: section, start: "top 80%" },
        },
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="banner-cta">
      <div className="bc-container">
        <div className="bc-inner">
          <div className="bc-left">
            <span className="bc-label cta-animate">Founding access</span>
            <h2 className="bc-heading cta-animate">
              Be part of the first circle, before the doors open.
            </h2>
          </div>

          <div className="bc-right cta-animate">
            <p className="bc-text">
              Sixty founding memberships. By invitation only.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
