"use client";

import { routes } from "@/lib/constants/routes";

import { cn } from "@/lib/utils";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenuItem,
  SidebarMenu,
  SidebarMenuButton,
  SidebarGroup,
  useSidebar,
} from "@/components/ui/sidebar";

import { 
  NavMain,
  NavUser,
  SiteSwitcher
} from "@/app/(home)/@sidebar/client/components";

import { 
  useRef, 
  useState,
  type UIEvent
} from "react";

import { type Site, type User } from "@/lib/types";


interface Props {
  user: User;
  selectedSiteId: number;
  sitesFromServer: Site[];
}


export function Client({ 
  user, 
  selectedSiteId,
  sitesFromServer,
}: Props) {
  
  const scrollRef = useRef<HTMLDivElement>(null);

  const [isTopbarStyleChanged, setIsTopbarStyleChanged] = useState(false);

  const onScroll = (event: UIEvent<HTMLDivElement>) => {
    if (event.currentTarget.scrollTop > 0) {
      setIsTopbarStyleChanged(true);
    } else {
      setIsTopbarStyleChanged(false);
    }
  };
  const { state } = useSidebar()

  let stateClasses = {
    expanded: "",
    collapsed: "justify-center",
  }[state]

  let stateClassesTitle = {
    expanded: "",
    collapsed: "justify-center",
  }[state]
  
  return (
    <Sidebar collapsible="icon" variant="inset">
      {/* <div id="sidebar-mask" className="absolute top-0 left-0 w-full h-full bg-red-500 bg-sidebar z-2">

      </div> */}
      <SidebarHeader
        className={cn("transition-all duration-300", stateClasses, isTopbarStyleChanged && "border-b")}
      >
        <SidebarMenu>
          <SidebarMenuItem className={cn("flex items-center transition-all duration-300", stateClassesTitle)}>
            <SidebarMenuButton tooltip="Quick Create" className="min-w-8 px-1.5">
              <span className="text-xl font-bold group-data-[state=expanded]:pl-2">LOGO</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarGroup className="group-data-[state=collapsed]:hidden">
          {/* <SiteSwitcher ownerId={user.id} selectedSiteId={selectedSiteId} sitesFromServer={sitesFromServer} /> */}
        </SidebarGroup>
      </SidebarHeader>

      <SidebarContent ref={scrollRef} onScroll={onScroll} className="overflow-y-auto">
      

        <NavMain items={routes} />

        {/* <NavUser
          userFromServer={{
            id: user.id,
            email: user.email,
            first_name: user.first_name,
            family_name: user.family_name,
            middle_name: null,
          }}

        /> */}
      </SidebarContent>

    </Sidebar>
  );
}
