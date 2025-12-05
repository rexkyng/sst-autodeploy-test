import { createServerFn } from "@tanstack/react-start";
import { useAppSession } from "../utils/session";
import { auth } from "../server/auth";
import {
  Api,
  type SearchRequest,
  type WrapupRequest,
  type StoredProcedureRequest,
  type StoredProcedureResponse,
  type CustomerInfo,
  type CustomerSearchResponse,
  type WrapupResponse,
  type CustomerDetailsResponse,
} from "@openauth/api";

// Helper to get API URL
const getApiUrl = () => {
  return import.meta.env.VITE_API_URL || "http://localhost:3000/api";
};

// Helper to create authenticated API client
async function createAuthenticatedApi() {
  const session = await useAppSession();
  
  // Ensure token is fresh
  await auth(); 
  // Re-read tokens in case auth() refreshed them
  const freshTokens = session.data;
  
  if (!freshTokens?.access) {
    throw new Error("Not authenticated");
  }

  return new Api({
    baseUrl: getApiUrl(),
    securityWorker: () => ({
      headers: { Authorization: `Bearer ${freshTokens.access}` }
    })
  });
}

export const getCustomerFn = createServerFn({ method: "POST" })
  .inputValidator((data: { tenantName: string; idType: string; nationalId: string; forceLatest?: boolean }) => data)
  .handler(async ({ data }): Promise<CustomerDetailsResponse> => {
    const api = await createAuthenticatedApi();
    const response = await api.crm.getCustomerDetailsEndpoint({
      Tenant: data.tenantName,
      IdType: data.idType,
      NationalId: data.nationalId,
      ForceLatest: data.forceLatest ?? false,
    });
    return response.data;
  });

export const searchCustomersFn = createServerFn({ method: "POST" })
  .inputValidator((params: SearchRequest) => params)
  .handler(async ({ data: params }): Promise<CustomerSearchResponse> => {
    const api = await createAuthenticatedApi();
    const response = await api.crm.searchCustomersEndpoint(params);
    return response.data;
  });

export const submitWrapupFn = createServerFn({ method: "POST" })
  .inputValidator((params: WrapupRequest) => params)
  .handler(async ({ data: params }): Promise<WrapupResponse> => {
    const api = await createAuthenticatedApi();
    const response = await api.crm.submitWrapupEndpoint(params);
    return response.data;
  });

export const getDebtorFn = createServerFn({ method: "POST" })
  .inputValidator((data: { tenant: string; idType: string; nationalId: string }) => data)
  .handler(async ({ data }): Promise<CustomerInfo> => {
    const api = await createAuthenticatedApi();
    const response = await api.crm.getDebtorInfoEndpoint({
      Tenant: data.tenant,
      IdType: data.idType,
      NationalId: data.nationalId,
    });
    return response.data;
  });

export const executeStoredProcedureFn = createServerFn({ method: "POST" })
  .inputValidator((params: StoredProcedureRequest) => params)
  .handler(async ({ data: params }): Promise<StoredProcedureResponse> => {
    const api = await createAuthenticatedApi();
    const response = await api.data.executeStoredProcedureEndpoint(params);
    return response.data;
  });
