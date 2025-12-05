// Re-export API types and define web-specific extensions
export type {
  CustomerInfo,
  Debtor,
  Loan,
  Reference,
  CustomerAddress,
} from "@openauth/api";

import type { CustomerAddress } from "@openauth/api";

// Web-specific extensions for business and residential information
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
export type { CustomerInfo as DebtorCustomerInfo } from "@openauth/api";
