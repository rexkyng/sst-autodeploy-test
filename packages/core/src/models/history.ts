export interface FollowHistory {
  Id: string
  CustomerId: string
  AccountNumber: string
  LoanSequence: string
  StartTime: string
  ActionDateTime: string
  CallResult: string
  CallMemo: string
  ConnId: string
  AgentId: string
  RecorderLink: string
  IsAdhocSearch?: boolean
  FollowStatus?: string
  NextFollowDateTime?: string
}

export interface ContactAmendmentHistory {
  CustomerId: string
  AccountNumber: string
  LoanSequence: string
  Role: string
  PhoneType: number
  PhoneNumber: string
  PhoneExtension: string
  PhoneInvalidReason: string
  ActionDatetime: string // lowercase 't' matches WebUI
  ActionType: string
  AgentId: string
}

export interface ReminderHistory {
  AccountNumber: string
  LoanSequence: string
  ReminderDate: string
  ReminderType: string
  Amount: number
  Status: string
}
