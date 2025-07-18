"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

import { ActivityIndicator } from "@/components/global/activity-indicator";
import { useAssets } from "@/store/hooks/assets.hook";

import { useSites } from "@/store/hooks/sites.hook";

import { Skeleton } from "@/components/ui/skeleton";

import { AssetItem } from "@/lib/types";


import Image from "next/image";
import EmptyState from "./components/empty-state";


export default function AssetCatalog({ defaultValuesFromServer }: { defaultValuesFromServer: any[] }) {
  const { selector: { assets, selectedAsset, isLoading }, actions: { setAssets, setSelectedAsset, setIsLoading } } = useAssets();
  const { selector: { selectedSite } } = useSites();

  useEffect(() => {

    if (defaultValuesFromServer) {
      setAssets(defaultValuesFromServer);
      setSelectedAsset(defaultValuesFromServer[0]);
      setIsLoading(false);
    }
  }, [defaultValuesFromServer])

  useEffect(() => {
    if (selectedSite) {
      fetchAssets();
    }
  }, [selectedSite])

  const fetchAssets = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/files/get/by-site/${selectedSite?.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      setAssets([]);
      setSelectedAsset(null);
      const data = await response.json();
      setAssets(data);
      setSelectedAsset(data[0]);
      setIsLoading(false);
    } catch (error) {
      // console.error(error);
    } finally {
      setIsLoading(false);
    }
  }
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // console.log(file);
    }
  }

  return (
    <>
      {
        assets.length === 0 && (
          <EmptyState />
        )
      }
      {
        assets.length > 0 && (
          <ul className="flex flex-col divide-y divide-gray-200 dark:divide-gray-800 border-t border-b relative">
            {assets.length > 0 && (
              <li>
                <Button variant="ghost" size="sm" className="w-full transition-none flex py-2 flex-row justify-start items-center !px-6">
                  <AssetThumbnailPlaceholderIcon
                    className={cn(
                      "text-lg ",
                    )}
                  />
                  Favicon
                </Button>
              </li>
            )}
            {assets.length > 0 ? assets.map((asset, index) => (
              <li key={index}>
                <Button
                  onClick={() => setSelectedAsset(asset)}
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "w-full px-6 !min-h-[var(--default-min-list-item-height)] transition-none flex py-1 flex-row justify-start items-center !rounded-none !border-none !shadow-none ",
                    selectedAsset?.id === asset.id &&
                    "!bg-primary !text-primary-foreground [&_svg]:text-white"
                  )}
                >
                  {asset.path ?

                    (
                      <span className="relative w-[1rem] h-[1rem] min-w-[1rem] min-h-[1rem] max-w-[1rem] max-h-[1rem] overflow-hidden relative">
                        <Image
                          src={`/uploads/images/thumbnail/${asset.thumbnail_id}.${asset.file_extension}`}
                          alt={asset.name}
                          fill={true}
                          style={{ objectFit: 'cover' }}
                        />
                      </span>
                    ) :
                    <AssetThumbnailPlaceholderIcon
                      className={cn(
                        "text-lg ",
                        selectedAsset?.id === asset.id ? "" : "opacity-30"
                      )}
                    />
                  }
                  <span className="text-sm font-medium truncate">{getAssetValidName(asset)}</span>
                </Button>
              </li>
            )) : isLoading ? <>
              <Skeleton className="mb-2 w-full h-[var(--default-min-list-item-height)]" />
              <Skeleton className="mb-2 w-full h-[var(--default-min-list-item-height)]" />
            </> : <></>
            }
          </ul>
        )
      }
      {
        isLoading && (
          <div className="flex items-center justify-center grow shrink-0 h-full absolute top-1/2 w-full left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background">
            <ActivityIndicator className="[--spinner-color:var(--color-gray-500)]" />
          </div>
        )
      }

    </>
  );
}


function getAssetValidName(asset: AssetItem) {
  const hasName = asset.name.trim() !== "";
  if (hasName) {
    return asset.name.trim();
  }
  return asset.resized_id + "." + asset.file_extension;
}

const AssetThumbnailPlaceholderIcon = ({ className }: { className: string }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" className={cn("injected-svg", className)} data-src="https://cdn.hugeicons.com/icons/dashed-line-02-solid-standard.svg" role="img" color="currentColor">
      <path fillRule="evenodd" clipRule="evenodd" d="M4.92857 2C3.31117 2 2 3.31117 2 4.92857V6.88095C2 7.42009 2.43706 7.85714 2.97619 7.85714C3.51533 7.85714 3.95238 7.42009 3.95238 6.88095V4.92857C3.95238 4.38944 4.38944 3.95238 4.92857 3.95238H6.88095C7.42009 3.95238 7.85714 3.51533 7.85714 2.97619C7.85714 2.43706 7.42009 2 6.88095 2H4.92857ZM17.619 2C17.0799 2 16.6429 2.43706 16.6429 2.97619C16.6429 3.51533 17.0799 3.95238 17.619 3.95238H19.5714C20.1106 3.95238 20.5476 4.38944 20.5476 4.92857V6.88095C20.5476 7.42009 20.9847 7.85714 21.5238 7.85714C22.0629 7.85714 22.5 7.42009 22.5 6.88095V4.92857C22.5 3.31117 21.1888 2 19.5714 2H17.619ZM3.95238 17.619C3.95238 17.0799 3.51533 16.6429 2.97619 16.6429C2.43706 16.6429 2 17.0799 2 17.619V19.5714C2 21.1888 3.31117 22.5 4.92857 22.5H6.88095C7.42009 22.5 7.85714 22.0629 7.85714 21.5238C7.85714 20.9847 7.42009 20.5476 6.88095 20.5476H4.92857C4.38944 20.5476 3.95238 20.1106 3.95238 19.5714V17.619ZM22.5 17.619C22.5 17.0799 22.0629 16.6429 21.5238 16.6429C20.9847 16.6429 20.5476 17.0799 20.5476 17.619V19.5714C20.5476 20.1106 20.1106 20.5476 19.5714 20.5476H17.619C17.0799 20.5476 16.6429 20.9847 16.6429 21.5238C16.6429 22.0629 17.0799 22.5 17.619 22.5H19.5714C21.1888 22.5 22.5 21.1888 22.5 19.5714V17.619ZM10.2976 2C9.75848 2 9.32143 2.43706 9.32143 2.97619C9.32143 3.51533 9.75848 3.95238 10.2976 3.95238H14.2024C14.7415 3.95238 15.1786 3.51533 15.1786 2.97619C15.1786 2.43706 14.7415 2 14.2024 2H10.2976ZM3.95238 10.2976C3.95238 9.75848 3.51533 9.32143 2.97619 9.32143C2.43706 9.32143 2 9.75848 2 10.2976V14.2024C2 14.7415 2.43706 15.1786 2.97619 15.1786C3.51533 15.1786 3.95238 14.7415 3.95238 14.2024V10.2976ZM22.5 10.2976C22.5 9.75848 22.0629 9.32143 21.5238 9.32143C20.9847 9.32143 20.5476 9.75848 20.5476 10.2976V14.2024C20.5476 14.7415 20.9847 15.1786 21.5238 15.1786C22.0629 15.1786 22.5 14.7415 22.5 14.2024V10.2976ZM10.2976 20.5476C9.75848 20.5476 9.32143 20.9847 9.32143 21.5238C9.32143 22.0629 9.75848 22.5 10.2976 22.5H14.2024C14.7415 22.5 15.1786 22.0629 15.1786 21.5238C15.1786 20.9847 14.7415 20.5476 14.2024 20.5476H10.2976Z" fill="currentColor" />
    </svg>
  )
}
