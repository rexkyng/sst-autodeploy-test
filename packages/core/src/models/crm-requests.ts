export interface DebtorRequest {
  Tenant?: string
  IdType: string
  NationalId: string
}

export interface SearchRequest {
  Tenant: string
  AccountNumber?: string | null
  LoanSequence?: string | null
  NationalIdType?: string | null
  NationalId?: string | null
  Surname?: string | null
  GivenName?: string | null
  ReferenceName?: string | null
  CompanyName?: string | null
  PhoneNumber?: string | null
  ReferencePhoneNumber?: string | null
  CustomerId?: string | null
  AgentId?: string | null
}

export interface CustomerRequest {
  Tenant: string
  IdType: string
  NationalId: string
  ForceLatest?: boolean
}

export interface WrapupRequest {
  TenantName: string
  IsAdhocSearch: boolean
  CallInfo: {
    StartTime: string
    Duration: number
    Accounts: any[]
    InteractionId?: string
    InteractionType?: string
    CallUUID?: string
    ConnId?: string
    CallResultCodeId: string
    CallListName?: string
    AgentId?: string
    CustomerId?: string
    NextFollowDatetime?: string
  }
}
