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
  title: "SVM Conference Bangkok 2024 | Solana App Day",
  description:
    "Join us at SVM Conference in Bangkok, November 15-16, featuring Solana App Day. Watch 50 top Solana projects pitch live, participate in onchain voting, and connect with the most active developers in the ecosystem.",
  openGraph: {
    title: "SVM Conference Bangkok 2024 | Solana App Day",
    description:
      "50 top Solana projects, live pitches, onchain voting - Join the biggest Solana event at Devcon!",
    type: "website",
    siteName: "SVM Conference",
    locale: "en_US",
    images: [
      {
        url: "https://pbs.twimg.com/card_img/1849445758019543040/0Gp801MU?format=jpg&name=900x900",
        width: 900,
        height: 900,
        alt: "SVM Conference Bangkok 2024",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SVM Conference Bangkok 2024 | Solana App Day",
    description:
      "50 Solana projects, live pitches & onchain voting - Nov 15-16 in Bangkok",
    creator: "@EclipseFND",
    images: [
      "https://pbs.twimg.com/card_img/1849445758019543040/0Gp801MU?format=jpg&name=900x900",
    ],
  },
  keywords: [
    "SVM Conference",
    "Solana",
    "Blockchain",
    "Devcon",
    "Bangkok",
    "Cryptocurrency",
    "Web3",
    "DApp",
    "Blockchain Conference",
  ],
  authors: [{ name: "Solana App Day" }],
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
