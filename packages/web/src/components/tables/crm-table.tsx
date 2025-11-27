import { ReactNode, useMemo } from "react"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
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
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"

export interface Column<T> {
  key: string
  header: string
  sortable?: boolean
  render?: (row: T) => ReactNode
  className?: string
}

interface CRMTableProps<T> {
  columns: Column<T>[]
  data: T[]
  onRowClick?: (row: T) => void
  onRowDoubleClick?: (row: T) => void
  selectedRow?: T
  getRowKey: (row: T) => string
  currentSort?: string
  currentSortDir?: "asc" | "desc"
  onSort?: (key: string) => void
  className?: string
}

export function CRMTable<T>({
  columns,
  data,
  onRowClick,
  onRowDoubleClick,
  selectedRow,
  getRowKey,
  currentSort,
  currentSortDir,
  onSort,
  className,
}: CRMTableProps<T>) {
  // Convert legacy Column format to TanStack ColumnDef
  const tanstackColumns = useMemo<ColumnDef<T>[]>(() => {
    return columns.map((col) => ({
      id: col.key,
      accessorKey: col.key,
      header: ({ column }) => {
        if (!col.sortable || !onSort) {
          return <span className="whitespace-normal leading-tight">{col.header}</span>
        }

        const isSorted = currentSort === col.key
        const sortDirection = currentSortDir

        return (
          <Button
            variant="ghost"
            size="sm"
            className="-ml-3 h-8 hover:bg-accent/50"
            onClick={() => onSort(col.key)}
          >
            <span className="flex-1 whitespace-normal leading-tight">{col.header}</span>
            {isSorted ? (
              sortDirection === "asc" ? (
                <ArrowUp className="ml-2 h-3 w-3" />
              ) : (
                <ArrowDown className="ml-2 h-3 w-3" />
              )
            ) : (
              <ArrowUpDown className="ml-2 h-3 w-3 text-muted-foreground" />
            )}
          </Button>
        )
      },
      cell: ({ row }) => {
        const value = col.render ? col.render(row.original) : (row.original as any)[col.key]
        return <div className={col.className}>{value}</div>
      },
      enableSorting: col.sortable,
    }))
  }, [columns, currentSort, currentSortDir, onSort])

  const sorting: SortingState = useMemo(() => {
    if (!currentSort) return []
    return [{ id: currentSort, desc: currentSortDir === "desc" }]
  }, [currentSort, currentSortDir])

  const table = useReactTable({
    data,
    columns: tanstackColumns,
    state: {
      sorting,
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualSorting: true, // We're handling sorting externally
    getRowId: (row) => getRowKey(row),
  })

  return (
    <ScrollArea className={cn("w-full", className)}>
      <div className="min-w-max">
        <div className="rounded-md border">
          <Table className="w-full min-w-max">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className={columns.find(c => c.key === header.id)?.className}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length} className="text-center text-muted-foreground">
                    No data available
                  </TableCell>
                </TableRow>
              ) : (
                table.getRowModel().rows.map((row) => {
                  const isSelected = selectedRow && getRowKey(selectedRow) === row.id
                  
                  return (
                    <TableRow
                      key={row.id}
                      className={cn("cursor-pointer", isSelected ? "bg-muted/50" : "")}
                      onClick={() => onRowClick?.(row.original)}
                      onDoubleClick={() => onRowDoubleClick?.(row.original)}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      <ScrollBar orientation="horizontal" />
      <ScrollBar orientation="vertical" />
    </ScrollArea>
  )
}

