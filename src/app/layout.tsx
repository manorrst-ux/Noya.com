import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Noya AI Studio",
  description: "AI-powered YouTube Shorts automation dashboard."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
