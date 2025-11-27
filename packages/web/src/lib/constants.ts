// Constants for the CRM application

export const PHONE_TYPE_LABELS: Record<number, string> = {
  0: "NoContactType",
  1: "Home Phone",
  2: "Direct Business Phone",
  3: "Business with Ext",
  4: "Mobile",
  5: "Vacation Phone",
  6: "Pager",
  7: "Modem",
  8: "Voice Mail",
  9: "Pin Pager",
  10: "Email Address",
  11: "Instant Messaging",
  22: "Spouse Direct Business Phone",
  24: "Spouse Mobile",
};

export const FOLLOW_STATUS_TYPES = [
  { type: "Ongoing" },
  { type: "FWNEXTDAY" },
  { type: "Finished" },
];

export const DEFAULT_DEBTOR_CUSTOMER_INFO = {
  CustomerBusinesses: [],
  CustomerResidentials: [],
  SpouseBusinessPhoneCountryCode: null,
  SpouseBusinessPhoneNumber: null,
  SpouseCompanyAddress: null,
  SpouseCompanyName: null,
  SpouseAge: null,
  SpouseComplain: null,
  SpouseMobilePhoneCountryCode: null,
  SpouseMobilePhoneNumber: null,
  SpouseName: null,
  SpouseNameChinese: null,
  SpouseNickname: null,
  SpousePosition: null,
  OverseasWorkerLoanAddress: null,
  OverseasWorkerLoanDependantName: null,
  OverseasWorkerLoanEmployerName: null,
  OverseasWorkerLoanEmployerPhone: null,
  OverseasWorkerLoanPhoneNumber: null,
  OverseasWorkerLoanRelationship: null,
  GivenName: null,
  Surname: null,
  GivenNameChinese: null,
  SurnameChinese: null,
  Id: null,
  NationalIdType: null,
  DateOfMatch: null,
  PartialIdMatched: null,
  Nationality: null,
  MaritalStatus: null,
  DateOfBirth: null,
  Email: null,
};

export const ACCOUNT_TABLE_CLICK_DELAY = 250; // milliseconds

