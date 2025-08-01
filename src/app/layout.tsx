import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";
import NextTopLoader from "nextjs-toploader";
import { NuqsAdapter } from "nuqs/adapters/next/app";

export const metadata: Metadata = {
  title: "Velocity Motors 🚘",
  description: "A car dealer website with AI 🚗",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Load fonts via CDN */}
        <link
          href="https://fonts.googleapis.com/css2?family=Mulish:wght@400;600;700&family=Roboto:wght@400&display=swap"
          rel="stylesheet"
        />
        <style>{`:root {
          --font-heading: 'Mulish', sans-serif;
          --font-body: 'Roboto', sans-serif;
        }`}</style>
      </head>
      <body
        style={{
          fontFamily: "var(--font-body)",
        }}
        className={cn("antialiased overscroll-none bg-background")}
      >
        <NextTopLoader showSpinner={false} />
        <NuqsAdapter>{children}</NuqsAdapter>
        <Toaster />
      </body>
    </html>
  );
}
