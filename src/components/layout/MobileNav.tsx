"use client";

import { useCallback, useEffect, useRef } from "react";
import gsap from "gsap";
import TransitionLink from "@/components/ui/TransitionLink";
import { MINDBODY_BOOKING_LABEL, MINDBODY_BOOKING_URL } from "@/lib/constants";
const SUB_LINKS = [
  { href: "/experience", label: "The Experience", external: false },
  { href: "/access", label: "Chelsea, SW3", external: false },
  ...(MINDBODY_BOOKING_URL
    ? [{ href: MINDBODY_BOOKING_URL, label: MINDBODY_BOOKING_LABEL, external: true }]
    : []),
  { href: "mailto:hello@microbythefix.com", label: "hello@microbythefix.com", external: true },
];

interface MenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileNav({ isOpen, onClose }: MenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const subRef = useRef<HTMLSpanElement>(null);
  const subListRef = useRef<HTMLUListElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const prevOpen = useRef(false);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (isOpen) document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleKeyDown]);

  useEffect(() => {
    const menu = menuRef.current;
    const bg = bgRef.current;
    const sub = subRef.current;
    const cta = ctaRef.current;
    if (!menu || !bg) return;

    if (isOpen && !prevOpen.current) {
      const allLinks = menu.querySelectorAll(".link");

      gsap.set(menu, { autoAlpha: 1, pointerEvents: "auto" });
      gsap.fromTo(allLinks, { yPercent: 150 }, { yPercent: 0, stagger: 0.02, duration: 0.8, ease: "power3.inOut" });
      gsap.fromTo([sub, subListRef.current], { autoAlpha: 0 }, { delay: 0.3, autoAlpha: 1, ease: "power3.inOut" });
      gsap.fromTo(cta, { autoAlpha: 0 }, { delay: 0.3, autoAlpha: 1, ease: "power3.inOut" });
      gsap.fromTo(bg, { scale: 0 }, { scale: 1, ease: "power3.inOut" });
    }

    if (!isOpen && prevOpen.current) {
      const allLinks = menu.querySelectorAll(".link");

      gsap.to(allLinks, { yPercent: 150, overwrite: true, ease: "power3.out" });
      gsap.to([sub, subListRef.current], { autoAlpha: 0, overwrite: true, ease: "power3.out" });
      gsap.to(cta, { autoAlpha: 0, overwrite: true, ease: "power3.out" });
      gsap.to(bg, {
        scale: 0,
        overwrite: true,
        ease: "power3.inOut",
        onComplete: () => {
          gsap.set(menu, { autoAlpha: 0, pointerEvents: "none" });
        },
      });
    }

    prevOpen.current = isOpen;
  }, [isOpen]);

  const handleCtaEnter = useCallback(() => {
    const cta = ctaRef.current;
    if (!cta) return;
    gsap.to(cta.querySelectorAll(".cta-line"), { yPercent: -100, duration: 1, ease: "power3.out" });
  }, []);

  const handleCtaLeave = useCallback(() => {
    const cta = ctaRef.current;
    if (!cta) return;
    gsap.to(cta.querySelectorAll(".cta-line"), { yPercent: 0, duration: 1, ease: "power3.out" });
  }, []);

  return (
    <div ref={menuRef} className="site-menu" role="dialog" aria-modal="true" aria-label="Navigation menu">
      <nav>

        <span ref={subRef} className="sub-heading">Details</span>
        <ul ref={subListRef} className="sub-links">
          {SUB_LINKS.map((link) => (
            <li key={link.href} className="sub-mask">
              {link.external ? (
                <a href={link.href} target="_blank" rel="noopener noreferrer" className="link sub-link">
                  {link.label}
                </a>
              ) : (
                <TransitionLink href={link.href} onClick={onClose} className="link sub-link">
                  {link.label}
                </TransitionLink>
              )}
            </li>
          ))}
        </ul>

        <TransitionLink
          ref={ctaRef}
          href="/access"
          className="menu-cta"
          data-track="mobile-nav-request-access"
          onClick={onClose}
          onMouseEnter={handleCtaEnter}
          onMouseLeave={handleCtaLeave}
        >
          <svg viewBox="0 0 14 11" fill="none" xmlns="http://www.w3.org/2000/svg" className="cta-arrow">
            <path d="M0.600006 0V6H13.1" stroke="currentColor" strokeWidth="1.2" />
            <rect x="9.18887" y="2.2251" width="5.56065" height="5.56065" transform="rotate(45 9.18887 2.2251)" stroke="currentColor" strokeWidth="1.2" />
          </svg>
          <div className="cta-label">
            <span className="cta-line" aria-hidden="true">Request access</span>
            <span className="cta-line">Request access</span>
          </div>
        </TransitionLink>
      </nav>

      <div ref={bgRef} className="site-menu-bg" style={{ transform: "scale(0)" }} />
    </div>
  );
}
