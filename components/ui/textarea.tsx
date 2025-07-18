import * as React from "react"

import { cn } from "@/lib/utils"
import { cva } from "class-variance-authority"
import { Button } from "./button"
import { CheckIcon } from "lucide-react"
import { useState } from "react"
import { ActivityIndicator } from "../global/activity-indicator"

const textAreaVariants = cva("border-input placeholder:text-muted-foreground aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", {
  variants: {
    variant: {
      default: "min-h-16 ",
      flat: "!bg-transparent !border-none !shadow-none !p-0",
      flat_nopadding: "!bg-transparent !border-none !shadow-none !p-0",
      flat_nopadding_nooutline: "!bg-transparent !border-none !shadow-none !p-0 !outline-none !focus-visible:ring-0 transition-none duration-0 !rounded-xs focus-visible:!ring-primary [&:active:not(:focus-visible)]:!ring-2 focus-visible:!bg-muted/50 [&:hover:not(:focus-visible:active)]:cursor-pointer [&:focus-visible:not(:active)]:cursor-text [&:active:not(:focus-visible)]:!opacity-70",
    },
  },
})

function Textarea({ className, variant = "default", ...props }: React.ComponentProps<"textarea"> & { variant?: "default" | "flat" | "flat_nopadding" | "flat_nopadding_nooutline" }) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        textAreaVariants({ variant }),
        className
      )}
      {...props}
    />
  )
}

function EditableTextareaWithButton(
  { className, variant = "flat_nopadding_nooutline", placeholder, performSave, ...props }: React.ComponentProps<"textarea"> & { variant?: "default" | "flat" | "flat_nopadding" | "flat_nopadding_nooutline", performSave: (value: string) => Promise<boolean> }) {
  const [isEditing, setIsEditing] = useState(false)
  const [value, setValue] = useState(props.value)
  const [isSaving, setIsSaving] = useState(false)
  const handleMouseUp = (e: React.MouseEvent<HTMLTextAreaElement>) => {
    // emin olmak için kontrol mouse up burada başlayıp burada mı bitmiş
    // console.log(e)
    e.preventDefault()
    e.stopPropagation()
    if (e.target instanceof HTMLTextAreaElement) {
      setIsEditing(true)
    }
  }
  const handleSave = async () => {
    setIsSaving(true)
    const isSaved = await performSave(value)
    setIsEditing(!isSaved)
    setValue('')
    setIsSaving(false)
  }
  const buttonShouldBeVisible = isEditing || (value && value.length > 0)
  return (
    <div className="relative flex flex-row items-center w-full grow shrink-0 rounded-sm overflow-hidden h-[var(--default-min-list-item-height)]">
      <textarea
        data-slot="textarea"
        className={cn(
          textAreaVariants({ variant }),
          className,
          "text-ellipsis overflow-hidden truncate !inline-block line-clamp-1 resize-none dark:!bg-transparent !underline-offset-8 [text-underline-position:under] leading w-full"
        )}

        rows={1} 
        disabled={isSaving}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={!buttonShouldBeVisible ? placeholder : ""}
        onBlur={() => {
          if (!(value && value.length > 0) && isEditing) {
            setIsEditing(false)
          }
        }}
        {...props}
      />
      {buttonShouldBeVisible && (
        <button type="button" className=" h-full flex items-center justify-center  !p-0 cursor-pointer bg-neutral-900 relative z-10 !w-[var(--default-min-list-item-height)] h-[var(--default-min-list-item-height)]" onClick={handleSave} disabled={isSaving}>
          {isSaving ? <ActivityIndicator /> : <CheckIcon className="w-[1em] h-[1em] m-auto" />}
           </button>
      )}
    </div>
  )
}

export { Textarea, EditableTextareaWithButton }
