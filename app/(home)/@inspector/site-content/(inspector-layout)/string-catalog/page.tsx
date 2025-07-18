"use client"
import { cn } from "@/lib/utils";
import { InfoIcon, ListTreeIcon } from "lucide-react";
import { useState } from "react";

export default function Page() {
  const [selectedTab, setSelectedTab] = useState<"info" | "list">("list");
 
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
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-2 px-2 w-full">
          <div
            className="space-y-2"
            data-slot="title"
          >
            <span className="text-xs opacity-70 mb-1">
              Bu, yazınızın yayınlandıktan sonra alacağı bağlantının önizlemesidir:
            </span>
          </div>
        </div>
      )}
    </div>
  )
}