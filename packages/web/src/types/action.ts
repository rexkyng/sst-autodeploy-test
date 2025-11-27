export interface ActionList {
  AccountNo: string | null;
  AccountLoanSequence: string | null;
  SpecialRemark?: string | null;
  isClickSpecialRemarkKey?: boolean | null;
  isClickSpecialRemarkSave?: boolean | null;
  CentreRemark?: string | null;
  isClickCentreRemarkKey?: boolean | null;
  isClickCentreRemarkSave?: boolean | null;
  FollowStatusCodeId?: string | null;
  CallMemo?: string | null;
  BankInAmount?: number | null;
  BankInMethodCodeId?: string | null;
  BankAccountId?: string | null;
  BankInDate?: string | null;
  BankInRecepitNumber?: string | null;
  BankInRemark?: string | null;
  SendReminderLocalAddressActionCode?: string | null;
  SendReminderOverseaAddressActionCode?: string | null;
  SiteVisitActionCode?: string | null;
  OtherActionCode?: string | null;
  ReviewCheckActionCode?: string | null;
  RecommendSendToCCDCode?: string | null;
  SendSMSCode?: string | null;
  SMSPhoneNumber?: string | null;
}

