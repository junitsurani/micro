import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: "noindex, nofollow",
  title: "MICRO Admin",
};

export default function SecretDoorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
