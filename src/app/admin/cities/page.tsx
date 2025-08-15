'use client'

import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
// Icons removed
import {
  loadCitiesContent,
  saveCitiesContent,
  importCitiesContent,
  exportCitiesContent,
  DEFAULT_CITY_CONTENT,
  type CityContent
} from '@/lib/citiesAdmin'

const CITY_SLUGS = Object.keys(DEFAULT_CITY_CONTENT)

export default function AdminCitiesPage() {
  const [content, setContent] = useState<Record<string, CityContent>>(DEFAULT_CITY_CONTENT)
  const [isLoading, setIsLoading] = useState(true)
  const [active, setActive] = useState(CITY_SLUGS[0])

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const data = await loadCitiesContent()
        if (!cancelled) setContent(data)
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  const handleSave = () => {
    try {
      saveCitiesContent(content)
      fetch('/api/cities/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content })
      })
        .then(async (res) => {
          const backend = res.headers.get('x-cities-write') || 'unknown'
          if (!res.ok) throw new Error('Failed to publish city content')
          await res.json()
          alert(`Saved (backend: ${backend})`)
        })
        .catch(() => alert('Saved locally, but failed to publish to server'))
    } catch (e) {
      alert('Failed to save content')
    }
  }

  const handleImport = () => {
    const json = prompt('Paste cities content JSON')
    if (!json) return
    try {
      const imported = importCitiesContent(json)
      setContent(imported)
      alert('Imported successfully')
    } catch {
      alert('Invalid JSON')
    }
  }

  const handleExport = () => {
    const json = exportCitiesContent(content)
    navigator.clipboard.writeText(json)
    alert('Copied JSON to clipboard')
  }

  if (isLoading) return (
    <div className="flex items-center justify-center py-20">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0ABAB5] mx-auto"></div>
        <p className="mt-4 text-gray-600 font-medium">Loading cities content...</p>
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
                  Cities Content Manager
                </h1>
                <p className="text-gray-600 mt-1 flex items-center">

                  Edit hero text and images for city pages
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

              <Button onClick={handleSave} className="bg-gradient-to-r from-[#0ABAB5] to-cyan-500 hover:from-[#0ABAB5]/90 hover:to-cyan-500/90 shadow-lg">
