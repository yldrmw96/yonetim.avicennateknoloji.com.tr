"use client";

import { routes } from "@/lib/constants/routes";
import { cn } from "@/lib/utils";
import { ClassValue } from "clsx";
import { usePathname } from "next/navigation";
import { useEffect, forwardRef } from "react";
import { Route, RouteGroup } from "@/types/Route";

import { parse } from "uri-js";
import { useNavigation } from "@/store/hooks/navigation.hook";
import { Skeleton } from "./ui/skeleton";
import { useSites } from "@/store/hooks/sites.hook";

interface PageTitleProps {
  className?: string;
}

export const PageTitle = forwardRef<HTMLDivElement, PageTitleProps>(({ className }, ref) => {
  const hook = affectNavigationTitle();
  const { selector: { title, customTitle, titleLastUpdated, customTitleLastUpdated }} = useNavigation();




  const displayTitle = (() => { 
    if (!customTitleLastUpdated || !titleLastUpdated) {
      return customTitle || title;
    }

    const customDate = new Date(customTitleLastUpdated);
    const titleDate = new Date(titleLastUpdated);
    
    return customDate > titleDate ? customTitle : title;
  })();
  const { selector: {isLoading } } = useSites();


  return (
    <div
      className={cn(
        clss.container.default,
        className
      )}
    >
      <div className="flex flex-row items-center gap-2 px-6 pt-3 w-full">
   

            { !isLoading ? (
          <h1 className="truncate text-ellipsis !min-w-0 text-wrap text-left !min-w-0 text-lg font-semibold pb-3" ref={ref}>
              {displayTitle}
          </h1>
              ) : <Skeleton className="w-1/6 h-6 mb-3" />}
  
      </div>
    </div>
  );
});

PageTitle.displayName = "PageTitle";

const clss: Record<string, Record<string, ClassValue>> = {
  container: {
    default: "flex flex-row items-center gap-2 bg-background col-start-2 transition-opacity duration-300 [background:var(--header-bg-color)] asset-catalog-topbar",
    hiding: "opacity-0",
    showing: "opacity-100 bg-background",
  },

}

export function findRouteRecursively(
  routes: Map<RouteGroup, Route[]>,
  pathname: string
): Route | null {

  if (routes.size === 0) {
    return null;
  }

  const segments = parseUrlSegments(pathname, { keepSlashes: true, removeEmpty: true });

  for (const [, value] of routes) {
    for (const route of value) {
      // console.log(route.href);
      // console.log(segments);
      if (route.type === "group") {
        const childRoute = findRouteRecursively(routes, pathname);
        if (childRoute) {
          return childRoute;
        }
      }

      if (segments.includes(route.segment)) {
        return route;
      }


    }
  }
  return null;
}

export const affectNavigationTitle = () => {
  const pathname = usePathname();
  const {actions: { setTitle } } = useNavigation();
  useEffect(() => {
    const route = findRouteRecursively(routes, pathname);
    setTitle(route?.name || "");
  }, [pathname]);
  return null;
};


function parseUrlSegments(url: string, options: { keepSlashes?: boolean, removeEmpty?: boolean } = {}) {
  const { keepSlashes = false, removeEmpty = true } = options;

  try {
    const parsed = parse(url);

    if (!parsed.path) return [];

    let segments;

    if (keepSlashes) {
      // Slash'leri segment başlarına ekle
      const pathSegments = parsed.path.split('/');
      segments = [];

      for (let i = 0; i < pathSegments.length; i++) {
        const segment = pathSegments[i];

        if (!removeEmpty || segment !== '') {
          if (i === 0 && segment === '') {
            // İlk boş segment (root slash)
            continue;
          }

          // Her segmentin başına slash ekle (ilk hariç)
          const segmentWithSlash = i > 0 ? '/' + segment : segment;
          segments.push(segmentWithSlash);
        }
      }

    } else {
      // Slash'leri kaldır
      segments = parsed.path.split('/').filter(segment => segment !== '');
    }

    return segments;
  } catch (error) {
    console.error('URL parsing error:', error);
    return [];
  }
}