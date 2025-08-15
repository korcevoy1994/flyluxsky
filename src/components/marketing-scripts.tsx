'use client'

import { useEffect, useState } from 'react'
import Script from 'next/script'

interface MarketingCodes {
  googleTagManager: string
  googleAnalytics4: string
  googleSearchConsole: string
  bingWebmasterTools: string
  facebookPixel: string
  googleAdsTag: string
  hotjar: string
}

export default function MarketingScripts() {
  const [codes, setCodes] = useState<MarketingCodes>({
    googleTagManager: '',
    googleAnalytics4: '',
    googleSearchConsole: '',
    bingWebmasterTools: '',
    facebookPixel: '',
    googleAdsTag: '',
    hotjar: ''
  })

  useEffect(() => {
    // Load marketing codes from API
    const loadCodes = async () => {
      try {
        const response = await fetch('/api/marketing/codes')
        if (response.ok) {
          const data = await response.json()
          setCodes(data)
        }
      } catch (error) {
        // Failed to load marketing codes
      }
    }

    loadCodes()
  }, [])

  return (
    <>
      {/* Google Tag Manager */}
      {codes.googleTagManager && (
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: codes.googleTagManager
          }}
        />
      )}

      {/* Google Analytics 4 */}
      {codes.googleAnalytics4 && (
        <Script
          id="ga4-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: codes.googleAnalytics4
          }}
        />
      )}

      {/* Google Search Console */}
      {codes.googleSearchConsole && (
        <Script
          id="gsc-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: codes.googleSearchConsole
          }}
        />
      )}

      {/* Bing Webmaster Tools */}
      {codes.bingWebmasterTools && (
        <Script
          id="bing-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: codes.bingWebmasterTools
          }}
        />
      )}

      {/* Facebook Pixel */}
      {codes.facebookPixel && (
        <Script
          id="fb-pixel-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: codes.facebookPixel
          }}
        />
      )}

      {/* Google Ads Tag */}
      {codes.googleAdsTag && (
        <Script
          id="google-ads-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: codes.googleAdsTag
          }}
        />
      )}

      {/* Hotjar */}
      {codes.hotjar && (
        <Script
          id="hotjar-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: codes.hotjar
          }}
        />
      )}
    </>
  )
}