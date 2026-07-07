"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePageTransition } from "./TransitionProvider";
import { useLenis } from "./LenisProvider";

gsap.registerPlugin(ScrollTrigger);

export default function PageWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { registerWrapper, shouldAnimate, markEnterDone } = usePageTransition();
  const { scrollTo, resize } = useLenis();

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    registerWrapper(el);
    return () => registerWrapper(null);
  }, [registerWrapper]);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    if (!shouldAnimate.current) {
      gsap.set(el, { autoAlpha: 1 });
      return;
    }

    scrollTo(0, { immediate: true });

    // If a hero morph overlay is present (visit-to-visit), skip the
    // cinematic slide-up and just make the wrapper visible immediately.
    // The morph animation is handled by useServicePageAnimations.
    if (typeof window !== "undefined" && window.__morphOverlay) {
      gsap.set(el, { autoAlpha: 1, clearProps: "transform" });
      void document.documentElement.scrollHeight;
      ScrollTrigger.refresh();
      resize();
      markEnterDone();
      return undefined;
    }

    const isMobile =
      typeof window !== "undefined" &&
      window.matchMedia("(max-width: 600px)").matches;

    gsap.set(el, {
      autoAlpha: 1,
      yPercent: 100,
      scale: isMobile ? 0.9 : 0.8,
      rotation: 0.01,
    });

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.set(el, { clearProps: "transform,opacity,visibility,willChange" });
        // Force reflow so ScrollTrigger and Lenis measure the real layout
        void document.documentElement.scrollHeight;
        ScrollTrigger.refresh();
        resize();
        markEnterDone();
      },
    });

    tl.to(el, {
      yPercent: 0,
      duration: 1,
      ease: "power3.inOut",
    }, 0);

    tl.to(el, {
      scale: 1,
      rotation: 0,
      duration: 1,
      delay: 0.3,
      ease: "power3.inOut",
    }, 0);

    return () => { tl.kill(); };
  }, [shouldAnimate, markEnterDone, scrollTo, resize]);

  return (
    <div
      ref={wrapperRef}
      data-page-wrapper=""
      style={{
        position: "relative",
        zIndex: 1,
        willChange: shouldAnimate.current ? "transform" : "auto",
        transformOrigin: "center top",
        background: "var(--color-fg-cream, #f5f1eb)",
        visibility: shouldAnimate.current ? "hidden" : "visible",
      }}
    >
      {children}
    </div>
  );
}
