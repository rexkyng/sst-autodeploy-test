import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { formatDate2 } from "@/lib/formatters";

// Helper component for account detail fields
function AccountDetailField({
	label,
	value,
	className = "",
	inputClassName = "",
	labelColor,
}: {
	label: string;
	value: string | number | undefined;
	className?: string;
	inputClassName?: string;
	labelColor?: string;
}) {
	return (
		<div className={`grid gap-1 ${className}`}>
			<Label className={`text-sm font-medium ${labelColor || ""}`}>
				{label}
			</Label>
			<Input
				value={value || "N/A"}
				readOnly
				className={`bg-muted h-8 text-sm ${inputClassName}`}
			/>
		</div>
	);
}

interface AccountDetailsCardProps {
	account: any;
}

export function AccountDetailsCard({ account }: AccountDetailsCardProps) {
	return (
		<Card>
			<CardContent className="space-y-2 pb-4">
				{/* Section 1: Basic Info (Lines 151-173) */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
					<AccountDetailField
						label="A/C No"
						value={account.AccountNumber + "-" + account.LoanSequence}
						inputClassName="font-medium"
					/>
					<AccountDetailField
						label="Loan Type"
						value={account.LoanType}
					/>
					<div className="grid grid-cols-2 gap-2">
						{/* <AccountDetailField
							label="Group"
							value={account.Group}
						/> */}
						<AccountDetailField label="Role" value={account.Role} />
					</div>
					{/* <AccountDetailField
						label="Campaign Type"
						value={account.CampaignType}
					/> */}
				</div>

				{/* Section 2: Financial Amounts (Lines 174-193) */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
					<AccountDetailField
						label="Loan Amt"
						value={
							account.LoanAmount
								? `$${account.LoanAmount.toLocaleString()}`
								: undefined
						}
					/>
					<AccountDetailField
						label="IF Amt"
						value={
							account.IfAmount
								? `$${account.IfAmount.toLocaleString()}`
								: undefined
						}
					/>
					<AccountDetailField
						label="Loan Bal"
						value={
							account.LoanBalance
								? `$${account.LoanBalance.toLocaleString()}`
								: undefined
						}
					/>
					<AccountDetailField
						label="Loan Date"
						value={
							account.LoanDate
								? formatDate2(account.LoanDate)
								: undefined
						}
					/>
				</div>

				{/* Section 3: Payment Info (Lines 194-214) */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
					<AccountDetailField
						label="Installment"
						value={account.TotalNumberOfInstallment}
					/>
					<AccountDetailField
						label="Inst Paid"
						value={account.TotalNumberOfPaidInstallment}
					/>
					<AccountDetailField
						label="Inst. Amt/ Min Pay"
						value={
							account.InstallmentAmount
								? `$${account.InstallmentAmount.toLocaleString()}${
										account.InstallmentAmountMinPaid
											? ` / $${account.InstallmentAmountMinPaid.toLocaleString()}`
											: ""
								  }`
								: undefined
						}
					/>
					<AccountDetailField
						label="Ln Status"
						value={account.LoanStatus}
					/>
				</div>

				<Separator className="my-2" />

				{/* Section 4: Dates and Status (Lines 217-236) */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
					<AccountDetailField
						label="Expiry Date"
						value={
							account.LoanExpiryDate
								? formatDate2(account.LoanExpiryDate)
								: undefined
						}
					/>
					<AccountDetailField
						label="Cut off Date"
						value={
							account.CutOffDate
								? formatDate2(account.CutOffDate)
								: undefined
						}
					/>
					<AccountDetailField
						label="Next Due Date"
						value={
							account.NextDueDate
								? formatDate2(account.NextDueDate)
								: undefined
						}
					/>
					<AccountDetailField
						label="PD Status"
						value={account.PdStatus}
					/>
				</div>

				{/* Section 5: Payment History (Lines 237-258) */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
					<AccountDetailField
						label="Last Pay Date"
						value={
							account.LastPayDate
								? formatDate2(account.LastPayDate)
								: undefined
						}
					/>
					<AccountDetailField
						label="Last Pay Amt."
						value={
							account.LastPayAmount
								? `$${account.LastPayAmount.toLocaleString()}`
								: undefined
						}
					/>
					<AccountDetailField
						label="ES Amt"
						value={
							account.EarlySettleAmount
								? `$${account.EarlySettleAmount.toLocaleString()}`
								: undefined
						}
					/>
					<AccountDetailField
						label="Rpy Method"
						value={account.RepayMethod}
					/>
				</div>

				{/* Section 6: Additional Info (Lines 259-281) */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
					<AccountDetailField
						label="Reject Reason"
						value={account.RejectReason}
					/>
					{/* <AccountDetailField label="Score" value={account.Score} /> */}
					<AccountDetailField
						label="Last Pay Method"
						value={account.LastRepayMethod}
					/>
					<AccountDetailField
						label="Ttl Defer Day"
						value={account.DeferDay}
					/>
					<AccountDetailField
						label="Direct Sales Referral"
						value={account.DirectSalesReferral}
					/>
					{/* <AccountDetailField
						label="Follow Status"
						value={account.FollowStatus}
					/>
					<AccountDetailField
						label="Detention Day"
						value={account.DetentionDay}
					/> */}
				</div>

				{/* Section 7: DI and Deferral (Lines 282-305) */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
					<AccountDetailField
						label="DI Rate"
						value={account.DiRate}
					/>
					<AccountDetailField
						label="Wavied AC"
						value={account.WaivedAdminCharge}
					/>
					<AccountDetailField
						label="Wavied LC"
						value={account.WaivedLateCharge}
					/>
					<div className="grid gap-1">
						<Label className="text-sm font-medium">C, C1, C2</Label>
						<div className="flex space-x-1">
							<Input
								value={account.C || "N/A"}
								readOnly
								className="text-sm h-8 w-16 bg-muted"
							/>
							<Input
								value={account.C1 || "N/A"}
								readOnly
								className="text-sm h-8 w-16 bg-muted"
							/>
							<Input
								value={account.C2 || "N/A"}
								readOnly
								className="text-sm h-8 w-16 bg-muted"
							/>
						</div>
					</div>
				</div>

				{/* Section 8: Banking Info (Lines 308-321) */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-2">
					<AccountDetailField
						label="AP Bank A/C No."
						value={account.ApBankAccountNumber}
					/>
					{/* <AccountDetailField
						label="Direct Sales Referral"
						value={account.DirectSalesReferral}
					/> */}
          					<AccountDetailField
						label="E-statement"
						value={account.EStatement}
					/>
				</div>

				{/* <Separator className="my-2" /> */}

				{/* Section 10: Charges (Lines 331-374) */}
				{/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
					<AccountDetailField
						label="Net Overdue Amt"
						value={
							account.NetOverdueAmount
								? `$${account.NetOverdueAmount.toLocaleString()}`
								: undefined
						}
					/>
					<AccountDetailField
						label="Late charge"
						value={
							account.LateCharge
								? `$${account.LateCharge.toLocaleString()}`
								: undefined
						}
					/>
					<AccountDetailField
						label="Admin charge"
						value={
							account.AdminCharge
								? `$${account.AdminCharge.toLocaleString()}`
								: undefined
						}
					/>
					<AccountDetailField
						label="Annual charge"
						value={
							account.AnnualCharge
								? `$${account.AnnualCharge.toLocaleString()}`
								: undefined
						}
					/>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
					<AccountDetailField
						label="Overdue Day"
						value={account.OverdueDay}
					/>
					<AccountDetailField
						label="Other charge"
						value={
							account.OtherCharge
								? `$${account.OtherCharge.toLocaleString()}`
								: undefined
						}
					/>
					<AccountDetailField
						label="Other Fee"
						value={
							account.OtherFee
								? `$${account.OtherFee.toLocaleString()}`
								: undefined
						}
					/>
					<AccountDetailField
						label="Total Amt"
						value={
							account.TotalAmount
								? `$${account.TotalAmount.toLocaleString()}`
								: undefined
						}
					/>
				</div> */}
			</CardContent>
		</Card>
	);
}
