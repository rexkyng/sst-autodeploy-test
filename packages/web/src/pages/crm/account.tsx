import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AccountDetailsCard } from "@/components/card/account-details-card";
import { useCRMStore } from "@/store/crm-store";
import { checkSLAccount } from "@/lib/utils/array-extensions";
import { AccountCard } from "@/components/card/account-card";

interface AccountDetailPageProps {
  onNavigateToAccountDetail?: () => void;
}

export function AccountDetailPage({ onNavigateToAccountDetail: _onNavigateToAccountDetail }: AccountDetailPageProps) {
  const store = useCRMStore();

  const handleAccountSelect = (account: any) => {
    store.setSelectedAccount(account.AccountNumber, account.LoanSequence, account);
    if (account.Debtors && account.Debtors.length > 0) {
      store.setSelectedDebtor(account.Debtors[0]);
      store.setSearchCriteria({ debtors: account.Debtors });
    }
  };

  const handleAccountDoubleClick = (account: any) => {
    handleAccountSelect(account);
    // Already on account detail page, so just select the account
  };

  const handleDebtorSelect = (debtor: any) => {
    store.setSelectedDebtor(debtor);
  };

  const handleAccountSort = (field: string) => {
    store.updateSort(field, "account");
  };


  const selectedAccount = store.loans.find(
    (l) => l.AccountNumber === store.selectedAccountNo && l.LoanSequence === store.selectedAccountLoanSequence
  ) || store.loans[0];

  /* Show account details for all displayed accounts (respects showAll toggle) */
  const displayedAccounts = store.showAllAccount ? store.loans : store.loans.filter(checkSLAccount);

  return (
    <div className="space-y-4 p-4">
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

      {displayedAccounts.map((account) => (
        <AccountDetailsCard key={`${account.AccountNumber}-${account.LoanSequence}`} account={account} />
      ))}

    </div>
  );
}

