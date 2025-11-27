import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, ExternalLink, Phone, MessageSquare, Plus } from "lucide-react";
import { useCRMStore } from "@/store/crm-store";
import { EditNicknameDialog } from "@/components/dialogs/edit-nickname-dialog";
import { AddPhoneDialog } from "@/components/dialogs/add-phone-dialog";
import { EditPhoneDialog } from "@/components/dialogs/edit-phone-dialog";
import { toLocaleString, toHKD } from "@/lib/formatters";
import { checkSLAccount } from "@/lib/utils/array-extensions";
import {
	StartIE,
	Dial,
	MediaSmsCreateNewOutboundPageMode,
} from "@/lib/external-integrations";
import { crmAPI } from "@/api/crm-api";
import { getQueryStringObject } from "@/lib/query-string";

export function CustomerInfoPanel() {
	const store = useCRMStore();
	const [nicknameDialogOpen, setNicknameDialogOpen] = useState(false);
	const [addPhoneDialogOpen, setAddPhoneDialogOpen] = useState(false);
	const [addPhoneType, setAddPhoneType] = useState(0);
	const [editPhoneDialogOpen, setEditPhoneDialogOpen] = useState(false);

	const customer = store.customer;
	const loans = store.loans;
	const customerPhone = store.customerPhone;
	const mobilePhones = store.mobilePhones;
	const customerBusinesses = store.customerBusinessesForEdit || [];
	const customerResidentials = store.customerResidentialsForEdit || [];

	// Calculate statistics
	const displayLoans = loans.filter(checkSLAccount);
	const activeAccounts = displayLoans.length;
	const odAccounts = loans.filter((l) => l.OverdueDay > 0).length; // Count from all loans to match WebUI
	const totalODAmount = loans.reduce(
		(sum, l) =>
			sum +
			(l.NetOverdueAmount || 0) +
			(l.LateCharge || 0) +
			(l.AdminCharge || 0) +
			(l.AnnualCharge || 0),
		0
	); // Count from all loans to match WebUI

	const handleShortcut = async (type: string) => {
		const querystring = getQueryStringObject();
		const tenantName = querystring.TenantName || "uaf_dc";

		try {
			const storedProcName =
				tenantName === "uaf_cs" ? "cic_cs_get_url" : "cic_get_url";

			const result = await crmAPI.executeStoredProcedure({
				Provider: tenantName,
				Command: {
					Text: storedProcName,
					Type: "StoredProcedure",
					Parameters: [
						{ value: type },
						{ value: store.customer.NationalIdType },
						{ value: store.customer.NationalId },
					],
				},
			});

			if (result.Result?.Table?.[0]?.URL) {
				StartIE(result.Result.Table[0].URL);
			}
		} catch (error) {
			console.error("Failed to get shortcut URL:", error);
		}
	};

	const handleDial = (phoneNumber: string) => {
		Dial(phoneNumber);
	};

	const handleSMS = (phoneNumber: string) => {
		MediaSmsCreateNewOutboundPageMode(phoneNumber);
	};

	const handleEditPhone = (phone: any) => {
		store.setPhoneState({
			selectedPhoneId: phone.Id,
			selectedPhoneNo: phone.PhoneNumber,
			selectedPhoneType: phone.PhoneType?.toString(),
			selectedPhoneCountryCode: phone.PhoneCountryCode,
			selectedPhoneExtension: phone.PhoneExtension,
			selectedRole: phone.Role,
			editPhoneInvalidReason: phone.PhoneInvalidReason,
		});
		setEditPhoneDialogOpen(true);
	};

	const handleAddPhone = (phoneType: number) => {
		setAddPhoneType(phoneType);
		setAddPhoneDialogOpen(true);
	};

	const formatPhoneDisplay = (phone: any) => {
		const country = phone.PhoneCountryCode
			? `(${phone.PhoneCountryCode}) `
			: "() ";
		const number = phone.PhoneNumber ?? "";
		const extension = phone.PhoneExtension
			? `-${phone.PhoneExtension}`
			: "";
		const invalidReason = phone.PhoneInvalidReason
			? ` <${phone.PhoneInvalidReason}>`
			: "";

		return `${country}${number}${extension}${invalidReason}`.trim();
	};

	// Group phones by type
	const mobileNumbers = [
		...mobilePhones
			.filter((m) => m.mobile)
			.map((m) => ({ PhoneNumber: m.mobile, source: "customer" })),
		...customerPhone.filter(
			(p) =>
				p.PhoneType === 4 &&
				(!p.AccountNumber || p.AccountNumber === "") &&
				p.CustomerId === customer.Id
		),
	];

	const businessPhones = [
		...customerBusinesses
			.filter((b: any) => b.PhoneNumber)
			.map((b: any) => ({
				PhoneNumber: b.PhoneNumber,
				source: "business",
			})),
		...customerPhone.filter(
			(p) =>
				(p.PhoneType === 2 || p.PhoneType === 3) &&
				(!p.AccountNumber || p.AccountNumber === "") &&
				p.CustomerId === customer.Id
		),
	];

	const residentialPhones = [
		...customerResidentials
			.filter((r: any) => r.PhoneNumber)
			.map((r: any) => ({
				PhoneNumber: r.PhoneNumber,
				source: "residential",
			})),
		...customerPhone.filter(
			(p) =>
				p.PhoneType === 1 &&
				(!p.AccountNumber || p.AccountNumber === "") &&
				p.CustomerId === customer.Id
		),
	];

	const pagerNumbers = [
		customer.PagerNumber
			? { PhoneNumber: customer.PagerNumber, source: "customer" }
			: null,
		...customerPhone.filter(
			(p) =>
				p.PhoneType === 6 &&
				(!p.AccountNumber || p.AccountNumber === "") &&
				p.CustomerId === customer.Id
		),
	].filter(Boolean);

	const otherPhones = [
		customer.OtherPhoneNumber
			? { PhoneNumber: customer.OtherPhoneNumber, source: "customer" }
			: null,
		...customerPhone.filter(
			(p) =>
				p.PhoneType === 0 &&
				(!p.AccountNumber || p.AccountNumber === "") &&
				p.CustomerId === customer.Id
		),
	].filter(Boolean);

	const PhoneList = ({
		title,
		phones,
		phoneType,
	}: {
		title: string;
		phones: any[];
		phoneType: number;
	}) => (
		<div className="flex h-full flex-col space-y-2">
			<div className="flex items-center justify-between">
				<h4 className="text-sm font-medium">{title}</h4>
				<Button
					variant="ghost"
					size="sm"
					className="text-green-500"
					onClick={() => handleAddPhone(phoneType)}
				>
					<Plus className="h-3 w-3" />
				</Button>
			</div>
			{phones.length === 0 ? (
				<div className="flex-1 pl-2 text-sm text-muted-foreground">
					No phones
				</div>
			) : (
				<div className="flex-1 space-y-1">
					{phones.map((phone, index) => (
						<div
							key={index}
							className="flex items-center gap-2 text-sm pl-2"
						>
								<span className="flex-1">
									{formatPhoneDisplay(phone)}
								</span>
							<Button
								variant="ghost"
								size="sm"
								className="h-6 w-6 p-0"
								onClick={() => handleDial(phone.PhoneNumber)}
							>
								<Phone className="h-3 w-3" />
							</Button>
							{/* check if phoneType is not residential nor pager */}
							{phoneType !== 1 && phoneType !== 6 && (
								<Button
									variant="ghost"
									size="sm"
									className="h-6 w-6 p-0"
									onClick={() => handleSMS(phone.PhoneNumber)}
								>
									<MessageSquare className="h-3 w-3" />
								</Button>
							)}
							 
							{phone.Id && (
								<Button
									variant="ghost"
									size="sm"
									className="h-6 w-6 p-0"
									onClick={() => handleEditPhone(phone)}
								>
									<Edit className="h-3 w-3" />
								</Button>
							)}
						</div>
					))}
				</div>
			)}
		</div>
	);

	return (
		<>
			<Card>
				<CardHeader>
					<CardTitle>Customer Information</CardTitle>
				</CardHeader>
				<CardContent className="space-y-1">
					<div className="grid grid-cols-3 gap-4 bg-muted rounded-lg p-2">
						<div>
							<div className="text-sm text-muted-foreground">
								Active A/C
							</div>
							<div className="text-2xl font-bold">
								{activeAccounts}
							</div>
						</div>
						<div>
							<div className="text-sm text-red-500">OD A/C</div>
							<div className="text-2xl font-bold text-red-500">
								{odAccounts}
							</div>
						</div>
						<div>
							<div className="text-sm text-muted-foreground">
								OD Amt
							</div>
							<div className="text-2xl font-bold">
								{toHKD(totalODAmount)}
							</div>
						</div>
					</div>

					<div className="space-y-2">
						<div className="grid grid-cols-2 gap-4">
							<div>
								<span className="font-medium">
									English Name:{" "}
								</span>
								<span>
									{customer.Surname} {customer.GivenName}
								</span>
							</div>
							<div>
								<span className="font-medium">
									Chinese Name:{" "}
								</span>
								<span>
									{customer.SurnameChinese}
									{customer.GivenNameChinese}
								</span>
							</div>
						</div>
						<div>
							<span className="font-medium">Language: </span>
							<span>{customer.Language || ""}</span>
						</div>
						<div className="grid grid-cols-2 gap-4">
							<div>
								<span className="font-medium">
									Nick Name (UAF):{" "}
								</span>
								<span>{customer.Nickname || "N/A"}</span>
							</div>
							<div className="flex items-center gap-2">
								<span className="font-medium">
									Nick Name (CRM):{" "}
								</span>
								<span>{store.crmNickName || "N/A"}</span>
								<Button
									variant="ghost"
									size="sm"
									className="text-yellow-500"
									onClick={() => setNicknameDialogOpen(true)}
								>
									<Edit className="h-4 w-4" />
								</Button>
							</div>
						</div>
						{/* <div>
							<span className="font-medium">ID: </span>
							<span>
								{customer.NationalIdType} -{" "}
								{customer.NationalId}
							</span>
						</div> */}
					</div>

					<div className="flex flex-wrap gap-2">
						<Button
							variant="outline"
							size="sm"
							onClick={() => handleShortcut("ecard")}
						>
							<ExternalLink className="h-4 w-4 mr-2" />
							ECard
						</Button>
						<Button
							variant="outline"
							size="sm"
							onClick={() => handleShortcut("high_approval")}
						>
							<ExternalLink className="h-4 w-4 mr-2" />
							High Approval
						</Button>
						<Button
							variant="outline"
							size="sm"
							onClick={() => handleShortcut("seven_eleven")}
						>
							<ExternalLink className="h-4 w-4 mr-2" />
							7-11
						</Button>
					</div>

					<div className="border-t pt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
						<PhoneList
							title="Pager"
							phones={pagerNumbers}
							phoneType={6}
						/>{" "}
						<PhoneList
							title="Business"
							phones={businessPhones}
							phoneType={2}
						/>
						<PhoneList
							title="Mobile"
							phones={mobileNumbers}
							phoneType={4}
						/>
						<PhoneList
							title="Other"
							phones={otherPhones}
							phoneType={0}
						/>
						<PhoneList
							title="Residential"
							phones={residentialPhones}
							phoneType={1}
						/>
					</div>
				</CardContent>
			</Card>

			<EditNicknameDialog
				open={nicknameDialogOpen}
				onOpenChange={setNicknameDialogOpen}
			/>

			<AddPhoneDialog
				open={addPhoneDialogOpen}
				onOpenChange={setAddPhoneDialogOpen}
				phoneType={addPhoneType}
			/>

			<EditPhoneDialog
				open={editPhoneDialogOpen}
				onOpenChange={setEditPhoneDialogOpen}
			/>
		</>
	);
}
