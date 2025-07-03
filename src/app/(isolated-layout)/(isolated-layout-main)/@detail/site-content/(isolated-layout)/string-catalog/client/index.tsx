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

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {  LocalizationContent } from "@/types/LocalizableString";
import { EditableInput } from "@/components/ui/x-input"
import { Language } from "@/types/Language";
import EmptyTableRow from "./empty-state";
import TableItemCountDisplay from "./table-item-count-display";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useEffect, useMemo, useState } from "react";
import { useLocalizationCatalog } from "@/store/hooks/localizationcatalog.hook";
import { useSites } from "@/store/hooks/sites.hook";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuSeparator } from "@/components/ui/context-menu";
import { ContextMenuTrigger } from "@radix-ui/react-context-menu";
import StringCatalogTopbar from "./topbar";
import { Skeletoned } from "@/components/skeletoned";
import { cn } from "@/lib/utils";

import { CheckmarkCircle } from "framework7-icons/react";

interface StringCatalogTableProps {
  stringCatalog: Record<string, LocalizationContent>[];
  selectedLanguageInitially: Language | null;
  stringKeys: any;
  getStringKeys: (siteID: number) => Promise<any>;
  getStringCatalog: (siteID: number, lang_code: string) => Promise<any>;
}

interface StringContentData {
  key_id: number;
  content_id: number;
  content: string;
  lang_code: string;
  group_id: number;
  group_name: string;
  group_label: string;
}

interface StringKeysData {
  key_id: number;
  key: string;
}

interface StringCatalogRow {
  keyData: StringKeysData;
  contentData?: StringContentData;
  translationData?: StringContentData;
}

