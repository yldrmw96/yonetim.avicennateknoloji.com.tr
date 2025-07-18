"use client"

import { useState, useEffect } from "react"
import { TiptapEditor } from "@/components/global/tiptap-editor"
import { nanoid } from "nanoid"
import { usePosts } from "@/store/hooks/posts.hook"

import { ComboboxOption, GenericCombobox } from "./components/generic-combobox"
import { User } from "@/types/User"
import { useSites } from "@/store/hooks/sites.hook"
import { Language } from "@/lib/types"
import { useLocalizationCatalog } from "@/store/hooks/localizationcatalog.hook"


export interface BlogPost {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string
  author: string
  publishedAt: string
  status: "draft" | "published"
  tags: string[]
  featuredImage?: string
}
export default function EditBlogPostPage({ postFromServer }: { postFromServer: BlogPost }) {
  const [post, setPost] = useState<BlogPost | null>(postFromServer)

  const { selector: { editedPost }, actions: { setEditedPost } } = usePosts();

  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")
  const [excerpt, setExcerpt] = useState("")
  const [content, setContent] = useState("")
  const [author, setAuthor] = useState("")
  const [status, setStatus] = useState<"draft" | "published">("draft")
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { selector: { selectedSite } } = useSites()
  const { selector: { languages }, actions: { setLanguages } } = useLocalizationCatalog()
  const [languageOptions, setLanguageOptions] = useState<ComboboxOption<Language>[]>([])



  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null)

  useEffect(() => {
    setSelectedLanguage(languages.find((language: Language) => language.code === postFromServer.language) ?? null)
  }, [languages])

  useEffect(() => {
    async function getLanguages() {
      const languages = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/languages/get/by-site`, {
        method: "POST",
        body: JSON.stringify({ siteId: selectedSite?.id }),
      })
      const data = await languages.json()
      setLanguages(data)
    }
    getLanguages()
  }, [selectedSite])

  useEffect(() => {
    if (!languages) return
    setLanguageOptions(languages.map((language: Language) => ({
      value: language.code,
      label: `${language.code}`,
      data: language,
    })))
  }, [languages])

    const handleContentChange = (content: string) => {
    // console.log("Content changed:", content)
    setContent(content)
  }

  useEffect(() => {
    // console.log(nanoid().toLowerCase())
    setPost(postFromServer)
    setTitle(postFromServer.title)
    setSlug(postFromServer.slug)
    setExcerpt(postFromServer.excerpt)
    setContent(postFromServer.content)
    setAuthor(postFromServer.author)
    setStatus(postFromServer.status)


  }, [])

  useEffect(() => {
    setEditedPost({
      ...editedPost,
      content: content,
    })
  }, [content])

  const handleSave = async (content: string) => {
    const updatedPost = {
      postId: postFromServer.id,
      ...editedPost,
    }
    // console.log(updatedPost)
    const response = await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/v1/blog/update/post", {
      method: "POST",
      body: JSON.stringify(updatedPost),
    });
    const data = await response.json();
    if (data.success) {
      // console.log("Blog yazısı başarıyla güncellendi")
    } else {
      // console.log("Blog yazısı güncellenemedi")
    }
  }



  if (!post) {
    return <div>Yükleniyor...</div>
  }

  const handleUserSelect = (userId: number) => {
    // console.log(userId)
  }

  useEffect(() => {
    if (!selectedSite?.id) return

    setLoading(true)
    setError(null)

    fetch(`/api/v1/users/get/by-site`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ siteId: selectedSite.id }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Kullanıcılar yüklenemedi")
        }
        return response.json()
      })
      .then((data) => setUsers(data))
      .catch((error) => setError(error.message))
      .finally(() => setLoading(false))
  }, [selectedSite])

  // Users'ı ComboboxOption formatına dönüştür
  const userOptions: ComboboxOption<User>[] = users.map((user) => ({
    value: user.id,
    label: `${user.first_name} ${user.family_name}`,
    data: user,
  }))

  const handleUserChange = (value: string | number, option: ComboboxOption<User>) => {
    setSelectedUser(option.data)
  }

  return (
    <div className="w-full py-2 h-screen overflow-y-auto">
      <TiptapEditor content={postFromServer.content} onChange={handleContentChange} handleSave={handleSave} topbarContent={<div className="flex flex-row items-center gap-2">
        <div className="flex font-medium gap-2 items-center justify-between my-2 px-4 text-muted-foreground text-sm w-full">
          <div className="flex flex-row gap-2 items-center">
            <span className="text-sm text-muted-foreground">Yazar: {postFromServer.author}</span>
            <GenericCombobox<User>
              options={userOptions}
              value={selectedUser?.id}
              onValueChange={handleUserChange}
              placeholder="Kullanıcı Seç..."
              searchPlaceholder="Kullanıcılarda Ara..."
              emptyMessage="Kullanıcı bulunamadı."
              loading={loading}
              error={error}
            />
          </div>

          <div className="flex flex-row gap-2 items-center">
            <span className="text-sm text-muted-foreground">Şu dil için düzenleniyor:</span>

            <GenericCombobox<Language>
              options={languageOptions}
              value={selectedLanguage?.code}
              onValueChange={(value, option) => {
                setSelectedCountry(value as string)
                // console.log("Seçilen ülke:", option.data)
              }}
              placeholder="Dil seçin..."
              searchPlaceholder="Dil ara..."
              emptyMessage="Dil bulunamadı."
              className="max-w-fit"
            />
          </div>
        </div>
      </div>} />
    </div>
  )
}
