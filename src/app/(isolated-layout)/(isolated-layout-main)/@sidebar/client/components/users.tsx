"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { UserRow } from "@/types/UserRow";
import { useEffect } from "react";

// Column definitions
export const columns: ColumnDef<UserRow>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Ad Soyad
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="">
          {row.original.first_name} {row.original.family_name}
        </div>
      );
    },
  },
  {
    accessorKey: "email",
    header: () => <div className="text-left">Email</div>,
    cell: ({ row }) => {
      return <div className="text-left font-medium">{row.getValue("email")}</div>;
    },
  },
  {
    accessorKey: "status",
    header: "Durum",
    cell: ({ row }) => (
      <div className="capitalize">{row.original.status ? "Aktif" : "Pasif"}</div>
    ),
  },
  {
    accessorKey: "role",
    header: "Rol",
    cell: ({ row }) => <div className="capitalize">{row.original.role_name}</div>,
  },
];

export default function UsersTable({usersData}: {usersData: UserRow[]}) {
  const [data, setData] = React.useState<UserRow[]>(usersData);
  const [loading, setLoading] = React.useState(false);
  const [selectedUserId, setSelectedUserId] = React.useState<string | null>(null);


  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    enableMultiRowSelection: false,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const handleUserAction = (userId: string, action: string) => {
    switch (action) {
      case 'copy':
        navigator.clipboard.writeText(userId);
        break;
      case 'view':
        console.log(`Kullanıcı görüntüleniyor: ${userId}`);
        // Görüntüleme işlemleri
        break;
      case 'details':
        console.log(`Kullanıcı detayları görüntüleniyor: ${userId}`);
        // Detay görüntüleme işlemleri
        break;
      default:
        break;
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center py-4 px-6">
        <Input
          placeholder="Filtrele..."
          value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("email")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger

            asChild>
            <Button variant="outline" className="ml-auto">
              Sütunlar <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="border-t border-b">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className=" text-center"
                >
                  Yükleniyor...
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <ContextMenu key={row.id} onOpenChange={() => setSelectedUserId(row.original.id)}>
                  <ContextMenuTrigger asChild>
                    <TableRow
                      data-state={row.getIsSelected() && "selected"}
                      onClick={() => {
                        row.toggleSelected();
                      }}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell className="!py-2" key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  </ContextMenuTrigger>
                  <ContextMenuContent>
                    <ContextMenuItem onClick={() => handleUserAction(row.original.id, 'copy')}>
                      Kullanıcı ID&apos;sini Kopyala
                    </ContextMenuItem>
                    <ContextMenuSeparator />
                    <ContextMenuItem onClick={() => handleUserAction(row.original.id, 'view')}>
                      Kullanıcıyı Görüntüle
                    </ContextMenuItem>
                    <ContextMenuItem onClick={() => handleUserAction(row.original.id, 'details')}>
                      Kullanıcı Detaylarını Görüntüle
                    </ContextMenuItem>
                  </ContextMenuContent>
                </ContextMenu>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Sonuç yok.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4 px-6">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} satırdan{" "}
          {table.getFilteredRowModel().rows.length} satır(lar) seçili.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Önceki
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Sonraki
          </Button>
        </div>
      </div>
    </div>
  );
}
