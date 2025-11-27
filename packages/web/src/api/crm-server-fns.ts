import { createServerFn } from "@tanstack/react-start";
import { useAppSession } from "../utils/session";
import { auth } from "../server/auth";
import type {
  SearchRequest,
  WrapupRequest,
  StoredProcedureRequest,
  StoredProcedureResponse,
  CustomerInfo,
  CustomerSearchResponse,
  WrapupResponse,
  CustomerDetailsResponse,
} from "@openauth/core/models";

// Helper to get API URL
const GetAPIUrl = () => {
  return import.meta.env.VITE_API_URL || "http://localhost:3000/api";
};

// Helper to get authenticated headers
async function getAuthHeaders() {
  const session = await useAppSession();
  
  // Ensure token is fresh
  await auth(); 
  // Re-read tokens in case auth() refreshed them
  const freshTokens = session.data;
  
  if (!freshTokens?.access) {
    throw new Error("Not authenticated");
  }

  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${freshTokens.access}`,
  };
}

// Shared helper for CRM API calls
async function callCrm<T>(endpoint: string, body: any): Promise<T> {
  const API_URL = GetAPIUrl();
  const headers = await getAuthHeaders();
  
  const response = await fetch(`${API_URL}${endpoint}`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error(`[API] Request failed. URL: ${API_URL}${endpoint}, Status: ${response.status}, Response: ${errorText}`);
    throw new Error(`API Error: ${response.status} ${errorText}`);
  }
  
  return response.json() as Promise<T>;
}

export const getCustomerFn = createServerFn({ method: "POST" })
  .inputValidator((data: { tenantName: string; idType: string; nationalId: string; forceLatest?: boolean }) => data)
  .handler(async ({ data }) => {
    return callCrm<CustomerDetailsResponse>('/crm/customer', {
      Tenant: data.tenantName,
      IdType: data.idType,
      NationalId: data.nationalId,
      ForceLatest: data.forceLatest ?? false,
    });
  });

export const searchCustomersFn = createServerFn({ method: "POST" })
  .inputValidator((params: SearchRequest) => params)
  .handler(async ({ data: params }) => {
    return callCrm<CustomerSearchResponse>('/crm/search', params);
  });

export const submitWrapupFn = createServerFn({ method: "POST" })
  .inputValidator((params: WrapupRequest) => params)
  .handler(async ({ data: params }) => {
    return callCrm<WrapupResponse>('/crm/wrapup', params);
  });

export const getDebtorFn = createServerFn({ method: "POST" })
  .inputValidator((data: { tenant: string; idType: string; nationalId: string }) => data)
  .handler(async ({ data }) => {
    return callCrm<CustomerInfo>('/crm/debtor', {
      Tenant: data.tenant,
      IdType: data.idType,
      NationalId: data.nationalId,
    });
  });

export const executeStoredProcedureFn = createServerFn({ method: "POST" })
  .inputValidator((params: StoredProcedureRequest) => params)
  .handler(async ({ data: params }) => {
    return callCrm<StoredProcedureResponse>('/data', params);
  });

