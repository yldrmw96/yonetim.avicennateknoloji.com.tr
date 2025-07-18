"use client";

import * as React from "react";
import { Check, ChevronsUpDown, GalleryVerticalEnd, Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useSites } from "@/store/hooks/sites.hook";

import { AddSiteModal } from "./add-site";
import {type Site } from "@/lib/types";

export function SiteSwitcher({ ownerId, selectedSiteId, sitesFromServer }: { ownerId: number, selectedSiteId: number, sitesFromServer: Site[] }) {
  const { selector: { sites, selectedSite, isLoading }, actions: { setSites, setSelectedSite, setIsLoading } } = useSites();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // const fetchSites = async () => {
    //   console.log("useeffect appear");
    //   setIsLoading(true);
    //   const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/sites/get/by-owner`, {
    //     method: "POST",
    //     body: JSON.stringify({ ownerId }),
    //   });
    //   const sites = await response.json();
    //   setSites(sites);
    //   if (sites.length > 0) {
    //     if (selectedSiteId == null) {
    //       setSelectedSite(sites[0]);
    //     } else {
    //       setSelectedSite(sites.find((site: any) => site.id === selectedSiteId));
    //     }
    //   }
    //   setIsLoading(false);
    //   return () => {
    //     console.log("useeffect disappear");
    //   }
    // };
    // fetchSites();
  }, [ownerId, selectedSiteId]);

  return (
    <>
      <SidebarMenu className="[--accent:var(--border)] ">
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                disabled={isLoading}
                size="lg"
                className="max-h-[var(--default-min-list-item-height)] data-[state=open]:bg-sidebar-accent disabled:opacity-50 focus-visible:ring-0 peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left outline-hidden ring-sidebar-ring transition-[width,height,padding] focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-data-[sidebar=menu-action]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground h-8 text-sm flex active:scale-95 transition-all duration-300 items-center gap-2 [&>svg]:text-primary font-medium active:ring-2 active:ring-primary/20 hover:!bg-primary/10"
              >
                {
                  sitesFromServer !== null && sitesFromServer.length > 0 && selectedSite !== null ? (
                    <>
                      <GalleryVerticalEnd className="size-4 text-primary" width={"1em"} height={"1em"} />
                      <span className="font-medium group-data-[state=open]:text-sidebar-accent-foreground truncate">{sitesFromServer.find(site => site.id === selectedSite.id)?.name}</span>
                    </>
                  ) : (
                    <>
                      <Skeleton className="size-8 aspect-square rounded-md" />
                      <Skeleton className="min-h-[1.25rem] grow shrink-0  rounded-md" />
                    </>
                  )
                }

                <ChevronsUpDown className="text-primary ml-auto" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="peer-[[data-state=open]]/menu-button:!w-[var(--radix-dropdown-menu-trigger-width)]"
              align="start"
            >
              {sitesFromServer !== null && selectedSite !== null && sitesFromServer.map((site) => (
                <DropdownMenuItem
                  key={site.id}
                  onSelect={() => setSelectedSite(site)}
                >
                  {site.name}{" "}
                  {site.id === selectedSite.id && <Check className="ml-auto" />}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => setOpen(true)}>
                <Plus className="size-4" />
                Site Ekle
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
      <AddSiteModal open={open} setOpen={setOpen} />
    </>
  );
}
