export interface CustomerAddress {
  CustomerId: string
  AddressType: string
  AddressLine1: string
  AddressLine2: string
  AddressLine3: string
  AddressLine4: string
  PhoneNumber: string
  PhoneCountryCode?: string
  PhoneExtension?: string
  Country: string
  PostalCode: string
  Address?: string
}

export interface MobilePhone {
  mobile: string
}

export interface CustomerPhone {
  PhoneId: string
  CustomerId: string
  PhoneType: number
  PhoneCountryCode: string
  PhoneNumber: string
  PhoneExtension: string
  PhoneInvalidReason: string | null
  AccountNumber: string
  LoanSequence: string
  Role: string
}