export default function StringCatalogTable
(
  { stringCatalog,
    selectedLanguageInitially,
    stringKeys,
    getStringKeys,
    getStringCatalog
  }
  : StringCatalogTableProps
) {

  const [tableData, setTableData] = useState<StringCatalogRow[]>([]);

  const [stringKeysData, setStringKeysData] = useState<any>(stringKeys)
  const [stringCatalogData, setStringCatalogData] = useState<any>(stringCatalog)
  const [translationStringCatalogData, setTranslationStringCatalogData] = useState<any>([])

  const { selector: { selectedLanguage }, actions: { setSelectedLanguage } } = useLocalizationCatalog();
  const { selector: { selectedSite } } = useSites();

  const [isLoading, setIsLoading] = useState(false);
  const [shouldShowNewRowInputs, setShouldShowNewRowInputs] = useState(false);

  useEffect(() => {
    if (!selectedLanguage || !selectedSite) return;

    const _tableData: StringCatalogRow[] = stringKeysData.map((key: StringKeysData) => {
      const content = stringCatalogData.find((content: StringContentData) => content.key_id === key.key_id && content.lang_code === selectedLanguageInitially?.code);
      const translation = translationStringCatalogData.find((content: StringContentData) => content.key_id === key.key_id && content.lang_code === selectedLanguage?.code);
      return { keyData: key, contentData: content, translationData: translation };
    });
    setTableData(_tableData);
  }, [selectedLanguage, selectedSite, stringKeysData, stringCatalogData, selectedLanguageInitially, translationStringCatalogData]);

  useEffect(() => {
    if (!selectedLanguage) return;
    if (!selectedSite) return;
    if (!selectedLanguageInitially || selectedLanguageInitially.code === selectedLanguage.code) return;
    const fetchStringCatalog = async () => {
      setIsLoading(true);
      const defaultCatalogData = await getStringCatalog(selectedSite.id, selectedLanguageInitially.code);
      setStringCatalogData(defaultCatalogData);
      const translationCatalogData = await getStringCatalog(selectedSite.id, selectedLanguage.code);
      setTranslationStringCatalogData(translationCatalogData);
      setIsLoading(false);
    }
    fetchStringCatalog();
  }, [selectedLanguage, selectedSite]);

  useEffect(() => {
    if (!selectedLanguage && selectedLanguageInitially) setSelectedLanguage(selectedLanguageInitially);
    if (!selectedSite) return;
    if (!selectedLanguage) return;

    const fetchStringKeys = async () => {
      setIsLoading(true);
      const result = await getStringKeys(selectedSite.id);
      setStringKeysData(result);
      setIsLoading(false);
    }
    fetchStringKeys();
  }, [selectedSite]);

  const [newRowKey, setNewRowKey] = useState({
    key_id: -1,
    content_id: -1,
    content: '',
    lang_code: '',
    group_id: -1,
    group_name: '',
    group_label: '',
    site_id: 1,
    key: ''
  });

  const handleUpdate = async (row: any, e: any, type: "key" | "content" | "translation") => {
    try {
      console.log(e.target.value);
      console.log(row, e);
      const { keyData, contentData, translationData } = row.original;
      const hasContentData = contentData !== undefined && contentData !== null;
      const hasKeyData = keyData !== undefined && keyData !== null;
      const hasTranslationData = translationData !== undefined && translationData !== null;

      if (!hasContentData && !hasKeyData && !hasTranslationData) return;
      if (selectedLanguage === null) return;
  
      // Add content if it doesn't exist
      if (type === "content" && (!hasContentData) && hasKeyData) {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/string-catalog/add/content`, {
          method: "POST",
          body: JSON.stringify({ lang_code: selectedLanguage.code, group_id: 1, key_id: keyData.key_id, data: e.target.value })
        })
        if (response.ok) {
          const result = await response.json();
          console.log(result);
        }
      }

      // Add translation if it doesn't exist
      if (type === "translation" && (!hasTranslationData) && hasKeyData) {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/string-catalog/add/content`, {
          method: "POST",
          body: JSON.stringify({ lang_code: selectedLanguage.code, group_id: 1, key_id: keyData.key_id, data: e.target.value })
        })
        if (response.ok) {
          const result = await response.json();
          console.log(result);
        }
      }

      // Update key if it exists
      if (hasKeyData && type === "key" && e.target.value.trim().length > 0) {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/string-catalog/update/key`, {
          method: "POST",
          body: JSON.stringify({ key_id: keyData.key_id, data: e.target.value })
        })
        if (response.ok) {
          const result = await response.json();
          console.log(result);
          const refreshedKeysData = await getStringKeys(selectedSite!.id);

          setStringKeysData(refreshedKeysData);
        }
      }

      // Update content if it exists
      if (type === "content" && (hasContentData)) {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/string-catalog/update/content`, {
          method: "POST",
          body: JSON.stringify({ content_id: contentData.content_id, data: e.target.value })
        })
        if (response.ok) {
          const result = await response.json();
          console.log(result);
        }
        const refreshedCatalogData = await getStringCatalog(selectedSite!.id, selectedLanguage.code);
        setStringCatalogData(refreshedCatalogData);
      }

      // Update translation if it exists
      if (type === "translation" && (hasTranslationData)) {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/string-catalog/update/content`, {
          method: "POST",
          body: JSON.stringify({ content_id: translationData.content_id, data: e.target.value })
        })
        if (response.ok) {
          const result = await response.json();
          console.log(result);
          const refreshedCatalogData = await getStringCatalog(selectedSite?.id ?? 1, selectedLanguage.code);
          setStringCatalogData(refreshedCatalogData);
        }
      }


      console.log(keyData, contentData);
    } catch (error) {

    }

  };


  function toggleSorting(column: any) {
    column.toggleSorting(column.getIsSorted() === "asc");
  }

  const columns = useMemo<ColumnDef<StringCatalogRow>[]>(
    () => [
      {
        id: "key",
        accessorKey: "key",
        header: ({ column }) => (
          <Button
            variant="ghost"
            className="border-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:ring-offset-transparent !bg-transparent"
            onClick={() => toggleSorting(column)}
          >
            Anahtar
           
          </Button>
        ),
        cell: ({ row }) => {
          return (
            <div className="row-wrapper">
              <EditableInput
                className="min-h-[1.45rem]"
                defaultValue={row.original.keyData.key}
                onBlur={(e) => handleUpdate(row, e, "key")}
              />
            </div>
          )
        },
      },
      {
        id: "default",
        header: () => <div className="text-left">Varsayılan {selectedLanguageInitially?.name} ({selectedLanguageInitially?.code})</div>,
        cell: ({ row }) =>
        (
          <div className="row-wrapper">
            <EditableInput
              className="min-h-[1.45rem] disabled:!cursor-not-allowed "
              disabled={(selectedLanguage !== null && selectedLanguage !== undefined) && selectedLanguage.code !== selectedLanguageInitially?.code}
              placeholder={row.original.contentData?.content ?? row.original.keyData.key}
              dir={row.original.contentData?.lang_code === "ar" ? "rtl" : "ltr"}
              defaultValue={row.original.contentData?.content}
              onBlur={(e) =>
                handleUpdate(row, e, "content")
              }
            />
          </div>
        )
        ,
      },
      ...((selectedLanguage !== null && selectedLanguage !== undefined) && selectedLanguage.code !== selectedLanguageInitially?.code
        ? [
          {
            id: "translation",
            header: () => (
              <div className="text-left">
                {selectedLanguage.code.toUpperCase()} ({selectedLanguage.code})
              </div>
            ),
            cell: ({ row }: { row: any }) => {
              return (
                <div className="row-wrapper">
                  <EditableInput
                    className="min-h-[1.45rem]"
                    placeholder={row.original.translationData?.content ?? row.original.keyData.key}
                    defaultValue={row.original.translationData?.content}
                    onBlur={(e) =>
                      handleUpdate(row, e, "translation")
                    }
                  />
                </div>
              )
            },
          },
          {
            id: "status",
            header: () => <div className="text-center">Durum</div>,
            cell: ({ row }: { row: any }) => {
              return (
                <div className="row-wrapper text-center justify-center flex">
                  <CheckmarkCircle className={cn("text-green-500 min-h-[1.45rem] !text-sm/2", row.getIsSelected() && "!text-white")} />
                </div>
              )
            }
          }
        ]
        : [])
    ],
    [selectedLanguage, selectedLanguageInitially, selectedSite, stringCatalogData, stringKeysData, translationStringCatalogData]
  );

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});


  const table = useReactTable({
    data: tableData,
    columns,
    getRowId: row => row.keyData.key_id.toString(),
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
    }
  });


  const handleMouseClick = (e: any) => {
    const isTargettedScrollArea = e.target.id === "scroll-area";
    if (isTargettedScrollArea) {
      setShouldShowNewRowInputs(true);
    }
  }

  const handleContextMenu = (e: any) => {
    console.log(e);
  }

  async function handleNewRowBlur(e: any) {
    const hasEmptyField = !(newRowKey.key.trim().length > 0 || newRowKey.content.trim().length > 0)
    if (hasEmptyField) {
      setShouldShowNewRowInputs(false);
    } else {

      if (newRowKey.key.trim().length > 0) {
        let lastInsertedKeyId = null;
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/string-catalog/add/key`, {
          method: "POST",
          body: JSON.stringify({
            data: newRowKey.key ?? "",
            site_id: selectedSite?.id ?? 1,
          })
        })
        if (response.ok) {
          const result = await response.json();
          lastInsertedKeyId = result.lastInsertId;
          if (newRowKey.content.trim().length > 0) {
            const response2 = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/string-catalog/add/content`, {
              method: "POST",
              body: JSON.stringify({
                data: newRowKey.content ?? "",
                group_id: 1,
                key_id: newRowKey.key_id ?? "",
                lang_code: selectedLanguage?.code ?? "tr",
              })
            })
            if (response2.ok) {
              const refreshedCatalogData = await getStringCatalog(selectedSite?.id ?? 1, selectedLanguage?.code ?? "tr");
              setStringCatalogData(refreshedCatalogData);
              const refreshedKeysData = await getStringKeys(selectedSite?.id ?? 1, selectedLanguage?.code ?? "tr");
              setStringKeysData(refreshedKeysData);
            }
          }
        }
      }

      if (newRowKey.key.trim().length > 0 && newRowKey.content.trim().length > 0) {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/string-catalog/add/key`, {
          method: "POST",
          body: JSON.stringify({
            data: newRowKey.content ?? "",
            group_id: 1,
            key_id: newRowKey.key_id ?? "",
            lang_code: selectedLanguage?.code ?? "tr",
          })
        })
        // if (response.ok) {
        //   const refreshedData = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/string-catalog/get/by-site/${selectedSite?.id}`, {
        //     method: "POST",
        //     body: JSON.stringify({ lang_code: selectedLanguageInitially?.code ?? "tr" })
        //   })
        // .then(res => res.json())
        // setLocalizationCatalog(refreshedData);
        // setStringCatalogData(refreshedData);
        // setShouldShowNewRowInputs(false);
        // setNewRowKey({
        //   key_id: -1,
        //   content_id: -1,
        //   content: '',
        //   lang_code: '',
        //   group_id: -1,
        //   group_name: '',
        //   group_label: '',
        //   site_id: 1,
        //   key: ''
        // });
      } else {
        throw new Error("Failed to add new row");
      }
    }

  }


