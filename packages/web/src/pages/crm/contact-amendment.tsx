import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AccountCard } from "@/components/card/account-card";
import { DebtorTable } from "@/components/tables/debtor-table";
import { ContactAmendmentTable } from "@/components/tables/contact-amendment-table";
import { useCRMStore } from "@/store/crm-store";

interface ContactAmendmentPageProps {
  onNavigateToAccountDetail?: () => void;
}

export function ContactAmendmentPage({ onNavigateToAccountDetail }: ContactAmendmentPageProps) {
  const store = useCRMStore();
  
  const handleAccountSelect = (account: any) => {
    store.setSelectedAccount(account.AccountNumber, account.LoanSequence, account);
  };
  
  const handleAccountDoubleClick = (account: any) => {
    handleAccountSelect(account);
    onNavigateToAccountDetail?.();
  };
  
  const handleDebtorSelect = (debtor: any) => {
    store.setSelectedDebtor(debtor);
  };
  
  
  const selectedAccount = store.loans.find(
    (l) => l.AccountNumber === store.selectedAccountNo && l.LoanSequence === store.selectedAccountLoanSequence
  );

  // Filter debtors based on selected account
  const accountDebtors = selectedAccount?.Debtors || [];

  // Filter customer phone data for the selected account's debtors
  const accountCustomerPhones = store.customerPhone.filter(phone => {
    return accountDebtors.some(debtor => debtor.CustomerId === phone.CustomerId);
  });

  return (
    <div className="space-y-6 p-6">
      <AccountCard
        accounts={store.loans}
        selectedAccount={selectedAccount}
        onAccountSelect={handleAccountSelect}
        onAccountDoubleClick={handleAccountDoubleClick}
        showAll={store.showAllAccount}
        displayShowAllButton={store.displayShowAllAccountButton}
        onToggleShowAll={() => store.toggleShowAllAccount()}
      />

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Debtors</CardTitle>
        </CardHeader>
        <CardContent>
          <DebtorTable
            debtors={accountDebtors}
            selectedDebtor={store.selectedDebtor}
            onDebtorSelect={handleDebtorSelect}
            customerPhone={accountCustomerPhones}
          />
        </CardContent>
      </Card>
      
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Contact Amendment History</CardTitle>
        </CardHeader>
        <CardContent>
          <ContactAmendmentTable history={store.contactAmendmentHistory} />
        </CardContent>
      </Card>
    </div>
  );
}

