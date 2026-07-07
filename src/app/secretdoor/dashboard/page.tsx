"use client";

import { useEffect, useState, useCallback } from "react";

interface AggregatedStats {
  totalPageviews: number;
  uniqueVisitors: number;
  totalSessions: number;
  topPages: { path: string; views: number }[];
  averageScrollDepth: number;
  scrollMilestoneRates: Record<number, number>;
  formConversionRate: number;
  formEngagement: { focuses: number; inputs: number; submits: number; abandons: number };
  averageTimeOnPage: number;
  topReferrers: { referrer: string; count: number }[];
  deviceBreakdown: { type: string; count: number }[];
  topUtmSources: { source: string; count: number }[];
  hourlyPageviews: Record<number, number>;
  bounceRate: number;
}

interface RecentEvent {
  id: string;
  type: string;
  timestamp: number;
  visitorId: string;
  sessionId: string;
  path: string;
  referrer: string;
  device: { userAgent: string };
}

const C = {
  bg: "#0d0a09",
  surface: "#1C1A18",
  surfaceHover: "#252220",
  cream: "#F5F3EA",
  creamMuted: "rgba(245,243,234,0.45)",
  creamDim: "rgba(245,243,234,0.25)",
  burgundy: "#452128",
  burgundyLight: "rgba(69,33,40,0.5)",
  sand: "#B5906D",
  sandDim: "rgba(181,144,109,0.3)",
  border: "rgba(181,144,109,0.12)",
  green: "#4caf50",
  red: "#e57373",
};

type DateRange = "today" | "7d" | "30d" | "all";

function rangeToParams(range: DateRange): string {
  const now = Date.now();
  switch (range) {
    case "today": return `?from=${now - 86400000}&to=${now}`;
    case "7d": return `?from=${now - 7 * 86400000}&to=${now}`;
    case "30d": return `?from=${now - 30 * 86400000}&to=${now}`;
    default: return "";
  }
}

function formatNum(n: number): string {
  return n.toLocaleString();
}

