import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AccountCard } from "@/components/card/account-card";
import { FollowHistoryDialog } from "@/components/dialogs/alert-dialogs";
import { HistoryCard } from "@/components/card/history-card";
import type { FollowHistory } from "@openauth/core/models";
import { useCRMStore } from "@/store/crm-store";

interface FollowHistoryPageProps {
  onNavigateToAccountDetail?: () => void;
}

export function FollowHistoryPage({ onNavigateToAccountDetail }: FollowHistoryPageProps) {
  const store = useCRMStore();
  const [showAll, setShowAll] = useState(false);
  const [selectedRemark, setSelectedRemark] = useState("");
  const [remarkDialogOpen, setRemarkDialogOpen] = useState(false);
  
  const handleAccountSelect = (account: any) => {
    store.setSelectedAccount(account.AccountNumber, account.LoanSequence, account);
    store.setSearchCriteria({
      selectedAccountNoForFollowHistory: account.AccountNumber,
      selectedAccountLoanSequenceForFollowHistory: account.LoanSequence,
    });
  };
  
  const handleAccountDoubleClick = (account: any) => {
    handleAccountSelect(account);
    onNavigateToAccountDetail?.();
  };
  
  const handleAccountSort = (field: string) => {
    store.updateSort(field, "account");
  };
  
  const handleFollowHistorySort = (field: string) => {
    store.updateSort(field, "follow");
  };
  
  const handleRemarkClick = (remark: string) => {
    setSelectedRemark(remark);
    setRemarkDialogOpen(true);
  };
  
  // Filter and sort history based on selected account or show all
  let displayedHistory = showAll
    ? store.followHistory
    : store.followHistory.filter(
        (h) =>
          h.AccountNumber === store.selectedAccountNoForFollowHistory &&
          h.LoanSequence === store.selectedAccountLoanSequenceForFollowHistory
      );

  // Apply sorting if sort field is set
  if (store.currentSort) {
    displayedHistory = [...displayedHistory].sort((a, b) => {
      const aValue = a[store.currentSort as keyof FollowHistory];
      const bValue = b[store.currentSort as keyof FollowHistory];

      // Handle different data types
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        const comparison = aValue.localeCompare(bValue);
        return store.currentSortDir === 'desc' ? -comparison : comparison;
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        const comparison = aValue - bValue;
        return store.currentSortDir === 'desc' ? -comparison : comparison;
      }

      // For dates, convert to timestamps
      if (aValue && typeof (aValue as any).getTime === 'function' && bValue && typeof (bValue as any).getTime === 'function') {
        const comparison = (aValue as any).getTime() - (bValue as any).getTime();
        return store.currentSortDir === 'desc' ? -comparison : comparison;
      }

      // For string dates, try to parse as dates
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        const aDate = new Date(aValue);
        const bDate = new Date(bValue);
        if (!isNaN(aDate.getTime()) && !isNaN(bDate.getTime())) {
          const comparison = aDate.getTime() - bDate.getTime();
          return store.currentSortDir === 'desc' ? -comparison : comparison;
        }
      }

      // Fallback to string comparison
      const aStr = String(aValue || '');
      const bStr = String(bValue || '');
      const comparison = aStr.localeCompare(bStr);
      return store.currentSortDir === 'desc' ? -comparison : comparison;
    });
  }
  
  const selectedAccount = store.loans.find(
    (l) => l.AccountNumber === store.selectedAccountNo && l.LoanSequence === store.selectedAccountLoanSequence
  );
  
  return (
    <div className="space-y-6 p-6">
      <AccountCard
        accounts={store.loans}
        selectedAccount={selectedAccount}
        onAccountSelect={handleAccountSelect}
        onAccountDoubleClick={handleAccountDoubleClick}
        currentSort={store.currentAccountSort}
        currentSortDir={store.currentAccountDir}
        onSort={handleAccountSort}
        showAll={store.showAllAccount}
        displayShowAllButton={store.displayShowAllAccountButton}
        onToggleShowAll={() => store.toggleShowAllAccount()}
      />
      
      <HistoryCard
        showAll={showAll}
        onToggleShowAll={() => setShowAll(!showAll)}
        history={displayedHistory}
        currentSort={store.currentSort}
        currentSortDir={store.currentSortDir}
        onSort={handleFollowHistorySort}
        onRemarkClick={handleRemarkClick}
        height="h-full"
        readOnly={true}
      />
      
      <FollowHistoryDialog
        open={remarkDialogOpen}
        onOpenChange={setRemarkDialogOpen}
        remark={selectedRemark}
      />
    </div>
  );
}

