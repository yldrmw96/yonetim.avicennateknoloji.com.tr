export default function TableItemCountDisplay({ totalRowCount, selectedRowCount }: { totalRowCount: number, selectedRowCount: number }) {
  return (
    <div className="flex-1 text-sm text-muted-foreground">
      {selectedRowCount} satırdan{" "}
      {totalRowCount} satır(lar) seçili.
    </div>
  )
}
  