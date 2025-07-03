"use client"
import {
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import type { Route, RouteGroup } from "@/lib/types/Route"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useSites } from "@/store/hooks/sites.hook"
import { Skeleton } from "@/components/ui/skeleton"
import { ChevronDownIcon, ChevronRight, EllipsisIcon, PlusIcon } from 'lucide-react'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { useEffect, useState } from "react"
import { usePersistentStorage } from '@/hooks/use-persistent-storage'
import { useDynamicPersistentStorage } from "@/hooks/use-dynamic-persistent.storage"

interface Props {
  items: Map<RouteGroup, Route[]>
}

interface ContentGroupNavItem {
  id: string
  name: string
  label: string
  href?: string
  icon?: React.ReactNode
  children: ContentGroupNavItem[]
}

export function NavMain({ items }: Props) {
  const pathname = usePathname()
  const { isLoading } = useSites()

  const [contentGroupsOpen, setContentGroupsOpen] = usePersistentStorage(false, { key: "content-group-isopen" })

  const [contentGroupsContent, setContentGroupsContent] = useState<any[]>([
  ])

  const { selectedSite } = useSites()
  useEffect(() => {
    console.log("contentGroupsContent", contentGroupsContent)
  }, [contentGroupsContent])

  useEffect(() => {
    const fetchContentGroups = async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/content-groups/get/by-site`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ siteId: selectedSite?.id }),
      });
      const data = await response.json();
      console.log("data", data)
      const nestedRoot = createNestedStructure(data);
      console.log("nestedRoot", nestedRoot.children)
      setContentGroupsContent((prev) => [...prev, ...nestedRoot.children])
    }
    fetchContentGroups()
  }, [selectedSite])
  // Nested yapı oluşturma fonksiyonu

  // Nested yapı oluşturma fonksiyonu - EKSİK PARENT DÜZELTMESİ
  const createNestedStructure = (items: any[]) => {
    const root = {
      id: "root",
      name: "İçerik Yönetimi",
      label: "İçerik Yönetimi",
      children: []
    };

    // Tüm öğeleri ID ile eşleştir
    const itemMap: Record<string, any> = {};
    items.forEach(item => {
      itemMap[item.id] = {
        ...item,
        children: []
      };
    });

    // Hiyerarşiyi oluştur - EKSİK PARENTLER İÇİN DÜZELTME
    items.forEach(item => {
      const node = itemMap[item.id];

      if (item.parent_id === null) {
        root.children.push(node);
      } else {
        const parent = itemMap[item.parent_id];
        if (parent) {
          parent.children.push(node);
        } else {
          // Ebeveyn bulunamazsa köke ekle
          root.children.push(node);
        }
      }
    });

    return root;
  };

  const RecursiveContentGroupItem = ({ item, ...props }: { item: ContentGroupNavItem }) => {
    const { getValue, setValue } = useDynamicPersistentStorage<{
      openDropdowns: Record<string, boolean>
    }>({ openDropdowns: {} }, { key: "nested-dropdowns-state" })

    const isOpen = getValue(`openDropdowns.${item.id}`) || false
    const hasChildren = item.children && item.children.length > 0
    const isActive = pathname.includes(item.id)
    console.log("isActive", isActive)
    return (
      <Collapsible {...props} className="group/collapsible w-full" defaultOpen={isOpen} onOpenChange={() => {
        if (hasChildren) {
          setValue(`openDropdowns.${item.id}`, !isOpen)
        }
      }}>
        <SidebarMenuSubItem className="pe-0">
          <CollapsibleTrigger asChild>
            <SidebarMenuSubButton asChild>
              <Link
                href={`/site-content/content-groups/${item.id}`}
                className={cn("flex  items-center gap-2 [&_svg]:!text-primary font-medium active:ring-2 active:ring-primary/20 pe-0", isActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : "!bg-transparent ")}
              >


                <ChevronRight className={cn(hasChildren ? "h-4 w-4 shrink-0 transition-transform group-data-[state=open]/collapsible:rotate-90" : "h-4 w-4 shrink-0 opacity-0")} />

                {hasChildren ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" className="injected-svg" data-src="https://cdn.hugeicons.com/icons/folder-details-stroke-rounded.svg"  role="img" color="#000000">
                    <path d="M12 21C7.28595 21 4.92893 21 3.46447 19.5355C2 18.0711 2 15.714 2 11V7.94427C2 6.1278 2 5.21956 2.38032 4.53806C2.65142 4.05227 3.05227 3.65142 3.53806 3.38032C4.21956 3 5.1278 3 6.94427 3C8.10802 3 8.6899 3 9.19926 3.19101C10.3622 3.62712 10.8418 4.68358 11.3666 5.73313L12 7M8 7H16.75C18.8567 7 19.91 7 20.6667 7.50559C20.9943 7.72447 21.2755 8.00572 21.4944 8.33329C22 9.08996 22 10.1433 22 12.25" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
                    <path d="M22 15H15M22 18H15M17.5 21H15" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" className="injected-svg" data-src="https://cdn.hugeicons.com/icons/file-bookmark-stroke-rounded.svg" color="currentColor">
                    <path d="M4 13.0004L4 14.5446C4 17.7896 4 19.4121 4.88607 20.5111C5.06508 20.7331 5.26731 20.9354 5.48933 21.1144C6.58831 22.0004 8.21082 22.0004 11.4558 22.0004C12.1614 22.0004 12.5141 22.0004 12.8372 21.8864C12.9044 21.8627 12.9702 21.8354 13.0345 21.8047C13.3436 21.6569 13.593 21.4074 14.0919 20.9085L18.8284 16.172C19.4065 15.5939 19.6955 15.3049 19.8478 14.9374C20 14.5698 20 14.1611 20 13.3436V10.0004C20 6.22919 20 4.34358 18.8284 3.172C17.7693 2.11284 16.1265 2.01122 13.0345 2.00146M13 21.5004V21.0004C13 18.172 13 16.7578 13.8787 15.8791C14.7574 15.0004 16.1716 15.0004 19 15.0004H19.5" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M4 8.4532V4.98748C4 3.57894 4 2.87467 4.43934 2.43709C4.87868 1.99951 5.58579 1.99951 7 1.99951C8.41421 1.99951 9.12132 1.99951 9.56066 2.43709C10 2.87467 10 3.57894 10 4.98748V8.4532C10 9.37314 10 9.83311 9.71208 9.96742C9.42416 10.1017 9.06938 9.80727 8.35982 9.21834L7.64018 8.62106C7.33408 8.36699 7.18103 8.23996 7 8.23996C6.81897 8.23996 6.66592 8.36699 6.35982 8.62106L5.64018 9.21834C4.93062 9.80727 4.57584 10.1017 4.28792 9.96742C4 9.83311 4 9.37314 4 8.4532Z" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>)}
                <span>{item.label || item.name}</span>
                {hasChildren && (
                  <>
                    <span className="opacity-50 text-sm text-[font-family:var(--font-nunito)] ml-auto">{item.children.length}</span>
                    <EllipsisIcon className="h-4 w-4" />

                  </>
                )}
                {!hasChildren && (
                  <EllipsisIcon className="h-4 w-4 ms-auto" />
                )}
              </Link>
            </SidebarMenuSubButton>
          </CollapsibleTrigger>
        </SidebarMenuSubItem>

        {hasChildren && (
          <CollapsibleContent className="pe-0">
            <SidebarMenuSub className="pl-4 border-l border-border/30 ml-4 pe-0">
              {item.children.map((child) => (
                <RecursiveContentGroupItem
                  key={child.id} item={child} />
              ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        )}
      </Collapsible>
    )
  }

  return (
    <>
      {isLoading ? (
        <SidebarMenu>
          <SidebarMenuItem>
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index + "-content-groups-skeleton"} className="my-1 px-2 h-[var(--default-min-list-item-height)] w-full" />
            ))}
          </SidebarMenuItem>
        </SidebarMenu>
      ) : (
        Array.from(items).map(([key, value]) => {
          return (
            <SidebarGroup className="group/sidebar-group" key={key.id + "-sidebar-content-group-key"}>
              <SidebarGroupLabel>{key.name}</SidebarGroupLabel>
              <SidebarGroupAction className="bg-transparent">
                <ChevronDownIcon className="mx-auto my-auto text-primary" />
              </SidebarGroupAction>
              <SidebarGroupContent>
                <SidebarMenu>
                  {value.map((child) => {
                    const isActive =
                      pathname.split("/")[1] === child.href.split("/")[1] &&
                      pathname.split("/")[2] === child.href.split("/")[2]

                    // Special handling for content-groups with submenu
                    if (child.id === "content-groups") {
                      return (
                        <Collapsible key={child.id + "-collapsible-content-groups"} className="group/collapsible w-full" defaultOpen={contentGroupsOpen} onOpenChange={setContentGroupsOpen}>
                          <SidebarMenuItem>
                            <CollapsibleTrigger asChild>
                              <SidebarMenuButton tooltip={child.name} className="flex active:scale-95 transition-transform duration-100 items-center gap-2 [&>svg]:text-primary font-medium active:ring-2 active:ring-primary/20">

                                {child.icon && <child.icon />}
                                <span>{child.name}</span>
                                <span className="opacity-50 text-sm text-[font-family:var(--font-nunito)] ml-auto"> {contentGroupsContent.length}</span>

                              </SidebarMenuButton>
                            </CollapsibleTrigger>
                          </SidebarMenuItem>
                          <CollapsibleContent>
                            <SidebarMenuSub className="pe-0">
                              {contentGroupsContent.map((contentGroup, i) => (
                                <RecursiveContentGroupItem key={i + "-recursive-of-group-" + key.id} item={contentGroup} />
                              ))}
                              <SidebarMenuSubItem>
                                <SidebarMenuSubButton asChild>
                                  <Link
                                    href="/site-content/content-groups/create"
                                    className="flex items-center gap-2 [&_svg]:!text-primary font-medium active:ring-2 active:ring-primary/20 pe-0"
                                  >
                                    <PlusIcon className="h-4 w-4" width={"1em"} height={"1em"} />
                                    <span className="text-primary">Ekle</span>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            </SidebarMenuSub>
                          </CollapsibleContent>
                        </Collapsible>
                      )
                    }

                    // Regular menu items
                    return (
                      <SidebarMenuItem key={child.href}>
                        <SidebarMenuButton disabled={isActive} isActive={isActive} tooltip={child.name} asChild>
                          <Link
                            href={child.href}
                            className={cn(
                              "flex active:scale-95 transition-transform duration-100 items-center gap-2 [&>svg]:text-primary font-medium active:ring-2 active:ring-primary/20",
                            )}
                          >
                            {child.icon && <child.icon />}
                            <span>{child.name}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          )
        })
      )}
    </>
  )
}
