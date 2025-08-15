'use client'

import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  loadCountriesContent,
  saveCountriesContent,
  importCountriesContent,
  exportCountriesContent,
  DEFAULT_COUNTRY_CONTENT,
  type CountryContent
} from '../../../lib/countriesAdmin'

const COUNTRY_SLUGS = Object.keys(DEFAULT_COUNTRY_CONTENT)

export default function AdminCountriesPage() {
  const [content, setContent] = useState<Record<string, CountryContent>>(DEFAULT_COUNTRY_CONTENT)
  const [isLoading, setIsLoading] = useState(true)
  const [active, setActive] = useState(COUNTRY_SLUGS[0])

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const data = await loadCountriesContent()
        if (!cancelled) setContent(data)
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  const handleSave = () => {
    saveCountriesContent(content)
    alert('Countries content saved successfully!')
  }



  const handleExport = () => {
    const dataStr = exportCountriesContent(content)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    const exportFileDefaultName = 'countries-content.json'
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  const handleImport = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          try {
            const json = e.target?.result as string
            const imported = importCountriesContent(json)
            setContent(imported)
            alert('Countries content imported successfully!')
          } catch (error) {
            alert('Error importing file: ' + (error as Error).message)
          }
        }
        reader.readAsText(file)
      }
    }
    input.click()
  }

  const updateCountryContent = (slug: string, field: keyof CountryContent, value: string) => {
    setContent(prev => ({
      ...prev,
      [slug]: {
        ...prev[slug],
        [field]: value,
        updated_at: new Date().toISOString()
      }
    }))
  }

  if (isLoading) return (
    <div className="flex items-center justify-center py-20">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0ABAB5] mx-auto"></div>
        <p className="mt-4 text-gray-600 font-medium">Loading countries content...</p>
      </div>
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-[#0ABAB5] to-cyan-500 rounded-xl">
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Countries Content Manager
                </h1>
                <p className="text-gray-600 mt-1 flex items-center">
                  Edit hero text and images for country pages
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={handleImport} className="hover:bg-blue-50 border-blue-200">
                Import
              </Button>
              <Button variant="outline" onClick={handleExport} className="hover:bg-green-50 border-green-200">
                Export
              </Button>

              <Button onClick={handleSave} className="bg-gradient-to-r from-[#0ABAB5] to-cyan-500 hover:from-[#0ABAB5]/90 hover:to-cyan-500/90">
                Save Changes
              </Button>
            </div>
          </div>
        </div>

        {/* Content Editor */}
        <Tabs value={active} onValueChange={setActive} className="w-full">
          <TabsList className="grid w-full grid-cols-7 bg-gray-50 p-1 rounded-xl">
            {COUNTRY_SLUGS.map((slug) => (
              <TabsTrigger 
                key={slug} 
                value={slug} 
                className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg transition-all duration-200 font-medium"
              >
                {content[slug]?.title || slug}
              </TabsTrigger>
            ))}
          </TabsList>

          {COUNTRY_SLUGS.map((slug) => {
            const c = content[slug]
            if (!c) return null
            
            return (
              <TabsContent key={slug} value={slug} className="mt-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Editor Panel */}
                  <Card className="shadow-lg border-0 bg-white">
                    <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-lg">
                      <CardTitle className="text-xl text-gray-800">Edit {c.title} Content</CardTitle>
                      <CardDescription>Update the content for the {c.title} country page</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Title</label>
                        <Input
                          value={c.title}
                          onChange={(e) => updateCountryContent(slug, 'title', e.target.value)}
                          placeholder="Country title"
                          className="border-gray-200 focus:border-[#0ABAB5] focus:ring-[#0ABAB5]"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Subtitle</label>
                        <Input
                          value={c.subtitle}
                          onChange={(e) => updateCountryContent(slug, 'subtitle', e.target.value)}
                          placeholder="Country subtitle"
                          className="border-gray-200 focus:border-[#0ABAB5] focus:ring-[#0ABAB5]"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Description</label>
                        <Input
                          value={c.description}
                          onChange={(e) => updateCountryContent(slug, 'description', e.target.value)}
                          placeholder="Meta description"
                          className="border-gray-200 focus:border-[#0ABAB5] focus:ring-[#0ABAB5]"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Hero Image Path</label>
                        <Input
                          value={c.heroImage}
                          onChange={(e) => updateCountryContent(slug, 'heroImage', e.target.value)}
                          placeholder="/images/country.jpg"
                          className="border-gray-200 focus:border-[#0ABAB5] focus:ring-[#0ABAB5]"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Intro Title</label>
                        <Input
                          value={c.introTitle || ''}
                          onChange={(e) => updateCountryContent(slug, 'introTitle', e.target.value)}
                          placeholder="Enjoy Your Country Trip With Fly Lux Sky"
                          className="border-gray-200 focus:border-[#0ABAB5] focus:ring-[#0ABAB5]"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Intro Text</label>
                        <textarea
                          value={c.introText || ''}
                          onChange={(e) => updateCountryContent(slug, 'introText', e.target.value)}
                          placeholder="Explore country's rich history and modern charm..."
                          className="w-full h-24 px-3 py-2 border border-gray-200 rounded-md focus:border-[#0ABAB5] focus:ring-[#0ABAB5] focus:ring-1 focus:outline-none resize-none"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">CTA Title</label>
                        <Input
                          value={c.ctaTitle || ''}
                          onChange={(e) => updateCountryContent(slug, 'ctaTitle', e.target.value)}
                          placeholder="Book Your Country Business Class Flight Today."
                          className="border-gray-200 focus:border-[#0ABAB5] focus:ring-[#0ABAB5]"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">CTA Text</label>
                        <textarea
                          value={c.ctaText || ''}
                          onChange={(e) => updateCountryContent(slug, 'ctaText', e.target.value)}
                          placeholder="Let Fly Lux Sky elevate your journey..."
                          className="w-full h-20 px-3 py-2 border border-gray-200 rounded-md focus:border-[#0ABAB5] focus:ring-[#0ABAB5] focus:ring-1 focus:outline-none resize-none"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Preview Panel */}
                  <Card className="shadow-lg border-0 bg-white">
                    <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
                      <CardTitle className="text-xl text-gray-800">Preview</CardTitle>
                      <CardDescription>Live preview of how the content will appear</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="border rounded-lg p-4 bg-gradient-to-r from-gray-50 to-gray-100">
                          <div className="text-lg font-bold text-gray-900">{c.title}</div>
                          <div className="text-sm text-gray-600 mt-1">{c.subtitle}</div>
                          <div className="text-xs text-gray-500 line-clamp-2 mt-1">{c.description || 'Country description will appear here...'}</div>
                        </div>
                        
                        <div className="border rounded-lg p-4">
                          <div className="text-sm font-semibold text-gray-700 mb-2">Hero Image</div>
                          <div className="bg-gray-100 rounded h-32 flex items-center justify-center text-gray-500 text-sm">
                            {c.heroImage || 'No image path set'}
                          </div>
                        </div>
                        
                        <div className="border rounded-lg p-4">
                          <div className="text-sm font-semibold text-gray-700 mb-2">Intro Section</div>
                          <div className="text-sm font-medium text-gray-800">{c.introTitle || 'No intro title'}</div>
                          <div className="text-xs text-gray-600 mt-1 line-clamp-3">{c.introText || 'No intro text'}</div>
                        </div>
                        
                        <div className="border rounded-lg p-4">
                          <div className="text-sm font-semibold text-gray-700 mb-2">CTA Section</div>
                          <div className="text-sm font-medium text-gray-800">{c.ctaTitle || 'No CTA title'}</div>
                          <div className="text-xs text-gray-600 mt-1 line-clamp-2">{c.ctaText || 'No CTA text'}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
               </TabsContent>
             )
           })}
         </Tabs>
     </div>
   )
  }