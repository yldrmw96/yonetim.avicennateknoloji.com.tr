import { useEffect, useState } from "react"

export interface Toast {
  id: string
  title?: string
  description?: string
  action?: React.ReactNode
  variant?: "default" | "destructive"
}

export interface ToastOptions {
  title?: string
  description?: string
  action?: React.ReactNode
  variant?: "default" | "destructive"
}

const TOAST_LIMIT = 5
const TOAST_REMOVE_DELAY = 5000

type ToasterToast = Toast

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_VALUE
  return count.toString()
}

const toasts: ToasterToast[] = []

type ToastActionType = (toast: ToasterToast) => void

let addToast: ToastActionType = () => {}
let dismissToast: ToastActionType = () => {}

export const useToast = () => {
  const [, setToasts] = useState<ToasterToast[]>([])

  useEffect(() => {
    addToast = (toast: ToasterToast) => {
      // Create a unique ID
      const id = toast.id || genId()

      const newToast = {
        ...toast,
        id,
      }

      // Add the toast to state
      setToasts((prevToasts) => {
        const nextToasts = [...prevToasts, newToast]
        return nextToasts.slice(-TOAST_LIMIT)
      })

      // Set a timer to dismiss the toast
      setTimeout(() => {
        dismissToast(newToast)
      }, TOAST_REMOVE_DELAY)
    }

    dismissToast = (toast: ToasterToast) => {
      setToasts((prevToasts) => prevToasts.filter((t) => t.id !== toast.id))
    }
  }, [])

  return {
    toast: (props: ToastOptions) => {
      const id = genId()
      const toast = {
        ...props,
        id,
      }
      addToast(toast)

      return {
        id: toast.id,
        dismiss: () => dismissToast(toast),
        update: (props: ToastOptions) => {
          if (props) {
            addToast({ ...toast, ...props })
          }
        },
      }
    },
    dismiss: (toastId?: string) => {
      if (toastId) {
        dismissToast({ id: toastId } as ToasterToast)
      }
    },
  }
} 