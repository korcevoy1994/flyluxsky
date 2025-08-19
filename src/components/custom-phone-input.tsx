"use client"

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { ChevronDown, Search, X } from 'lucide-react'

interface Country {
  code: string
  name: string
  flag: string
  dialCode: string
  format?: string
  priority?: number
}

interface CustomPhoneInputProps {
  value: string | undefined
  onChange: (value: string | undefined) => void
  className?: string
  required?: boolean
  style?: 'modal' | 'vertical' | 'contact'
  disabled?: boolean
  placeholder?: string
  autoFocus?: boolean
  onValidationChange?: (isValid: boolean) => void
  onFocus?: () => void
  onBlur?: () => void
}

// Расширенный список стран с приоритетами и форматами
const countries: Country[] = [
  // Популярные страны (приоритет 1)
  { code: 'US', name: 'United States', flag: '🇺🇸', dialCode: '+1', format: '(###) ###-####', priority: 1 },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', dialCode: '+44', format: '#### ### ####', priority: 1 },
  { code: 'CA', name: 'Canada', flag: '🇨🇦', dialCode: '+1', format: '(###) ###-####', priority: 1 },
  { code: 'AU', name: 'Australia', flag: '🇦🇺', dialCode: '+61', format: '### ### ###', priority: 1 },
  { code: 'DE', name: 'Germany', flag: '🇩🇪', dialCode: '+49', format: '### ########', priority: 1 },
  { code: 'FR', name: 'France', flag: '🇫🇷', dialCode: '+33', format: '# ## ## ## ##', priority: 1 },
  
  // Европейские страны (приоритет 2)
  { code: 'IT', name: 'Italy', flag: '🇮🇹', dialCode: '+39', format: '### ### ####', priority: 2 },
  { code: 'ES', name: 'Spain', flag: '🇪🇸', dialCode: '+34', format: '### ### ###', priority: 2 },
  { code: 'NL', name: 'Netherlands', flag: '🇳🇱', dialCode: '+31', format: '# ########', priority: 2 },
  { code: 'BE', name: 'Belgium', flag: '🇧🇪', dialCode: '+32', format: '### ## ## ##', priority: 2 },
  { code: 'CH', name: 'Switzerland', flag: '🇨🇭', dialCode: '+41', format: '## ### ## ##', priority: 2 },
  { code: 'AT', name: 'Austria', flag: '🇦🇹', dialCode: '+43', format: '### #######', priority: 2 },
  { code: 'SE', name: 'Sweden', flag: '🇸🇪', dialCode: '+46', format: '## ### ## ##', priority: 2 },
  { code: 'NO', name: 'Norway', flag: '🇳🇴', dialCode: '+47', format: '### ## ###', priority: 2 },
  { code: 'DK', name: 'Denmark', flag: '🇩🇰', dialCode: '+45', format: '## ## ## ##', priority: 2 },
  { code: 'FI', name: 'Finland', flag: '🇫🇮', dialCode: '+358', format: '## ### ####', priority: 2 },
  { code: 'PL', name: 'Poland', flag: '🇵🇱', dialCode: '+48', format: '### ### ###', priority: 2 },
  { code: 'CZ', name: 'Czech Republic', flag: '🇨🇿', dialCode: '+420', format: '### ### ###', priority: 2 },
  { code: 'HU', name: 'Hungary', flag: '🇭🇺', dialCode: '+36', format: '## ### ####', priority: 2 },
  { code: 'PT', name: 'Portugal', flag: '🇵🇹', dialCode: '+351', format: '### ### ###', priority: 2 },
  { code: 'GR', name: 'Greece', flag: '🇬🇷', dialCode: '+30', format: '### ### ####', priority: 2 },
  { code: 'IE', name: 'Ireland', flag: '🇮🇪', dialCode: '+353', format: '## ### ####', priority: 2 },
  { code: 'LU', name: 'Luxembourg', flag: '🇱🇺', dialCode: '+352', format: '### ### ###', priority: 2 },
  
  // Азиатские страны (приоритет 3)
  { code: 'JP', name: 'Japan', flag: '🇯🇵', dialCode: '+81', format: '##-####-####', priority: 3 },
  { code: 'KR', name: 'South Korea', flag: '🇰🇷', dialCode: '+82', format: '##-####-####', priority: 3 },
  { code: 'CN', name: 'China', flag: '🇨🇳', dialCode: '+86', format: '### #### ####', priority: 3 },
  { code: 'IN', name: 'India', flag: '🇮🇳', dialCode: '+91', format: '##### #####', priority: 3 },
  { code: 'SG', name: 'Singapore', flag: '🇸🇬', dialCode: '+65', format: '#### ####', priority: 3 },
  { code: 'HK', name: 'Hong Kong', flag: '🇭🇰', dialCode: '+852', format: '#### ####', priority: 3 },
  { code: 'TH', name: 'Thailand', flag: '🇹🇭', dialCode: '+66', format: '##-###-####', priority: 3 },
  { code: 'VN', name: 'Vietnam', flag: '🇻🇳', dialCode: '+84', format: '### ### ####', priority: 3 },
  { code: 'MY', name: 'Malaysia', flag: '🇲🇾', dialCode: '+60', format: '##-### ####', priority: 3 },
  { code: 'ID', name: 'Indonesia', flag: '🇮🇩', dialCode: '+62', format: '###-###-####', priority: 3 },
  { code: 'PH', name: 'Philippines', flag: '🇵🇭', dialCode: '+63', format: '### ### ####', priority: 3 },
  
  // Ближний Восток (приоритет 4)
  { code: 'AE', name: 'United Arab Emirates', flag: '🇦🇪', dialCode: '+971', format: '## ### ####', priority: 4 },
  { code: 'SA', name: 'Saudi Arabia', flag: '🇸🇦', dialCode: '+966', format: '## ### ####', priority: 4 },
  { code: 'IL', name: 'Israel', flag: '🇮🇱', dialCode: '+972', format: '##-###-####', priority: 4 },
  { code: 'TR', name: 'Turkey', flag: '🇹🇷', dialCode: '+90', format: '### ### ## ##', priority: 4 },
  
  // Другие страны (приоритет 5)
  { code: 'RU', name: 'Russia', flag: '🇷🇺', dialCode: '+7', format: '### ###-##-##', priority: 5 },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷', dialCode: '+55', format: '## #####-####', priority: 5 },
  { code: 'MX', name: 'Mexico', flag: '🇲🇽', dialCode: '+52', format: '## #### ####', priority: 5 },
  { code: 'AR', name: 'Argentina', flag: '🇦🇷', dialCode: '+54', format: '## ####-####', priority: 5 },
  { code: 'CL', name: 'Chile', flag: '🇨🇱', dialCode: '+56', format: '# #### ####', priority: 5 },
  { code: 'CO', name: 'Colombia', flag: '🇨🇴', dialCode: '+57', format: '### ### ####', priority: 5 },
  { code: 'PE', name: 'Peru', flag: '🇵🇪', dialCode: '+51', format: '### ### ###', priority: 5 },
  { code: 'ZA', name: 'South Africa', flag: '🇿🇦', dialCode: '+27', format: '## ### ####', priority: 5 },
  { code: 'EG', name: 'Egypt', flag: '🇪🇬', dialCode: '+20', format: '## #### ####', priority: 5 },
  { code: 'MA', name: 'Morocco', flag: '🇲🇦', dialCode: '+212', format: '###-######', priority: 5 },
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬', dialCode: '+234', format: '### ### ####', priority: 5 },
  { code: 'KE', name: 'Kenya', flag: '🇰🇪', dialCode: '+254', format: '### ######', priority: 5 },
  { code: 'NZ', name: 'New Zealand', flag: '🇳🇿', dialCode: '+64', format: '## ### ####', priority: 5 },
  
  // Дополнительные европейские страны
  { code: 'RO', name: 'Romania', flag: '🇷🇴', dialCode: '+40', format: '### ### ###', priority: 5 },
  { code: 'BG', name: 'Bulgaria', flag: '🇧🇬', dialCode: '+359', format: '### ### ###', priority: 5 },
  { code: 'HR', name: 'Croatia', flag: '🇭🇷', dialCode: '+385', format: '## ### ####', priority: 5 },
  { code: 'SI', name: 'Slovenia', flag: '🇸🇮', dialCode: '+386', format: '## ### ###', priority: 5 },
  { code: 'SK', name: 'Slovakia', flag: '🇸🇰', dialCode: '+421', format: '### ### ###', priority: 5 },
  { code: 'LT', name: 'Lithuania', flag: '🇱🇹', dialCode: '+370', format: '### #####', priority: 5 },
  { code: 'LV', name: 'Latvia', flag: '🇱🇻', dialCode: '+371', format: '## ### ###', priority: 5 },
  { code: 'EE', name: 'Estonia', flag: '🇪🇪', dialCode: '+372', format: '### ####', priority: 5 },
  { code: 'UA', name: 'Ukraine', flag: '🇺🇦', dialCode: '+380', format: '## ### ## ##', priority: 5 },
  { code: 'BY', name: 'Belarus', flag: '🇧🇾', dialCode: '+375', format: '## ###-##-##', priority: 5 },
  
  // Дополнительные страны СНГ и Азии
  { code: 'KZ', name: 'Kazakhstan', flag: '🇰🇿', dialCode: '+7', format: '### ###-##-##', priority: 5 },
  { code: 'UZ', name: 'Uzbekistan', flag: '🇺🇿', dialCode: '+998', format: '## ### ## ##', priority: 5 },
  { code: 'AZ', name: 'Azerbaijan', flag: '🇦🇿', dialCode: '+994', format: '## ### ## ##', priority: 5 },
  { code: 'AM', name: 'Armenia', flag: '🇦🇲', dialCode: '+374', format: '## ######', priority: 5 },
  { code: 'GE', name: 'Georgia', flag: '🇬🇪', dialCode: '+995', format: '### ## ## ##', priority: 5 },
  { code: 'KG', name: 'Kyrgyzstan', flag: '🇰🇬', dialCode: '+996', format: '### ######', priority: 5 },
  { code: 'TJ', name: 'Tajikistan', flag: '🇹🇯', dialCode: '+992', format: '## ### ####', priority: 5 },
  { code: 'TM', name: 'Turkmenistan', flag: '🇹🇲', dialCode: '+993', format: '## ######', priority: 5 },
  { code: 'MD', name: 'Moldova', flag: '🇲🇩', dialCode: '+373', format: '## ### ###', priority: 5 },
  
  // Дополнительные европейские страны
  { code: 'IS', name: 'Iceland', flag: '🇮🇸', dialCode: '+354', format: '### ####', priority: 5 },
  { code: 'MT', name: 'Malta', flag: '🇲🇹', dialCode: '+356', format: '#### ####', priority: 5 },
  { code: 'CY', name: 'Cyprus', flag: '🇨🇾', dialCode: '+357', format: '## ######', priority: 5 },
  { code: 'MK', name: 'North Macedonia', flag: '🇲🇰', dialCode: '+389', format: '## ### ###', priority: 5 },
  { code: 'AL', name: 'Albania', flag: '🇦🇱', dialCode: '+355', format: '## ### ####', priority: 5 },
  { code: 'ME', name: 'Montenegro', flag: '🇲🇪', dialCode: '+382', format: '## ### ###', priority: 5 },
  { code: 'RS', name: 'Serbia', flag: '🇷🇸', dialCode: '+381', format: '## ### ####', priority: 5 },
  { code: 'BA', name: 'Bosnia and Herzegovina', flag: '🇧🇦', dialCode: '+387', format: '## ### ###', priority: 5 },
  
  // Дополнительные азиатские страны
  { code: 'BD', name: 'Bangladesh', flag: '🇧🇩', dialCode: '+880', format: '####-######', priority: 5 },
  { code: 'PK', name: 'Pakistan', flag: '🇵🇰', dialCode: '+92', format: '### #######', priority: 5 },
  { code: 'LK', name: 'Sri Lanka', flag: '🇱🇰', dialCode: '+94', format: '## ### ####', priority: 5 },
  { code: 'MM', name: 'Myanmar', flag: '🇲🇲', dialCode: '+95', format: '# ### ####', priority: 5 },
  { code: 'KH', name: 'Cambodia', flag: '🇰🇭', dialCode: '+855', format: '## ### ###', priority: 5 },
  { code: 'LA', name: 'Laos', flag: '🇱🇦', dialCode: '+856', format: '## ### ###', priority: 5 },
  { code: 'BN', name: 'Brunei', flag: '🇧🇳', dialCode: '+673', format: '### ####', priority: 5 },
  { code: 'MN', name: 'Mongolia', flag: '🇲🇳', dialCode: '+976', format: '#### ####', priority: 5 },
  
  // Ближний Восток и Африка
  { code: 'IR', name: 'Iran', flag: '🇮🇷', dialCode: '+98', format: '### ### ####', priority: 5 },
  { code: 'IQ', name: 'Iraq', flag: '🇮🇶', dialCode: '+964', format: '### ### ####', priority: 5 },
  { code: 'JO', name: 'Jordan', flag: '🇯🇴', dialCode: '+962', format: '# #### ####', priority: 5 },
  { code: 'LB', name: 'Lebanon', flag: '🇱🇧', dialCode: '+961', format: '## ### ###', priority: 5 },
  { code: 'SY', name: 'Syria', flag: '🇸🇾', dialCode: '+963', format: '### ### ###', priority: 5 },
  { code: 'YE', name: 'Yemen', flag: '🇾🇪', dialCode: '+967', format: '### ### ###', priority: 5 },
  { code: 'OM', name: 'Oman', flag: '🇴🇲', dialCode: '+968', format: '#### ####', priority: 5 },
  { code: 'KW', name: 'Kuwait', flag: '🇰🇼', dialCode: '+965', format: '#### ####', priority: 5 },
  { code: 'BH', name: 'Bahrain', flag: '🇧🇭', dialCode: '+973', format: '#### ####', priority: 5 },
  { code: 'QA', name: 'Qatar', flag: '🇶🇦', dialCode: '+974', format: '#### ####', priority: 5 },
  
  // Африканские страны
  { code: 'GH', name: 'Ghana', flag: '🇬🇭', dialCode: '+233', format: '### ### ###', priority: 5 },
  { code: 'ET', name: 'Ethiopia', flag: '🇪🇹', dialCode: '+251', format: '## ### ####', priority: 5 },
  { code: 'TZ', name: 'Tanzania', flag: '🇹🇿', dialCode: '+255', format: '### ### ###', priority: 5 },
  { code: 'UG', name: 'Uganda', flag: '🇺🇬', dialCode: '+256', format: '### ######', priority: 5 },
  { code: 'ZW', name: 'Zimbabwe', flag: '🇿🇼', dialCode: '+263', format: '## ### ####', priority: 5 },
  { code: 'ZM', name: 'Zambia', flag: '🇿🇲', dialCode: '+260', format: '## ### ####', priority: 5 },
  { code: 'BW', name: 'Botswana', flag: '🇧🇼', dialCode: '+267', format: '## ### ###', priority: 5 },
  { code: 'NA', name: 'Namibia', flag: '🇳🇦', dialCode: '+264', format: '## ### ####', priority: 5 },
  
  // Океания и другие
  { code: 'FJ', name: 'Fiji', flag: '🇫🇯', dialCode: '+679', format: '### ####', priority: 5 },
  { code: 'PG', name: 'Papua New Guinea', flag: '🇵🇬', dialCode: '+675', format: '### ####', priority: 5 },
  { code: 'NC', name: 'New Caledonia', flag: '🇳🇨', dialCode: '+687', format: '## ## ##', priority: 5 },
  
  // Дополнительные американские страны
  { code: 'VE', name: 'Venezuela', flag: '🇻🇪', dialCode: '+58', format: '###-#######', priority: 5 },
  { code: 'UY', name: 'Uruguay', flag: '🇺🇾', dialCode: '+598', format: '#### ####', priority: 5 },
  { code: 'PY', name: 'Paraguay', flag: '🇵🇾', dialCode: '+595', format: '### ######', priority: 5 },
  { code: 'BO', name: 'Bolivia', flag: '🇧🇴', dialCode: '+591', format: '#### ####', priority: 5 },
  { code: 'EC', name: 'Ecuador', flag: '🇪🇨', dialCode: '+593', format: '## ### ####', priority: 5 },
  { code: 'GT', name: 'Guatemala', flag: '🇬🇹', dialCode: '+502', format: '#### ####', priority: 5 },
  { code: 'HN', name: 'Honduras', flag: '🇭🇳', dialCode: '+504', format: '#### ####', priority: 5 },
  { code: 'SV', name: 'El Salvador', flag: '🇸🇻', dialCode: '+503', format: '#### ####', priority: 5 },
  { code: 'NI', name: 'Nicaragua', flag: '🇳🇮', dialCode: '+505', format: '#### ####', priority: 5 },
  { code: 'CR', name: 'Costa Rica', flag: '🇨🇷', dialCode: '+506', format: '#### ####', priority: 5 },
  { code: 'PA', name: 'Panama', flag: '🇵🇦', dialCode: '+507', format: '#### ####', priority: 5 }
]

