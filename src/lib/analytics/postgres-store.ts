import { Pool } from "pg";
import type {
  AnalyticsEvent,
  AnalyticsStore,
  AggregatedStats,
} from "./types";

const INIT_SQL = `
CREATE TABLE IF NOT EXISTS analytics_events (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  timestamp BIGINT NOT NULL,
  visitor_id TEXT NOT NULL,
  session_id TEXT NOT NULL,
  url TEXT,
  path TEXT,
  referrer TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_term TEXT,
  utm_content TEXT,
  device_user_agent TEXT,
  device_language TEXT,
  screen_width INT,
  screen_height INT,
  viewport_width INT,
  viewport_height INT,
  device_pixel_ratio REAL,
  touch_support BOOLEAN,
  platform TEXT,
  meta JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ae_visitor_id ON analytics_events (visitor_id);
CREATE INDEX IF NOT EXISTS idx_ae_session_id ON analytics_events (session_id);
CREATE INDEX IF NOT EXISTS idx_ae_type ON analytics_events (type);
CREATE INDEX IF NOT EXISTS idx_ae_timestamp ON analytics_events (timestamp);
CREATE INDEX IF NOT EXISTS idx_ae_path ON analytics_events (path);
`;

function rowToEvent(row: Record<string, unknown>): AnalyticsEvent {
  return {
    id: row.id as string,
    type: row.type as AnalyticsEvent["type"],
    timestamp: Number(row.timestamp),
    visitorId: row.visitor_id as string,
    sessionId: row.session_id as string,
    url: (row.url as string) ?? "",
    path: (row.path as string) ?? "",
    referrer: (row.referrer as string) ?? "",
    utmParams: {
      source: row.utm_source as string | undefined,
      medium: row.utm_medium as string | undefined,
      campaign: row.utm_campaign as string | undefined,
      term: row.utm_term as string | undefined,
      content: row.utm_content as string | undefined,
    },
    device: {
      userAgent: (row.device_user_agent as string) ?? "",
      language: (row.device_language as string) ?? "",
      screenWidth: (row.screen_width as number) ?? 0,
      screenHeight: (row.screen_height as number) ?? 0,
      viewportWidth: (row.viewport_width as number) ?? 0,
      viewportHeight: (row.viewport_height as number) ?? 0,
      devicePixelRatio: (row.device_pixel_ratio as number) ?? 1,
      touchSupport: (row.touch_support as boolean) ?? false,
      platform: (row.platform as string) ?? "",
    },
    meta: (row.meta as Record<string, unknown>) ?? {},
  };
}

export class PostgresAnalyticsStore implements AnalyticsStore {
  private pool: Pool;
  private initialized = false;

  constructor(connectionString: string) {
    this.pool = new Pool({
      connectionString,
      ssl: { rejectUnauthorized: false },
      max: 10,
      idleTimeoutMillis: 30_000,
    });
  }

  private async ensureTables(): Promise<void> {
    if (this.initialized) return;
    await this.pool.query(INIT_SQL);
    this.initialized = true;
  }

  async trackEvent(event: AnalyticsEvent): Promise<void> {
    await this.ensureTables();
    await this.pool.query(
      `INSERT INTO analytics_events
        (id, type, timestamp, visitor_id, session_id, url, path, referrer,
         utm_source, utm_medium, utm_campaign, utm_term, utm_content,
         device_user_agent, device_language, screen_width, screen_height,
         viewport_width, viewport_height, device_pixel_ratio, touch_support,
         platform, meta)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23)
       ON CONFLICT (id) DO NOTHING`,
      [
        event.id,
        event.type,
        event.timestamp,
        event.visitorId,
        event.sessionId,
        event.url,
        event.path,
        event.referrer,
        event.utmParams.source ?? null,
        event.utmParams.medium ?? null,
        event.utmParams.campaign ?? null,
        event.utmParams.term ?? null,
        event.utmParams.content ?? null,
        event.device.userAgent,
        event.device.language,
        event.device.screenWidth,
        event.device.screenHeight,
        event.device.viewportWidth,
        event.device.viewportHeight,
        event.device.devicePixelRatio,
        event.device.touchSupport,
        event.device.platform,
        JSON.stringify(event.meta),
      ],
    );
  }

