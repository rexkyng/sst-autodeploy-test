import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AccountCard } from "@/components/card/account-card";
import { ReminderHistoryTable } from "@/components/tables/reminder-history-table";
import { useCRMStore } from "@/store/crm-store";
import { DebtorInformationTable } from "@/components/tables/debtor-information-table";

interface ReminderHistoryPageProps {
	onNavigateToAccountDetail?: () => void;
}

export function ReminderHistoryPage({
	onNavigateToAccountDetail,
}: ReminderHistoryPageProps) {
	const store = useCRMStore();

	const handleAccountSelect = (account: any) => {
		store.setSelectedAccount(
			account.AccountNumber,
			account.LoanSequence,
			account
		);
	};

	const handleAccountDoubleClick = (account: any) => {
		handleAccountSelect(account);
		onNavigateToAccountDetail?.();
	};

	const handleDebtorSelect = (debtor: any) => {
		store.setSelectedDebtor(debtor);
	};

	const handleAccountSort = (field: string) => {
		store.updateSort(field, "account");
	};

	const selectedAccount = store.loans.find(
		(l) =>
			l.AccountNumber === store.selectedAccountNo &&
			l.LoanSequence === store.selectedAccountLoanSequence
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

			<Card className="w-full">
				<CardHeader>
					<CardTitle>Debtors</CardTitle>
				</CardHeader>
				<CardContent>
					<DebtorInformationTable debtors={store.debtors} />
				</CardContent>
			</Card>

			<Card className="w-full">
				<CardHeader>
					<CardTitle>Reminder History</CardTitle>
				</CardHeader>
				<CardContent>
					<ReminderHistoryTable history={store.reminderHistory} />
				</CardContent>
			</Card>
		</div>
	);
}
