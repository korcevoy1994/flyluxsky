'use client'

import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
// Using native textarea element
// Icons removed

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
  robotsTxt: string
  canonicalUrl: string
  author: string
  language: string
}

const DEFAULT_SEO_META: SeoMeta = {
  siteTitle: 'FlyLuxSky — Business Flights',
  siteDescription: 'Your Gateway to Exclusive Business Class Savings',
  siteKeywords: 'business class flights, luxury travel, premium flights, first class',
  ogTitle: 'FlyLuxSky — Business Flights',
  ogDescription: 'Your Gateway to Exclusive Business Class Savings',
  ogImage: '/og.png',
  ogUrl: 'https://flyluxsky.vercel.app/',
  twitterCard: 'summary_large_image',
  twitterTitle: 'FlyLuxSky — Business Flights',
  twitterDescription: 'Your Gateway to Exclusive Business Class Savings',
  twitterImage: '/og.png',
  robotsTxt: 'User-agent: *\nAllow: /',
  canonicalUrl: 'https://flyluxsky.vercel.app/',
  author: 'FlyLuxSky',
  language: 'en'
}

export default function AdminSeoPage() {
  const [seoMeta, setSeoMeta] = useState<SeoMeta>(DEFAULT_SEO_META)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    loadSeoMeta()
  }, [])

  const loadSeoMeta = async () => {
    try {
      const response = await fetch('/api/seo/meta')
      if (response.ok) {
        const data = await response.json()
        setSeoMeta(data)
      }
    } catch (error) {
      // Failed to load SEO meta
    } finally {
      setIsLoading(false)
    }
  }

  const saveSeoMeta = async () => {
    setIsSaving(true)
    try {
      const response = await fetch('/api/seo/meta', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(seoMeta),
      })

      if (response.ok) {
        alert('SEO settings saved successfully!')
      } else {
        alert('Error saving SEO settings')
      }
    } catch (error) {
      // Failed to save SEO meta
      alert('Error saving SEO settings')
    } finally {
      setIsSaving(false)
    }
  }

  const handleFieldChange = (field: keyof SeoMeta, value: string) => {
    setSeoMeta(prev => ({
      ...prev,
      [field]: value
    }))
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading SEO settings...</div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">SEO Management</h2>
        <p className="text-gray-600">Manage metadata, Open Graph and Twitter Cards for search engine optimization</p>
      </div>

      {/* Basic SEO Settings */}
      <Card className="shadow-lg border-0 bg-white">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
          <div>
            <CardTitle className="text-xl font-bold text-gray-800">Basic SEO Settings</CardTitle>
            <CardDescription className="text-gray-600">Site title, description and keywords</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Site Title</label>
              <Input
                value={seoMeta.siteTitle}
                onChange={(e) => handleFieldChange('siteTitle', e.target.value)}
                placeholder="FlyLuxSky — Business Flights"
                className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Site Description</label>
              <textarea
                value={seoMeta.siteDescription}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleFieldChange('siteDescription', e.target.value)}
                placeholder="Your Gateway to Exclusive Business Class Savings"
                className="min-h-[96px] w-full border border-gray-200 bg-white px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Keywords</label>
              <textarea
                value={seoMeta.siteKeywords}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleFieldChange('siteKeywords', e.target.value)}
                placeholder="business class flights, luxury travel, premium flights, first class"
                className="min-h-[64px] w-full border border-gray-200 bg-white px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                rows={2}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Open Graph Settings */}
      <Card className="shadow-lg border-0 bg-white">
        <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-lg">
          <div>
            <CardTitle className="text-xl font-bold text-gray-800">Open Graph (Facebook)</CardTitle>
            <CardDescription className="text-gray-600">Settings for social networks and messengers</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">OG Title</label>
              <Input
                value={seoMeta.ogTitle}
                onChange={(e) => handleFieldChange('ogTitle', e.target.value)}
                placeholder="FlyLuxSky — Business Flights"
                className="border-gray-200 focus:border-green-500 focus:ring-green-500"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">OG URL</label>
              <Input
                value={seoMeta.ogUrl}
                onChange={(e) => handleFieldChange('ogUrl', e.target.value)}
                placeholder="https://flyluxsky.vercel.app/"
                className="border-gray-200 focus:border-green-500 focus:ring-green-500"
              />
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-medium text-gray-700">OG Description</label>
              <textarea
                value={seoMeta.ogDescription}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleFieldChange('ogDescription', e.target.value)}
                placeholder="Your Gateway to Exclusive Business Class Savings"
                className="min-h-[96px] w-full border border-gray-200 bg-white px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
                rows={3}
              />
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-medium text-gray-700">OG Image</label>
              <Input
                value={seoMeta.ogImage}
                onChange={(e) => handleFieldChange('ogImage', e.target.value)}
                placeholder="/og.png"
                className="border-gray-200 focus:border-green-500 focus:ring-green-500"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Twitter Cards Settings */}
      <Card className="shadow-lg border-0 bg-white">
        <CardHeader className="bg-gradient-to-r from-sky-50 to-blue-50 rounded-t-lg">
          <div>
            <CardTitle className="text-xl font-bold text-gray-800">Twitter Cards</CardTitle>
            <CardDescription className="text-gray-600">Settings for Twitter and X</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Twitter Card Type</label>
              <select
                value={seoMeta.twitterCard}
                onChange={(e) => handleFieldChange('twitterCard', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-md focus:border-sky-500 focus:ring-sky-500"
              >
                <option value="summary">Summary</option>
                <option value="summary_large_image">Summary Large Image</option>
                <option value="app">App</option>
                <option value="player">Player</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Twitter Title</label>
              <Input
                value={seoMeta.twitterTitle}
                onChange={(e) => handleFieldChange('twitterTitle', e.target.value)}
                placeholder="FlyLuxSky — Business Flights"
                className="border-gray-200 focus:border-sky-500 focus:ring-sky-500"
              />
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-medium text-gray-700">Twitter Description</label>
              <textarea
                value={seoMeta.twitterDescription}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleFieldChange('twitterDescription', e.target.value)}
                placeholder="Your Gateway to Exclusive Business Class Savings"
                className="min-h-[96px] w-full border border-gray-200 bg-white px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 resize-none"
                rows={3}
              />
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-medium text-gray-700">Twitter Image</label>
              <Input
                value={seoMeta.twitterImage}
                onChange={(e) => handleFieldChange('twitterImage', e.target.value)}
                placeholder="/og.png"
                className="border-gray-200 focus:border-sky-500 focus:ring-sky-500"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Technical SEO Settings */}
      <Card className="shadow-lg border-0 bg-white">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-lg">
          <div>
            <CardTitle className="text-xl font-bold text-gray-800">Technical Settings</CardTitle>
            <CardDescription className="text-gray-600">Robots.txt, canonical URLs and other technical parameters</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Canonical URL</label>
              <Input
                value={seoMeta.canonicalUrl}
                onChange={(e) => handleFieldChange('canonicalUrl', e.target.value)}
                placeholder="https://flyluxsky.vercel.app/"
                className="border-gray-200 focus:border-purple-500 focus:ring-purple-500"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Author</label>
              <Input
                value={seoMeta.author}
                onChange={(e) => handleFieldChange('author', e.target.value)}
                placeholder="FlyLuxSky"
                className="border-gray-200 focus:border-purple-500 focus:ring-purple-500"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Site Language</label>
              <select
                value={seoMeta.language}
                onChange={(e) => handleFieldChange('language', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-md focus:border-purple-500 focus:ring-purple-500"
              >
                <option value="en">English</option>
                <option value="ru">Russian</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
                <option value="de">Deutsch</option>
              </select>
            </div>
            <div className="md:col-span-1 space-y-2">
              <label className="text-sm font-medium text-gray-700">Robots.txt</label>
              <textarea
                value={seoMeta.robotsTxt}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleFieldChange('robotsTxt', e.target.value)}
                placeholder="User-agent: *\nAllow: /"
                className="min-h-[128px] w-full border border-gray-200 bg-white px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none font-mono"
                rows={4}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          onClick={saveSeoMeta}
          disabled={isSaving}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg font-semibold"
        >
          {isSaving ? 'Saving...' : 'Save SEO Settings'}
        </Button>
      </div>
    </div>
  )
}