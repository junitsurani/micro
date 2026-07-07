"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function AboutManifesto() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const lines = section.querySelectorAll(".ab-mf-line");

    const ctx = gsap.context(() => {
      gsap.fromTo(
        lines,
        { yPercent: 100 },
        {
          yPercent: 0,
          stagger: 0.04,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
          },
        },
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="ab-manifesto">
      <h2 className="ab-mf-title">Manifesto</h2>

      <div className="ab-mf-container">
        <div className="ab-mf-heading">
          <span className="ab-mf-mask">
            <span className="ab-mf-line">
              More than movement.
            </span>
          </span>
        </div>

        <p className="ab-mf-text">
          Art, music, design and community are part of the practice, not
          adornments to it. We believe in joie de vivre as the ultimate form of
          longevity. Not only alive, but living.
        </p>

        <p className="ab-mf-standout">
          The space is not decoration. It is the method.
        </p>
      </div>
    </section>
  );
}
