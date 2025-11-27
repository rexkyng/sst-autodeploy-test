import { useMemo } from "react";
import type { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AccountCard } from "@/components/card/account-card";
import { BusinessInformationCard } from "@/components/card/business-information-card";
import { ResidentialInformationCard } from "@/components/card/residential-information-card";
import { DebtorInformationTable } from "@/components/tables/debtor-information-table";
import { useCRMStore } from "@/store/crm-store";
import { useDebtorSelection } from "@/hooks/use-debtor-selection";
import { formatDate2, toHKD } from "@/lib/formatters";
import type { Debtor, CustomerInfo } from "@openauth/core/models";
import type { CustomerBusiness } from "@/components/card/business-information-card";
import type { CustomerResidential, DebtorCustomerInfo } from "@/components/card/residential-information-card";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface CustomerDetailPageProps {
	onNavigateToAccountDetail?: () => void;
}

export function CustomerDetailPage({
	onNavigateToAccountDetail,
}: CustomerDetailPageProps) {
	const store = useCRMStore();
	const { selectDebtor } = useDebtorSelection();

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

	const handleAccountSort = (field: string) => {
		store.updateSort(field, "account");
	};

	const handleDebtorSelect = async (debtor: Debtor) => {
		await selectDebtor(debtor);
	};

	const selectedAccount = store.loans.find(
		(l) =>
			l.AccountNumber === store.selectedAccountNo &&
			l.LoanSequence === store.selectedAccountLoanSequence
	);

	const customer = store.customer;
	const selectedDebtor = store.selectedDebtor;
	const customerInfo = (selectedDebtor?.CustomerInfo ??
		{}) as DebtorCustomerInfo;

	const { businessRecords, residentialRecords, hasOwlInfo } = useMemo(() => {
		const businesses =
			(customerInfo.CustomerBusinesses &&
			customerInfo.CustomerBusinesses.length > 0
				? customerInfo.CustomerBusinesses
				: customer.CustomerBusinesses) ?? [];
		const residentials =
			(customerInfo.CustomerResidentials &&
			customerInfo.CustomerResidentials.length > 0
				? customerInfo.CustomerResidentials
				: customer.CustomerResidentials) ?? [];
		const owlInfoPresent = Boolean(
			customerInfo?.Id ||
				customerInfo?.OverseasWorkerLoanAddress ||
				customerInfo?.OverseasWorkerLoanDependantName ||
				customerInfo?.OverseasWorkerLoanEmployerName ||
				customerInfo?.OverseasWorkerLoanEmployerPhone ||
				customerInfo?.OverseasWorkerLoanPhoneNumber ||
				customerInfo?.OverseasWorkerLoanRelationship
		);

		return {
			businessRecords: businesses,
			residentialRecords: residentials,
			hasOwlInfo: owlInfoPresent,
		};
	}, [
		customer.CustomerBusinesses,
		customer.CustomerResidentials,
		customerInfo,
	]);

	const englishName = buildName(
		customerInfo?.Surname,
		customerInfo?.GivenName
	);
	const chineseName = buildName(
		customerInfo?.SurnameChinese,
		customerInfo?.GivenNameChinese
	);
	const nationalId =
		customerInfo?.NationalId
	const nationalIdType =
		customerInfo?.NationalIdType
	const email =
		customerInfo?.Email
	const dateOfBirth =
		customerInfo?.DateOfBirth
	const summaryFields = [
		{ label: "English Name", value: englishName },
		{ label: "Chinese Name", value: chineseName, muted: true },
		{ label: "ID", value: nationalId },
		{ label: "ID Type", value: nationalIdType },
		{
			label: "Partial Match",
			value: formatBoolean(customerInfo?.PartialIdMatched),
		},
		{
			label: "Date of Match",
			value: customerInfo?.DateOfMatch
				? formatDate2(customerInfo.DateOfMatch)
				: undefined,
		},
		{ label: "Nationality", value: customerInfo?.Nationality },
		{ label: "Marital Status", value: customerInfo?.MaritalStatus },
		{
			label: "DOB",
			value: dateOfBirth ? formatDate2(dateOfBirth) : undefined,
		},
		// { label: "Email", value: email },
	];

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

			<Card>
				<CardContent>
					<DebtorInformationTable
						debtors={store.debtors}
						reference={true}
						selectedDebtor={selectedDebtor as Debtor}
						onDebtorSelect={handleDebtorSelect}
					/>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Customer Information</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
						{summaryFields.map((field, index) => (
							<InfoField
								key={index}
								label={field.label}
								value={field.value}
								muted={field.muted}
							/>
						))}
					</div>
				</CardContent>
			</Card>

			<ResidentialInformationCard
				residentialRecords={residentialRecords}
				hasOwlInfo={hasOwlInfo}
				customerInfo={customerInfo}
				email={email}
			/>

			<BusinessInformationCard businessRecords={businessRecords} />
		</div>
	);
}

function buildName(surname?: string | null, given?: string | null) {
	const parts = [surname, given].filter((part): part is string =>
		Boolean(part && part.trim().length > 0)
	);
	return parts.length > 0 ? parts.join(" ") : undefined;
}

function formatBoolean(value?: string | boolean | null) {
	if (value === null || typeof value === "undefined") {
		return "-";
	}

	if (typeof value === "boolean") {
		return value ? "Yes" : "No";
	}

	const normalized = value.toString().toLowerCase();
	if (["true", "1", "y", "yes"].includes(normalized)) {
		return "Yes";
	}
	if (["false", "0", "n", "no"].includes(normalized)) {
		return "No";
	}
	return value;
}

interface InfoFieldProps {
	label: string;
	value?: ReactNode;
	muted?: boolean;
	className?: string;
}

function InfoField({ label, value, muted, className }: InfoFieldProps) {
	return (
		<div className={cn("flex gap-2 items-start", className)}>
			<Label className="text-xs font-medium uppercase tracking-wide text-muted-foreground min-w-[120px] flex-shrink-0">
				{label}:
			</Label>
			<div
				className={cn(
					"text-sm whitespace-pre-wrap break-words flex-1",
					muted ? "text-muted-foreground" : "text-foreground"
				)}
			>
				{getDisplayValue(value)}
			</div>
		</div>
	);
}

function getDisplayValue(value?: ReactNode) {
	if (value === null || typeof value === "undefined") {
		return "-";
	}

	if (typeof value === "string") {
		return value.trim().length > 0 ? value : "-";
	}

	return value;
}
