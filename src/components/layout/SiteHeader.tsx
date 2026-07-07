"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import TransitionLink from "@/components/ui/TransitionLink";
import MobileNav from "./MobileNav";
import { useLenis } from "./LenisProvider";

function Brandmark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 58.57 63.36" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M29.29,0C13.14,0,0,14.21,0,31.68s13.14,31.68,29.29,31.68,29.29-14.21,29.29-31.68S45.44,0,29.29,0ZM46.32,9.24c-1.17,4.17-16.71,6.78-23.35,7.71-7.05.99-9.48-4.71-9.74-6.29-.4-2.39,1.23-4.84,4.48-6.72,3.11-1.8,7.25-2.89,11.63-2.89,5.28,0,10.92,1.57,15.56,5.36,1.19.97,1.67,1.92,1.41,2.83ZM17.36,49.99v-.09c.09-5.29,2.51-8.7,6.99-9.86,5.4-1.41,14.43-3.89,22.39-6.08l2.63-.72c.41-.11.82-.17,1.21-.17,2.54,0,4.48,2.2,5.02,3.61,1.03,2.65.56,4.77-.68,7.75-3.63,8.79-11.35,15.42-20.15,17.32-6.12,1.32-11.81.03-15.6-3.54-1.94-1.82-1.91-3.56-1.82-8.22ZM52.71,30.69c-.95.35-1.98.59-2.81.79-.32.08-.62.15-.85.21l-22,6.01c-3.74,1.02-6.06.07-7.34-.9-1.73-1.32-2.35-3.2-2.35-4.4v-2.43c0-8.02,4.63-9.98,10.68-11.7,3.46-.99,6.61-1.82,9.66-2.62,1.86-.49,3.78-1,5.78-1.54,5.18-1.41,8.52-1.82,11.21,4.32,1.81,4.13,2.24,7.2,1.32,9.37-.57,1.34-1.68,2.31-3.3,2.91ZM15.83,24.24v24.62c.01,6.74-.65,7.17-1.72,7.31-.99.13-2.33-.45-3-1.06C.91,45.87-1.89,29.48,4.6,16.98c1.3-2.51,2.1-3.22,3.03-3.59.36-.14.72-.21,1.09-.21,1.97,0,3.91,1.88,4.81,3.49,2.23,4.01,2.32,5.22,2.3,7.56Z" fill="currentColor" />
    </svg>
  );
}

