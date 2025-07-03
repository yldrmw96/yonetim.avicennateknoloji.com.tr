import { ComponentProps, ReactNode } from "react"

import { cn } from "@/lib/utils"
import { ActivityIndicator } from "@/components/global/activity-indicator";



function Input({ className, containerClassName, errorPopup, type, ...props }: ComponentProps<"input"> & { containerClassName?: string, errorPopup?: ReactNode }) {
  return (
    <div className={cn(
      "relative px-3 py-2 rounded-md border dark:hover:bg-input/30 cursor-pointer has-focus:cursor-text has-focus:ring-1 has-focus:ring-primary/80 border-input has-focus:border-primary/80 duration-100 shadow-xs dark:bg-input/20 dark:!border-0", containerClassName)}>
      <input
        type={type}
        data-slot="input"
        className={cn(
          "file:text-foreground cursor-[inherit]  font-medium placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground   flex  w-full min-w-0  !bg-transparent text-base  outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          className
        )}
        {...props}
      />
      {errorPopup && <p className="text-red-500 text-sm">{errorPopup}</p>}
    </div>
  )
}

function MailInput({ className, containerClassName,innerItem, type, ...props }: ComponentProps<"input"> & { containerClassName?: string, errorPopup?: ReactNode, innerItem?: ReactNode }) {
  return (
    <div className={cn(
      "relative px-3 py-2 dark:bg-input/20 rounded-md border border-input has-focus:!border-primary/80 duration-100 dark:!border-0 dark:has-focus:!border-0  transition-[color,box-shadow]", containerClassName, innerItem && "flex flex-row  items-center gap-2 "
    )}>
      <input
        type={type}
        data-slot="input"
        className={cn(
          "file:text-foreground  font-medium placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground   flex  w-full min-w-0  bg-transparent text-base  outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          className
        )}
        {...props}
      />
      {innerItem && innerItem}
    </div>
  )
}
export { MailInput }
export { Input }


function PasswordInput({ className, type, errorPopup,innerItem, containerClassName, isLoading, ...props }: ComponentProps<"input"> & { containerClassName?: string, errorPopup?: ReactNode, innerItem?: ReactNode, isLoading?: boolean }) {
  return (
    <div className={cn("relative dark:bg-input/20  flex flex-row items-center gap-2 px-3 py-2 rounded-md border border-input focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] transition-[color,box-shadow]", containerClassName, innerItem && "flex flex-row items-center gap-2 justify-between")}>
      <input
        type={"password"}
        data-slot="input"
        className={cn(
          "file:text-foreground !text-sm rounded-md placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground  flex  w-full min-w-0  bg-transparent dark:border-0  outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          className
        )}
        {...props}
      />
      {innerItem && isLoading ? <ActivityIndicator /> : innerItem}
      {errorPopup && errorPopup}
    </div>
  )
}

export { PasswordInput }
