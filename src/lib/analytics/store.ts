import type {
  AnalyticsEvent,
  AnalyticsStore,
  AggregatedStats,
  ScrollData,
  FormEventData,
} from "./types";
import { PostgresAnalyticsStore } from "./postgres-store";

/**
 * In-memory analytics store. Data lives for the lifetime of the server process.
 * Used as a fallback when DATABASE_URL is not configured.
 */
class InMemoryAnalyticsStore implements AnalyticsStore {
  private events: AnalyticsEvent[] = [];
  private sessionIndex = new Map<string, number[]>();
  private visitorIndex = new Map<string, Set<string>>();

  async trackEvent(event: AnalyticsEvent): Promise<void> {
    const idx = this.events.length;
    this.events.push(event);

    const sessionIdxs = this.sessionIndex.get(event.sessionId) ?? [];
    sessionIdxs.push(idx);
    this.sessionIndex.set(event.sessionId, sessionIdxs);

    const visitorSessions = this.visitorIndex.get(event.visitorId) ?? new Set();
    visitorSessions.add(event.sessionId);
    this.visitorIndex.set(event.visitorId, visitorSessions);
  }

  async trackEvents(events: AnalyticsEvent[]): Promise<void> {
    for (const event of events) {
      await this.trackEvent(event);
    }
  }

