// Re-export core CustomerPhone type
export type { CustomerPhone } from "@openauth/core/models";

// Phone type enums matching the Vue application (web-specific)
export enum PhoneType {
  NoContactType = 0,
  HomePhone = 1,
  DirectBusinessPhone = 2,
  BusinessWithExt = 3,
  Mobile = 4,
  VacationPhone = 5,
  Pager = 6,
  Modem = 7,
  VoiceMail = 8,
  PinPager = 9,
  EmailAddress = 10,
  InstantMessaging = 11,
  SpouseDirectBusinessPhone = 22,
  SpouseMobile = 24,
}

export const PhoneTypeEnum = [
  { Type: "NoContactType", Value: 0 },
  { Type: "HomePhone", Value: 1 },
  { Type: "DirectBusinessPhone", Value: 2 },
  { Type: "BusinessWithExt", Value: 3 },
  { Type: "Mobile", Value: 4 },
  { Type: "VacationPhone", Value: 5 },
  { Type: "Pager", Value: 6 },
  { Type: "Modem", Value: 7 },
  { Type: "VoiceMail", Value: 8 },
  { Type: "PinPager", Value: 9 },
  { Type: "EmailAddress", Value: 10 },
  { Type: "InstantMessaging", Value: 11 },
  { Type: "SpouseMobile", Value: 24 },
  { Type: "SpouseDirectBusinessPhone", Value: 22 },
];
