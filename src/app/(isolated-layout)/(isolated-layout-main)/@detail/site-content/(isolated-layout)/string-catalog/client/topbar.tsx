import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";

export interface StringCatalogTopbarProps {
  onAdd: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onRemove: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function StringCatalogTopbar(
  { onAdd,
    onRemove
  }: StringCatalogTopbarProps) {
  return (
    <div className="flex items-center justify-start px-2.5 py-1.5 h-[var(--default-detail-topbar-max-height)]">
      <div className="flex items-center">
        <Button variant="ghost" size="sm" className="text-gray-500" onClick={onAdd}>
          <Plus className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="sm" className="text-gray-500" onClick={onRemove}>
          <Minus className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