  async getStats(from?: number, to?: number): Promise<AggregatedStats> {
    const filtered = this.events.filter((e) => {
      if (from && e.timestamp < from) return false;
      if (to && e.timestamp > to) return false;
      return true;
    });

    const pageviews = filtered.filter((e) => e.type === "pageview");
    const scrollEvents = filtered.filter((e) => e.type === "scroll");
    const formEvents = filtered.filter(
      (e) => e.type === "form_focus" || e.type === "form_input" || e.type === "form_submit" || e.type === "form_abandon",
    );

    const uniqueVisitors = new Set(filtered.map((e) => e.visitorId)).size;
    const uniqueSessions = new Set(filtered.map((e) => e.sessionId)).size;

    // Top pages
    const pageCounts = new Map<string, number>();
    for (const pv of pageviews) {
      pageCounts.set(pv.path, (pageCounts.get(pv.path) ?? 0) + 1);
    }
    const topPages = [...pageCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([path, views]) => ({ path, views }));

    // Scroll depth
    const scrollDepths: number[] = [];
    const milestoneCounts: Record<number, number> = { 25: 0, 50: 0, 75: 0, 100: 0 };
    for (const se of scrollEvents) {
      const data = se.meta as unknown as ScrollData;
      if (data?.maxDepth != null) scrollDepths.push(data.maxDepth);
      if (data?.milestones) {
        for (const m of data.milestones) {
          if (m in milestoneCounts) milestoneCounts[m]++;
        }
      }
    }
    const avgScrollDepth = scrollDepths.length > 0
      ? scrollDepths.reduce((a, b) => a + b, 0) / scrollDepths.length
      : 0;
    const totalScrollEvents = scrollEvents.length || 1;
    const scrollMilestoneRates = Object.fromEntries(
      Object.entries(milestoneCounts).map(([k, v]) => [Number(k), v / totalScrollEvents]),
    );

    // Form engagement
    const formEngagement = { focuses: 0, inputs: 0, submits: 0, abandons: 0 };
    for (const fe of formEvents) {
      const data = fe.meta as unknown as FormEventData;
      switch (data?.eventType ?? fe.type.replace("form_", "")) {
        case "focus": formEngagement.focuses++; break;
        case "input": formEngagement.inputs++; break;
        case "submit": formEngagement.submits++; break;
        case "abandon": formEngagement.abandons++; break;
      }
    }
    const formStarts = formEngagement.focuses || 1;
    const formConversionRate = formEngagement.submits / formStarts;

    // Time on page: difference between first and last event per session
    const sessionTimes: number[] = [];
    for (const [, idxs] of this.sessionIndex) {
      const sessionEvents = idxs
        .map((i) => this.events[i])
        .filter((e) => {
          if (from && e.timestamp < from) return false;
          if (to && e.timestamp > to) return false;
          return true;
        });
      if (sessionEvents.length >= 2) {
        const timestamps = sessionEvents.map((e) => e.timestamp).sort((a, b) => a - b);
        sessionTimes.push(timestamps[timestamps.length - 1] - timestamps[0]);
      }
    }
    const averageTimeOnPage = sessionTimes.length > 0
      ? sessionTimes.reduce((a, b) => a + b, 0) / sessionTimes.length / 1000
      : 0;

    // Top referrers
    const refCounts = new Map<string, number>();
    for (const pv of pageviews) {
      if (pv.referrer) {
        refCounts.set(pv.referrer, (refCounts.get(pv.referrer) ?? 0) + 1);
      }
    }
    const topReferrers = [...refCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([referrer, count]) => ({ referrer, count }));

    // Device breakdown (simple mobile/desktop/tablet heuristic)
    const deviceCounts = new Map<string, number>();
    for (const e of pageviews) {
      const ua = e.device.userAgent.toLowerCase();
      let type = "desktop";
      if (/mobile|android.*mobile|iphone/.test(ua)) type = "mobile";
      else if (/tablet|ipad|android(?!.*mobile)/.test(ua)) type = "tablet";
      deviceCounts.set(type, (deviceCounts.get(type) ?? 0) + 1);
    }
    const deviceBreakdown = [...deviceCounts.entries()].map(([type, count]) => ({ type, count }));

    // Top UTM sources
    const utmCounts = new Map<string, number>();
    for (const e of filtered) {
      if (e.utmParams.source) {
        utmCounts.set(e.utmParams.source, (utmCounts.get(e.utmParams.source) ?? 0) + 1);
      }
    }
    const topUtmSources = [...utmCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([source, count]) => ({ source, count }));

    // Hourly pageviews
    const hourlyPageviews: Record<number, number> = {};
    for (let h = 0; h < 24; h++) hourlyPageviews[h] = 0;
    for (const pv of pageviews) {
      const hour = new Date(pv.timestamp).getHours();
      hourlyPageviews[hour]++;
    }

    // Bounce rate: sessions with only 1 pageview
    const sessionPageviewCounts = new Map<string, number>();
    for (const pv of pageviews) {
      sessionPageviewCounts.set(pv.sessionId, (sessionPageviewCounts.get(pv.sessionId) ?? 0) + 1);
    }
    const bounceSessions = [...sessionPageviewCounts.values()].filter((c) => c === 1).length;
    const bounceRate = sessionPageviewCounts.size > 0
      ? bounceSessions / sessionPageviewCounts.size
      : 0;

    return {
      totalPageviews: pageviews.length,
      uniqueVisitors,
      totalSessions: uniqueSessions,
      topPages,
      averageScrollDepth: Math.round(avgScrollDepth * 100) / 100,
      scrollMilestoneRates,
      formConversionRate: Math.round(formConversionRate * 10000) / 10000,
      formEngagement,
      averageTimeOnPage: Math.round(averageTimeOnPage * 100) / 100,
      topReferrers,
      deviceBreakdown,
      topUtmSources,
      hourlyPageviews,
      bounceRate: Math.round(bounceRate * 10000) / 10000,
    };
  }

  async getEventsBySession(sessionId: string): Promise<AnalyticsEvent[]> {
    const idxs = this.sessionIndex.get(sessionId) ?? [];
    return idxs.map((i) => this.events[i]);
  }

  async getEventsByVisitor(visitorId: string): Promise<AnalyticsEvent[]> {
    const sessions = this.visitorIndex.get(visitorId);
    if (!sessions) return [];
    const events: AnalyticsEvent[] = [];
    for (const sid of sessions) {
      const idxs = this.sessionIndex.get(sid) ?? [];
      for (const i of idxs) events.push(this.events[i]);
    }
    return events.sort((a, b) => a.timestamp - b.timestamp);
  }

  async getRecentEvents(limit: number): Promise<AnalyticsEvent[]> {
    return this.events.slice(-limit).reverse();
  }
}

function createStore(): AnalyticsStore {
  if (process.env.DATABASE_URL) {
    return new PostgresAnalyticsStore(process.env.DATABASE_URL);
  }
  return new InMemoryAnalyticsStore();
}

export const analyticsStore: AnalyticsStore = createStore();
