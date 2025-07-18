"use client";
import { SidebarTrigger } from "@/components/ui/sidebar";

import { cn } from "@/lib/utils";
import { ClassValue } from "clsx";
import { useNavigation } from "@/store/hooks/navigation.hook";


interface SiteHeaderProps {
  topbar: React.ReactNode;
}

export function SiteHeader({ topbar }: SiteHeaderProps) {

  const { selector: { title, customTitle, customTitleLastUpdated, titleLastUpdated, isTitleDisplayModeLarge } } = useNavigation();

  const displayTitle = (() => {
    if (!customTitleLastUpdated || !titleLastUpdated) {
      return customTitle || title;
    }
    return customTitleLastUpdated > titleLastUpdated ? customTitle : title;
  })()


  return (
    <header className={cn(clss.header, !isTitleDisplayModeLarge ? "" : "border-b")}>

      <SidebarTrigger className="col-start-1" />
      <div className={cn(clss.headerContent)}>
        <span className={cn(
          clss.headerTitle, isTitleDisplayModeLarge ? "opacity-100" : "")}>
          {displayTitle}
        </span>
      </div>
      {topbar}

    </header>
  );
}

const clss: Record<string, ClassValue> = {
  header: "asset-catalog-topbar group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-12 shrink-0 items-center gap-2 transition-[width,height] ease-linear sticky top-0 z-10  px-4 grid grid-cols-[1fr_auto_1fr] grid-flow-row-dense  [background:var(--header-bg-color)]",
  headerContent: "flex flex-row items-center gap-2 justify-center",
  headerTitle: "truncate !min-w-0 line-clamp-1 text-center font-bold opacity-0 transition-opacity duration-300  text-ellipsis max-w-screen ",
}