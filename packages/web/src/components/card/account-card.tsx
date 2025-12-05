import React, { useState, useMemo, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Loan } from "@openauth/api";
import { Calculator, FileText } from "lucide-react";
import { toHKD, toLocaleString } from "@/lib/formatters";
import { useTableInteraction } from "@/hooks/use-table-interaction";
import { DICalculatorDialog } from "../dialogs/di-calculator-dialog";
import { checkSLAccount } from "@/lib/utils/array-extensions";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { DataTable } from "../data-table";
import { ColumnDef } from "@tanstack/react-table";

interface AccountCardProps {
  accounts: Loan[];
  selectedAccount?: Loan;
  onAccountSelect: (account: Loan) => void;
  onAccountDoubleClick: (account: Loan) => void;
  showAll?: boolean;
  onShortcutClick?: (account: Loan, type: "loan-ledger") => void;
  displayShowAllButton?: boolean;
  onToggleShowAll?: () => void;
}

export const AccountCard = React.memo<AccountCardProps>(({
  accounts,
  selectedAccount,
  onAccountSelect,
  onAccountDoubleClick,
  showAll = false,
  onShortcutClick,
  displayShowAllButton = false,
  onToggleShowAll,
}) => {
  const { handleSingleClick, handleDoubleClick } = useTableInteraction();
  const [diCalculatorOpen, setDICalculatorOpen] = useState(false);
  const [selectedForDI, setSelectedForDI] = useState<Loan | null>(null);

  // Memoize filtered accounts - expensive operation
  const displayedAccounts = useMemo(() => {
    return showAll ? accounts : accounts.filter(checkSLAccount);
  }, [accounts, showAll]);

  // Memoize callback functions
  const handleAccountSelect = useCallback((account: Loan) => {
    handleSingleClick(() => onAccountSelect(account));
  }, [handleSingleClick, onAccountSelect]);

  const handleAccountDoubleClick = useCallback((account: Loan) => {
    handleDoubleClick(() => onAccountDoubleClick(account));
  }, [handleDoubleClick, onAccountDoubleClick]);

  const handleToggleShowAll = useCallback(() => {
    onToggleShowAll?.();
  }, [onToggleShowAll]);

  const columns = useMemo<ColumnDef<Loan>[]>(() => [
    {
      id: "loanLedger",
      header: "",
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onShortcutClick?.(row.original, "loan-ledger");
          }}
          title="Loan Ledger"
        >
          <FileText className="h-4 w-4" />
        </Button>
      ),
      enableSorting: false,
    },
    {
      accessorKey: "AccountNumber",
      header: "A/C No",
      cell: ({ row }) => `${row.original.AccountNumber}-${row.original.LoanSequence}`,
    },
    {
      id: "TotalAmount",
      header: "Ttl.Amt",
      cell: ({ row }) => {
        const loan = row.original;
        const total = (loan.NetOverdueAmount || 0) +
                     (loan.LateCharge || 0) +
                     (loan.AdminCharge || 0) +
                     (loan.AnnualCharge || 0);
        return toHKD(total);
      },
    },
    {
      accessorKey: "NetOverdueAmount",
      header: "Net OD Amt",
      cell: ({ row }) => toHKD(row.original.NetOverdueAmount),
    },
    {
      accessorKey: "LateCharge",
      header: "LC",
      cell: ({ row }) => toHKD(row.original.LateCharge),
    },
    {
      accessorKey: "AdminCharge",
      header: "AC",
      cell: ({ row }) => toHKD(row.original.AdminCharge),
    },
    {
      accessorKey: "AnnualCharge",
      header: "AF",
      cell: ({ row }) => toHKD(row.original.AnnualCharge),
    },
    {
      accessorKey: "OverdueDay",
      header: "OD Days",
      cell: ({ row }) => toLocaleString(row.original.OverdueDay),
    },
    {
      id: "TotalNumberOfInstallment",
      header: "No. Inst",
      cell: ({ row }) => `${row.original.TotalNumberOfPaidInstallment || ""}/${row.original.TotalNumberOfInstallment || ""}`,
    },
    {
      accessorKey: "InstallmentAmount",
      header: "Inst Amt",
      cell: ({ row }) => toHKD(row.original.InstallmentAmount),
    },
    {
      accessorKey: "RepayMethod",
      header: "Rpy Method",
    },
    {
      accessorKey: "RejectReason",
      header: "AP Rej",
      cell: ({ row }) => row.original.RejectReason || "-",
    },
    {
      accessorKey: "LoanStatus",
      header: "Ln Status",
    },
    {
      id: "diCalculator",
      header: "",
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedForDI(row.original);
            setDICalculatorOpen(true);
          }}
          title="DI Calculator"
        >
          <Calculator className="h-4 w-4" />
        </Button>
      ),
      enableSorting: false,
    },
  ], [onShortcutClick]);

  return (
    <>
      <Card className="flex flex-col">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Accounts</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-2 flex-1 flex flex-col overflow-hidden pt-0">
          {displayShowAllButton && (
            <div className="flex justify-start mb-4">
              <Button
                onClick={handleToggleShowAll}
                variant="outline"
                size="sm"
              >
                {showAll ? "Hidden Account" : "Show All Account"}
              </Button>
            </div>
          )}
          <ScrollArea className="w-full flex-1">
            <div className="min-w-max">
              <DataTable
                columns={columns}
                data={displayedAccounts}
                selectedRow={selectedAccount}
                getRowId={(loan) => `${loan.AccountNumber}-${loan.LoanSequence}`}
                onRowClick={handleAccountSelect}
                onRowDoubleClick={handleAccountDoubleClick}
                enablePagination={false}
                enableToolbar={false}
                enableColumnVisibility={false}
              />
            </div>
            <ScrollBar orientation="horizontal" />
            <ScrollBar orientation="vertical" />
          </ScrollArea>
        </CardContent>
      </Card>

      {selectedForDI && (
        <DICalculatorDialog
          open={diCalculatorOpen}
          onOpenChange={setDICalculatorOpen}
          accountNumber={selectedForDI.AccountNumber}
          loanSequence={selectedForDI.LoanSequence}
        />
      )}
    </>
  );
});

AccountCard.displayName = 'AccountCard';
