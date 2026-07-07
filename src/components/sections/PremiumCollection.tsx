"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const PREMIUM_ITEMS: readonly { name: string; subtitle?: string; slug: string; image: string }[] = [
  {
    name: "Movement",
    subtitle: "Controlled strength",
    slug: "microformer-training",
    image: "/images/variants/ecosystem-movement-v1.png",
  },
  {
    name: "Recovery",
    subtitle: "Restoration",
    slug: "recovery-rituals",
    image: "/images/variants/ecosystem-recovery-v1.png",
  },
  {
    name: "Nutrition",
    subtitle: "Ritual",
    slug: "founding-memberships",
    image: "/images/variants/ecosystem-nutrition-v2.png",
  },
];

export default function PremiumCollection() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const title = titleRef.current;
    const track = trackRef.current;
    if (!title || !track) return;

    const cards = track.querySelectorAll(".pm-card");

    gsap.fromTo(
      title,
      { yPercent: 30, autoAlpha: 0 },
      {
        yPercent: 0,
        autoAlpha: 1,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: title, start: "top 85%" },
      }
    );

    gsap.fromTo(
      cards,
      { yPercent: 40, autoAlpha: 0 },
      {
        yPercent: 0,
        autoAlpha: 1,
        stagger: 0.12,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: track, start: "top 80%" },
      }
    );
  }, []);

  return (
    <section className="pm-section">
      <div className="pm-wrap">
        <div className="pm-label-row">
          <span className="section-label">Featured pathways</span>
          <span className="section-rule" />
        </div>

        <h2 ref={titleRef} className="pm-heading">
          The formats
        </h2>

        <p className="pm-description">
          Every modality chosen for its merit. Every programme led by the
          foremost in their field. Named to those who come closer.
        </p>

        <div ref={trackRef} className="pm-track">
          {PREMIUM_ITEMS.map((item) => (
            <Link
              key={item.slug}
              href="/access"
              className="pm-card"
            >
              <div className="pm-card-asset">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="(max-width: 600px) 90vw, 65vw"
                  loading="eager"
                  className={`pm-card-img pm-card-img-${item.slug}`}
                />
                <div className="pm-card-gradient" />
                <span className="pm-badge">Featured</span>
              </div>
              <h3 className="pm-card-name">
                {item.name}
                {item.subtitle && (
                  <span className="pm-card-sub"> ({item.subtitle})</span>
                )}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
