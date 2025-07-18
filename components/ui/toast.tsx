"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"

const ToastProvider = React.createContext<{
  toasts: Array<{
    id: string
    title?: string
    description?: string
    action?: React.ReactNode
    variant?: "default" | "destructive"
  }>
  addToast: (toast: {
    title?: string
    description?: string
    action?: React.ReactNode
    variant?: "default" | "destructive"
  }) => void
  removeToast: (id: string) => void
}>({
  toasts: [],
  addToast: () => {},
  removeToast: () => {},
})

export function Toast({
  className,
  title,
  description,
  action,
  variant = "default",
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  title?: string
  description?: string
  action?: React.ReactNode
  variant?: "default" | "destructive"
}) {
  return (
    <div
      className={cn(
        "group pointer-events-auto relative flex w-full items-center justify-between space-x-2 overflow-hidden rounded-md border p-4 pr-6 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full",
        variant === "default" &&
          "border-border bg-background text-foreground",
        variant === "destructive" &&
          "destructive border-destructive/50 bg-destructive text-destructive-foreground",
        className
      )}
      {...props}
    >
      <div className="grid gap-1">
        {title && <div className="text-sm font-semibold">{title}</div>}
        {description && (
          <div className="text-sm opacity-90">{description}</div>
        )}
      </div>
      {action}
    </div>
  )
}

export function Toaster() {
  const [toasts, setToasts] = React.useState<
    Array<{
      id: string
      title?: string
      description?: string
      action?: React.ReactNode
      variant?: "default" | "destructive"
    }>
  >([])

  const addToast = React.useCallback(
    (toast: {
      title?: string
      description?: string
      action?: React.ReactNode
      variant?: "default" | "destructive"
    }) => {
      const id = Math.random().toString(36).substring(2, 9)
      setToasts((prev) => [...prev, { id, ...toast }])

      // Auto-dismiss after 5 seconds
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
      }, 5000)
    },
    []
  )

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  return (
    <ToastProvider.Provider value={{ toasts, addToast, removeToast }}>
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            title={toast.title}
            description={toast.description}
            action={
              <button
                onClick={() => removeToast(toast.id)}
                className="inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary hover:text-secondary-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
              >
                <X className="h-4 w-4" />
              </button>
            }
            variant={toast.variant}
          />
        ))}
      </div>
    </ToastProvider.Provider>
  )
} 