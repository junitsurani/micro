"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function CollectionHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const heading = headingRef.current;
    if (!heading) return;

    gsap.fromTo(
      heading,
      { yPercent: 40, autoAlpha: 0 },
      {
        yPercent: 0,
        autoAlpha: 1,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: heading,
          start: "top 90%",
        },
      }
    );
  }, []);

  return (
    <section ref={sectionRef} className="co-hero">
      <div className="co-hero-grid">
        <h1 ref={headingRef} className="co-hero-heading">
          Microformer strength, sensory recovery, and founding access, built
          around the way you regulate.
        </h1>
      </div>
    </section>
  );
}
