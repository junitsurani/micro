"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#0d0a09",
    fontFamily: "aktiv-grotesk-extended",
  } as React.CSSProperties,
  card: {
    width: "100%",
    maxWidth: 400,
    padding: "48px 40px",
    background: "#1C1A18",
    borderRadius: 12,
    border: "1px solid rgba(181, 144, 109, 0.15)",
    margin: "0 16px",
  } as React.CSSProperties,
  brand: {
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: "0.2em",
    textTransform: "uppercase" as const,
    color: "#B5906D",
    textAlign: "center" as const,
    marginBottom: 8,
  } as React.CSSProperties,
  title: {
    fontSize: 24,
    fontWeight: 300,
    color: "#F5F3EA",
    textAlign: "center" as const,
    marginBottom: 32,
    letterSpacing: "-0.01em",
  } as React.CSSProperties,
  label: {
    display: "block",
    fontSize: 12,
    fontWeight: 500,
    color: "rgba(245, 243, 234, 0.5)",
    marginBottom: 6,
    letterSpacing: "0.05em",
    textTransform: "uppercase" as const,
  } as React.CSSProperties,
  input: {
    width: "100%",
    padding: "12px 16px",
    background: "rgba(245, 243, 234, 0.05)",
    border: "1px solid rgba(245, 243, 234, 0.1)",
    borderRadius: 8,
    color: "#F5F3EA",
    fontSize: 14,
    outline: "none",
    marginBottom: 20,
    boxSizing: "border-box" as const,
    transition: "border-color 0.2s",
  } as React.CSSProperties,
  button: {
    width: "100%",
    padding: "14px",
    background: "#452128",
    color: "#F5F3EA",
    border: "none",
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 600,
    letterSpacing: "0.05em",
    cursor: "pointer",
    transition: "opacity 0.2s",
    marginTop: 4,
  } as React.CSSProperties,
  error: {
    color: "#e57373",
    fontSize: 13,
    textAlign: "center" as const,
    marginBottom: 16,
  } as React.CSSProperties,
};

export default function SecretDoorPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Authentication failed");
        setLoading(false);
        return;
      }

      router.push("/secretdoor/dashboard");
    } catch {
      setError("Connection error");
      setLoading(false);
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <p style={styles.brand}>MICRO by The Fix</p>
        <h1 style={styles.title}>Admin Access</h1>

        {error && <p style={styles.error}>{error}</p>}

        <form onSubmit={handleSubmit}>
          <label style={styles.label}>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            placeholder="admin@example.com"
            required
            autoComplete="email"
          />

          <label style={styles.label}>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            placeholder="••••••••"
            required
            autoComplete="current-password"
          />

          <button
            type="submit"
            style={{
              ...styles.button,
              opacity: loading ? 0.6 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
            disabled={loading}
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
