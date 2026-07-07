import { ImageResponse } from "next/og";
import { SITE_DESCRIPTION, SITE_TITLE } from "@/lib/seo/site-config";

export const alt = `${SITE_TITLE} social preview`;
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

const BRAND_MARK_PATH =
  "M29.29,0C13.14,0,0,14.21,0,31.68s13.14,31.68,29.29,31.68,29.29-14.21,29.29-31.68S45.44,0,29.29,0ZM46.32,9.24c-1.17,4.17-16.71,6.78-23.35,7.71-7.05.99-9.48-4.71-9.74-6.29-.4-2.39,1.23-4.84,4.48-6.72,3.11-1.8,7.25-2.89,11.63-2.89,5.28,0,10.92,1.57,15.56,5.36,1.19.97,1.67,1.92,1.41,2.83ZM17.36,49.99v-.09c.09-5.29,2.51-8.7,6.99-9.86,5.4-1.41,14.43-3.89,22.39-6.08l2.63-.72c.41-.11.82-.17,1.21-.17,2.54,0,4.48,2.2,5.02,3.61,1.03,2.65.56,4.77-.68,7.75-3.63,8.79-11.35,15.42-20.15,17.32-6.12,1.32-11.81.03-15.6-3.54-1.94-1.82-1.91-3.56-1.82-8.22ZM52.71,30.69c-.95.35-1.98.59-2.81.79-.32.08-.62.15-.85.21l-22,6.01c-3.74,1.02-6.06.07-7.34-.9-1.73-1.32-2.35-3.2-2.35-4.4v-2.43c0-8.02,4.63-9.98,10.68-11.7,3.46-.99,6.61-1.82,9.66-2.62,1.86-.49,3.78-1,5.78-1.54,5.18-1.41,8.52-1.82,11.21,4.32,1.81,4.13,2.24,7.2,1.32,9.37-.57,1.34-1.68,2.31-3.3,2.91ZM15.83,24.24v24.62c.01,6.74-.65,7.17-1.72,7.31-.99.13-2.33-.45-3-1.06C.91,45.87-1.89,29.48,4.6,16.98c1.3-2.51,2.1-3.22,3.03-3.59.36-.14.72-.21,1.09-.21,1.97,0,3.91,1.88,4.81,3.49,2.23,4.01,2.32,5.22,2.3,7.56Z";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "stretch",
          background: "#0b1012",
          color: "#f6f1e8",
          display: "flex",
          fontFamily: "aktiv-grotesk-extended",
          height: "100%",
          overflow: "hidden",
          position: "relative",
          width: "100%",
        }}
      >
        <div
          style={{
            background:
              "radial-gradient(circle at 78% 22%, rgba(245, 193, 128, .72), rgba(119, 41, 23, .42) 28%, transparent 52%), linear-gradient(115deg, #0b1012 0%, #1f1512 45%, #d4aa78 100%)",
            display: "flex",
            inset: 0,
            opacity: 0.92,
            position: "absolute",
          }}
        />
        <div
          style={{
            background:
              "linear-gradient(90deg, rgba(11, 16, 18, .95) 0%, rgba(11, 16, 18, .72) 42%, rgba(11, 16, 18, .08) 100%)",
            display: "flex",
            inset: 0,
            position: "absolute",
          }}
        />
        <div
          style={{
            alignItems: "flex-start",
            display: "flex",
            flexDirection: "column",
            height: "100%",
            justifyContent: "space-between",
            padding: "72px 80px 68px",
            position: "relative",
            width: "100%",
          }}
        >
          <svg width="86" height="94" viewBox="0 0 58.57 63.36" fill="none">
            <path d={BRAND_MARK_PATH} fill="#f6f1e8" />
          </svg>
          <div style={{ display: "flex", flexDirection: "column", maxWidth: 820 }}>
            <div
              style={{
                fontFamily: "freight-big-pro",
                fontSize: 86,
                letterSpacing: 18,
                lineHeight: 0.94,
                textTransform: "uppercase",
              }}
            >
              MICRO
            </div>
            <div
              style={{
                fontSize: 24,
                fontWeight: 700,
                letterSpacing: 9,
                marginTop: 18,
                textTransform: "uppercase",
              }}
            >
              by The Fix
            </div>
            <div
              style={{
                color: "rgba(246, 241, 232, .84)",
                fontSize: 28,
                lineHeight: 1.26,
                marginTop: 42,
                maxWidth: 760,
              }}
            >
              {SITE_DESCRIPTION}
            </div>
          </div>
          <div
            style={{
              color: "rgba(246, 241, 232, .74)",
              display: "flex",
              fontSize: 22,
              justifyContent: "space-between",
              letterSpacing: 5,
              textTransform: "uppercase",
              width: "100%",
            }}
          >
            <span>Chelsea Wellness Space</span>
            <span>microbythefix.com</span>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
