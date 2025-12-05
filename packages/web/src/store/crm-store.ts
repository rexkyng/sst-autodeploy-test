import { create } from "zustand";
import type {
  CustomerDetailsResponse,
  Debtor,
  Loan,
  FollowHistory,
  ContactAmendmentHistory,
  CallResultCode,
  FollowStatusCode,
  CustomerPhone,
} from "@openauth/api";
import type { ActionList } from "../types/action";

// Type aliases for compatibility
type Customer = CustomerDetailsResponse["Customer"];

// Web-specific ReminderHistory with different field names
export interface ReminderHistory {
  LN_ACCT_NO: string;
  LOAN_NO: string;
  REMINDER_DATE: string;
  TYPE: string;
  OVERDUE_AMT: number;
  STATUS: string;
}
type ActionCode = {
  Id: string;
  Code?: string;
  Name?: string;
  Description?: string;
  ActionTypeId?: number;
  Enabled?: boolean;
};
type BankAccountCode = {
  Id: string;
  Code: string;
  Description?: string;
};
type BankInMethodCode = {
  Id: string;
  Code: string;
  Description?: string;
};
import { DEFAULT_DEBTOR_CUSTOMER_INFO } from "../lib/constants";

export interface LoanInfo {
  AccountNumber: string;
  LoanSequence: string;
  [key: string]: any; // Other loan properties
}

export interface SearchResultItem {
  ID_TYPE: string;
  CUSTOMER_ID: string;
  NICKNAME: string;
  SURNAME: string;
  GIVEN_NAME: string;
  SEARCH_VALUE?: string;
}

interface CRMState {
  // Search state
  selectedSearchType: string | null;
  searchValue: string[];
  searchAccountNo: string | null;
  searchHKID: string | null;
  searchCustomerFirstName: string | null;
  searchCustomerLastName: string | null;
  searchPhoneNumber: string | null;
  searchRefName: string | null;
  searchRefPhoneNo: string | null;
  searchCompanyName: string | null;
  searchCustomerReferenceNo: string | null;
  searchedNationalIdType: string | null;
  searchedNationalId: string | null;
  searchResultList: SearchResultItem[];
  
  // Selected entities
  selectedCustomerId: string | null;
  selectedAccountNo: string | null;
  selectedAccountNoForFollowHistory: string | null;
  selectedAccountLoanSequence: string | null;
  selectedAccountLoanSequenceForFollowHistory: string | null;
  selectedAccount: Partial<Loan>;
  selectedDebtor: Partial<Debtor>;
  
  // Sorting state
  currentSort: string;
  currentSortDir: "asc" | "desc";
  currentAccountSort: string;
  currentAccountDir: "asc" | "desc";
  
  // Follow state
  followStatusId: string | null;
  callMemo: string | null;
  nextFollowDateTime: string | null;
  followStatusType: string | null;
  
  // Phone management state
  selectedRole: string | null;
  selectedPhoneId: string | null;
  selectedPhoneNo: string | null;
  selectedPhoneType: string | null;
  selectedPhoneCountryCode: string | null;
  selectedPhoneExtension: string | null;
  addPhoneNumberValue: string | null;
  addPhoneCountryCode: string | null;
  addPhoneExtension: string | null;
  addPhoneInvalidReason: string | null;
  editPhoneInvalidReason: string | null;
  
  // Nickname state
  crmNickName: string | null;
  editCRMNickName: string | null;
  
  // DI Calculator state
  diNoOfDay: number | null;
  diAmount: number | null;
  
  // UI state
  isSearch: boolean;
  showAllAccount: boolean;
  displayShowAllAccountButton: boolean;
  startTime: Date | null;
  
