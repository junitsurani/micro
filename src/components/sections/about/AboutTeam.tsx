"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import gsap from "gsap";

const TEAM = [
  { name: "The Micro Team", role: "Studio Guides" },
];

export default function AboutTeam() {
  const blocksRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const updateArrows = useCallback(() => {
    const el = blocksRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 5);
    setCanNext(el.scrollLeft < el.scrollWidth - el.clientWidth - 5);
  }, []);

  const scroll = useCallback(
    (dir: number) => {
      const el = blocksRef.current;
      if (!el) return;
      const amount = el.clientWidth * 0.6;
      gsap.to(el, {
        scrollLeft: el.scrollLeft + amount * dir,
        duration: 0.6,
        ease: "power3.out",
        onUpdate: updateArrows,
      });
    },
    [updateArrows],
  );

  useEffect(() => {
    const el = blocksRef.current;
    if (!el) return;

    const onScroll = () => updateArrows();

    const onDown = (e: PointerEvent) => {
      dragging.current = true;
      startX.current = e.pageX - el.offsetLeft;
      scrollLeft.current = el.scrollLeft;
      el.style.cursor = "grabbing";
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging.current) return;
      e.preventDefault();
      const x = e.pageX - el.offsetLeft;
      el.scrollLeft = scrollLeft.current - (x - startX.current);
    };
    const onUp = () => {
      dragging.current = false;
      el.style.cursor = "";
      updateArrows();
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    el.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);

    updateArrows();

    return () => {
      el.removeEventListener("scroll", onScroll);
      el.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [updateArrows]);

  return (
    <section className="ab-team">
      <div className="ab-team-container">
        <div className="ab-team-head">
          <h2 className="ab-team-label">Micro</h2>
          <h3 className="ab-team-heading">Our Team</h3>

          <div className="ab-team-arrows">
            <button
              className="ab-team-arrow"
              onClick={() => scroll(-1)}
              disabled={!canPrev}
              aria-label="Previous"
            >
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <circle cx="24" cy="24" r="23.5" stroke="currentColor" opacity="0.2" />
                <path d="M28 16L20 24L28 32" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </button>
            <button
              className="ab-team-arrow"
              onClick={() => scroll(1)}
              disabled={!canNext}
              aria-label="Next"
            >
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <circle cx="24" cy="24" r="23.5" stroke="currentColor" opacity="0.2" />
                <path d="M20 16L28 24L20 32" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </button>
          </div>
        </div>

        <div ref={blocksRef} className="ab-team-blocks">
          {TEAM.map((m, i) => (
            <div key={m.name} className={`ab-team-card ${i % 2 === 0 ? "is-odd" : "is-even"}`}>
              <div className="ab-team-avatar" />
              <h4 className="ab-team-name">{m.name}</h4>
              <p className="ab-team-role">{m.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
