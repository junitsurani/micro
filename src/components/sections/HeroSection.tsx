"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import TransitionLink from "@/components/ui/TransitionLink";

gsap.registerPlugin(ScrollTrigger);

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  const videoRef = useCallback((el: HTMLVideoElement | null) => {
    if (el) el.playbackRate = 0.5;
  }, []);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const ctx = gsap.context(() => {
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const heroShell = section.querySelector<HTMLElement>("[data-hero-shell]");
      const heroCopy = section.querySelectorAll<HTMLElement>(
        "[data-hero-title-line], [data-hero-subcopy]",
      );
      const heroCta = section.querySelector<HTMLElement>("[data-hero-cta]");

      if (!heroShell || reducedMotion) return;

      gsap.set(heroShell, { scale: 1 });
      gsap.set(heroCopy, {
        autoAlpha: 1,
        filter: "blur(0px)",
        yPercent: 0,
      });

      if (heroCta) {
        gsap.fromTo(
          heroCta,
          {
            "--hero-cta-line-scale": 0,
            autoAlpha: 0,
            y: 18,
          },
          {
            "--hero-cta-line-scale": 1,
            autoAlpha: 1,
            y: 0,
            duration: 0.9,
            delay: 0.8,
            ease: "power3.out",
          },
        );
      }

      const heroTimeline = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.12,
          fastScrollEnd: true,
          invalidateOnRefresh: true,
        },
      });

      heroTimeline
        .to(heroShell, { scale: 1, duration: 0.72 }, 0)
        .fromTo(
          section.querySelectorAll<HTMLElement>("[data-hero-gradient]"),
          { autoAlpha: 0.9, scale: 0.98 },
          { autoAlpha: 1, scale: 1.025, duration: 0.82 },
          0,
        )
        .fromTo(
          section.querySelectorAll<HTMLElement>("[data-hero-nav]"),
          { autoAlpha: 0.82, yPercent: 4 },
          { autoAlpha: 1, yPercent: 0, duration: 0.45 },
          0.08,
        )
        .fromTo(
          section.querySelectorAll<HTMLElement>("[data-hero-title-line]"),
          { autoAlpha: 1, filter: "blur(0px)", yPercent: 0 },
          { autoAlpha: 0.96, filter: "blur(0px)", yPercent: -4, duration: 0.42 },
          0.1,
        )
        .fromTo(
          section.querySelectorAll<HTMLElement>("[data-hero-subcopy]"),
          { autoAlpha: 1, letterSpacing: "0.48em", yPercent: 0 },
          { autoAlpha: 0.78, letterSpacing: "0.54em", yPercent: -10, duration: 0.34 },
          0.28,
        )
        .to(
          section.querySelectorAll<HTMLElement>("[data-hero-scroll-cue]"),
          { autoAlpha: 0, yPercent: 18, duration: 0.25 },
          0.72,
        )
        .to(
          section.querySelectorAll<HTMLElement>("[data-hero-nav], [data-hero-copy]"),
          { autoAlpha: 0.18, yPercent: -8, duration: 0.22 },
          0.78,
        );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      data-landing-section="hero"
      className="relative z-[3] h-[165vh] overflow-visible bg-[#f6f1ea] text-[#f0ebe2]"
    >
      <div
        data-gsap-stage
        data-hero-stage
        className="sticky top-0 flex h-[100dvh] items-center justify-center overflow-hidden"
      >
        <div
          data-hero-shell
          className="hero-shell relative h-full w-full overflow-hidden bg-[#0d0905]"
        >
          <div
            data-hero-poster
            aria-hidden="true"
            className="hero-abstract-poster absolute inset-0"
          />
          {isHydrated && (
            <video
              ref={videoRef}
              data-hero-video
              aria-hidden="true"
              autoPlay
              className="hero-video absolute inset-0 z-[2] h-full w-full"
              loop
              muted
              playsInline
              preload="auto"
            >
              <source src="/hero-video-pingpong-loop.mp4" type="video/mp4" />
            </video>
          )}
          <div className="absolute inset-0 z-[3] bg-black/20 pointer-events-none" />
          <header
            data-hero-nav
            className="hero-nav relative z-10 flex items-start justify-between"
          >
            <div className="hero-corner-block hero-brand-lockup">
              <Image
                src="/images/micro-logo.png"
                alt="MICRO by The Fix"
                width={200}
                height={20}
                className="hero-brand-logo"
                priority
              />
              <Image
                src="/images/micro-mark-light.svg"
                alt="MICRO by The Fix"
                width={59}
                height={64}
                className="hero-brand-mark"
                priority
              />
            </div>
            <TransitionLink
              href="/access"
              className="hero-corner-block hero-access-button text-[#f0ebe2]/80 transition hover:text-[#f0ebe2]"
            >
              Request access
            </TransitionLink>
          </header>
          <div
            data-hero-scroll-cue
            className="absolute bottom-12 left-8 right-8 z-10 flex items-center gap-5 text-[#f0ebe2]/55"
          >
            <span className="h-px flex-1 bg-current" />
            <span className="text-[0.55rem] font-medium uppercase tracking-[0.52em]">
              Scroll
            </span>
            <span className="h-px flex-1 bg-current" />
          </div>
        </div>
        <div
          data-hero-copy
          className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center px-6 text-center"
        >
          <div className="hero-copy-stack">
            <h1
              data-hero-title-line
              className="hero-title whitespace-nowrap text-[#f0ebe2]"
            >
              {"Stillness "}
              <span className="hero-title-italic">with</span>
              {" a pulse"}
            </h1>
            <p
              data-hero-subcopy
              className="hero-subcopy font-medium uppercase text-[#f0ebe2]/65"
            >
              A sensory movement space, Chelsea, London
            </p>
            <TransitionLink
              href="/access"
              data-hero-cta
              className="hero-primary-button pointer-events-auto inline-flex"
              data-track="hero-come-closer"
            >
              Come closer
            </TransitionLink>
          </div>
        </div>
      </div>
    </section>
  );
}
