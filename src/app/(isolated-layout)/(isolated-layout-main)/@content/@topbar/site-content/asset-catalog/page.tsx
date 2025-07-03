"use client"
import { Ellipsis, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRef } from "react"

export default function AssetCatalogTopbar() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  }

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log(file);
    }
  }

  return (
    <div

      className="flex asset-catalog-topbar flex-row items-center 
    [&>button:first-child]:!rounded-e-none [&>button:last-child]:!rounded-s-none 
    [&>button:first-child]:!border-e-0
    [&>button]:!py-1
    ">
    
      <Button variant="outline" onClick={handleUploadClick}>
        <Plus />
        <input type="file" id="upload-input" className="hidden" onChange={handleUpload} ref={fileInputRef} />

      </Button>


      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            <Ellipsis />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="start">
          <DropdownMenuGroup>
            <DropdownMenuItem>
              Yükle
            </DropdownMenuItem>
            <DropdownMenuSeparator />

            <DropdownMenuItem disabled>
              Düzenle
            </DropdownMenuItem>
            <DropdownMenuItem disabled>
              Yeniden Adlandır
            </DropdownMenuItem>

          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem disabled>Sil</DropdownMenuItem>
          </DropdownMenuGroup>


        </DropdownMenuContent>
      </DropdownMenu>
      
    </div>
  )
}