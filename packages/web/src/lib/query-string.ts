// Port of getQueryStringObject() from Vue application
// Handles complex query string parsing with nested objects, pipe-separated values, and colon-separated key-value pairs

export interface QueryStringObject {
  [key: string]: any;
}

export function getQueryStringObject(): QueryStringObject {
  // SSR-safe: check if window is available
  if (typeof window === 'undefined') {
    return {};
  }
  
  const query = decodeURIComponent(window.location.search).split("?")[1];
  const kvps = query ? query.split("&") : [];
  const obj: QueryStringObject = {};

  kvps.forEach(function (element) {
    const kvp = element.split("=");
    const key = kvp[0];
    const value = kvp[1];
    const values = value ? value.split("|") : [];

    if (values.length === 1) {
      if (value && value.indexOf(":") >= 0) {
        const innerObj: any = {};
        values.forEach(function (val) {
          const innerKvp = val.split(":");
          if (innerKvp.length > 1) {
            innerObj[innerKvp[0]] = innerKvp[1];
          } else {
            innerObj[0] = val;
          }
        });
        // Store the original value, not the parsed object
        obj[key] = value;
      } else {
        obj[key] = value;
      }
    } else {
      const innerObj: any = {};
      values.forEach(function (val, index) {
        const innerKvp = val.split(":");
        if (innerKvp.length > 1) {
          innerObj[innerKvp[0]] = innerKvp[1];
        } else {
          innerObj[index] = val;
        }
      });
      obj[key] = innerObj;
    }
  });

  return obj;
}

// Helper to get agent ID from query string
export function getAgentId(querystring: QueryStringObject): string {
  return querystring["Agent.ExternalID"] || querystring["Agent.UserName"] || "";
}

// Query keys for TanStack Query
export const queryKeys = {
  customer: (tenant: string, idType: string, nationalId: string) =>
    ['customer', tenant, idType, nationalId],
  phoneNumbers: (customerId: string) =>
    ['phone-numbers', customerId],
  followHistory: (accountNo: string, loanSequence: string) =>
    ['follow-history', accountNo, loanSequence],
  contactAmendmentHistory: (customerId: string) =>
    ['contact-amendment-history', customerId],
  searchResults: (searchType: string, searchValue: string) =>
    ['search-results', searchType, searchValue],
  customerBusiness: (customerId: string) =>
    ['customer-business', customerId],
  customerResidential: (customerId: string) =>
    ['customer-residential', customerId],
} as const;

