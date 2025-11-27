// Re-export core types
export type {
  FollowHistory,
  ContactAmendmentHistory,
} from "@openauth/core/models";

// Web-specific ReminderHistory with different field names
export interface ReminderHistory {
  LN_ACCT_NO: string;
  LOAN_NO: string;
  REMINDER_DATE: string;
  TYPE: string;
  OVERDUE_AMT: number;
  STATUS: string;
}
