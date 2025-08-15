'use client'

import { useEffect, useState } from 'react'
import Head from 'next/head'

interface SeoMeta {
  siteTitle: string
  siteDescription: string
  siteKeywords: string
  ogTitle: string
  ogDescription: string
  ogImage: string
  ogUrl: string
  twitterCard: string
  twitterTitle: string
  twitterDescription: string
  twitterImage: string
  canonicalUrl: string
  author: string
  language: string
}

interface SeoMetaProps {
  title?: string
  description?: string
  keywords?: string
  ogTitle?: string
  ogDescription?: string
  ogImage?: string
  ogUrl?: string
  canonicalUrl?: string
}

export default function SeoMeta(props: SeoMetaProps) {
  const [seoMeta, setSeoMeta] = useState<SeoMeta | null>(null)

  useEffect(() => {
    const loadSeoMeta = async () => {
      try {
        const response = await fetch('/api/seo/meta')
        if (response.ok) {
          const data = await response.json()
          setSeoMeta(data)
        }
      } catch (error) {
        // Failed to load SEO meta
      }
    }

    loadSeoMeta()
  }, [])

  if (!seoMeta) return null

  // Use props to override default values
  const title = props.title || seoMeta.siteTitle
  const description = props.description || seoMeta.siteDescription
  const keywords = props.keywords || seoMeta.siteKeywords
  const ogTitle = props.ogTitle || seoMeta.ogTitle
  const ogDescription = props.ogDescription || seoMeta.ogDescription
  const ogImage = props.ogImage || seoMeta.ogImage
  const ogUrl = props.ogUrl || seoMeta.ogUrl
  const canonicalUrl = props.canonicalUrl || seoMeta.canonicalUrl

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={seoMeta.author} />
      <meta name="language" content={seoMeta.language} />
      <meta name="robots" content="index, follow" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Open Graph Meta Tags */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={ogTitle} />
      <meta property="og:description" content={ogDescription} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={ogUrl} />
      <meta property="og:site_name" content="FlyLuxSky" />
      <meta property="og:locale" content={seoMeta.language === 'ru' ? 'ru_RU' : 'en_US'} />
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content={seoMeta.twitterCard} />
      <meta name="twitter:title" content={seoMeta.twitterTitle} />
      <meta name="twitter:description" content={seoMeta.twitterDescription} />
      <meta name="twitter:image" content={seoMeta.twitterImage} />
      
      {/* Additional Meta Tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="format-detection" content="telephone=no" />
    </Head>
  )
}