import type { Metadata } from "next";
import { Poppins, Ubuntu, Inter } from "next/font/google";
import "./globals.css";
import Footer from "@/components/footer";
import MarketingScripts from "@/components/marketing-scripts";
import CriticalStyles from "@/components/critical-styles";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

const ubuntu = Ubuntu({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-ubuntu",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  icons: {
    icon: "/favicon.png",
  },
  title: "FlyLuxSky — Business Flights",
  description: "Your Gateway to Exclusive Business Class Savings",
  openGraph: {
    title: "FlyLuxSky — Business Flights",
    description: "Your Gateway to Exclusive Business Class Savings",
    url: "https://flyluxsky.vercel.app/",
    siteName: "FlyLuxSky",
    images: [
      {
        url: "/og.png", 
        width: 1200,
        height: 630,
        alt: "FlyLuxSky",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <CriticalStyles />

        <link rel="preload" href="/logos/hero/emirates.png" as="image" type="image/png" />
        <link rel="preload" href="/logos/hero/lufthansa.png" as="image" type="image/png" />
        <link rel="preload" href="/logos/hero/qatar.png" as="image" type="image/png" />
        <link rel="preload" href="/logos/hero/swiss.png" as="image" type="image/png" />
        <link rel="preload" href="/logos/hero/turkish.png" as="image" type="image/png" />
        <link rel="preload" href="/logos/hero/united.png" as="image" type="image/png" />
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
      </head>
      <body className={`${poppins.variable} ${ubuntu.variable} ${inter.variable} font-sans`}>
        <MarketingScripts />
        {children}
        <Footer />
      </body>
    </html>
  );
}
