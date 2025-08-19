'use client'

import React, { useState, useRef, useEffect } from 'react'
import { ChevronDown, Search, Check } from 'lucide-react'

interface Country {
  code: string
  name: string
  flag: string
  dialCode: string
  format?: string
}

interface PhoneInputProps {
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  className?: string
  required?: boolean
  error?: string
  label?: string
}

const countries: Country[] = [
  { code: 'US', name: 'United States', flag: '🇺🇸', dialCode: '+1', format: '(###) ###-####' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', dialCode: '+44', format: '#### ### ####' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦', dialCode: '+1', format: '(###) ###-####' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺', dialCode: '+61', format: '### ### ###' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪', dialCode: '+49', format: '### ########' },
  { code: 'FR', name: 'France', flag: '🇫🇷', dialCode: '+33', format: '# ## ## ## ##' },
  { code: 'IT', name: 'Italy', flag: '🇮🇹', dialCode: '+39', format: '### ### ####' },
  { code: 'ES', name: 'Spain', flag: '🇪🇸', dialCode: '+34', format: '### ### ###' },
  { code: 'NL', name: 'Netherlands', flag: '🇳🇱', dialCode: '+31', format: '# ########' },
  { code: 'BE', name: 'Belgium', flag: '🇧🇪', dialCode: '+32', format: '### ## ## ##' },
  { code: 'CH', name: 'Switzerland', flag: '🇨🇭', dialCode: '+41', format: '## ### ## ##' },
  { code: 'AT', name: 'Austria', flag: '🇦🇹', dialCode: '+43', format: '### #######' },
  { code: 'SE', name: 'Sweden', flag: '🇸🇪', dialCode: '+46', format: '## ### ## ##' },
  { code: 'NO', name: 'Norway', flag: '🇳🇴', dialCode: '+47', format: '### ## ###' },
  { code: 'DK', name: 'Denmark', flag: '🇩🇰', dialCode: '+45', format: '## ## ## ##' },
  { code: 'FI', name: 'Finland', flag: '🇫🇮', dialCode: '+358', format: '## ### ####' },
  { code: 'PL', name: 'Poland', flag: '🇵🇱', dialCode: '+48', format: '### ### ###' },
  { code: 'CZ', name: 'Czech Republic', flag: '🇨🇿', dialCode: '+420', format: '### ### ###' },
  { code: 'HU', name: 'Hungary', flag: '🇭🇺', dialCode: '+36', format: '## ### ####' },
  { code: 'PT', name: 'Portugal', flag: '🇵🇹', dialCode: '+351', format: '### ### ###' },
  { code: 'GR', name: 'Greece', flag: '🇬🇷', dialCode: '+30', format: '### ### ####' },
  { code: 'IE', name: 'Ireland', flag: '🇮🇪', dialCode: '+353', format: '## ### ####' },
  { code: 'RU', name: 'Russia', flag: '🇷🇺', dialCode: '+7', format: '### ###-##-##' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵', dialCode: '+81', format: '##-####-####' },
  { code: 'KR', name: 'South Korea', flag: '🇰🇷', dialCode: '+82', format: '##-####-####' },
  { code: 'CN', name: 'China', flag: '🇨🇳', dialCode: '+86', format: '### #### ####' },
  { code: 'IN', name: 'India', flag: '🇮🇳', dialCode: '+91', format: '##### #####' },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷', dialCode: '+55', format: '## #####-####' },
  { code: 'MX', name: 'Mexico', flag: '🇲🇽', dialCode: '+52', format: '## #### ####' },
  { code: 'AR', name: 'Argentina', flag: '🇦🇷', dialCode: '+54', format: '## ####-####' },
  { code: 'ZA', name: 'South Africa', flag: '🇿🇦', dialCode: '+27', format: '## ### ####' },
  { code: 'EG', name: 'Egypt', flag: '🇪🇬', dialCode: '+20', format: '## #### ####' },
  { code: 'AE', name: 'United Arab Emirates', flag: '🇦🇪', dialCode: '+971', format: '## ### ####' },
  { code: 'SA', name: 'Saudi Arabia', flag: '🇸🇦', dialCode: '+966', format: '## ### ####' },
  { code: 'IL', name: 'Israel', flag: '🇮🇱', dialCode: '+972', format: '##-###-####' },
  { code: 'TR', name: 'Turkey', flag: '🇹🇷', dialCode: '+90', format: '### ### ## ##' },
]

const formatPhoneNumber = (number: string, format?: string): string => {
  if (!format || !number) return number
  
  const digits = number.replace(/\D/g, '')
  let formatted = ''
  let digitIndex = 0
  
  for (let i = 0; i < format.length && digitIndex < digits.length; i++) {
    if (format[i] === '#') {
      formatted += digits[digitIndex]
      digitIndex++
    } else {
      formatted += format[i]
    }
  }
  
  return formatted
}

const PhoneInput: React.FC<PhoneInputProps> = ({
  value = '',
  onChange,
  placeholder = 'Enter phone number',
  className = '',
  required = false,
  error,
  label
}) => {
  const [selectedCountry, setSelectedCountry] = useState<Country>(countries[0])
  const [phoneNumber, setPhoneNumber] = useState('')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  
  const dropdownRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Filter countries based on search
  const filteredCountries = countries.filter(country =>
    country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    country.dialCode.includes(searchQuery)
  )

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
        setSearchQuery('')
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Parse initial value
  useEffect(() => {
    if (value) {
      // Try to detect country from the value
      const detectedCountry = countries.find(country => 
        value.startsWith(country.dialCode)
      )
      
      if (detectedCountry) {
        setSelectedCountry(detectedCountry)
        const numberPart = value.replace(detectedCountry.dialCode, '').trim()
        setPhoneNumber(formatPhoneNumber(numberPart, detectedCountry.format))
      } else {
        setPhoneNumber(value)
      }
    }
  }, [value])

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country)
    setIsDropdownOpen(false)
    setSearchQuery('')
    
    // Update the full phone number
    const formattedNumber = formatPhoneNumber(phoneNumber, country.format)
    const fullNumber = `${country.dialCode} ${formattedNumber}`.trim()
    onChange?.(fullNumber)
    
    // Focus input after selection
    setTimeout(() => {
      inputRef.current?.focus()
    }, 100)
  }

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value
    const digitsOnly = rawValue.replace(/\D/g, '')
    
    // Limit number length
    if (digitsOnly.length > 15) return
    
    const formattedNumber = formatPhoneNumber(digitsOnly, selectedCountry.format)
    setPhoneNumber(formattedNumber)
    
    // Update full value
    const fullNumber = `${selectedCountry.dialCode} ${formattedNumber}`.trim()
    onChange?.(fullNumber)
  }

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen)
    if (!isDropdownOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus()
      }, 100)
    }
  }

  const handleFocus = () => {
    setIsFocused(true)
  }

  const handleBlur = () => {
    setIsFocused(false)
  }

  return (
    <div className={`relative w-full ${className}`} ref={dropdownRef}>
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-[#0D2B29] mb-2 font-poppins">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      {/* Input Container */}
      <div className="relative">
        <div className={`
          relative flex items-center w-full
          border-b-2 transition-all duration-300 ease-in-out
          ${error 
            ? 'border-red-400' 
            : isFocused || isDropdownOpen
              ? 'border-[#0ABAB5]' 
              : 'border-[#0D2B29]/20'
          }
          hover:border-[#0ABAB5]/60
          bg-transparent
        `}>
          
          {/* Country Selector */}
          <button
            type="button"
            className={`
              flex items-center gap-3 px-0 py-3
              transition-all duration-200 ease-in-out
              hover:bg-[#0ABAB5]/5 rounded-l-md
              focus:outline-none focus:ring-2 focus:ring-[#0ABAB5]/20
              ${isDropdownOpen ? 'bg-[#0ABAB5]/5' : ''}
            `}
            onClick={handleDropdownToggle}
            aria-label={`Selected country: ${selectedCountry.name}`}
            aria-expanded={isDropdownOpen}
          >
            <span className="text-xl leading-none" role="img" aria-label={selectedCountry.name}>
              {selectedCountry.flag}
            </span>
            <span className="text-sm font-semibold text-[#0D2B29] font-poppins min-w-[2.5rem] text-left">
              {selectedCountry.dialCode}
            </span>
            <ChevronDown 
              className={`
                w-4 h-4 text-[#0D2B29]/50 transition-all duration-300 ease-in-out
                ${isDropdownOpen ? 'rotate-180 text-[#0ABAB5]' : ''}
              `} 
            />
          </button>

          {/* Separator */}
          <div className="w-px h-6 bg-[#0D2B29]/20 mx-3" />

          {/* Phone Number Input */}
          <input
            ref={inputRef}
            type="tel"
            value={phoneNumber}
            onChange={handlePhoneNumberChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className={`
              flex-1 bg-transparent outline-none py-3 pr-2
              font-poppins text-[#0D2B29] text-base
              placeholder-[#0D2B29]/40
              transition-all duration-200 ease-in-out
            `}
            placeholder={placeholder}
            required={required}
            autoComplete="tel"
          />
        </div>

        {/* Error Message */}
        {error && (
          <p className="mt-2 text-sm text-red-500 font-poppins animate-in slide-in-from-top-1 duration-200">
            {error}
          </p>
        )}
      </div>

      {/* Country Dropdown */}
      {isDropdownOpen && (
        <div className={`
          absolute top-full left-0 right-0 mt-2 z-50
          bg-white border border-[#0D2B29]/10 rounded-xl shadow-2xl
          max-h-80 overflow-hidden
          animate-in fade-in-0 slide-in-from-top-2 duration-200
        `}>
          {/* Search Header */}
          <div className="sticky top-0 bg-white border-b border-[#0D2B29]/5 p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#0D2B29]/40" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`
                  w-full pl-10 pr-4 py-3 text-sm
                  border border-[#0D2B29]/10 rounded-lg
                  focus:outline-none focus:ring-2 focus:ring-[#0ABAB5]/20 focus:border-[#0ABAB5]
                  placeholder-[#0D2B29]/40 font-poppins
                  transition-all duration-200 ease-in-out
                  bg-[#F8FFFE]
                `}
                placeholder="Search countries..."
              />
            </div>
          </div>
          
          {/* Countries List */}
          <div className="max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-[#0ABAB5]/20 scrollbar-track-transparent">
            {filteredCountries.length > 0 ? (
              filteredCountries.map((country) => (
                <button
                  key={country.code}
                  type="button"
                  className={`
                    w-full px-4 py-3 text-left
                    hover:bg-[#0ABAB5]/5 focus:bg-[#0ABAB5]/5 focus:outline-none
                    flex items-center space-x-4 font-poppins text-sm
                    transition-all duration-150 ease-in-out
                    border-b border-[#0D2B29]/5 last:border-b-0
                    ${selectedCountry.code === country.code ? 'bg-[#0ABAB5]/10' : ''}
                  `}
                  onClick={() => handleCountrySelect(country)}
                >
                  <span className="text-lg flex-shrink-0 leading-none" role="img" aria-label={country.name}>
                    {country.flag}
                  </span>
                  <span className="font-semibold text-[#0D2B29]/70 flex-shrink-0 min-w-[3.5rem] text-left">
                    {country.dialCode}
                  </span>
                  <span className="text-[#0D2B29] truncate flex-1">
                    {country.name}
                  </span>
                  {selectedCountry.code === country.code && (
                    <Check className="w-4 h-4 text-[#0ABAB5] flex-shrink-0" />
                  )}
                </button>
              ))
            ) : (
              <div className="px-4 py-8 text-center text-[#0D2B29]/50 text-sm font-poppins">
                <Search className="w-8 h-8 mx-auto mb-2 text-[#0D2B29]/30" />
                <p>No countries found</p>
                <p className="text-xs mt-1">Try a different search term</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default PhoneInput