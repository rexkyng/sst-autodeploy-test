import React, { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AccountCard } from "@/components/card/account-card";
import { ReferenceListDebtorTable } from "@/components/tables/reference-list-debtor-table";
import { ReferenceTable } from "@/components/tables/reference-table";
import { SpouseInformationCard } from "@/components/card/spouse-information-card";
import { useCRMStore } from "@/store/crm-store";
import { useDebtorSelection } from "@/hooks/use-debtor-selection";

interface ReferenceListPageProps {
  onNavigateToAccountDetail?: () => void;
}

export function ReferenceListPage({ onNavigateToAccountDetail }: ReferenceListPageProps) {
  const store = useCRMStore();
  const { selectDebtor } = useDebtorSelection();

  const handleAccountSelect = async (account: any) => {
    store.setSelectedAccount(account.AccountNumber, account.LoanSequence, account);
    if (account.Debtors && account.Debtors.length > 0) {
      await selectDebtor(account.Debtors[0]);
      store.setSearchCriteria({
        debtors: account.Debtors,
        references: account.Debtors[0].References || [],
      });
    }
  };

  const handleAccountDoubleClick = async (account: any) => {
    await handleAccountSelect(account);
    onNavigateToAccountDetail?.();
  };

  const handleDebtorSelect = async (debtor: any) => {
    await selectDebtor(debtor);
    store.setSearchCriteria({ references: debtor.References || [] });
  };
  
  const handleAccountSort = (field: string) => {
    store.updateSort(field, "account");
  };
  
  const selectedAccount = store.loans.find(
    (l) => l.AccountNumber === store.selectedAccountNo && l.LoanSequence === store.selectedAccountLoanSequence
  );
  
  return (
    <div className="space-y-2 p-2">
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

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Debtors</CardTitle>
        </CardHeader>
        <CardContent>
          <ReferenceListDebtorTable
            debtors={store.debtors}
            selectedDebtor={store.selectedDebtor}
            onDebtorSelect={handleDebtorSelect}
          />
        </CardContent>
      </Card>

      {store.selectedDebtor && (
        <SpouseInformationCard
          selectedDebtor={store.selectedDebtor}
          customerPhone={store.customerPhone}
        />
      )}

      <Card className="w-full">
        <CardContent>
          <ReferenceTable
            references={store.references}
            customerPhone={store.customerPhone}
          />
        </CardContent>
      </Card>
    </div>
  );
}

