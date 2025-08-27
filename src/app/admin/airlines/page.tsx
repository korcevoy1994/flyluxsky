'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { loadAirlinesContent, saveAirlinesContent, exportAirlinesContent, importAirlinesContent, type AirlineContent } from '@/lib/airlinesAdmin'
import { Download, Upload, Save, Plus, Trash2 } from 'lucide-react'

export default function AirlinesAdmin() {
  const [content, setContent] = useState<Record<string, AirlineContent>>({})
  const [activeTab, setActiveTab] = useState('emirates-airlines')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadContent = async () => {
      try {
        const loadedContent = await loadAirlinesContent()
        setContent(loadedContent)
      } catch (error) {
        // Failed to load airline content
      } finally {
        setIsLoading(false)
      }
    }
    
    loadContent()
    
    // Listen for localStorage changes to sync in real-time
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'flyluxsky_airlines_content' && e.newValue) {
        try {
          const updatedContent = JSON.parse(e.newValue)
          setContent(updatedContent)
        } catch (error) {
          console.error('Failed to parse updated content:', error)
        }
      }
    }
    
    window.addEventListener('storage', handleStorageChange)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  const handleSave = async () => {
    try {
      saveAirlinesContent(content)
      alert('Content saved successfully!')
    } catch (error) {
      // Failed to save content
      alert('Failed to save content')
    }
  }

  const handleExport = () => {
    try {
      const dataStr = exportAirlinesContent(content)
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
      const exportFileDefaultName = 'airlines-content.json'
      const linkElement = document.createElement('a')
      linkElement.setAttribute('href', dataUri)
      linkElement.setAttribute('download', exportFileDefaultName)
      linkElement.click()
    } catch (error) {
      // Failed to export content
      alert('Failed to export content')
    }
  }

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e: ProgressEvent<FileReader>) => {
      try {
        const result = e.target?.result as string
        const importedContent = importAirlinesContent(result)
        setContent(importedContent)
        alert('Content imported successfully!')
      } catch (error) {
        // Failed to import content
        alert('Failed to import content')
      }
    }
    reader.readAsText(file)
  }

  const updateBasicInfo = (airline: string, field: keyof AirlineContent, value: string) => {
    setContent(prev => ({
      ...prev,
      [airline]: {
        ...prev[airline],
        [field]: value
      }
    }))
  }

  const updateFeature = (airline: string, index: number, field: string, value: string) => {
    setContent(prev => {
      const features = [...(prev[airline]?.features || [])]
      features[index] = {
        ...features[index],
        [field]: value
      }
      return {
        ...prev,
        [airline]: {
          ...prev[airline],
          features
        }
      }
    })
  }

  const addFeature = (airline: string) => {
    setContent(prev => ({
      ...prev,
      [airline]: {
        ...prev[airline],
        features: [
          ...(prev[airline]?.features || []),
          { title: '', description: '' }
        ]
      }
    }))
  }

  const removeFeature = (airline: string, index: number) => {
    setContent(prev => {
      const features = [...(prev[airline]?.features || [])]
      features.splice(index, 1)
      return {
        ...prev,
        [airline]: {
          ...prev[airline],
          features
        }
      }
    })
  }

  const updateRoute = (airline: string, index: number, field: string, value: string) => {
    setContent(prev => {
      const routes = [...(prev[airline]?.popularRoutes || [])]
      routes[index] = {
        ...routes[index],
        [field]: value
      }
      return {
        ...prev,
        [airline]: {
          ...prev[airline],
          popularRoutes: routes
        }
      }
    })
  }

  const addRoute = (airline: string) => {
    setContent(prev => ({
      ...prev,
      [airline]: {
        ...prev[airline],
        popularRoutes: [
          ...(prev[airline]?.popularRoutes || []),
          { from: '', to: '', price: '' }
        ]
      }
    }))
  }

  const removeRoute = (airline: string, index: number) => {
    setContent(prev => {
      const routes = [...(prev[airline]?.popularRoutes || [])]
      routes.splice(index, 1)
      return {
        ...prev,
        [airline]: {
          ...prev[airline],
          popularRoutes: routes
        }
      }
    })
  }

  const updateTravelClass = (airline: string, index: number, field: string, value: string | number | string[]) => {
    setContent(prev => {
      const travelClasses = [...(prev[airline]?.travelClasses || [])]
      travelClasses[index] = {
        ...travelClasses[index],
        [field]: value
      }
      return {
        ...prev,
        [airline]: {
          ...prev[airline],
          travelClasses
        }
      }
    })
  }

  const addTravelClass = (airline: string) => {
    setContent(prev => ({
      ...prev,
      [airline]: {
        ...prev[airline],
        travelClasses: [
          ...(prev[airline]?.travelClasses || []),
          { name: '', description: '', features: [] }
        ]
      }
    }))
  }

  const removeTravelClass = (airline: string, index: number) => {
    setContent(prev => {
      const travelClasses = [...(prev[airline]?.travelClasses || [])]
      travelClasses.splice(index, 1)
      return {
        ...prev,
        [airline]: {
          ...prev[airline],
          travelClasses
        }
      }
    })
  }

  if (isLoading) {
    return <div className="p-6">Loading...</div>
  }

  const airlines = Object.keys(content)

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Airlines Content Management</h1>
          <p className="text-muted-foreground">Manage airline pages content, features, and routes</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleSave} className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
          <Button onClick={handleExport} variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <div className="relative">
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <Button variant="outline" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Import
            </Button>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-7">
          {airlines.map((airline) => (
            <TabsTrigger key={airline} value={airline} className="capitalize">
              {content[airline]?.title || airline}
            </TabsTrigger>
          ))}
        </TabsList>

        {airlines.map((airline) => {
          const airlineContent = content[airline]
          if (!airlineContent) return null

          return (
            <TabsContent key={airline} value={airline} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>Manage basic airline information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Title</label>
                      <Input
                        value={airlineContent.title}
                        onChange={(e) => updateBasicInfo(airline, 'title', e.target.value)}
                        placeholder="Airline title"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Subtitle</label>
                      <Input
                        value={airlineContent.subtitle}
                        onChange={(e) => updateBasicInfo(airline, 'subtitle', e.target.value)}
                        placeholder="Airline subtitle"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Description</label>
                    <textarea
                      value={airlineContent.description}
                      onChange={(e) => updateBasicInfo(airline, 'description', e.target.value)}
                      placeholder="Airline description"
                      rows={3}
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Hero Image</label>
                    <Input
                      value={airlineContent.heroImage}
                      onChange={(e) => updateBasicInfo(airline, 'heroImage', e.target.value)}
                      placeholder="/images/airline-hero.jpg"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Introduction Section</CardTitle>
                  <CardDescription>Manage introduction content and call-to-action</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Intro Title</label>
                    <Input
                      value={airlineContent.introTitle || ''}
                      onChange={(e) => updateBasicInfo(airline, 'introTitle', e.target.value)}
                      placeholder="Introduction title"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Intro Text</label>
                    <textarea
                      value={airlineContent.introText || ''}
                      onChange={(e) => updateBasicInfo(airline, 'introText', e.target.value)}
                      placeholder="Introduction text"
                      rows={4}
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">CTA Title</label>
                    <Input
                      value={airlineContent.ctaTitle || ''}
                      onChange={(e) => updateBasicInfo(airline, 'ctaTitle', e.target.value)}
                      placeholder="Call to action title"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">CTA Text</label>
                    <textarea
                      value={airlineContent.ctaText || ''}
                      onChange={(e) => updateBasicInfo(airline, 'ctaText', e.target.value)}
                      placeholder="Call to action text"
                      rows={3}
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Key Features</CardTitle>
                      <CardDescription>Manage airline key features and highlights</CardDescription>
                    </div>
                    <Button onClick={() => addFeature(airline)} size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Feature
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {airlineContent.features?.map((feature, index) => (
                    <div key={index} className="border rounded-lg p-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium">Feature {index + 1}</h4>
                        <Button
                          onClick={() => removeFeature(airline, index)}
                          variant="destructive"
                          size="sm"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Title</label>
                        <Input
                          value={feature.title}
                          onChange={(e) => updateFeature(airline, index, 'title', e.target.value)}
                          placeholder="Feature title"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Description</label>
                        <textarea
                          value={feature.description}
                          onChange={(e) => updateFeature(airline, index, 'description', e.target.value)}
                          placeholder="Feature description"
                          rows={2}
                          className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Popular Routes</CardTitle>
                      <CardDescription>Manage popular flight routes and pricing</CardDescription>
                    </div>
                    <Button onClick={() => addRoute(airline)} size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Route
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {airlineContent.popularRoutes?.map((route, index) => (
                    <div key={index} className="border rounded-lg p-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium">Route {index + 1}</h4>
                        <Button
                          onClick={() => removeRoute(airline, index)}
                          variant="destructive"
                          size="sm"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="text-sm font-medium">From</label>
                          <Input
                            value={route.from}
                            onChange={(e) => updateRoute(airline, index, 'from', e.target.value)}
                            placeholder="Origin city"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">To</label>
                          <Input
                            value={route.to}
                            onChange={(e) => updateRoute(airline, index, 'to', e.target.value)}
                            placeholder="Destination city"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Price</label>
                          <Input
                            value={route.price}
                            onChange={(e) => updateRoute(airline, index, 'price', e.target.value)}
                            placeholder="From $XXX"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Travel Classes</CardTitle>
                      <CardDescription>Manage service classes and their features</CardDescription>
                    </div>
                    <Button onClick={() => addTravelClass(airline)} size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Class
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {airlineContent.travelClasses?.map((travelClass, index) => (
                    <div key={index} className="border rounded-lg p-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium">Class {index + 1}</h4>
                        <Button
                          onClick={() => removeTravelClass(airline, index)}
                          variant="destructive"
                          size="sm"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-sm font-medium">Name</label>
                          <Input
                            value={travelClass.name}
                            onChange={(e) => updateTravelClass(airline, index, 'name', e.target.value)}
                            placeholder="Class name"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Description</label>
                          <Input
                            value={travelClass.description}
                            onChange={(e) => updateTravelClass(airline, index, 'description', e.target.value)}
                            placeholder="Class description"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Features (one per line)</label>
                        <textarea
                          value={(travelClass.features || []).join('\n')}
                          onChange={(e) => updateTravelClass(airline, index, 'features', e.target.value.split('\n').filter((f: string) => f.trim()))}
                          placeholder="Feature 1\nFeature 2\nFeature 3"
                          rows={3}
                          className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          )
        })}
      </Tabs>
    </div>
  )
}