"use client"

import { useState, useEffect, useCallback } from "react"

interface DynamicPersistentStorageOptions {
  key: string
}

type Path = string | (string | number)[]

// Helper function to get a value at a specific path in an object
function getValueAtPath(obj: any, path: Path): any {
  const parts = Array.isArray(path) ? path : path.split(".")
  let current = obj

  for (const part of parts) {
    if (current === null || current === undefined) return undefined
    current = current[part]
  }

  return current
}

// Helper function to set a value at a specific path in an object
function setValueAtPath(obj: any, path: Path, value: any): any {
  const parts = Array.isArray(path) ? path : path.split(".")
  const result = { ...obj }
  let current = result

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i]
    const isLast = i === parts.length - 1

    if (isLast) {
      current[part] = value
    } else {
      if (current[part] === undefined || current[part] === null) {
        // Create object or array based on next key type
        const nextPart = parts[i + 1]
        current[part] = !isNaN(Number(nextPart)) ? [] : {}
      } else {
        // Clone the existing object/array to avoid mutation
        current[part] = Array.isArray(current[part]) ? [...current[part]] : { ...current[part] }
      }
      current = current[part]
    }
  }

  return result
}

export function useDynamicPersistentStorage<T extends Record<string, any>>(
  initialValue: T,
  options: DynamicPersistentStorageOptions
) {
  const isClient = typeof window !== "undefined"
  const { key } = options

  // Initialize state with the value from localStorage or the provided initialValue
  const [state, setState] = useState<T>(() => {
    if (!isClient) return initialValue

    try {
      const storedValue = localStorage.getItem(key)
      return storedValue ? JSON.parse(storedValue) : initialValue
    } catch (error) {
      // console.error("Error reading from localStorage:", error)
      return initialValue
    }
  })

  // Update localStorage when state changes
  useEffect(() => {
    if (!isClient) return

    try {
      localStorage.setItem(key, JSON.stringify(state))
    } catch (error) {
      // console.error("Error writing to localStorage:", error)
    }
  }, [key, state, isClient])

  // Get a value at a specific path
  const getValue = useCallback((path: Path): any => {
    return getValueAtPath(state, path)
  }, [state]);
  const setValue = useCallback((path: Path, value: any) => {
      setState(prevState => setValueAtPath(prevState, path, value))
    }, []);

  // Toggle a boolean value at a specific path
  const toggleValue = useCallback((path: Path) => {
      setState(prevState => {
        const currentValue = getValueAtPath(prevState, path)
        return setValueAtPath(prevState, path, !currentValue)
      })
    }, [getValue, setValue])

    return {state, setState, getValue, setValue, toggleValue}
}
