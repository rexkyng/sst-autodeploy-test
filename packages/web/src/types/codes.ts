// Re-export core types
export type {
  CallResultCode,
  FollowStatusCode,
} from "@openauth/core/models";

// Web-specific code types (these may be Record<string, any> in core)
export interface ActionCode {
  Id: string;
  Code?: string;
  Name?: string;
  Description?: string;
  ActionTypeId?: number;
  Enabled?: boolean;
}

export interface BankAccountCode {
  Id: string;
  Code: string;
  Description?: string;
}

export interface BankInMethodCode {
  Id: string;
  Code: string;
  Description?: string;
}
