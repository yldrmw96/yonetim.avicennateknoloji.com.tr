import { Skeleton } from "@/components/ui/skeleton";

export default function BlogItemSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-2 p-2 px-6 py-4">
      <Skeleton className="h-[1.4rem] w-[6rem]" />
      <Skeleton className="h-[1.4rem] w-full" />
      <Skeleton className="h-[1.4rem] w-full" />
      <Skeleton className="h-[1.4rem] w-full" />
      <Skeleton className="h-[1.4rem] w-[10rem]" />
    </div>
  )
}