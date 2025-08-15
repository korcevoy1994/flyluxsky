"use client"

import React, { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { User, Mail, Phone, Send, CheckCircle, AlertCircle } from 'lucide-react'

interface ContactFormProps {
  onSubmit?: (data: { name: string; email: string; phone: string }) => void
  variant?: 'brand' | 'neutral'
}

const FlightSearchFormVertical: React.FC<ContactFormProps> = ({ onSubmit, variant = 'brand' }) => {
  const router = useRouter()
  const sp = useSearchParams()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submissionStatus, setSubmissionStatus] = useState<'success' | 'error' | null>(null)
  const [focusedField, setFocusedField] = useState<string | null>(null)

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    if (submissionStatus) setSubmissionStatus(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.email || !formData.phone) {
      setSubmissionStatus('error')
      return
    }

    setIsSubmitting(true)
    setSubmissionStatus(null)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      if (onSubmit) onSubmit(formData)
      // Build thank-you URL with current search context if present
      const query = new URLSearchParams()
      const keys = ['from','to','departureDate','returnDate','passengers','class','tripType'] as const
      keys.forEach(k => {
        const v = sp.get(k)
        if (v) query.set(k, v)
      })
      router.push(`/thank-you${query.toString() ? `?${query.toString()}` : ''}`)
      return
    } catch {
      setSubmissionStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const isNeutral = variant === 'neutral'

  return (
    <div className="relative">
      {/* Background gradient (brand only) */}
      {!isNeutral && (
        <div className="absolute inset-0 bg-gradient-to-br from-[#ec5e39]/10 via-[#ec5e39]/5 to-[#ec5e39]/15 rounded-3xl"></div>
      )}
      
      <div className={`${isNeutral ? 'relative bg-white rounded-3xl p-5 max-w-md mx-auto' : 'relative bg-[#ec5e39] backdrop-blur-sm rounded-3xl shadow-2xl border border-[#ec5e39]/30 p-5 max-w-md mx-auto'}`}>
        {/* Header */}
        <div className="text-center mb-5">
          <div className={`${isNeutral ? 'w-12 h-12 bg-[#E8F4F8] rounded-2xl flex items-center justify-center mx-auto mb-3' : 'w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg border border-white/30'}`}>
            <Send size={20} className={`${isNeutral ? 'text-[#0ABAB5]' : 'text-white'}`} />
          </div>
          <h2 className={`font-poppins font-bold text-xl ${isNeutral ? 'text-[#0D2B29]' : 'text-white'} mb-1`}>
            Get a free quote
          </h2>
          <p className={`font-poppins text-xs ${isNeutral ? 'text-gray-600' : 'text-white/80'}`}>
            Please fill in your details below
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Field */}
          <div className="relative group">
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300 ${
                focusedField === 'name' 
                  ? (isNeutral ? 'bg-white scale-110' : 'bg-white shadow-lg scale-110')
                  : (isNeutral ? 'bg-[#E8F4F8]' : 'bg-white/20 backdrop-blur-sm border border-white/30')
              }`}>
                <User size={16} className={focusedField === 'name' ? (isNeutral ? 'text-[#0ABAB5]' : 'text-[#ec5e39]') : (isNeutral ? 'text-[#0ABAB5]' : 'text-white')} />
              </div>
              <label className={`font-poppins text-xs font-bold uppercase tracking-wide ${isNeutral ? 'text-gray-700' : 'text-white'}`}>
                Full Name
              </label>
            </div>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              onFocus={() => setFocusedField('name')}
              onBlur={() => setFocusedField(null)}
              placeholder="Enter your full name"
              className={`${isNeutral ? 'w-full bg-white rounded-xl p-3 font-poppins font-medium text-[#0D2B29] placeholder-gray-500 outline-none border border-gray-200 focus:border-[#0ABAB5] transition-all duration-300' : 'w-full bg-white/90 backdrop-blur-sm rounded-xl p-3 font-poppins font-medium text-[#0D2B29] placeholder-gray-500 border-2 border-white/30 outline-none focus:border-white focus:bg-white focus:shadow-lg transition-all duration-300'}`}
              required
            />
          </div>

          {/* Email Field */}
          <div className="relative group">
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300 ${
                focusedField === 'email' 
                  ? (isNeutral ? 'bg-white scale-110' : 'bg-white shadow-lg scale-110')
                  : (isNeutral ? 'bg-[#E8F4F8]' : 'bg-white/20 backdrop-blur-sm border border-white/30')
              }`}>
                <Mail size={16} className={focusedField === 'email' ? (isNeutral ? 'text-[#0ABAB5]' : 'text-[#ec5e39]') : (isNeutral ? 'text-[#0ABAB5]' : 'text-white')} />
              </div>
              <label className={`font-poppins text-xs font-bold uppercase tracking-wide ${isNeutral ? 'text-gray-700' : 'text-white'}`}>
                Email Address
              </label>
            </div>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              onFocus={() => setFocusedField('email')}
              onBlur={() => setFocusedField(null)}
              placeholder="Enter your email address"
              className={`${isNeutral ? 'w-full bg-white rounded-xl p-3 font-poppins font-medium text-[#0D2B29] placeholder-gray-500 outline-none border border-gray-200 focus:border-[#0ABAB5] transition-all duration-300' : 'w-full bg-white/90 backdrop-blur-sm rounded-xl p-3 font-poppins font-medium text-[#0D2B29] placeholder-gray-500 border-2 border-white/30 outline-none focus:border-white focus:bg-white focus:shadow-lg transition-all duration-300'}`}
              required
            />
          </div>

          {/* Phone Field */}
          <div className="relative group">
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300 ${
                focusedField === 'phone' 
                  ? (isNeutral ? 'bg-white scale-110' : 'bg-white shadow-lg scale-110')
                  : (isNeutral ? 'bg-[#E8F4F8]' : 'bg-white/20 backdrop-blur-sm border border-white/30')
              }`}>
                <Phone size={16} className={focusedField === 'phone' ? (isNeutral ? 'text-[#0ABAB5]' : 'text-[#ec5e39]') : (isNeutral ? 'text-[#0ABAB5]' : 'text-white')} />
              </div>
              <label className={`font-poppins text-xs font-bold uppercase tracking-wide ${isNeutral ? 'text-gray-700' : 'text-white'}`}>
                Phone Number
              </label>
            </div>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              onFocus={() => setFocusedField('phone')}
              onBlur={() => setFocusedField(null)}
              placeholder="Enter your phone number"
              className={`${isNeutral ? 'w-full bg-white rounded-xl p-3 font-poppins font-medium text-[#0D2B29] placeholder-gray-500 outline-none border border-gray-200 focus:border-[#0ABAB5] transition-all duration-300' : 'w-full bg-white/90 backdrop-blur-sm rounded-xl p-3 font-poppins font-medium text-[#0D2B29] placeholder-gray-500 border-2 border-white/30 outline-none focus:border-white focus:bg-white focus:shadow-lg transition-all duration-300'}`}
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 px-5 rounded-xl font-poppins font-bold transition-all duration-300 transform ${
              isSubmitting
                ? 'bg-gray-400 text-white cursor-not-allowed scale-95'
                : (isNeutral ? 'bg-[#0ABAB5] text-white hover:bg-[#099e99] hover:scale-105 active:scale-95' : 'bg-white text-[#ec5e39] hover:bg-white/90 hover:scale-105 active:scale-95')
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Send size={16} />
                  <span>Get a free quote</span>
                </>
              )}
            </div>
          </button>

          {/* Status Messages */}
          {submissionStatus === 'success' && (
            <div className="flex items-center justify-center gap-2 p-4 bg-green-50 border border-green-200 rounded-xl animate-pulse">
              <CheckCircle size={20} className="text-green-600" />
              <span className="text-green-700 font-poppins font-semibold">
                Information submitted successfully!
              </span>
            </div>
          )}
          
          {submissionStatus === 'error' && (
            <div className="flex items-center justify-center gap-2 p-4 bg-red-50 border border-red-200 rounded-xl animate-pulse">
              <AlertCircle size={20} className="text-red-600" />
              <span className="text-red-700 font-poppins font-semibold">
                Please fill in all required fields
              </span>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}

export default FlightSearchFormVertical