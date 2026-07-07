"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import TransitionLink from "@/components/ui/TransitionLink";

gsap.registerPlugin(ScrollTrigger);

const RITUAL_IMAGE_VERSION = "20260707";

const RITUALS = [
  { name: "Movement", label: "Controlled strength", image: "/images/ritual-index/movement.png" },
  { name: "Recovery", label: "Restoration", image: "/images/ritual-index/recovery.png" },
  { name: "Nutrition", label: "Ritual", image: "/images/ritual-index/nutrition.png" },
  { name: "Sound", label: "Resonance", image: "/images/ritual-index/sound.png" },
  { name: "Scent", label: "Signal", image: "/images/ritual-index/scent.png" },
  { name: "Community", label: "Belonging", image: "/images/ritual-index/community.png" },
] as const;

function LinkArrow() {
  return (
    <svg
      viewBox="0 0 14 11"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="arrow-svg"
    >
      <path d="M0.600006 0V6H13.1" stroke="currentColor" strokeWidth="1.2" />
      <rect
        x="9.18887"
        y="2.2251"
        width="5.56065"
        height="5.56065"
        transform="rotate(45 9.18887 2.2251)"
        stroke="currentColor"
        strokeWidth="1.2"
      />
    </svg>
  );
}

function VisitArrow() {
  return (
    <svg
      viewBox="0 0 15 11"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="fp-arrow-svg"
    >
      <path
        d="M1.17969 0V5.52832H11.9766L9.18457 2.8623L9.12012 2.80176L9.18066 2.73633L9.83301 2.0293L9.89453 1.96191L9.96094 2.02441L14.1523 6.02539L14.2197 6.08984L14.1523 6.15527L9.96094 10.1553L9.89453 10.2178L9.83301 10.1504L9.18066 9.44336L9.12012 9.37793L9.18457 9.31738L11.9766 6.65234H0V0H1.17969Z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function ProjectGallery() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        section.querySelectorAll(".fp-content.fp-animate"),
        { autoAlpha: 0, y: 30 },
        {
          autoAlpha: 1,
          y: 0,
          stagger: 0.06,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: section, start: "top 80%" },
        },
      );

      gsap.fromTo(
        section.querySelectorAll(".fp-reveal-line"),
        { yPercent: 100 },
        {
          yPercent: 0,
          stagger: 0.04,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: section, start: "top 80%" },
        },
      );

      gsap.fromTo(
        section.querySelectorAll(".fp-project"),
        { autoAlpha: 0, y: 40 },
        {
          autoAlpha: 1,
          y: 0,
          stagger: 0.08,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: { trigger: section.querySelector(".fp-projects"), start: "top 85%" },
        },
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="featured-projects">
      <div className="fp-container">
        <div className="fp-base-title fp-animate">
          <h2 className="fp-base-heading">
            <span className="fp-reveal-mask">
              <span className="fp-reveal-line">Ritual Index</span>
            </span>
          </h2>
        </div>

        <div className="fp-content fp-animate">
          <p className="fp-text">
            Physical. Emotional. Mental.
            <br />
            Internal, before external.
          </p>
          <TransitionLink href="/access" className="fp-link">
            <span className="fp-link-copy">
              <span>Micro is a space for controlled activation.</span>
              <span>Where strength is built through precision, not force.</span>
              <span>Where the body regulates, stabilises, and returns.</span>
            </span>
            <LinkArrow />
          </TransitionLink>
        </div>

        <div className="fp-projects">
          {RITUALS.map((ritual, i) => (
            <TransitionLink
              key={ritual.name}
              href="/access"
              className="fp-project"
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div
                className="fp-image"
                style={{ opacity: hoveredIndex === i ? 1 : undefined }}
              >
                <Image
                  src={`${ritual.image}?v=${RITUAL_IMAGE_VERSION}`}
                  alt={ritual.name}
                  fill
                  sizes="23.6rem"
                />
              </div>

              <span className="fp-proj-title">{ritual.name}</span>

              <div className="fp-products">
                <span className="fp-product">{ritual.label}</span>
              </div>

              <VisitArrow />
            </TransitionLink>
          ))}
        </div>
      </div>
    </section>
  );
}
