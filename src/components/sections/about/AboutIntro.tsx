"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function AboutIntro() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const lines = section.querySelectorAll(".ab-intro-line");

    const ctx = gsap.context(() => {
      gsap.fromTo(
        lines,
        { yPercent: 100 },
        {
          yPercent: 0,
          stagger: 0.04,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: section, start: "top 80%" },
        },
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="ab-intro">
      <div className="ab-intro-container">
        <div className="ab-intro-col ab-intro-col-text">
          <h2 className="ab-intro-label">About Micro</h2>
          <p className="ab-intro-heading">
            <span className="ab-intro-mask">
              <span className="ab-intro-line">
                A sensory-led strength space, intentionally designed.
              </span>
            </span>
          </p>
          <p className="ab-intro-subline">
            Precision over intensity. Adaptation over exhaustion. Culture over noise.
          </p>

          <div className="ab-intro-content">
            <p className="ab-intro-text">
              The Lagree Microformer sits at the centre, with recovery, nutrition,
              sound, scent and community held as one practice. The room is built to
              settle the nervous system before the body moves.
            </p>
          </div>
        </div>

        <div className="ab-intro-col ab-intro-col-asset">
          <div className="ab-intro-asset">
            <Image
              src="/images/variants/experience-intro-activation.png"
              alt="Abstract warm linework suggesting controlled activation"
              fill
              sizes="(max-width: 600px) 100vw, 50vw"
              loading="eager"
              className="ab-intro-img"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
