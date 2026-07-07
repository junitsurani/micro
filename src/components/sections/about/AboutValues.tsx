"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const VALUES = [
  {
    title: "Intentional",
    body: "Chosen with reason. A discipline, not an aesthetic.",
  },
  {
    title: "Precise",
    body: "The science real, the method exact. Rigour without pressure.",
  },
  {
    title: "Cultured",
    body: "Art, music and connection, never decoration.",
  },
  {
    title: "Collaborative",
    body: "The best in their field, brought into the room.",
  },
];

export default function AboutValues() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const items = section.querySelectorAll<HTMLElement>(".ab-val-block");

    const ctx = gsap.context(() => {
      items.forEach((item) => {
        gsap.fromTo(
          item,
          { autoAlpha: 0, y: 40 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: { trigger: item, start: "top 85%" },
          },
        );
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="ab-values">
      <div className="ab-val-container">
        <h2 className="ab-val-title">Our values</h2>

        <p className="ab-val-heading">
          A discipline, not an aesthetic. Every part of the MICRO experience is
          chosen with reason.
        </p>

        <div className="ab-val-blocks">
          {VALUES.map((v) => (
            <div key={v.title} className="ab-val-block">
              <h3 className="ab-val-block-title">{v.title}</h3>
              <div className="ab-val-block-richtext">
                <p>{v.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
