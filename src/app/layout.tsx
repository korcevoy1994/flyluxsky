import type { Metadata } from "next";
import { Poppins, Ubuntu } from "next/font/google";
import "./globals.css";
import Footer from "@/components/footer";
import MarketingScripts from "@/components/marketing-scripts";

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
      <body className={`${poppins.variable} ${ubuntu.variable} font-sans`}>
        <MarketingScripts />
        {children}
        <Footer />
      </body>
    </html>
  );
}
