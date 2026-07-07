"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import TransitionLink from "@/components/ui/TransitionLink";

gsap.registerPlugin(ScrollTrigger);

function ArrowIcon() {
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

export default function ShowroomBanner() {
  const sectionRef = useRef<HTMLElement>(null);
  const borderRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const border = borderRef.current;
    const image = imageRef.current;
    if (!section || !border) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        border,
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            scrub: true,
            start: "top top",
            end: "bottom bottom",
          },
        }
      );

      if (image) {
        gsap.fromTo(
          image,
          { scale: 0.6, clipPath: "inset(0 round 1.6rem)" },
          {
            scale: 1,
            clipPath: "inset(0 round 0rem)",
            ease: "none",
            scrollTrigger: {
              trigger: section,
              scrub: true,
              start: "top bottom",
              end: "center center",
            },
          }
        );
      }

      gsap.fromTo(
        section.querySelectorAll(".sb-animate"),
        { autoAlpha: 0, y: 30 },
        {
          autoAlpha: 1,
          y: 0,
          stagger: 0.08,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: section.querySelector(".sb-content"), start: "top 80%" },
        },
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="banner-showroom">
      <div className="sb-base-title">
        <span className="sb-title">Chelsea, SW3</span>
        <TransitionLink href="/access" className="sb-base-button" data-track="showroom-join-waitlist">
          <ArrowIcon />
          <span className="btn-label">
            <span className="btn-line">Come closer</span>
            <span className="btn-line" aria-hidden="true">Come closer</span>
          </span>
        </TransitionLink>
      </div>

      <div className="sb-container">
        <div ref={borderRef} className="sb-border" />

        <div className="sb-content">
          <div className="sb-column">
            <h2 className="sb-base-heading sb-animate">The first space</h2>
            <p className="sb-text sb-animate">
              Opening in Chelsea. A space composed to do its own work before
              practice begins.
            </p>
          </div>
          <div className="sb-column">
            <address className="sb-address sb-animate">
              Movement · Recovery · Nutrition
              <br />
              Sound · Scent · Community
            </address>
          </div>
        </div>

        <div className="sb-background">
          <div ref={imageRef} className="sb-video">
            <Image
              src="/images/8ef3fc36-54b6-4b2a-aee0-759d79e2c44b.png"
              alt=""
              fill
              sizes="100vw"
              loading="eager"
              className="sb-video-img"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
