// CRM API functions using Server Functions
// Ported from Refine data provider

import type {
  DebtorRequest,
  SearchRequest,
  CustomerRequest,
  WrapupRequest,
  StoredProcedureRequest,
  StoredProcedureResponse,
  CustomerDetails,
  CustomerInfo,
  CustomerSearchResponse,
  WrapupResponse,
  CustomerDetailsResponse,
} from "@openauth/core/models";
import {
  getCustomerFn,
  searchCustomersFn,
  submitWrapupFn,
  getDebtorFn,
  executeStoredProcedureFn
} from "./crm-server-fns";

export const crmAPI = {
  // Get customer data
  getCustomer: async (
    tenantName: string,
    idType: string,
    nationalId: string,
    forceLatest = false
  ): Promise<CustomerDetailsResponse> => {
    return await getCustomerFn({
      data: {
        tenantName,
        idType,
        nationalId,
        forceLatest,
      },
    });
  },
  
  // Search customers
  searchCustomers: async (params: SearchRequest): Promise<CustomerSearchResponse> => {
    return await searchCustomersFn({ data: params });
  },
  
  // Submit wrapup
  submitWrapup: async (params: WrapupRequest): Promise<WrapupResponse> => {
    return await submitWrapupFn({ data: params });
  },
  
  // Get debtor info
  getDebtor: async (tenant: string, idType: string, nationalId: string): Promise<CustomerInfo> => {
    return await getDebtorFn({
      data: {
        tenant,
        idType,
        nationalId,
      },
    });
  },
  
  // Execute stored procedure
  executeStoredProcedure: async (params: StoredProcedureRequest): Promise<StoredProcedureResponse> => {
    return await executeStoredProcedureFn({ data: params });
  },
};
