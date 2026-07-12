import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ReplyIQ — AI-Powered Google Review Management",
  description:
    "Automatically reply to Google Business reviews using Gemma AI on AMD GPU infrastructure via Fireworks AI. Built for the AMD Developer Hackathon ACT II.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
