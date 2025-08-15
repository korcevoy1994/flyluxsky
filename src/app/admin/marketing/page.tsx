'use client'

import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
// Using native textarea and label elements

interface MarketingCodes {
  googleTagManager: string
  googleAnalytics4: string
  googleSearchConsole: string
  bingWebmasterTools: string
  facebookPixel: string
  googleAdsTag: string
  hotjar: string
}

const DEFAULT_MARKETING_CODES: MarketingCodes = {
  googleTagManager: '',
  googleAnalytics4: '',
  googleSearchConsole: '',
  bingWebmasterTools: '',
  facebookPixel: '',
  googleAdsTag: '',
  hotjar: ''
}

export default function AdminMarketingPage() {
  const [codes, setCodes] = useState<MarketingCodes>(DEFAULT_MARKETING_CODES)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    loadMarketingCodes()
  }, [])

  const loadMarketingCodes = async () => {
    try {
      const response = await fetch('/api/marketing/codes')
      if (response.ok) {
        const data = await response.json()
        setCodes(data)
      }
    } catch (error) {
      // Failed to load marketing codes
    } finally {
      setIsLoading(false)
    }
  }

  const saveMarketingCodes = async () => {
    setIsSaving(true)
    try {
      const response = await fetch('/api/marketing/codes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(codes)
      })
      
      if (response.ok) {
        alert('Marketing codes saved successfully!')
      } else {
        throw new Error('Failed to save')
      }
    } catch (error) {
      alert('Failed to save marketing codes')
      // Save error
    } finally {
      setIsSaving(false)
    }
  }

  const handleCodeChange = (field: keyof MarketingCodes, value: string) => {
    setCodes(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const marketingTools = [
    {
      key: 'googleTagManager' as keyof MarketingCodes,
      title: 'Google Tag Manager',
      description: 'GTM container code for managing tracking tags',
      placeholder: 'Paste your GTM container code here...'
    },
    {
      key: 'googleAnalytics4' as keyof MarketingCodes,
      title: 'Google Analytics 4',
      description: 'GA4 tracking code for website analytics',
      placeholder: 'Paste your GA4 tracking code here...'
    },
    {
      key: 'googleSearchConsole' as keyof MarketingCodes,
      title: 'Google Search Console',
      description: 'Verification code for Google Search Console',
      placeholder: 'Paste your Search Console verification code here...'
    },
    {
      key: 'bingWebmasterTools' as keyof MarketingCodes,
      title: 'Bing Webmaster Tools',
      description: 'Verification code for Bing Webmaster Tools',
      placeholder: 'Paste your Bing verification code here...'
    },
    {
      key: 'facebookPixel' as keyof MarketingCodes,
      title: 'Facebook Pixel',
      description: 'Facebook Pixel code for tracking conversions',
      placeholder: 'Paste your Facebook Pixel code here...'
    },
    {
      key: 'googleAdsTag' as keyof MarketingCodes,
      title: 'Google Ads Tag',
      description: 'Google Ads conversion tracking code',
      placeholder: 'Paste your Google Ads tracking code here...'
    },
    {
      key: 'hotjar' as keyof MarketingCodes,
      title: 'Hotjar',
      description: 'Hotjar tracking code for user behavior analytics',
      placeholder: 'Paste your Hotjar tracking code here...'
    }
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0ABAB5] mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading marketing codes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Marketing & Analytics
              </h1>
              <p className="text-gray-600 mt-1">
                Manage tracking codes and marketing tools
              </p>
            </div>
            <div className="flex gap-3">
              <Button 
                onClick={saveMarketingCodes} 
                disabled={isSaving}
                className="bg-gradient-to-r from-[#0ABAB5] to-cyan-500 hover:from-[#0ABAB5]/90 hover:to-cyan-500/90 shadow-lg"
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </div>

        {/* Marketing Tools Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {marketingTools.map((tool) => (
            <Card key={tool.key} className="shadow-lg border-0 bg-white">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-t-lg">
                <CardTitle className="text-xl font-bold text-gray-800">{tool.title}</CardTitle>
                <CardDescription className="text-gray-600">{tool.description}</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-2">
                  <label htmlFor={tool.key} className="text-sm font-medium text-gray-700">
                    Code
                  </label>
                  <textarea
                    id={tool.key}
                    value={codes[tool.key]}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleCodeChange(tool.key, e.target.value)}
                    placeholder={tool.placeholder}
                    className="min-h-[120px] w-full border border-gray-200 bg-white px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#0ABAB5] focus:border-[#0ABAB5] resize-none font-mono"
                  ></textarea>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>


    </div>
  )
}