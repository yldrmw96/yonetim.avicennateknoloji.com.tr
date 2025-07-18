import { cn } from "@/lib/utils";

export default function InspectorDivider({ className }: { className?: string }) {
  return <div className={cn("border-b w-full border-gray-200 my-2 dark:border-input", className)} />
}