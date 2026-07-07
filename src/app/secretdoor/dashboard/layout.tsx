"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

const C = {
  bg: "#0d0a09",
  surface: "#1C1A18",
  cream: "#F5F3EA",
  creamMuted: "rgba(245,243,234,0.45)",
  burgundy: "#452128",
  sand: "#B5906D",
  border: "rgba(181,144,109,0.12)",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [authed, setAuthed] = useState<boolean | null>(null);

  useEffect(() => {
    fetch("/api/admin/auth/check")
      .then((r) => {
        if (!r.ok) throw new Error();
        setAuthed(true);
      })
      .catch(() => {
        router.replace("/secretdoor");
      });
  }, [router]);

  async function handleLogout() {
    await fetch("/api/admin/auth/check", { method: "DELETE" });
    router.replace("/secretdoor");
  }

  if (authed === null) {
    return (
      <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: C.creamMuted, fontSize: 14, letterSpacing: "0.1em" }}>Loading…</p>
      </div>
    );
  }

  const navItems = [
    { label: "Overview", href: "/secretdoor/dashboard" },
    { label: "Waitlist", href: "/secretdoor/dashboard/waitlist" },
    { label: "Events", href: "/secretdoor/dashboard/events" },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: C.bg, fontFamily: "aktiv-grotesk-extended" }}>
      {/* Sidebar */}
      <aside style={{
        width: 240,
        background: C.surface,
        borderRight: `1px solid ${C.border}`,
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
      }}>
        <div style={{ padding: "28px 24px 24px", borderBottom: `1px solid ${C.border}` }}>
          <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: C.sand, margin: 0 }}>
            MICRO Admin
          </p>
        </div>
        <nav style={{ padding: "16px 12px", flex: 1 }}>
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: "block",
                  padding: "10px 16px",
                  borderRadius: 6,
                  fontSize: 13,
                  fontWeight: 500,
                  color: active ? C.cream : C.creamMuted,
                  background: active ? "rgba(69,33,40,0.4)" : "transparent",
                  textDecoration: "none",
                  marginBottom: 2,
                  transition: "background 0.15s, color 0.15s",
                }}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div style={{ padding: "16px 12px", borderTop: `1px solid ${C.border}` }}>
          <button
            onClick={handleLogout}
            style={{
              width: "100%",
              padding: "10px 16px",
              background: "transparent",
              border: `1px solid ${C.border}`,
              borderRadius: 6,
              color: C.creamMuted,
              fontSize: 12,
              fontWeight: 500,
              cursor: "pointer",
              transition: "color 0.15s",
              letterSpacing: "0.03em",
            }}
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, overflow: "auto" }}>
        <header style={{
          padding: "20px 32px",
          borderBottom: `1px solid ${C.border}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
          <h1 style={{ fontSize: 16, fontWeight: 500, color: C.cream, margin: 0, letterSpacing: "-0.01em" }}>
            {navItems.find((n) => n.href === pathname)?.label ?? "Dashboard"}
          </h1>
          <span style={{ fontSize: 11, color: C.creamMuted }}>
            {new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </span>
        </header>
        <div style={{ padding: "24px 32px" }}>
          {children}
        </div>
      </main>
    </div>
  );
}
