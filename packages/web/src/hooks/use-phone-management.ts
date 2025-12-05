import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCRMStore } from "../store/crm-store";
import { crmAPI } from "../api/crm-api";
import { getQueryStringObject, queryKeys } from "../lib/query-string";
import type { CustomerPhone as CoreCustomerPhone } from "@openauth/api";

// Web-specific CustomerPhone with optional Id
export type CustomerPhone = Omit<CoreCustomerPhone, "PhoneId"> & {
  Id?: string;
  PhoneId?: string;
};

export function usePhoneManagement() {
  const store = useCRMStore();
  const queryClient = useQueryClient();

  // Get phone numbers query
  const getPhoneNumbers = async () => {
    const querystring = getQueryStringObject();
    const tenantName = querystring.TenantName || "uaf_dc";
    const nationalIdType = querystring.NationalIdType || store.searchedNationalIdType;
    const nationalId = querystring.NationalId || store.searchedNationalId;

    const result = await crmAPI.executeStoredProcedure({
      Provider: tenantName,
      Command: {
        Text: "SP_CustomerPhone_Get_ByNationalId",
        Type: "StoredProcedure",
        Parameters: [
          { value: tenantName },
          { value: nationalIdType },
          { value: nationalId },
        ],
      },
    });

    return result.Result?.Table || [];
  };

  // Get contact amendment history query
  const getContactAmendmentHistory = async () => {
    const querystring = getQueryStringObject();
    const tenantName = querystring.TenantName || "uaf_dc";
    const nationalIdType = querystring.NationalIdType || store.searchedNationalIdType;
    const nationalId = querystring.NationalId || store.searchedNationalId;

    const result = await crmAPI.executeStoredProcedure({
      Provider: tenantName,
      Command: {
        Text: "SP_ContactAmendmentHistory_Get_ByNationalId",
        Type: "StoredProcedure",
        Parameters: [
          { value: tenantName },
          { value: nationalIdType },
          { value: nationalId },
        ],
      },
    });

    return result.Result?.Table || [];
  };

  // TanStack Query hooks
  const phoneNumbersQuery = useQuery({
    queryKey: queryKeys.phoneNumbers(store.selectedCustomerId || ''),
    queryFn: getPhoneNumbers,
    enabled: !!store.selectedCustomerId,
  });

  const contactAmendmentHistoryQuery = useQuery({
    queryKey: queryKeys.contactAmendmentHistory(store.selectedCustomerId || ''),
    queryFn: getContactAmendmentHistory,
    enabled: !!store.selectedCustomerId,
  });
  
  // Helper function to create phone data
  const createPhoneData = (phoneType: number) => {
    const querystring = getQueryStringObject();
    const tenantName = querystring.TenantName || "uaf_dc";
    const customerId = store.selectedCustomerId;
    const accountNumber = store.selectedRole ? store.selectedAccountNo : "";
    const loanSequence = store.selectedRole ? store.selectedAccountLoanSequence : "";
    const role = store.selectedRole;
    const phoneCountryCode = store.addPhoneCountryCode;
    const phoneNumber = store.addPhoneNumberValue;
    const phoneExtension = store.addPhoneExtension;
    const phoneInvalidReason = store.addPhoneInvalidReason;
    const agentId = querystring["Agent.ExternalID"] || querystring["Agent.UserName"];
    const isAdhocSearch = store.isSearch;

    return {
      Provider: tenantName,
      Command: {
        Text: "SP_CustomerPhone_Add",
        Type: "StoredProcedure",
        Parameters: [
          { value: tenantName },
          { value: customerId },
          { value: accountNumber },
          { value: loanSequence },
          { value: role },
          { value: phoneType },
          { value: phoneCountryCode },
          { value: phoneNumber },
          { value: phoneExtension },
          { value: phoneInvalidReason },
          { value: agentId },
          { value: isAdhocSearch },
        ],
      },
    };
  };

  // Add phone mutation with optimistic updates
  const addPhoneMutation = useMutation({
    mutationFn: (phoneType: number) => crmAPI.executeStoredProcedure(createPhoneData(phoneType)),
    onMutate: async (phoneType) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.phoneNumbers(store.selectedCustomerId || '') });
      await queryClient.cancelQueries({ queryKey: queryKeys.contactAmendmentHistory(store.selectedCustomerId || '') });

      // Snapshot previous values
      const previousPhones = queryClient.getQueryData(queryKeys.phoneNumbers(store.selectedCustomerId || ''));
      const previousHistory = queryClient.getQueryData(queryKeys.contactAmendmentHistory(store.selectedCustomerId || ''));

      // Optimistically update phone numbers
      const newPhone = {
        Id: `temp-${Date.now()}`,
        CustomerId: store.selectedCustomerId,
        AccountNumber: store.selectedRole ? store.selectedAccountNo : null,
        LoanSequence: store.selectedRole ? store.selectedAccountLoanSequence : null,
        Role: store.selectedRole,
        PhoneType: phoneType,
        PhoneNumber: store.addPhoneNumberValue,
        PhoneCountryCode: store.addPhoneCountryCode,
        PhoneExtension: store.addPhoneExtension,
        PhoneInvalidReason: store.addPhoneInvalidReason,
      };

      queryClient.setQueryData(
        queryKeys.phoneNumbers(store.selectedCustomerId || ''),
        (old: CustomerPhone[] = []) => [...old, newPhone]
      );

      // Reset phone state optimistically
      store.setPhoneState({
        addPhoneCountryCode: null,
        addPhoneNumberValue: null,
        addPhoneExtension: null,
        addPhoneInvalidReason: null,
      });

      return { previousPhones, previousHistory };
    },
    onError: (_err, _phoneType, context) => {
      // Rollback on error
      if (context?.previousPhones) {
        queryClient.setQueryData(
          queryKeys.phoneNumbers(store.selectedCustomerId || ''),
          context.previousPhones
        );
      }
      if (context?.previousHistory) {
        queryClient.setQueryData(
          queryKeys.contactAmendmentHistory(store.selectedCustomerId || ''),
          context.previousHistory
        );
      }
    },
    onSettled: () => {
      // Always refetch after mutation
      queryClient.invalidateQueries({ queryKey: queryKeys.phoneNumbers(store.selectedCustomerId || '') });
      queryClient.invalidateQueries({ queryKey: queryKeys.contactAmendmentHistory(store.selectedCustomerId || '') });
    },
  });
  
  // Update phone mutation with optimistic updates
  const updatePhoneMutation = useMutation({
    mutationFn: (_phoneType: number) => {
      const querystring = getQueryStringObject();
      const tenantName = querystring.TenantName;
      const customerId = store.selectedCustomerId;
      const phoneId = store.selectedPhoneId;
      const accountNumber = store.selectedRole ? store.selectedAccountNo : null;
      const loanSequence = store.selectedRole ? store.selectedAccountLoanSequence : null;
      const role = store.selectedRole;
      const phoneNumber = store.selectedPhoneNo;
      const phoneCountryCode = store.selectedPhoneCountryCode;
      const phoneExtension = store.selectedPhoneExtension;
      const phoneInvalidReason = store.editPhoneInvalidReason;
      const agentId = querystring["Agent.ExternalID"] || querystring["Agent.UserName"];
      const isAdhocSearch = store.isSearch;

      return crmAPI.executeStoredProcedure({
        Provider: tenantName,
        Command: {
          Text: "SP_CustomerPhone_InvalidReason_Update_ById",
          Type: "StoredProcedure",
          Parameters: [
            { value: tenantName },
            { value: customerId },
            { value: accountNumber },
            { value: loanSequence },
            { value: role },
            { value: _phoneType },
            { value: phoneCountryCode },
            { value: phoneNumber },
            { value: phoneExtension },
            { value: phoneInvalidReason },
            { value: agentId },
            { value: isAdhocSearch },
            { value: phoneId },
          ],
        },
      });
    },
    onMutate: async (_phoneType) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.phoneNumbers(store.selectedCustomerId || '') });
      await queryClient.cancelQueries({ queryKey: queryKeys.contactAmendmentHistory(store.selectedCustomerId || '') });

      // Snapshot previous values
      const previousPhones = queryClient.getQueryData(queryKeys.phoneNumbers(store.selectedCustomerId || ''));
      const previousHistory = queryClient.getQueryData(queryKeys.contactAmendmentHistory(store.selectedCustomerId || ''));

      // Optimistically update phone numbers
      queryClient.setQueryData(
        queryKeys.phoneNumbers(store.selectedCustomerId || ''),
        (old: CustomerPhone[] = []) =>
          old.map(phone =>
            phone.Id === store.selectedPhoneId
              ? { ...phone, PhoneInvalidReason: store.editPhoneInvalidReason }
              : phone
          )
      );

      // Reset phone state optimistically
      store.setPhoneState({ editPhoneInvalidReason: null });

      return { previousPhones, previousHistory };
    },
    onError: (_err, _phoneType, context) => {
      // Rollback on error
      if (context?.previousPhones) {
        queryClient.setQueryData(
          queryKeys.phoneNumbers(store.selectedCustomerId || ''),
          context.previousPhones
        );
      }
      if (context?.previousHistory) {
        queryClient.setQueryData(
          queryKeys.contactAmendmentHistory(store.selectedCustomerId || ''),
          context.previousHistory
        );
      }
    },
    onSettled: () => {
      // Always refetch after mutation
      queryClient.invalidateQueries({ queryKey: queryKeys.phoneNumbers(store.selectedCustomerId || '') });
      queryClient.invalidateQueries({ queryKey: queryKeys.contactAmendmentHistory(store.selectedCustomerId || '') });
    },
  });
  
  // Delete phone mutation with optimistic updates
  const deletePhoneMutation = useMutation({
    mutationFn: () => {
      const querystring = getQueryStringObject();
      const tenantName = querystring.TenantName;
      const phoneId = store.selectedPhoneId;
      const agentId = querystring["Agent.ExternalID"] || querystring["Agent.UserName"];
      const isAdhocSearch = store.isSearch;

      return crmAPI.executeStoredProcedure({
        Provider: tenantName,
        Command: {
          Text: "SP_CustomerPhone_Delete_ById",
          Type: "StoredProcedure",
          Parameters: [
            { value: phoneId },
            { value: agentId },
            { value: isAdhocSearch },
          ],
        },
      });
    },
    onMutate: async () => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.phoneNumbers(store.selectedCustomerId || '') });
      await queryClient.cancelQueries({ queryKey: queryKeys.contactAmendmentHistory(store.selectedCustomerId || '') });

      // Snapshot previous values
      const previousPhones = queryClient.getQueryData(queryKeys.phoneNumbers(store.selectedCustomerId || ''));
      const previousHistory = queryClient.getQueryData(queryKeys.contactAmendmentHistory(store.selectedCustomerId || ''));

      // Optimistically remove phone
      queryClient.setQueryData(
        queryKeys.phoneNumbers(store.selectedCustomerId || ''),
        (old: CustomerPhone[] = []) =>
          old.filter(phone => phone.Id !== store.selectedPhoneId)
      );

      // Reset phone state optimistically
      store.setPhoneState({
        editPhoneInvalidReason: null,
        selectedPhoneId: null,
        selectedPhoneNo: null,
        selectedPhoneType: null,
        selectedPhoneCountryCode: null,
        selectedPhoneExtension: null,
      });

      return { previousPhones, previousHistory };
    },
    onError: (_err, _variables, context) => {
      // Rollback on error
      if (context?.previousPhones) {
        queryClient.setQueryData(
          queryKeys.phoneNumbers(store.selectedCustomerId || ''),
          context.previousPhones
        );
      }
      if (context?.previousHistory) {
        queryClient.setQueryData(
          queryKeys.contactAmendmentHistory(store.selectedCustomerId || ''),
          context.previousHistory
        );
      }
    },
    onSettled: () => {
      // Always refetch after mutation
      queryClient.invalidateQueries({ queryKey: queryKeys.phoneNumbers(store.selectedCustomerId || '') });
      queryClient.invalidateQueries({ queryKey: queryKeys.contactAmendmentHistory(store.selectedCustomerId || '') });
    },
  });
  
  return {
    // Query hooks
    phoneNumbersQuery,
    contactAmendmentHistoryQuery,

    // Mutation hooks with optimistic updates
    addPhoneMutation,
    updatePhoneMutation,
    deletePhoneMutation,

    // Legacy loading state for backward compatibility
    loading: addPhoneMutation.isPending || updatePhoneMutation.isPending || deletePhoneMutation.isPending,

    // Helper functions
    addPhoneNumber: (phoneType: number) => addPhoneMutation.mutate(phoneType),
    updatePhoneNumber: (phoneType: number) => updatePhoneMutation.mutate(phoneType),
    deletePhoneNumber: () => deletePhoneMutation.mutate(),
  };
}

