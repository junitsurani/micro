import type {
  AnalyticsEvent,
  AnalyticsEventType,
  UTMParams,
  DeviceInfo,
  ScrollData,
  ClickData,
  FormEventData,
} from "./types";

const VISITOR_COOKIE = "_mbf_vid";
const SESSION_KEY = "_mbf_sid";
const SESSION_TS_KEY = "_mbf_sts";
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
const BATCH_INTERVAL = 5000;
const ENDPOINT = "/api/analytics";

function generateId(): string {
  return (
    Date.now().toString(36) +
    Math.random().toString(36).slice(2, 10) +
    Math.random().toString(36).slice(2, 6)
  );
}

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function setCookie(name: string, value: string, days: number) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires};path=/;SameSite=Lax`;
}

function getUTMParams(): UTMParams {
  const params = new URLSearchParams(window.location.search);
  return {
    source: params.get("utm_source") ?? undefined,
    medium: params.get("utm_medium") ?? undefined,
    campaign: params.get("utm_campaign") ?? undefined,
    term: params.get("utm_term") ?? undefined,
    content: params.get("utm_content") ?? undefined,
  };
}

function getDeviceInfo(): DeviceInfo {
  return {
    userAgent: navigator.userAgent,
    language: navigator.language,
    screenWidth: screen.width,
    screenHeight: screen.height,
    viewportWidth: window.innerWidth,
    viewportHeight: window.innerHeight,
    devicePixelRatio: window.devicePixelRatio || 1,
    touchSupport: "ontouchstart" in window || navigator.maxTouchPoints > 0,
    platform: navigator.platform || "",
  };
}

export class AnalyticsTracker {
  private visitorId: string;
  private sessionId: string;
  private queue: AnalyticsEvent[] = [];
  private flushTimer: ReturnType<typeof setInterval> | null = null;
  private utmParams: UTMParams;
  private deviceInfo: DeviceInfo;
  private pageLoadTime: number;

  // Scroll tracking state
  private maxScrollDepth = 0;
  private scrollMilestonesReached = new Set<number>();
  private scrollDebounceTimer: ReturnType<typeof setTimeout> | null = null;

  // Form tracking state
  private formTimers = new Map<string, number>();
  private formFieldCounts = new Map<string, { total: number; filled: Set<string> }>();

  private destroyed = false;

  constructor() {
    this.visitorId = this.getOrCreateVisitorId();
    this.sessionId = this.getOrCreateSessionId();
    this.utmParams = getUTMParams();
    this.deviceInfo = getDeviceInfo();
    this.pageLoadTime = Date.now();

    this.startBatching();
    this.setupUnloadHandler();
  }

  private getOrCreateVisitorId(): string {
    let id = getCookie(VISITOR_COOKIE);
    if (!id) {
      id = generateId();
      setCookie(VISITOR_COOKIE, id, 365 * 2);
    }
    return id;
  }

  private getOrCreateSessionId(): string {
    const lastTs = sessionStorage.getItem(SESSION_TS_KEY);
    const existingId = sessionStorage.getItem(SESSION_KEY);

    if (existingId && lastTs && Date.now() - Number(lastTs) < SESSION_TIMEOUT) {
      this.touchSession();
      return existingId;
    }

    const newId = generateId();
    sessionStorage.setItem(SESSION_KEY, newId);
    this.touchSession();
    return newId;
  }

  private touchSession() {
    sessionStorage.setItem(SESSION_TS_KEY, String(Date.now()));
  }

  private createEvent(
    type: AnalyticsEventType,
    meta: Record<string, unknown> = {},
  ): AnalyticsEvent {
    this.touchSession();
    return {
      id: generateId(),
      type,
      timestamp: Date.now(),
      visitorId: this.visitorId,
      sessionId: this.sessionId,
      url: window.location.href,
      path: window.location.pathname,
      referrer: document.referrer,
      utmParams: this.utmParams,
      device: this.deviceInfo,
      meta,
    };
  }

  private enqueue(event: AnalyticsEvent) {
    if (this.destroyed) return;
    this.queue.push(event);
  }

  private startBatching() {
    this.flushTimer = setInterval(() => this.flush(), BATCH_INTERVAL);
  }

  private setupUnloadHandler() {
    const onUnload = () => {
      this.trackTimeOnPage();
      this.flushSync();
    };
    window.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") onUnload();
    });
    window.addEventListener("pagehide", onUnload);
  }

  private flush() {
    if (this.queue.length === 0) return;
    const batch = this.queue.splice(0);
    fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ events: batch }),
      keepalive: true,
    }).catch(() => {
      // Re-enqueue on failure (best-effort)
      this.queue.unshift(...batch);
    });
  }

  private flushSync() {
    if (this.queue.length === 0) return;
    const batch = this.queue.splice(0);
    const blob = new Blob([JSON.stringify({ events: batch })], {
      type: "application/json",
    });
    try {
      navigator.sendBeacon(ENDPOINT, blob);
    } catch {
      // Fallback if sendBeacon fails
      fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ events: batch }),
        keepalive: true,
      }).catch(() => {});
    }
  }

  // --- Public tracking methods ---

  trackPageview() {
    this.enqueue(this.createEvent("pageview"));
  }

  trackSessionStart() {
    this.enqueue(this.createEvent("session_start"));
  }

  trackScroll(scrollY: number, scrollHeight: number) {
    if (this.scrollDebounceTimer) clearTimeout(this.scrollDebounceTimer);

    this.scrollDebounceTimer = setTimeout(() => {
      const viewportHeight = window.innerHeight;
      const maxScroll = scrollHeight - viewportHeight;
      if (maxScroll <= 0) return;

      const depth = Math.min(Math.round((scrollY / maxScroll) * 100), 100);
      if (depth <= this.maxScrollDepth) return;

      this.maxScrollDepth = depth;

      const milestones = [25, 50, 75, 100];
      const newMilestones: number[] = [];
      for (const m of milestones) {
        if (depth >= m && !this.scrollMilestonesReached.has(m)) {
          this.scrollMilestonesReached.add(m);
          newMilestones.push(m);
        }
      }

      if (newMilestones.length > 0) {
        const scrollData: ScrollData = {
          depth,
          maxDepth: this.maxScrollDepth,
          milestones: [...this.scrollMilestonesReached],
        };
        this.enqueue(this.createEvent("scroll", scrollData as unknown as Record<string, unknown>));
      }
    }, 300);
  }

  trackClick(element: HTMLElement) {
    const data: ClickData = {
      elementId: element.id || undefined,
      elementText: element.textContent?.trim().slice(0, 100) || undefined,
      elementTag: element.tagName.toLowerCase(),
      elementClasses: element.className?.toString().slice(0, 200) || undefined,
      href: (element as HTMLAnchorElement).href || element.closest("a")?.href || undefined,
      dataTrack: (element as HTMLElement).dataset?.track || (element.closest("[data-track]") as HTMLElement | null)?.dataset?.track || undefined,
    };
    this.enqueue(this.createEvent("click", data as unknown as Record<string, unknown>));
  }

  trackFormEvent(formId: string, eventType: FormEventData["eventType"], fieldName?: string) {
    if (eventType === "focus" && !this.formTimers.has(formId)) {
      this.formTimers.set(formId, Date.now());
    }

    if (eventType === "input" && fieldName) {
      const counts = this.formFieldCounts.get(formId) ?? { total: 0, filled: new Set<string>() };
      counts.filled.add(fieldName);
      this.formFieldCounts.set(formId, counts);
    }

    const startTime = this.formTimers.get(formId);
    const fieldInfo = this.formFieldCounts.get(formId);

    const data: FormEventData = {
      formId,
      eventType,
      fieldName,
      timeSpent: startTime ? Math.round((Date.now() - startTime) / 1000) : undefined,
      filledFields: fieldInfo?.filled.size,
      fieldCount: fieldInfo?.total,
    };

    this.enqueue(this.createEvent(`form_${eventType}` as AnalyticsEventType, data as unknown as Record<string, unknown>));

    if (eventType === "submit" || eventType === "abandon") {
      this.formTimers.delete(formId);
      this.formFieldCounts.delete(formId);
    }
  }

  registerFormFields(formId: string, fieldCount: number) {
    const existing = this.formFieldCounts.get(formId);
    if (existing) {
      existing.total = fieldCount;
    } else {
      this.formFieldCounts.set(formId, { total: fieldCount, filled: new Set() });
    }
  }

  private trackTimeOnPage() {
    const timeOnPage = Math.round((Date.now() - this.pageLoadTime) / 1000);
    this.enqueue(
      this.createEvent("session_end", {
        timeOnPage,
        maxScrollDepth: this.maxScrollDepth,
      }),
    );
  }

  resetScrollTracking() {
    this.maxScrollDepth = 0;
    this.scrollMilestonesReached.clear();
  }

  destroy() {
    this.destroyed = true;
    if (this.flushTimer) clearInterval(this.flushTimer);
    if (this.scrollDebounceTimer) clearTimeout(this.scrollDebounceTimer);
    this.flushSync();
  }
}
