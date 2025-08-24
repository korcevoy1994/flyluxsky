import type { Metadata } from "next";
import { Poppins, Ubuntu } from "next/font/google";
import "./globals.css";
import Footer from "@/components/footer";
import MarketingScripts from "@/components/marketing-scripts";
import CriticalStyles from "@/components/critical-styles";
import ResourcePreloader from "@/components/resource-preloader";

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
  metadataBase: new URL("https://flyluxsky.vercel.app"),
  icons: {
    icon: [
      { url: "/favicon-16x16.svg", sizes: "16x16", type: "image/svg+xml" },
      { url: "/favicon-32x32.svg", sizes: "32x32", type: "image/svg+xml" },
      { url: "/favicon.png", sizes: "192x192", type: "image/png" }
    ],
    apple: "/apple-touch-icon.svg",
  },
  manifest: "/manifest.json",
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
  twitter: {
    card: "summary_large_image",
    title: "FlyLuxSky — Business Flights",
    description: "Your Gateway to Exclusive Business Class Savings",
    images: ["/og.png"],
  },
  robots: {
    index: true,
    follow: true,
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

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": ["Organization", "TravelAgency"],
              name: "FlyLuxSky",
              alternateName: "Fly Lux Sky",
              url: "https://flyluxsky.vercel.app",
              logo: "https://flyluxsky.vercel.app/og.png",
              description: "Your Gateway to Exclusive Business Class Savings",
              foundingDate: "2024",
              serviceType: "Flight Booking",
              areaServed: "Worldwide",
              contactPoint: {
                "@type": "ContactPoint",
                telephone: "+1-800-FLY-LUXS",
                contactType: "Customer Service",
                availableLanguage: ["English"]
              },
              sameAs: [
                "https://facebook.com/flyluxsky",
                "https://twitter.com/flyluxsky",
                "https://instagram.com/flyluxsky"
              ],
              hasOfferCatalog: {
                "@type": "OfferCatalog",
                name: "Flight Booking Services",
                itemListElement: [
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Service",
                      name: "Business Class Flights",
                      description: "Premium business class flight booking"
                    }
                  },
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Service",
                      name: "First Class Flights",
                      description: "Luxury first class flight booking"
                    }
                  }
                ]
              }
            }),
          }}
        />
      </head>
      <body className={`${poppins.variable} ${ubuntu.variable} font-sans`}>
        <MarketingScripts />
        <ResourcePreloader 
          images={['/og.png']}
          fonts={[]}
          scripts={[]}
        />
        {children}
        <Footer />
      </body>
    </html>
  );
}
