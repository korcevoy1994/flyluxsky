"use client"

import React, { useState } from 'react'
import { User, Mail, Phone, Send, CheckCircle, AlertCircle } from 'lucide-react'

interface ContactFormProps {
  onSubmit?: (data: { name: string; email: string; phone: string }) => void
}

const FlightSearchFormVertical: React.FC<ContactFormProps> = ({ onSubmit }) => {
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
      
      if (onSubmit) {
        onSubmit(formData)
      }
      
      setSubmissionStatus('success')
      setFormData({ name: '', email: '', phone: '' })
    } catch {
      setSubmissionStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="relative">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0ABAB5]/5 via-white to-[#E8F4F8]/30 rounded-3xl"></div>
      
      <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8 max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#0ABAB5] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Send size={24} className="text-white" />
          </div>
          <h2 className="font-poppins font-bold text-2xl text-[#0D2B29] mb-2">
            Get a free quote
          </h2>
          <p className="font-poppins text-gray-600 text-sm">
            Please fill in your details below
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Field */}
          <div className="relative group">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                focusedField === 'name' 
                  ? 'bg-[#0ABAB5] shadow-lg scale-110' 
                  : 'bg-[#E8F4F8]'
              }`}>
                <User size={18} className={focusedField === 'name' ? 'text-white' : 'text-[#0ABAB5]'} />
              </div>
              <label className="font-poppins text-sm font-bold text-[#0D2B29] uppercase tracking-wide">
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
              className="w-full bg-gray-50 rounded-xl p-4 font-poppins font-medium text-[#0D2B29] placeholder-gray-400 border-2 border-transparent outline-none focus:border-[#0ABAB5] focus:bg-white focus:shadow-lg transition-all duration-300"
              required
            />
          </div>

          {/* Email Field */}
          <div className="relative group">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                focusedField === 'email' 
                  ? 'bg-[#0ABAB5] shadow-lg scale-110' 
                  : 'bg-[#E8F4F8]'
              }`}>
                <Mail size={18} className={focusedField === 'email' ? 'text-white' : 'text-[#0ABAB5]'} />
              </div>
              <label className="font-poppins text-sm font-bold text-[#0D2B29] uppercase tracking-wide">
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
              className="w-full bg-gradient-to-r from-gray-50 to-[#F0FBFA]/50 rounded-xl p-4 font-poppins font-medium text-[#0D2B29] placeholder-gray-400 border-2 border-transparent outline-none focus:border-[#0ABAB5] focus:bg-white focus:shadow-lg transition-all duration-300"
              required
            />
          </div>

          {/* Phone Field */}
          <div className="relative group">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                focusedField === 'phone' 
                  ? 'bg-[#0ABAB5] shadow-lg scale-110' 
                  : 'bg-[#E8F4F8]'
              }`}>
                <Phone size={18} className={focusedField === 'phone' ? 'text-white' : 'text-[#0ABAB5]'} />
              </div>
              <label className="font-poppins text-sm font-bold text-[#0D2B29] uppercase tracking-wide">
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
              className="w-full bg-gradient-to-r from-gray-50 to-[#F0FBFA]/50 rounded-xl p-4 font-poppins font-medium text-[#0D2B29] placeholder-gray-400 border-2 border-transparent outline-none focus:border-[#0ABAB5] focus:bg-white focus:shadow-lg transition-all duration-300"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-4 px-6 rounded-xl font-poppins font-bold text-white transition-all duration-300 transform ${
              isSubmitting
                ? 'bg-gray-400 cursor-not-allowed scale-95'
                : 'bg-[#0ABAB5] hover:bg-[#089691] hover:shadow-2xl hover:scale-105 active:scale-95'
            } shadow-lg`}
          >
            <div className="flex items-center justify-center gap-2">
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Send size={18} />
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