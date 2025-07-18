"use client"
import { downloadImageAsBase64 } from "@/lib/utils/image/download-image";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Download, Plus } from "lucide-react";
import { Ellipsis, TrashFill, PencilEllipsisRectangle } from "framework7-icons/react";
import { useState } from "react";
import { useAssets } from "@/store/hooks/assets.hook";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export default function AssetCatalogTopbar() {
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const { selector: { selectedAsset, assets }, actions: { setSelectedAsset, setAssets } } = useAssets();
  const handleDelete = async (id: number, name: string) => {
    if (!id) return;
    const response = await fetch(`/api/v1/upload-media`, {
      body: JSON.stringify({ id, name }),
      method: 'DELETE',
    });
    if (response.ok) {
      setSelectedAsset(null);
    }
  }
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/v1/upload-media', {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      const data = await response.json();
      setAssets([...assets, data]);
    }
  }

  const handleRename = async (name: string) => {
    if (!selectedAsset) return;
    const response = await fetch(`/api/v1/upload-media`, {
      body: JSON.stringify({ id: selectedAsset.id, name }),
      method: 'PUT',
    });
    if (response.ok) {
      // console.log(response);
    }
  }

  return <>
    <div className="flex flex-row gap-2 py-2 px-4 justify-end ms-auto max-w-fit">
      <Button size="sm" variant="ghost" className="ms-auto text-primary col-start-3 " onClick={() => document.getElementById("upload-input")?.click()}>
        <Plus className="size-4" />
        Ekle
      </Button>
      <input type="file" id="upload-input" className="hidden" onChange={handleUpload} />
      <input type="text" id="rename-input" className="hidden" onChange={(e) => setSelectedAsset({ ...selectedAsset, name: e.target.value })} />
      <Button size="sm" disabled={selectedAsset == null} variant="ghost" className="ms-auto col-start-3 " onClick={() => document.getElementById("rename-input")?.click()}>
        Değiştir
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="sm" disabled={selectedAsset == null} variant="ghost" className="ms-auto col-start-3 ">
            <Ellipsis className="size-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem className="flex flex-row gap-2 items-center" onClick={() => setIsRenameDialogOpen(true)}>
            <PencilEllipsisRectangle className="size-5 " />
            Yeniden Adlandır
          </DropdownMenuItem>
          <DropdownMenuItem className="flex flex-row gap-2 items-center text-red-500" onClick={() => handleDelete(selectedAsset?.id || 0, selectedAsset?.name || "")}>
            <TrashFill className="size-5 text-red-500" />
            Sil
          </DropdownMenuItem>

          <DropdownMenuItem className="flex flex-row gap-2 items-center" onClick={() => downloadImageAsBase64(process.env.NEXT_PUBLIC_API_URL + "/uploads/images/resized/" + selectedAsset?.resized_id + "." + selectedAsset?.file_extension,
             selectedAsset?.resized_id || "")}>
            <Download className="size-5" />
            İndir
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isRenameDialogOpen} onOpenChange={() => setIsRenameDialogOpen(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Yeniden Adlandır</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            <Input type="text" value={selectedAsset?.name} onChange={(e) => setSelectedAsset({ ...selectedAsset, name: e.target.value })} />
          </DialogDescription>
          <DialogFooter>
            <Button onClick={() => handleRename(selectedAsset?.name || "")}>Kaydet</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  </>
}