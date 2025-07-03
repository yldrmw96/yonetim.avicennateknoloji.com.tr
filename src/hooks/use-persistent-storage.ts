"use client"

import type React from "react"

import { useState, useEffect } from "react"

interface PersistentStorageOptions {
  key: string
}

export function usePersistentStorage<T>(
  initialValue: T,
  options: PersistentStorageOptions,
): [T, React.Dispatch<React.SetStateAction<T>>] {
  // Check if localStorage is available
  const isClient = typeof window !== "undefined"
  const { key } = options

  // Initialize state with the value from localStorage or the provided initialValue
  const [state, setState] = useState<T>(() => {
    if (!isClient) return initialValue

    try {
      const storedValue = localStorage.getItem(key)
      return storedValue ? JSON.parse(storedValue) : initialValue
    } catch (error) {
      console.error("Error reading from localStorage:", error)
      return initialValue
    }
  })

  // Update localStorage when state changes
  useEffect(() => {
    if (!isClient) return

    try {
      localStorage.setItem(key, JSON.stringify(state))
    } catch (error) {
      console.error("Error writing to localStorage:", error)
    }
  }, [key, state, isClient])

  return [state, setState]
}