  // Data
  actionCodes: ActionCode[];
  bankAccountCodes: BankAccountCode[];
  bankInMethodCodes: BankInMethodCode[];
  callResultCodes: CallResultCode[];
  contactAmendmentHistory: ContactAmendmentHistory[];
  customer: Partial<Customer>;
  customerPhone: CustomerPhone[];
  followHistory: FollowHistory[];
  followStatusCodes: FollowStatusCode[];
  mobilePhones: { mobile: string | null; PhoneCountryCode?: string }[];
  loans: Loan[];
  debtors: Debtor[];
  references: any[];
  totalActionList: ActionList[];
  actionList: Partial<ActionList>;
  reminderHistory: ReminderHistory[];
  customerBusinessesForEdit: any[];
  customerResidentialsForEdit: any[];
  phoneTypeEnumList: any[];
  
  // Actions
  setSearchCriteria: (criteria: Partial<CRMState>) => void;
  setSelectedAccount: (accountNo: string, loanSequence: string, account: Loan) => void;
  setSelectedDebtor: (debtor: Debtor) => void;
  setSelectedDebtorWithInfo: (debtor: Debtor, customerInfo: any) => void;
  setCustomerData: (data: any) => void;
  resetData: () => void;
  updateSort: (field: string, table: "follow" | "account") => void;
  setActionList: (accountNo: string, loanSequence: string) => void;
  updateActionList: (updates: Partial<ActionList>) => void;
  setNextFollowDateTime: (datetime: string | null) => void;
  setDICalculation: (days: number | null, amount: number | null) => void;
  setPhoneState: (updates: Partial<CRMState>) => void;
  setNicknameState: (updates: Partial<CRMState>) => void;
  toggleShowAllAccount: () => void;
}

const initialState = {
  selectedSearchType: "account",
  searchValue: [],
  searchAccountNo: null,
  searchHKID: null,
  searchCustomerFirstName: null,
  searchCustomerLastName: null,
  searchPhoneNumber: null,
  searchRefName: null,
  searchRefPhoneNo: null,
  searchCompanyName: null,
  searchCustomerReferenceNo: null,
  searchedNationalIdType: null,
  searchedNationalId: null,
  searchResultList: [],
  selectedCustomerId: null,
  selectedAccountNo: null,
  selectedAccountNoForFollowHistory: null,
  selectedAccountLoanSequence: null,
  selectedAccountLoanSequenceForFollowHistory: null,
  selectedAccount: {},
  selectedDebtor: {
    CustomerInfo: { ...DEFAULT_DEBTOR_CUSTOMER_INFO },
    NationalId: null,
    NationalIdType: null,
  },
  currentSort: "StartTime",
  currentSortDir: "desc" as const,
  currentAccountSort: "OverdueDay",
  currentAccountDir: "desc" as const,
  followStatusId: null,
  callMemo: null,
  nextFollowDateTime: null,
  followStatusType: null,
  selectedRole: null,
  selectedPhoneId: null,
  selectedPhoneNo: null,
  selectedPhoneType: null,
  selectedPhoneCountryCode: null,
  selectedPhoneExtension: null,
  addPhoneNumberValue: null,
  addPhoneCountryCode: null,
  addPhoneExtension: null,
  addPhoneInvalidReason: null,
  editPhoneInvalidReason: null,
  crmNickName: null,
  editCRMNickName: null,
  diNoOfDay: null,
  diAmount: null,
  isSearch: false,
  showAllAccount: false,
  displayShowAllAccountButton: true,
  startTime: null,
  actionCodes: [],
  bankAccountCodes: [],
  bankInMethodCodes: [],
  callResultCodes: [],
  contactAmendmentHistory: [],
  customer: {},
  customerPhone: [],
  followHistory: [],
  followStatusCodes: [],
  mobilePhones: [],
  loans: [],
  debtors: [],
  references: [],
  totalActionList: [],
  actionList: {},
  reminderHistory: [],
  customerBusinessesForEdit: [],
  customerResidentialsForEdit: [],
  phoneTypeEnumList: [],
};

