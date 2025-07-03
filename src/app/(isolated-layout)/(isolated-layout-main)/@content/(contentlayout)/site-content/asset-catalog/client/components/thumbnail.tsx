import Image from "next/image";
interface AssetCatalogThumbnailProps {
  source: string;
}
export default function AssetCatalogThumbnail({ source }: AssetCatalogThumbnailProps) {
  return (
    <Image
      src={source}
      alt="thumbnail"
      className="w-[1em] h-[1em] min-w-[1em] min-h-[1em] max-w-[1em] max-h-[1em] rounded-[0.125em] object-scale-down"
      fill={true}
    />
  )
}