Save Changes
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <Tabs value={active} onValueChange={setActive}>
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center mb-6">

              <h2 className="text-xl font-semibold text-gray-800">Select City to Edit</h2>
            </div>
            <TabsList className="grid grid-cols-4 lg:grid-cols-7 gap-2 bg-gray-50 p-2 rounded-xl">
              {CITY_SLUGS.map(slug => (
                <TabsTrigger 
                  key={slug} 
                  value={slug} 
                  className="capitalize data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#0ABAB5] data-[state=active]:to-cyan-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200 hover:bg-white"
                >
                  {slug}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {CITY_SLUGS.map(slug => {
            const c = content[slug] || DEFAULT_CITY_CONTENT[slug]
            if (!c) return null
            return (
              <TabsContent key={slug} value={slug}>
                <div className="space-y-6">
                  {/* Basic Information Card */}
                  <Card className="shadow-lg border-0 bg-white">
                    <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-t-lg">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-gradient-to-r from-[#0ABAB5] to-cyan-500 rounded-lg">
                        </div>
                        <div>
                          <CardTitle className="capitalize text-2xl font-bold text-gray-800">{slug}</CardTitle>
                          <CardDescription className="text-gray-600">Basic city information and metadata</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700 flex items-center">

                            City Title
                          </label>
                          <Input 
                            value={c.title} 
                            onChange={(e) => setContent(prev => ({...prev, [slug]: { ...prev[slug], title: e.target.value }}))}
                            className="border-gray-200 focus:border-[#0ABAB5] focus:ring-[#0ABAB5]"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">Subtitle</label>
                          <Input 
                            value={c.subtitle} 
                            onChange={(e) => setContent(prev => ({...prev, [slug]: { ...prev[slug], subtitle: e.target.value }}))}
                            className="border-gray-200 focus:border-[#0ABAB5] focus:ring-[#0ABAB5]"
                          />
                        </div>
                        <div className="md:col-span-2 space-y-2">
                          <label className="text-sm font-medium text-gray-700">Description</label>
                          <textarea
                            value={c.description}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setContent(prev => ({...prev, [slug]: { ...prev[slug], description: e.target.value }}))}
                            className="min-h-[96px] w-full border border-gray-200 bg-white px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#0ABAB5] focus:border-[#0ABAB5] resize-none"
                            placeholder="Enter city description..."
                          />
                        </div>
                        <div className="md:col-span-2 space-y-2">
                          <label className="text-sm font-medium text-gray-700 flex items-center">

                            Hero Image URL
                          </label>
                          <Input 
                            value={c.heroImage} 
                            onChange={(e) => setContent(prev => ({...prev, [slug]: { ...prev[slug], heroImage: e.target.value }}))}
                            className="border-gray-200 focus:border-[#0ABAB5] focus:ring-[#0ABAB5]"
                            placeholder="/images/city-name.jpg"
                          />
                          <p className="text-xs text-gray-500 mt-1">Example: /images/london-big.jpg</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Intro Content Card */}
                  <Card className="shadow-lg border-0 bg-white">
                    <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-lg">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                        </div>
                        <div>
                          <CardTitle className="text-xl font-bold text-gray-800">Intro Content</CardTitle>
                          <CardDescription className="text-gray-600">Main introductory text and title</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2 space-y-2">
                          <label className="text-sm font-medium text-gray-700">Intro Title</label>
                          <Input 
                            value={c.introTitle || ''} 
                            onChange={(e) => setContent(prev => ({...prev, [slug]: { ...prev[slug], introTitle: e.target.value }}))}
                            className="border-gray-200 focus:border-[#0ABAB5] focus:ring-[#0ABAB5]"
                            placeholder="Enjoy Your Barcelona Trip With Fly Lux Sky"
                          />
                          <p className="text-xs text-gray-500 mt-1">Example: Enjoy Your Barcelona Trip With Fly Lux Sky</p>
                        </div>
                        <div className="md:col-span-2 space-y-2">
                          <label className="text-sm font-medium text-gray-700">Intro Text</label>
                          <textarea
                            value={c.introText || ''}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setContent(prev => ({...prev, [slug]: { ...prev[slug], introText: e.target.value }}))}
                            className="min-h-[96px] w-full border border-gray-200 bg-white px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#0ABAB5] focus:border-[#0ABAB5] resize-none"
                            placeholder="Explore Barcelona's rich history and modern charm..."
                          />
                          <p className="text-xs text-gray-500 mt-1">Example: Explore Barcelona's rich history and modern charm...</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* CTA Content Card */}
                  <Card className="shadow-lg border-0 bg-white">
                    <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-lg">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
                        </div>
                        <div>
                          <CardTitle className="text-xl font-bold text-gray-800">Call to Action</CardTitle>
                          <CardDescription className="text-gray-600">CTA section content</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">CTA Title</label>
                          <Input 
                            value={c.ctaTitle || ''} 
                            onChange={(e) => setContent(prev => ({...prev, [slug]: { ...prev[slug], ctaTitle: e.target.value }}))}
                            className="border-gray-200 focus:border-[#0ABAB5] focus:ring-[#0ABAB5]"
                            placeholder="Ready to explore?"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">CTA Text</label>
                          <textarea
                            value={c.ctaText || ''}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setContent(prev => ({...prev, [slug]: { ...prev[slug], ctaText: e.target.value }}))}
                            className="min-h-[96px] w-full border border-gray-200 bg-white px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#0ABAB5] focus:border-[#0ABAB5] resize-none"
                            placeholder="Book your luxury flight today..."
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Preview Card */}
                  <Card className="shadow-lg border-0 bg-white">
                    <CardHeader className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-t-lg">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-lg">
                        </div>
                        <div>
                          <CardTitle className="text-xl font-bold text-gray-800">Preview</CardTitle>
                          <CardDescription className="text-gray-600">How this city will appear on the website</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="rounded-lg border border-gray-200 p-4 bg-gray-50">
                        <div className="flex items-center gap-4">
                          <div className="w-24 h-16 bg-gray-200 rounded overflow-hidden flex items-center justify-center text-xs text-gray-500 border">
                            {c.heroImage ? (
                               <img src={c.heroImage} alt={c.title} className="w-full h-full object-cover" />
                             ) : (
                               "No Image"
                             )}
                          </div>
                          <div className="flex-1">
                            <div className="text-lg font-semibold text-gray-800">{c.title || 'City Title'}</div>
                            <div className="text-sm text-gray-600">{c.subtitle || 'City Subtitle'}</div>
                            <div className="text-xs text-gray-500 line-clamp-2 mt-1">{c.description || 'City description will appear here...'}</div>
                          </div>
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