export const useCRMStore = create<CRMState>((set, get) => ({
  ...initialState,
  
  setSearchCriteria: (criteria) => set((state) => ({ ...state, ...criteria })),
  
  setSelectedAccount: (accountNo, loanSequence, account) => {
    set({
      selectedAccountNo: accountNo,
      selectedAccountLoanSequence: loanSequence,
      selectedAccountNoForFollowHistory: accountNo,
      selectedAccountLoanSequenceForFollowHistory: loanSequence,
      selectedAccount: account,
    });
    
    // Update selected debtor and action list
    const state = get();
    const debtors = account.Debtors || [];
    if (debtors.length > 0) {
      set({ selectedDebtor: debtors[0] || {} });
    }
    
    const actionList = state.totalActionList.find(
      (x) => x.AccountNo === accountNo && x.AccountLoanSequence === loanSequence
    );
    if (actionList) {
      set({ actionList });
    }
  },
  
  setSelectedDebtor: (debtor) => set({ selectedDebtor: debtor }),
  setSelectedDebtorWithInfo: (debtor, customerInfo) => set({
    selectedDebtor: {
      ...debtor,
      CustomerInfo: customerInfo
    }
  }),
  
  setCustomerData: (data) => {
    set({
      actionCodes: data.ActionCodes || {},
      bankAccountCodes: data.BankAccountCodes || {},
      bankInMethodCodes: data.BankInMethodCodes || {},
      callResultCodes: data.CallResultCodes || {},
      contactAmendmentHistory: data.ContactAmendmentHistory || {},
      customerPhone: data.CustomerPhone || {},
      customer: data.Customer || {},
      customerBusinessesForEdit: data.Customer?.CustomerBusinesses ? JSON.parse(JSON.stringify(data.Customer.CustomerBusinesses)) : [],
      customerResidentialsForEdit: data.Customer?.CustomerResidentials ? JSON.parse(JSON.stringify(data.Customer.CustomerResidentials)) : [],
      loans: data.Customer?.Loans || [],
      followHistory: data.FollowHistory || {},
      followStatusCodes: data.FollowStatusCodes || {},
      mobilePhones: [
        { mobile: data.Customer?.MobilePhoneNumber },
        { mobile: data.Customer?.MobilePhone2Number },
      ],
      crmNickName: data.CustomerNickname,
      editCRMNickName: data.CustomerNickname,
      debtors: data.Debtors || [],
      references: data.References || [],
      selectedCustomerId: data.Customer?.Id || null,
    });
  },
  
  resetData: () => set(initialState),
  
  updateSort: (field, table) => {
    if (table === "follow") {
      set((state) => ({
        currentSort: field,
        currentSortDir: state.currentSort === field && state.currentSortDir === "asc" ? "desc" : "asc",
      }));
    } else if (table === "account") {
      set((state) => ({
        currentAccountSort: field,
        currentAccountDir: state.currentAccountSort === field && state.currentAccountDir === "asc" ? "desc" : "asc",
      }));
    }
  },
  
  setActionList: (accountNo, loanSequence) => {
    const state = get();
    const actionList = state.totalActionList.find(
      (x) => x.AccountNo === accountNo && x.AccountLoanSequence === loanSequence
    );
    if (actionList) {
      set({ actionList });
    }
  },
  
  updateActionList: (updates) => {
    set((state) => ({
      actionList: { ...state.actionList, ...updates },
    }));
    
    // Also update in totalActionList
    const state = get();
    const totalActionList = state.totalActionList.map((action) => {
      if (
        action.AccountNo === state.selectedAccountNo &&
        action.AccountLoanSequence === state.selectedAccountLoanSequence
      ) {
        return { ...action, ...updates };
      }
      return action;
    });
    set({ totalActionList });
  },
  
  setNextFollowDateTime: (datetime) => set({ nextFollowDateTime: datetime }),
  
  setDICalculation: (days, amount) => set({ diNoOfDay: days, diAmount: amount }),
  
  setPhoneState: (updates) => set(updates),
  
  setNicknameState: (updates) => set(updates),
  
  toggleShowAllAccount: () => set((state) => ({ showAllAccount: !state.showAllAccount })),
}));

