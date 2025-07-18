"use client"

import { useState, type KeyboardEvent, useRef } from "react"
import { X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import slugify from "react-slugify"

interface TokenFieldProps {
  initialTags: TagToken[]
  onAdd: (tag: TagToken) => void
  onRemove: (tag: TagToken) => void
}

export interface TagToken {
  id: number
  title: string
  slug: string
}

export default function TokenField({ initialTags = [], onAdd, onRemove }: TokenFieldProps) {
  const [tags, setTags] = useState<TagToken[]>(initialTags)
  const [inputValue, setInputValue] = useState("")
  const [selectedTagIndex, setSelectedTagIndex] = useState<number | null>(-1)
  const inputRef = useRef<HTMLInputElement>(null)

  const addTag = (value: string) => {
    const trimmedValue = value.trim()
    if (trimmedValue && !tags.some(tag => tag.title === trimmedValue)) {
      setTags([...tags, { id: -1, title: trimmedValue, slug: slugify(trimmedValue) }])
      setInputValue("")
      setSelectedTagIndex(null)
      // console.log(trimmedValue, slugify(trimmedValue))
      onAdd({ id: -1, title: trimmedValue, slug: slugify(trimmedValue) })
    }
  }

  const removeTag = (indexToRemove: number) => {
    setTags(tags.filter((_, index) => index !== indexToRemove))
    const tagToDelete = tags[indexToRemove]
    onRemove(tagToDelete)
    // setSelectedTagIndex(null)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault()
      if (inputValue.trim()) {
        addTag(inputValue)
      }
    } else if (e.key === "Backspace") {
      if (inputValue === "" && tags.length > 0) {
        const lastTagIndex = tags.length - 1

        if (selectedTagIndex === lastTagIndex) {
          // Tag zaten seçili, şimdi sil
          removeTag(lastTagIndex)
        } else {
          // Tag'i seç
          setSelectedTagIndex(lastTagIndex)
        }
      } else if (selectedTagIndex !== null) {
        // Seçili tag varsa onu sil
        removeTag(selectedTagIndex)
      }
    } else if (e.key === "ArrowLeft" && inputValue === "" && selectedTagIndex !== null) {
      // Sol ok ile tag seçimini değiştir
      e.preventDefault()
      const newIndex = selectedTagIndex > 0 ? selectedTagIndex - 1 : null
      setSelectedTagIndex(newIndex)
    } else if (e.key === "ArrowRight" && selectedTagIndex !== null) {
      // Sağ ok ile tag seçimini kaldır veya değiştir
      e.preventDefault()
      const newIndex = selectedTagIndex < tags.length - 1 ? selectedTagIndex + 1 : null
      setSelectedTagIndex(newIndex)
    } else {
      // Herhangi bir karakter yazıldığında seçimi kaldır
      if (selectedTagIndex !== null) {
        setSelectedTagIndex(null)
      }
    }
  }

  const handleInputChange = (value: string) => {
    setInputValue(value)
    setSelectedTagIndex(null)
  }

  const handleTagClick = (index: number) => {
    setSelectedTagIndex(selectedTagIndex === index ? null : index)
    inputRef.current?.focus()
  }

  return (
    <div
      className="relative  grid grid-cols-[1fr] w-full text-sm">
      <div className="flex flex-wrap gap-1 items-center col-span-1 w-full z-10 relative" >
        {tags.map((tag, index) => (
          <Badge
            key={index}
            data-selected={selectedTagIndex === index}
            variant={selectedTagIndex === index ? "default" : "secondary"}
            className={`cursor-pointer dark:!bg-muted duration-0 z-10 transition-none !text-xs/0 group/tag inline-flex items-center px-1 !shadow-none peer/tag rounded-[0.72rem] ${selectedTagIndex === index
              ? "bg-primary text-primary-foreground ring-2 ring-primary/50 !shadow-none !ring-0 !outline-none"
              : "bg-gray-100  "
              }`}
            onClick={() => handleTagClick(index)}
          >
            <span className="!text-xs">
              {tag.slug}
            </span>
            <button
              type="button"
              className="ml-1 hover:bg-black/10 rounded-full p-0.5 focus:ring-0 focus:outline-none z-10 !shadow-none  group-hover/tag:inline "
              onClick={(e) => {
                e.stopPropagation()
                removeTag(index)
              }}
            >
              <X className="h-2 w-2" />
            </button>
          </Badge>
        ))}
        <input
          ref={inputRef}
          id="tags-input"
          type="text"
          value={inputValue}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={tags.length === 0 ? "Tag eklemek için yazın..." : ""}
          className="!border-0 !inline outline-none !shadow-none focus:!ring-0 focus-visible:!ring-0 !ring-0 !border-none !ring-none !shadow-none flex-1 min-w-[10px] !text-xs/0 !px-1 !py-1 z-10 text-wrap"
        />
        <span
          onClick={() => {
            inputRef.current?.focus()
          }}
          className="absolute w-full h-full right-0 top-0 bottom-0 flex items-center justify-center z-0">

        </span>
      </div>

    </div>
  )
}
