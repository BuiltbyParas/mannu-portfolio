import type { Metadata, Viewport } from "next";
import { Funnel_Display, Funnel_Sans, Geist_Mono } from "next/font/google";
import { InlineScript } from "@/components/InlineScript";
import "./globals.css";

// Funnel Display: tapering joins give the letters a drawn, inquisitive edge
// while staying a plain grotesk. Funnel Sans is its quiet text companion.
const display = Funnel_Display({ subsets: ["latin"], variable: "--font-funnel-display", display: "swap" });

const sans = Funnel_Sans({ subsets: ["latin"], variable: "--font-funnel-sans", display: "swap" });

// Only for the one real line of C on the page.
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono", display: "swap", weight: ["400"] });

export const metadata: Metadata = {
  title: "Mannu, BCA student at Lovely Professional University",
  description:
    "Mannu is a first-year BCA student at Lovely Professional University, building her foundations in C programming and mathematical problem-solving. Curiosity, built one problem at a time.",
};

export const viewport: Viewport = {
  themeColor: "#f7f7f2",
  colorScheme: "light",
};

/*
 * Marks the document before first paint: `js` means scripts run, `motion` means
 * the visitor has not asked for reduced motion. CSS uses these to hide the
 * opening's entrance elements (and the still ribbons the 3D scene replaces)
 * only when that will actually happen.
 */
const BOOT = `(function(c){c.add("js");try{if(matchMedia("(prefers-reduced-motion: no-preference)").matches)c.add("motion")}catch(e){}})(document.documentElement.classList)`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <InlineScript html={BOOT} />
      </head>
      <body>{children}</body>
    </html>
  );
}
