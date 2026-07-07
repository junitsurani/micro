"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import Lenis from "lenis";

interface ScrollToOptions {
  immediate?: boolean;
}

interface LenisContextValue {
  lenis: Lenis | null;
  isScrolling: boolean;
  scrollTo: (target: number | string | HTMLElement, opts?: ScrollToOptions) => void;
  resize: () => void;
}

const LenisContext = createContext<LenisContextValue>({
  lenis: null,
  isScrolling: false,
  scrollTo: () => {},
  resize: () => {},
});

export function useLenis() {
  return useContext(LenisContext);
}

export default function LenisProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const lenisRef = useRef<Lenis | null>(null);
  const rafRef = useRef<number>(0);
  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    const isTouchDevice =
      "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    const lenis = new Lenis({ lerp: 0.1 });

    lenisRef.current = lenis;

    let wasScrolling = false;

    lenis.on("scroll", (instance: Lenis) => {
      const nowScrolling =
        instance.isScrolling === true && Math.abs(instance.velocity) > 0.01;
      if (nowScrolling !== wasScrolling) {
        wasScrolling = nowScrolling;
        setIsScrolling(nowScrolling);
      }
    });

    function onFrame(time: number) {
      lenis.raf(time);
      rafRef.current = requestAnimationFrame(onFrame);
    }
    rafRef.current = requestAnimationFrame(onFrame);

    return () => {
      cancelAnimationFrame(rafRef.current);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  const scrollTo = useCallback(
    (target: number | string | HTMLElement, opts?: ScrollToOptions) => {
      if (lenisRef.current) {
        lenisRef.current.scrollTo(target, {
          immediate: opts?.immediate ?? false,
        });
      } else if (typeof target === "number") {
        window.scrollTo({ top: target, behavior: opts?.immediate ? "instant" : "smooth" });
      }
    },
    [],
  );

  const resize = useCallback(() => {
    lenisRef.current?.resize();
  }, []);

  return (
    <LenisContext.Provider
      value={{ lenis: lenisRef.current, isScrolling, scrollTo, resize }}
    >
      {children}
    </LenisContext.Provider>
  );
}
