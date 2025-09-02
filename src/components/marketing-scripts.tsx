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
  kommoChat: string
}

export default function MarketingScripts() {
  const [codes, setCodes] = useState<MarketingCodes>({
    googleTagManager: '',
    googleAnalytics4: '',
    googleSearchConsole: '',
    bingWebmasterTools: '',
    facebookPixel: '',
    googleAdsTag: '',
    hotjar: '',
    kommoChat: ''
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
      } catch {
        // Failed to load marketing codes
      }
    }

    loadCodes()
  }, [])

  // Load Kommo Chat script dynamically
  useEffect(() => {
    if (codes.kommoChat) {
      // Remove existing script if any
      const existingScript = document.getElementById('kommo-chat-script')
      if (existingScript) {
        existingScript.remove()
      }

      // Create a temporary div to parse HTML content
      const tempDiv = document.createElement('div')
      tempDiv.innerHTML = codes.kommoChat
      
      // Extract and execute scripts from the HTML content
      const scripts = tempDiv.querySelectorAll('script')
      scripts.forEach((originalScript, index) => {
        const newScript = document.createElement('script')
        newScript.id = `kommo-chat-script-${index}`
        
        // Copy attributes
        Array.from(originalScript.attributes).forEach(attr => {
          newScript.setAttribute(attr.name, attr.value)
        })
        
        // Copy content
        if (originalScript.src) {
          newScript.src = originalScript.src
        } else {
          newScript.textContent = originalScript.textContent
        }
        
        document.head.appendChild(newScript)
      })
      
      // Add CSS styles for Kommo chat positioning
      const addKommoChatStyles = () => {
        const existingStyles = document.getElementById('kommo-chat-styles')
        if (existingStyles) {
          existingStyles.remove()
        }
        
        const style = document.createElement('style')
        style.id = 'kommo-chat-styles'
        style.textContent = `
          /* Kommo Chat positioning styles */
          #kommo-chat-widget,
          [id*="kommo"],
          [class*="kommo"],
          [data-kommo],
          .kommo-chat-widget,
          .kommo-widget {
            position: fixed !important;
            bottom: 0 !important;
            right: 0 !important;
            z-index: 999999 !important;
            max-width: 350px !important;
            margin: 0 !important;
            padding: 0 !important;
            border: none !important;
            box-shadow: none !important;
            outline: none !important;
          }
          
          /* Kommo chat button positioning */
          #kommo-chat-button,
          [id*="kommo-button"],
          [class*="kommo-button"],
          .kommo-chat-button {
            position: fixed !important;
            bottom: 0 !important;
            right: 0 !important;
            z-index: 999999 !important;
            margin: 0 !important;
            padding: 0 !important;
            border: none !important;
            box-shadow: none !important;
            outline: none !important;
          }
          
          /* Remove any default margins/paddings from Kommo elements */
          #kommo-chat-widget *,
          [id*="kommo"] *,
          [class*="kommo"] *,
          [data-kommo] *,
          .kommo-chat-widget *,
          .kommo-widget * {
            margin: 0 !important;
            padding: 0 !important;
            border: none !important;
            box-shadow: none !important;
            outline: none !important;
          }
          
          /* Mobile specific positioning */
          @media (max-width: 768px) {
            #kommo-chat-widget,
            [id*="kommo"],
            [class*="kommo"],
            [data-kommo],
            .kommo-chat-widget,
            .kommo-widget {
              position: fixed !important;
              bottom: 0 !important;
              right: 0 !important;
              left: auto !important;
              top: auto !important;
              transform: none !important;
              max-width: 280px !important;
              margin: 0 !important;
              padding: 0 !important;
              border: none !important;
              box-shadow: none !important;
              outline: none !important;
            }
            
            #kommo-chat-button,
            [id*="kommo-button"],
            [class*="kommo-button"],
            .kommo-chat-button {
              position: fixed !important;
              bottom: 0 !important;
              right: 0 !important;
              left: auto !important;
              top: auto !important;
              transform: none !important;
              margin: 0 !important;
              padding: 0 !important;
              border: none !important;
              box-shadow: none !important;
              outline: none !important;
            }
            
            /* Override any centering styles */
            [id*="kommo"] *,
            [class*="kommo"] *,
            [data-kommo] *,
            .kommo-widget * {
              left: auto !important;
              right: auto !important;
              transform: none !important;
              margin-left: 0 !important;
              margin-right: 0 !important;
              border: none !important;
              box-shadow: none !important;
              outline: none !important;
            }
          }
        `
        document.head.appendChild(style)
      }
      
      // Add styles immediately and also after a delay to ensure chat widget is loaded
      addKommoChatStyles()
      setTimeout(addKommoChatStyles, 1000)
      setTimeout(addKommoChatStyles, 3000)
    }
  }, [codes.kommoChat])

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

      {/* Kommo Chat is loaded dynamically via useEffect */}
    </>
  )
}