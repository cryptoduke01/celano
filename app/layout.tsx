import type { Metadata } from "next";
import localFont from "next/font/local";
import { Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Toaster } from "sonner";

// Primary typeface — Clash Grotesk (self-hosted). Headings, body, UI, logotype.
const clash = localFont({
  variable: "--font-clash",
  display: "swap",
  src: [
    { path: "./fonts/ClashGrotesk-400.woff2", weight: "400", style: "normal" },
    { path: "./fonts/ClashGrotesk-500.woff2", weight: "500", style: "normal" },
    { path: "./fonts/ClashGrotesk-600.woff2", weight: "600", style: "normal" },
    { path: "./fonts/ClashGrotesk-700.woff2", weight: "700", style: "normal" },
  ],
});

// Data typeface — every number, address, tx hash, handle. Tabular.
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Celano — Confidential Yield Treasury on Zama",
  description:
    "A confidential yield treasury on Zama FHEVM. Balances live on-chain as ciphertext; decrypt only when you choose. Institutional-grade privacy UX.",
  icons: {
    icon: "/icon",
    apple: "/apple-icon",
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
      className={`${clash.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-[#050505] text-[#f8f8f8]">
        <Providers>{children}</Providers>
        <Toaster position="top-center" richColors closeButton />
      </body>
    </html>
  );
}
