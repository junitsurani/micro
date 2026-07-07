"use client";

import { Fragment, useEffect, useState, useCallback } from "react";

interface AnalyticsEvent {
  id: string;
  type: string;
  timestamp: number;
  visitorId: string;
  sessionId: string;
  url: string;
  path: string;
  referrer: string;
  utmParams: { source?: string; medium?: string; campaign?: string };
  device: { userAgent: string; language: string; screenWidth: number; screenHeight: number; platform: string };
  meta: Record<string, unknown>;
}

const C = {
  bg: "#0d0a09",
  surface: "#1C1A18",
  cream: "#F5F3EA",
  creamMuted: "rgba(245,243,234,0.45)",
  creamDim: "rgba(245,243,234,0.25)",
  burgundy: "#452128",
  burgundyLight: "rgba(69,33,40,0.5)",
  sand: "#B5906D",
  border: "rgba(181,144,109,0.12)",
};

function formatTime(ts: number): string {
  return new Date(ts).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

const typeColors: Record<string, string> = {
  pageview: "#B5906D",
  scroll: "#7986cb",
  click: "#4db6ac",
  form_focus: "#ffb74d",
  form_input: "#fff176",
  form_submit: "#81c784",
  form_abandon: "#e57373",
  session_start: "#90caf9",
  session_end: "#ce93d8",
};

export default function EventsPage() {
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [limit, setLimit] = useState(100);
  const [expanded, setExpanded] = useState<string | null>(null);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/events?limit=${limit}`);
      if (res.ok) {
        const data = await res.json();
        setEvents(data.events ?? []);
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 24, alignItems: "center" }}>
        <select
          value={limit}
          onChange={(e) => setLimit(Number(e.target.value))}
          style={{
            padding: "8px 12px",
            borderRadius: 6,
            border: `1px solid ${C.border}`,
            background: C.surface,
            color: C.cream,
            fontSize: 12,
          }}
        >
          <option value={50}>Last 50</option>
          <option value={100}>Last 100</option>
          <option value={200}>Last 200</option>
          <option value={500}>Last 500</option>
        </select>
        <button
          onClick={fetchEvents}
          style={{
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
        <span style={{ marginLeft: "auto", fontSize: 12, color: C.creamMuted }}>
          {events.length} events
        </span>
      </div>

      {loading && events.length === 0 ? (
        <p style={{ color: C.creamMuted, fontSize: 14, textAlign: "center", padding: 40 }}>Loading events…</p>
      ) : events.length === 0 ? (
        <p style={{ color: C.creamMuted, fontSize: 14, textAlign: "center", padding: 40 }}>No events recorded yet</p>
      ) : (
        <div style={{ background: C.surface, borderRadius: 10, border: `1px solid ${C.border}`, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["Type", "Path", "Visitor", "Session", "Referrer", "Platform", "Time"].map((h) => (
                  <th key={h} style={{
                    textAlign: "left",
                    fontSize: 10,
                    color: C.creamMuted,
                    fontWeight: 600,
                    padding: "10px 10px",
                    borderBottom: `1px solid ${C.border}`,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    background: C.surface,
                    position: "sticky",
                    top: 0,
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {events.map((e) => (
                <Fragment key={e.id}>
                  <tr
                    onClick={() => setExpanded(expanded === e.id ? null : e.id)}
                    style={{ cursor: "pointer", transition: "background 0.1s" }}
                    onMouseEnter={(ev) => { (ev.currentTarget as HTMLElement).style.background = "rgba(245,243,234,0.02)"; }}
                    onMouseLeave={(ev) => { (ev.currentTarget as HTMLElement).style.background = "transparent"; }}
                  >
                    <td style={{ padding: "8px 10px", fontSize: 12, borderBottom: `1px solid ${C.border}` }}>
                      <span style={{
                        background: C.burgundyLight,
                        color: typeColors[e.type] ?? C.cream,
                        padding: "2px 8px",
                        borderRadius: 4,
                        fontSize: 11,
                        fontWeight: 500,
                      }}>
                        {e.type}
                      </span>
                    </td>
                    <td style={{ padding: "8px 10px", fontSize: 12, color: C.cream, borderBottom: `1px solid ${C.border}` }}>{e.path}</td>
                    <td style={{ padding: "8px 10px", fontSize: 11, color: C.creamMuted, fontFamily: "monospace", borderBottom: `1px solid ${C.border}` }}>{e.visitorId?.slice(0, 10)}</td>
                    <td style={{ padding: "8px 10px", fontSize: 11, color: C.creamMuted, fontFamily: "monospace", borderBottom: `1px solid ${C.border}` }}>{e.sessionId?.slice(0, 10)}</td>
                    <td style={{ padding: "8px 10px", fontSize: 11, color: C.creamDim, borderBottom: `1px solid ${C.border}`, maxWidth: 140, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{e.referrer || "-"}</td>
                    <td style={{ padding: "8px 10px", fontSize: 11, color: C.creamMuted, borderBottom: `1px solid ${C.border}` }}>{e.device?.platform || "-"}</td>
                    <td style={{ padding: "8px 10px", fontSize: 11, color: C.creamMuted, borderBottom: `1px solid ${C.border}`, whiteSpace: "nowrap" }}>{formatTime(e.timestamp)}</td>
                  </tr>
                  {expanded === e.id && (
                    <tr>
                      <td colSpan={7} style={{ padding: "12px 20px 16px", background: "rgba(245,243,234,0.02)", borderBottom: `1px solid ${C.border}` }}>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, fontSize: 12 }}>
                          <div>
                            <p style={{ color: C.creamMuted, fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 4px 0" }}>Full URL</p>
                            <p style={{ color: C.cream, margin: 0, wordBreak: "break-all" }}>{e.url}</p>
                          </div>
                          <div>
                            <p style={{ color: C.creamMuted, fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 4px 0" }}>Screen</p>
                            <p style={{ color: C.cream, margin: 0 }}>{e.device?.screenWidth}×{e.device?.screenHeight}</p>
                          </div>
                          <div>
                            <p style={{ color: C.creamMuted, fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 4px 0" }}>UTM</p>
                            <p style={{ color: C.cream, margin: 0 }}>
                              {e.utmParams?.source ? `${e.utmParams.source} / ${e.utmParams.medium ?? "-"} / ${e.utmParams.campaign ?? "-"}` : "-"}
                            </p>
                          </div>
                          <div style={{ gridColumn: "1 / -1" }}>
                            <p style={{ color: C.creamMuted, fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 4px 0" }}>User Agent</p>
                            <p style={{ color: C.creamDim, margin: 0, fontSize: 11 }}>{e.device?.userAgent}</p>
                          </div>
                          {Object.keys(e.meta ?? {}).length > 0 && (
                            <div style={{ gridColumn: "1 / -1" }}>
                              <p style={{ color: C.creamMuted, fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 4px 0" }}>Meta</p>
                              <pre style={{ color: C.creamDim, margin: 0, fontSize: 11, whiteSpace: "pre-wrap", fontFamily: "monospace" }}>
                                {JSON.stringify(e.meta, null, 2)}
                              </pre>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
