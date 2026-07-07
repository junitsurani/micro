"use client";

import { useCallback, useEffect, useState } from "react";

type WaitlistSubmission = {
  id: string;
  createdAt: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  consent: boolean;
  source: string;
};

const C = {
  surface: "#1C1A18",
  cream: "#F5F3EA",
  creamMuted: "rgba(245,243,234,0.45)",
  creamDim: "rgba(245,243,234,0.25)",
  burgundyLight: "rgba(69,33,40,0.5)",
  sand: "#B5906D",
  border: "rgba(181,144,109,0.12)",
  green: "#81c784",
};

function formatTime(value: string) {
  return new Date(value).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function WaitlistPage() {
  const [submissions, setSubmissions] = useState<WaitlistSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [limit, setLimit] = useState(100);

  const fetchSubmissions = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/waitlist?limit=${limit}`);
      if (response.ok) {
        const data = await response.json();
        setSubmissions(data.submissions ?? []);
      }
    } catch {
      // Keep the admin view quiet if the network fails.
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 24, alignItems: "center" }}>
        <select
          value={limit}
          onChange={(event) => setLimit(Number(event.target.value))}
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
          <option value={250}>Last 250</option>
          <option value={500}>Last 500</option>
        </select>
        <button
          onClick={fetchSubmissions}
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
        <a
          href="/api/admin/waitlist?format=csv&limit=5000"
          style={{
            padding: "8px 16px",
            borderRadius: 6,
            border: `1px solid ${C.border}`,
            background: "transparent",
            color: C.sand,
            fontSize: 12,
            fontWeight: 500,
            textDecoration: "none",
          }}
        >
          Export CSV
        </a>
        <span style={{ marginLeft: "auto", fontSize: 12, color: C.creamMuted }}>
          {submissions.length} submissions
        </span>
      </div>

      {loading && submissions.length === 0 ? (
        <p style={{ color: C.creamMuted, fontSize: 14, textAlign: "center", padding: 40 }}>Loading waitlist…</p>
      ) : submissions.length === 0 ? (
        <p style={{ color: C.creamMuted, fontSize: 14, textAlign: "center", padding: 40 }}>No waitlist submissions yet</p>
      ) : (
        <div style={{ background: C.surface, borderRadius: 10, border: `1px solid ${C.border}`, overflow: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 980 }}>
            <thead>
              <tr>
                {["Name", "Email", "Phone", "Source", "Consent", "Message", "Time"].map((heading) => (
                  <th
                    key={heading}
                    style={{
                      textAlign: "left",
                      fontSize: 10,
                      color: C.creamMuted,
                      fontWeight: 600,
                      padding: "10px",
                      borderBottom: `1px solid ${C.border}`,
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      background: C.surface,
                      position: "sticky",
                      top: 0,
                    }}
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {submissions.map((submission) => (
                <tr key={submission.id}>
                  <td style={{ padding: "10px", fontSize: 13, color: C.cream, borderBottom: `1px solid ${C.border}` }}>
                    {submission.name}
                  </td>
                  <td style={{ padding: "10px", fontSize: 13, borderBottom: `1px solid ${C.border}` }}>
                    <a href={`mailto:${submission.email}`} style={{ color: C.sand, textDecoration: "none" }}>
                      {submission.email}
                    </a>
                  </td>
                  <td style={{ padding: "10px", fontSize: 12, color: C.creamMuted, borderBottom: `1px solid ${C.border}` }}>
                    {submission.phone || "-"}
                  </td>
                  <td style={{ padding: "10px", fontSize: 12, borderBottom: `1px solid ${C.border}` }}>
                    <span style={{ background: C.burgundyLight, color: C.sand, padding: "2px 8px", borderRadius: 4 }}>
                      {submission.source}
                    </span>
                  </td>
                  <td style={{ padding: "10px", fontSize: 12, color: submission.consent ? C.green : C.creamDim, borderBottom: `1px solid ${C.border}` }}>
                    {submission.consent ? "Yes" : "No"}
                  </td>
                  <td style={{ padding: "10px", fontSize: 12, color: C.creamMuted, borderBottom: `1px solid ${C.border}`, maxWidth: 360 }}>
                    {submission.message || "-"}
                  </td>
                  <td style={{ padding: "10px", fontSize: 12, color: C.creamMuted, borderBottom: `1px solid ${C.border}`, whiteSpace: "nowrap" }}>
                    {formatTime(submission.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
