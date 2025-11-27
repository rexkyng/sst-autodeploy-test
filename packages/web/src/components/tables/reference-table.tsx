import React, { useState, useEffect } from "react";
import type { Reference } from "@openauth/core/models";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Phone, Plus, MessageSquare, Edit, Check, X } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface ReferenceTableProps {
	references: Reference[];
	customerPhone?: any[];
	onPhoneAction?: (
		reference: Reference,
		action: "dial" | "add" | "sms" | "edit",
		phoneNumber?: string
	) => void;
}

export function ReferenceTable({
	references,
	customerPhone = [],
	onPhoneAction,
}: ReferenceTableProps) {
	const [selectedPhones, setSelectedPhones] = useState<
		Record<string, string>
	>({});

	// Set default selected phones when references change
	useEffect(() => {
		const newSelectedPhones: Record<string, string> = {};
		references.forEach((reference) => {
			const key = `${reference.Role}-${reference.GivenName}-${reference.Surname}`;
			const phoneOptions = getPhoneOptions(reference);
			if (phoneOptions.length > 0 && !selectedPhones[key]) {
				newSelectedPhones[key] = phoneOptions[0].value;
			}
		});

		if (Object.keys(newSelectedPhones).length > 0) {
			setSelectedPhones((prev) => ({ ...prev, ...newSelectedPhones }));
		}
	}, [references, customerPhone]);

	const getPhoneOptions = (reference: Reference) => {
		const options: Array<{ label: string; value: string; type: string }> =
			[];

		// Add reference phone numbers
		if (reference.BusinessPhoneNumber) {
			options.push({
				label: `B: (${reference.BusinessPhoneCountryCode || ""}) ${
					reference.BusinessPhoneNumber
				}`,
				value: reference.BusinessPhoneNumber,
				type: "BusinessPhone",
			});
		}

		if (reference.ResidentialPhoneNumber) {
			options.push({
				label: `R: (${reference.ResidentialPhoneCountryCode || ""}) ${
					reference.ResidentialPhoneNumber
				}`,
				value: reference.ResidentialPhoneNumber,
				type: "HomePhone",
			});
		}

		if (reference.MobilePhoneNumber) {
			options.push({
				label: `M: (${reference.MobilePhoneCountryCode || ""}) ${
					reference.MobilePhoneNumber
				}`,
				value: reference.MobilePhoneNumber,
				type: "Mobile",
			});
		}

		if (reference.OtherPhoneNumber) {
			options.push({
				label: `O: (${reference.OtherPhoneCountryCode || ""}) ${
					reference.OtherPhoneNumber
				}`,
				value: reference.OtherPhoneNumber,
				type: "NoContactType",
			});
		}

		// Add customer phone numbers that match the role
		customerPhone.forEach((phone) => {
			if (phone.Role === reference.Role) {
				const typeLabel =
					phone.PhoneType === 2
						? "B"
						: phone.PhoneType === 1
						? "R"
						: phone.PhoneType === 4
						? "M"
						: "O";
				options.push({
					label: `${typeLabel}: (${phone.PhoneCountryCode}) ${
						phone.PhoneNumber
					}${phone.PhoneExtension ? `-${phone.PhoneExtension}` : ""}${
						phone.PhoneInvalidReason
							? ` <${phone.PhoneInvalidReason}>`
							: ""
					}`,
					value: phone.PhoneNumber,
					type:
						phone.PhoneType === 2
							? "DirectBusinessPhone"
							: phone.PhoneType === 1
							? "HomePhone"
							: phone.PhoneType === 4
							? "Mobile"
							: "NoContactType",
				});
			}
		});

		return options;
	};

	const handlePhoneAction = (
		reference: Reference,
		action: "dial" | "add" | "sms" | "edit",
		selectedPhone?: string
	) => {
		if (onPhoneAction) {
			onPhoneAction(reference, action, selectedPhone);
		}
	};

	const getSelectedPhone = (reference: Reference) => {
		const key = `${reference.Role}-${reference.GivenName}-${reference.Surname}`;
		return selectedPhones[key] || "";
	};

	const handlePhoneSelect = (reference: Reference, phoneValue: string) => {
		const key = `${reference.Role}-${reference.GivenName}-${reference.Surname}`;
		setSelectedPhones((prev) => ({ ...prev, [key]: phoneValue }));
	};

	return (
		<ScrollArea className="w-full">
			<div className="min-w-max">
				<Table className="w-full min-w-max">
					<TableHeader>
						<TableRow>
							<TableHead className="w-16">Role</TableHead>
							<TableHead className="w-32">English Name</TableHead>
							<TableHead className="w-32">Chinese Name</TableHead>
							<TableHead className="w-12">Age</TableHead>
							<TableHead className="w-24">Relationship</TableHead>
							<TableHead className="w-48">Contacts</TableHead>
							<TableHead className="w-12"></TableHead>
							<TableHead className="w-12"></TableHead>
							<TableHead className="w-12"></TableHead>
							<TableHead className="w-12"></TableHead>
							<TableHead className="w-32">Company Name</TableHead>
							<TableHead className="w-24">Position</TableHead>
							<TableHead className="w-16">Has Loan</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{references.map((reference, index) => {
							const phoneOptions = getPhoneOptions(reference);
							return (
								<TableRow
									key={`${reference.Role}-${reference.GivenName}-${reference.Surname}-${index}`}
								>
									<TableCell className="font-medium">
										{reference.Role}
									</TableCell>
									<TableCell>
										{`${reference.Surname || ""} ${
											reference.GivenName || ""
										}`.trim()}
									</TableCell>
									<TableCell className="text-sm text-muted-foreground">
										{reference.SurnameChinese ||
										reference.GivenNameChinese
											? `${
													reference.SurnameChinese ||
													""
											  }${
													reference.GivenNameChinese ||
													""
											  }`
											: ""}
									</TableCell>
									<TableCell>
										{reference.Age || "-"}
									</TableCell>
									<TableCell>
										{reference.RelationshipCode || "-"}
									</TableCell>
									<TableCell>
										{phoneOptions.length > 0 ? (
											<Select
												value={getSelectedPhone(
													reference
												)}
												onValueChange={(value) =>
													handlePhoneSelect(
														reference,
														value
													)
												}
											>
												<SelectTrigger className="w-full">
													<SelectValue placeholder="Select phone" />
												</SelectTrigger>
												<SelectContent>
													{phoneOptions.map(
														(
															option,
															optionIndex
														) => (
															<SelectItem
																key={
																	optionIndex
																}
																value={
																	option.value
																}
															>
																{option.label}
															</SelectItem>
														)
													)}
												</SelectContent>
											</Select>
										) : (
											<span className="text-muted-foreground">
												No phones
											</span>
										)}
									</TableCell>
									<TableCell>
										<Button
											size="sm"
											variant="outline"
											onClick={() =>
												handlePhoneAction(
													reference,
													"dial",
													getSelectedPhone(reference)
												)
											}
											disabled={phoneOptions.length === 0}
										>
											<Phone className="h-4 w-4" />
										</Button>
									</TableCell>
									<TableCell>
										<Button
											size="sm"
											variant="outline"
											onClick={() =>
												handlePhoneAction(
													reference,
													"add",
													getSelectedPhone(reference)
												)
											}
											disabled={phoneOptions.length === 0}
										>
											<Plus className="h-4 w-4 text-green-900" />
										</Button>
									</TableCell>
									<TableCell>
										<Button
											size="sm"
											variant="outline"
											onClick={() =>
												handlePhoneAction(
													reference,
													"sms",
													getSelectedPhone(reference)
												)
											}
											disabled={phoneOptions.length === 0}
										>
											<MessageSquare className="h-4 w-4 text-blue-500" />
										</Button>
									</TableCell>
									<TableCell>
										<Button
											size="sm"
											variant="outline"
											onClick={() =>
												handlePhoneAction(
													reference,
													"edit",
													getSelectedPhone(reference)
												)
											}
											disabled={phoneOptions.length === 0}
										>
											<Edit className="h-4 w-4 text-yellow-500" />
										</Button>
									</TableCell>
									<TableCell>
										{reference.Company || "-"}
									</TableCell>
									<TableCell>
										{reference.Position || "-"}
									</TableCell>
									<TableCell>
										{reference.HasActiveLoans?.toString() ||
											"false"}
									</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			</div>
			<ScrollBar orientation="horizontal" />
			<ScrollBar orientation="vertical" />
		</ScrollArea>
	);
}
