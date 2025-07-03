"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "@/lib/utils"
import { usePersistentStorage } from "@/hooks/use-persistent-storage"

function Tabs({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {

  const [tabValue, setTabValue] = usePersistentStorage("account", { key: "content-group-tab-value" });
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn("flex flex-col", className)}
      value={tabValue}
      onValueChange={setTabValue}
      {...props}
    />
  )
}

function TabsList({
  className,
  tabStyle,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List> & { tabStyle?: "default" | "flat" }) {

  let tabStyleClasses = {
    default: "bg-muted text-muted-foreground group/tab-list-default inline-flex h-9 w-fit items-center justify-center ",
    flat: "bg-transparent text-muted-foreground group/tab-list-flat inline-flex h-9 w-fit items-center justify-center"
  }[tabStyle || "default"]

  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        tabStyleClasses,
        className
      )}
      {...props}
    />
  )
}

function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        " border-b-2 border-transparent data-[state=active]:border-current data-[state=active]:font-medium  dark:data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 text-foreground/30 data-[state=active]:text-foreground dark:text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5  px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50  [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    />
  )
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("flex-1 outline-none", className)}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
