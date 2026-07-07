"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ProcessStep {
  name: string;
  premium: boolean;
}

interface ProcessGroup {
  title: string;
  items: ProcessStep[];
}

const BROCHURE_GROUPS: ProcessGroup[] = [
  {
    title: "Our Process",
    items: [
      { name: "Step 1: Request access", premium: false },
      { name: "Step 2: Circle 001 updates", premium: false },
      { name: "Step 3: Membership & booking details", premium: false },
      { name: "Step 4: Chelsea launch communications", premium: false },
      { name: "Step 5: Ground, ignite, restore", premium: false },
    ],
  },
  {
    title: "The Formats",
    items: [
      { name: "Lagree Microformer", premium: true },
      { name: "Movement", premium: true },
      { name: "Recovery", premium: false },
      { name: "Nutrition", premium: false },
      { name: "Sound", premium: false },
      { name: "Scent", premium: false },
      { name: "Community", premium: false },
      { name: "Restoration", premium: false },
      { name: "Member Care", premium: false },
      { name: "Recovery Protocol", premium: false },
    ],
  },
  {
    title: "Recovery",
    items: [
      { name: "Microformer Foundations", premium: true },
      { name: "Microformer", premium: true },
      { name: "Mobility Reset", premium: false },
      { name: "Recovery Flow", premium: false },
      { name: "Community Sessions", premium: false },
      { name: "Private Onboarding", premium: false },
    ],
  },
  {
    title: "Founding Memberships",
    items: [
      { name: "Digital Membership", premium: true },
      { name: "Founding Circle", premium: true },
      { name: "Studio Events", premium: false },
      { name: "Nervous System Reset", premium: false },
      { name: "The Full Micro Method", premium: true },
      { name: "Orientation", premium: false },
    ],
  },
];

export default function BrochureSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

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
    <section ref={sectionRef} className="br-section">
      <div className="br-wrap">
        <div className="br-label-row">
          <span className="section-label">How we work</span>
          <span className="section-rule" />
        </div>

        <h2 ref={titleRef} className="br-heading">Circle 001 & Method</h2>

        <div className="br-table-head">
          <span className="br-th">Category</span>
          <span className="br-th">Service</span>
        </div>

        {BROCHURE_GROUPS.map((group) => (
          <div key={group.title} className="br-group">
            <h3 className="br-group-title">{group.title}</h3>
            <ul className="br-list">
              {group.items.map((item) => (
                <li key={item.name} className="br-row">
                  <span className="br-row-name">
                    {item.name}
                    {item.premium && <span className="br-premium">Featured</span>}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
