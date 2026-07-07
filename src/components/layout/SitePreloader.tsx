"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const MIN_VISIBLE_MS = 650;
const MAX_WAIT_MS = 4500;
const SCROLL_KEYS = new Set([
  " ",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowUp",
  "End",
  "Home",
  "PageDown",
  "PageUp",
]);

function waitForHeroVideo() {
  return new Promise<void>((resolve) => {
    let done = false;
    let frame = 0;

    const finish = () => {
      if (done) return;
      done = true;
      window.cancelAnimationFrame(frame);
      resolve();
    };

    const bindVideo = () => {
      const hero = document.querySelector<HTMLElement>('[data-landing-section="hero"]');
      const video = document.querySelector<HTMLVideoElement>("[data-hero-video]");

      if (!hero) {
        finish();
        return;
      }

      if (!video) {
        frame = window.requestAnimationFrame(bindVideo);
        return;
      }

      if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
        finish();
        return;
      }

      video.addEventListener("loadeddata", finish, { once: true });
      video.addEventListener("canplay", finish, { once: true });
      window.setTimeout(finish, MAX_WAIT_MS);
    };

    bindVideo();
  });
}

export default function SitePreloader() {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/secretdoor");
  const [isDone, setIsDone] = useState(isAdminRoute);

  useEffect(() => {
    if (isAdminRoute) return;
    let cancelled = false;
    const listenerOptions = { capture: true } as const;
    const activeListenerOptions = { capture: true, passive: false } as const;

    const preventScroll = (event: Event) => {
      event.preventDefault();
      event.stopPropagation();
    };

    const preventMouseScroll = (event: MouseEvent) => {
      if (event.button !== 1) return;
      event.preventDefault();
      event.stopPropagation();
    };

    const preventKeyScroll = (event: KeyboardEvent) => {
      if (!SCROLL_KEYS.has(event.key)) return;
      event.preventDefault();
      event.stopPropagation();
    };

    const lockScroll = () => {
      document.documentElement.classList.add("is-preloading");
      window.addEventListener("wheel", preventScroll, activeListenerOptions);
      window.addEventListener("touchmove", preventScroll, activeListenerOptions);
      window.addEventListener("keydown", preventKeyScroll, listenerOptions);
      window.addEventListener("mousedown", preventMouseScroll, listenerOptions);
      window.addEventListener("auxclick", preventMouseScroll, listenerOptions);
    };

    const unlockScroll = () => {
      document.documentElement.classList.remove("is-preloading");
      window.removeEventListener("wheel", preventScroll, activeListenerOptions);
      window.removeEventListener("touchmove", preventScroll, activeListenerOptions);
      window.removeEventListener("keydown", preventKeyScroll, listenerOptions);
      window.removeEventListener("mousedown", preventMouseScroll, listenerOptions);
      window.removeEventListener("auxclick", preventMouseScroll, listenerOptions);
    };

    lockScroll();

    const load = async () => {
      const minVisible = new Promise<void>((resolve) => {
        window.setTimeout(resolve, MIN_VISIBLE_MS);
      });

      await Promise.race([
        Promise.all([minVisible, waitForHeroVideo()]),
        new Promise<void>((resolve) => window.setTimeout(resolve, MAX_WAIT_MS)),
      ]);

      if (!cancelled) {
        setIsDone(true);
        window.setTimeout(() => {
          unlockScroll();
        }, 700);
      }
    };

    void load();

    return () => {
      cancelled = true;
      unlockScroll();
    };
  }, []);

  return (
    <div className={`site-preloader${isDone ? " is-done" : ""}`} aria-hidden={isDone}>
      <div className="site-preloader-wordmark">
        <img
          src="/micro-fe-assets/micro-logo-dark.svg"
          alt=""
          className="site-preloader-logo"
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
