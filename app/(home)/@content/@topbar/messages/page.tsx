import { Button } from "@/components/ui/button";
import { MessageCircleIcon, SquarePen } from "lucide-react";

export default function MessagesPage() {
  return (
    <Button variant="flat" className="text-primary ms-auto">
      <SquarePen className="w-4 h-4" />
    </Button>
  )
}