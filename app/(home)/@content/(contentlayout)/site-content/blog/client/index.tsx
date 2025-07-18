"use client"
import {  CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useEffect } from "react"
import { useSites } from "@/store/hooks/sites.hook"
import { usePosts } from "@/store/hooks/posts.hook"
import Blog from "./components/blog"
import EmptyState from "./components/empty-state"

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date)
}


export default function BlogManagementPage({ postsFromServer, tagsFromServer, getPostsFn }: {
  postsFromServer: any[],
  tagsFromServer: any[],
  getPostsFn: (params: { site_id: number }) => Promise<any[]>
}) {

  const { selector: { posts, isLoading, error, shouldRefresh }, actions: { setPosts, setIsLoading } } = usePosts();
  const { selector: { selectedSite } } = useSites();
  useEffect(() => {
    if (selectedSite) {
      setIsLoading(true);
      getPostsFn({ site_id: selectedSite.id }).then((data) => {
        setPosts(data);
        setIsLoading(false);
      });
    }
  }, [getPostsFn, selectedSite]);

  if (isLoading) {
    return (
      <>
        <Blog.Skeleton />
        <Blog.Skeleton />
        <Blog.Skeleton />
        <Blog.Skeleton />
        <Blog.Skeleton />
      </>
    )
  }

  if (error) {
    return (
      <>
        <div className="text-center py-12">
          <h3 className="text-lg font-medium mb-2">Bir hata oluştu</h3>
          <p className="text-muted-foreground mb-4">{error}</p>
        </div>
      </>
    )
  }

  return (
    <>
      <div className="flex flex-row overflow-x-auto gap-2 p-2 min-h-fit">
        {tagsFromServer.map((tag) => (
          <Badge key={tag.id} variant="outline" className="min-w-fit cursor-pointer flex-1 shrink-0">{tag.title}</Badge>
        ))}
      </div>
      <div className="grid divide-y border-t border-b">

        {
          posts.map((post) => (
            <div key={post.id} className="flex flex-col gap-2 group overflow-hidden px-6 py-2 relative">

              <Link href={`/site-content/blog/${post.id}`} className="
            absolute top-0 right-0 w-full h-full inset-0 hover:bg-accent z-0 transition-[all] duration-100 group-hover:opacity-100 z-0 scale-[0.93] group-hover:scale-[1]">

              </Link>
              <Badge className={`relative ${post.status === "published" ? "" : "!border !border-border !shadow-xs !bg-background  opacity-70 rounded-[0.4rem]"}  pointer-events-none !text-xs !px-[0.25rem] !py-[0.1rem] z-1`} variant={post.status === "published" ? "default" : "secondary"}>
                {post.status === "published" ? "Yayınlandı" : "Taslak"}
              </Badge>
              <div className="relative pointer-events-none flex z-1 items-start justify-between">
                <div className="space-y-2">
                  <CardTitle className="">{post.title}</CardTitle>
                  <p className="text-muted-foreground text-sm line-clamp-4">{post.excerpt}</p>
                </div>
              </div>
            </div>
          ))}
      </div>

      {posts.length === 0 && (
        <EmptyState />
      )}
    </>
  );
}
