'use client'

import React from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DollarSign, MessageSquare, MapPin, Settings, BarChart3, Globe, Plane } from 'lucide-react'

export default function AdminDashboard() {
  const adminModules = [
    {
      title: 'Pricing Management',
      description: 'Configure flight pricing, multipliers, and route prices',
      href: '/admin/pricing',
      icon: DollarSign,
      color: 'bg-blue-500'
    },
    {
      title: 'Reviews Management',
      description: 'Add, edit, and delete customer testimonials and reviews',
      href: '/admin/reviews',
      icon: MessageSquare,
      color: 'bg-green-500'
    },
    {
      title: 'Cities Content',
      description: 'Manage city pages content, text, and images',
      href: '/admin/cities',
      icon: MapPin,
      color: 'bg-purple-500'
    },
    {
      title: 'Countries Content',
      description: 'Manage country pages content, text, and images',
      href: '/admin/countries',
      icon: Globe,
      color: 'bg-teal-500'
    },
    {
      title: 'Airlines Content',
      description: 'Manage airline pages content, features, and routes',
      href: '/admin/airlines',
      icon: Plane,
      color: 'bg-sky-500'
    },
    {
      title: 'Marketing & Analytics',
      description: 'Manage tracking codes and marketing tools',
      href: '/admin/marketing',
      icon: BarChart3,
      color: 'bg-orange-500'
    },
    {
      title: 'SEO Management',
      description: 'Manage meta tags, Open Graph, and Twitter Cards',
      href: '/admin/seo',
      icon: Settings,
      color: 'bg-indigo-500'
    }
  ]

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Admin Dashboard</h2>
        <p className="text-gray-600 mt-2">Manage site content and settings</p>
      </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminModules.map((module) => (
            <Link key={module.href} href={module.href}>
              <Card className="cursor-pointer hover:shadow-lg transition-shadow duration-200 h-full">
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${module.color}`}>
                      <module.icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-lg">{module.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm text-gray-600">
                    {module.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="mt-12 bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Stats</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">7</div>
              <div className="text-sm text-gray-600">City Pages</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">8</div>
              <div className="text-sm text-gray-600">Reviews</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">14</div>
              <div className="text-sm text-gray-600">Price Regions</div>
            </div>
          </div>
        </div>
    </div>
  )
}