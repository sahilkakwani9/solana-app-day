import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Providers from "@/components/providers";
import { Barlow_Condensed, Inter } from "next/font/google";
import Navbar from "@/components/Navbar";
import Head from "next/head";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
  variable: "--font-barlow-condensed",
  style: "normal",
});
export const barlowCondensedItalic = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
  variable: "--font-barlow-condensed-italic",
  style: "italic",
});

export const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "Solana App Day",
    template: "Eclipse Poll",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://solana-app-day.vercel.app/",
    title: "Solana App Day voting dashboard",
    siteName: "Solana App Day Poll",
    images: [
      {
        url: "/hero.png",
        width: 1200,
        height: 630,
        alt: "Eclipse Poll Preview",
      },
    ],
  },
  keywords: [
    "eclipse",
    "eclipse polling",
    "community voting",
    "eclipse tracking",
    "real-time polls",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head>
        <link
          rel="icon"
          href="/eclipse-logo.png"
          type="image/x-icon"
          sizes="any"
        />
      </Head>
      <body
        className={`${geistSans.variable} ${barlowCondensedItalic.variable} ${barlowCondensed.variable} ${geistMono.variable} ${inter.variable} antialiased bg-black`}
      >
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
