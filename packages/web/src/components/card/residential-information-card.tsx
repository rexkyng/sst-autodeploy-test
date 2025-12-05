import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toHKD } from "@/lib/formatters";
// CustomerResidential and DebtorCustomerInfo are web-specific
import type { CustomerAddress, CustomerInfo } from "@openauth/api";

// Web-specific extension for residential information
export interface CustomerResidential extends CustomerAddress {
  LivingWith?: string;
  LivingPeriod?: string;
  Pin?: string;
  Fax?: string;
  AccomCode?: string;
  OwnershipStatus?: string;
  MonthlyRent?: number;
}

// DebtorCustomerInfo is an alias for CustomerInfo
export type DebtorCustomerInfo = CustomerInfo;

interface ResidentialInformationCardProps {
  residentialRecords: CustomerResidential[];
  hasOwlInfo: boolean;
  customerInfo: DebtorCustomerInfo;
  email?: string | null;
}

export function ResidentialInformationCard({
  residentialRecords,
  hasOwlInfo,
  customerInfo,
  email
}: ResidentialInformationCardProps) {
  return (
    <Card>
      <CardContent>
        {residentialRecords.length > 0 || hasOwlInfo ? (
          <Tabs
            defaultValue={residentialRecords.length > 0 ? "residential-0" : "owl"}
          >
            <TabsList className="flex flex-wrap justify-start gap-2">
              {residentialRecords.map((_, index) => (
                <TabsTrigger key={index} value={`residential-${index}`}>
                  Residential {index + 1}
                </TabsTrigger>
              ))}
              {hasOwlInfo && <TabsTrigger value="owl">OWL Info</TabsTrigger>}
            </TabsList>

            {residentialRecords.map((residential, index) => (
              <TabsContent
                key={`residential-${index}`}
                value={`residential-${index}`}
                className="mt-0 space-y-4"
              >
                {renderResidentialCard(residential, customerInfo, email)}
              </TabsContent>
            ))}

            {hasOwlInfo && (
              <TabsContent value="owl" className="mt-0 space-y-4">
                {renderOwlInformation(customerInfo)}
              </TabsContent>
            )}
          </Tabs>
        ) : (
          <div className="text-muted-foreground">No residential information available</div>
        )}
      </CardContent>
    </Card>
  );
}

function renderResidentialCard(
  residential: CustomerResidential,
  customerInfo: DebtorCustomerInfo,
  email?: string | null
) {
  const phone = formatPhoneNumber(residential.PhoneCountryCode, residential.PhoneNumber, residential.PhoneExtension);
  const livingWith = getLivingWithFlags(residential.LivingWith);
  const livingPeriod = getLivingPeriod(residential.LivingPeriod);
  const monthlyRent = typeof residential.MonthlyRent === "number" ? toHKD(residential.MonthlyRent) : undefined;
  const pin = residential.Pin && residential.Pin !== "000000" ? residential.Pin : undefined;

  return (
    <Card className="w-full">
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <InfoField label="Address" value={residential.Address} className="md:col-span-2" />
          <InfoField label="Phone No" value={phone} />
          <InfoField label="Pin" value={pin} />
          <InfoField label="Fax" value={residential.Fax} />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <InfoField label="Accom Code" value={residential.AccomCode} />
          <div className="space-y-2">
            <Label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Living With</Label>
            <div className="flex flex-wrap gap-4">
              {livingWith.options.map((option) => (
                <div className="flex items-center gap-2" key={option.key}>
                  <Checkbox checked={option.checked} disabled aria-label={option.label} />
                  <span className="text-sm text-foreground">{option.label}</span>
                </div>
              ))}
            </div>
            {livingWith.description && (
              <div className="text-sm text-muted-foreground whitespace-pre-wrap">
                {livingWith.description}
              </div>
            )}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-5">
          <InfoField label="Living Period" value={livingPeriod.original || undefined} />
          <InfoField label="Year" value={livingPeriod.year || undefined} />
          <InfoField label="Month" value={livingPeriod.month || undefined} />
          <InfoField label="Email" value={email ?? customerInfo?.Email} />
        </div>
      </CardContent>
    </Card>
  );
}

function renderOwlInformation(customerInfo: DebtorCustomerInfo) {
  return (
    <Card className="w-full">
      <CardContent className="space-y-6 pt-6">
        <div className="grid gap-4 md:grid-cols-2">
          <InfoField label="Dependant" value={customerInfo.OverseasWorkerLoanDependantName} />
          <InfoField label="Phone No" value={customerInfo.OverseasWorkerLoanPhoneNumber} />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <InfoField label="Address" value={customerInfo.OverseasWorkerLoanAddress} />
          <InfoField label="Relationship" value={customerInfo.OverseasWorkerLoanRelationship} />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <InfoField label="Employer Name" value={customerInfo.OverseasWorkerLoanEmployerName} />
          <InfoField label="Employer Phone" value={customerInfo.OverseasWorkerLoanEmployerPhone} />
        </div>
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

function getLivingWithFlags(livingWith?: string | null) {
  const defaults = {
    options: [
      { key: "alone", label: "Alone", checked: false },
      { key: "parents", label: "Parents", checked: false },
      { key: "siblings", label: "Brother/Sister", checked: false },
      { key: "spouse", label: "Spouse", checked: false },
    ],
    description: "",
  };

  if (!livingWith) {
    return defaults;
  }

  const parts = livingWith.split(",");
  const [alone, parents, siblings, spouse, description] = parts;

  return {
    options: [
      { key: "alone", label: "Alone", checked: alone === "1" },
      { key: "parents", label: "Parents", checked: parents === "1" },
      { key: "siblings", label: "Brother/Sister", checked: siblings === "1" },
      { key: "spouse", label: "Spouse", checked: spouse === "1" },
    ],
    description: description ? description.trim() : "",
  };
}

function getLivingPeriod(livingPeriod?: string | null) {
  if (!livingPeriod) {
    return { year: "", month: "", original: "" };
  }

  const sanitized = livingPeriod.padEnd(5, "0");
  const year = sanitized.substring(0, 3).replace(/^0+/, "");
  const month = sanitized.substring(3, 5).replace(/^0+/, "");

  return {
    year,
    month,
    original: livingPeriod,
  };
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
