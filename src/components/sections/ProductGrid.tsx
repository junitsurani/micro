"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import TransitionLink from "@/components/ui/TransitionLink";
import { SERVICE_CATEGORIES } from "@/lib/constants";

gsap.registerPlugin(ScrollTrigger);

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 14 11"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="arrow-svg"
    >
      <path
        d="M0.600006 0V6H13.1"
        stroke="currentColor"
        strokeWidth="1.2"
      />
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

export default function ProductGrid() {
  const blocksRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const blocks = blocksRef.current;
    if (!blocks) return;

    const cards = blocks.querySelectorAll<HTMLElement>(".pc-block");

    const section = blocks.closest("section");

    const ctx = gsap.context(() => {
      if (section) {
        gsap.fromTo(
          section.querySelectorAll(".pc-animate"),
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

      cards.forEach((card) => {
        gsap.fromTo(
          card,
          { yPercent: 30 },
          {
            yPercent: -30,
            ease: "none",
            scrollTrigger: {
              trigger: card,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      });
    }, blocks);

    return () => ctx.revert();
  }, []);

  return (
    <section className="product-collection">
      <div className="pc-container">
        <h2 className="pc-base-title pc-animate">The ecosystem</h2>

        <div className="pc-content pc-animate">
          <div className="pc-richtext">
            <p className="pc-richtext-lead">
              <span>Physical. Emotional. Mental.</span>
              <span>Internal, before external.</span>
            </p>
            <p className="pc-richtext-body">
              <span>Micro is a space for controlled activation.</span>
              <span>Where strength is built through precision, not force.</span>
              <span>Where the body regulates, stabilises, and returns.</span>
            </p>
          </div>

          <TransitionLink href="/access" className="base-btn is-waitlist" data-track="ecosystem-join-waitlist">
            <span className="btn-label">
              <span className="btn-line">Come closer</span>
              <span className="btn-line" aria-hidden="true">Come closer</span>
            </span>
          </TransitionLink>
        </div>

        <div ref={blocksRef} className="pc-blocks">
          {SERVICE_CATEGORIES.map((product, i) => (
            <TransitionLink
              key={product.title}
              href={product.href}
              className={`pc-block pc-block-${i + 1}`}
            >
              <h3 className="pc-title">{product.title}</h3>
              <Image
                src={product.image}
                alt={product.alt}
                fill
                sizes="(max-width: 600px) 50vw, (max-width: 1024px) 300px, (max-width: 1440px) 400px, 600px"
                className="product-image object-cover"
                loading="eager"
              />
            </TransitionLink>
          ))}
        </div>
      </div>
    </section>
  );
}
