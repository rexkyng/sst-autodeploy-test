import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useCRMStore } from "@/store/crm-store";
import { getDate } from "@/lib/formatters";

export function ActionPanels() {
	const store = useCRMStore();
	const actionList = store.actionList;

	const bankInMethodCodes = Array.isArray(store.bankInMethodCodes)
		? store.bankInMethodCodes
		: (Object.values(store.bankInMethodCodes || {}) as any[]);
	const bankAccountCodes = Array.isArray(store.bankAccountCodes)
		? store.bankAccountCodes
		: (Object.values(store.bankAccountCodes || {}) as any[]);
	const actionCodes = Array.isArray(store.actionCodes)
		? store.actionCodes
		: (Object.values(store.actionCodes || {}) as any[]);
	const followStatusCodes = Array.isArray(store.followStatusCodes)
		? store.followStatusCodes
		: (Object.values(store.followStatusCodes || {}) as any[]);

	const updateActionList = (updates: any) => {
		store.updateActionList(updates);
	};

	const handleRemarkKey = (field: "SpecialRemark" | "CentreRemark") => {
		const date = getDate();
		const currentValue = actionList[field] || "";
		const newValue = `${date}\n${currentValue}`;
		updateActionList({ [field]: newValue });
	};

	return (
		<div className="space-y-4">
			<Card>
				<CardHeader>
					<CardTitle>Follow Result</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="flex items-center gap-4">
						<Label>Follow Status</Label>
						<Select
							value={actionList.FollowStatusCodeId || ""}
							onValueChange={(value) =>
								updateActionList({ FollowStatusCodeId: value })
							}
						>
							<SelectTrigger>
								<SelectValue placeholder="Select status" />
							</SelectTrigger>
							<SelectContent>
								{followStatusCodes.map((code) => (
									<SelectItem key={code.Id} value={code.Id}>
										{code.Code} - {code.Description}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div className="space-y-2">
						<Label>Call Memo</Label>
						<Textarea
							value={actionList.CallMemo || ""}
							onChange={(e) =>
								updateActionList({ CallMemo: e.target.value })
							}
							rows={4}
						/>
					</div>

					<div className="space-y-4 pt-4 border-t">
						<h3 className="text-sm font-semibold">BI Remark</h3>
						<div className="grid grid-cols-4 gap-4 p-2">
							<div className="space-y-2 col-span-2">
								<Label>Amt</Label>
								<Input
									type="number"
									value={actionList.BankInAmount || ""}
									onChange={(e) =>
										updateActionList({
											BankInAmount:
												parseFloat(e.target.value) ||
												null,
										})
									}
								/>
							</div>
							<div className="space-y-2">
								<Label>Bank In Method</Label>
								<Select
									value={actionList.BankInMethodCodeId || ""}
									onValueChange={(value) =>
										updateActionList({
											BankInMethodCodeId: value,
										})
									}
								>
									<SelectTrigger>
										<SelectValue placeholder="Select method" />
									</SelectTrigger>
									<SelectContent>
										{bankInMethodCodes.map((code) => (
											<SelectItem
												key={code.Id}
												value={code.Id}
											>
												{code.Code} - {code.Description}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
							<div className="space-y-2">
								<Label>Bank A/C</Label>
								<Select
									value={actionList.BankAccountId || ""}
									onValueChange={(value) =>
										updateActionList({
											BankAccountId: value,
										})
									}
								>
									<SelectTrigger>
										<SelectValue placeholder="Select account" />
									</SelectTrigger>
									<SelectContent>
										{bankAccountCodes.map((code) => (
											<SelectItem
												key={code.Id}
												value={code.Id}
											>
												{code.Code} - {code.Description}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						</div>
						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label>Date</Label>
								<Input
									type="text"
									value={actionList.BankInDate || ""}
									onChange={(e) =>
										updateActionList({
											BankInDate: e.target.value,
										})
									}
								/>
							</div>

							<div className="space-y-2">
								<Label>Receipt No</Label>
								<Input
									value={actionList.BankInRecepitNumber || ""}
									onChange={(e) =>
										updateActionList({
											BankInRecepitNumber: e.target.value,
										})
									}
								/>
							</div>
						</div>

						<div className="space-y-2">
							<Label>BI Remark</Label>
							<Textarea
								value={actionList.BankInRemark || ""}
								onChange={(e) =>
									updateActionList({
										BankInRemark: e.target.value,
									})
								}
								rows={2}
							/>
						</div>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Actions</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 gap-y-4">
						{/* Recommend send to CCD */}
						<div className="flex items-center gap-4">
							<Label className="w-56 min-w-[10rem]">Recommend send to CCD</Label>
							<Select value={actionList.RecommendSendToCCDCode || "none"} onValueChange={(value) => updateActionList({ RecommendSendToCCDCode: value === "none" ? "" : value })}>
								<SelectTrigger className="min-w-[360px]">
									<SelectValue placeholder="Select action" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="none">-</SelectItem>
									{actionCodes.filter(code => code.ActionTypeId === 7 && code.Enabled).map(code => (
										<SelectItem key={code.Id} value={code.Id}>{code.Name}</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						{/* Send SMS */}
						<div className="flex items-center gap-4">
							<Label className="w-56 min-w-[10rem]">Send SMS</Label>
							<Select value={actionList.SendSMSCode || "none"} onValueChange={(value) => updateActionList({ SendSMSCode: value === "none" ? "" : value })}>
								<SelectTrigger className="min-w-[180px]">
									<SelectValue placeholder="Select action" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="none">-</SelectItem>
									{actionCodes.filter(code => code.ActionTypeId === 1 && code.Enabled).map(code => (
										<SelectItem key={code.Id} value={code.Id}>{code.Name}</SelectItem>
									))}
								</SelectContent>
							</Select>
							<Input className="w-[165px]" value={actionList.SMSPhoneNumber || ""} onChange={(e) => updateActionList({ SMSPhoneNumber: e.target.value })} />
						</div>

						{/* Review Check TU */}
						<div className="flex items-center gap-4">
							<Label className="w-56 min-w-[10rem]">Review Check TU</Label>
							<Select value={actionList.ReviewCheckActionCode || "none"} onValueChange={(value) => updateActionList({ ReviewCheckActionCode: value === "none" ? "" : value })}>
								<SelectTrigger className="min-w-[360px]">
									<SelectValue placeholder="Select action" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="none">-</SelectItem>
									{actionCodes.filter(code => code.ActionTypeId === 6 && code.Enabled).map(code => (
										<SelectItem key={code.Id} value={code.Id}>{code.Name}</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						{/* Send Reminder(Local Address) */}
						<div className="flex items-center gap-4">
							<Label className="w-56 min-w-[10rem]">Send Reminder(Local Address)</Label>
							<Select value={actionList.SendReminderLocalAddressActionCode || "none"} onValueChange={(value) => updateActionList({ SendReminderLocalAddressActionCode: value === "none" ? "" : value })}>
								<SelectTrigger className="min-w-[360px]">
									<SelectValue placeholder="Select action" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="none">-</SelectItem>
									{actionCodes.filter(code => code.ActionTypeId === 2 && code.Enabled).map(code => (
										<SelectItem key={code.Id} value={code.Id}>{code.Name}</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						{/* Send Reminder(Oversea Address) */}
						<div className="flex items-center gap-4">
							<Label className="w-56 min-w-[10rem]">Send Reminder(Oversea Address)</Label>
							<Select value={actionList.SendReminderOverseaAddressActionCode || "none"} onValueChange={(value) => updateActionList({ SendReminderOverseaAddressActionCode: value === "none" ? "" : value })}>
								<SelectTrigger className="min-w-[360px]">
									<SelectValue placeholder="Select action" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="none">-</SelectItem>
									{actionCodes.filter(code => code.ActionTypeId === 3 && code.Enabled).map(code => (
										<SelectItem key={code.Id} value={code.Id}>{code.Name}</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						{/* Site Visit */}
						<div className="flex items-center gap-4">
							<Label className="w-56 min-w-[10rem]">Site Visit</Label>
							<Select value={actionList.SiteVisitActionCode || "none"} onValueChange={(value) => updateActionList({ SiteVisitActionCode: value === "none" ? "" : value })}>
								<SelectTrigger className="min-w-[360px]">
									<SelectValue placeholder="Select action" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="none">-</SelectItem>
									{actionCodes.filter(code => code.ActionTypeId === 4 && code.Enabled).map(code => (
										<SelectItem key={code.Id} value={code.Id}>{code.Name}</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						{/* Other Action */}
						<div className="flex items-center gap-4">
							<Label className="w-56 min-w-[10rem]">Other Action</Label>
							<Select value={actionList.OtherActionCode || "none"} onValueChange={(value) => updateActionList({ OtherActionCode: value === "none" ? "" : value })}>
								<SelectTrigger className="min-w-[360px]">
									<SelectValue placeholder="Select action" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="none">-</SelectItem>
									{actionCodes.filter(code => code.ActionTypeId === 5 && code.Enabled).map(code => (
										<SelectItem key={code.Id} value={code.Id}>{code.Name}</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

					</div>
				</CardContent>
			</Card>
		</div>
	);
}
