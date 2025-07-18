"use client"
import { Copy, InfoIcon, ListTreeIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import slugify from "react-slugify";
import { Button } from "@/components/ui/button";

import { Select, SelectContent, SelectTrigger, SelectItem, SelectValue } from "@/components/ui/select";
import TokenField, { TagToken } from "@/components/global/token-field";
import { nanoid } from "nanoid";
import { usePosts } from "@/store/hooks/posts.hook";



export default function NewBlogInspectorClient() {
  const [selectedTab, setSelectedTab] = useState<"info" | "list">("list");
  const [tags, setTags] = useState<TagToken[]>([]);
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [title, setTitle] = useState<string>("");
  const [excerpt, setExcerpt] = useState<string>("");

  const { selector: { newPost }, actions: { setNewPost } } = usePosts();
  useEffect(() => {
    setNewPost({
      ...newPost,
      title: title,
      excerpt: excerpt,
      status: status,
      tags: tags,
      slug: slugify(title),
      slug_uid: nanoid().toLowerCase(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      author: "admin",
    })
  }, [title, excerpt, status])    
  async function handleAddTag(tag: TagToken) {
    // console.log(tag)
    setTags([...tags, tag])
    // console.log(tags)
  }

  async function handleRemoveTag(tag: TagToken) {
    // console.log(tag)
    setTags(tags.filter(t => t.id !== tag.id))

  }
  return (
    <div className="h-screen overflow-y-auto">
      <div className="border-b grid grid-cols-auto grid-rows-[1fr]">
        <span className={cn("p-2 col-span-1 row-span-1 col-start-1 cursor-pointer text-center flex items-center justify-center", selectedTab === "info" && "text-primary")} onClick={() => setSelectedTab("info")}>
          <InfoIcon className="w-4 h-4" />

        </span>
        <span className={cn("p-2 col-span-1 row-span-1 col-start-2  cursor-pointer text-center flex items-center justify-center", selectedTab === "list" && "text-primary")} onClick={() => setSelectedTab("list")}>
          <ListTreeIcon className="w-4 h-4" />
        </span>
      </div>
      {selectedTab === "info" ? (
        <div className="flex flex-col items-center justify-center gap-2 px-2 w-full">
          <div
            className="space-y-2"
            data-slot="title"
          >
            <span className="text-xs opacity-70 mb-1">
              Bu, yazınızın yayınlandıktan sonra alacağı bağlantının önizlemesidir:
            </span>
            <div className="flex flex-row items-center gap-1">
              <span className="cursor-pointer font-medium items-center p-1 px-0 text-blue-500 text-xs   underline underline-offset-2 inline-block w-full">
                {"/" + slugify(title) + "-" + nanoid().toLowerCase()}
              </span>
              <Button variant="ghost" size="icon" className="!p-0 !w-4 !h-4">
                <Copy className="w-2 h-2 text-muted-foreground" />
              </Button>
            </div>
          </div>
        </div>

      ) : selectedTab === "list" ? (
        <div className="flex flex-col items-center justify-center w-full px-2 py-4">
          <div className="space-y-4">
            <div className="grid grid-cols-[1fr_1fr] items-center gap-2">
              <label htmlFor="status" className="text-xs mb-1" >Durum</label>
              <Select value={status} onValueChange={(value: "draft" | "published") => setStatus(value)}>
                <SelectTrigger className="w-full text-xs !py-1 !h-auto !px-2 rounded-[0.15rem] !shadow-none !ring-0 !outline-none bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Taslak</SelectItem>
                  <SelectItem value="published">Yayınla</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <InspectorDivider />
            <div className="grid grid-cols-[1fr_auto] items-center gap-2">
              <label htmlFor="title" className="text-xs mb-1" >Başlık</label>
              <input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Blog yazısı başlığı..."
                className=" border rounded-[0.15rem] p-1  w-full text-xs bg-background"
              />

            </div>
            <p className="text-xs text-muted-foreground">
              Kısa ve dikkat çekici bir başlık girin. Başlık, okuyucunun ilgisini ilk çeken bölümdür.
            </p>
            <InspectorDivider />
            <div className="grid grid-cols-[1fr_auto] items-baseline gap-2">

              <label htmlFor="excerpt" className="text-xs mb-1" >Özet</label>
              <textarea
                id="excerpt"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Blog yazısının kısa özeti..."
                rows={5}
                className=" border rounded-[0.15rem] p-1  w-full text-xs bg-background"
              />

            </div>
            <p className="text-xs text-muted-foreground">
              Yazının içeriğini birkaç cümleyle özetleyin. Arama motorları ve okuyucular için önemlidir.
            </p>
            <InspectorDivider />
            <div className="grid grid-cols-[1fr_auto] items-center gap-2">
              <label htmlFor="tags" className="text-xs mb-0" >Etiketler</label>


            </div>
            <TokenField
              initialTags={tags}
              onAdd={async (tag) => await handleAddTag(tag)}
              onRemove={async (tag) => await handleRemoveTag(tag)}
            />
            <p className="text-xs text-muted-foreground">Etiketleri virgülle ayırın veya enter tuşuna basın</p>



          </div>


        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-2 w-full">
          <span>içerik yok</span>
        </div>
      )}
    </div>
  );
}

const InspectorDivider = () => {
  return <div className="border-b w-full border-gray-200 my-2" />
}