  async trackEvents(events: AnalyticsEvent[]): Promise<void> {
    if (events.length === 0) return;
    await this.ensureTables();

    const cols = [
      "id", "type", "timestamp", "visitor_id", "session_id", "url", "path",
      "referrer", "utm_source", "utm_medium", "utm_campaign", "utm_term",
      "utm_content", "device_user_agent", "device_language", "screen_width",
      "screen_height", "viewport_width", "viewport_height",
      "device_pixel_ratio", "touch_support", "platform", "meta",
    ];
    const paramCount = cols.length;
    const placeholders: string[] = [];
    const values: unknown[] = [];

    for (let i = 0; i < events.length; i++) {
      const e = events[i];
      const offset = i * paramCount;
      placeholders.push(
        `(${cols.map((_, j) => `$${offset + j + 1}`).join(",")})`,
      );
      values.push(
        e.id, e.type, e.timestamp, e.visitorId, e.sessionId,
        e.url, e.path, e.referrer,
        e.utmParams.source ?? null, e.utmParams.medium ?? null,
        e.utmParams.campaign ?? null, e.utmParams.term ?? null,
        e.utmParams.content ?? null,
        e.device.userAgent, e.device.language,
        e.device.screenWidth, e.device.screenHeight,
        e.device.viewportWidth, e.device.viewportHeight,
        e.device.devicePixelRatio, e.device.touchSupport,
        e.device.platform, JSON.stringify(e.meta),
      );
    }

    await this.pool.query(
      `INSERT INTO analytics_events (${cols.join(",")})
       VALUES ${placeholders.join(",")}
       ON CONFLICT (id) DO NOTHING`,
      values,
    );
  }

