'use client'

import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Save, Plus, Trash2, Download, Upload, ImageIcon, Star } from 'lucide-react'
import {
  defaultReviews,
  saveReviewsConfig,
  loadReviewsConfig,
  ensureReviewsConfigLoaded,
  exportReviewsConfig,
  importReviewsConfig,
  type ReviewData,
  addReview,
  updateReview,
  deleteReview
} from '@/lib/reviewsAdmin'

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<ReviewData[]>(defaultReviews)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const server = await ensureReviewsConfigLoaded()
        if (!cancelled) setReviews(server)
      } catch (error) {
        // Failed to load reviews from server, using local
        try {
          const local = loadReviewsConfig()
          if (!cancelled) setReviews(local)
        } catch (e) {
          if (!cancelled) setReviews(defaultReviews)
        }
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  const handleSave = async () => {
    setIsSaving(true)
    try {
      saveReviewsConfig(reviews)
      // Optionally publish to API if backend is available
      const response = await fetch('/api/reviews/manage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviews }),
      })
      
      if (!response.ok) {
        const backend = response.headers.get('x-reviews-write') || 'unknown'
        throw new Error(`Failed to publish reviews (backend=${backend})`)
      }
      
      const result = await response.json()
      const backend = response.headers.get('x-reviews-write') || 'unknown'
      
      // Reload reviews from server to ensure UI is in sync
      try {
        const updatedReviews = await ensureReviewsConfigLoaded()
        setReviews(updatedReviews)
      } catch (e) {
        // If reload fails, keep current state
        console.warn('Failed to reload reviews after save:', e)
      }
      
      alert(`Reviews saved successfully (backend: ${backend})`)
    } catch (error) {
      // Error occurred
      console.error('Save error:', error)
      alert('Saved locally, but failed to publish to server API')
    } finally {
      setIsSaving(false)
    }
  }

  const handleAdd = () => {
    const name = prompt('Reviewer name') || 'New User'
    const review = prompt('Review text') || ''
    const rating = 5
    const date = new Date().toLocaleDateString()
    setReviews(prev => addReview(prev, { name, avatar: '', rating, date, review }))
  }

  const handleImport = () => {
    const json = prompt('Paste reviews JSON')
    if (!json) return
    try {
      const imported = importReviewsConfig(json)
      setReviews(imported)
      alert('Imported successfully')
    } catch (e) {
      alert('Invalid JSON')
    }
  }

  const handleExport = () => {
    const json = exportReviewsConfig(reviews)
    navigator.clipboard.writeText(json)
    alert('Copied JSON to clipboard')
  }

  if (isLoading) {
    return <div className="py-6">Loading...</div>
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Reviews Management</h2>
          <p className="text-gray-600">Add, edit and delete reviews on the website</p>
        </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleImport}><Upload className="h-4 w-4 mr-2"/>Import</Button>
            <Button variant="outline" onClick={handleExport}><Download className="h-4 w-4 mr-2"/>Export</Button>

            <Button onClick={handleSave} disabled={isSaving}>
              <Save className="h-4 w-4 mr-2"/>
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Reviews</CardTitle>
            <CardDescription>Manage up to 60 latest reviews</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-end mb-4">
              <Button onClick={handleAdd}><Plus className="h-4 w-4 mr-2"/>Add Review</Button>
            </div>

            <div className="space-y-4">
              {reviews.map((r, idx) => (
                <div key={r.id || idx} className="grid grid-cols-1 md:grid-cols-12 gap-3 p-4 border rounded-lg bg-white">
                  <div className="md:col-span-2">
                    <Input
                      placeholder="Name"
                      value={r.name}
                      onChange={(e) => setReviews(prev => updateReview(prev, r.id!, { name: e.target.value }))}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Input
                      placeholder="Avatar URL"
                      value={r.avatar || ''}
                      onChange={(e) => setReviews(prev => updateReview(prev, r.id!, { avatar: e.target.value }))}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Input
                      placeholder="Date"
                      value={r.date}
                      onChange={(e) => setReviews(prev => updateReview(prev, r.id!, { date: e.target.value }))}
                    />
                  </div>
                  <div className="md:col-span-1">
                    <Input
                      type="number"
                      min={1}
                      max={5}
                      placeholder="Rating"
                      value={r.rating}
                      onChange={(e) => setReviews(prev => updateReview(prev, r.id!, { rating: Number(e.target.value) }))}
                    />
                  </div>
                  <div className="md:col-span-4">
                    <textarea
                      placeholder="Review text"
                      value={r.review}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setReviews(prev => updateReview(prev, r.id!, { review: e.target.value }))}
                      className="min-h-[72px] w-full border border-input bg-background px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    />
                  </div>
                  <div className="md:col-span-1 flex items-start justify-end gap-2">
                    <Button variant="destructive" onClick={() => setReviews(prev => deleteReview(prev, r.id!))}>
                      <Trash2 className="h-4 w-4"/>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
    </div>
  )
}