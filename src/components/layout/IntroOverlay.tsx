"use client";

import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePageTransition } from "./TransitionProvider";

gsap.registerPlugin(ScrollTrigger);

const Micro_LOGO_PATH = "M29.29,0C13.14,0,0,14.21,0,31.68s13.14,31.68,29.29,31.68,29.29-14.21,29.29-31.68S45.44,0,29.29,0ZM46.32,9.24c-1.17,4.17-16.71,6.78-23.35,7.71-7.05.99-9.48-4.71-9.74-6.29-.4-2.39,1.23-4.84,4.48-6.72,3.11-1.8,7.25-2.89,11.63-2.89,5.28,0,10.92,1.57,15.56,5.36,1.19.97,1.67,1.92,1.41,2.83ZM17.36,49.99v-.09c.09-5.29,2.51-8.7,6.99-9.86,5.4-1.41,14.43-3.89,22.39-6.08l2.63-.72c.41-.11.82-.17,1.21-.17,2.54,0,4.48,2.2,5.02,3.61,1.03,2.65.56,4.77-.68,7.75-3.63,8.79-11.35,15.42-20.15,17.32-6.12,1.32-11.81.03-15.6-3.54-1.94-1.82-1.91-3.56-1.82-8.22ZM52.71,30.69c-.95.35-1.98.59-2.81.79-.32.08-.62.15-.85.21l-22,6.01c-3.74,1.02-6.06.07-7.34-.9-1.73-1.32-2.35-3.2-2.35-4.4v-2.43c0-8.02,4.63-9.98,10.68-11.7,3.46-.99,6.61-1.82,9.66-2.62,1.86-.49,3.78-1,5.78-1.54,5.18-1.41,8.52-1.82,11.21,4.32,1.81,4.13,2.24,7.2,1.32,9.37-.57,1.34-1.68,2.31-3.3,2.91ZM15.83,24.24v24.62c.01,6.74-.65,7.17-1.72,7.31-.99.13-2.33-.45-3-1.06C.91,45.87-1.89,29.48,4.6,16.98c1.3-2.51,2.1-3.22,3.03-3.59.36-.14.72-.21,1.09-.21,1.97,0,3.91,1.88,4.81,3.49,2.23,4.01,2.32,5.22,2.3,7.56Z";
const Micro_LOGO_VIEWBOX = "0 0 58.57 63.36";

const WORDMARK_CHARS = ["M", "I", "C", "R", "O"];

function WordmarkText() {
  return (
    <span className="inline-flex text-[2.4rem] font-bold tracking-[-0.02em] whitespace-nowrap" style={{ fontFamily: "var(--font-family-sans)" }}>
      {WORDMARK_CHARS.map((ch, i) => (
        <span key={i} className="inline-block wordmark-char">
          {ch === " " ? "\u00A0" : ch}
        </span>
      ))}
    </span>
  );
}

export default function IntroOverlay() {
  const introRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const cubeRef = useRef<HTMLDivElement>(null);
  const wordmarkRef = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(false);
  const { completeIntro } = usePageTransition();

  useEffect(() => {
    const intro = introRef.current;
    const overlay = overlayRef.current;
    const logo = logoRef.current;
    const cube = cubeRef.current;
    const wordmark = wordmarkRef.current;

    if (!intro || !overlay || !logo || !cube || !wordmark) return;

    const pageWrapper = document.querySelector("[data-page-wrapper]");
    const wordmarkPaths = wordmark.querySelectorAll(".wordmark-char");
    const isMobile = window.matchMedia("(max-width: 600px)").matches;

    const tl = gsap.timeline({
      onComplete: () => {
        completeIntro();
        setDone(true);
        ScrollTrigger.refresh();
      },
    });

    tl.set(wordmarkPaths, { yPercent: 150 });
    tl.set(logo, { xPercent: 41, autoAlpha: 1 });

    // Phase 1: Cube entrance (0 - 1.5s)
    tl.add(() => {
      cube.classList.add("cube-rotating");
    }, 0);

    tl.fromTo(
      cube,
      { yPercent: 100, scale: 0 },
      { yPercent: 0, scale: 0.95, duration: 1.5, ease: "power3.inOut" }
    );

    // Phase 2: Logo morph + wordmark reveal (1.3 - 2.3s)
    tl.add(() => {
      logo.classList.add("logo-masked");
    }, 1.5);

    tl.to(logo, { xPercent: 0, duration: 1, ease: "power3.inOut" }, 1.3);
    tl.to(
      cube,
      { xPercent: 100, yPercent: 50, duration: 1, ease: "power3.inOut" },
      "<"
    );
    tl.to(
      wordmarkPaths,
      { yPercent: 0, stagger: 0.05, duration: 1, ease: "power3.out" },
      "<"
    );

    // Phase 3: Page reveal (2.2 - 3.4s)
    tl.set(intro, { zIndex: 0 }, 2.2);
    tl.to(overlay, { opacity: 0.5, duration: 1.2, ease: "power3.inOut" }, 2.2);

    if (pageWrapper) {
      tl.fromTo(
        pageWrapper,
        { yPercent: 100 },
        { yPercent: 0, duration: 1.2, ease: "power3.inOut" },
        2.2
      );
    }

    // Phase 4: Logo exit
    tl.to(
      logo,
      {
        y: -(window.innerHeight / 3),
        autoAlpha: 0,
        duration: 1.2,
        ease: "power3.inOut",
      },
      2.3
    );

    // Phase 5: Scale content from zoomed to normal
    if (pageWrapper) {
      tl.fromTo(
        pageWrapper.firstElementChild || pageWrapper,
        { scale: 1.1 },
        {
          scale: 1,
          duration: 1.2,
          ease: "power3.inOut",
          willChange: "transform",
        },
        2.6
      );

      tl.fromTo(
        pageWrapper,
        { scale: isMobile ? 0.9 : 0.8, rotation: 0.01 },
        {
          scale: 1,
          duration: 1.2,
          ease: "power3.inOut",
          willChange: "transform",
          clearProps: "all",
        },
        "<"
      );
    }

    return () => {
      tl.kill();
    };
  }, [completeIntro]);

  if (done) return null;

  return (
    <div
      ref={introRef}
      className="fixed inset-0 z-[99] flex items-center justify-center"
    >
      <div ref={overlayRef} className="absolute inset-0 bg-fg-black" />

      <div
        ref={logoRef}
        className="relative z-[2] flex items-center gap-[1.6rem] text-fg-white"
        style={{ visibility: "hidden" }}
      >
        <div className="relative w-[4.2rem] h-[4.2rem]">
          <svg
            viewBox={Micro_LOGO_VIEWBOX}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute inset-0 w-full h-full"
          >
            <path d={Micro_LOGO_PATH} fill="currentColor" />
          </svg>

          <div
            ref={cubeRef}
            className="absolute inset-0"
            style={{ perspective: "800px" }}
          >
            <div
              className="cube-shape w-full h-full"
              style={{ transformStyle: "preserve-3d" }}
            >
              {["cube-front", "cube-back", "cube-top", "cube-bottom"].map(
                (face) => (
                  <div key={face} className={`absolute w-full h-full ${face}`}>
                    <svg viewBox={Micro_LOGO_VIEWBOX} fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                      <path d={Micro_LOGO_PATH} fill="currentColor" />
                    </svg>
                  </div>
                )
              )}
            </div>
          </div>
        </div>

        <div ref={wordmarkRef} className="overflow-hidden">
          <WordmarkText />
        </div>
      </div>
    </div>
  );
}
