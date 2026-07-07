"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import gsap from "gsap";

interface TransitionContextValue {
  isTransitioning: boolean;
  shouldAnimate: React.MutableRefObject<boolean>;
  triggerTransition: (href: string) => void;
  registerWrapper: (el: HTMLDivElement | null) => void;
  markEnterDone: () => void;
  completeIntro: () => void;
}

const TransitionContext = createContext<TransitionContextValue>({
  isTransitioning: false,
  shouldAnimate: { current: false },
  triggerTransition: () => {},
  registerWrapper: () => {},
  markEnterDone: () => {},
  completeIntro: () => {},
});

export function usePageTransition() {
  return useContext(TransitionContext);
}

export default function TransitionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const pathnameRef = useRef(pathname);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const shouldAnimate = useRef(false);

  pathnameRef.current = pathname;

  const registerWrapper = useCallback((el: HTMLDivElement | null) => {
    wrapperRef.current = el;
  }, []);

  const markEnterDone = useCallback(() => {
    setIsTransitioning(false);
    shouldAnimate.current = false;
  }, []);

  const completeIntro = useCallback(() => {
    shouldAnimate.current = false;
  }, []);

  const triggerTransition = useCallback(
    (href: string) => {
      if (isTransitioning || href === pathnameRef.current) return;

      const wrapper = wrapperRef.current;
      if (!wrapper) {
        router.push(href);
        return;
      }

      const isTouchDevice =
        "ontouchstart" in window || navigator.maxTouchPoints > 0;

      setIsTransitioning(true);
      shouldAnimate.current = true;

      // Skip the heavy DOM clone on touch devices - it can block the
      // main thread long enough to stall router.push on older phones.
      if (!isTouchDevice && !window.__morphOverlay) {
        const scrollY = window.scrollY;
        const snap = document.createElement("div");
        snap.setAttribute("aria-hidden", "true");
        snap.style.cssText = `
          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          overflow: hidden;
        `;

        const inner = wrapper.cloneNode(true) as HTMLDivElement;
        inner.removeAttribute("data-page-wrapper");
        inner.style.position = "absolute";
        inner.style.top = "0";
        inner.style.left = "0";
        inner.style.width = "100%";
        inner.style.transform = `translateY(${-scrollY}px)`;
        inner.style.visibility = "visible";
        inner.style.opacity = "1";
        snap.appendChild(inner);
        document.body.appendChild(snap);

        gsap.to(snap, {
          opacity: 0.5,
          duration: 1.3,
          ease: "power3.inOut",
          onComplete: () => snap.remove(),
        });
      }

      router.push(href);
    },
    [isTransitioning, router],
  );

  return (
    <TransitionContext.Provider
      value={{
        isTransitioning,
        shouldAnimate,
        triggerTransition,
        registerWrapper,
        markEnterDone,
        completeIntro,
      }}
    >
      {children}
    </TransitionContext.Provider>
  );
}
