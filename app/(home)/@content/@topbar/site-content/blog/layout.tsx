import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
export default function BlogPage() {
  return (
    <Link href="/site-content/blog/new" className="ms-auto col-start-3">
      <Button variant="ghost" className="gap-2 text-sm" size="sm">
        <Plus className="h-4 w-4  text-primary fill-primary stroke-primary" />
      </Button>
    </Link>
  );
}