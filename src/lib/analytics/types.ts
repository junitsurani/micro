export type AnalyticsEventType =
  | "pageview"
  | "scroll"
  | "click"
  | "form_focus"
  | "form_input"
  | "form_submit"
  | "form_abandon"
  | "session_start"
  | "session_end";

export interface AnalyticsEvent {
  id: string;
  type: AnalyticsEventType;
  timestamp: number;
  visitorId: string;
  sessionId: string;
  url: string;
  path: string;
  referrer: string;
  utmParams: UTMParams;
  device: DeviceInfo;
  meta: Record<string, unknown>;
}

export interface UTMParams {
  source?: string;
  medium?: string;
  campaign?: string;
  term?: string;
  content?: string;
}

export interface DeviceInfo {
  userAgent: string;
  language: string;
  screenWidth: number;
  screenHeight: number;
  viewportWidth: number;
  viewportHeight: number;
  devicePixelRatio: number;
  touchSupport: boolean;
  platform: string;
}

export interface ScrollData {
  depth: number; // 0-100
  maxDepth: number;
  milestones: number[]; // which thresholds were crossed: 25, 50, 75, 100
}

export interface ClickData {
  elementId?: string;
  elementText?: string;
  elementTag: string;
  elementClasses?: string;
  href?: string;
  dataTrack?: string;
}

export interface FormEventData {
  formId: string;
  eventType: "focus" | "input" | "submit" | "abandon";
  fieldName?: string;
  fieldCount?: number;
  filledFields?: number;
  timeSpent?: number;
}

export interface AggregatedStats {
  totalPageviews: number;
  uniqueVisitors: number;
  totalSessions: number;
  topPages: { path: string; views: number }[];
  averageScrollDepth: number;
  scrollMilestoneRates: Record<number, number>;
  formConversionRate: number;
  formEngagement: {
    focuses: number;
    inputs: number;
    submits: number;
    abandons: number;
  };
  averageTimeOnPage: number;
  topReferrers: { referrer: string; count: number }[];
  deviceBreakdown: { type: string; count: number }[];
  topUtmSources: { source: string; count: number }[];
  hourlyPageviews: Record<number, number>;
  bounceRate: number;
}

/**
 * Storage adapter interface - implement this for any backend (in-memory, PostgreSQL, etc.)
 */
export interface AnalyticsStore {
  trackEvent(event: AnalyticsEvent): Promise<void>;
  trackEvents(events: AnalyticsEvent[]): Promise<void>;
  getStats(from?: number, to?: number): Promise<AggregatedStats>;
  getEventsBySession(sessionId: string): Promise<AnalyticsEvent[]>;
  getEventsByVisitor(visitorId: string): Promise<AnalyticsEvent[]>;
  getRecentEvents(limit: number): Promise<AnalyticsEvent[]>;
}
