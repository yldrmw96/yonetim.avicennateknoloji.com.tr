import { TableCell, TableRow } from "@/components/ui/table";

export default function EmptyTableRow({ columnCount }: { columnCount: number }) {
  return (
    <TableRow>
      <TableCell colSpan={columnCount} className="h-24 text-center">
        Sonuç yok.
      </TableCell>
    </TableRow>
  )
}