"use client"

import { useAssets } from "@/store/hooks/assets.hook";
import { InfoIcon, ListTreeIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Select, SelectValue, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import Image from "next/image";
import Inspector from "@/components/global/inspector";


export default function AssetCatalogInspectorPage() {
  const [assetName, setAssetName] = useState<string>("");
  const { selectedAsset } = useAssets();
  const [selectedTab, setSelectedTab] = useState<"info" | "list">("info");

  useEffect(() => {
    setAssetName(selectedAsset?.name || selectedAsset?.resized_id || "");
  }, [selectedAsset]);


  if (!selectedAsset) return null;
  return (
    <div>
      <Inspector.TabList>
        <span className={cn("p-2 col-span-1 row-span-1 col-start-1 cursor-pointer text-center flex items-center justify-center", selectedTab === "info" && "text-primary")} onClick={() => setSelectedTab("info")}>
          <InfoIcon className="w-4 h-4" />

        </span>
        <span className={cn("p-2 col-span-1 row-span-1 col-start-2  cursor-pointer text-center flex items-center justify-center", selectedTab === "list" && "text-primary")} onClick={() => setSelectedTab("list")}>
          <ListTreeIcon className="w-4 h-4" />
        </span>
      </Inspector.TabList>
      
      {selectedTab === "info" ? (
        <div className="flex flex-col items-center justify-center gap-2 w-full pt-4">
          <span className="bg-gray-50  border-dashed border-gray-200 flex h-[44vh] items-center justify-center overflow-hidden max-w-[4rem] max-h-[4rem] min-w-[4rem] min-h-[4rem] h-[4rem] w-[4rem] relative">
            <Image 
            src={`/uploads/images/resized/${selectedAsset.resized_id}.${selectedAsset.file_extension}`} 
            alt={selectedAsset.name} 
            fill={true}
            style={{ objectFit: 'cover' }}
            />  
          </span>
         


          <div className="flex flex-col gap-1">

            <div className="p-2 px-4 grid">

              <div className="grid grid-cols-2 gap-1">
                <span className="text-xs text-start font-medium">Dosya Tipi: </span>
                <span className="text-xs text-end uppercase">{selectedAsset.file_extension.toUpperCase()}</span>
              </div>


              <div className="grid grid-cols-2 gap-1">
                <span className="text-xs text-start font-medium">Çözünürlük: </span>
                <span className="text-xs text-gray-500 text-end">Bulunamadı.</span>
              </div>

              <div className="grid grid-cols-2 gap-1">
                <span className="text-xs text-start font-medium">Konum: </span>
                <p className="text-xs text-end truncate font-medium">{selectedAsset.path}</p>
              </div>

            </div>

            {/* <Button onClick={async () => {
                try {
                  const resizedFile = await handleResize(selectedAsset.path, selectedAsset.name);
                  console.log(resizedFile);
                } catch (error) {
                  console.error('Hata:', error);
                }
              }} className="w-full">
                <PhotoFillOnRectangleFill className="w-4 h-4" />
                <span className="text-sm font-medium">Küçült</span>
              </Button> */}
          </div>
        </div>

      ) : selectedTab === "list" ? (
        <div className="flex flex-col items-center justify-center w-full">
            <div className="grid grid-cols-4 gap-1 px-4 w-full items-center pt-2">
              <span className="text-xs font-medium">Ad</span>
              <input type="text" className="col-span-3 border rounded-[0.15rem] p-1  w-full text-xs" defaultValue={assetName} onChange={(e) => setAssetName(e.target.value)} />
            </div>
            <InspectorDivider />
            <div className="grid grid-cols-2 gap-1 w-full px-4 items-center">
              <span className="text-xs text-start font-medium">İçerik Grubu:</span>
              <Select>
                <SelectTrigger className="w-full text-xs !py-1 !h-auto !px-2 rounded-[0.15rem]">
                  <SelectValue placeholder="Grup seçiniz" />
                </SelectTrigger>
                <SelectContent className="text-xs">
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                </SelectContent>
              </Select>

            </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-2 w-full">
          <span>içerik yok</span>
        </div>
      )}
    </div>
  );
}

const InspectorDivider = () => {
  return <div className="border-b w-full border-gray-200 my-2"/>
}