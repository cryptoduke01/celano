import type { Metadata } from "next";
import { Geist, Geist_Mono, Cinzel, EB_Garamond } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Toaster } from "sonner";

// UI / App body - modern, clean, highly legible
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

// Monospace for handles, code, etc.
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Brand / Headings — Roman/Greek lapidary feel. Carries the temple, sacred, historic story.
const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
  style: ["normal"],
});

// Long-form reading (whitepaper, docs) — scholarly, timeless, excellent for serious content.
const ebGaramond = EB_Garamond({
  variable: "--font-eb-garamond",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Celano — The Castle | Private Yield on Zama",
  description: "Celano. The historic castle that guards your encrypted yield. Shield. Enter the keep. Only you can decrypt. Built with Zama FHE for the Builder Track.",
  icons: {
    icon: '/icon',
    apple: '/apple-icon',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${cinzel.variable} ${ebGaramond.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-zinc-950 text-zinc-200">
        <Providers>{children}</Providers>
        <Toaster position="top-center" richColors closeButton />
      </body>
    </html>
  );
}
