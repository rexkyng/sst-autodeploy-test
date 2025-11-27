"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { DataTablePagination } from "./data-table-pagination"
import { DataTableToolbar } from "./data-table-toolbar"
import { ErrorDisplay, LoadingFallback } from "@/components/ui/error-boundary"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  searchKey?: string
  searchPlaceholder?: string
  onRowClick?: (row: TData) => void
  onRowDoubleClick?: (row: TData) => void
  selectedRow?: TData
  getRowId?: (row: TData, index: number) => string
  enablePagination?: boolean
  enableToolbar?: boolean
  enableColumnVisibility?: boolean
  isLoading?: boolean
  error?: Error | string | null
  onRetry?: () => void
  loadingComponent?: React.ReactNode
  errorComponent?: React.ReactNode
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchKey,
  searchPlaceholder = "Search...",
  onRowClick,
  onRowDoubleClick,
  selectedRow,
  getRowId,
  enablePagination = true,
  enableToolbar = true,
  enableColumnVisibility = true,
  isLoading = false,
  error = null,
  onRetry,
  loadingComponent,
  errorComponent,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [sorting, setSorting] = React.useState<SortingState>([])

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: enablePagination ? getPaginationRowModel() : undefined,
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getRowId,
  })

  const handleRowClick = React.useCallback(
    (row: TData) => {
      onRowClick?.(row)
    },
    [onRowClick]
  )

  const handleRowDoubleClick = React.useCallback(
    (row: TData) => {
      onRowDoubleClick?.(row)
    },
    [onRowDoubleClick]
  )

  const isRowSelected = React.useCallback(
    (row: TData) => {
      if (!selectedRow || !getRowId) return false
      const rowId = getRowId(row, 0)
      const selectedRowId = getRowId(selectedRow, 0)
      return rowId === selectedRowId
    },
    [selectedRow, getRowId]
  )

  // Handle loading state
  if (isLoading) {
    return loadingComponent || <LoadingFallback message="Loading data..." />;
  }

  // Handle error state
  if (error) {
    return errorComponent || (
      <ErrorDisplay
        error={error}
        onRetry={onRetry}
        className="min-h-[200px]"
      />
    );
  }

  return (
    <div className="space-y-4">
      {enableToolbar && (
        <DataTableToolbar
          table={table}
          searchKey={searchKey}
          searchPlaceholder={searchPlaceholder}
          enableColumnVisibility={enableColumnVisibility}
        />
      )}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
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
                  variant={isRowSelected(row.original) ? "highlight" : "default"}
                  onClick={() => handleRowClick(row.original)}
                  onDoubleClick={() => handleRowDoubleClick(row.original)}
                  className={onRowClick ? "cursor-pointer" : undefined}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {enablePagination && <DataTablePagination table={table} />}
    </div>
  )
}

