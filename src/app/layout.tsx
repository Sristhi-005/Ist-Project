import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Web Doctor AI",
  description: "AI-powered website analyzer for SEO, speed, accessibility, security, and code quality insights.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
