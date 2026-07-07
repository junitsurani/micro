"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

declare global {
  interface Window {
    __morphOverlay?: HTMLDivElement | null;
  }
}

interface ServicePageOptions {
  triggerTransition?: (href: string) => void;
  lenis?: Lenis | null;
}

export function useServicePageAnimations(opts?: ServicePageOptions) {
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef(opts?.triggerTransition);
  const lenisRef = useRef(opts?.lenis);
  triggerRef.current = opts?.triggerTransition;
  lenisRef.current = opts?.lenis;

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    const isMobile = window.innerWidth < 768;
    let autoNavTriggered = false;
    let scrollHandler: (() => void) | null = null;

    const ctx = gsap.context(() => {
      // ── Handle incoming hero morph from previous page ──
      const morphOverlay = window.__morphOverlay;
      const isMorph = !!morphOverlay;
      const heroImage = root.querySelector<HTMLElement>(".sp-hero__image");
      const heroStack = root.querySelector<HTMLElement>(".sp-hero__stack");

      if (morphOverlay && heroImage) {
        const morphImg = morphOverlay.querySelector<HTMLElement>("#sp-hero-morph-img");
        const morphName = morphOverlay.querySelector<HTMLElement>("#sp-hero-morph-name");

        document.body.style.overflow = "hidden";
        document.documentElement.style.overflow = "hidden";
        if (lenisRef.current) lenisRef.current.stop();

        // Force scroll to top
        window.scrollTo(0, 0);

        gsap.set(heroImage, { visibility: "hidden" });

        const stackEls = heroStack ? (Array.from(heroStack.children) as HTMLElement[]) : [];
        stackEls.forEach((el) => {
          el.style.clipPath = "inset(0 0 0 0)";
          gsap.set(el, { yPercent: 120, opacity: 1 });
        });

        // Wait for layout to settle, then measure and animate
        requestAnimationFrame(() => {
          ScrollTrigger.refresh();

          const rect = heroImage.getBoundingClientRect();

          if (morphImg) {
            morphImg.style.cssText = `position:absolute;top:0;left:0;width:100%;height:100%;background-image:${morphImg.style.backgroundImage};background-size:cover;background-position:center;`;
          }

          const tl = gsap.timeline({
            defaults: { duration: 1.5, ease: "power3.out" },
            onComplete: () => {
              stackEls.forEach((el) => { el.style.clipPath = ""; });

              const realImg = heroImage.querySelector<HTMLElement>(".sp-hero__img");
              if (realImg) {
                realImg.style.cssText = "position:absolute;top:0;left:0;width:100%;height:100%;";
              }

              gsap.set(heroImage, { visibility: "visible" });
              morphOverlay.remove();
              window.__morphOverlay = null;

              // Unlock scroll ONLY after animation is fully done
              document.body.style.overflow = "";
              document.documentElement.style.overflow = "";
              if (lenisRef.current) lenisRef.current.start();
            },
          });

          tl.to(morphOverlay, {
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height,
          }, 0);

          if (morphName) {
            tl.to(morphName, { yPercent: -100, opacity: 0, duration: 1, ease: "power3.out" }, 0);
          }

          stackEls.forEach((el, i) => {
            tl.to(el, { yPercent: 0, duration: 1.5, ease: "power3.out" }, 0.1 * i);
          });
        });
      } else {
        // Standard hero entrance (no morph)
        if (heroStack) {
          const els = [
            heroStack.querySelector(".sp-hero__eyebrow"),
            heroStack.querySelector(".sp-hero__title"),
            heroStack.querySelector(".sp-hero__tagline"),
          ].filter(Boolean) as HTMLElement[];

          gsap.set(els, { opacity: 0, y: 40 });
          gsap.to(els, { opacity: 1, y: 0, duration: 1.2, ease: "power3.out", stagger: 0.1, delay: 0.1 });
        }
      }

      // ── Expand asset (desktop only) ──
      const expandAsset = root.querySelector<HTMLElement>(".sp-asset--expand");
      let expandFrame: HTMLElement | null = null;

      if (expandAsset && !isMobile) {
        expandFrame = expandAsset.querySelector<HTMLElement>(".sp-asset__frame");
        if (expandFrame) {
          expandFrame.style.maxWidth = "520px";
          expandFrame.style.marginLeft = "auto";
          expandFrame.style.marginRight = "clamp(32px, 5vw, 80px)";

          const rect = expandFrame.getBoundingClientRect();
          const vw = window.innerWidth;
          const vh = window.innerHeight;
          const scaleX = vw / rect.width;
          const scaleY = vh / rect.height;
          const scaleStart = Math.max(scaleX, scaleY);
          const frameCenterX = rect.left + rect.width / 2;
          const xStart = vw / 2 - frameCenterX;

          expandAsset.style.height = "250vh";
          expandAsset.style.position = "relative";
          expandAsset.style.overflow = "clip";

          expandFrame.style.position = "sticky";
          expandFrame.style.top = "50%";
          expandFrame.style.zIndex = "5";

          gsap.set(expandFrame, {
            yPercent: -50,
            scale: scaleStart,
            x: xStart,
            transformOrigin: "center center",
          });

          gsap.timeline({
            scrollTrigger: {
              trigger: expandAsset,
              start: "top top",
              end: "bottom bottom",
              scrub: 0.4,
              invalidateOnRefresh: true,
            },
          }).to(expandFrame, { scale: 1, x: 0, ease: "none" }, 0);
        }
      }

      // ── Container parallax ──
      root.querySelectorAll<HTMLElement>(".sp-asset__frame, .sp-duo__block").forEach((container) => {
        if (expandFrame && container === expandFrame) return;
        gsap.fromTo(
          container,
          { yPercent: 6 },
          {
            yPercent: -2,
            ease: "none",
            scrollTrigger: { trigger: container, start: "top bottom", end: "bottom top", scrub: true },
          }
        );
      });

      // ── Image parallax (skip hero img when morphing) ──
      root.querySelectorAll<HTMLElement>(".sp-hero__img, .sp-asset__img, .sp-duo__img").forEach((img) => {
        if (isMorph && img.classList.contains("sp-hero__img")) return;
        if (expandFrame && img.closest(".sp-asset__frame") === expandFrame) return;
        const trigger = img.closest(".sp-hero__image, .sp-asset__frame, .sp-duo__block");
        if (!trigger) return;
        gsap.fromTo(
          img,
          { yPercent: -10 },
          {
            yPercent: 10,
            ease: "none",
            scrollTrigger: { trigger, start: "top bottom", end: "bottom top", scrub: true },
          }
        );
      });

      // ── Image scale settle (skip hero img when morphing) ──
      root.querySelectorAll<HTMLElement>(".sp-hero__img, .sp-asset__img, .sp-duo__img").forEach((img) => {
        if (isMorph && img.classList.contains("sp-hero__img")) return;
        if (expandFrame && img.closest(".sp-asset__frame") === expandFrame) return;
        const trigger = img.closest(".sp-hero__image, .sp-asset__frame, .sp-duo__block");
        if (!trigger) return;
        gsap.fromTo(
          img,
          { scale: 1.08 },
          {
            scale: 1,
            ease: "power2.out",
            scrollTrigger: { trigger, start: "top 90%", end: "top 30%", scrub: true },
          }
        );
      });

      // ── Text block reveals ──
      root.querySelectorAll(".sp-text").forEach((section) => {
        const label = section.querySelector(".sp-text__label");
        const heading = section.querySelector(".sp-text__heading");
        const bodies = section.querySelectorAll(".sp-text__body");
        const leftEls = [label, heading].filter(Boolean) as HTMLElement[];
        const rightEls = Array.from(bodies) as HTMLElement[];

        gsap.set(leftEls, { opacity: 0, y: 32 });
        gsap.set(rightEls, { opacity: 0, y: 24 });

        ScrollTrigger.create({
          trigger: section,
          start: "top 75%",
          once: true,
          onEnter: () => {
            gsap.to(leftEls, { opacity: 1, y: 0, duration: 0.9, ease: "power3.out", stagger: 0.1 });
            gsap.to(rightEls, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", stagger: 0.08, delay: 0.2 });
          },
        });
      });

      // ── List items stagger ──
      const listItems = root.querySelectorAll<HTMLElement>(".sp-list__item");
      if (listItems.length) {
        gsap.set(listItems, { opacity: 0, y: 30 });
        ScrollTrigger.create({
          trigger: listItems[0],
          start: "top 80%",
          once: true,
          onEnter: () => {
            gsap.to(listItems, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out", stagger: 0.08 });
          },
        });
      }

      // ── List eyebrow ──
      const listEyebrow = root.querySelector<HTMLElement>(".sp-list__eyebrow");
      if (listEyebrow) {
        gsap.set(listEyebrow, { opacity: 0, y: 16 });
        ScrollTrigger.create({
          trigger: listEyebrow,
          start: "top 85%",
          once: true,
          onEnter: () => {
            gsap.to(listEyebrow, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" });
          },
        });
      }

      // ── Next section scrub + auto-navigate ──
      const nextSection = root.querySelector<HTMLElement>("#sp-next");
      if (nextSection) {
        const asset = nextSection.querySelector(".sp-next__asset");
        const name = nextSection.querySelector(".sp-next__name");
        const link = nextSection.querySelector<HTMLAnchorElement>(".sp-next__link");
        const href = link?.getAttribute("href");
        let footerVisible = false;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: nextSection,
            start: "top bottom",
            end: "bottom bottom",
            scrub: 0.6,
            onEnter: () => { footerVisible = true; },
            onLeaveBack: () => { footerVisible = false; },
          },
        });

        if (name) tl.fromTo(name, { yPercent: -40 }, { yPercent: 0, ease: "none" }, 0);
        if (asset) tl.fromTo(asset, { yPercent: -20 }, { yPercent: 0, ease: "none" }, 0);

        if (href && triggerRef.current) {
          const checkAndNavigate = () => {
            if (autoNavTriggered || !footerVisible) return;
            const docH = document.documentElement.scrollHeight;
            const scrollBottom = window.scrollY + window.innerHeight;
            if (docH - scrollBottom < 2) {
              autoNavTriggered = true;

              if (lenisRef.current) lenisRef.current.stop();

              const nextImg = nextSection.querySelector<HTMLElement>(".sp-next__img");
              const nextName = nextSection.querySelector<HTMLElement>(".sp-next__name");
              if (nextImg) {
                const imgTag = nextImg.querySelector<HTMLImageElement>("img");
                const bgUrl = imgTag?.currentSrc || imgTag?.src || nextImg.style.backgroundImage;
                const vw = window.innerWidth;
                const vh = window.innerHeight;
                const overlay = document.createElement("div");
                overlay.id = "sp-hero-morph";
                overlay.style.cssText = `position:fixed;top:0px;left:0px;width:${vw}px;height:${vh}px;z-index:9999;overflow:hidden;pointer-events:none;`;

                const imgEl = document.createElement("div");
                imgEl.id = "sp-hero-morph-img";
                const bgValue = bgUrl.startsWith("url(") ? bgUrl : `url(${bgUrl})`;
                imgEl.style.cssText = `position:absolute;top:0;left:0;width:100%;height:100%;background-image:${bgValue};background-size:cover;background-position:center;`;
                overlay.appendChild(imgEl);

                if (nextName) {
                  const nameClone = nextName.cloneNode(true) as HTMLElement;
                  nameClone.id = "sp-hero-morph-name";
                  nameClone.style.position = "absolute";
                  nameClone.style.zIndex = "2";
                  overlay.appendChild(nameClone);
                }

                document.body.appendChild(overlay);
                window.__morphOverlay = overlay;
              }

              triggerRef.current?.(href);
            }
          };

          scrollHandler = () => {
            if (autoNavTriggered) return;
            clearTimeout((scrollHandler as any)._t);
            (scrollHandler as any)._t = setTimeout(checkAndNavigate, 80);
          };
          window.addEventListener("scroll", scrollHandler, { passive: true });
        }
      }

      ScrollTrigger.refresh();
    }, root);

    return () => {
      ctx.revert();
      if (scrollHandler) {
        window.removeEventListener("scroll", scrollHandler);
      }
    };
  }, []);

  return containerRef;
}
