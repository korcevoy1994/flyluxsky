'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Save, Plus, Trash2, Download, Upload, RotateCcw } from 'lucide-react'
import {
  defaultPricingConfig,
  savePricingConfig,
  loadPricingConfig,
  exportPricingConfig,
  importPricingConfig,
  type PricingConfiguration,
  type RoutePrice,
  type RegionPricing,
  type ServiceClass,
  type TripType
} from '@/lib/pricingAdmin'

export default function AdminPricingPage() {
  const [config, setConfig] = useState<PricingConfiguration>(defaultPricingConfig)
  const [isLoading, setIsLoading] = useState(true)

  // Load configuration on component mount
  useEffect(() => {
    try {
      const loadedConfig = loadPricingConfig()
      setConfig(loadedConfig)
    } catch (error) {
      console.error('Failed to load configuration:', error)
      setConfig(defaultPricingConfig)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const { regionPricing, serviceClasses, tripTypes } = config

  const handleSave = () => {
    try {
      savePricingConfig(config)
      alert('Pricing configuration saved successfully!')
    } catch (error) {
      console.error('Failed to save configuration:', error)
      alert('Failed to save pricing configuration')
    }
  }

  const handleReset = () => {
    if (confirm('Are you sure you want to reset to default configuration? This will lose all current changes.')) {
      setConfig(defaultPricingConfig)
    }
  }

  const handleExport = () => {
    try {
      const jsonString = exportPricingConfig(config)
      const blob = new Blob([jsonString], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `pricing-config-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Failed to export configuration:', error)
      alert('Failed to export configuration')
    }
  }

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const jsonString = e.target?.result as string
        const importedConfig = importPricingConfig(jsonString)
        setConfig(importedConfig)
        alert('Configuration imported successfully!')
      } catch (error) {
        console.error('Failed to import configuration:', error)
        alert('Failed to import configuration. Please check the file format.')
      }
    }
    reader.readAsText(file)
    // Reset the input
    event.target.value = ''
  }

  const addRoute = (regionIndex: number, category: 'shortHaul' | 'mediumHaul' | 'longHaul') => {
    const newRoute: RoutePrice = {
      route: '',
      minPrice: 0,
      maxPrice: 0,
      fluctuation: 15
    }
    
    const updatedConfig = { ...config }
    updatedConfig.regionPricing[regionIndex][category].push(newRoute)
    setConfig(updatedConfig)
  }

  const updateRoute = (regionIndex: number, category: 'shortHaul' | 'mediumHaul' | 'longHaul', routeIndex: number, field: keyof RoutePrice, value: string | number) => {
    const updatedConfig = { ...config }
    updatedConfig.regionPricing[regionIndex][category][routeIndex] = {
      ...updatedConfig.regionPricing[regionIndex][category][routeIndex],
      [field]: value
    }
    setConfig(updatedConfig)
  }

  const removeRoute = (regionIndex: number, category: 'shortHaul' | 'mediumHaul' | 'longHaul', routeIndex: number) => {
    const updatedConfig = { ...config }
    updatedConfig.regionPricing[regionIndex][category].splice(routeIndex, 1)
    setConfig(updatedConfig)
  }

  const updateServiceClass = (index: number, field: keyof ServiceClass, value: string | number) => {
    const updatedConfig = { ...config }
    updatedConfig.serviceClasses[index] = { ...updatedConfig.serviceClasses[index], [field]: value }
    setConfig(updatedConfig)
  }

  const updateTripType = (index: number, field: keyof TripType, value: string | number) => {
    const updatedConfig = { ...config }
    updatedConfig.tripTypes[index] = { ...updatedConfig.tripTypes[index], [field]: value }
    setConfig(updatedConfig)
  }

  const renderRouteSection = (routes: RoutePrice[], regionIndex: number, category: 'shortHaul' | 'mediumHaul' | 'longHaul', title: string) => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="text-lg font-semibold">{title}</h4>
        <Button 
          onClick={() => addRoute(regionIndex, category)}
          size="sm"
          className="bg-[#0ABAB5] hover:bg-[#0ABAB5]/90"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Route
        </Button>
      </div>
      
      {routes.map((route, routeIndex) => (
        <div key={routeIndex} className="grid grid-cols-5 gap-4 items-center p-4 border rounded-lg">
          <Input
            placeholder="Route (e.g., JFK-LAX)"
            value={route.route}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateRoute(regionIndex, category, routeIndex, 'route', e.target.value)}
          />
          <Input
            type="number"
            placeholder="Min Price"
            value={route.minPrice}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateRoute(regionIndex, category, routeIndex, 'minPrice', Number(e.target.value))}
          />
          <Input
            type="number"
            placeholder="Max Price"
            value={route.maxPrice}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateRoute(regionIndex, category, routeIndex, 'maxPrice', Number(e.target.value))}
          />
          <Input
            type="number"
            placeholder="Fluctuation %"
            value={route.fluctuation}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateRoute(regionIndex, category, routeIndex, 'fluctuation', Number(e.target.value))}
          />
          <Button
            onClick={() => removeRoute(regionIndex, category, routeIndex)}
            variant="destructive"
            size="sm"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ))}
    </div>
  )

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0ABAB5] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading pricing configuration...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#0D2B29]">Flight Pricing Management</h1>
          <p className="text-gray-600 mt-1">
            Last updated: {new Date(config.lastUpdated).toLocaleString()}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button onClick={handleSave} className="bg-[#0ABAB5] hover:bg-[#0ABAB5]/90">
            <Save className="w-4 h-4 mr-2" />
            Save Configuration
          </Button>
          <Button onClick={handleExport} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <label className="cursor-pointer">
            <Button variant="outline" asChild>
              <span>
                <Upload className="w-4 h-4 mr-2" />
                Import
              </span>
            </Button>
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
          </label>
          <Button onClick={handleReset} variant="destructive">
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>
      </div>

      <Tabs defaultValue="routes" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="routes">Routes & Pricing</TabsTrigger>
          <TabsTrigger value="classes">Service Classes</TabsTrigger>
          <TabsTrigger value="trips">Trip Types</TabsTrigger>
        </TabsList>

        <TabsContent value="routes" className="space-y-6">
          {regionPricing.map((region, regionIndex) => (
            <Card key={regionIndex}>
              <CardHeader>
                <CardTitle>{region.region}</CardTitle>
                <CardDescription>
                  Configure pricing for different route categories in {region.region}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                {renderRouteSection(region.shortHaul, regionIndex, 'shortHaul', 'Short Haul Routes')}
                {renderRouteSection(region.mediumHaul, regionIndex, 'mediumHaul', 'Medium Haul Routes')}
                {renderRouteSection(region.longHaul, regionIndex, 'longHaul', 'Long Haul Routes')}
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="classes">
          <Card>
            <CardHeader>
              <CardTitle>Service Class Multipliers</CardTitle>
              <CardDescription>
                Configure pricing multipliers for different service classes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {serviceClasses.map((serviceClass, index) => (
                  <div key={index} className="grid grid-cols-3 gap-4 items-center p-4 border rounded-lg">
                    <Input
                      placeholder="Class Name"
                      value={serviceClass.name}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateServiceClass(index, 'name', e.target.value)}
                    />
                    <Input
                      type="number"
                      step="0.1"
                      placeholder="Multiplier"
                      value={serviceClass.multiplier}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateServiceClass(index, 'multiplier', Number(e.target.value))}
                    />
                    <div className="text-sm text-gray-600">
                      Base price × {serviceClass.multiplier}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trips">
          <Card>
            <CardHeader>
              <CardTitle>Trip Type Multipliers</CardTitle>
              <CardDescription>
                Configure pricing multipliers for different trip types
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tripTypes.map((tripType, index) => (
                  <div key={index} className="grid grid-cols-3 gap-4 items-center p-4 border rounded-lg">
                    <Input
                      placeholder="Trip Type"
                      value={tripType.name}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateTripType(index, 'name', e.target.value)}
                    />
                    <Input
                      type="number"
                      step="0.1"
                      placeholder="Multiplier"
                      value={tripType.multiplier}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateTripType(index, 'multiplier', Number(e.target.value))}
                    />
                    <div className="text-sm text-gray-600">
                      Base price × {tripType.multiplier}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}