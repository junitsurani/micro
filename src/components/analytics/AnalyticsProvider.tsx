"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from "react";
import { AnalyticsTracker } from "@/lib/analytics/tracker";
import { useLenis } from "@/components/layout/LenisProvider";

interface AnalyticsContextValue {
  trackClick: (element: HTMLElement) => void;
  trackFormEvent: (
    formId: string,
    eventType: "focus" | "input" | "submit" | "abandon",
    fieldName?: string,
  ) => void;
  registerFormFields: (formId: string, fieldCount: number) => void;
}

const AnalyticsContext = createContext<AnalyticsContextValue>({
  trackClick: () => {},
  trackFormEvent: () => {},
  registerFormFields: () => {},
});

export function useAnalytics() {
  return useContext(AnalyticsContext);
}

export default function AnalyticsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const trackerRef = useRef<AnalyticsTracker | null>(null);
  const { lenis } = useLenis();

  // Initialize tracker on mount (client-side only)
  useEffect(() => {
    const tracker = new AnalyticsTracker();
    trackerRef.current = tracker;

    tracker.trackSessionStart();
    tracker.trackPageview();

    return () => {
      tracker.destroy();
      trackerRef.current = null;
    };
  }, []);

  // Scroll tracking via Lenis (preferred) or native fallback
  useEffect(() => {
    const tracker = trackerRef.current;
    if (!tracker) return;

    if (lenis) {
      const onScroll = () => {
        tracker.trackScroll(lenis.scroll, lenis.limit + window.innerHeight);
      };
      lenis.on("scroll", onScroll);
      return () => {
        lenis.off("scroll", onScroll);
      };
    }

    // Native scroll fallback (touch devices where Lenis is disabled)
    const onNativeScroll = () => {
      const scrollY = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight;
      tracker.trackScroll(scrollY, scrollHeight);
    };
    window.addEventListener("scroll", onNativeScroll, { passive: true });
    return () => window.removeEventListener("scroll", onNativeScroll);
  }, [lenis]);

  // Click delegation: track clicks on interactive elements
  useEffect(() => {
    const tracker = trackerRef.current;
    if (!tracker) return;

    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      const trackable = target.closest<HTMLElement>(
        "a, button, [data-track], [role='button']",
      );
      if (trackable) {
        tracker.trackClick(trackable);
      }
    };

    document.addEventListener("click", onClick, { passive: true, capture: true });
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  // Re-track pageview on client-side route changes (Next.js App Router)
  useEffect(() => {
    const tracker = trackerRef.current;
    if (!tracker) return;

    let lastPath = window.location.pathname;

    const observer = new MutationObserver(() => {
      const currentPath = window.location.pathname;
      if (currentPath !== lastPath) {
        lastPath = currentPath;
        tracker.resetScrollTracking();
        tracker.trackPageview();
      }
    });

    observer.observe(document.querySelector("head title") || document.head, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    return () => observer.disconnect();
  }, []);

  const trackClick = useCallback((element: HTMLElement) => {
    trackerRef.current?.trackClick(element);
  }, []);

  const trackFormEvent = useCallback(
    (formId: string, eventType: "focus" | "input" | "submit" | "abandon", fieldName?: string) => {
      trackerRef.current?.trackFormEvent(formId, eventType, fieldName);
    },
    [],
  );

  const registerFormFields = useCallback((formId: string, fieldCount: number) => {
    trackerRef.current?.registerFormFields(formId, fieldCount);
  }, []);

  return (
    <AnalyticsContext.Provider
      value={{ trackClick, trackFormEvent, registerFormFields }}
    >
      {children}
    </AnalyticsContext.Provider>
  );
}
