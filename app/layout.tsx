import type { Metadata } from "next";
import { Geist, Geist_Mono, Cinzel, Space_Grotesk, EB_Garamond } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Toaster } from "sonner";

// Primary UI — excellent legibility for dense financial data
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

// Monospace for handles, txs, technical values
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Brand logotype only (Celano wordmark). Restrained use.
const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal"],
});

// Display / section headings — modern premium finance pairing (per refined font systems)
const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

// Long-form (whitepaper, docs)
const ebGaramond = EB_Garamond({
  variable: "--font-eb-garamond",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Celano — Confidential Yield Treasury on Zama",
  description: "Encrypted on-chain positions with real composable privacy. Deposit through ERC-7984, hold ciphertext, and decrypt only when you choose via Zama KMS. Built on Zama FHEVM.",
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
      className={`${geistSans.variable} ${geistMono.variable} ${cinzel.variable} ${spaceGrotesk.variable} ${ebGaramond.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-[#0b0b0c] text-[#f4f4f5]">
        <Providers>{children}</Providers>
        <Toaster position="top-center" richColors closeButton />
      </body>
    </html>
  );
}
