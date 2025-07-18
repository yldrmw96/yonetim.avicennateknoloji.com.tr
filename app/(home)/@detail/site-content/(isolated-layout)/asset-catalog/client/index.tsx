"use client";

import React, { useState } from "react";
import { PhotoFillOnRectangleFill } from "framework7-icons/react";
import { useAssets } from "@/store/hooks/assets.hook";
import Image from "next/image";

export default function AssetCatalogPageClient() {
  const { selectedAsset } = useAssets();
  const [isDragging, setIsDragging] = useState(false);
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // console.log(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      // console.log(file);
      handleUpload(file);
    }
    setIsDragging(false);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };



  const handleUpload = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/v1/files/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        // console.log('Dosya başarıyla yüklendi:', result);
        // İsteğe bağlı: Yüklenen dosyanın bilgilerini gösterme
      } else {
        const errorResult = await response.json();
        // console.error('Dosya yükleme hatası:', errorResult);
      }
    } catch (error) {
      // console.error('Ağ hatası:', error);
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  return (
    <div
      className="flex flex-col items-center justify-center gap-4 grow dark:bg-input/20 shrink-0 grow shrink-0 relative w-full"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <div className={`absolute top-0 left-0 w-full h-full flex items-center z-2 justify-center bg-gray-50/90 dark:bg-input/30 ${isDragging ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
        <h2 className="text-sm font-medium opacity-50 ">Buraya sürükleyin</h2>
        <input type="file" className="hidden" onChange={handleFileUpload} />
      </div>
      {selectedAsset ? (
        <div className="flex flex-col items-center justify-center gap-2 w-full h-full">
          <span className="bg-gray-50 border border-dashed border-gray-200  items-center justify-center overflow-hidden max-w-[20rem] max-h-[20rem] min-w-[20rem] min-h-[20rem] h-[20rem] w-[20rem] relative">
            <Image
              src={`/uploads/images/resized/${selectedAsset.resized_id}.${selectedAsset.file_extension}`}
              alt={selectedAsset.name}
              fill={true}
              style={{ objectFit: 'cover' }}
            />
          </span>
        </div>

      ) : (
        <AssetCatalogEmpty />
      )}
    </div>



  );
}

const AssetCatalogEmpty = () => {
  return (
    <span className="flex items-center justify-center size-80 border border-dashed border-gray-200 dark:border-gray-800 rounded-xl">
      <PhotoFillOnRectangleFill className="text-4xl opacity-30" />
    </span>
  )
}