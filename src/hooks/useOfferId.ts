import { useEffect, useState } from 'react'

function generateEightDigitId(): string {
  const min = 10_000_000
  const max = 99_999_999
  const n = Math.floor(Math.random() * (max - min + 1)) + min
  return String(n)
}

export function useOfferId(): string {
  const [offerId, setOfferId] = useState<string>('')
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    try {
      const key = 'offerId'
      const stored = typeof window !== 'undefined' ? window.localStorage.getItem(key) : null
      if (stored && /^\d{8}$/.test(stored)) {
        setOfferId(stored)
        return
      }
      const newId = generateEightDigitId()
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, newId)
      }
      setOfferId(newId)
    } catch {
      // Fallback if localStorage is unavailable
      setOfferId(generateEightDigitId())
    }
  }, [])

  return isClient ? offerId : ''
}

export default useOfferId

