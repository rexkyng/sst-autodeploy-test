import { useMemo } from "react"
import { ColumnDef } from "@tanstack/react-table"
import type { ReminderHistory as CoreReminderHistory } from "@openauth/api";

// Web-specific ReminderHistory with different field names
export interface ReminderHistory {
  LN_ACCT_NO: string;
  LOAN_NO: string;
  REMINDER_DATE: string;
  TYPE: string;
  OVERDUE_AMT: number;
  STATUS: string;
}
import { DataTableColumnHeader } from "@/components/data-table"
import { formatDate2, toHKD } from "@/lib/formatters"
import { DataTable } from "@/components/data-table"

interface ReminderHistoryTableProps {
  history: ReminderHistory[];
}

export function ReminderHistoryTable({ history }: ReminderHistoryTableProps) {
  const columns = useMemo<ColumnDef<ReminderHistory>[]>(() => [
    {
      id: "Account",
      accessorFn: (row) => `${row.LN_ACCT_NO}-${row.LOAN_NO}`,
      header: "Account",
    },
    {
      accessorKey: "REMINDER_DATE",
      header: "Reminder Date",
      cell: ({ row }) => formatDate2(row.original.REMINDER_DATE),
    },
    {
      accessorKey: "TYPE",
      header: "Type",
    },
    {
      accessorKey: "OVERDUE_AMT",
      header: "Overdue Amount",
      cell: ({ row }) => toHKD(row.original.OVERDUE_AMT),
    },
    {
      accessorKey: "STATUS",
      header: "Status",
    },
  ], [])
  
  return (
    <DataTable
      columns={columns}
      data={history}
      getRowId={(record) => `${record.LN_ACCT_NO}-${record.LOAN_NO}-${record.REMINDER_DATE}`}
      enablePagination={false}
      enableToolbar={false}
    />
  )
}

