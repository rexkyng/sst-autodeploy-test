import { useMemo } from "react"
import { ColumnDef } from "@tanstack/react-table"
import type { ContactAmendmentHistory } from "@openauth/core/models"
import { formatDate, toPhoneTypeString } from "@/lib/formatters"
import { useCRMStore } from "@/store/crm-store"
import { DataTable } from "@/components/data-table"

interface ContactAmendmentTableProps {
  history: ContactAmendmentHistory[];
}

export function ContactAmendmentTable({ history }: ContactAmendmentTableProps) {
  const selectedDebtor = useCRMStore((state) => state.selectedDebtor)
  const selectedAccountNo = useCRMStore((state) => state.selectedAccountNo)
  const selectedAccountLoanSequence = useCRMStore(
    (state) => state.selectedAccountLoanSequence
  )

  const filteredHistory = useMemo(() => {
    const selectedCustomerId = selectedDebtor?.CustomerId

    return history.filter((record) => {
      if (!selectedCustomerId) {
        return false
      }

      if (
        record.Role &&
        record.CustomerId === selectedCustomerId &&
        record.AccountNumber === selectedAccountNo &&
        record.LoanSequence === selectedAccountLoanSequence
      ) {
        return true
      }

      return record.CustomerId === selectedCustomerId
    })
  }, [
    history,
    selectedDebtor?.CustomerId,
    selectedAccountLoanSequence,
    selectedAccountNo,
  ])

  const contactAmendmentHistoryRoleHandler = (role: string | undefined) => {
    if (role) {
      return role
    }
    return selectedDebtor?.Role || ""
  }

  const columns = useMemo<ColumnDef<ContactAmendmentHistory>[]>(() => [
    {
      id: "Role",
      accessorKey: "Role",
      header: "Role",
      cell: ({ row }) => contactAmendmentHistoryRoleHandler(row.original.Role),
    },
    {
      id: "Type",
      accessorKey: "PhoneType",
      header: "Type",
      cell: ({ row }) => toPhoneTypeString(parseInt(row.original.PhoneType || "0")),
    },
    {
      accessorKey: "PhoneNumber",
      header: "Phone No",
      cell: ({ row }) => row.original.PhoneNumber || "",
    },
    {
      accessorKey: "PhoneExtension",
      header: "Ext./Pin",
      cell: ({ row }) => row.original.PhoneExtension || "",
    },
    {
      accessorKey: "PhoneInvalidReason",
      header: "Invalid Reason",
      cell: ({ row }) => row.original.PhoneInvalidReason || "",
    },
    {
      accessorKey: "ActionDatetime",
      header: "Amendment Time",
      cell: ({ row }) => formatDate(row.original.ActionDatetime),
    },
    {
      accessorKey: "AgentId",
      header: "Agent ID",
      cell: ({ row }) => row.original.AgentId || "",
    },
    {
      accessorKey: "ActionType",
      header: "Action Type",
      cell: ({ row }) => row.original.ActionType || "",
    },
  ], [selectedDebtor])

  return (
    <DataTable
      columns={columns}
      data={filteredHistory}
      getRowId={(record, index) => `${record.CustomerId || ""}-${record.AccountNumber || ""}-${record.LoanSequence || ""}-${record.ActionDatetime || ""}-${record.PhoneNumber || ""}-${index}`}
      enablePagination={false}
      enableToolbar={false}
    />
  )
}
