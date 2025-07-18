"use client"

import { useEffect } from "react"
import { TiptapEditor } from "@/components/global/tiptap-editor"
import { ComboboxDemo } from "./components/switcher-input"
import { usePosts } from "@/store/hooks/posts.hook"

export default function NewBlogPostPage() {
  const { selector: { newPost }, actions: { setNewPost } } = usePosts();
  
  useEffect(() => {
    // console.log(newPost)
  }, [newPost])
  const handleSave = async (content: string) => {

  }

  function handleContentChange(content: string) {
    setNewPost({
      ...newPost,
      content: content,
    })
    // console.log(newPost)
  }



  return (
    <div className="w-full py-2 h-screen overflow-y-auto">
      <TiptapEditor content={""} onChange={handleContentChange} handleSave={handleSave} topbarContent={<div className="flex flex-row items-center gap-2">
        <div className="flex font-medium gap-2 items-center text-muted-foreground text-sm px-4 my-2">
          <span className="text-sm text-muted-foreground">Yazar: </span>
          <ComboboxDemo />

        </div>
      </div>} />
    </div>
  )
}