function formatPct(n: number): string {
  return `${(n * 100).toFixed(1)}%`;
}

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${Math.round(seconds)}s`;
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return `${m}m ${s}s`;
}

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  if (diff < 60000) return "just now";
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return `${Math.floor(diff / 86400000)}d ago`;
}

const cardStyle: React.CSSProperties = {
  background: C.surface,
  borderRadius: 10,
  border: `1px solid ${C.border}`,
  padding: "20px 24px",
};

const cardTitleStyle: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 600,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: C.creamMuted,
  margin: "0 0 16px 0",
};

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div style={cardStyle}>
      <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: C.creamMuted, margin: "0 0 8px 0" }}>
        {label}
      </p>
      <p style={{ fontSize: 28, fontWeight: 300, color: C.cream, margin: 0, letterSpacing: "-0.02em" }}>
        {value}
      </p>
      {sub && <p style={{ fontSize: 12, color: C.sand, margin: "4px 0 0 0" }}>{sub}</p>}
    </div>
  );
}

function ProgressBar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  return (
    <div style={{ height: 6, background: "rgba(245,243,234,0.06)", borderRadius: 3, overflow: "hidden" }}>
      <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: 3, transition: "width 0.4s ease" }} />
    </div>
  );
}

export default function DashboardPage() {
  const [stats, setStats] = useState<AggregatedStats | null>(null);
  const [events, setEvents] = useState<RecentEvent[]>([]);
  const [range, setRange] = useState<DateRange>("all");
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [statsRes, eventsRes] = await Promise.all([
        fetch(`/api/admin/stats${rangeToParams(range)}`),
        fetch("/api/admin/events?limit=50"),
      ]);
      if (statsRes.ok) setStats(await statsRes.json());
      if (eventsRes.ok) {
        const data = await eventsRes.json();
        setEvents(data.events ?? []);
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, [range]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const ranges: { label: string; value: DateRange }[] = [
    { label: "Today", value: "today" },
    { label: "7 Days", value: "7d" },
    { label: "30 Days", value: "30d" },
    { label: "All Time", value: "all" },
  ];

  if (loading && !stats) {
    return (
      <div style={{ textAlign: "center", padding: 60 }}>
        <p style={{ color: C.creamMuted, fontSize: 14 }}>Loading analytics…</p>
      </div>
    );
  }

  const s = stats;

  const maxHourly = s ? Math.max(...Object.values(s.hourlyPageviews), 1) : 1;
  const totalDevices = s ? s.deviceBreakdown.reduce((a, b) => a + b.count, 0) || 1 : 1;

  return (
    <div>
      {/* Date Range Filter */}
      <div style={{ display: "flex", gap: 6, marginBottom: 24 }}>
        {ranges.map((r) => (
          <button
            key={r.value}
            onClick={() => setRange(r.value)}
            style={{
              padding: "8px 16px",
              borderRadius: 6,
              border: range === r.value ? "none" : `1px solid ${C.border}`,
              background: range === r.value ? C.burgundy : "transparent",
              color: range === r.value ? C.cream : C.creamMuted,
              fontSize: 12,
              fontWeight: 500,
              cursor: "pointer",
              transition: "all 0.15s",
            }}
          >
            {r.label}
          </button>
        ))}
        <button
          onClick={fetchData}
          style={{
            marginLeft: "auto",
            padding: "8px 16px",
            borderRadius: 6,
            border: `1px solid ${C.border}`,
            background: "transparent",
            color: C.creamMuted,
            fontSize: 12,
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          Refresh
        </button>
      </div>

      {s && (
        <>
          {/* Overview Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 24 }}>
            <StatCard label="Total Pageviews" value={formatNum(s.totalPageviews)} />
            <StatCard label="Unique Visitors" value={formatNum(s.uniqueVisitors)} />
            <StatCard label="Total Sessions" value={formatNum(s.totalSessions)} />
            <StatCard label="Bounce Rate" value={formatPct(s.bounceRate)} />
            <StatCard label="Avg Time on Page" value={formatDuration(s.averageTimeOnPage)} />
            <StatCard label="Form Conversion" value={formatPct(s.formConversionRate)} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
            {/* Top Pages */}
            <div style={cardStyle}>
              <h3 style={cardTitleStyle}>Top Pages</h3>
              {s.topPages.length === 0 ? (
                <p style={{ color: C.creamDim, fontSize: 13 }}>No data yet</p>
              ) : (
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr>
                      <th style={{ textAlign: "left", fontSize: 11, color: C.creamMuted, fontWeight: 500, paddingBottom: 8, borderBottom: `1px solid ${C.border}` }}>Path</th>
                      <th style={{ textAlign: "right", fontSize: 11, color: C.creamMuted, fontWeight: 500, paddingBottom: 8, borderBottom: `1px solid ${C.border}` }}>Views</th>
                    </tr>
                  </thead>
                  <tbody>
                    {s.topPages.map((p) => (
                      <tr key={p.path}>
                        <td style={{ padding: "8px 0", fontSize: 13, color: C.cream, borderBottom: `1px solid ${C.border}` }}>{p.path}</td>
                        <td style={{ padding: "8px 0", fontSize: 13, color: C.sand, textAlign: "right", borderBottom: `1px solid ${C.border}`, fontVariantNumeric: "tabular-nums" }}>{formatNum(p.views)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Scroll Depth */}
            <div style={cardStyle}>
              <h3 style={cardTitleStyle}>Scroll Depth</h3>
              <p style={{ fontSize: 12, color: C.creamMuted, margin: "0 0 16px 0" }}>
                Avg depth: <span style={{ color: C.sand }}>{s.averageScrollDepth.toFixed(1)}%</span>
              </p>
              {[25, 50, 75, 100].map((milestone) => (
                <div key={milestone} style={{ marginBottom: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: 12, color: C.cream }}>{milestone}%</span>
                    <span style={{ fontSize: 12, color: C.sand }}>{formatPct(s.scrollMilestoneRates[milestone] ?? 0)}</span>
                  </div>
                  <ProgressBar value={(s.scrollMilestoneRates[milestone] ?? 0) * 100} max={100} color={C.sand} />
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
            {/* Form Engagement */}
            <div style={cardStyle}>
              <h3 style={cardTitleStyle}>Form Engagement</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {([
                  { label: "Focuses", value: s.formEngagement.focuses, color: C.sand },
                  { label: "Inputs", value: s.formEngagement.inputs, color: C.cream },
                  { label: "Submits", value: s.formEngagement.submits, color: C.green },
                  { label: "Abandons", value: s.formEngagement.abandons, color: C.red },
                ] as const).map((item) => (
                  <div key={item.label} style={{ padding: "12px 16px", background: "rgba(245,243,234,0.03)", borderRadius: 6 }}>
                    <p style={{ fontSize: 10, color: C.creamMuted, margin: "0 0 4px 0", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600 }}>{item.label}</p>
                    <p style={{ fontSize: 22, fontWeight: 300, color: item.color, margin: 0 }}>{formatNum(item.value)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Device Breakdown */}
            <div style={cardStyle}>
              <h3 style={cardTitleStyle}>Device Breakdown</h3>
              {s.deviceBreakdown.length === 0 ? (
                <p style={{ color: C.creamDim, fontSize: 13 }}>No data yet</p>
              ) : (
                s.deviceBreakdown.map((d) => {
                  const pct = (d.count / totalDevices) * 100;
                  const colors: Record<string, string> = { desktop: C.sand, mobile: C.burgundy, tablet: C.cream };
                  return (
                    <div key={d.type} style={{ marginBottom: 14 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                        <span style={{ fontSize: 13, color: C.cream, textTransform: "capitalize" }}>{d.type}</span>
                        <span style={{ fontSize: 12, color: C.creamMuted }}>{formatNum(d.count)} ({pct.toFixed(1)}%)</span>
                      </div>
                      <ProgressBar value={pct} max={100} color={colors[d.type] ?? C.sand} />
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
            {/* Top Referrers */}
            <div style={cardStyle}>
              <h3 style={cardTitleStyle}>Top Referrers</h3>
              {s.topReferrers.length === 0 ? (
                <p style={{ color: C.creamDim, fontSize: 13 }}>No referrer data</p>
              ) : (
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <tbody>
                    {s.topReferrers.map((r) => (
                      <tr key={r.referrer}>
                        <td style={{ padding: "6px 0", fontSize: 13, color: C.cream, borderBottom: `1px solid ${C.border}`, maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.referrer}</td>
                        <td style={{ padding: "6px 0", fontSize: 13, color: C.sand, textAlign: "right", borderBottom: `1px solid ${C.border}`, fontVariantNumeric: "tabular-nums" }}>{formatNum(r.count)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* UTM Sources */}
            <div style={cardStyle}>
              <h3 style={cardTitleStyle}>UTM Sources</h3>
              {s.topUtmSources.length === 0 ? (
                <p style={{ color: C.creamDim, fontSize: 13 }}>No UTM data</p>
              ) : (
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <tbody>
                    {s.topUtmSources.map((u) => (
                      <tr key={u.source}>
                        <td style={{ padding: "6px 0", fontSize: 13, color: C.cream, borderBottom: `1px solid ${C.border}` }}>{u.source}</td>
                        <td style={{ padding: "6px 0", fontSize: 13, color: C.sand, textAlign: "right", borderBottom: `1px solid ${C.border}`, fontVariantNumeric: "tabular-nums" }}>{formatNum(u.count)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Hourly Pageviews */}
          <div style={{ ...cardStyle, marginBottom: 24 }}>
            <h3 style={cardTitleStyle}>Hourly Pageviews</h3>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 120 }}>
              {Array.from({ length: 24 }, (_, h) => {
                const count = s.hourlyPageviews[h] ?? 0;
                const heightPct = maxHourly > 0 ? (count / maxHourly) * 100 : 0;
                return (
                  <div key={h} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                    <div
                      style={{
                        width: "100%",
                        minHeight: 2,
                        height: `${heightPct}%`,
                        background: count > 0 ? C.sand : "rgba(245,243,234,0.06)",
                        borderRadius: "2px 2px 0 0",
                        transition: "height 0.3s ease",
                      }}
                      title={`${h}:00, ${count} views`}
                    />
                    <span style={{ fontSize: 9, color: C.creamDim }}>{h}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Events */}
          <div style={cardStyle}>
            <h3 style={cardTitleStyle}>Recent Events</h3>
            {events.length === 0 ? (
              <p style={{ color: C.creamDim, fontSize: 13 }}>No events recorded yet</p>
            ) : (
              <div style={{ maxHeight: 400, overflow: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr>
                      {["Type", "Path", "Visitor", "Session", "Time"].map((h) => (
                        <th key={h} style={{ textAlign: "left", fontSize: 10, color: C.creamMuted, fontWeight: 600, padding: "6px 8px", borderBottom: `1px solid ${C.border}`, textTransform: "uppercase", letterSpacing: "0.08em", position: "sticky", top: 0, background: C.surface }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {events.map((e) => (
                      <tr key={e.id}>
                        <td style={{ padding: "6px 8px", fontSize: 12, color: C.sand, borderBottom: `1px solid ${C.border}` }}>
                          <span style={{ background: C.burgundyLight, padding: "2px 8px", borderRadius: 4, fontSize: 11 }}>{e.type}</span>
                        </td>
                        <td style={{ padding: "6px 8px", fontSize: 12, color: C.cream, borderBottom: `1px solid ${C.border}` }}>{e.path}</td>
                        <td style={{ padding: "6px 8px", fontSize: 11, color: C.creamMuted, borderBottom: `1px solid ${C.border}`, fontFamily: "monospace" }}>{e.visitorId?.slice(0, 8)}…</td>
                        <td style={{ padding: "6px 8px", fontSize: 11, color: C.creamMuted, borderBottom: `1px solid ${C.border}`, fontFamily: "monospace" }}>{e.sessionId?.slice(0, 8)}…</td>
                        <td style={{ padding: "6px 8px", fontSize: 11, color: C.creamMuted, borderBottom: `1px solid ${C.border}`, whiteSpace: "nowrap" }}>{timeAgo(e.timestamp)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
