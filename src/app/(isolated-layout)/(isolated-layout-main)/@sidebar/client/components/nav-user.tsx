"use client";

import {
  LogOutIcon,
  MoreVerticalIcon,
  UserCircleIcon
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setIsOpen } from "@/store/slices/user-modal-slice";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function NavUser({userFromServer}: {userFromServer: any}) {
  const { isMobile } = useSidebar();
  const dispatch = useDispatch();
  const router = useRouter();
  const handleLogout = async () => {
    try {
      // await logoutFn();
      router.refresh();
    } catch (error) {
      console.error(error);
    }
  };
  const { state } = useSidebar()

  let stateClasses = {
    expanded: "",
    collapsed: "!p-0",
  }[state]

  return (
    <div className="z-5 bottom-0 sticky w-full px-2 pb-2 mt-auto">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuButton
            size="lg"
            className={cn("border min-h-fit h-auto transition-all dark:data-[state=open]:bg-neutral-900/90 !px-2 !py-2 duration-300 data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground shadow-xs !sticky  bg-card justify-center  p-0 rounded-md !w-full flex items-center group-data-[collapsible=icon]:!mx-auto mt-auto justify-self-bottom gap-2 self-end ", stateClasses)}
          >
            <UserCircleIcon className="size-4 text-primary" />
              <div className="grid flex-1 text-left text-sm leading-tight group-data-[state=collapsed]:hidden">
                <span className="truncate font-medium">
                  {userFromServer.first_name + " " + userFromServer.family_name}
                </span>
              </div>
              <MoreVerticalIcon className="ml-auto size-4 group-data-[state=collapsed]:hidden" />

          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
          side={isMobile ? "bottom" : "right"}
          align="end"
          sideOffset={4}
        >
          <DropdownMenuLabel className="p-0 font-normal">
            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
              <Avatar className="h-8 w-8 min-w-8 min-h-8 max-w-8 max-h-8">
                <AvatarImage
                  src={userFromServer?.avatar}
                  alt={
                    userFromServer.first_name.charAt(0) +
                    " " +
                    userFromServer.family_name.charAt(0)
                  }
                />
                <AvatarFallback className="rounded-full font-medium text-primary">
                  {userFromServer.first_name.charAt(0) +
                    "" +
                    userFromServer.family_name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  {userFromServer.first_name +
                    " " +
                    userFromServer.family_name}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  {userFromServer.email}
                </span>
              </div>
            </div>
          </DropdownMenuLabel>
          <Button.ThemeSwitcher />

          <DropdownMenuSeparator className="mx-0" />
          <DropdownMenuGroup>
            <DropdownMenuItem onSelect={() => dispatch(setIsOpen(true))}>
              <UserCircleIcon />
              Hesap
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuItem onClick={handleLogout}>
            <LogOutIcon />
            Çıkış Yap
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
   </div>
  );
}
