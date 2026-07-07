"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const IMAGES = [
  { src: "/micro-generated/dual-strength-room.png", alt: "MICRO controlled strength room detail" },
  { src: "/micro-generated/dual-sensory-material.png", alt: "MICRO sensory material detail" },
] as const;

export default function DualImageBlock() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const leftImg = section.querySelector<HTMLElement>(".ad-img-left");
    if (!leftImg) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        leftImg,
        { yPercent: 15 },
        {
          yPercent: -15,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="assets-duo">
      <div className="ad-container is-portrait-6">
        <div className="ad-block ad-block-1">
          <Image
            src={IMAGES[0].src}
            alt={IMAGES[0].alt}
            fill
            sizes="(max-width: 600px) 40vw, 33vw"
            loading="eager"
            className="ad-img-left object-cover will-change-transform"
          />
        </div>
        <div className="ad-block ad-block-2">
          <Image
            src={IMAGES[1].src}
            alt={IMAGES[1].alt}
            fill
            sizes="(max-width: 600px) 60vw, 50vw"
            loading="eager"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
