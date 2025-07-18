
import { ChevronDown, ChevronRight, Folder, FolderOpen, FileText } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import Link from "next/link"
interface TreeNodeProps {
  node: any[]
  level: number
  expandedNodes: Set<string>
  onToggle: (id: string) => void
  onSelect: (node: any) => void
  selectedId?: string
}

export function TreeNode({ node, level, expandedNodes, onToggle, onSelect, selectedId }: TreeNodeProps) {
  const isExpanded = expandedNodes.has(node.id)
  const hasChildren = node.children && node.children.length > 0
  const isSelected = selectedId === node.id
  const name = node.label || node.name
  const getIcon = () => {
    if (hasChildren) {
      return isExpanded ? <FolderOpen className="w-4 h-4" /> : <Folder className="w-4 h-4" />
    }
    return <FileText className="w-4 h-4" />
  }
  return (
    <div className={cn("w-full divide-y [&_div.item]:py-4 divide-gray-200", level === 0 && "border-t")}>
      <div
        className={cn(
          "flex items-center gap-1 item px-2 cursor-pointer hover:bg-muted",
          isSelected && "bg-primary/10 text-primary",
        )}
        style={{ paddingLeft: `${level * 20 + 8}px` }}
        onClick={() => onSelect(node)}
      >

        {hasChildren ? (
          <Button
            variant="ghost"
            size="sm"
            className="w-4 h-4 p-0 text-primary hover:!text-primary/80"
            onClick={(e) => {
              e.stopPropagation()
              onToggle(node.id)
            }}
          >
            {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
          </Button>
        ) : (
          <div className="w-[0.5rem]" />
        )}
        { }

        <Link href={`/site-content/content-groups/${node.id}`} className="hover:underline">
          <span className="text-sm">{node.label}</span>
        </Link>
      </div>

      {hasChildren && isExpanded && (
        <>
          {node.children.map((child: any) => (
            <TreeNode
              key={child.id}
              node={child}
              level={level + 1}
              expandedNodes={expandedNodes}
              onToggle={onToggle}
              onSelect={onSelect}
              selectedId={selectedId}
            />
          ))}
        </>
      )}
    </div>
  )
}
