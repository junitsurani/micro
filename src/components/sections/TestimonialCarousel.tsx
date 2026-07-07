"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import TransitionLink from "@/components/ui/TransitionLink";
import { TESTIMONIALS } from "@/lib/constants";

gsap.registerPlugin(ScrollTrigger);

function AccessIcon() {
  return (
    <svg viewBox="0 0 27 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="rv-access-svg">
      <path
        d="M27 20H15.286V11.2929L20.3288 0H24.9514L20.8541 10.4485H27V20ZM11.7665 20H0V11.2929L5.09533 0H9.7179L5.62062 10.4485H11.7665V20Z"
        fill="currentColor"
      />
    </svg>
  );
}

function NavArrow({ flipped }: { flipped?: boolean }) {
  return (
    <svg
      viewBox="0 0 14 9"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`rv-nav-arrow-svg ${flipped ? "rv-flipped" : ""}`}
    >
      <path
        d="M0 3.56641L10.7969 3.56641L8.00488 0.900391L7.94043 0.839844L8.00098 0.774414L8.65332 0.0673828L8.71484 0L8.78125 0.0625L12.9727 4.06348L13.04 4.12793L12.9727 4.19336L8.78125 8.19336L8.71484 8.25586L8.65332 8.18848L8.00098 7.48145L7.94043 7.41602L8.00488 7.35547L10.7969 4.69043L0 4.69043L0 3.56641Z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function TestimonialCarousel() {
  const sectionRef = useRef<HTMLElement>(null);
  const [current, setCurrent] = useState(0);
  const blocksRef = useRef<HTMLDivElement>(null);
  const animating = useRef(false);
  const prevIndex = useRef(0);

  const animateTransition = useCallback((from: number, to: number) => {
    const blocks = blocksRef.current;
    if (!blocks) return;

    const allBlocks = blocks.querySelectorAll<HTMLElement>(".rv-block");
    const oldBlock = allBlocks[from];
    const newBlock = allBlocks[to];
    if (!oldBlock || !newBlock) return;

    animating.current = true;

    const tl = gsap.timeline({
      defaults: { duration: 0.6, ease: "power3.inOut" },
      onComplete: () => {
        animating.current = false;
      },
    });

    const oldLines = oldBlock.querySelectorAll(".rv-line");
    const oldAccess = oldBlock.querySelector(".rv-access-svg");
    const oldContent = oldBlock.querySelector(".rv-content");

    const newLines = newBlock.querySelectorAll(".rv-line");
    const newAccess = newBlock.querySelector(".rv-access-svg");
    const newContent = newBlock.querySelector(".rv-content");

    tl.to(oldLines, {
      yPercent: -100,
      stagger: 0.03,
      duration: 0.5,
      ease: "power3.in",
    }, 0);

    if (oldAccess) {
      tl.to(oldAccess, { autoAlpha: 0, duration: 0.4 }, 0);
    }
    if (oldContent) {
      tl.to(oldContent, { autoAlpha: 0, yPercent: 20, duration: 0.4 }, 0.1);
    }

    tl.call(() => {
      oldBlock.classList.remove("is-active");
      newBlock.classList.add("is-active");

      gsap.set(newLines, { yPercent: 100 });
      if (newAccess) gsap.set(newAccess, { autoAlpha: 0 });
      if (newContent) gsap.set(newContent, { autoAlpha: 0, yPercent: 20 });

      blocks.style.height = `${newBlock.scrollHeight}px`;
    });

    tl.fromTo(
      newLines,
      { yPercent: 100 },
      { yPercent: 0, stagger: 0.04, duration: 0.6, ease: "power3.out" },
    );

    if (newAccess) {
      tl.fromTo(newAccess, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5 }, "<0.1");
    }
    if (newContent) {
      tl.fromTo(
        newContent,
        { autoAlpha: 0, yPercent: 20 },
        { autoAlpha: 1, yPercent: 0, duration: 0.5 },
        "<0.15",
      );
    }
  }, []);

  const goPrev = useCallback(() => {
    if (animating.current) return;
    setCurrent((c) => {
      const next = c === 0 ? TESTIMONIALS.length - 1 : c - 1;
      animateTransition(c, next);
      prevIndex.current = c;
      return next;
    });
  }, [animateTransition]);

  const goNext = useCallback(() => {
    if (animating.current) return;
    setCurrent((c) => {
      const next = c === TESTIMONIALS.length - 1 ? 0 : c + 1;
      animateTransition(c, next);
      prevIndex.current = c;
      return next;
    });
  }, [animateTransition]);

  useEffect(() => {
    const blocks = blocksRef.current;
    if (!blocks) return;
    const active = blocks.querySelector<HTMLElement>(".is-active");
    if (active) {
      blocks.style.height = `${active.scrollHeight}px`;
    }
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      if (window.innerWidth > 600) {
        ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: "+=80%",
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
        });
      }

      gsap.fromTo(
        section.querySelectorAll(".rv-animate"),
        { autoAlpha: 0, y: 30 },
        {
          autoAlpha: 1,
          y: 0,
          stagger: 0.1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: section, start: "top 80%" },
        },
      );

      ScrollTrigger.refresh();
    }, section);

    return () => ctx.revert();
  }, []);

  const hasTestimonials = TESTIMONIALS.length > 0;

  return (
    <section ref={sectionRef} data-section-six className="reviews">
      <div className="rv-container">
        {hasTestimonials ? (
        <>
        <div className="rv-head rv-animate">
          <h2 className="rv-base-title">What our clients say</h2>

          {hasTestimonials && (
            <div className="rv-indicator">
              {String(current + 1).padStart(2, "0")} / {String(TESTIMONIALS.length).padStart(2, "0")}
            </div>
          )}

          {hasTestimonials && (
            <div className="rv-arrow-nav">
              <button type="button" onClick={goPrev} aria-label="Previous" className="rv-arrow-btn">
                <NavArrow flipped />
              </button>
              <button type="button" onClick={goNext} aria-label="Next" className="rv-arrow-btn">
                <NavArrow />
              </button>
            </div>
          )}
        </div>

        <div ref={blocksRef} className="rv-blocks">
          {TESTIMONIALS.map((t, i) => (
            <div key={t.name} className={`rv-block ${i === 0 ? "is-active" : ""}`}>
              <AccessIcon />

              <blockquote className="rv-blockquote">
                {t.quote.split(/(?<=\s)/g).reduce<string[][]>((acc, word) => {
                  const lastLine = acc[acc.length - 1];
                  const joined = lastLine.join("") + word;
                  if (joined.length > 60 && lastLine.length > 0) {
                    acc.push([word]);
                  } else {
                    lastLine.push(word);
                  }
                  return acc;
                }, [[]]).map((lineWords, li) => (
                  <span key={li} className="rv-line-mask" aria-hidden="true">
                    <span className="rv-line">{lineWords.join("")}</span>
                  </span>
                ))}
              </blockquote>

              <div className="rv-content">
                {t.image && (
                  <Image
                    src={t.image}
                    alt={t.name}
                    width={276}
                    height={340}
                    className="rv-image"
                    sizes="(max-width: 600px) 5.9rem, 17.3rem"
                    loading="eager"
                  />
                )}
                <p className="rv-author">
                  <span className="rv-quotee">{t.name}</span>
                  <span className="rv-function">{t.role}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
        </>
        ) : (
          <div className="rv-story-empty">
            <div className="rv-story-body">
              <p className="rv-story-kicker rv-animate">Created with intention</p>
              <p className="rv-story-copy rv-animate">
                <span>Built for a life lived well,</span>
                <span className="rv-story-copy-em">not only a life lived longer.</span>
              </p>
              <p className="rv-story-subcopy rv-animate">
                The founding membership is intentionally limited: sixty places for
                the first Chelsea space, shaped around movement, recovery, and care.
              </p>
              <TransitionLink href="/access" className="base-btn is-waitlist rv-story-cta" data-track="testimonial-founding-access">
                <span className="btn-label">
                  <span className="btn-line">Come closer</span>
                  <span className="btn-line">Come closer</span>
                </span>
              </TransitionLink>
            </div>

            <div className="rv-story-media rv-animate" aria-hidden="true">
              <Image
                src="/images/8ef3fc36-54b6-4b2a-aee0-759d79e2c44b.png"
                alt=""
                fill
                sizes="(max-width: 600px) 100vw, 42vw"
                className="rv-story-media-img"
              />
            </div>
          </div>
        )}

        <div className="rv-story-line" aria-hidden="true">
          <span className="rv-story-line-rule" />
        </div>
      </div>
    </section>
  );
}