  async getStats(from?: number, to?: number): Promise<AggregatedStats> {
    await this.ensureTables();

    const conditions: string[] = [];
    const params: unknown[] = [];
    if (from != null) {
      params.push(from);
      conditions.push(`timestamp >= $${params.length}`);
    }
    if (to != null) {
      params.push(to);
      conditions.push(`timestamp <= $${params.length}`);
    }
    const where = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const basicQ = `
      SELECT
        COUNT(*) FILTER (WHERE type = 'pageview') AS total_pageviews,
        COUNT(DISTINCT visitor_id) AS unique_visitors,
        COUNT(DISTINCT session_id) AS total_sessions
      FROM analytics_events ${where}`;
    const basicRes = await this.pool.query(basicQ, params);
    const basic = basicRes.rows[0];

    const topPagesQ = `
      SELECT path, COUNT(*) AS views
      FROM analytics_events ${where} ${where ? "AND" : "WHERE"} type = 'pageview'
      GROUP BY path ORDER BY views DESC LIMIT 10`;
    const topPagesRes = await this.pool.query(topPagesQ, params);
    const topPages = topPagesRes.rows.map((r: Record<string, unknown>) => ({
      path: r.path as string,
      views: Number(r.views),
    }));

    const scrollQ = `
      SELECT meta FROM analytics_events ${where} ${where ? "AND" : "WHERE"} type = 'scroll'`;
    const scrollRes = await this.pool.query(scrollQ, params);
    let avgScrollDepth = 0;
    const milestoneCounts: Record<number, number> = { 25: 0, 50: 0, 75: 0, 100: 0 };
    const scrollDepths: number[] = [];
    for (const row of scrollRes.rows) {
      const data = row.meta as Record<string, unknown> | null;
      if (data?.maxDepth != null) scrollDepths.push(Number(data.maxDepth));
      if (Array.isArray(data?.milestones)) {
        for (const m of data.milestones as number[]) {
          if (m in milestoneCounts) milestoneCounts[m]++;
        }
      }
    }
    if (scrollDepths.length > 0) {
      avgScrollDepth = scrollDepths.reduce((a, b) => a + b, 0) / scrollDepths.length;
    }
    const totalScrollEvents = scrollRes.rows.length || 1;
    const scrollMilestoneRates = Object.fromEntries(
      Object.entries(milestoneCounts).map(([k, v]) => [Number(k), v / totalScrollEvents]),
    );

    const formQ = `
      SELECT type, meta FROM analytics_events
      ${where} ${where ? "AND" : "WHERE"} type IN ('form_focus','form_input','form_submit','form_abandon')`;
    const formRes = await this.pool.query(formQ, params);
    const formEngagement = { focuses: 0, inputs: 0, submits: 0, abandons: 0 };
    for (const row of formRes.rows) {
      const data = row.meta as Record<string, unknown> | null;
      const eventType = (data?.eventType as string) ?? (row.type as string).replace("form_", "");
      switch (eventType) {
        case "focus": formEngagement.focuses++; break;
        case "input": formEngagement.inputs++; break;
        case "submit": formEngagement.submits++; break;
        case "abandon": formEngagement.abandons++; break;
      }
    }
    const formStarts = formEngagement.focuses || 1;
    const formConversionRate = formEngagement.submits / formStarts;

    const sessionTimeQ = `
      SELECT session_id,
        MIN(timestamp) AS min_ts,
        MAX(timestamp) AS max_ts,
        COUNT(*) AS cnt
      FROM analytics_events ${where}
      GROUP BY session_id HAVING COUNT(*) >= 2`;
    const sessionTimeRes = await this.pool.query(sessionTimeQ, params);
    const sessionTimes: number[] = [];
    for (const row of sessionTimeRes.rows) {
      sessionTimes.push(Number(row.max_ts) - Number(row.min_ts));
    }
    const averageTimeOnPage = sessionTimes.length > 0
      ? sessionTimes.reduce((a, b) => a + b, 0) / sessionTimes.length / 1000
      : 0;

    const referrerQ = `
      SELECT referrer, COUNT(*) AS count
      FROM analytics_events ${where} ${where ? "AND" : "WHERE"} type = 'pageview' AND referrer != ''
      GROUP BY referrer ORDER BY count DESC LIMIT 10`;
    const referrerRes = await this.pool.query(referrerQ, params);
    const topReferrers = referrerRes.rows.map((r: Record<string, unknown>) => ({
      referrer: r.referrer as string,
      count: Number(r.count),
    }));

    const deviceQ = `
      SELECT device_user_agent FROM analytics_events
      ${where} ${where ? "AND" : "WHERE"} type = 'pageview'`;
    const deviceRes = await this.pool.query(deviceQ, params);
    const deviceCounts = new Map<string, number>();
    for (const row of deviceRes.rows) {
      const ua = ((row.device_user_agent as string) ?? "").toLowerCase();
      let type = "desktop";
      if (/mobile|android.*mobile|iphone/.test(ua)) type = "mobile";
      else if (/tablet|ipad|android(?!.*mobile)/.test(ua)) type = "tablet";
      deviceCounts.set(type, (deviceCounts.get(type) ?? 0) + 1);
    }
    const deviceBreakdown = [...deviceCounts.entries()].map(([type, count]) => ({ type, count }));

    const utmQ = `
      SELECT utm_source AS source, COUNT(*) AS count
      FROM analytics_events ${where} ${where ? "AND" : "WHERE"} utm_source IS NOT NULL AND utm_source != ''
      GROUP BY utm_source ORDER BY count DESC LIMIT 10`;
    const utmRes = await this.pool.query(utmQ, params);
    const topUtmSources = utmRes.rows.map((r: Record<string, unknown>) => ({
      source: r.source as string,
      count: Number(r.count),
    }));

    const hourlyQ = `
      SELECT EXTRACT(HOUR FROM TO_TIMESTAMP(timestamp / 1000.0)) AS hour, COUNT(*) AS count
      FROM analytics_events ${where} ${where ? "AND" : "WHERE"} type = 'pageview'
      GROUP BY hour ORDER BY hour`;
    const hourlyRes = await this.pool.query(hourlyQ, params);
    const hourlyPageviews: Record<number, number> = {};
    for (let h = 0; h < 24; h++) hourlyPageviews[h] = 0;
    for (const row of hourlyRes.rows) {
      hourlyPageviews[Number(row.hour)] = Number(row.count);
    }

    const bounceQ = `
      SELECT session_id, COUNT(*) AS pvs
      FROM analytics_events ${where} ${where ? "AND" : "WHERE"} type = 'pageview'
      GROUP BY session_id`;
    const bounceRes = await this.pool.query(bounceQ, params);
    let bounceSessions = 0;
    for (const row of bounceRes.rows) {
      if (Number(row.pvs) === 1) bounceSessions++;
    }
    const totalSessionsWithPv = bounceRes.rows.length;
    const bounceRate = totalSessionsWithPv > 0 ? bounceSessions / totalSessionsWithPv : 0;

    return {
      totalPageviews: Number(basic.total_pageviews),
      uniqueVisitors: Number(basic.unique_visitors),
      totalSessions: Number(basic.total_sessions),
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
    await this.ensureTables();
    const res = await this.pool.query(
      `SELECT * FROM analytics_events WHERE session_id = $1 ORDER BY timestamp`,
      [sessionId],
    );
    return res.rows.map(rowToEvent);
  }

  async getEventsByVisitor(visitorId: string): Promise<AnalyticsEvent[]> {
    await this.ensureTables();
    const res = await this.pool.query(
      `SELECT * FROM analytics_events WHERE visitor_id = $1 ORDER BY timestamp`,
      [visitorId],
    );
    return res.rows.map(rowToEvent);
  }

  async getRecentEvents(limit: number): Promise<AnalyticsEvent[]> {
    await this.ensureTables();
    const res = await this.pool.query(
      `SELECT * FROM analytics_events ORDER BY timestamp DESC LIMIT $1`,
      [limit],
    );
    return res.rows.map(rowToEvent);
  }
}
