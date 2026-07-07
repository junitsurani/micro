"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Category = "Movement" | "Recovery" | "Nutrition" | "Community";

interface Service {
  name: string;
  slug: string;
  category: Category;
  premium: boolean;
  image: string;
}

const SERVICES: Service[] = [
  { name: "Lagree Microformer", slug: "lagree-microformer", category: "Movement", premium: true, image: "/micro-generated/service-lagree-microformer.png" },
  { name: "Controlled strength", slug: "controlled-strength", category: "Movement", premium: true, image: "/micro-generated/service-regulation-rituals.png" },
  { name: "Circle 001", slug: "circle-001", category: "Movement", premium: false, image: "/micro-generated/service-founding-access.png" },
  { name: "Precision", slug: "precision", category: "Movement", premium: false, image: "/micro-generated/service-low-impact-strength.png" },
  { name: "Restoration", slug: "restoration", category: "Recovery", premium: false, image: "/micro-generated/service-sensory-recovery.png" },
  { name: "Sound", slug: "sound", category: "Recovery", premium: false, image: "/micro-generated/service-sound-breathwork.png" },
  { name: "Nutrition", slug: "nutrition", category: "Nutrition", premium: false, image: "/micro-generated/service-nourishment-rituals.png" },
  { name: "Recovery", slug: "recovery", category: "Recovery", premium: false, image: "/micro-generated/service-infrared-recovery.png" },
  { name: "Microformer Foundations", slug: "microformer-foundations", category: "Recovery", premium: true, image: "/micro-generated/service-microformer-foundations.png" },
  { name: "Microformer", slug: "controlled-activation", category: "Recovery", premium: true, image: "/micro-generated/service-controlled-activation.png" },
  { name: "Mobility Reset", slug: "mobility-reset", category: "Recovery", premium: false, image: "/micro-generated/service-mobility-reset.png" },
  { name: "Recovery Flow", slug: "recovery-flow", category: "Recovery", premium: false, image: "/micro-generated/service-recovery-flow.png" },
  { name: "Community Sessions", slug: "community-sessions", category: "Recovery", premium: false, image: "/micro-generated/service-community-sessions.png" },
  { name: "Private Onboarding", slug: "private-onboarding", category: "Recovery", premium: false, image: "/micro-generated/service-private-onboarding.png" },
  { name: "Digital Membership", slug: "digital-membership", category: "Community", premium: true, image: "/micro-generated/service-digital-membership.png" },
  { name: "Founding Circle", slug: "founding-circle", category: "Community", premium: true, image: "/micro-generated/service-founding-circle.png" },
  { name: "Studio Events", slug: "studio-events", category: "Community", premium: false, image: "/micro-generated/service-studio-events.png" },
  { name: "Nervous System Reset", slug: "nervous-system-reset", category: "Community", premium: false, image: "/micro-generated/service-nervous-system-reset.png" },
  { name: "The Full Micro Method", slug: "full-micro-method", category: "Community", premium: true, image: "/micro-generated/service-full-micro-method.png" },
  { name: "Orientation", slug: "orientation", category: "Community", premium: false, image: "/micro-generated/service-orientation.png" },
  { name: "Recovery Protocol", slug: "recovery-protocol", category: "Recovery", premium: false, image: "/micro-generated/service-recovery-protocol.png" },
  { name: "Member Care", slug: "member-care", category: "Community", premium: false, image: "/micro-generated/service-member-care.png" },
];

const CATEGORIES: Category[] = ["Movement", "Recovery", "Nutrition", "Community"];

const CATEGORY_COPY: Record<Category, string> = {
  Movement: "Strength through precision, not force. Structure beneath the surface.",
  Recovery: "Recovery, sound and scent composed to settle the nervous system.",
  Nutrition: "Nutrition as part of the practice, not an afterthought.",
  Community: "Membership pathways, private onboarding, and community experiences for Circle 001.",
};

export default function ServiceCatalog() {
  const [active, setActive] = useState<Category>("Movement");
  const gridRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  const filtered = SERVICES.filter((p) => p.category === active);

  const animateCards = useCallback(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const items = grid.querySelectorAll(".fc-item");
    gsap.fromTo(
      items,
      { autoAlpha: 0, y: 30 },
      { autoAlpha: 1, y: 0, stagger: 0.06, duration: 0.5, ease: "power3.out" }
    );
  }, []);

  useEffect(() => {
    animateCards();
  }, [active, animateCards]);

  useEffect(() => {
    const title = titleRef.current;
    if (!title) return;
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
  }, []);

  return (
    <section className="fc-section">
      <div className="fc-wrap">
        <div className="fc-label-row">
          <span className="section-label">The Micro method</span>
          <span className="section-rule" />
        </div>

        <h2 ref={titleRef} className="fc-heading">The Micro method</h2>

        <p className="fc-description">{CATEGORY_COPY[active]}</p>

        <nav className="fc-nav">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActive(cat)}
              className={`fc-nav-btn ${active === cat ? "is-active" : ""}`}
            >
              {cat}
            </button>
          ))}
        </nav>

        <div ref={gridRef} className="fc-grid">
          {filtered.map((service) => (
            <Link
              key={service.slug}
              href="/access"
              className="fc-item"
            >
              <div className="fc-item-asset">
                <Image
                  src={service.image}
                  alt={service.name}
                  fill
                  sizes="(max-width: 600px) 60vw, 50vw"
                  loading="eager"
                  className="fc-item-img"
                />
              </div>
              <div className="fc-item-info">
                <h3 className="fc-item-name">{service.name}</h3>
                {service.premium && <span className="fc-badge">Featured</span>}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