// Утилиты для форматирования и валидации
const formatPhoneNumber = (number: string, format?: string): string => {
  if (!format) return number
  
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

const validatePhoneNumber = (number: string, country: Country): boolean => {
  const digits = number.replace(/\D/g, '')
  const minLength = country.format ? country.format.split('#').length - 1 : 7
  return digits.length >= minLength && digits.length <= 15
}

const detectCountryFromNumber = (fullNumber: string): Country | null => {
  // Сортируем страны по длине кода (длинные коды первыми)
  const sortedCountries = [...countries].sort((a, b) => b.dialCode.length - a.dialCode.length)
  
  for (const country of sortedCountries) {
    if (fullNumber.startsWith(country.dialCode)) {
      return country
    }
  }
  return null
}

const CustomPhoneInput: React.FC<CustomPhoneInputProps> = ({
  value,
  onChange,
  className,
  required = false,
  style = 'modal',
  disabled = false,
  placeholder,
  autoFocus = false,
  onValidationChange,
  onFocus,
  onBlur
}) => {
  const [selectedCountry, setSelectedCountry] = useState<Country>(countries[0])
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [isValid, setIsValid] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const countriesListRef = useRef<HTMLDivElement>(null)
  const selectedCountryRef = useRef<HTMLButtonElement>(null)

  // Мемоизированный отфильтрованный список стран
  const filteredCountries = useMemo(() => {
    if (!searchQuery) {
      return countries.sort((a, b) => (a.priority || 5) - (b.priority || 5))
    }
    
    const query = searchQuery.toLowerCase()
    return countries
      .filter(country => 
        country.name.toLowerCase().includes(query) ||
        country.code.toLowerCase().includes(query) ||
        country.dialCode.includes(query)
      )
      .sort((a, b) => {
         // Приоритет для точных совпадений
         const aExact = a.name.toLowerCase().startsWith(query) ? 0 : 1
         const bExact = b.name.toLowerCase().startsWith(query) ? 0 : 1
         if (aExact !== bExact) return aExact - bExact
         
         return (a.priority || 5) - (b.priority || 5)
       })
  }, [searchQuery])

  // Определение мобильной версии
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Определение страны по геолокации (опционально)
  useEffect(() => {
    const detectUserCountry = async () => {
      try {
        const response = await fetch('/api/geolocation')
        if (response.ok) {
          const data = await response.json()
          const userCountry = countries.find(c => c.code === data.country)
          if (userCountry && !value) {
            setSelectedCountry(userCountry)
          }
        }
      } catch (error) {
        // Игнорируем ошибки геолокации
      }
    }
    
    detectUserCountry()
  }, [])

  // Извлекаем номер телефона без кода страны из value
  useEffect(() => {
    if (value) {
      const detectedCountry = detectCountryFromNumber(value)
      if (detectedCountry) {
        setSelectedCountry(detectedCountry)
        const numberWithoutCode = value.slice(detectedCountry.dialCode.length).trim()
        setPhoneNumber(numberWithoutCode)
        
        // Валидация
        const valid = validatePhoneNumber(numberWithoutCode, detectedCountry)
        setIsValid(valid)
        onValidationChange?.(valid)
      } else {
        setPhoneNumber(value)
        setIsValid(false)
        onValidationChange?.(false)
      }
    } else {
      setPhoneNumber('')
      setIsValid(true)
      onValidationChange?.(true)
    }
  }, [value, onValidationChange])

  // Закрытие dropdown при клике вне компонента
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Не закрываем модалку на мобильных устройствах при клике вне элемента
      if (isMobile) return
      
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
        setSearchQuery('')
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isMobile])

  // Обработка клавиш для навигации по dropdown
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isDropdownOpen) return
      
      if (event.key === 'Escape') {
        setIsDropdownOpen(false)
        setSearchQuery('')
        // На мобильных устройствах не фокусируемся на input после закрытия модалки
        if (!isMobile) {
          inputRef.current?.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isDropdownOpen, isMobile])

  const handleCountrySelect = useCallback((country: Country) => {
    setSelectedCountry(country)
    setIsDropdownOpen(false)
    setSearchQuery('')
    
    // Обновляем полное значение
    const formattedNumber = formatPhoneNumber(phoneNumber, country.format)
    const fullNumber = formattedNumber ? `${country.dialCode} ${formattedNumber}` : country.dialCode
    onChange(fullNumber)
    
    // Валидация
    const valid = validatePhoneNumber(phoneNumber, country)
    setIsValid(valid)
    onValidationChange?.(valid)
    
    // Фокусируемся на input после выбора страны (только на десктопе)
    if (!isMobile) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }, [phoneNumber, onChange, onValidationChange, isMobile])

  const handlePhoneNumberChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value
    const digitsOnly = rawValue.replace(/\D/g, '')
    
    // Ограничиваем длину номера
    if (digitsOnly.length > 15) return
    
    const formattedNumber = formatPhoneNumber(digitsOnly, selectedCountry.format)
    setPhoneNumber(formattedNumber)
    
    // Обновляем полное значение
    const fullNumber = formattedNumber ? `${selectedCountry.dialCode} ${formattedNumber}` : selectedCountry.dialCode
    onChange(fullNumber)
    
    // Валидация
    const valid = validatePhoneNumber(formattedNumber, selectedCountry)
    setIsValid(valid)
    onValidationChange?.(valid)
  }, [selectedCountry, onChange, onValidationChange])

  const handleDropdownToggle = useCallback(() => {
    setIsDropdownOpen(!isDropdownOpen)
    if (!isDropdownOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus()
      }, 100)
    }
  }, [isDropdownOpen])

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }, [])

  const getInputStyles = () => {
    const baseStyles = "w-full font-poppins transition-all duration-300 outline-none"
    const validationStyles = !isValid && phoneNumber ? "border-red-300 focus:border-red-500" : "border-gray-100 focus:border-[#0ABAB5]"
    
    switch (style) {
      case 'modal':
        return `${baseStyles} px-3 sm:px-4 py-3 sm:py-4 pl-24 sm:pl-28 border-2 ${validationStyles} rounded-xl sm:rounded-2xl text-sm sm:text-base text-[#0D2B29] placeholder-gray-400 bg-white shadow-sm hover:shadow-md focus:shadow-lg`
      case 'vertical':
        return `${baseStyles} p-3 pl-20 font-medium text-[#0D2B29] placeholder-gray-500 border-2 border-white/30 rounded-xl bg-white/90 backdrop-blur-sm focus:border-white focus:bg-white focus:shadow-lg`
      case 'contact':
        return `${baseStyles} py-2 pl-16 border-none border-b border-[#0D2B29]/30 focus:border-[#0ABAB5] text-base text-[#0D2B29] placeholder-gray-500 bg-transparent`
      default:
        return `${baseStyles} px-3 sm:px-4 py-3 sm:py-4 pl-24 sm:pl-28 border-2 ${validationStyles} rounded-xl sm:rounded-2xl text-sm sm:text-base text-[#0D2B29] placeholder-gray-400 bg-white shadow-sm hover:shadow-md focus:shadow-lg`
    }
  }

  const getCountryButtonStyles = () => {
    const baseStyles = "absolute left-0 top-0 bottom-0 flex items-center justify-center cursor-pointer transition-all duration-300 z-10"
    
    switch (style) {
      case 'modal':
        return `${baseStyles} w-20 sm:w-24 bg-transparent hover:bg-gray-50 rounded-l-xl sm:rounded-l-2xl border-r border-gray-100`
      case 'vertical':
        return `${baseStyles} w-20 bg-transparent hover:bg-white/20 rounded-l-xl border-r border-white/30`
      case 'contact':
        return `${baseStyles} w-14 bg-transparent hover:bg-gray-50`
      default:
        return `${baseStyles} w-20 sm:w-24 bg-transparent hover:bg-gray-50 rounded-l-xl sm:rounded-l-2xl border-r border-gray-100`
    }
  }

  const getDropdownStyles = () => {
    return "absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-80 overflow-hidden z-50"
  }

  const getPlaceholder = () => {
    if (placeholder) return placeholder
    
    // Создаем реалистичные примеры номеров для каждой страны
    const examples: { [key: string]: string } = {
      'US': '(201) 555-0123',
      'CA': '(416) 555-0123', 
      'GB': '7911 123456',
      'DE': '30 12345678',
      'FR': '1 23 45 67 89',
      'IT': '347 123 4567',
      'ES': '612 345 678',
      'NL': '6 12345678',
      'BE': '470 12 34 56',
      'CH': '79 123 45 67',
      'AT': '664 1234567',
      'SE': '70 123 45 67',
      'NO': '412 34 567',
      'DK': '20 12 34 56',
      'FI': '40 123 4567',
      'PL': '501 234 567',
      'CZ': '601 234 567',
      'HU': '30 123 4567',
      'PT': '912 345 678',
      'GR': '694 123 4567',
      'IE': '85 123 4567',
      'LU': '621 123 456',
      'JP': '90-1234-5678',
      'KR': '10-1234-5678',
      'CN': '138 0013 8000',
      'IN': '98765 43210',
      'SG': '9123 4567',
      'HK': '9123 4567',
      'TH': '81-234-5678',
      'VN': '912 345 678',
      'MY': '12-345 6789',
      'ID': '812-345-6789',
      'PH': '917 123 4567',
      'AE': '50 123 4567',
      'SA': '50 123 4567',
      'IL': '50-123-4567',
      'TR': '532 123 45 67',
      'RU': '912 345-67-89',
      'BR': '11 91234-5678',
      'MX': '55 1234 5678',
      'AR': '11 1234-5678',
      'CL': '9 1234 5678',
      'CO': '301 234 5678',
      'PE': '987 654 321',
      'ZA': '82 123 4567',
      'EG': '10 1234 5678',
      'AU': '412 345 678',
      'NZ': '21 123 4567',
      'MD': '69 123 456', // Молдова - номера начинаются с 6 или 7
      'RO': '721 234 567',
      'BG': '887 123 456',
      'HR': '91 123 4567',
      'SI': '31 123 456',
      'SK': '901 234 567',
      'LT': '612 34567',
      'LV': '21 123 456',
      'EE': '512 3456',
      'UA': '67 123 45 67',
      'BY': '29 123-45-67',
      'KZ': '701 234-56-78',
      'UZ': '90 123 45 67',
      'AZ': '50 123 45 67',
      'AM': '77 123456',
      'GE': '555 12 34 56',
      'KG': '555 123456',
      'TJ': '93 123 4567',
      'TM': '65 123456',
      'IS': '581 2345',
      'MT': '7921 2345',
      'CY': '99 123456',
      'MK': '70 123 456',
      'AL': '69 123 4567',
      'ME': '67 123 456',
      'RS': '64 123 4567',
      'BA': '61 123 456',
      'BD': '1712-345678',
      'PK': '300 1234567',
      'LK': '71 123 4567',
      'MM': '9 123 4567',
      'KH': '12 345 678',
      'LA': '20 123 456',
      'BN': '712 3456',
      'MN': '8812 3456',
      'IR': '912 345 6789',
      'IQ': '790 123 4567',
      'JO': '7 9012 3456',
      'LB': '71 123 456',
      'SY': '944 123 456',
      'YE': '712 345 678',
      'OM': '9123 4567',
      'KW': '5012 3456',
      'BH': '3612 3456',
      'QA': '5512 3456',
      'GH': '244 123 456',
      'ET': '91 123 4567',
      'TZ': '754 123 456',
      'UG': '772 123456',
      'ZW': '77 123 4567',
      'ZM': '97 123 4567',
      'BW': '71 123 456',
      'NA': '81 123 4567',
      'FJ': '999 1234',
      'PG': '7123 4567',
      'NC': '75 12 34',
      'VE': '412-1234567',
      'UY': '9123 4567',
      'PY': '981 123456',
      'BO': '7123 4567',
      'EC': '99 123 4567',
      'GT': '5123 4567',
      'HN': '9123 4567',
      'SV': '7123 4567',
      'NI': '8123 4567',
      'CR': '8123 4567',
      'PA': '6123 4567'
    }
    
    // Возвращаем пример для выбранной страны
    if (examples[selectedCountry.code]) {
      return examples[selectedCountry.code]
    }
    
    // Если нет готового примера, создаем реалистичный номер на основе формата
    if (selectedCountry.format) {
      // Создаем статичный пример вместо случайного
      let example = selectedCountry.format
      let digitIndex = 1
      
      // Заменяем # на последовательные цифры, начиная с 1
      example = example.replace(/#/g, () => {
        const digit = ((digitIndex - 1) % 9) + 1
        digitIndex++
        return digit.toString()
      })
      
      // Заменяем 0 на цифры от 0 до 9
      digitIndex = 0
      example = example.replace(/0/g, () => {
        const digit = digitIndex % 10
        digitIndex++
        return digit.toString()
      })
      
      return example
    }
    
    // Fallback
    return '123456789'
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="relative">
        {/* Country selector button */}
        <button
          type="button"
          className={getCountryButtonStyles()}
          onClick={handleDropdownToggle}
          disabled={disabled}
          aria-label={`Selected country: ${selectedCountry.name}`}
          aria-expanded={isDropdownOpen}
          aria-haspopup="listbox"
        >
          <span className="text-xl mr-1 ml-2 w-8" role="img" aria-label={selectedCountry.name}>
            {selectedCountry.flag}
          </span>
          <span className="text-xs font-medium text-gray-600">{selectedCountry.dialCode}</span>
          <ChevronDown 
            className={`w-3 h-3 ml-1 text-gray-400 transition-transform duration-200 ${
              isDropdownOpen ? 'rotate-180' : ''
            }`} 
          />
        </button>

        {/* Phone number input */}
        <input
          ref={inputRef}
          type="tel"
          value={phoneNumber}
          onChange={handlePhoneNumberChange}
          onFocus={onFocus}
          onBlur={onBlur}
          className={getInputStyles()}
          placeholder={getPlaceholder()}
          required={required}
          disabled={disabled}
          autoComplete="tel"
          autoFocus={autoFocus}
          aria-label="Phone number"
          aria-invalid={!isValid && phoneNumber ? 'true' : 'false'}
          aria-describedby={!isValid && phoneNumber ? 'phone-error' : undefined}
        />
        
        {/* Validation indicator */}
        {!isValid && phoneNumber && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          </div>
        )}
      </div>

      {/* Validation error message */}
      {!isValid && phoneNumber && (
        <div id="phone-error" className="mt-1 text-xs text-red-500 font-medium bg-white px-2 py-1 rounded-md shadow-sm border border-red-200">
          Please enter a valid phone number
        </div>
      )}

      {/* Country dropdown - Desktop */}
      {isDropdownOpen && !isMobile && (
        <div className={getDropdownStyles()} role="listbox" aria-label="Select country">
          {/* Search input */}
          <div className="sticky top-0 bg-white border-b border-gray-100 p-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-8 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#0ABAB5] placeholder-gray-400"
                placeholder="Search countries..."
                aria-label="Search countries"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded"
                  aria-label="Clear search"
                >
                  <X className="w-3 h-3 text-gray-400" />
                </button>
              )}
            </div>
          </div>
          
          {/* Countries list */}
          <div ref={countriesListRef} className="max-h-60 overflow-y-auto">
            {filteredCountries.length > 0 ? (
              filteredCountries.map((country) => (
                <button
                  key={country.code}
                  ref={selectedCountry.code === country.code ? selectedCountryRef : null}
                  type="button"
                  className="w-full px-3 py-2.5 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none flex items-center space-x-3 font-poppins text-sm transition-colors duration-150"
                  onClick={() => handleCountrySelect(country)}
                  role="option"
                  aria-selected={selectedCountry.code === country.code}
                >
                  <span className="text-lg flex-shrink-0 ml-2" role="img" aria-label={country.name}>
                    {country.flag}
                  </span>
                  <span className="font-medium text-gray-600 flex-shrink-0 min-w-[3rem]">
                    {country.dialCode}
                  </span>
                  <span className="text-gray-800 truncate">{country.name}</span>
                  {selectedCountry.code === country.code && (
                    <span className="ml-auto text-[#0ABAB5] text-xs">✓</span>
                  )}
                </button>
              ))
            ) : (
              <div className="px-3 py-4 text-center text-gray-500 text-sm">
                No countries found
              </div>
            )}
          </div>
        </div>
      )}

      {/* Country modal - Mobile */}
      {isDropdownOpen && isMobile && (
        <div className="fixed inset-0 z-50 bg-white flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
            <h2 className="text-lg font-semibold text-gray-900">Select Country</h2>
            <button
              type="button"
              onClick={() => {
                setIsDropdownOpen(false)
                setSearchQuery('')
              }}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Search input */}
          <div className="p-4 border-b border-gray-100 flex-shrink-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-8 py-3 text-base border border-gray-200 rounded-lg focus:outline-none focus:border-[#0ABAB5] placeholder-gray-400"
                placeholder="Search countries..."
                aria-label="Search countries"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              )}
            </div>
          </div>
          
          {/* Countries list */}
          <div className="flex-1 overflow-y-auto min-h-0">
            {filteredCountries.length > 0 ? (
              filteredCountries.map((country) => (
                <button
                  key={country.code}
                  type="button"
                  className="w-full px-4 py-4 text-left hover:bg-gray-50 active:bg-gray-100 focus:bg-gray-50 focus:outline-none flex items-center space-x-4 font-poppins text-base transition-colors duration-150 border-b border-gray-50 last:border-b-0"
                  onClick={() => handleCountrySelect(country)}
                  role="option"
                  aria-selected={selectedCountry.code === country.code}
                >
                  <span className="text-2xl flex-shrink-0 ml-2" role="img" aria-label={country.name}>
                    {country.flag}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-900 font-medium truncate">{country.name}</span>
                      {selectedCountry.code === country.code && (
                        <span className="text-[#0ABAB5] text-lg ml-2">✓</span>
                      )}
                    </div>
                    <span className="text-gray-500 text-sm">
                      {country.dialCode}
                    </span>
                  </div>
                </button>
              ))
            ) : (
              <div className="px-4 py-8 text-center text-gray-500">
                No countries found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default CustomPhoneInput