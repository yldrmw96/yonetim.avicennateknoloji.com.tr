"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Link from "@tiptap/extension-link"
import Image from "@tiptap/extension-image"
import TextAlign from "@tiptap/extension-text-align"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  LinkIcon,
  ImageIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from "lucide-react"
import React, { useCallback, useRef } from "react"
// pass the content as html string  
interface TiptapEditorProps {
  content: string
  onChange: (content: string) => void
  topbarContent?: React.ReactNode
  handleSave?: (content: string) => void
}

export function TiptapEditor({ content, topbarContent, onChange, handleSave }: TiptapEditorProps) {
  const initialContentRef = useRef(content)
  const [isDirty, setIsDirty] = React.useState(false)
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
      }),
      Image,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      setIsDirty(editor.getHTML() !== initialContentRef.current)
      onChange(editor.getHTML())
    },
  })

  const addImage = useCallback(() => {
    const url = window.prompt("Resim URL'si girin:")
    if (url) {
      editor?.chain().focus().setImage({ src: url }).run()
    }
  }, [editor])

  const setLink = useCallback(() => {
    const previousUrl = editor?.getAttributes("link").href
    const url = window.prompt("Link URL'si girin:", previousUrl)

    if (url === null) {
      return
    }

    if (url === "") {
      editor?.chain().focus().extendMarkRange("link").unsetLink().run()
      return
    }

    editor?.chain().focus().extendMarkRange("link").setLink({ href: url }).run()
  }, [editor])


  if (!editor) {
    return null
  }

  return (
    <div className="overflow-hidden" translate="no">
      {/* Toolbar */}
      <div className="p-2">
        <div className="flex flex-wrap items-center gap-1 justify-around">
          {/* Text Formatting */}
          <Button
            variant={editor.isActive("bold") ? "default" : "ghost"}
            className={cn(editor.isActive("bold") ? "text-white" : "text-black/50")}
            size="sm"
            onClick={() => editor.chain().focus().toggleBold().run()}
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            variant={editor.isActive("italic") ? "default" : "ghost"}
            className={cn(editor.isActive("italic") ? "text-white" : "text-black/50")}

            size="sm"
            onClick={() => editor.chain().focus().toggleItalic().run()}
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            variant={editor.isActive("strike") ? "default" : "ghost"}
            className={cn(editor.isActive("strike") ? "text-white" : "text-black/50")}

            size="sm"
            onClick={() => editor.chain().focus().toggleStrike().run()}
          >
            <Strikethrough className="h-4 w-4" />
          </Button>
          <Button
            variant={editor.isActive("code") ? "default" : "ghost"}
            className={cn(editor.isActive("code") ? "text-white" : "text-black/50")}

            size="sm"
            onClick={() => editor.chain().focus().toggleCode().run()}
          >
            <Code className="h-4 w-4" />
          </Button>

          <Separator orientation="vertical" className="h-6" />

          {/* Headings */}
          <Button
            variant={editor.isActive("heading", { level: 1 }) ? "default" : "ghost"}
            className={cn(editor.isActive("heading", { level: 1 }) ? "text-white" : "text-black/50")}

            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          >
            <Heading1 className="h-4 w-4" />
          </Button>
          <Button
            variant={editor.isActive("heading", { level: 2 }) ? "default" : "ghost"}
            className={cn(editor.isActive("heading", { level: 2 }) ? "text-white" : "text-black/50")}

            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          >
            <Heading2 className="h-4 w-4" />
          </Button>
          <Button
            variant={editor.isActive("heading", { level: 3 }) ? "default" : "ghost"}
            className={cn(editor.isActive("heading", { level: 3 }) ? "text-white" : "text-black/50")}

            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          >
            <Heading3 className="h-4 w-4" />
          </Button>

          <Separator orientation="vertical" className="h-6" />

          {/* Lists */}
          <Button
            variant={editor.isActive("bulletList") ? "default" : "ghost"}
            className={cn(editor.isActive("bulletList") ? "text-white" : "text-black/50")}

            size="sm"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant={editor.isActive("orderedList") ? "default" : "ghost"}
            className={cn(editor.isActive("orderedList") ? "text-white" : "text-black/50")}

            size="sm"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
          >
            <ListOrdered className="h-4 w-4" />
          </Button>
          <Button
            variant={editor.isActive("blockquote") ? "default" : "ghost"}
            className={cn(editor.isActive("blockquote") ? "text-white" : "text-black/50")}

            size="sm"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
          >
            <Quote className="h-4 w-4" />
          </Button>

          <Separator orientation="vertical" className="h-6" />

          {/* Alignment */}
          <Button
            variant={editor.isActive({ textAlign: "left" }) ? "default" : "ghost"}
            className={cn(editor.isActive({ textAlign: "left" }) ? "text-white" : "text-black/50")}

            size="sm"
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
          >
            <AlignLeft className="h-4 w-4" />
          </Button>
          <Button
            variant={editor.isActive({ textAlign: "center" }) ? "default" : "ghost"}
            className={cn(editor.isActive({ textAlign: "center" }) ? "text-white" : "text-black/50")}

            size="sm"
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
          >
            <AlignCenter className="h-4 w-4" />
          </Button>
          <Button
            variant={editor.isActive({ textAlign: "right" }) ? "default" : "ghost"}
            className={cn(editor.isActive({ textAlign: "right" }) ? "text-white" : "text-black/50")}

            size="sm"
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
          >
            <AlignRight className="h-4 w-4" />
          </Button>

          <Separator orientation="vertical" className="h-6" />

          {/* Media */}
          <Button variant="ghost" size="sm" onClick={setLink} className={cn(editor.isActive("link") ? "text-white" : "text-black/50")}>
            <LinkIcon className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={addImage} className={cn(editor.isActive("image") ? "text-white" : "text-black/50")}>
            <ImageIcon className="h-4 w-4" />
          </Button>

          <Separator orientation="vertical" className="h-6" />

          {/* History */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().chain().focus().undo().run()}
          >
            <Undo className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().chain().focus().redo().run()}
          >
            <Redo className="h-4 w-4" />
          </Button>
          <Button
            disabled={!isDirty}
            variant={"borderless"}
            size="sm"
            className="shadow-none !font-semibold text-primary"
            onClick={() => handleSave?.(editor.getHTML())}
          >
            Bitti
          </Button>
        </div>
      </div>
      {topbarContent}
      {/* Editor Content */}
      <EditorContent editor={editor} className=" prose max-w-none p-4 min-h-[400px] focus:outline-none outline-none" />
    </div>
  )
}
