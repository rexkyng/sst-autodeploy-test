import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate2, toHKD } from "@/lib/formatters";
// CustomerBusiness is web-specific, extending CustomerAddress from core
import type { CustomerAddress } from "@openauth/api";

// Web-specific extension for business information
export interface CustomerBusiness extends CustomerAddress {
  CompanyName?: string;
  Department?: string;
  Position?: string;
  Industry?: string;
  Fax?: string;
  Occupation?: string;
  ContractExpiryDate?: string;
  VisaDate?: string;
  YearOfService?: string;
  Salary?: number;
  SalaryDay?: string;
  SalaryDayB?: string;
}
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface BusinessInformationCardProps {
	businessRecords: CustomerBusiness[];
}

export function BusinessInformationCard({
	businessRecords,
}: BusinessInformationCardProps) {
	return (
		<Card>
			<CardContent className="space-y-4">
				{businessRecords.length > 0 ? (
					<Tabs defaultValue={"business-0"}>
						<TabsList className="flex flex-wrap justify-start gap-2">
							{businessRecords.map((_, index) => (
								<TabsTrigger
									key={index}
									value={`business-${index}`}
								>
									Business {index + 1}
								</TabsTrigger>
							))}
						</TabsList>
						{businessRecords.map((business, index) =>
							renderBusinessCard(business, index)
						)}
					</Tabs>
				) : (
					<div className="text-muted-foreground">
						No business information available
					</div>
				)}
			</CardContent>
		</Card>
	);
}

function renderBusinessCard(business: CustomerBusiness, index: number) {
	const phone = formatPhoneNumber(
		business.PhoneCountryCode,
		business.PhoneNumber,
		business.PhoneExtension
	);
	return (
		<Card key={`business-${index}`} className="w-full">
			<CardContent className="space-y-4">
				<div className="grid gap-4 md:grid-cols-3">
					<InfoField
						label="Company Name"
						value={business.CompanyName}
					/>
					<InfoField label="Department" value={business.Department} />
					<InfoField label="Position" value={business.Position} />
				</div>
				<div className="grid gap-4 md:grid-cols-3">
					<InfoField label="Industry" value={business.Industry} />
					<InfoField label="Phone No" value={phone} />
					<InfoField label="Occupation" value={business.Occupation} />
				</div>
				<div className="grid gap-4 md:grid-cols-3">
					<InfoField label="Ext." value={business.PhoneExtension} />
					<InfoField label="Fax" value={business.Fax} />
					<InfoField
						label="Contract Expiry Date"
						value={
							business.ContractExpiryDate
								? formatDate2(business.ContractExpiryDate)
								: undefined
						}
					/>
				</div>
				<div className="grid gap-4 md:grid-cols-3">
					<InfoField
						label="Visa Date"
						value={
							business.VisaDate
								? formatDate2(business.VisaDate)
								: undefined
						}
					/>
					<InfoField
						label="Yr of Service"
						value={business.YearOfService}
					/>
					<InfoField
						label="Salary"
						value={
							typeof business.Salary === "number"
								? toHKD(business.Salary)
								: undefined
						}
					/>
				</div>
				<div className="grid gap-4 md:grid-cols-2">
					<InfoField label="Salary Day" value={business.SalaryDay} />
					<InfoField
						label="Salary Day 2"
						value={business.SalaryDayB}
					/>
				</div>
				<InfoField label="Address" value={business.Address} />
			</CardContent>
		</Card>
	);
}

function formatPhoneNumber(
	countryCode?: string | null,
	phoneNumber?: string | null,
	extension?: string | null
) {
	if (!phoneNumber) {
		return undefined;
	}

	const base = countryCode ? `(${countryCode}) ${phoneNumber}` : phoneNumber;
	return extension ? `${base}-${extension}` : base;
}

interface InfoFieldProps {
	label: string;
	value?: React.ReactNode;
	muted?: boolean;
	className?: string;
}

function InfoField({ label, value, muted, className }: InfoFieldProps) {
	return (
		<div className={`flex gap-2 items-start ${className || ""}`}>
			<label className="text-xs font-medium uppercase tracking-wide text-muted-foreground min-w-[120px] flex-shrink-0">
				{label}:
			</label>
			<div
				className={`text-sm whitespace-pre-wrap break-words flex-1 ${
					muted ? "text-muted-foreground" : "text-foreground"
				}`}
			>
				{getDisplayValue(value)}
			</div>
		</div>
	);
}

function getDisplayValue(value?: React.ReactNode) {
	if (value === null || typeof value === "undefined") {
		return "-";
	}

	if (typeof value === "string") {
		return value.trim().length > 0 ? value : "-";
	}

	return value;
}
