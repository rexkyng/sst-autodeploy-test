import { CustomerInfo } from './customer'

export interface Reference {
  Role: string
  GivenName: string
  Surname: string
  GivenNameChinese?: string
  SurnameChinese?: string
  Age?: number
  RelationshipCode?: string
  MobilePhoneNumber: string
  MobilePhoneCountryCode?: string
  ResidentialPhoneNumber: string
  ResidentialPhoneCountryCode?: string
  BusinessPhoneNumber: string
  BusinessPhoneCountryCode?: string
  OtherPhoneNumber: string
  OtherPhoneCountryCode?: string
  Company?: string
  Position?: string
  HasActiveLoans?: boolean
  CustomerId?: string
}

export interface Debtor {
  CustomerId?: string
  AccountNumber: string
  LoanSequence: string
  Role: string
  NationalId: string
  NationalIdType: string
  GivenName: string
  Surname: string
  MobilePhoneNumber: string
  ResidentialPhoneNumber: string
  BusinessPhoneNumber: string
  OtherPhoneNumber: string
  References: Reference[]
  CustomerInfo?: CustomerInfo
}
