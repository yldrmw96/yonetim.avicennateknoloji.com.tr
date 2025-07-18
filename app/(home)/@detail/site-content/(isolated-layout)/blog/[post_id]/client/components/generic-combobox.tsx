"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export interface ComboboxOption<T = any> {
  value: string | number
  label: string
  data: T
}

export interface GenericComboboxProps<T = any> {
  options: ComboboxOption<T>[]
  value?: string | number
  onValueChange?: (value: string | number, option: ComboboxOption<T>) => void
  placeholder?: string
  searchPlaceholder?: string
  emptyMessage?: string
  className?: string
  disabled?: boolean
  loading?: boolean
  error?: string | null
  width?: string
}

export function GenericCombobox<T = any>({
  options = [],
  value,
  onValueChange,
  placeholder = "Seçim yapın...",
  searchPlaceholder = "Ara...",
  emptyMessage = "Sonuç bulunamadı.",
  className,
  disabled = false,
  loading = false,
  error = null,
  width = "w-[200px]",
}: GenericComboboxProps<T>) {
  const [open, setOpen] = React.useState(false)

  const selectedOption = options.find((option) => option.value === value)

  const handleSelect = (selectedValue: string) => {
    const option = options.find((opt) => opt.value.toString() === selectedValue)
    if (option && onValueChange) {
      onValueChange(option.value, option)
    }
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(width, "justify-between border-none shadow-none !text-sm text-primary", className)}
          disabled={disabled || loading}
        >
          {loading ? "Yükleniyor..." : selectedOption ? selectedOption.label : placeholder}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn(width, "p-0")}>
        <Command>
          <CommandInput placeholder={searchPlaceholder} className="h-9" />
          <CommandList>
            {error ? (
              <div className="p-2 text-sm text-red-500">{error}</div>
            ) : (
              <>
                <CommandEmpty>{emptyMessage}</CommandEmpty>
                <CommandGroup>
                  {options.map((option) => (
                    <CommandItem key={option.value} value={option.value.toString()} onSelect={handleSelect}>
                      {option.label}
                      <Check
                        className={cn("ml-auto", selectedOption?.value === option.value ? "opacity-100" : "opacity-0")}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
