"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const FOUNDERS = [
  { name: "MICRO by The Fix", role: "Chelsea, SW3" },
];

export default function AboutFounders() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const cards = section.querySelectorAll<HTMLElement>(".ab-fd-card");

    const ctx = gsap.context(() => {
      cards.forEach((card) => {
        gsap.fromTo(
          card,
          { autoAlpha: 0, y: 40 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: { trigger: card, start: "top 85%" },
          },
        );
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="ab-founders">
      <div className="ab-fd-container">
        <h2 className="ab-fd-title">Our Story</h2>

        <p className="ab-fd-text">
          MICRO is built for people seeking an elevated, intentional approach to
          strength, nervous system regulation, longevity, and transformation from
          within. The first space opens in Chelsea, with a wider ecosystem for
          recovery, community, bookings, and digital member journeys to follow.
        </p>

        <div className="ab-fd-blocks">
          {FOUNDERS.map((f) => (
            <div key={f.name} className="ab-fd-card">
              <div className="ab-fd-avatar">
                <Image
                  src="/micro-generated/about-story-threshold.png"
                  alt="Micro visual asset"
                  fill
                  sizes="(max-width: 600px) 100vw, 50vw"
                  loading="eager"
                  className="ab-fd-img"
                />
              </div>
              <h4 className="ab-fd-name">{f.name}</h4>
              <p className="ab-fd-role">{f.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
