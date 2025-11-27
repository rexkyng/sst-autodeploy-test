import dayjs from "dayjs";

// Date formatters matching Vue filters
export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return "";
  return dayjs(date).format("MM/DD/YYYY HH:mm");
}

export function formatDate2(date: string | Date | null | undefined): string {
  if (!date) return "";
  return dayjs(date).format("MM/DD/YYYY");
}

// Currency formatter
export function toHKD(money: number | null | undefined): string {
  if (typeof money === "undefined" || money == null) {
    return "";
  }
  return "$" + money.toLocaleString();
}

// Number formatter
export function toLocaleString(value: number | null | undefined): string {
  if (typeof value === "undefined" || value == null) {
    return "";
  }
  return value.toLocaleString();
}

// Phone type formatter
export function toPhoneTypeString(typeno: number | null | undefined): string {
  const PhoneTypeEnum = [
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

  if (typeof typeno === "number") {
    const type = PhoneTypeEnum.find((e) => e.Value === typeno);
    return type ? type.Type : (typeno === 0 ? "Other" : "");
  }
  return "";
}

// Adhoc search indicator
export function toIsAdhocSearchString(boolValue: boolean | null | undefined): string {
  if (boolValue) {
    return "S";
  }
  return "";
}

// Get current date in MM/DD/YYYY format
export function getDate(): string {
  const today = new Date();
  let dd: string | number = today.getDate();
  let mm: string | number = today.getMonth() + 1;
  const yyyy = today.getFullYear();
  
  if (dd < 10) {
    dd = "0" + dd;
  }
  if (mm < 10) {
    mm = "0" + mm;
  }
  
  return mm + "/" + dd + "/" + yyyy;
}

