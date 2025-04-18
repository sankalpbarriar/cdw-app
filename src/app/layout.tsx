import type { Metadata } from "next";
import "./globals.css";
import { Mulish, Roboto } from 'next/font/google'
import { cn } from "@/lib/utils";
export const metadata: Metadata = {
  title: "cdw 🚘 ",
  description: "A car dealer website with AI 🚗",
};
import { Toaster } from "@/components/ui/sonner";
import NextTopLoader from 'nextjs-toploader';
import { NuqsAdapter } from 'nuqs/adapters/next/app'

const mulish = Mulish({
  weight: "variable",
  subsets: ['latin'],
  variable: "--font-heading",
  display: "swap"
})
const roboto = Roboto({
  weight: "400",
  subsets: ['latin'],
  variable: "--font-body",
  display: "swap"
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn('antialiased overscroll-none bg-background', roboto.variable, mulish.variable)} >
        <NextTopLoader showSpinner={false} />
        <NuqsAdapter>{children}</NuqsAdapter>
        <Toaster />
      </body>
    </html>
  );
}
