import { Debtor } from './debtor'

export interface Loan {
  AccountNumber: string
  LoanSequence: string
  LoanStatus: string
  LoanBalance: number
  OverdueDay: number
  NetOverdueAmount: number
  LateCharge: number
  AdminCharge: number
  AnnualCharge: number
  NextDueDate: string
  SpecialRemarks: string | null
  CenterRemarks: string | null
  TotalNumberOfInstallment?: number
  TotalNumberOfPaidInstallment?: number
  InstallmentAmount?: number
  RepayMethod?: string
  RejectReason?: string
  LoanType?: string
  Group?: string
  Role?: string
  CampaignType?: string
  LoanAmount?: number
  IfAmount?: number
  LoanDate?: string
  ExpiryDate?: string
  CutOffDate?: string
  LastPayDate?: string
  LastPayAmount?: number
  Score?: number
  FollowStatus?: string
  TotalDeferDay?: number
  C?: number
  C1?: number
  C2?: number
  DirectSalesReferral?: string
  EStatement?: string
  ApBankAccountNumber?: string
  DeferDay?: number
  DiRate?: number
  LoanExpiryDate?: string
  PdStatus?: string
  EarlySettleAmount?: number
  InstallmentAmountMinPaid?: number
  LastRepayMethod?: string
  WaivedAdminCharge?: number
  WaivedLateCharge?: number
  Debtors: Debtor[]
}