async function handleDelete() {
  try {
    const selectedRows = table.getSelectedRowModel().rows;
    if (!(selectedRows.length > 0)) return;
    const contentIdToDelete = selectedRows[0].original.content_id;

    console.log(contentIdToDelete);
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/string-catalog/delete/content/${contentIdToDelete}`, {
      method: "POST",
    })
    if (response.ok) {
      const refreshedData = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/string-catalog/get/by-site/${selectedSite?.id}`, {
        method: "POST",
        body: JSON.stringify({ lang_code: selectedLanguage?.code ?? "tr" })
      })
        .then(res => res.json())
      setLocalizationCatalog(refreshedData);
      const newData = refreshedData.filter((item: any) => item.content_id !== contentIdToDelete);
      setData(newData);
      table.setRowSelection({});

    } else {
      throw new Error("Failed to delete row");
    }
  } catch (error) {
    console.error(error);
  }
}
return (
  <div className="flex flex-col h-full justify-items-stretch max-h-screen overflow-auto w-full justify-between" style={{ minHeight: "inherit" }}>
    <StringCatalogTopbar onAdd={() => { }} onRemove={() => { }} />
    <ContextMenu>
      <ContextMenuTrigger className="" asChild onContextMenu={handleContextMenu}>
        <ScrollArea id="scroll-area" className="h-full shrink-0 grow" onMouseDown={handleMouseClick}>
          <Table className="w-full flex-1 shrink-0 grow border-b border-dashed">

            <TableHeader className="h-[calc(var(--default-topbar-max-height)-var(--default-detail-topbar-max-height))] 
            border-dashed
            ">
              {table.getHeaderGroups().map((headerGroup, idx) => (
                <TableRow key={headerGroup.id} className="border-dashed">
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        <div className="flex flex-row items-center">
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                          {idx !== table.getHeaderGroups().length - 1 || idx === 0 && <Separator orientation="vertical" className="h-full min-h-[1em] ms-auto" />}
                        </div>
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (

                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="border-dashed"
                    onClick={() => {
                      if (!row.getIsSelected()) {
                        row.toggleSelected();
                      }
                    }}
                  >

                    {row.getVisibleCells().map((cell) => (

                      <TableCell key={cell.id} >
                        <Skeletoned className="h-[1.25rem] my-[0.50rem] rounded-sm  w-1/2 mx-2" loading={isLoading}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </Skeletoned>
                      </TableCell>
                    ))}
                  </TableRow>

                ))
              ) : (
                <EmptyTableRow columnCount={columns.length} />
              )}
              {
                shouldShowNewRowInputs && (
                  <TableRow>

                    <TableCell colSpan={columns.length / 2}>
                      <div className="row-wrapper">
                        <EditableInput
                          value={newRowKey.key}
                          onChange={(e) => setNewRowKey({ ...newRowKey, key: e.target.value })}
                          onBlur={(e) => handleNewRowBlur(e)}
                          defaultValue={newRowKey.key}
                        />
                      </div>
                    </TableCell>

                    <TableCell colSpan={columns.length / 2}>
                      <div className="row-wrapper">
                        <EditableInput
                          value={newRowKey.content}
                          onChange={(e) => setNewRowKey({ ...newRowKey, content: e.target.value })}
                          onBlur={(e) => handleNewRowBlur(e)}
                          defaultValue={newRowKey.content}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                )
              }
            </TableBody>
          </Table>
        </ScrollArea>
      </ContextMenuTrigger>

      <ContextMenuContent className="w-52">
        <ContextMenuItem >
          Anahtarı Düzenle
        </ContextMenuItem>
        <ContextMenuItem onSelect={
          (e) => {
            console.log("Değeri Düzenle", e);
            console.log(table.getSelectedRowModel().rows);
          }
        }>
          Değeri Düzenle
        </ContextMenuItem>
        <ContextMenuItem >
          Yeni Satır Ekle
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem onSelect={handleDelete} variant="destructive" className="font-bold">Sil</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>

    <div className="flex items-center justify-end space-x-2 py-4 px-6 border-t sticky bottom-0 bg-background">
      <TableItemCountDisplay
        totalRowCount={table.getFilteredRowModel().rows.length} selectedRowCount={table.getFilteredSelectedRowModel().rows.length} />

      <div 
      className="flex items-center [&>button:first-child]:!rounded-e-none [&>button:last-child]:!rounded-s-none 
      [&>button:first-child]:!border-e-0
      ">
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