function BurgerSVG() {
  return (
    <svg viewBox="0 0 20 11" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[2rem] h-[1.1rem] absolute">
      <path d="M0 0.5H20" stroke="currentColor" strokeWidth="1" />
      <path d="M0 5.5H20" stroke="currentColor" strokeWidth="1" />
      <path d="M0 10.5H20" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

function CloseSVG() {
  return (
    <svg viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[1.3rem] h-[1.3rem] absolute">
      <path d="M0.353516 11.6673L11.6672 0.353589" stroke="currentColor" strokeWidth="1" />
      <path d="M0.353516 0.353577L11.6672 11.6673" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

function ArrowSVG() {
  return (
    <svg viewBox="0 0 11 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[1.1rem] h-[1.2rem]">
      <path d="M4.96229 11.711V1.57966L0.620286 5.92166L0 5.37581L5.37581 0L10.7516 5.37581L10.1313 5.92166L5.78933 1.57966V11.711H4.96229Z" fill="currentColor" strokeWidth="1" />
    </svg>
  );
}

const PAGE_TITLES: Record<string, string> = {
  "/": "Studio",
  "/experience": "Experience",
  "/access": "Access",
  "/news": "News",
  "/showroom": "Showroom",
};

export default function SiteHeader() {
  const pathname = usePathname();
  const { scrollTo } = useLenis();
  const [menuOpen, setMenuOpen] = useState(false);

  const headerRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLAnchorElement | null>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const titleInnerRef = useRef<HTMLDivElement>(null);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const arrowRef = useRef<HTMLButtonElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  const enteredRef = useRef(false);
  const menuOpenRef = useRef(false);
  const headerCollapsed = useRef(false);
  const titleMarqueeRef = useRef<gsap.core.Tween | null>(null);

  menuOpenRef.current = menuOpen;

  const pageTitle = PAGE_TITLES[pathname] ?? "Micro";

  const collapseHeader = useCallback(() => {
    if (headerCollapsed.current) return;
    headerCollapsed.current = true;

    const header = headerRef.current;
    const title = titleRef.current;
    const logo = logoRef.current;
    const burger = burgerRef.current;
    if (!header || !title || !logo || !burger) return;

    const tl = gsap.timeline({ defaults: { duration: 0.6, ease: "power3.inOut" } });
    tl.to(header, { width: "5rem", autoRound: false }, 0);
    tl.to(title, { yPercent: -100 }, 0);
    tl.to(logo, { autoAlpha: 0, duration: 0.3 }, 0);
    tl.to(logo, { x: "10rem" }, 0);
    tl.to(burger, { autoAlpha: 0, duration: 0.3 }, 0);
    tl.to(burger, { x: "-10rem" }, 0);
  }, []);

  const restoreHeader = useCallback(() => {
    if (!headerCollapsed.current) return;
    headerCollapsed.current = false;

    const header = headerRef.current;
    const title = titleRef.current;
    const logo = logoRef.current;
    const burger = burgerRef.current;
    const arrow = arrowRef.current;
    const close = closeRef.current;
    if (!header || !title || !logo || !burger) return;

    const tl = gsap.timeline({ defaults: { duration: 0.6, ease: "power3.inOut" } });
    tl.to(header, { width: "27.6rem", autoRound: false }, 0);
    tl.to(title, { yPercent: 0 }, 0);
    tl.to(logo, { x: 0, autoAlpha: 1 }, 0);
    tl.to([arrow, close].filter(Boolean), { yPercent: 100 }, 0);
    tl.to(burger, { x: 0, autoAlpha: 1 }, 0);
  }, []);

  const showClose = useCallback(() => {
    const close = closeRef.current;
    if (!close) return;
    gsap.timeline({ defaults: { duration: 0.6, ease: "power3.inOut" } })
      .fromTo(close, { autoAlpha: 1, yPercent: 100 }, { yPercent: 0 });
  }, []);

  const handleScrollToTop = useCallback(() => {
    scrollTo(0);
  }, [scrollTo]);

  // Entrance animation
  useEffect(() => {
    const header = headerRef.current;
    const bg = bgRef.current;
    const logo = logoRef.current;
    const title = titleRef.current;
    const burger = burgerRef.current;

    if (!header || !bg || !logo || !title || !burger) return;

    const burgerPaths = burger.querySelectorAll("path");
    gsap.set(burgerPaths, { strokeDasharray: "20px, 0.1px", strokeDashoffset: 20 });

    const tl = gsap.timeline({
      defaults: { duration: 1, ease: "power3.inOut" },
    });

    tl.fromTo(header, { yPercent: 200 }, { yPercent: 0 }, 0);
    tl.fromTo(header, { width: "5rem" }, { width: "27.6rem", autoRound: false }, 0.3);
    tl.call(() => { enteredRef.current = true; }, [], 1);
    tl.fromTo(logo, { x: "11.3rem" }, { x: 0 }, 1);
    tl.fromTo(title, { yPercent: 100 }, { yPercent: 0 }, 1);
    tl.to(burgerPaths, { strokeDashoffset: 0, stagger: 0.05, duration: 0.8, ease: "power3.out" }, 1);
  }, []);

  // Menu open/close
  useEffect(() => {
    if (!enteredRef.current) return;
    if (menuOpen) {
      headerCollapsed.current = false;
      collapseHeader();
      headerCollapsed.current = true;
      showClose();
    } else {
      headerCollapsed.current = true;
      restoreHeader();
      headerCollapsed.current = false;
    }
  }, [menuOpen, collapseHeader, restoreHeader, showClose]);

  // Close menu on scroll
  useEffect(() => {
    const onScrollIntent = () => {
      if (!enteredRef.current) return;
      if (menuOpenRef.current) {
        setMenuOpen(false);
      }
    };

    window.addEventListener("wheel", onScrollIntent, { passive: true });
    window.addEventListener("touchmove", onScrollIntent, { passive: true });

    return () => {
      window.removeEventListener("wheel", onScrollIntent);
      window.removeEventListener("touchmove", onScrollIntent);
    };
  }, []);

  // Title marquee
  useEffect(() => {
    const title = titleRef.current;
    const inner = titleInnerRef.current;
    if (!title || !inner) return;
    titleMarqueeRef.current?.kill();
    gsap.set(inner, { x: 0 });
    const containerW = title.clientWidth;
    const textW = inner.scrollWidth;
    if (textW > containerW) {
      const overflow = containerW - textW;
      titleMarqueeRef.current = gsap.to(inner, {
        x: overflow, duration: Math.abs(overflow) / 15, ease: "linear", yoyo: true, repeat: -1,
      });
    }
    return () => { titleMarqueeRef.current?.kill(); };
  }, [pageTitle]);

  const handleBurgerClick = useCallback(() => setMenuOpen(true), []);
  const handleCloseClick = useCallback(() => setMenuOpen(false), []);

  return (
    <>
      <header ref={headerRef} className="site-header" role="banner">
        <div ref={bgRef} className="site-header-bg" />
        <TransitionLink ref={logoRef} href="/" aria-label="Studio" className="site-header-logo">
          <Brandmark className="w-[2.4rem] h-[2.4rem]" />
        </TransitionLink>
        <div ref={titleRef} className="site-header-title" aria-hidden="true">
          <div ref={titleInnerRef} className="site-header-title-inner">{pageTitle}</div>
        </div>
        <button ref={burgerRef} onClick={handleBurgerClick} aria-label="Menu" className="site-header-burger">
          <BurgerSVG />
        </button>
        <button ref={closeRef} onClick={handleCloseClick} aria-label="Close" className="site-header-close">
          <CloseSVG />
        </button>
        <button ref={arrowRef} onClick={handleScrollToTop} aria-label="Scroll to top" className="site-header-arrow">
          <ArrowSVG />
        </button>
      </header>
      <MobileNav isOpen={menuOpen} onClose={handleCloseClick} />
    </>
  );
}
