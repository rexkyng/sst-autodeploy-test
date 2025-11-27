import { Loan } from './loan'
import { CustomerAddress, MobilePhone, CustomerPhone } from './contact'
import { FollowHistory, ContactAmendmentHistory } from './history'
import { CallResultCode, FollowStatusCode } from './codes'
import { Debtor, Reference } from './debtor'

export interface CustomerSearchResult {
  NationalIdType: string
  NationalId: string
  Nickname: string
  Surname: string
  GivenName: string
  Loans?: any[]
}

export interface CustomerDetails {
  Customer: {
    Id: string
    NationalId: string
    NationalIdType: string
    GivenName: string
    Surname: string
    GivenNameChinese: string
    SurnameChinese: string
    Nickname: string
    DateOfBirth: string
    Email: string
    MobilePhoneNumber: string
    MobilePhone2Number: string
    OtherPhoneNumber: string
    PagerNumber: string
    Loans: Loan[]
    CustomerBusinesses: CustomerAddress[]
    CustomerResidentials: CustomerAddress[]
  }
  CustomerBusinessesForEdit: CustomerAddress[]
  CustomerResidentialsForEdit: CustomerAddress[]
  ActionCodes: Record<string, any>
  BankAccountCodes: Record<string, any>
  BankInMethodCodes: Record<string, any>
  CallResultCodes: CallResultCode[]
  ContactAmendmentHistory: ContactAmendmentHistory[]
  CustomerPhone: CustomerPhone[]
  FollowHistory: FollowHistory[]
  FollowStatusCodes: FollowStatusCode[]
  Debtors: Debtor[]
  References: Reference[]
  mobile_phones: MobilePhone[]
}

export interface CustomerInfo {
  CustomerBusinesses: CustomerAddress[]
  CustomerResidentials: CustomerAddress[]
  SpouseBusinessPhoneCountryCode: string
  SpouseBusinessPhoneNumber: string
  SpouseCompanyAddress: string
  SpouseAge: string
  SpouseCompanyName: string
  SpouseComplain: string | null
  SpouseMobilePhoneCountryCode: string
  SpouseMobilePhoneNumber: string
  SpouseName: string
  SpouseNameChinese: string
  SpouseNickname: string
  SpousePosition: string
  OverseasWorkerLoanAddress: string
  OverseasWorkerLoanDependantName: string
  OverseasWorkerLoanEmployerName: string
  OverseasWorkerLoanEmployerPhone: string
  OverseasWorkerLoanPhoneNumber: string
  OverseasWorkerLoanRelationship: string
  GivenName: string
  Surname: string
  GivenNameChinese: string
  SurnameChinese: string
  Id: string
  NationalIdType: string
  DateOfMatch: string
  PartialIdMatched: boolean
  Nationality: string
  MaritalStatus: string
  DateOfBirth: string
  Email: string
}
